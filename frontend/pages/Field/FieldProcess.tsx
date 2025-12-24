"use client";

import { CheckCircle2 } from "lucide-react";
import { processSteps, fieldProcessSectionData } from "./data";
import { FadeIn, SlideIn } from "../../components/ui/motion";

export function FieldProcess() {
    return (
        <section className="py-[90px] bg-[linear-gradient(203deg,#F1F9FD_26.63%,#FFF_87.3%)] relative overflow-hidden">
            <div className="relative z-10 w-full px-6 lg:px-[290px]">
                {/* Header */}
                <FadeIn className="text-center mb-[46px] max-w-3xl mx-auto">
                    <div className="inline-block mb-4">
                        <span
                            className="text-center font-['Plus_Jakarta_Sans'] text-[15px] font-medium uppercase"
                            style={{
                                color: "var(--Color, #1D8FCF)",
                                fontFeatureSettings: "'liga' off, 'clig' off",
                                lineHeight: "normal",
                            }}
                        >
                            {fieldProcessSectionData.header.subtitle}
                        </span>
                    </div>
                    <h2
                        className="mb-6 text-center font-['Plus_Jakarta_Sans'] text-[56px] font-normal"
                        style={{
                            color: "var(--Color-2, #0F172A)",
                            fontFeatureSettings: "'liga' off, 'clig' off",
                            lineHeight: "normal",
                        }}
                    >
                        {fieldProcessSectionData.header.title.part1}{" "}
                        <span
                            className="font-bold"
                            style={{
                                color: "var(--Color-2, #0F172A)",
                                fontFeatureSettings: "'liga' off, 'clig' off",
                                lineHeight: "normal",
                            }}
                        >
                            {fieldProcessSectionData.header.title.highlight}
                            <br />
                            {fieldProcessSectionData.header.title.part2}
                        </span>
                    </h2>
                </FadeIn>

                {/* Steps */}
                <div className="mx-auto flex w-full max-w-[1340px] flex-col items-start gap-[90px]">
                    {processSteps.map((step, index) => {
                        const isEven = index % 2 !== 0; // 0 (odd visual) -> Image Left, 1 (even visual) -> Image Right? 

                        const stepImageSrc =
                            index === 0
                                ? "/images/industries/industries1.png"
                                : index === 1
                                    ? "/images/industries/industries2.png"
                                    : index === 2
                                        ? "/images/industries/industries3.png"
                                        : `/images/field_process_${index + 1}.png`;

                        const ButtonIcon = step.button.icon;

                        return (
                            <div
                                key={step.id}
                                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Image Column */}
                                <SlideIn direction={isEven ? "right" : "left"} className="w-full lg:w-1/2">
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
                                <SlideIn direction={isEven ? "left" : "right"} className="w-full lg:w-1/2">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-6">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                        {step.description}
                                    </p>

                                    <ul className="space-y-4 mb-10">
                                        {step.points.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-5 h-5 rounded-full bg-[#008CCB] flex items-center justify-center">
                                                        <CheckCircle2 size={12} className="text-white" />
                                                    </div>
                                                </div>
                                                <span className="text-gray-700 font-medium">{point}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Buttons from data */}
                                    <div>
                                        <a href={step.button.link} className="inline-flex items-center gap-2 px-8 py-3 bg-[#2EABE2] hover:bg-[#1D8FCF] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20">
                                            {step.button.text === "Liên hệ với chúng tôi" ? step.button.text : (
                                                <>
                                                    <ButtonIcon size={step.button.iconSize} />
                                                    {step.button.text}
                                                </>
                                            )}
                                            {step.button.text === "Liên hệ với chúng tôi" && <ButtonIcon size={step.button.iconSize} />}
                                        </a>
                                    </div>
                                </SlideIn>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
