"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ScrollAnimation } from "../public/ScrollAnimation";
import { solutionsSectionData } from "./data";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface SolutionsProps {
  data?: any;
}

// ---------------------------
// HELPER: CARD COMPONENT
// ---------------------------
function SolutionCard({ s, idx }: { s: any; idx: number }) {
  const IconComponent = s.iconName ? (LucideIcons as any)[s.iconName] : s.icon;
  const Icon = IconComponent || LucideIcons.Code;

  return (
    <div
      className="
        box-border w-full h-full
        min-h-[340px] md:min-h-[450px]
        p-6 md:p-[45px]
        rounded-[24px]
        border border-[#E6E6E6]
        bg-white
        shadow-[0_18px_60px_rgba(13,80,140,0.20)]
        overflow-hidden
        transition-all duration-300
        hover:-translate-y-2
        hover:shadow-[0_0_40px_rgba(29,143,207,0.3)]
        hover:border-[#1D8FCF]/40
        flex flex-col
      "
    >
      <ScrollAnimation variant="scale-up" delay={idx * 0.08} className="h-full w-full">
        <div className="h-full flex flex-col items-center gap-4 md:gap-[24px]">
          {/* Icon */}
          <div
            className={`
              w-16 h-16 rounded-2xl
              flex items-center justify-center
              bg-gradient-to-br ${s.iconGradient}
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              flex-shrink-0
            `}
          >
            <Icon className="text-white" size={28} />
          </div>

          {/* Title */}
          <h3 className="text-center text-gray-900 font-extrabold text-lg md:text-2xl">
            {s.title}
          </h3>

          {/* Description */}
          {/* Description */}
          <p className="text-center text-gray-600 leading-relaxed text-sm md:text-base">
            {s.description}
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-2">
            {s.benefits.map((b: string) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs text-gray-600 bg-gray-50 border border-gray-200"
              >
                <CheckCircle2 size={14} className="text-gray-400" />
                {b}
              </span>
            ))}
          </div>

          {/* Button */}
          <Link
            href={s.buttonLink || s.button?.link || "#"}
            className="
              mt-auto
              inline-flex items-center justify-center gap-3
              px-6 md:px-7 py-3.5
              rounded-xl
              text-white font-semibold text-xs md:text-sm
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
}

export function Solutions({ data }: SolutionsProps) {
  // Use data from props if available, otherwise fallback to static data
  const subHeader = data?.subHeader || solutionsSectionData.subHeader;
  const title = data?.title || solutionsSectionData.title;
  const domains = data?.domains || solutionsSectionData.domains;
  const items = data?.items || solutionsSectionData.items;

  // Embla for Mobile/Tablet
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect(); // Initial sync
  }, [emblaApi, onSelect]);

  const scrollToDot = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  return (
    <section
      id="solutions"
      className="relative py-10 sm:py-20 lg:py-[120px] overflow-visible bg-[linear-gradient(236.99deg,#80C0E4_7%,#1D8FCF_71.94%)]"
    >
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-10 xl:px-0 xl:px-[clamp(24px,7.8125vw,150px)]">
        {/* Header */}
        <ScrollAnimation
          variant="fade-down"
          className="mx-auto w-full max-w-5xl self-stretch text-center flex flex-col items-center gap-3 sm:gap-6"
        >
          <div className="self-stretch text-center text-[var(--light-blue,#EFF6FF)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[15px] font-medium leading-normal uppercase">
            {subHeader}
          </div>

          <h2 className="mx-auto w-full max-w-[840px] text-center text-[var(--White,#FFF)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-2xl sm:text-4xl lg:text-[56px] leading-normal">
            <span className="font-bold">{title.part1}</span>
            <br />
            <span className="font-normal">{title.part2}</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-1 sm:gap-2.5 w-full">
            {domains.map((d: string, i: number) => (
              <ScrollAnimation
                key={d}
                variant="scale-up"
                delay={i * 0.06}
                className="max-w-[110px] sm:max-w-none truncate px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm text-white/90 border border-white/35 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors whitespace-nowrap"
              >
                {d}
              </ScrollAnimation>
            ))}
          </div>
        </ScrollAnimation>

        {/* --------------------------- */}
        {/* DESKTOP GRID (>= lg) */}
        {/* --------------------------- */}
        <div className="hidden lg:grid mt-16 mx-auto w-full max-w-[1236px] grid-cols-2 gap-6 place-items-center">
          {items.map((s: any, idx: number) => (
            <div key={s.id} className="w-full max-w-[606px]">
              <SolutionCard s={s} idx={idx} />
            </div>
          ))}
        </div>

        {/* --------------------------- */}
        {/* MOBILE CAROUSEL (< lg) */}
        {/* --------------------------- */}
        <div className="mt-12 lg:hidden w-full relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {items.map((s: any, idx: number) => (
                <div
                  key={s.id}
                  className="flex-[0_0_100%] min-w-0 px-2 flex justify-center"
                >
                  <div className="w-full max-w-[400px] md:max-w-[600px]">
                    <SolutionCard s={s} idx={idx} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToDot(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                  ? "bg-white w-6"
                  : "bg-white/40 hover:bg-white/60"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
