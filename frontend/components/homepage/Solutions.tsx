"use client";

import Link from "next/link";
import { ScrollAnimation } from "../public/ScrollAnimation";
import { solutionsSectionData } from "./data";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function Solutions() {



  return (
    <section
      id="solutions"
      className="relative py-24 overflow-visible"
      style={{
        background: "linear-gradient(236.99deg, #80C0E4 7%, #1D8FCF 71.94%)",
      }}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollAnimation variant="fade-down" className="text-center max-w-5xl mx-auto">
          <div className="text-white/85 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            {solutionsSectionData.subHeader}
          </div>

          <h2 className="text-white font-extrabold leading-tight text-3xl md:text-5xl">
            {solutionsSectionData.title.part1}
            <br />
            <span className="font-medium">{solutionsSectionData.title.part2}</span>
          </h2>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {solutionsSectionData.domains.map((d, i) => (
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
        <div className="mt-16 grid grid-cols-1 xl:grid-cols-2 gap-6 place-items-center">
          {solutionsSectionData.items.map((s, idx) => {
            const Icon = s.icon;

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
                      {s.benefits.map((b) => (
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
                      href={s.buttonLink}
                      className="
                        mt-auto
                        inline-flex items-center justify-center gap-3
                        px-6 md:px-7 py-3.5
                        rounded-xl
                        text-white font-semibold text-sm
                        shadow-[0_14px_40px_rgba(29,143,207,0.35)]
                        hover:shadow-[0_18px_54px_rgba(29,143,207,0.45)]
                        transition-all
                      "
                      style={{
                        background:
                          "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                      }}
                    >
                      {s.buttonText}
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
