/**
 * Public API Client
 * Handles unauthenticated API calls for public section
 * No authentication required, suitable for public-facing features
 */

import { baseFetch } from "../base";

/**
 * Make an unauthenticated API call for public section
 * No JWT token required
 */
export async function publicApiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  return baseFetch<T>(endpoint, {
    ...options,
    headers,
  });
}

