"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ScrollAnimation } from "../public/ScrollAnimation";

import { aboutSlides, aboutCompanyData } from "./data";

interface AboutCompanyProps {
  data?: any;
}

export function AboutCompany({ data }: AboutCompanyProps) {
  // Use data from props if available, otherwise fallback to static data
  const title = data?.title || aboutCompanyData.title;
  const description = data?.description || aboutCompanyData.description;
  const slidesData = data?.slides || aboutSlides;
  
  const baseSlides = slidesData;
  const slides = [...baseSlides, ...baseSlides, ...baseSlides];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true,
    duration: 80,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((api: any) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);

    // Start in the middle set so we can scroll both directions.
    emblaApi.scrollTo(baseSlides.length, true);

    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  // Auto-scroll slow (same spirit as Testimonials)
  useEffect(() => {
    if (!emblaApi) return;
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const scrollToDot = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index + baseSlides.length);
    },
    [emblaApi, baseSlides.length]
  );

  return (
    <section id="about" className="py-[90px] bg-[#F4FAFE] overflow-hidden">
      <div className="mx-auto w-full max-w-[1920px] px-6 xl:px-0 xl:px-[clamp(24px,7.8125vw,150px)]">
        <div className="flex flex-col gap-[69px]">
          {/* Header */}
          <ScrollAnimation
            variant="fade-down"
            className="text-center mx-auto"
          >
            <div className="mx-auto mb-6 w-full max-w-[1244px]">
              <h2
                className="
                  mx-auto w-full text-center
                  font-['Plus_Jakarta_Sans'] font-medium
                  text-[var(--Dark-Blue,#0F172A)]
                  [font-feature-settings:'liga'_off,'clig'_off]
                  text-[clamp(32px,4.6vw,56px)]
                  leading-[clamp(40px,5.8vw,71px)]
                "
              >
                <span className="lg:whitespace-nowrap">
                  {title.part1}
                  <span className="font-bold text-[var(--Dark-Blue,#0F172A)]">
                    {title.highlight1}
                  </span>
                  <span
                    className="text-[var(--Dark-Blue,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[inherit] lg:text-[56px] font-normal leading-[inherit] lg:leading-normal"
                  >
                    {title.part2}
                  </span>
                </span>
                <br className="hidden lg:block" />
                <span className="font-bold text-[var(--Dark-Blue,#0F172A)]">
                  {title.highlight2}
                </span>
                {title.part3}
              </h2>
            </div>

            <p
              className="
                mx-auto w-full max-w-[1000px] text-center
                font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[30px]
                text-[var(--Color-2,#0F172A)]
                [font-feature-settings:'liga'_off,'clig'_off]
              "
            >
              {description}
            </p>
          </ScrollAnimation>

          {/* Cards */}
          <div className="mx-auto w-full max-w-[410px] sm:max-w-[860px] lg:max-w-[1340px]">
            <ScrollAnimation variant="blur-in" className="relative w-full">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-[34px]">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className="flex-[0_0_100%] sm:flex-[0_0_410px]"
                    >
                      <ScrollAnimation
                        variant="elastic-up"
                        delay={index * 0.1}
                        className="w-full max-w-[410px]"
                      >
                        <div
                          className="
                            group mx-auto w-full max-w-[410px] h-[523px]
                            bg-white rounded-3xl p-6
                            border-2 border-gray-100
                            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                            flex flex-col items-start gap-6
                            transition-all duration-300
                            hover:-translate-y-1
                            hover:shadow-[0_18px_60px_rgba(0,0,0,0.10)]
                          "
                        >
                          {/* IMAGE + RGB LED FRAME */}
                          <div className="relative w-full flex-shrink-0">
                            <div className="rgb-frame p-[3px] rounded-[14px]">
                              <div className="relative w-full h-[234px] overflow-hidden rounded-lg bg-white">
                                <img
                                  src={slide.image || "/images/card-consulting.jpg"}
                                  alt={slide.title || "Slide"}
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
                          <div className="flex-1 w-full flex flex-col items-start text-left gap-4">
                            <h3
                              className="text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px] transition-colors duration-300 group-hover:text-[#1D8FCF]"
                            >
                              {slide.title}
                            </h3>

                            <p
                              className="flex-1 line-clamp-4 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[26px]"
                            >
                              {slide.description}
                            </p>

                            {/* BUTTON */}
                            <Link
                              href={slide.buttonLink || slide.button?.link || "#"}
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
                                bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)]
                              "
                            >
                              <span className="relative z-10 flex items-center gap-2">
                                {slide.buttonText || slide.button?.text || "Xem thêm"}
                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                  →
                                </span>
                              </span>
                            </Link>
                          </div>
                        </div>
                      </ScrollAnimation>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Pagination */}
              <div className="flex justify-center gap-2 mt-10 flex-wrap">
                {baseSlides.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => scrollToDot(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === (selectedIndex % baseSlides.length)
                        ? "bg-[#0F172A] w-6"
                        : "bg-[#94A3B8] hover:bg-[#64748B]"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
