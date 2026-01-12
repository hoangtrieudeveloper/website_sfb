"use client";

import { Sparkles, Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { fieldListSectionData } from "./data";
import { FadeIn, SlideIn, StaggerContainer } from "../../components/ui/motion";
import * as LucideIcons from "lucide-react";

interface FieldListProps {
    headerData?: any;
    industries?: any[];
}

export function FieldList({ headerData, industries }: FieldListProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayHeader = headerData || fieldListSectionData.header;
    const displayIndustries = industries || fieldListSectionData.items;

    const titleRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
    const [isSingleLineTitle, setIsSingleLineTitle] = useState<Record<string, boolean>>({});

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    const industriesKey = useMemo(() => {
        return (displayIndustries || [])
            .map((item: any, idx: number) => String(item?.id ?? idx))
            .join("|");
    }, [displayIndustries]);

    const measureTitles = useCallback(() => {
        const next: Record<string, boolean> = {};

        for (const [key, el] of Object.entries(titleRefs.current)) {
            if (!el) continue;
            const styles = window.getComputedStyle(el);
            const lineHeight = Number.parseFloat(styles.lineHeight || "0");
            const height = el.getBoundingClientRect().height;

            // Fallback: if line-height is 'normal' or unparsable, assume not single-line.
            if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
                next[key] = false;
                continue;
            }

            // Allow a bit of tolerance due to subpixel/layout rounding.
            next[key] = height <= lineHeight * 1.35;
        }

        setIsSingleLineTitle(next);
    }, []);

    useEffect(() => {
        measureTitles();
        window.addEventListener("resize", measureTitles);
        return () => window.removeEventListener("resize", measureTitles);
    }, [measureTitles, industriesKey]);

    // Function to render a card (reused to avoid code duplication)
    const renderCard = (field: any, index: number, isMobile = false) => {
        const titleKey = String(field?.id ?? index);
        const IconComponent = field.iconName
            ? ((LucideIcons as any)[field.iconName] || LucideIcons.Code2)
            : (field.icon || LucideIcons.Code2);

        const cardContent = (
            <div
                className={`flex h-auto w-full flex-col items-start gap-6 rounded-[24px] px-6 py-8 md:px-[30px] md:py-[45px] h-full`}
                style={{
                    background: "var(--Color-7, #FFF)",
                    border: isMobile ? "1px solid #E2E8F0" : "0px solid var(--Linear, #1D8FCF)",
                    boxShadow: isMobile ? "none" : "0px 12px 36px 0px rgba(59, 90, 136, 0.12)",
                }}
            >
                <div className={`flex gap-4 ${isSingleLineTitle[titleKey] ? "items-center" : "items-start"}`}>
                    <div className="flex-shrink-0 w-12 h-12 bg-[#008CCB] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                        {index + 1}
                    </div>
                    <h3
                        ref={(el) => {
                            if (!isMobile) titleRefs.current[titleKey] = el;
                        }}
                        className="text-lg font-bold text-gray-900 leading-snug"
                    >
                        {field.title}
                    </h3>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed min-h-[40px]">
                    {field.short}
                </p>

                <ul className="space-y-3">
                    {field.points.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="w-5 h-5 rounded-full bg-[#008CCB] flex items-center justify-center">
                                    <Check size={12} className="text-white" />
                                </div>
                            </div>
                            <span className="text-sm text-gray-600 leading-snug">
                                {point}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );

        if (isMobile) {
            return cardContent;
        }

        return (
            <SlideIn
                direction="up"
                key={field.id}
                className="h-full"
            >
                {cardContent}
            </SlideIn>
        );
    };

    return (
        <section className="py-12 md:py-[90px] relative overflow-hidden">
            <div className="relative z-10 w-full container mx-auto px-4 md:px-6">
                <FadeIn className="text-center mb-10 md:mb-16 mx-auto max-w-[1244px]">
                    <h2
                        className="mb-4 md:mb-6 mx-auto w-full text-center font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl lg:text-[56px] font-bold"
                        style={{
                            color: "var(--Color-2, #0F172A)",
                            fontFeatureSettings: "'liga' off, 'clig' off",
                            lineHeight: "1.2",
                        }}
                    >
                        {displayHeader.title}
                    </h2>
                    {displayHeader.description && (
                        <p
                            className="mx-auto w-full max-w-[704px] text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-normal md:leading-[30px]"
                            style={{
                                color: "var(--Color-2, #0F172A)",
                                fontFeatureSettings: "'liga' off, 'clig' off",
                            }}
                        >
                            {displayHeader.description}
                        </p>
                    )}
                </FadeIn>

                <div className="w-full">
                    {/* Desktop View: Grid */}
                    <StaggerContainer className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayIndustries.map((field: any, index: number) => renderCard(field, index, false))}
                    </StaggerContainer>

                    {/* Mobile View: Infinite Slider (Embla Carousel) */}
                    <div className="md:hidden">
                        <div className="overflow-hidden -mx-4 px-4 pb-8" ref={emblaRef}>
                            <div className="flex touch-pan-y touch-pinch-zoom backface-hidden">
                                {displayIndustries.map((field: any, index: number) => (
                                    <div
                                        className="flex-[0_0_85%] min-w-0 pl-4 first:pl-2 last:pr-4"
                                        key={field.id}
                                    >
                                        {renderCard(field, index, true)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                            {displayIndustries.map((_: any, index: number) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                            ? "w-8 bg-[#008CCB]"
                                            : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function FieldListPage() {
    return null;
}
