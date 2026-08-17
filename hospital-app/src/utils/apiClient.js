const API_BASE_URL = 'http://localhost:8000';
const TOKEN_KEY = 'medidiag_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * Central fetch wrapper. Attaches the bearer token automatically, parses
 * JSON, and throws a normal Error with the backend's message on failure so
 * every caller can just try/catch and show err.message.
 */
async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const errBody = await res.json();
      detail = errBody.detail || detail;
    } catch {
      // response wasn't JSON; keep the generic message
    }
    if (res.status === 401) {
      // Token missing/expired/invalid -- clear it so the app treats the user as logged out.
      setToken(null);
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
