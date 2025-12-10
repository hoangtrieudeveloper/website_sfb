"use client";

import { Menu, X, Search, Globe, ChevronDown, Facebook, Linkedin, Mail, Phone } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SearchOverlay } from "./SearchOverlay";
import { AnnouncementBar } from "./AnnouncementBar";

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string; description?: string }[];
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoverLang, setHoverLang] = useState(false);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();
  const headerRef = useRef<HTMLElement>(null);

  // Detect if we're on homepage (dark background) vs other pages (light background)
  const isHomePage = pathname === '/';
  // Use dark theme when: on homepage AND not scrolled
  const useDarkTheme = isHomePage && !scrolled;

  // Language options with flags
  const languages = [
    { code: "vi" as const, native_name: "Tiếng Việt", img_icon_url: "/icons/flags/vi.svg" },
    { code: "en" as const, native_name: "English", img_icon_url: "/icons/flags/en.svg" },
  ];

  const currentLanguageObj = languages.find(lang => lang.code === language);
  const borderColor = useDarkTheme ? "border-white/30" : "border-gray-300";

  const navLinks: NavLink[] = [
    { href: "/", label: language === "vi" ? "Trang chủ" : "Home" },
    { href: "/about", label: language === "vi" ? "Giới thiệu" : "About" },
    {
      href: "/products",
      label: language === "vi" ? "Sản phẩm" : "Products",
      children: [
        { href: "/products/erp", label: "Hệ thống ERP", description: "Quản lý doanh nghiệp toàn diện" },
        { href: "/products/education", label: "Giáo dục thông minh", description: "Giải pháp cho nhà trường" },
        { href: "/products/library", label: "Thư viện số", description: "Quản lý thư viện hiện đại" },
        { href: "/products/eoffice", label: "Văn phòng điện tử", description: "Số hóa quy trình văn bản" },
      ],
    },
    {
      href: "/solutions",
      label: language === "vi" ? "Giải pháp" : "Solutions",
      children: [
        { href: "/solutions/digital-transformation", label: "Chuyển đổi số", description: "Hiện đại hóa doanh nghiệp" },
        { href: "/solutions/cloud", label: "Giải pháp Cloud", description: "Hạ tầng đám mây" },
        { href: "/solutions/big-data", label: "Big Data & AI", description: "Phân tích dữ liệu thông minh" },
        { href: "/solutions/security", label: "An ninh mạng", description: "Bảo mật toàn diện" },
      ],
    },
    { href: "/industries", label: language === "vi" ? "Lĩnh vực" : "Industries" },
    { href: "/news", label: language === "vi" ? "Tin tức" : "News" },
    { href: "/careers", label: language === "vi" ? "Tuyển dụng" : "Careers" },
  ];

  // Debounced scroll handler for performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Update scroll state
    setScrolled(currentScrollY > 20);

    // Update scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setScrollDirection("down");
    } else {
      setScrollDirection("up");
    }

    // Update scroll progress
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (currentScrollY / windowHeight) * 100;
    setScrollProgress(Math.min(progress, 100));

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    handleScroll();
    window.addEventListener("scroll", debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Load language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "vi" | "en" | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActivePath = (path: string) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleDropdownEnter = (href: string) => {
    clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(href);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const shouldHideHeader = scrollDirection === "down" && scrolled && !mobileMenuOpen;

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200/30 z-[60]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#006FB3] via-cyan-500 to-[#006FB3]"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Announcement Bar - positioned at very top */}
      <div className="fixed top-0 left-0 right-0 z-[51]">
        <AnnouncementBar />
      </div>

      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-4 top-0"
          : "bg-transparent py-8 top-12"
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative z-50">
              <div className="relative">
                <div
                  className={`
                    flex items-center justify-center
                    ${isHomePage ? "w-16 h-16" : "w-12 h-12 md:w-14 md:h-14"}
                    transition-all duration-300
                    group-hover:scale-105
                  `}
                >
                  <img
                    src="https://sfb.vn/wp-content/uploads/2020/04/logo-2.png"
                    alt="SFB Technology"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#006FB3]/0 via-[#0088D9]/30 to-[#006FB3]/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none animate-pulse" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-lg">
                {navLinks.map((link) => (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => link.children && handleDropdownEnter(link.href)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={`px-4 py-2.5 transition-all relative group rounded-xl text-sm font-semibold flex items-center gap-1.5 ${isActivePath(link.href)
                        ? "text-white bg-gradient-to-r from-[#006FB3] to-[#0088D9] shadow-md"
                        : "text-gray-700 hover:text-[#006FB3] hover:bg-gray-50"
                        }`}
                      aria-label={link.label}
                      aria-haspopup={link.children ? "true" : undefined}
                      aria-expanded={link.children && activeDropdown === link.href ? "true" : "false"}
                    >
                      {link.label}
                      {link.children && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${activeDropdown === link.href ? "rotate-180" : ""
                            }`}
                        />
                      )}
                      {isActivePath(link.href) && (
                        <motion.span
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#006FB3] to-[#0088D9] -z-10 shadow-md"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {link.children && (
                      <AnimatePresence>
                        {activeDropdown === link.href && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-xl"
                            onMouseEnter={() => handleDropdownEnter(link.href)}
                            onMouseLeave={handleDropdownLeave}
                          >
                            {/* Gradient header */}
                            <div className="h-1 bg-gradient-to-r from-[#006FB3] via-cyan-500 to-[#0088D9]" />

                            <div className="p-3">
                              {link.children.map((child, idx) => (
                                <motion.div
                                  key={child.href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                >
                                  <Link
                                    href={child.href}
                                    className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all group border border-transparent hover:border-blue-100 hover:shadow-md"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="text-white font-bold text-sm">{idx + 1}</span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-semibold text-gray-900 group-hover:text-[#006FB3] transition-colors mb-1">
                                          {child.label}
                                        </div>
                                        {child.description && (
                                          <div className="text-xs text-gray-500 leading-relaxed">
                                            {child.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </nav>


              {/* Language Switcher */}
              <div
                className="relative"
                onMouseEnter={() => setHoverLang(true)}
                onMouseLeave={() => setHoverLang(false)}
              >
                <button
                  className={`flex items-center justify-center w-10 h-10 border ${borderColor} rounded-full overflow-hidden transition-transform hover:scale-110`}
                  aria-label="Change language"
                >
                  <img
                    src={currentLanguageObj?.img_icon_url || "/icons/flags/vi.svg"}
                    alt={currentLanguageObj?.native_name}
                    className="w-full h-full object-cover"
                  />
                </button>

                <AnimatePresence>
                  {hoverLang && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl py-2 w-40 z-50"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setHoverLang(false);
                          }}
                          className={`flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${lang.code === language
                            ? "font-semibold text-[#006FB3] bg-blue-50"
                            : ""
                            }`}
                        >
                          <img
                            src={lang.img_icon_url || "/icons/flags/vi.svg"}
                            alt={lang.native_name}
                            className="w-5 h-5 mr-2 rounded-sm object-cover"
                          />
                          {lang.native_name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                className="ml-2 px-6 py-2.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl hover:shadow-lg hover:shadow-[#006FB3]/40 transition-all transform hover:scale-105 hover:-translate-y-0.5 text-sm font-semibold"
              >
                {language === "vi" ? "Liên hệ ngay" : "Contact Us"}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden w-12 h-12 flex items-center justify-center text-gray-800 hover:text-[#006FB3] transition-colors rounded-xl hover:bg-white/50 relative z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl p-6 max-h-[calc(100vh-80px)] overflow-y-auto"
              >
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`block py-3 px-4 rounded-xl transition-all ${isActivePath(link.href)
                          ? "bg-blue-50 text-[#006FB3] font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#006FB3]"
                          }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>

                      {/* Mobile Submenu */}
                      {link.children && (
                        <div className="ml-4 mt-2 space-y-1">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-2 px-3 text-sm text-gray-600 hover:text-[#006FB3] rounded-lg hover:bg-gray-50 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 pt-4 border-t border-gray-100 space-y-4"
                  >
                    {/* Language Switcher Mobile */}
                    <button
                      onClick={toggleLanguage}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:text-[#006FB3] rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                      <Globe size={18} />
                      <span>{language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}</span>
                    </button>

                    {/* Search Mobile */}
                    <button
                      onClick={() => {
                        setSearchOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:text-[#006FB3] rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                      <Search size={18} />
                      <span>{language === "vi" ? "Tìm kiếm" : "Search"}</span>
                    </button>

                    <Link
                      href="/contact"
                      className="block w-full py-3.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl text-center font-semibold shadow-lg shadow-blue-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {language === "vi" ? "Liên hệ ngay" : "Contact Us"}
                    </Link>

                    {/* Contact Info */}
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      <a
                        href="tel:0888917999"
                        className="flex items-center gap-3 text-gray-600 hover:text-[#006FB3] transition-colors"
                      >
                        <Phone size={18} />
                        <span className="font-semibold">0888 917 999</span>
                      </a>
                      <a
                        href="mailto:info@sfb.vn"
                        className="flex items-center gap-3 text-gray-600 hover:text-[#006FB3] transition-colors"
                      >
                        <Mail size={18} />
                        <span>info@sfb.vn</span>
                      </a>
                    </div>

                    {/* Social Media */}
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <a
                        href="https://facebook.com/sfbtech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center bg-blue-50 text-[#1877F2] rounded-xl hover:bg-blue-100 transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook size={20} />
                      </a>
                      <a
                        href="https://linkedin.com/company/sfbtech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center bg-blue-50 text-[#0A66C2] rounded-xl hover:bg-blue-100 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={20} />
                      </a>
                    </div>
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}