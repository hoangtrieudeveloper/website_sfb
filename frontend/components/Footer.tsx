import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Send,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

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
      name: "Thiết kế & xây dựng giải pháp cổng thông tin điện tử",
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
      color: "hover:bg-blue-600",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
      color: "hover:bg-sky-500",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com",
      color: "hover:bg-pink-500",
    },
  ];

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Top Section */}
        <div className="py-16 grid md:grid-cols-12 gap-12">
          {/* Company Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    SFB
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />
              </div>
              <div>
                <div className="text-white font-bold text-xl">
                  SFB
                </div>
                <div className="text-cyan-400 text-sm font-medium tracking-wide">
                  Smart Solutions
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg">
              SFB có một đội ngũ chuyên gia CNTT trẻ, có kiến
              thức chuyên sâu về Công nghệ Thông tin, Phát triển
              Web và phát triển phần mềm ứng dụng.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                <div className="text-xs text-cyan-400 font-semibold">
                  ISO 9001:2015
                </div>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                <div className="text-xs text-cyan-400 font-semibold">
                  ISO 27001
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-2">
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 border-2 border-white/20 rounded-xl flex items-center justify-center ${social.color} hover:border-white transition-all transform hover:scale-110 hover:-translate-y-1 group`}
                    >
                      <Icon
                        className="text-gray-300 group-hover:text-white transition-colors"
                        size={18}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-white mb-6 relative inline-block">
              Liên kết
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="text-white mb-6 relative inline-block">
              Dịch vụ
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
            </h4>
            <ul className="space-y-3">
              {solutions.map((solution, index) => (
                <li key={index}>
                  <Link
                    href={solution.href}
                    className="text-gray-300 hover:text-white hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all"
                    />
                    {solution.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3">
            <h4 className="text-white mb-6 relative inline-block">
              Thông tin liên hệ
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
            </h4>
            <ul className="space-y-5">
              {/* Address */}
              <li className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-600 transition-all">
                    <MapPin
                      className="text-cyan-400 group-hover:text-white transition-colors"
                      size={20}
                    />
                  </div>
                </div>
                <div className="text-gray-300 leading-relaxed">
                  <div className="font-semibold text-white mb-1">
                    Địa chỉ
                  </div>
                  P303, Tầng 3, Khách sạn Thể Thao, Số 15 Lê Văn
                  Thiêm,
                  <br />
                  P. Nhân Chính, Q. Thanh Xuân, Hà Nội.
                </div>
              </li>

              {/* Phone */}
              <li className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-600 transition-all">
                    <Phone
                      className="text-cyan-400 group-hover:text-white transition-colors"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">
                    Hotline
                  </div>
                  <a
                    href="tel:0888917999"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    0888 917 999
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-600 transition-all">
                    <Mail
                      className="text-cyan-400 group-hover:text-white transition-colors"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">
                    Email
                  </div>
                  <a
                    href="mailto:info@sfb.vn"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    info@sfb.vn
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="py-12 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-white mb-3 text-lg font-semibold">
              ĐĂNG KÝ TƯ VẤN!
            </h4>
            <p className="text-gray-300 mb-6">
              Để đội ngũ SFB liên hệ và tư vấn giải pháp phù hợp
              nhất cho doanh nghiệp của bạn.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center gap-2 font-semibold">
                <Send size={20} />
                <span className="hidden sm:inline">
                  Đăng ký
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} SFBTECH.,JSC. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Chính sách bảo mật
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Điều khoản sử dụng
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="/contact"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}