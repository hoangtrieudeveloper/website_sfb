"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect (dùng useEffect để không add listener mỗi lần render)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActivePath = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg py-3"
          : "bg-white/80 backdrop-blur-sm py-5"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo mới dùng logo chính thức */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Khung logo */}
              <div
                className="
      flex items-center gap-3 
      px-3 md:px-4 py-2 md:py-2.5 
      rounded-2xl 
      bg-white/90 backdrop-blur-xl
      border border-slate-200 shadow-sm 
      group-hover:border-[#006FB3]/60 
      transition-all duration-300
    "
              >
                {/* Logo Image */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden">
                  <img
                    src="https://sfb.vn/wp-content/uploads/2020/04/logo-2.png"
                    alt="SFB"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col leading-tight select-none">
                  <span className="text-[13px] md:text-sm font-semibold text-slate-900">
                    SFB
                  </span>
                  <span className="text-[10px] md:text-xs text-[#006FB3] font-medium tracking-wide">
                    Smart Solutions for Business
                  </span>
                </div>
              </div>

              {/* Hiệu ứng glow khi hover */}
              <div
                className="
      absolute -inset-1 rounded-3xl 
      bg-gradient-to-r from-[#006FB3]/0 via-[#0088D9]/30 to-[#006FB3]/0 
      opacity-0 group-hover:opacity-100 
      blur-xl transition-all duration-500 pointer-events-none
    "
              />
            </div>
          </Link>

          {/* Desktop Navigation + Contact */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className={`px-5 py-2.5 transition-all relative group rounded-lg ${
                  isActivePath("/")
                    ? "text-[#006FB3] bg-[#E6F4FF]"
                    : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
                }`}
              >
                Trang chủ
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] transition-all ${
                    isActivePath("/")
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
              </Link>
              <Link
                href="/about"
                className={`px-5 py-2.5 transition-all relative group rounded-lg ${
                  isActivePath("/about")
                    ? "text-[#006FB3] bg-[#E6F4FF]"
                    : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
                }`}
              >
                Giới thiệu
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] transition-all ${
                    isActivePath("/about")
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
              </Link>
              <Link
                href="/products"
                className={`px-5 py-2.5 transition-all relative group rounded-lg ${
                  isActivePath("/products")
                    ? "text-[#006FB3] bg-[#E6F4FF]"
                    : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
                }`}
              >
                Sản phẩm
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] transition-all ${
                    isActivePath("/products")
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
              </Link>
              <Link
                href="/solutions"
                className={`px-5 py-2.5 transition-all relative group rounded-lg ${
                  isActivePath("/solutions")
                    ? "text-[#006FB3] bg-[#E6F4FF]"
                    : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
                }`}
              >
                Giải pháp
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] transition-all ${
                    isActivePath("/solutions")
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
              </Link>
              <Link
                href="/industries"
                className={`px-5 py-2.5 transition-all relative group rounded-lg ${
                  isActivePath("/industries")
                    ? "text-[#006FB3] bg-[#E6F4FF]"
                    : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
                }`}
              >
                Lĩnh vực
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] transition-all ${
                    isActivePath("/industries")
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
              </Link>
              <Link
                href="/news"
                className={`px-5 py-2.5 transition-all relative group rounded-lg ${
                  isActivePath("/news")
                    ? "text-[#006FB3] bg-[#E6F4FF]"
                    : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
                }`}
              >
                Tin tức
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] transition-all ${
                    isActivePath("/news")
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
              </Link>
              <Link
                href="/careers"
                className={`px-5 py-2.5 transition-all relative group rounded-lg ${
                  isActivePath("/careers")
                    ? "text-[#006FB3] bg-[#E6F4FF]"
                    : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
                }`}
              >
                Tuyển dụng
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] transition-all ${
                    isActivePath("/careers")
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
              </Link>
            </nav>

            {/* Divider */}
            <div className="w-px h-9 bg-gray-200" />

            {/* Contact info + CTA */}
            <div className="flex items-center gap-4">
              <div className="hidden xl:flex flex-col items-end text-[11px] leading-tight">
                <a
                  href="mailto:info@sfb.vn"
                  className="text-gray-600 hover:text-[#006FB3] font-medium"
                >
                  info@sfb.vn
                </a>
                <a
                  href="tel:0888917999"
                  className="text-[#006FB3] font-semibold"
                >
                  0888 917 999
                </a>
              </div>
              <Link
                href="/contact"
                className="ml-2 px-8 py-3 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl hover:shadow-xl hover:shadow-[#006FB3]/50 transition-all transform hover:scale-105 hover:-translate-y-0.5"
              >
                Liên hệ ngay
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-12 h-12 flex items-center justify-center text-gray-800 hover:text-[#006FB3] transition-colors rounded-lg hover:bg-[#E6F4FF]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-6 pb-6 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-gray-100 pt-6">
            <Link
              href="/"
              className={`transition-all py-3 px-4 rounded-lg ${
                isActivePath("/")
                  ? "text-[#006FB3] bg-[#E6F4FF]"
                  : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/about"
              className={`transition-all py-3 px-4 rounded-lg ${
                isActivePath("/about")
                  ? "text-[#006FB3] bg-[#E6F4FF]"
                  : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              href="/products"
              className={`transition-all py-3 px-4 rounded-lg ${
                isActivePath("/products")
                  ? "text-[#006FB3] bg-[#E6F4FF]"
                  : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <Link
              href="/solutions"
              className={`transition-all py-3 px-4 rounded-lg ${
                isActivePath("/solutions")
                  ? "text-[#006FB3] bg-[#E6F4FF]"
                  : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Giải pháp
            </Link>
            <Link
              href="/industries"
              className={`transition-all py-3 px-4 rounded-lg ${
                isActivePath("/industries")
                  ? "text-[#006FB3] bg-[#E6F4FF]"
                  : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Lĩnh vực
            </Link>
            <Link
              href="/news"
              className={`transition-all py-3 px-4 rounded-lg ${
                isActivePath("/news")
                  ? "text-[#006FB3] bg-[#E6F4FF]"
                  : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tin tức
            </Link>
            <Link
              href="/careers"
              className={`transition-all py-3 px-4 rounded-lg ${
                isActivePath("/careers")
                  ? "text-[#006FB3] bg-[#E6F4FF]"
                  : "text-gray-700 hover:text-[#006FB3] hover:bg-[#E6F4FF]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tuyển dụng
            </Link>
            <Link
              href="/contact"
              className="mt-2 px-6 py-3 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl text-center hover:shadow-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Liên hệ ngay
            </Link>

            {/* Contact info mobile */}
            <div className="mt-4 text-xs text-gray-500">
              <div>
                Email:&nbsp;
                <a
                  href="mailto:info@sfb.vn"
                  className="text-[#006FB3] font-medium"
                >
                  info@sfb.vn
                </a>
              </div>
              <div className="mt-1">
                Điện thoại:&nbsp;
                <a
                  href="tel:0888917999"
                  className="text-[#006FB3] font-semibold"
                >
                  0888 917 999
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}