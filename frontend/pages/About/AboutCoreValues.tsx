"use client";

// Icons are now imported in data.tsx and passed as components

import { coreValues } from "./data";
import { FadeIn, StaggerContainer, InViewSection } from "../../components/ui/motion";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

interface AboutCoreValuesProps {
    data?: any;
}

const CoreValueCard = ({ item, className = "" }: { item: any, className?: string }) => {
    const IconComponent = item.iconName
        ? ((LucideIcons as any)[item.iconName] || LucideIcons.Lightbulb)
        : (item.icon || LucideIcons.Lightbulb);

    return (
        <motion.div
            whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
            className={`bg-white rounded-[24px] p-6 sm:p-8 flex flex-col items-center text-center shadow-[0_18px_36px_0_rgba(0,0,0,0.05)] transition-all duration-300 h-full border border-transparent hover:border-blue-100 ${className}`}
        >
            <motion.div
                className="mb-6 text-[#2CA4E0] p-4 bg-blue-50/50 rounded-full"
                whileHover={{ rotate: 360, backgroundColor: "#E0F2FE" }}
                transition={{ duration: 0.6 }}
            >
                <IconComponent size={32} strokeWidth={1.5} className="w-8 h-8 sm:w-12 sm:h-12" />
            </motion.div>
            <h3 className="text-[#0F172A] text-lg sm:text-xl font-bold mb-3">
                {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                {item.description}
            </p>
        </motion.div>
    );
};

export function AboutCoreValues({ data }: AboutCoreValuesProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || { items: coreValues };
    const headerTitle = displayData.headerTitle || "Giá trị cốt lõi";
    const headerDescription = displayData.headerDescription || "Những nguyên tắc định hình văn hoá và cách SFB hợp tác với khách hàng, đối tác và đội ngũ nội bộ";
    const items = displayData.items || coreValues;

    return (
        <section className="py-10 sm:py-20 bg-[#F8FBFE]">
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <InViewSection className="mx-auto w-full max-w-[1340px]">
                    {/* Header */}
                    <FadeIn className="text-center mb-8 sm:mb-16">
                        {headerTitle && (
                            <h2 className="text-[#0F172A] text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
                                {headerTitle}
                            </h2>
                        )}
                        {headerDescription && (
                            <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
                                {headerDescription}
                            </p>
                        )}
                    </FadeIn>

                    {/* Desktop Grid (>= lg) */}
                    <StaggerContainer className="hidden lg:grid lg:grid-cols-3 gap-6">
                        {items.filter((item: any) => item.isActive !== false).map((item: any, idx: number) => (
                            <FadeIn key={item.id || idx}>
                                <CoreValueCard item={item} />
                            </FadeIn>
                        ))}
                    </StaggerContainer>

                    {/* Mobile Slider (< lg) */}
                    <div className="lg:hidden">
                        <MobileSlider items={items.filter((item: any) => item.isActive !== false)} />
                    </div>
                </InViewSection>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
// Mobile Slider Component
function MobileSlider({ items }: { items: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y touch-pinch-zoom gap-4 ml-[-1rem]">
                    {items.map((item, index) => (
                        <div key={index} className="flex-[0_0_85%] min-w-0 pl-4">
                            <CoreValueCard item={item} className="shadow-none border-gray-200" />
                        </div>
                    ))}
                    {/* Spacer for right padding */}
                    <div className="flex-[0_0_1px]" />
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {items.map((_: any, index: number) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-[#2CA4E0] w-6" : "bg-blue-100"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutCoreValues;
