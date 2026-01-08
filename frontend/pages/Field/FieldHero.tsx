"use client";

import { ArrowRight } from "lucide-react";
import { fieldHeroData } from "./data";
import { FadeIn, SlideIn, ZoomIn, StaggerContainer, zoomInVariant } from "../../components/ui/motion";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface FieldHeroProps {
    data?: any;
}

export function FieldHero({ data }: FieldHeroProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data || {
        titlePrefix: fieldHeroData.title.prefix,
        titleSuffix: fieldHeroData.title.suffix,
        description: fieldHeroData.description,
        buttonText: fieldHeroData.button.text,
        buttonLink: fieldHeroData.button.link,
        image: fieldHeroData.image,
        backgroundGradient: 'linear-gradient(31deg, #0870B4 51.21%, #2EABE2 97.73%)',
        stats: fieldHeroData.stats,
    };
    return (
        <section
            className="relative overflow-hidden pt-[100px] md:pt-[120px] lg:pt-0 pb-10 md:pb-16 lg:pb-0 lg:h-[847px] lg:pt-[87px]"
            style={{
                width: '100%',
                minHeight: 'auto',
                height: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: displayData.backgroundGradient || 'linear-gradient(31deg, #0870B4 51.21%, #2EABE2 97.73%)',
            }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

            {/* Glow effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-cyan-400/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-6 relative z-10 w-full flex items-start lg:items-center justify-center pt-0 md:pt-0 lg:pt-0 pb-0 md:pb-0 lg:pb-0 lg:h-full">
                <div
                    className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-0"
                >
                    {/* Left Column: Image */}
                    <div className="relative order-1 lg:order-1 flex justify-center lg:justify-start z-10 w-full lg:w-1/2 xl:w-auto mb-4 md:mb-6 lg:mb-0 lg:mr-[-55px]">
                        <ZoomIn className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[700px] xl:max-w-[991px] aspect-[991/782] flex-shrink-0">
                            <div className="absolute inset-0 bg-white/10 rounded-full filter blur-3xl opacity-30 transform scale-75" />
                            {/* Responsive Image Placeholders */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <img
                                    src={displayData.image}
                                    alt="Optimizing Business Operations"
                                    className="w-full h-full object-cover drop-shadow-2xl"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('bg-white/5', 'border-2', 'border-dashed', 'border-white/20', 'rounded-xl');
                                        if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerText = 'Illustration Space';
                                    }}
                                />
                            </div>
                        </ZoomIn>
                    </div>

                    {/* Right Column: Content */}
                    <div className="order-2 lg:order-2 text-white w-full lg:w-1/2 xl:w-auto text-center lg:text-left z-20">
                        <SlideIn direction="right">
                            <h1
                                className="text-white mb-4 md:mb-5 lg:mb-6 w-full lg:max-w-[543px] text-3xl sm:text-4xl lg:text-[56px] leading-tight lg:leading-normal mx-auto lg:mx-0"
                                style={{
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                    fontFeatureSettings: "'liga' off, 'clig' off"
                                }}
                            >
                                <span className="font-bold">{displayData.titlePrefix} </span>
                                <span className="font-normal">{displayData.titleSuffix}</span>
                            </h1>
                        </SlideIn>

                        <FadeIn delay={0.2}>
                            <p
                                className="mb-6 md:mb-8 lg:mb-10 w-full lg:max-w-[486px] text-base sm:text-lg lg:text-base mx-auto lg:mx-0"
                                style={{
                                    color: '#FFF',
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                    fontWeight: 400,
                                    lineHeight: '26px'
                                }}
                            >
                                {displayData.description}
                            </p>
                        </FadeIn>

                        {/* Stats Row */}
                        {displayData.stats && displayData.stats.length > 0 && (
                            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-12 border-t border-white/10 pt-4 md:pt-6 lg:pt-8 w-full" delay={0.4}>
                                {displayData.stats.map((metric: any, index: number) => (
                                    <ZoomIn key={index} >
                                        <div
                                            className="mb-1 md:mb-2 text-2xl sm:text-3xl lg:text-[26px] leading-tight lg:leading-[38px]"
                                            style={{
                                                color: '#FFF',
                                                textAlign: 'center',
                                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                fontStyle: 'normal',
                                                fontWeight: 700,
                                                fontFeatureSettings: "'liga' off, 'clig' off"
                                            }}
                                        >
                                            {metric.value}
                                        </div>
                                        <div
                                            className="text-sm sm:text-base leading-tight lg:leading-[35px]"
                                            style={{
                                                color: '#FFF',
                                                textAlign: 'center',
                                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                fontStyle: 'normal',
                                                fontWeight: 400
                                            }}
                                        >
                                            {metric.label === "Cơ quan Nhà nước & doanh nghiệp"
                                                ? "Cơ quan Nhà nước & DN"
                                                : metric.label}
                                        </div>
                                    </ZoomIn>
                                ))}
                            </StaggerContainer>
                        )}

                        {/* CTA Button */}
                        <motion.a
                            href={displayData.buttonLink || '#'}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false }}
                            variants={zoomInVariant}
                            className="inline-flex items-center gap-3 transition-all hover:scale-105 w-full sm:w-auto justify-center text-sm md:text-base h-[48px] md:h-[56px] px-6 md:px-[30px] py-[7px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-semibold"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontWeight: 700,
                            }}
                        >
                            {displayData.buttonText}
                            <ArrowRight size={20} />
                        </motion.a>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function FieldHeroPage() {
    return null;
}
