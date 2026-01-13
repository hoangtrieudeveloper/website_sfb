"use client";

// Icons are now imported in data.tsx and passed as components

import { coreValues } from "./data";
import { FadeIn, StaggerContainer, InViewSection } from "../../components/ui/motion";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

interface AboutCoreValuesProps {
    data?: any;
    locale?: 'vi' | 'en' | 'ja';
}

const CoreValueCard = ({ item, className = "", enableHover = true, locale = 'vi' }: { item: any, className?: string, enableHover?: boolean, locale?: 'vi' | 'en' | 'ja' }) => {
    const IconComponent = item.iconName
        ? ((LucideIcons as any)[item.iconName] || LucideIcons.Lightbulb)
        : (item.icon || LucideIcons.Lightbulb);
    
    const itemTitle = typeof item.title === 'string' ? item.title : getLocalizedText(item.title, locale);
    const itemDescription = typeof item.description === 'string' ? item.description : getLocalizedText(item.description, locale);

    return (
        <motion.div
            whileHover={enableHover ? { y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" } : {}}
            className={`bg-white rounded-[24px] p-6 sm:p-8 flex flex-col items-center text-center shadow-[0_18px_36px_0_rgba(0,0,0,0.05)] transition-all duration-300 h-full border border-transparent lg:hover:border-blue-100 ${className}`}
        >
            <motion.div
                className="mb-6 text-[#2CA4E0] p-4 bg-blue-50/50 rounded-full"
                whileHover={enableHover ? { rotate: 360, backgroundColor: "#E0F2FE" } : {}}
                transition={{ duration: 0.6 }}
            >
                <IconComponent size={32} strokeWidth={1.5} className="w-8 h-8 sm:w-12 sm:h-12" />
            </motion.div>
            <h3 className="text-[#0F172A] text-lg sm:text-xl font-bold mb-3">
                {itemTitle}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                {itemDescription}
            </p>
        </motion.div>
    );
};

export function AboutCoreValues({ data, locale: propLocale }: AboutCoreValuesProps) {
    const { locale: contextLocale } = useLocale();
    const locale = (propLocale || contextLocale || 'vi') as 'vi' | 'en' | 'ja';
    
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || { items: coreValues };
    const headerTitleRaw = displayData.headerTitle || "Giá trị cốt lõi";
    const headerDescriptionRaw = displayData.headerDescription || "Những nguyên tắc định hình văn hoá và cách SFB hợp tác với khách hàng, đối tác và đội ngũ nội bộ";
    const items = displayData.items || coreValues;
    
    // Localize fields
    const headerTitle = typeof headerTitleRaw === 'string' ? headerTitleRaw : getLocalizedText(headerTitleRaw, locale);
    const headerDescription = typeof headerDescriptionRaw === 'string' ? headerDescriptionRaw : getLocalizedText(headerDescriptionRaw, locale);

    return (
        <section className="py-10 sm:py-20" style={{ background: 'linear-gradient(158deg, #F1F9FD 28.21%, #FFF 69.34%)' }}>
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
                                <CoreValueCard item={item} locale={locale} />
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

// Mobile Slider Component
function MobileSlider({ items }: { items: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true });
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
                <div className="flex touch-pan-y touch-pinch-zoom">
                    {items.map((item, index) => (
                        <div key={index} className="flex-[0_0_85%] min-w-0 px-2 py-8">
                            <CoreValueCard item={item} enableHover={false} />
                        </div>
                    ))}
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
