import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Root layout metadata - sẽ được merge với metadata từ child pages
// Metadata từ generateMetadata() sẽ được Next.js tự động inject vào <head>
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn'),
  title: {
    default: "SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam",
    template: "%s | SFB Technology",
  },
  description:
    "SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      {/* Next.js sẽ tự động tạo <head> và inject metadata vào đó */}
      <body
        className={`${plusJakarta.className} min-h-screen bg-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
