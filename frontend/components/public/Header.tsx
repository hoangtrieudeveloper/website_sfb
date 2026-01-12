"use client";

import { Menu, X, Search, Globe, ChevronDown, Facebook, Linkedin, Mail, Phone } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SearchOverlay } from "./SearchOverlay";
import { AnnouncementBar } from "./AnnouncementBar";
import { getPublicSettings } from "@/lib/api/settings";
import { publicApiCall } from "@/lib/api/public/client";

interface NavLink {
  id?: number;
  href: string;
  label: string;
  children?: { href: string; label: string; description?: string }[];
}

interface MenuItem {
  id: number;
  title: string;
  url: string;
  parentId?: number | null;
  sortOrder: number;
  icon?: string;
  children?: MenuItem[];
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en" | "ja">("vi");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoverLang, setHoverLang] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcementHeight, setAnnouncementHeight] = useState(0);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();
  const headerRef = useRef<HTMLElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const keys = 'logo,slogan,site_name,phone,email';
        const data = await getPublicSettings(keys);
        setSettings(data);
      } catch (error: any) {
        // Silently fail - component sẽ sử dụng giá trị mặc định từ settings state
      }
    };
    loadSettings();
  }, []);

  // Load menus from API
  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await publicApiCall<{ success: boolean; data?: MenuItem[] }>(
          '/api/public/menus'
        );

        if (response.success && response.data) {
          // Convert menu items to NavLink format
          const convertMenuToNavLink = (menu: MenuItem): NavLink => {
            const navLink: NavLink = {
              id: menu.id,
              href: menu.url,
              label: menu.title,
            };

            // Convert children if exists (recursive for nested children)
            if (menu.children && Array.isArray(menu.children) && menu.children.length > 0) {
              navLink.children = menu.children.map(child => ({
                href: child.url,
                label: child.title,
                // Note: Currently only support one level of children
                // If you need nested children, uncomment below:
                // children: child.children && child.children.length > 0 
                //   ? child.children.map(grandchild => ({
                //       href: grandchild.url,
                //       label: grandchild.title,
                //     }))
                //   : undefined,
              }));
            }
            return navLink;
          };

          const links = response.data.map(convertMenuToNavLink);
          setNavLinks(links);
        }
      } catch (error) {
        // error handled
      }
    };
    loadMenus();
  }, []);

  // Check announcement dismissal status
  useEffect(() => {
    const dismissed = localStorage.getItem("announcementDismissed");
    if (dismissed === "true") {
      setShowAnnouncement(false);
    }
  }, []);

  // Measure announcement bar height so header/top spacing is correct on mobile (banner can wrap to 2 lines)
  useEffect(() => {
    const el = announcementRef.current;
    if (!el) return;

    const update = () => {
      setAnnouncementHeight(showAnnouncement ? el.getBoundingClientRect().height : 0);
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => update());
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [showAnnouncement]);

  // Chỉ sử dụng data từ API, không có fallback
  const logoUrl = settings.logo;
  const slogan = settings.slogan;
  const siteName = settings.site_name;
  const phone = settings.phone;
  const email = settings.email;

  // Format phone for display (remove non-digit characters except dots)
  // Kiểm tra phone tồn tại trước khi gọi replace
  const formattedPhone = phone ? phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3') : '';
  const phoneHref = phone ? `tel:${phone.replace(/\D/g, '')}` : '';

  const handleDismissAnnouncement = () => {
    setShowAnnouncement(false);
    localStorage.setItem("announcementDismissed", "true");
  };

  // Detect if we're on homepage (dark background) vs other pages (light background)
  const isHomePage = pathname === '/';

  // Define routes with dark backgrounds behind the transparent header
  // Define routes where header starts as transparent
  const transparentHeaderRoutes: string[] = [];
  const isTransparentHeader = pathname === '/' || transparentHeaderRoutes.some(route => pathname?.startsWith(route)) || false;

  // Determine text color
  // Scrolled: Dark text
  // Homepage: Dark text (Bright background)
  // Non-transparent pages: Dark text
  // Transparent pages (like About): White text
  const useDarkText = scrolled || pathname === '/' || !isTransparentHeader;

  // Language options with flags
  const languages = [
    { code: "vi" as const, native_name: "Tiếng Việt", img_icon_url: "/icons/flags/vi.svg" },
    { code: "en" as const, native_name: "English", img_icon_url: "/icons/flags/en.svg" },
    { code: "ja" as const, native_name: "日本語", img_icon_url: "/icons/flags/ja.svg" },
  ];

  const currentLanguageObj = languages.find(lang => lang.code === language);

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
    const savedLang = localStorage.getItem("language") as "vi" | "en" | "ja" | null;
    if (savedLang && ["vi", "en", "ja"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);
  
  // Update language and reload page to apply locale
  const changeLanguage = (newLang: "vi" | "en" | "ja") => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    // Reload page to apply locale changes
    window.location.reload();
  };

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
    // Cycle through languages: vi -> en -> ja -> vi
    const langOrder: ("vi" | "en" | "ja")[] = ["vi", "en", "ja"];
    const currentIndex = langOrder.indexOf(language);
    const nextIndex = (currentIndex + 1) % langOrder.length;
    changeLanguage(langOrder[nextIndex]);
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
      <div ref={announcementRef} className="relative z-[51]">
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
        style={{ top: !scrolled && showAnnouncement ? announcementHeight : 0 }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 flex flex-col items-center max-w-[1920px] mx-auto ${scrolled || !isTransparentHeader
          ? "bg-white shadow-lg border-b border-gray-100"
          : "bg-transparent shadow-none backdrop-blur-none"
          } top-0 p-2.5 gap-2.5`}
      >
        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-[clamp(24px,calc((100vw-1280px)/2),320px)]">
          <div className="flex items-center justify-between lg:justify-center gap-4 lg:gap-6 xl:gap-[60px] h-full min-w-0">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group relative z-50 shrink-0"
              style={{ height: "67px", gap: "10px" }}
            >
              {logoUrl && (
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <img
                      src={logoUrl}
                      alt="SFB Technology"
                      className={`w-full h-full object-contain transition-all duration-500 drop-shadow-md group-hover:drop-shadow-xl ${!useDarkText ? 'brightness-0 invert' : ''}`}
                    />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#006FB3]/0 via-[#0088D9]/40 to-[#006FB3]/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                {siteName && (
                  <span
                    className={`uppercase transition-colors duration-500 ${useDarkText ? 'text-[#006FB3] group-hover:text-[#0088D9]' : 'text-white group-hover:text-cyan-200'}`}
                    style={{
                      fontFamily: '"UTM Alexander", sans-serif',
                      fontSize: "38px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "100%",
                      width: "62px",
                      display: "inline-block",
                    }}
                  >
                    {siteName}
                  </span>
                )}
                {slogan && (
                  <span
                    className={`uppercase transition-colors duration-500 ${useDarkText ? 'text-[#525252] group-hover:text-[#0088D9]' : 'text-white/70 group-hover:text-white/90'}`}
                    style={{
                      fontFamily: '"UTM Alexander", sans-serif',
                      fontSize: "8px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "100%",
                      width: "102px",
                      display: "inline-block",
                    }}
                  >
                    {slogan}
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-1 min-w-0 shrink-0">
              {navLinks.map((link, linkIdx) => {
                const dropdownKey = link.id ? `menu-${link.id}` : link.href;
                return (
                  <div
                    key={dropdownKey}
                    className="relative"
                    onMouseEnter={() => {
                      if (link.children && link.children.length > 0) {
                        handleDropdownEnter(dropdownKey);
                      }
                    }}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={`px-2.5 xl:px-3 min-[1920px]:px-4 py-2 transition-all duration-500 relative group text-[11px] xl:text-xs font-bold uppercase tracking-wide flex items-center gap-1 whitespace-nowrap ${isActivePath(link.href)
                        ? useDarkText
                          ? "text-[#006FB3]"
                          : "text-white"
                        : useDarkText
                          ? "text-gray-700 hover:text-[#006FB3] hover:-translate-y-0.5"
                          : "text-white/90 hover:text-white hover:-translate-y-0.5"
                        }`}
                      aria-label={link.label}
                      aria-haspopup={link.children && link.children.length > 0 ? "true" : undefined}
                      aria-expanded={link.children && link.children.length > 0 && activeDropdown === dropdownKey ? "true" : "false"}
                      prefetch={true}
                    >
                      {link.label}
                      {link.children && link.children.length > 0 && (
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-300 ${activeDropdown === dropdownKey ? "rotate-180" : ""}`}
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
                    {link.children && link.children.length > 0 && (
                      <AnimatePresence>
                        {activeDropdown === dropdownKey && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-xl z-50"
                            onMouseEnter={() => handleDropdownEnter(dropdownKey)}
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
                                    prefetch={true}
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
                );
              })}
            </nav>

            {/* Language Switcher Desktop */}
            <div className="hidden lg:flex items-center gap-2 shrink-0 relative" onMouseEnter={() => setHoverLang(true)} onMouseLeave={() => setHoverLang(false)}>
              <button
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  useDarkText 
                    ? 'text-gray-700 hover:text-[#006FB3] hover:bg-gray-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Change language"
              >
                <Globe size={18} />
                <span className="text-xs font-semibold uppercase">
                  {language === "vi" ? "VI" : language === "en" ? "EN" : "JA"}
                </span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${hoverLang ? "rotate-180" : ""}`}
                />
              </button>
              
              {/* Language Dropdown */}
              <AnimatePresence>
                {hoverLang && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full right-0 mt-2 min-w-[160px] rounded-xl shadow-xl border overflow-hidden ${
                      useDarkText 
                        ? 'bg-white border-gray-200' 
                        : 'bg-white/95 backdrop-blur-xl border-white/20'
                    }`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                          language === lang.code
                            ? useDarkText
                              ? 'bg-blue-50 text-[#006FB3] font-semibold'
                              : 'bg-blue-500/20 text-white font-semibold'
                            : useDarkText
                              ? 'text-gray-700 hover:bg-gray-50 hover:text-[#006FB3]'
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {lang.img_icon_url && (
                          <img 
                            src={lang.img_icon_url} 
                            alt={lang.native_name}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <span className="text-sm">{lang.native_name}</span>
                        {language === lang.code && (
                          <span className="ml-auto text-[#006FB3]">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Info & CTA */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {(email || phone) && (
                <div className="text-right group">
                  {email && (
                    <a href={`mailto:${email}`} className={`block text-[11px] xl:text-xs font-medium mb-0.5 transition-colors duration-500 ${useDarkText ? 'text-gray-600 group-hover:text-[#006FB3]' : 'text-white/80 group-hover:text-white'}`}>
                      {email}
                    </a>
                  )}
                  {phone && phoneHref && (
                    <a href={phoneHref} className={`block text-xs xl:text-sm font-bold transition-all duration-500 ${useDarkText ? 'text-gray-900 group-hover:text-[#006FB3]' : 'text-white group-hover:text-cyan-200'}`}>
                      {formattedPhone}
                    </a>
                  )}
                </div>
              )}
              <Link
                href="/contact"
                className="relative text-white hover:shadow-xl hover:shadow-[#006FB3]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 text-[11px] xl:text-xs font-bold uppercase tracking-wide overflow-hidden group flex items-center justify-center h-[50px] px-4 xl:px-5 min-[1920px]:px-[30px] py-[7px] whitespace-nowrap"
                style={{
                  gap: "0px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.40)",
                  background: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)"
                }}
              >
                {/* Shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative z-10">
                  {language === "vi" ? "Liên hệ ngay" : language === "en" ? "Contact Now" : "今すぐお問い合わせ"}
                </span>
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
                      {link.children && link.children.length > 0 && (
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
                      <span>
                        {language === "vi" ? "Switch to English" : 
                         language === "en" ? "日本語に切り替え" : 
                         "Chuyển sang Tiếng Việt"}
                      </span>
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
                      <span>
                        {language === "vi" ? "Tìm kiếm" : 
                         language === "en" ? "Search" : 
                         "検索"}
                      </span>
                    </button>

                    <Link
                      href="/contact"
                      className="block w-full py-3.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl text-center font-semibold shadow-lg shadow-blue-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {language === "vi" ? "Liên hệ ngay" : 
                       language === "en" ? "Contact Us" : 
                       "今すぐお問い合わせ"}
                    </Link>

                    {/* Contact Info */}
                    {(phone || email) && (
                      <div className="pt-4 border-t border-gray-100 space-y-3">
                        {phone && phoneHref && (
                          <a
                            href={phoneHref}
                            className="flex items-center gap-3 text-gray-600 hover:text-[#006FB3] transition-colors"
                          >
                            <Phone size={18} />
                            <span className="font-semibold">{formattedPhone}</span>
                          </a>
                        )}
                        {email && (
                          <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-3 text-gray-600 hover:text-[#006FB3] transition-colors"
                          >
                            <Mail size={18} />
                            <span>{email}</span>
                          </a>
                        )}
                      </div>
                    )}

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