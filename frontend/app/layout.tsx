import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { API_BASE_URL } from "@/lib/api/base";
import ScrollToTop from "@/components/common/ScrollToTop";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Fetch favicon from settings dynamically (server-side only)
async function getFavicon(): Promise<string | undefined> {
  try {
    // Fetch directly from backend API in server-side
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    const res = await fetch(`${API_BASE_URL}/api/public/settings?keys=favicon`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return undefined;
    }

    const data = await res.json();
    const favicon = data.data?.favicon;

    // Return favicon URL if it exists and is not empty
    if (favicon && favicon.trim()) {
      return favicon;
    }
  } catch (error) {
    // Silently fail - will use default favicon
  }
  return undefined;
}

// Fetch Google Site Verification code from settings dynamically (server-side only)
async function getGoogleSiteVerification(): Promise<string | undefined> {
  try {
    // Fetch directly from backend API in server-side
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    const res = await fetch(`${API_BASE_URL}/api/public/settings?keys=google_site_verification`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return undefined;
    }

    const data = await res.json();
    const verificationCode = data.data?.google_site_verification;

    // Return verification code if it exists and is not empty
    if (verificationCode && verificationCode.trim()) {
      return verificationCode.trim();
    }
  } catch (error) {
    // Silently fail - will use fallback
  }
  return undefined;
}

// Generate metadata dynamically to include favicon from settings
export async function generateMetadata(): Promise<Metadata> {
  const [favicon, googleVerification] = await Promise.all([
    getFavicon(),
    getGoogleSiteVerification(),
  ]);

  // Fallback order: settings -> env variable -> hardcoded default
  const verificationCode = googleVerification
    || process.env.GOOGLE_SITE_VERIFICATION
    || 'nskAzb2wgDby-HUyaAmxjuyMNgkQ1Z-GSbTs-Tx1RJw';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam",
      template: "%s | SFB Technology",
    },
    description:
      "SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến",
    icons: favicon ? {
      icon: [
        { url: favicon, sizes: 'any' },
        { url: favicon, type: 'image/x-icon' },
      ],
      shortcut: favicon,
      apple: favicon,
    } : undefined,
    // Google Site Verification - ưu tiên từ settings, fallback về env hoặc default
    verification: {
      google: verificationCode,
    },
    // Preconnect for better performance
    other: {
      'preconnect-google-fonts': 'https://fonts.googleapis.com',
      'preconnect-google-fonts-gstatic': 'https://fonts.gstatic.com',
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      {/* Next.js sẽ tự động tạo <head> và inject metadata vào đó */}
      <body
        className={`${plusJakarta.className} min-h-screen bg-white antialiased`}
      >
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
