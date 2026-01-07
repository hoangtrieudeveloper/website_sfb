/**
 * Base API utilities
 * Common functions for both admin and public API calls
 */

const API_BASE_URL =
  process.env.API_SFB_URL ||
  process.env.NEXT_PUBLIC_API_SFB_URL ||
  "http://localhost:4000";

export { API_BASE_URL };

/**
 * Build full URL from endpoint
 */
export function buildUrl(endpoint: string): string {
  if (endpoint.startsWith("http")) return endpoint;

  // In the browser, proxy public API requests through Next.js API routes.
  // This avoids depending on the backend being directly reachable from the client
  // (CORS/host resolution/misconfigured NEXT_PUBLIC_API_SFB_URL).
  if (typeof window !== "undefined") {
    // Proxy these endpoints through Next.js API routes
    if (
      endpoint === "/api/public/news" || 
      endpoint.startsWith("/api/public/news/") ||
      endpoint === "/api/public/homepage" ||
      endpoint.startsWith("/api/public/homepage/") ||
      endpoint === "/api/public/menus" ||
      endpoint.startsWith("/api/public/menus/")
    ) {
      return endpoint;
    }
  }

  return `${API_BASE_URL}${endpoint}`;
}

/**
 * Parse error response
 */
export async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const errorData = await response.json();
    return errorData?.message || errorData?.error || response.statusText;
  } catch {
    return response.statusText || "Unknown error";
  }
}

/**
 * Base fetch wrapper with common error handling
 */
export async function baseFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildUrl(endpoint);
  
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    throw new Error(errorMessage);
  }

  return response.json();
}

