import { api } from './apiClient';

// Both functions now hit the backend, which scopes to the caller's own
// facility server-side -- no facility argument needs to be passed in from
// the frontend anymore, since it's derived from the authenticated user.

export async function getFacilitySettings() {
  return api.get('/facility-settings');
}

export async function saveFacilitySettings(settings) {
  return api.put('/facility-settings', settings);
}
