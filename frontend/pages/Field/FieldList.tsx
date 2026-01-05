"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { fieldListSectionData } from "./data";
import { FadeIn, SlideIn, StaggerContainer } from "../../components/ui/motion";
import * as LucideIcons from "lucide-react";

function CardTitle({ title }: { title: string }) {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const [isSingleLine, setIsSingleLine] = useState(false);

    useEffect(() => {
        const el = titleRef.current;
        if (!el) return;

        const measure = () => {
            // Multiple client rects usually indicates wrapping to multiple lines.
            setIsSingleLine(el.getClientRects().length <= 1);
        };

        measure();

        const onResize = () => measure();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [title]);

    return (
        <h3
            ref={titleRef}
            className={`font-bold text-gray-900 leading-snug text-[clamp(16px,calc(16px+(100vw-1024px)*0.0022321),18px)] ${isSingleLine ? "self-center" : "pt-1"}`}
        >
            {title}
        </h3>
    );
}

interface FieldListProps {
    headerData?: any;
    industries?: any[];
}

export function FieldList({ headerData, industries }: FieldListProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayHeader = headerData || fieldListSectionData.header;
    const displayIndustries = industries || fieldListSectionData.items;
    return (
        <section className="py-[clamp(60px,calc(60px+(100vw-1024px)*0.0334821),90px)] max-sm:py-[clamp(40px,10vw,60px)] relative overflow-hidden">
            <div className="relative z-10 w-full">
                <FadeIn className="text-center mb-[69px] mx-auto max-w-[1244px]"> 
                    <h2
                        className="mb-6 mx-auto w-[1244px] max-w-full text-center font-['Plus_Jakarta_Sans'] text-[clamp(36px,2.9167vw,56px)] max-md:text-[clamp(28px,7.5vw,36px)] font-bold"
                        style={{
                            color: "var(--Color-2, #0F172A)",
                            fontFeatureSettings: "'liga' off, 'clig' off",
                            lineHeight: "normal",
                        }}
                    >
                        {displayHeader.title}
                    </h2>
                    {displayHeader.description && (
                        <p
                            className="mx-auto w-[704px] max-w-full text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-[30px]"
                            style={{
                                color: "var(--Color-2, #0F172A)",
                                fontFeatureSettings: "'liga' off, 'clig' off",
                            }}
                        >
                            {displayHeader.description}
                        </p>
                    )}
                </FadeIn>

                <div className="px-6 lg:px-[clamp(48px,calc(48px+(100vw-1024px)*0.270089),290px)]">
                    <StaggerContainer className="grid justify-items-center md:grid-cols-2 xl:grid-cols-3 xl:justify-items-stretch gap-6">
                        {displayIndustries.map((field: any, index: number) => {
                            const IconComponent = field.iconName 
                                ? ((LucideIcons as any)[field.iconName] || LucideIcons.Code2)
                                : (field.icon || LucideIcons.Code2);
                            return (
                            <SlideIn
                                direction="up"
                                key={field.id}
                                className="flex min-h-[405px] w-full max-w-[430.6667px] flex-[1_0_0] flex-col items-start gap-[clamp(16px,calc(16px+(100vw-1024px)*0.0089286),24px)] rounded-[24px] px-[clamp(20px,calc(20px+(100vw-1024px)*0.0111607),30px)] py-[clamp(28px,calc(28px+(100vw-1024px)*0.0189732),45px)]"
                                style={{
                                    background: "var(--Color-7, #FFF)",
                                    border: "0px solid var(--Linear, #1D8FCF)",
                                    boxShadow: "0px 12px 36px 0px rgba(59, 90, 136, 0.12)",
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#008CCB] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                        {index + 1}
                                    </div>
                                    <CardTitle title={field.title} />
                                </div>

                                <p
                                    className="self-stretch w-full max-w-[370.6667px] font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[30px]"
                                    style={{
                                        color: "var(--Color-2, #0F172A)",
                                        fontFeatureSettings: "'liga' off, 'clig' off",
                                    }}
                                >
                                    {field.short}
                                </p>

                                <ul className="space-y-3">
                                    {field.points.map((point: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="w-5 h-5 rounded-full bg-[#008CCB] overflow-hidden flex items-center justify-center">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            </div>
                                            <span
                                                className="w-full max-w-[338.6666px] flex-[1_0_0] font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[26px]"
                                                style={{ color: "var(--Color-2, #0F172A)" }}
                                            >
                                                {point}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </SlideIn>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function FieldListPage() {
    return null;
}
