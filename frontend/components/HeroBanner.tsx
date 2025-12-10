"use client";

import {
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";
import { ScrollAnimation } from "./ScrollAnimation";

export function HeroBanner() {
  const partners = [
    "https://sfb.vn/wp-content/uploads/2021/01/btc-170x170.png",
    "https://sfb.vn/wp-content/uploads/2021/01/h%E1%BB%8Dc-vi%E1%BB%87n-c%E1%BA%A3nh-s%C3%A1t.png",
    "https://sfb.vn/wp-content/uploads/2021/01/nam-vi%E1%BB%87t-1.jpg",
    "https://sfb.vn/wp-content/uploads/2021/01/b%E1%BA%A3o-hi%E1%BB%83m.png",
    "https://sfb.vn/wp-content/uploads/2021/01/logo3.png",
    "https://sfb.vn/wp-content/uploads/2021/01/logoo.png",
    "https://sfb.vn/wp-content/uploads/2021/01/sotttt.jpg",
    "https://sfb.vn/wp-content/uploads/2021/01/h%C6%B0ng-y%C3%AAn.png",
    "https://sfb.vn/wp-content/uploads/2021/01/btc.png",
    "https://sfb.vn/wp-content/uploads/2021/01/h%E1%BB%8Dc-vi%E1%BB%87n-c%E1%BA%A3nh-s%C3%A1t.png",
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-[#E6F4FF] to-[#D6EEFF] pt-28 pb-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#006FB3]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#0088D9]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#006FB3]/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <ScrollAnimation variant="fade-up" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-[#006FB3]/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 group cursor-pointer">
                <Sparkles
                  className="text-[#006FB3] group-hover:rotate-12 transition-transform"
                  size={18}
                />
                <span className="text-sm font-semibold bg-gradient-to-r from-[#006FB3] to-[#0088D9] bg-clip-text text-transparent">
                  Giải pháp công nghệ hàng đầu Việt Nam
                </span>
              </div>
            </ScrollAnimation>

            {/* Main Heading */}
            <div className="space-y-4">
              <ScrollAnimation variant="fade-up" delay={0.2}>
                <h1 className="text-gray-900 leading-tight text-4xl md:text-5xl lg:text-6xl font-bold">
                  Chuyển đổi số
                  <span className="block mt-2 bg-gradient-to-r from-[#006FB3] via-[#0088D9] to-[#006FB3] bg-clip-text text-transparent animate-gradient pb-2">
                    Thông minh
                  </span>
                  cho doanh nghiệp
                </h1>
              </ScrollAnimation>

              <ScrollAnimation variant="fade-up" delay={0.3}>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  SFB Technology đồng hành cùng doanh nghiệp trong
                  hành trình chuyển đổi số với các giải pháp công
                  nghệ tiên tiến, tối ưu hóa quy trình và tăng
                  trưởng bền vững.
                </p>
              </ScrollAnimation>
            </div>

            {/* CTA Buttons */}
            <ScrollAnimation variant="fade-up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/solutions"
                  className="group px-8 py-4 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl hover:shadow-2xl hover:shadow-[#006FB3]/50 transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 font-semibold"
                >
                  Khám phá giải pháp
                  <ArrowRight
                    className="group-hover:translate-x-2 transition-transform"
                    size={20}
                  />
                </Link>
                <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 rounded-xl hover:border-[#006FB3] hover:bg-white hover:shadow-xl transition-all flex items-center justify-center gap-3 font-semibold">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play
                      size={14}
                      className="text-white fill-white ml-0.5"
                    />
                  </div>
                  <span>Xem video</span>
                </button>
              </div>
            </ScrollAnimation>

            {/* Stats */}
            <ScrollAnimation variant="fade-up" delay={0.5}>
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200/60">
                {/* Dự án */}
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <TrendingUp
                        className="text-white"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#006FB3] to-[#0088D9] bg-clip-text text-transparent">
                    Hàng trăm
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Dự án chuyển đổi số
                  </div>
                </div>

                {/* Khách hàng / lĩnh vực */}
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Users className="text-white" size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Đa lĩnh vực
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Chính phủ, Ngân hàng...
                  </div>
                </div>

                {/* Kinh nghiệm */}
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Award className="text-white" size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    8+ năm
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Kinh nghiệm triển khai
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Image */}
          <ScrollAnimation variant="scale-up" delay={0.3} duration={0.8} className="relative lg:block hidden">
            {/* Main Image */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-700 border-8 border-white group">
              <ImageWithFallback
                src="https://sfb.vn/wp-content/uploads/2020/04/art001-1161x599-1-1159x599.jpg"
                alt="SFB Technology Office"
                className="w-full h-auto scale-100 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#006FB3]/20 via-transparent to-[#0088D9]/20 mix-blend-overlay" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#006FB3] to-[#0088D9] rounded-3xl blur-2xl opacity-60 animate-pulse-glow" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-60 animate-pulse-glow" />
          </ScrollAnimation>
        </div>

        {/* Partners Slider */}
        <ScrollAnimation variant="fade-in" delay={0.6} className="mt-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006FB3]" />
            <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Được tin tưởng bởi các đối tác hàng đầu
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006FB3]" />
          </div>

          <div className="relative bg-white/60 backdrop-blur-sm border border-gray-100 rounded-3xl py-6 px-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Fade masks */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-10 animate-partner-marquee">
              {[...partners, ...partners].map((logo, idx) => (
                <div
                  key={`${logo}-${idx}`}
                  className="flex items-center justify-center min-w-[120px]"
                >
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden p-2 hover:scale-110 transition-transform duration-300">
                    <ImageWithFallback
                      src={logo}
                      alt="Đối tác SFB"
                      className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}