/**
 * Admin API Client
 * Handles authenticated API calls for admin section
 */

import { getAuthToken, removeAuthToken } from "@/lib/auth/token";
import { buildUrl, parseErrorResponse } from "../base";

/**
 * Get headers with Authorization bearer token for admin APIs
 */
function getAdminHeaders(additionalHeaders?: Record<string, string>): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Make an authenticated API call for admin section
 * Automatically handles 401 Unauthorized by redirecting to login
 */
export async function adminApiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildUrl(endpoint);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAdminHeaders(),
      ...(options.headers || {}),
    },
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    removeAuthToken();
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    throw new Error(errorMessage);
  }

  return response.json();
}

