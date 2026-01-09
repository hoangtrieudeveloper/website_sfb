"use client";

import Link from "next/link";
import { ScrollAnimation } from "../public/ScrollAnimation";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface SolutionsProps {
  data?: any;
}

export function Solutions({ data }: SolutionsProps) {
  // Chỉ sử dụng data từ API, không có fallback static data
  if (!data) {
    return null;
  }

  const subHeader = data?.subHeader;
  const title = data?.title;
  const domains = data?.domains || [];
  const items = data?.items || [];

  // Không render nếu không có dữ liệu cần thiết
  if (!subHeader || !title || items.length === 0) {
    return null;
  }



  return (
    <section
      id="solutions"
      className="relative py-[120px] overflow-visible bg-[linear-gradient(236.99deg,#80C0E4_7%,#1D8FCF_71.94%)]"
    >
      <div className="mx-auto w-full max-w-[1920px] px-6 xl:px-0 xl:px-[clamp(24px,7.8125vw,150px)]">
        {/* Header */}
        <ScrollAnimation
          variant="fade-down"
          className="mx-auto w-full max-w-5xl self-stretch text-center flex flex-col items-center gap-6"
        >
          <div className="self-stretch text-center text-[var(--light-blue,#EFF6FF)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[15px] font-medium leading-normal uppercase">
            {subHeader}
          </div>

          <h2 className="mx-auto w-full max-w-[840px] text-center text-[var(--White,#FFF)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[clamp(32px,4.6vw,56px)] leading-normal">
            <span className="font-bold">{title.part1}</span>
            <br />
            <span className="font-normal">{title.part2}</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-2.5">
            {domains.map((d: string, i: number) => (
              <ScrollAnimation
                key={d}
                variant="scale-up"
                delay={i * 0.06}
                className="px-4 py-2 rounded-full text-sm text-white/90 border border-white/35 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors"
              >
                {d}
              </ScrollAnimation>
            ))}
          </div>
        </ScrollAnimation>

        {/* ✅ GRID: gap-6 (24px) for both row and column */}
        <div className="mt-16 mx-auto w-full max-w-[1236px] grid grid-cols-1 xl:grid-cols-2 gap-6 place-items-center">
          {items.map((s: any, idx: number) => {
            const IconComponent = s.iconName ? (LucideIcons as any)[s.iconName] : s.icon;
            const Icon = IconComponent || LucideIcons.Code;

            return (
              <div
                key={s.id}
                className="
                  box-border
                  w-full max-w-[606px] h-auto min-h-[487px]
                  p-[45px]
                  rounded-[24px]
                  border border-[#E6E6E6]
                  bg-white
                  shadow-[0_18px_60px_rgba(13,80,140,0.20)]
                  overflow-hidden
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:shadow-[0_0_40px_rgba(29,143,207,0.3)]
                  hover:border-[#1D8FCF]/40
                "
              >
                <ScrollAnimation variant="scale-up" delay={idx * 0.08}>
                  <div className="h-full flex flex-col items-center gap-[24px]">
                    {/* Icon */}
                    <div
                      className={`
                        w-16 h-16 rounded-2xl
                        flex items-center justify-center
                        bg-gradient-to-br ${s.iconGradient}
                        shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                      `}
                    >
                      <Icon className="text-white" size={28} />
                    </div>

                    {/* Title */}
                    <h3 className="text-center text-gray-900 font-extrabold text-xl md:text-2xl">
                      {s.title}
                    </h3>

                    {/* Description */}
                    <p className="text-center text-gray-600 leading-relaxed text-sm md:text-base">
                      {s.description}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {s.benefits.map((b: string) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-gray-600 bg-gray-50 border border-gray-200"
                        >
                          <CheckCircle2 size={14} className="text-gray-400" />
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Button */}
                    <Link
                      href={s.buttonLink || s.button?.link || "#"}
                      prefetch={true}
                      className="
                        mt-auto
                        inline-flex items-center justify-center gap-3
                        px-6 md:px-7 py-3.5
                        rounded-xl
                        text-white font-semibold text-sm
                        shadow-[0_14px_40px_rgba(29,143,207,0.35)]
                        hover:shadow-[0_18px_54px_rgba(29,143,207,0.45)]
                        transition-all
                        bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)]
                      "
                    >
                      {s.buttonText || s.button?.text || "Xem thêm"}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </ScrollAnimation>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
