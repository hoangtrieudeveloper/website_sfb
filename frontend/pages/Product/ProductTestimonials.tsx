"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { testimonials } from "./data";

export function ProductTestimonials() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);


    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const scrollToSlide = (index: number) => {
        api?.scrollTo(index);
    };

    return (
        <section
            className="w-full flex flex-col items-center gap-[60px] py-[120px] overflow-hidden"
            style={{
                background:
                    "linear-gradient(237deg, rgba(128, 192, 228, 0.10) 7%, rgba(29, 143, 207, 0.10) 71.94%)",
            }}
        >
            <div className="w-full max-w-[1920px] mx-auto px-6">
                <h2 className="text-center text-4xl md:text-5xl font-extrabold text-gray-900">
                    Khách hàng nói gì về SFB ?
                </h2>

                {/* Carousel */}
                <div className="w-full mt-[60px] px-0 md:px-10">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {testimonials.map((t, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                                    <div className="bg-white rounded-[28px] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.08)] h-full mx-4">
                                        {/* Stars */}
                                        <div className="flex items-center gap-1 mb-6">
                                            {Array.from({ length: t.rating }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className="text-yellow-400 fill-yellow-400"
                                                />
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <p className="text-gray-700 leading-relaxed text-sm mb-8 line-clamp-4">
                                            “{t.quote}”
                                        </p>

                                        {/* Author */}
                                        <div className="text-sm font-semibold text-gray-900">
                                            {t.author}
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                {/* Dots */}
                <div className="flex items-center justify-center gap-2 mt-10">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToSlide(i)}
                            aria-label={`Đi tới phản hồi ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${current === i ? "w-8 bg-[#1E293B]" : "w-2 bg-[#9CA3AF]"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ProductTestimonialsPage() {
    return null;
}