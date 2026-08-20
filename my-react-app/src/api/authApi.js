import { apiRequest, ApiError } from './client';


export async function registerUser({ username, email, password }) {
  return apiRequest('/register', { method: 'POST', body: { username, email, password } });
}


export async function loginUser({ username, password }) {
  return apiRequest('/login', { method: 'POST', body: { username, password } });
}


export function extractErrorMessage(error, fallback) {
  if (error instanceof ApiError && error.message) return error.message;
  return fallback;
}
