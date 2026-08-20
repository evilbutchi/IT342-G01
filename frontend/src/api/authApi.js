import { apiRequest, ApiError } from './client';

/**
 * POST /api/register
 * Body: { username, email, password }
 * Success: 201 Created -> saved User (id, username, email, password)
 * Failure: 400 Bad Request -> plain-text reason ("Username already taken", "Email already registered")
 */
export async function registerUser({ username, email, password }) {
  return apiRequest('/register', { method: 'POST', body: { username, email, password } });
}

/**
 * POST /api/login
 * Body: { username, password }
 * Success: 200 OK -> User (id, username, email, password)
 * Failure: 401 Unauthorized -> plain-text reason ("Invalid username or password")
 */
export async function loginUser({ username, password }) {
  return apiRequest('/login', { method: 'POST', body: { username, password } });
}

export function extractErrorMessage(error, fallback) {
  if (error instanceof ApiError && error.message) return error.message;
  return fallback;
}
