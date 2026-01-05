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
        <section className="py-[clamp(60px,6vw,90px)] max-sm:py-[clamp(40px,10vw,60px)] bg-[linear-gradient(203deg,#F1F9FD_26.63%,#FFF_87.3%)] relative overflow-hidden">
            <div className="relative z-10 w-full px-6 lg:px-[clamp(48px,calc(48px+(100vw-1024px)*0.0747768),115px)]">
                {/* Header */}
                {displayData.header && (
                    <FadeIn className="text-center mb-[46px] max-w-3xl mx-auto">
                        {displayData.header.subtitle && (
                            <div className="inline-block mb-6">
                                <span
                                    className="text-center font-['Plus_Jakarta_Sans'] text-[15px] font-medium uppercase"
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
                                className="mb-6 text-center font-['Plus_Jakarta_Sans'] text-[clamp(36px,2.9167vw,56px)] max-md:text-[clamp(28px,7.5vw,36px)] font-normal"
                                style={{
                                    color: "var(--Color-2, #0F172A)",
                                    fontFeatureSettings: "'liga' off, 'clig' off",
                                    lineHeight: "normal",
                                }}
                            >
                                {displayData.header.titlePart1}{" "}
                                <span
                                    className="font-bold"
                                    style={{
                                        color: "var(--Color-2, #0F172A)",
                                        fontFeatureSettings: "'liga' off, 'clig' off",
                                        lineHeight: "normal",
                                    }}
                                >
                                    {displayData.header.titleHighlight}
                                    <br />
                                    {displayData.header.titlePart2}
                                </span>
                            </h2>
                        )}
                    </FadeIn>
                )}

                {/* Steps */}
                {displayData.steps && displayData.steps.length > 0 && (
                    <div className="mx-auto flex w-full max-w-[1340px] flex-col items-start gap-[clamp(48px,6vw,90px)] max-md:gap-[clamp(28px,6vw,48px)]">
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
                                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-[clamp(48px,calc(48px+(100vw-1024px)*0.0357143),80px)] ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Image Column */}
                                <SlideIn direction={isEven ? "right" : "left"} className="w-full lg:w-1/2 min-w-0">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] transform rotate-3 scale-105 transition-transform group-hover:rotate-6 duration-500" />
                                        <div className="relative rounded-[2rem] overflow-hidden bg-white p-3 shadow-2xl border border-gray-100">
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
                                <SlideIn direction={isEven ? "left" : "right"} className="w-full lg:w-1/2 min-w-0">
                                    <h3
                                        className="self-stretch mb-6 font-['Plus_Jakarta_Sans'] text-[clamp(22px,calc(22px+(100vw-1024px)*0.0044643),26px)] font-bold leading-[clamp(32px,calc(32px+(100vw-1024px)*0.0066964),38px)]"
                                        style={{
                                            color: "var(--Color-2, #0F172A)",
                                            fontFeatureSettings: "'liga' off, 'clig' off",
                                        }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p
                                        className="self-stretch mb-6 w-full max-w-[549px] font-['Plus_Jakarta_Sans'] text-[clamp(18px,calc(18px+(100vw-1024px)*0.0022321),20px)] font-normal leading-[clamp(32px,calc(32px+(100vw-1024px)*0.0066964),38px)]"
                                        style={{
                                            color: "var(--Color-2, #0F172A)",
                                            fontFeatureSettings: "'liga' off, 'clig' off",
                                        }}
                                    >
                                        {step.description}
                                    </p>

                                    <ul className="space-y-4 mb-6">
                                        {step.points.map((point: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <div className="w-5 h-5 rounded-full bg-[#008CCB] overflow-hidden flex items-center justify-center">
                                                        <Check size={14} className="text-white" />
                                                    </div>
                                                </div>
                                                <span
                                                    className="flex-[1_0_0] self-stretch font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[30px]"
                                                    style={{
                                                        color: "var(--Color-2, #0F172A)",
                                                        fontFeatureSettings: "'liga' off, 'clig' off",
                                                    }}
                                                >
                                                    {point}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Buttons from data */}
                                    {step.button?.text && (
                                        <div>
                                            <a href={step.button.link || '#'} className="inline-flex items-center gap-2 px-8 py-3 bg-[#2EABE2] hover:bg-[#1D8FCF] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20">
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
