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
 * @param locale - Optional locale (vi/en/ja) to pass in Accept-Language header
 */
export async function publicApiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  locale?: 'vi' | 'en' | 'ja'
): Promise<T> {
  try {
    const url = buildUrl(endpoint);
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // Add Accept-Language header if locale is provided
    if (locale) {
      headers['Accept-Language'] = locale;
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

