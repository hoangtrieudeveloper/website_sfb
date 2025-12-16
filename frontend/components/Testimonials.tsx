"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: true, // Smooth scrolling feeling
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Original data
  const baseTestimonials = [
    {
      id: 1,
      quote:
        "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.",
      author: "Ông Nguyễn Hoàng Chinh",
      rating: 5,
    },
    {
      id: 2,
      quote:
        "Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.",
      author: "Ông Vũ Kim Trung",
      rating: 5,
    },
    {
      id: 3,
      quote:
        "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.",
      author: "Ông Nguyễn Khánh Tùng",
      rating: 5,
    },
    {
      id: 4,
      quote:
        "SFB không chỉ cung cấp giải pháp phần mềm mà còn là người bạn đồng hành tin cậy. Sự hỗ trợ nhiệt tình và chuyên môn cao của đội ngũ kỹ thuật giúp chúng tôi yên tâm vận hành hệ thống 24/7.",
      author: "Ông Nguyễn Khanh",
      rating: 5,
    },
  ];

  // Duplicate to create "infinite" look and enough items for scrolling
  const testimonials = [...baseTestimonials, ...baseTestimonials, ...baseTestimonials];

  // Random-like widths for visual interest
  const widthClasses = [
    "md:flex-[0_0_40%] lg:flex-[0_0_30%]",
    "md:flex-[0_0_50%] lg:flex-[0_0_35%]",
    "md:flex-[0_0_45%] lg:flex-[0_0_28%]",
    "md:flex-[0_0_55%] lg:flex-[0_0_38%]",
  ];

  // Auto-scroll logic
  useEffect(() => {
    if (!emblaApi) return;

    // Auto scroll every 3 seconds
    const intervalId = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [emblaApi]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="bg-[#eff8ff] py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <h2 className="text-center text-[#0F172A] text-4xl md:text-5xl font-bold mb-16">
          Khách hàng nói về SFB?
        </h2>

        {/* Carousel */}
        <div className="relative w-full max-w-[1920px] mx-auto">
          <div className="overflow-hidden px-4 md:px-10 py-10" ref={emblaRef}>
            <div className="flex -ml-6 cursor-grab active:cursor-grabbing items-center">
              {testimonials.map((item, index) => {
                // Determine width class based on original index (modulo)
                const widthClass = widthClasses[index % widthClasses.length];

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={`flex-[0_0_85%] ${widthClass} pl-6 min-w-0 transition-all duration-500`}
                  >
                    <div
                      className="bg-white rounded-[32px] p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-6 h-auto"
                    >
                      {/* Stars */}
                      <div className="flex gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className="fill-[#FBBF24] text-[#FBBF24]"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-[#334155] text-[15px] leading-relaxed">
                        “{item.quote}”
                      </p>

                      {/* Author */}
                      <div className="font-bold text-[#0F172A] text-[15px] mt-auto">
                        {item.author}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Pagination - Hidden for infinite marquee feel or optional */}
          <div className="flex justify-center gap-2 mt-12 flex-wrap">
            {scrollSnaps.map((_, index) => (
              // Only show dots for the first set to avoid clutter
              index < baseTestimonials.length ? (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex % baseTestimonials.length
                    ? "bg-[#0F172A] w-6"
                    : "bg-[#94A3B8] hover:bg-[#64748B]"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ) : null
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}