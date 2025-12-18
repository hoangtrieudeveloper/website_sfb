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
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();
  const headerRef = useRef<HTMLElement>(null);

  // Check announcement dismissal status
  useEffect(() => {
    const dismissed = localStorage.getItem("announcementDismissed");
    if (dismissed === "true") {
      setShowAnnouncement(false);
    }
  }, []);

  const handleDismissAnnouncement = () => {
    setShowAnnouncement(false);
    localStorage.setItem("announcementDismissed", "true");
  };

  // Detect if we're on homepage (dark background) vs other pages (light background)
  const isHomePage = pathname === '/';

  // Define routes with dark backgrounds behind the transparent header
  // Add any routes with dark hero sections here
  const darkBackgroundRoutes = ['/about', '/products', '/solutions', '/industries', '/news', '/careers'];
  const hasDarkBackground = darkBackgroundRoutes.some(route => pathname?.startsWith(route)) || false;


  // Determine text color based on scroll state and background
  // When scrolled: header is white/opaque -> ALWAYS use dark text
  // When not scrolled (transparent header):
  //   - If page has dark background -> use WHITE text (for contrast)
  //   - If page has light background -> use DARK text (for visibility)
  const useDarkText = scrolled ? true : !hasDarkBackground;


  // Language options with flags
  const languages = [
    { code: "vi" as const, native_name: "Tiếng Việt", img_icon_url: "/icons/flags/vi.svg" },
    { code: "en" as const, native_name: "English", img_icon_url: "/icons/flags/en.svg" },
  ];


  const currentLanguageObj = languages.find(lang => lang.code === language);


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
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[60]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#006FB3] via-cyan-500 to-[#006FB3]"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Announcement Bar - positioned at very top */}
      <div className="fixed top-0 left-0 right-0 z-[51]">
        <AnnouncementBar
          isVisible={showAnnouncement}
          onDismiss={handleDismissAnnouncement}
        />
      </div>

      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 flex flex-col items-center max-w-[1920px] mx-auto ${scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg top-0 border-b border-white/20"
          : `bg-transparent shadow-none backdrop-blur-none ${showAnnouncement ? 'top-12' : 'top-0'}`
          }`}
        style={{ padding: "10px", gap: "10px" }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-8 h-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group relative z-50"
              style={{ height: "67px", gap: "10px" }}
            >
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <img
                    src="/images/sfb.svg"
                    alt="SFB Technology"
                    className={`w-full h-full object-contain transition-all duration-500 drop-shadow-md group-hover:drop-shadow-xl ${!useDarkText ? 'brightness-0 invert' : ''}`}
                  />
                </div>
                {/* Glow Effect */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#006FB3]/0 via-[#0088D9]/40 to-[#006FB3]/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg leading-tight transition-colors duration-500 ${useDarkText ? 'text-[#006FB3] group-hover:text-[#0088D9]' : 'text-white group-hover:text-cyan-200'}`}>SFB</span>
                <span className={`text-[10px] leading-tight uppercase tracking-wide transition-colors duration-500 ${useDarkText ? 'text-[#006FB3]/70 group-hover:text-[#0088D9]' : 'text-white/70 group-hover:text-white/90'}`}>Smart Solutions Business</span>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && handleDropdownEnter(link.href)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={link.href}
                    className={`px-4 py-2 transition-all duration-500 relative group text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${isActivePath(link.href)
                      ? useDarkText
                        ? "text-[#006FB3]"
                        : "text-white"
                      : useDarkText
                        ? "text-gray-700 hover:text-[#006FB3] hover:-translate-y-0.5"
                        : "text-white/90 hover:text-white hover:-translate-y-0.5"
                      }`}
                    aria-label={link.label}
                    aria-haspopup={link.children ? "true" : undefined}
                    aria-expanded={link.children && activeDropdown === link.href ? "true" : "false"}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-300 ${activeDropdown === link.href ? "rotate-180" : ""}`}
                      />
                    )}
                    {/* Active indicator */}
                    {isActivePath(link.href) && (
                      <motion.span
                        layoutId="activeNav"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-colors duration-500 ${useDarkText ? 'bg-gradient-to-r from-[#006FB3] to-[#0088D9]' : 'bg-white'}`}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Hover underline effect */}
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left ${useDarkText ? 'bg-gradient-to-r from-[#006FB3] to-[#0088D9]' : 'bg-white'}`} />
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

            {/* Contact Info & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right group">
                <a href="mailto:info@sfb.vn" className={`block text-xs font-medium mb-0.5 transition-colors duration-500 ${useDarkText ? 'text-gray-600 group-hover:text-[#006FB3]' : 'text-white/80 group-hover:text-white'}`}>
                  info@sfb.vn
                </a>
                <a href="tel:0888917999" className={`block text-sm font-bold transition-all duration-500 ${useDarkText ? 'text-gray-900 group-hover:text-[#006FB3]' : 'text-white group-hover:text-cyan-200'}`}>
                  0888.917.999
                </a>
              </div>
              <Link
                href="/contact"
                className="relative text-white hover:shadow-xl hover:shadow-[#006FB3]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 text-xs font-bold uppercase tracking-wide overflow-hidden group flex items-center justify-center"
                style={{
                  height: "50px",
                  padding: "7px 30px",
                  gap: "0px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.40)",
                  background: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)"
                }}
              >
                {/* Shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative z-10">{language === "vi" ? "Liên hệ ngay" : "Contact Now"}</span>
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