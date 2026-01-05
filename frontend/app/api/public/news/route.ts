import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/base";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (featured) params.append("featured", featured);

    const url = `${API_BASE_URL}/api/public/news${params.toString() ? `?${params.toString()}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 30 seconds
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Không thể tải danh sách bài viết" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error: any) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}

