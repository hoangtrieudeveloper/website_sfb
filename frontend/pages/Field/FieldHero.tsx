"use client";

import { ArrowRight } from "lucide-react";
import { fieldHeroData } from "./data";
import { FadeIn, SlideIn, ZoomIn, zoomInVariant } from "../../components/ui/motion";
import { motion } from "framer-motion";

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

    const stats = Array.isArray(displayData.stats)
        ? displayData.stats.filter((metric: any) => {
            const value = String(metric?.value ?? "").toLowerCase();
            const label = String(metric?.label ?? "").toLowerCase();

            return value !== "đội ngũ" && label !== "chuyên gia cntt tận tâm";
        })
        : [];
    return (
        <section
            className={[
                // Keep 1920 as the standard (fixed hero height), but allow auto height below to avoid clipping.
                "relative overflow-hidden w-full flex justify-center items-center",
                "min-[1920px]:h-[847px] max-[1919px]:h-auto",
                // Standard top padding for desktop; mobile gets more flexible breathing room.
                "pt-[clamp(64px,calc(64px+(100vw-1024px)*0.0256696),87px)]",
                "max-md:pt-[clamp(72px,18vw,96px)]",
                "max-[1919px]:pb-[clamp(36px,6vw,90px)]",
            ].join(" ")}
            style={{
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

            <div
                className="mx-auto w-full px-6 relative z-10 h-full flex items-center justify-center"
                style={{ maxWidth: "min(1536px, 95vw)" }}
            >
                <div className="flex min-w-0 flex-col lg:flex-row items-center justify-center w-full gap-[clamp(24px,calc(24px+(100vw-1024px)*0.0178571),40px)] 2xl:gap-0">
                    {/* Left Column: Image */}
                    <div
                        className="relative order-2 lg:order-1 flex justify-center lg:justify-start z-10"
                        style={{
                            marginRight: "clamp(-55px, calc((100vw - 1024px) * -0.0613839), 0px)",
                        }}
                    >
                        <ZoomIn
                            className="relative"
                            style={{
                                // Keep 1920 layout as max, shrink image block on smaller desktops.
                                width: 'clamp(280px, calc(760px + (100vw - 1440px) * 0.4791667), 990px)',
                                height: 'clamp(240px, calc(600px + (100vw - 1440px) * 0.3791667), 782px)',
                                flexShrink: 0,
                            }}
                        >
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full filter blur-3xl opacity-30 transform scale-75" />
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
                    <div className="order-1 lg:order-2 min-w-0 text-white">
                        <SlideIn direction="right">
                            <h1
                                className="text-white mb-[29px] w-[min(543px,100%)] font-['Plus_Jakarta_Sans'] text-[clamp(30px,calc(40px+(100vw-1440px)*0.0333333),56px)] leading-[normal] [font-feature-settings:'liga'_off,'clig'_off]"
                            >
                                <span className="font-bold">{displayData.titlePrefix} </span>
                                <span className="font-normal">{displayData.titleSuffix}</span>
                            </h1>
                        </SlideIn>

                        <FadeIn delay={0.2}>
                            <p
                                className="w-[min(486px,100%)] text-white font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[26px]"
                            >
                                {displayData.description}
                            </p>
                        </FadeIn>

                        {/* Stats Row */}
                        {stats.length > 0 && (
                            <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-[clamp(20px,calc(20px+(100vw-1024px)*0.0133929),32px)] max-sm:gap-4 py-[clamp(18px,calc(18px+(100vw-1024px)*0.0122768),29px)]">
                                {stats.map((metric: any, index: number) => (
                                    <div key={index}>
                                        <div
                                            className="mb-2 text-white text-center font-['Plus_Jakarta_Sans'] text-[clamp(22px,calc(22px+(100vw-1024px)*0.0044643),26px)] font-bold leading-[38px] [font-feature-settings:'liga'_off,'clig'_off]"
                                        >
                                            {metric.value}
                                        </div>
                                        <div
                                            className="text-white text-center font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[35px]"
                                        >
                                            {metric.label === "Cơ quan Nhà nước & doanh nghiệp"
                                                ? "Cơ quan Nhà nước & DN"
                                                : metric.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA Button */}
                        <motion.a
                            href={displayData.buttonLink || '#'}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false }}
                            variants={zoomInVariant}
                            className="inline-flex h-[56px] items-center gap-[12px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] px-[30px] py-[7px] font-bold text-white transition-all hover:scale-105"
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
