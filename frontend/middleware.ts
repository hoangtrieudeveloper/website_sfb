import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ['vi', 'en', 'ja'] as const;
const DEFAULT_LOCALE = 'vi';
type Locale = typeof LOCALES[number];

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

    return NextResponse.next();
  }

  // Skip API routes, static files, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in path, detect and redirect
  if (!pathnameHasLocale) {
    const locale = getLocale(req);
    const newUrl = req.nextUrl.clone();
    newUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(newUrl);
  }

  // Add locale to headers for use in pages
  const locale = pathname.split('/')[1] as Locale;
  if (LOCALES.includes(locale)) {
    const response = NextResponse.next();
    response.headers.set('x-locale', locale);
    // Set locale cookie
    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

function getLocale(request: NextRequest): Locale {
  // 1. Check cookie
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    if (acceptLanguage.includes('ja')) return 'ja';
    if (acceptLanguage.includes('en')) return 'en';
    if (acceptLanguage.includes('vi')) return 'vi';
  }

  // 3. Default
  return DEFAULT_LOCALE;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)',
  ],
};


