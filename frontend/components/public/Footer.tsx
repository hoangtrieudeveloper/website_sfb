"use client";

import { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPublicSettings } from "@/lib/api/settings";
import { buildUrl } from "@/lib/api/base";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { locale } = useLocale();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [locale]);

  const loadSettings = async () => {
    try {
      const keys = 'logo,slogan,site_name,site_description,phone,email,address,social_facebook,social_twitter,social_linkedin,social_instagram,footer_quick_links,footer_solutions';
      const data = await getPublicSettings(keys, locale);
      setSettings(data);
    } catch (error: any) {
      // Silently fail - component sẽ return null nếu không có data
    } finally {
      setLoading(false);
    }
  };

  // Không render nếu không có dữ liệu cần thiết
  if (loading) {
    return null;
  }

  // Kiểm tra dữ liệu tối thiểu cần thiết
  if (!settings.site_name && !settings.logo) {
    return null;
  }

  const logoUrl = settings.logo;
  const slogan = typeof settings.slogan === 'string'
    ? settings.slogan
    : getLocalizedText(settings.slogan, locale);
  const siteName = typeof settings.site_name === 'string'
    ? settings.site_name
    : getLocalizedText(settings.site_name, locale);
  const siteDescription = typeof settings.site_description === 'string'
    ? settings.site_description
    : getLocalizedText(settings.site_description, locale);
  const phone = settings.phone;
  const email = settings.email;
  const address = typeof settings.address === 'string'
    ? settings.address
    : getLocalizedText(settings.address, locale);

  // Chỉ hiển thị social links nếu có URL
  const socialLinks = [
    settings.social_facebook && {
      icon: Facebook,
      href: settings.social_facebook,
      label: 'Facebook',
    },
    settings.social_twitter && {
      icon: Twitter,
      href: settings.social_twitter,
      label: 'Twitter',
    },
    settings.social_linkedin && {
      icon: Linkedin,
      href: settings.social_linkedin,
      label: 'LinkedIn',
    },
    settings.social_instagram && {
      icon: Instagram,
      href: settings.social_instagram,
      label: 'Instagram',
    },
  ].filter(Boolean) as Array<{ icon: typeof Facebook; href: string; label: string }>;

  // Parse JSON links from settings and apply locale
  const parseLinks = (jsonString: string): Array<{ name: string; href: string }> => {
    try {
      if (!jsonString) return [];
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return [];

      // Apply locale to each link's name field
      return parsed.map((link: any) => ({
        name: typeof link.name === 'string'
          ? link.name
          : getLocalizedText(link.name, locale),
        href: link.href || '',
      }));
    } catch (error: any) {
      // Silently fail - return empty array
      return [];
    }
  };

  const quickLinks = parseLinks(settings.footer_quick_links || '');
  const solutions = parseLinks(settings.footer_solutions || '');

  return (
    <footer className="relative flex flex-col items-center gap-0 lg:gap-[10px] w-full max-w-[1920px] mx-auto pt-8 lg:pt-[120px] pb-5 lg:pb-[20px] bg-[#E2E8F0] text-[#334155] overflow-hidden">
      <div className="grid grid-cols-2 lg:flex lg:flex-row w-full max-w-[1298px] items-start gap-x-4 lg:gap-x-8 gap-y-6 lg:gap-[48px] mb-6 lg:mb-16 px-4 sm:px-6 xl:px-0">
        {/* Column 1: Logo & Intro */}
        <div className="col-span-2 lg:flex-1 flex flex-col items-center lg:items-start space-y-4 lg:space-y-6 text-center lg:text-left">
          <Link href={`/${locale}`} className="inline-block" aria-label={`${siteName} - ${slogan || (locale === 'vi' ? 'Trang chủ' : locale === 'en' ? 'Home' : 'ホーム')}`}>
            <div className="flex items-center gap-3">
              {/* Logo Image */}
              {logoUrl && (
                <div className="w-[74.73px] flex-shrink-0 relative">
                  {logoUrl.startsWith('http://') || logoUrl.startsWith('https://') ? (
                    <Image
                      src={logoUrl}
                      alt={`${siteName} Logo`}
                      width={75}
                      height={75}
                      className="object-contain"
                      style={{ width: '75px', height: '75px' }}
                      priority
                      unoptimized
                    />
                  ) : (
                    <Image
                      src={buildUrl(logoUrl)}
                      alt={`${siteName} Logo`}
                      width={75}
                      height={75}
                      className="object-contain"
                      style={{ width: '75px', height: '75px' }}
                      priority
                    />
                  )}
                </div>
              )}

              {/* Text Stack */}
              {siteName && (
                <div className="flex flex-col items-start" style={{ fontFamily: 'UTM Alexander, sans-serif' }}>
                  <span
                    className="text-[#006FB3] font-normal uppercase leading-[100%]"
                    style={{ fontSize: '38px' }}
                  >
                    {siteName}
                  </span>
                  {slogan && (
                    <span
                      className="text-[#525252] font-normal uppercase leading-[100%]"
                      style={{ fontSize: '8px' }}
                    >
                      {slogan}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>

          {siteDescription && (
            <p className="hidden lg:block text-[#334155] leading-relaxed text-[15px]">
              {siteDescription}
            </p>
          )}

          {/* Social Icons (Circles) */}
          {socialLinks.length > 0 && (
            <nav aria-label="Social media links" className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.label}`}
                    className="w-9 h-9 border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#006FB3] hover:text-white hover:border-[#006FB3] transition-all duration-300"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                )
              })}
            </nav>
          )}
        </div>

        {/* Column 2: Links */}
        {quickLinks.length > 0 && (
          <nav className="col-span-1 lg:flex-1" aria-label="Quick links">
            <h4 className="text-[#0F172A] font-bold text-base lg:text-lg mb-3 lg:mb-6">
              {locale === 'vi' ? 'Liên kết' : locale === 'en' ? 'Links' : 'リンク'}
            </h4>
            <ul className="space-y-2 lg:space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-[#334155] hover:text-[#006FB3] transition-colors text-sm lg:text-[15px]"
                    prefetch={true}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Column 3: Services */}
        {solutions.length > 0 && (
          <nav className="col-span-1 lg:flex-1" aria-label="Services">
            <h4 className="text-[#0F172A] font-bold text-base lg:text-lg mb-3 lg:mb-6">
              {locale === 'vi' ? 'Dịch vụ' : locale === 'en' ? 'Services' : 'サービス'}
            </h4>
            <ul className="space-y-1.5 lg:space-y-3">
              {solutions.map((item, idx) => (
                <li key={idx} className={idx > 2 ? "hidden lg:block" : ""}>
                  <Link
                    href={item.href}
                    className="text-[#334155] hover:text-[#006FB3] transition-colors text-sm lg:text-[15px] leading-tight block"
                    prefetch={true}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Column 4: Contact Info */}
        {(address || phone || email) && (
          <address className="col-span-2 lg:flex-1 flex flex-col items-center lg:items-start text-center lg:text-left not-italic">
            <h4 className="text-[#0F172A] font-bold text-base lg:text-lg mb-3 lg:mb-6">
              {locale === 'vi' ? 'Thông tin liên hệ' : locale === 'en' ? 'Contact Information' : 'お問い合わせ情報'}
            </h4>
            <div className="space-y-2 lg:space-y-4 w-full">
              {address && (
                <div>
                  <span className="font-bold text-[#334155] block mb-0.5 text-sm lg:text-[15px]">
                    {locale === 'vi' ? 'Địa chỉ' : locale === 'en' ? 'Address' : '住所'}
                  </span>
                  <p className="text-[#334155] text-sm lg:text-[15px] leading-relaxed">
                    {address}
                  </p>
                </div>
              )}
              {phone && (
                <div>
                  <span className="font-bold text-[#334155] inline-block mr-1 text-sm lg:text-[15px]">
                    {locale === 'vi' ? 'Hotline:' : locale === 'en' ? 'Hotline:' : 'ホットライン:'}
                  </span>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-[#334155] hover:text-[#006FB3] transition-colors text-[15px]">
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div>
                  <span className="font-bold text-[#334155] inline-block mr-1 text-sm lg:text-[15px]">
                    {locale === 'vi' ? 'Email:' : locale === 'en' ? 'Email:' : 'メール:'}
                  </span>
                  <a href={`mailto:${email}`} className="text-[#334155] hover:text-[#006FB3] transition-colors text-sm lg:text-[15px]">
                    {email}
                  </a>
                </div>
              )}
            </div>
          </address>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="flex w-full max-w-[1298px] h-auto md:h-[61px] flex-col md:flex-row justify-between items-center border-t border-[#EDEEF0] py-4 md:py-0">
        <p className="text-[#94A3B8] text-sm">
          © {currentYear} SFBTECH.,JSC. All rights reserved.
        </p>
        <nav aria-label="Footer legal links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 md:mt-0">
          <Link href={`/${locale}/privacy`} className="text-[#334155] hover:text-[#006FB3] text-sm font-medium transition-colors" prefetch={true}>
            {locale === 'vi' ? 'Chính sách bảo mật' : locale === 'en' ? 'Privacy Policy' : 'プライバシーポリシー'}
          </Link>
          <div className="hidden md:block h-4 w-px bg-[#E2E8F0]" aria-hidden="true"></div>
          <Link href={`/${locale}/terms`} className="text-[#334155] hover:text-[#006FB3] text-sm font-medium transition-colors" prefetch={true}>
            {locale === 'vi' ? 'Điều khoản sử dụng' : locale === 'en' ? 'Terms of Use' : '利用規約'}
          </Link>
          <div className="hidden md:block h-4 w-px bg-[#E2E8F0]" aria-hidden="true"></div>
          <Link href={`/${locale}/contact`} className="text-[#334155] hover:text-[#006FB3] text-sm font-medium transition-colors" prefetch={true}>
            {locale === 'vi' ? 'Liên hệ' : locale === 'en' ? 'Contact' : 'お問い合わせ'}
          </Link>
        </nav>
      </div>

    </footer>
  );
}
