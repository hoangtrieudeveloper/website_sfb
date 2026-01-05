import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Giới thiệu SFB", href: "/about" },
    { name: "Sản phẩm – Dịch vụ", href: "/solutions" },
    { name: "Tuyển dụng", href: "/careers" },
    { name: "Tin tức", href: "/news" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const solutions = [
    {
      name: "Tư vấn xây dựng và phát triển hệ thống",
      href: "/solutions",
    },
    {
      name: "Cung cấp dịch vụ quản trị hệ thống",
      href: "/solutions",
    },
    {
      name: "Thiết kế & xây dựng giải pháp cổng TTĐT",
      href: "/solutions",
    },
    {
      name: "Cổng thông tin Chính phủ điện tử SharePoint",
      href: "/solutions",
    },
    { name: "Outsourcing", href: "/solutions" },
    {
      name: "Data Universal Numbering System",
      href: "/solutions",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
    },
    {
      icon: Linkedin, // Use Pinterest if intended, but Linkedin is standard for business
      href: "https://www.linkedin.com",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com",
    },
  ];

  return (
    <footer className="relative flex flex-col items-center gap-[10px] w-full max-w-[1920px] mx-auto pt-[120px] pb-[20px] bg-[#F9FAFC] text-[#334155] overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full max-w-[1298px] items-start gap-[48px] mb-16 px-6 xl:px-0">
        {/* Column 1: Logo & Intro */}
        <div className="space-y-6 flex-1">
          <Link href="/" className="inline-block">
            {/* Logo Placeholder - replaced with actual logo when available or text fallback that looks good */}
            <div className="flex items-center gap-3">
              {/* Logo Image */}
              <div className="w-[74.73px] flex-shrink-0">
                <img
                  src="/images/sfb.svg"
                  alt="SFB Technology"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Text Stack */}
              <div className="flex flex-col" style={{ fontFamily: 'UTM Alexander, sans-serif' }}>
                <span
                  className="text-[#006FB3] font-normal uppercase leading-[100%]"
                  style={{ fontSize: '38px' }}
                >
                  SFB
                </span>
                <span
                  className="text-[#525252] font-normal uppercase leading-[100%]"
                  style={{ fontSize: '8px' }}
                >
                  Smart Solutions Business
                </span>
              </div>
            </div>
          </Link>

          <p className="text-[#334155] leading-relaxed text-[15px]">
            SFB có một đội ngũ chuyên gia CNTT trẻ, có kiến thức chuyên sâu về Công nghệ Thông tin, Phát triển Web và phát triển phần mềm ứng dụng.
          </p>

          {/* Social Icons (Circles) */}
          <div className="flex gap-3 pt-2">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#006FB3] hover:text-white hover:border-[#006FB3] transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>

        {/* Column 2: Links */}
        <div className="flex-1">
          <h4 className="text-[#0F172A] font-bold text-lg mb-6">Liên kết</h4>
          <ul className="space-y-3">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  href={link.href}
                  className="text-[#334155] hover:text-[#006FB3] transition-colors text-[15px]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="flex-1">
          <h4 className="text-[#0F172A] font-bold text-lg mb-6">Dịch vụ</h4>
          <ul className="space-y-3">
            {solutions.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.href}
                  className="text-[#334155] hover:text-[#006FB3] transition-colors text-[15px]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="flex-1">
          <h4 className="text-[#0F172A] font-bold text-lg mb-6">Thông tin liên hệ</h4>
          <div className="space-y-4">
            <div>
              <span className="font-bold text-[#334155] block mb-1 text-[15px]">Địa chỉ</span>
              <p className="text-[#334155] text-[15px] leading-relaxed">
                P303, Tầng 3, Khách sạn Thể thao, Số 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.
              </p>
            </div>
            <div>
              <span className="font-bold text-[#334155] inline-block mr-1 text-[15px]">Hotline:</span>
              <a href="tel:0888917999" className="text-[#334155] hover:text-[#006FB3] transition-colors text-[15px]">
                0888 917 999
              </a>
            </div>
            <div>
              <span className="font-bold text-[#334155] inline-block mr-1 text-[15px]">Email:</span>
              <a href="mailto:info@sfb.vn" className="text-[#334155] hover:text-[#006FB3] transition-colors text-[15px]">
                info@sfb.vn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex w-full max-w-[1298px] h-auto md:h-[61px] flex-col md:flex-row justify-between items-center border-t border-[#EDEEF0] py-4 md:py-0">
        <p className="text-[#94A3B8] text-sm">
          © {currentYear} SFBTECH.,JSC. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 md:mt-0">
          <Link href="/privacy" className="text-[#334155] hover:text-[#006FB3] text-sm font-medium transition-colors">
            Chính sách bảo mật
          </Link>
          <div className="hidden md:block h-4 w-px bg-[#E2E8F0]" aria-hidden="true"></div>
          <Link href="/terms" className="text-[#334155] hover:text-[#006FB3] text-sm font-medium transition-colors">
            Điều khoản sử dụng
          </Link>
          <div className="hidden md:block h-4 w-px bg-[#E2E8F0]" aria-hidden="true"></div>
          <Link href="/contact" className="text-[#334155] hover:text-[#006FB3] text-sm font-medium transition-colors">
            Liên hệ
          </Link>
        </div>
      </div>

    </footer>
  );
}