"use client";

import Link from "next/link";
import { ScrollAnimation } from "../public/ScrollAnimation";

import { aboutSlides, aboutCompanyData } from "./data";

export function AboutCompany() {

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollAnimation
          variant="fade-down"
          className="text-center max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] leading-tight mb-6">
            {aboutCompanyData.title.part1}
            <span>{aboutCompanyData.title.highlight1}</span>
            {aboutCompanyData.title.part2}
            <span>{aboutCompanyData.title.highlight2}</span>
            {aboutCompanyData.title.part3}
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {aboutCompanyData.description}
          </p>
        </ScrollAnimation>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center">
          {aboutSlides.map((slide, index) => (
            <ScrollAnimation
              key={index}
              variant="elastic-up"
              delay={index * 0.1}
              className="w-full max-w-[410px]"
            >
              <div
                className="
                  group w-full bg-white rounded-3xl p-6
                  border-2 border-gray-100
                  shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                  flex flex-col
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_60px_rgba(0,0,0,0.10)]
                "
                style={{ minHeight: "523px" }}
              >
                {/* IMAGE + RGB LED FRAME */}
                <div className="relative w-full mb-6 flex-shrink-0">
                  <div className="rgb-frame p-[3px] rounded-[14px]">
                    <div
                      className="relative w-full overflow-hidden rounded-lg bg-white"
                      style={{ height: "234px" }}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="
                          w-full h-full object-cover
                          transition-transform duration-500
                          group-hover:scale-[1.05]
                        "
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col text-center">
                  <h3
                    className="mb-4 transition-colors duration-300 group-hover:text-[#1D8FCF]"
                    style={{
                      color: "#0F172A",
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: "20px",
                      fontWeight: 600,
                      lineHeight: "30px",
                    }}
                  >
                    {slide.title}
                  </h3>

                  <p
                    className="mb-6 flex-1 line-clamp-4"
                    style={{
                      color: "#0F172A",
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "26px",
                    }}
                  >
                    {slide.description}
                  </p>

                  {/* BUTTON */}
                  <Link
                    href={slide.buttonLink}
                    className="
                      relative mt-auto w-full h-12 rounded-lg
                      flex items-center justify-center gap-2
                      text-white font-semibold
                      overflow-hidden
                      transition-all duration-300
                      hover:-translate-y-0.5
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-offset-2
                      focus-visible:ring-[#2EABE2]
                    "
                    style={{
                      background:
                        "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {slide.buttonText}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
