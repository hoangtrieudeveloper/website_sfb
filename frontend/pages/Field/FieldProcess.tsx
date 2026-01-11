"use client";

import { Check, ArrowRight } from "lucide-react";
import { processSteps, fieldProcessSectionData } from "./data";
import { FadeIn, SlideIn } from "../../components/ui/motion";
import * as LucideIcons from "lucide-react";

interface FieldProcessProps {
    data?: any;
}

export function FieldProcess({ data }: FieldProcessProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data || {
        header: fieldProcessSectionData.header,
        steps: processSteps,
    };
    return (
        <section className="py-12 md:py-[90px] bg-[linear-gradient(203deg,#F1F9FD_26.63%,#FFF_87.3%)] relative overflow-hidden">
            <div className="relative z-10 w-full container mx-auto px-4 md:px-6">
                {/* Header */}
                {displayData.header && (
                    <FadeIn className="text-center mb-10 md:mb-[46px] max-w-3xl mx-auto">
                        {displayData.header.subtitle && (
                            <div className="inline-block mb-4">
                                <span
                                    className="text-center font-['Plus_Jakarta_Sans'] text-sm md:text-[15px] font-medium uppercase"
                                    style={{
                                        color: "var(--Color, #1D8FCF)",
                                        fontFeatureSettings: "'liga' off, 'clig' off",
                                        lineHeight: "normal",
                                    }}
                                >
                                    {displayData.header.subtitle}
                                </span>
                            </div>
                        )}
                        {(displayData.header.titlePart1 || displayData.header.titleHighlight || displayData.header.titlePart2) && (
                            <h2
                                className="mb-6 text-center font-['Plus_Jakarta_Sans'] text-3xl md:text-5xl lg:text-[56px] font-normal"
                                style={{
                                    color: "var(--Color-2, #0F172A)",
                                    fontFeatureSettings: "'liga' off, 'clig' off",
                                    lineHeight: "1.2",
                                }}
                            >
                                {displayData.header.titlePart1}{" "}
                                <span
                                    className="font-bold"
                                    style={{
                                        color: "var(--Color-2, #0F172A)",
                                        fontFeatureSettings: "'liga' off, 'clig' off",
                                        lineHeight: "1.2",
                                    }}
                                >
                                    {displayData.header.titleHighlight}
                                    <br className="hidden md:block" />
                                    <span className="md:hidden"> </span>
                                    {displayData.header.titlePart2}
                                </span>
                            </h2>
                        )}
                    </FadeIn>
                )}

                {/* Steps */}
                {displayData.steps && displayData.steps.length > 0 && (
                    <div className="flex w-full flex-col items-start gap-16 lg:gap-[90px]">
                        {displayData.steps.map((step: any, index: number) => {
                            const isEven = index % 2 !== 0;

                            const stepImageSrc = step.image || (
                                index === 0
                                    ? "/images/industries/industries1.png"
                                    : index === 1
                                        ? "/images/industries/industries2.png"
                                        : index === 2
                                            ? "/images/industries/industries3.png"
                                            : `/images/field_process_${index + 1}.png`
                            );

                            const ButtonIcon = step.button?.iconName
                                ? ((LucideIcons as any)[step.button.iconName] || ArrowRight)
                                : (step.button?.icon || ArrowRight);

                            return (
                                <div
                                    key={step.id}
                                    className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-14 xl:gap-16 2xl:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                                >
                                    {/* Image Column */}
                                    <SlideIn direction={isEven ? "right" : "left"} className="w-full lg:w-[52%] xl:w-[52%] 2xl:w-[54%]">
                                        <div className="relative group">
                                            <div className="relative rounded-[2rem] overflow-hidden bg-white p-2 sm:p-3 border border-gray-100">
                                                <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-gray-100">
                                                    {/* Placeholder for images since generation failed */}
                                                    <img
                                                        src={stepImageSrc}
                                                        alt={step.title}
                                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-duration-700"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200', 'flex', 'items-center', 'justify-center');
                                                            // Fallback content
                                                            const span = document.createElement('span');
                                                            span.className = "text-gray-400 font-medium";
                                                            span.innerText = "Illustration Image";
                                                            e.currentTarget.parentElement?.appendChild(span);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </SlideIn>

                                    {/* Content Column */}
                                    <SlideIn direction={isEven ? "left" : "right"} className="w-full lg:w-[48%] xl:w-[48%] 2xl:w-[46%]">
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                                            {step.description}
                                        </p>

                                        <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                                            {step.points.map((point: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="w-5 h-5 rounded-full bg-[#008CCB] flex items-center justify-center">
                                                            <Check size={12} className="text-white" />
                                                        </div>
                                                    </div>
                                                    <span className="text-gray-700 font-medium text-sm md:text-base">{point}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Buttons from data */}
                                        {step.button?.text && (
                                            <div>
                                                <a href={step.button.link || '#'} className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3 bg-[#2EABE2] hover:bg-[#1D8FCF] text-white rounded-lg  transition-colors shadow-lg shadow-blue-500/20 text-sm md:text-base">
                                                    {step.button.text === "Liên hệ với chúng tôi" ? (
                                                        <>
                                                            {step.button.text}
                                                            <ButtonIcon size={step.button.iconSize || 18} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ButtonIcon size={step.button.iconSize || 18} />
                                                            {step.button.text}
                                                        </>
                                                    )}
                                                </a>
                                            </div>
                                        )}
                                    </SlideIn>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function FieldProcessPage() {
    return null;
}
