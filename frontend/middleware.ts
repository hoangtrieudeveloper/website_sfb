import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bảo vệ tất cả route /admin (trừ /admin/login)
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("cms_sfb_token")?.value;
    
    // Nếu chưa có token và không phải trang login -> redirect về /admin/login
    if (!token && !pathname.startsWith("/admin/login")) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }

    // Nếu đã có token mà truy cập /admin/login -> redirect về /admin
    if (token && pathname.startsWith("/admin/login")) {
      const adminUrl = req.nextUrl.clone();
      adminUrl.pathname = "/admin";
      adminUrl.search = "";
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


