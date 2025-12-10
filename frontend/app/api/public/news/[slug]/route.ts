import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_SFB_URL ||
  process.env.NEXT_PUBLIC_API_SFB_URL ||
  "http://localhost:4000";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;

    const url = `${API_BASE_URL}/api/public/news/${slug}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 60 seconds
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { success: false, message: "Không tìm thấy bài viết" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Không thể tải bài viết" },
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
    console.error("Error fetching news detail:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}

