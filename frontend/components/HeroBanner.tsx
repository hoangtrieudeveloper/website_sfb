"use client";

import {
  ArrowRight,
  Play,
  Sparkles,
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
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#006FB3]/20 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#0088D9]/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#006FB3]/15 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <ScrollAnimation variant="fade-up" delay={0.2}>
              <h1 className="text-gray-900 leading-tight text-4xl md:text-5xl lg:text-6xl font-bold">
                Chuyển đổi số<br />
                Thông minh<br />
                Cho doanh nghiệp
              </h1>
            </ScrollAnimation>

            <ScrollAnimation variant="fade-up" delay={0.3}>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                SFB Technology đồng hành cùng doanh nghiệp trong hành
                trình chuyển đổi số với các giải pháp công nghệ tiên
                tiến, tối ưu hóa quy trình và tăng trưởng bền vững.
              </p>
            </ScrollAnimation>

            <ScrollAnimation variant="fade-up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/solutions"
                  className="group px-8 py-4 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl hover:shadow-2xl transition-all flex items-center gap-3 font-semibold"
                >
                  Khám phá giải pháp
                  <ArrowRight size={20} />
                </Link>

                <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-xl transition-all flex items-center gap-3 font-semibold">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center">
                    <Play size={14} className="text-white ml-0.5" />
                  </div>
                  <span>Xem video</span>
                </button>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Image */}
          <ScrollAnimation
            variant="scale-up"
            delay={0.3}
            duration={0.8}
            className="hidden lg:block"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/images/hero.png"
                alt="SFB Technology Office"
                className="w-full h-auto"
              />
            </div>
          </ScrollAnimation>
        </div>

        {/* ===== Partners ===== */}
        <ScrollAnimation
          variant="fade-in"
          delay={0.6}
          className="mt-28 lg:mt-32"
        >
          <div className="relative mx-auto max-w-[1120px] overflow-hidden mask-fade-x">
            <div className="py-8">
              <div className="flex items-center gap-16 animate-partner-marquee hover:[animation-play-state:paused]">
                {[...partners, ...partners].map((logo, idx) => (
                  <div
                    key={`${logo}-${idx}`}
                    className="flex items-center justify-center"
                  >
                    <ImageWithFallback
                      src={logo}
                      alt="Đối tác SFB"
                      className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
