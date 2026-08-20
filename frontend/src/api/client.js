// Base URL of the Spring Boot backend (Activity01, package edu.cit.berou.activity01).
// Override with a .env file (VITE_API_BASE_URL=http://localhost:8080/api) if the
// backend runs on a different host/port.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Thin wrapper around fetch() for JSON APIs.
 *
 * Unlike Axios, fetch() does NOT reject on HTTP error statuses (400, 401, etc.) —
 * it only rejects on network failure. So this helper checks response.ok itself
 * and throws an ApiError carrying the status and parsed body, which lets the
 * calling code branch on error the same way it would with Axios.
 */
export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('The request timed out. Is the backend running?', { status: 0 });
    }
    // fetch() throws a generic TypeError for network failures (backend down, CORS, DNS, etc.)
    throw new ApiError(
      'Could not reach the backend. Confirm the Spring Boot app is running on the configured port.',
      { status: 0 }
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // The backend returns error bodies as plain text, not JSON, so read as
  // text first and only parse as JSON when that succeeds.
  const rawText = await response.text();
  let data = rawText;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    // Not JSON — keep the raw text (this is the normal case for error responses).
  }

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Request failed.';
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}
