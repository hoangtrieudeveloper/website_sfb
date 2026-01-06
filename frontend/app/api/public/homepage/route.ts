import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/base";

export async function GET(request: Request) {
  try {
    const url = `${API_BASE_URL}/api/public/homepage`;
    
    // Log the URL being used (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Homepage API] Fetching from: ${url}`);
    }

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      // Cache for 60 seconds
      next: { revalidate: 60 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Không thể tải dữ liệu trang chủ" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    console.error("Error fetching homepage:", error);
    console.error(`[Homepage API] Attempted URL: ${API_BASE_URL}/api/public/homepage`);
    console.error(`[Homepage API] Error details:`, {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      cause: error?.cause
    });
    
    // Check if it's a connection error or timeout
    const isConnectionError = 
      error?.message?.includes('fetch failed') || 
      error?.code === 'ECONNREFUSED' ||
      error?.name === 'AbortError' ||
      error?.cause?.code === 'ECONNREFUSED' ||
      (error?.cause instanceof AggregateError && error.cause.errors?.some((e: any) => e.code === 'ECONNREFUSED'));
    
    if (isConnectionError) {
      const errorMessage = `Không thể kết nối đến backend server tại ${API_BASE_URL}.\n\n` +
        `Vui lòng kiểm tra:\n` +
        `1. Backend server đang chạy (mặc định port 4000)\n` +
        `2. Chạy: cd backend && npm run dev\n` +
        `3. Kiểm tra biến môi trường:\n` +
        `   - API_SFB_URL hoặc NEXT_PUBLIC_API_SFB_URL\n` +
        `   - Hoặc đảm bảo backend chạy trên port 4000`;
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage,
          error: "ECONNREFUSED",
          backendUrl: API_BASE_URL,
          hint: "Backend server có thể không đang chạy hoặc đang chạy trên port khác"
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống", error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

