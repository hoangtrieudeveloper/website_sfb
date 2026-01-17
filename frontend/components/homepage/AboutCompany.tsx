"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ScrollAnimation } from "../public/ScrollAnimation";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

interface AboutCompanyProps {
  data?: any;
  locale?: 'vi' | 'en' | 'ja';
}

export function AboutCompany({ data, locale: propLocale }: AboutCompanyProps) {
  const { locale: contextLocale } = useLocale();
  const locale = (propLocale || contextLocale) as 'vi' | 'en' | 'ja';
  // Chỉ sử dụng data từ API, không có fallback static data
  if (!data) {
    return null;
  }

  // Localize title và description
  const titleRaw = data?.title;
  const title = titleRaw && typeof titleRaw === 'object' && !Array.isArray(titleRaw)
    ? {
      part1: getLocalizedText(titleRaw.part1, locale),
      highlight1: getLocalizedText(titleRaw.highlight1, locale),
      part2: getLocalizedText(titleRaw.part2, locale),
      highlight2: getLocalizedText(titleRaw.highlight2, locale),
      part3: getLocalizedText(titleRaw.part3, locale),
    }
    : titleRaw;
  const description = typeof data?.description === 'string' ? data.description : getLocalizedText(data?.description, locale);
  const slidesData = data?.slides || [];

  // Không render nếu không có dữ liệu cần thiết
  if (!title || slidesData.length === 0) {
    return null;
  }

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
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-10 xl:px-0 xl:px-[clamp(24px,7.8125vw,150px)]">
        <div className="flex flex-col gap-10 md:gap-[69px]">
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
                  text-[28px] sm:text-[32px] md:text-[40px] lg:text-[56px]
                  leading-[1.2] lg:leading-[71px]
                "
              >
                <span className="xl:whitespace-nowrap">
                  {title.part1}{" "}
                  <span className="font-bold text-[var(--Dark-Blue,#0F172A)]">
                    {title.highlight1}
                  </span>{" "}
                  <span
                    className="text-[var(--Dark-Blue,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[inherit] lg:text-[56px] font-normal leading-[inherit] lg:leading-normal"
                  >
                    {title.part2}
                  </span>
                </span>
                <br className="hidden xl:block" />
                <span className="font-bold text-[var(--Dark-Blue,#0F172A)]">
                  {title.highlight2}
                </span>{" "}
                {title.part3}
              </h2>
            </div>

            <p
              className="
                mx-auto w-full max-w-[1000px] text-center
                font-['Plus_Jakarta_Sans'] text-sm sm:text-base font-normal leading-relaxed sm:leading-[30px]
                text-[var(--Color-2,#0F172A)]
                [font-feature-settings:'liga'_off,'clig'_off]
              "
            >
              {description}
            </p>
          </ScrollAnimation>

          {/* Cards */}
          <div className="mx-auto w-full max-w-[360px] md:max-w-[720px] xl:max-w-[1230px]">
            <ScrollAnimation variant="blur-in" className="relative w-full">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className="flex-[0_0_100%] sm:flex-[0_0_360px] xl:flex-[0_0_410px] pl-4 md:pl-[34px]"
                    >
                      <div
                        className="w-full max-w-[360px] xl:max-w-[410px]"
                      >
                        <div
                          className="
                              group mx-auto w-full
                              max-w-[360px] xl:max-w-[410px]
                              h-[480px] xl:h-[523px]
                              bg-white rounded-[24px]
                              p-4 sm:p-5 xl:p-6
                              border-2 border-gray-100
                                overflow-hidden
                              flex flex-col items-start gap-4 sm:gap-6 xl:gap-6
                              transition-all duration-300
                              hover:-translate-y-1
                            "
                        >
                          {/* IMAGE + RGB LED FRAME */}
                          <div className="relative w-full flex-shrink-0">
                            <div className="rgb-frame p-[3px] rounded-[14px] overflow-hidden">
                              <div className="relative w-full max-w-full h-[234px] max-[1279px]:h-[200px] overflow-hidden rounded-lg bg-white">
                                <ImageWithFallback
                                  src={slide.image || "/images/card-consulting.jpg"}
                                  alt={slide.title || "About Company Slide"}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 410px"
                                  loading="lazy"
                                  objectFit="cover"
                                  className="transition-transform duration-500 group-hover:scale-[1.05]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 w-full flex flex-col items-start text-left gap-4">
                            <h3
                              className="w-full text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-lg sm:text-[20px] font-semibold leading-[30px] transition-colors duration-300 group-hover:text-[#1D8FCF] lg:text-center line-clamp-2"
                            >
                              {typeof slide.title === 'string' ? slide.title : getLocalizedText(slide.title, locale)}
                            </h3>

                            <p
                              className="flex-1 w-full line-clamp-3 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[26px] lg:text-center"
                            >
                              {typeof slide.description === 'string' ? slide.description : getLocalizedText(slide.description, locale)}
                            </p>

                            {/* BUTTON */}
                            <Link
                              href={slide.buttonLink || slide.button?.link || "#"}
                              prefetch={true}
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
                                {typeof (slide.buttonText || slide.button?.text) === 'string'
                                  ? (slide.buttonText || slide.button?.text || "Xem thêm")
                                  : getLocalizedText(slide.buttonText || slide.button?.text, locale) || "Xem thêm"}
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
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
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === (selectedIndex % baseSlides.length)
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
      </div >
    </section >
  );
}
