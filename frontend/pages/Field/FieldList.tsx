"use client";

import { Sparkles, CheckCircle2 } from "lucide-react";
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
    return (
        <section className="py-[90px] relative overflow-hidden">
            <div className="relative z-10 w-full">
                <FadeIn className="text-center mb-16 mx-auto max-w-[1244px]">
                    <h2
                        className="mb-6 mx-auto w-[1244px] max-w-full text-center font-['Plus_Jakarta_Sans'] text-[56px] font-bold"
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

                <div className="px-6 lg:px-[290px]">
                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayIndustries.map((field: any, index: number) => {
                            const IconComponent = field.iconName
                                ? ((LucideIcons as any)[field.iconName] || LucideIcons.Code2)
                                : (field.icon || LucideIcons.Code2);
                            return (
                                <SlideIn
                                    direction="up"
                                    key={field.id}
                                    manualTrigger
                                    className="flex h-[405px] w-[430.6667px] max-w-full flex-[1_0_0] flex-col items-start gap-6 rounded-[24px] px-[30px] py-[45px]"
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
                                        <h3 className="text-lg font-bold text-gray-900 pt-1 leading-snug">
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
                                                        <CheckCircle2 size={12} className="text-white" />
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-600 leading-snug">
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
