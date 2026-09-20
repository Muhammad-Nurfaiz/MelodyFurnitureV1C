// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}