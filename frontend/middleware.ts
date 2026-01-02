import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bảo vệ tất cả route /admin (trừ /admin/login)
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("cms_sfb_token")?.value;
    
    // Debug: Log cookie để kiểm tra (chỉ trong development)
    if (process.env.NODE_ENV !== "production") {
      const allCookies = req.cookies.getAll();
      console.log("[Middleware] Path:", pathname);
      console.log("[Middleware] Token exists:", !!token);
      console.log("[Middleware] All cookies:", allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
      console.log("[Middleware] Request URL:", req.url);
    }

    // Nếu chưa có token và không phải trang login -> redirect về /admin/login
    if (!token && !pathname.startsWith("/admin/login")) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Middleware] No token found, redirecting to /admin/login");
      }
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }

    // Nếu đã có token mà truy cập /admin/login -> redirect về /admin
    if (token && pathname.startsWith("/admin/login")) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Middleware] Token found, redirecting to /admin");
      }
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


