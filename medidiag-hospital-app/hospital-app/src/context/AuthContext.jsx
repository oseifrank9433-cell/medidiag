import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../utils/apiClient';

const AuthContext = createContext(null);

// The backend returns Python/snake_case field names; the rest of this
// frontend was written expecting camelCase (accountType, createdAt,
// lastLoginAt). Normalizing once, here, means no other file -- Sidebar,
// Profile, AdminRoute, ProtectedRoute -- needs to know or care that the
// data now comes from a real API instead of localStorage.
function normalizeUser(u) {
  if (!u) return u;
  return {
    ...u,
    accountType: u.account_type,
    createdAt: u.created_at,
    lastLoginAt: u.last_login_at,
  };
}

export function AuthProvider({ children }) {
  const [clinician, setClinician] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const user = await api.get('/auth/me');
        setClinician(normalizeUser(user));
      } catch {
        setToken(null); // stale/expired token
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  async function signup({ name, facility, role, accountType, email, password, adminPin }) {
    const data = await api.post(
      '/auth/signup',
      {
        name,
        email,
        password,
        facility,
        role,
        account_type: accountType || 'clinician',
        admin_pin: adminPin,
      },
      { auth: false },
    );
    setToken(data.access_token);
    const user = normalizeUser(data.user);
    setClinician(user);
    return user;
  }
  async function login({ email, password }) {
    const data = await api.post('/auth/login', { email, password }, { auth: false });
    setToken(data.access_token);
    const user = normalizeUser(data.user);
    setClinician(user);
    return user;
  }

  function logout() {
    setToken(null);
    setClinician(null);
  }

  async function updateProfile(updates) {
    const payload = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.facility !== undefined) payload.facility = updates.facility;
    if (updates.role !== undefined) payload.role = updates.role;
    if (updates.password) payload.password = updates.password;

    const data = await api.put('/auth/me', payload);
    const updated = normalizeUser(data);
    setClinician(updated);
    return updated;
  }

  return (
    <AuthContext.Provider value={{ clinician, loading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// --- Admin-only facility user management ---
// These call the backend directly; the server enforces that the caller is
// an admin and scopes every result to the caller's own facility, so no
// facility argument needs to be passed from the frontend anymore.

export async function fetchFacilityUsers() {
  const users = await api.get('/admin/users');
  return users.map(normalizeUser);
}

export async function createClinicianAccount({ name, email, password, role }) {
  return api.post('/admin/users', { name, email, password, role });
}

export async function updateUserRole(userId, role) {
  return api.patch(`/admin/users/${userId}/role`, { role });
}

export async function setUserActive(userId, active) {
  return api.patch(`/admin/users/${userId}/active`, { active });
}

export async function deleteUserAccount(userId) {
  return api.delete(`/admin/users/${userId}`);
}
