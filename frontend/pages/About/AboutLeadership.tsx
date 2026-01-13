"use client";

import { useState, useEffect } from "react";
import { Phone, Mail } from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "../../components/ui/carousel";

import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { FadeIn, InViewSection } from "../../components/ui/motion";
import { motion } from "framer-motion";

interface AboutLeadershipProps {
    data?: any;
}

export function AboutLeadership({ data }: AboutLeadershipProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);
    // Chỉ sử dụng data từ API, không fallback static data
    if (!data || !data.data) {
        return null;
    }

    const displayData = data.data;
    const headerTitle = displayData.headerTitle;
    const headerDescription = displayData.headerDescription;
    const items = displayData.items || [];

    // Không render nếu không có items
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="py-10 sm:py-20 bg-white">
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <InViewSection className="mx-auto w-full max-w-[1408px]">
                    {/* Header */}
                    <FadeIn className="text-center mb-8 sm:mb-16 max-w-4xl mx-auto">
                        {headerTitle && (
                            <h2 className="text-[#0F172A] text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
                                {headerTitle}
                            </h2>
                        )}
                        {headerDescription && (
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                                {headerDescription}
                            </p>
                        )}
                    </FadeIn>

                    {/* Carousel */}
                    <FadeIn delay={0.2} className="px-[clamp(16px,3.125vw,48px)] relative">
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-[34px] py-4">
                                {items.filter((item: any) => item.isActive !== false).map((leader: any, index: number) => (
                                    <CarouselItem key={index} className="pl-[34px] basis-full md:basis-1/2 lg:basis-1/3">
                                        <motion.div
                                            whileHover={{ y: -8 }}
                                            className="group flex flex-col w-full lg:w-[410px] lg:h-[523px] p-6 items-start gap-6 rounded-[24px] bg-white shadow-none lg:shadow-[0_8px_30px_0_rgba(0,0,0,0.06)] transition-all duration-300 mx-auto"
                                        >
                                            <div className="relative h-[234px] flex-shrink-0 self-stretch rounded-[8px] overflow-hidden bg-gray-200 lg:ml-auto min-[1920px]:w-[410px] min-[1920px]:h-[234px] min-[1920px]:aspect-auto">
                                                <ImageWithFallback
                                                    src={leader.image}
                                                    alt={leader.name ? `${leader.name} - ${leader.position || 'Leadership'}` : "Leadership Team Member"}

                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    loading="lazy"
                                                    objectFit="contain"
                                                    className="rounded-[8px] transition-opacity duration-300"
                                                />
                                            </div>

                                            <div className="flex flex-col items-start w-full">
                                                <h3 className="self-stretch text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px] [font-feature-settings:'liga'_off,'clig'_off] mb-1">
                                                    {leader.name}
                                                </h3>

                                                <div className="w-full max-w-[336px] self-center text-[#1D8FCF] text-center font-['Plus_Jakarta_Sans'] text-[13px] font-medium leading-normal uppercase [font-feature-settings:'liga'_off,'clig'_off] overflow-hidden text-ellipsis line-clamp-1 mb-3">
                                                    {leader.position}
                                                </div>

                                                <p className="w-full max-w-[336px] self-center text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[26px] [font-feature-settings:'liga'_off,'clig'_off] mb-0">
                                                    {leader.description}
                                                </p>
                                            </div>

                                            <div className="mt-auto flex flex-row flex-wrap sm:flex-nowrap gap-4 sm:gap-6 w-full pt-4 border-t border-gray-100 group-hover:border-blue-50 items-center justify-center">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={16} className="text-[#2CA4E0] flex-shrink-0" />
                                                    <a href={`tel:${leader.phone}`} className="text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[26px] [font-feature-settings:'liga'_off,'clig'_off] hover:text-[#2CA4E0] transition-colors whitespace-nowrap">
                                                        {leader.phone}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={16} className="text-[#2CA4E0] flex-shrink-0" />
                                                    <a href={`mailto:${leader.email}`} className="text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[26px] [font-feature-settings:'liga'_off,'clig'_off] hover:text-[#2CA4E0] transition-colors whitespace-nowrap">
                                                        {leader.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex -left-12 border-[#2CA4E0] text-[#2CA4E0] hover:bg-[#2CA4E0] hover:text-white" />
                            <CarouselNext className="hidden md:flex -right-12 border-[#2CA4E0] text-[#2CA4E0] hover:bg-[#2CA4E0] hover:text-white" />
                        </Carousel>

                        {/* Mobile Indicators */}
                        <div className="flex justify-center gap-2 mt-6 md:hidden">
                            {Array.from({ length: count }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-[#2CA4E0]" : "w-2 bg-gray-300"
                                        }`}
                                    onClick={() => api?.scrollTo(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </FadeIn>
                </InViewSection>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutLeadership;
