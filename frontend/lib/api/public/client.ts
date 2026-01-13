/**
 * Public API Client
 * Handles unauthenticated API calls for public section
 * No authentication required, suitable for public-facing features
 */

import { buildUrl, parseErrorResponse } from "../base";

/**
 * Make an unauthenticated API call for public section
 * No JWT token required
 * @param endpoint - API endpoint
 * @param options - Fetch options
 * @param locale - Optional locale (vi/en/ja) to pass as query parameter (?locale=vi)
 */
export async function publicApiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  locale?: 'vi' | 'en' | 'ja'
): Promise<T> {
  try {
    let url = buildUrl(endpoint);
    
    // Add locale as query parameter instead of header (avoids cache issues)
    if (locale) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}locale=${locale}`;
    }
    
    // Build headers object properly
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Merge existing headers from options
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: any) {
    // Improve error message for connection errors
    if (error?.message === 'Failed to fetch' || error?.code === 'ECONNREFUSED') {
      throw new Error(
        `Không thể kết nối đến backend server. Vui lòng kiểm tra:\n` +
        `- Backend server đang chạy tại ${buildUrl(endpoint)}\n` +
        `- Kiểm tra biến môi trường NEXT_PUBLIC_API_SFB_URL\n` +
        `- Đảm bảo backend đang lắng nghe trên port đúng`
      );
    }
    throw error;
  }
}

