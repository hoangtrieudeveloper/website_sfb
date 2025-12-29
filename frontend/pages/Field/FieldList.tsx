"use client";

import { Sparkles, CheckCircle2 } from "lucide-react";
import { fieldListSectionData } from "./data";
import { FadeIn, SlideIn, StaggerContainer } from "../../components/ui/motion";

export function FieldList() {
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
                        {fieldListSectionData.header.title}
                    </h2>
                    <p
                        className="mx-auto w-[704px] max-w-full text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-[30px]"
                        style={{
                            color: "var(--Color-2, #0F172A)",
                            fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                    >
                        {fieldListSectionData.header.description}
                    </p>
                </FadeIn>

                <div className="px-6 lg:px-[290px]">
                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fieldListSectionData.items.map((field) => (
                            <SlideIn
                                direction="up"
                                key={field.id}
                                className="flex h-[405px] w-[430.6667px] max-w-full flex-[1_0_0] flex-col items-start gap-6 rounded-[24px] px-[30px] py-[45px]"
                                style={{
                                    background: "var(--Color-7, #FFF)",
                                    border: "0px solid var(--Linear, #1D8FCF)",
                                    boxShadow: "0px 12px 36px 0px rgba(59, 90, 136, 0.12)",
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#008CCB] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                        {field.id}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 pt-1 leading-snug">
                                        {field.title}
                                    </h3>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed min-h-[40px]">
                                    {field.short}
                                </p>

                                <ul className="space-y-3">
                                    {field.points.map((point, idx) => (
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
                        ))}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
}
