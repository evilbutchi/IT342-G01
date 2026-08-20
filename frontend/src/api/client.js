
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const REQUEST_TIMEOUT_MS = 10000;


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
    throw new ApiError(
      'Could not reach the backend. Confirm the Spring Boot app is running on the configured port.',
      { status: 0 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
  const rawText = await response.text();
  let data = rawText;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
  }

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Request failed.';
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}
