import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam",
  description:
    "SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
