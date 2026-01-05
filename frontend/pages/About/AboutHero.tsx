"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { aboutHeroData } from "./data";
import { FadeIn, StaggerContainer } from "../../components/ui/motion";

interface AboutHeroProps {
  data?: any;
}

export function AboutHero({ data }: AboutHeroProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || aboutHeroData;
    const backgroundGradient = displayData.backgroundGradient || 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)';
    const titleLine1 = displayData.titleLine1 || displayData.title?.line1 || aboutHeroData.title.line1;
    const titleLine2 = displayData.titleLine2 || displayData.title?.line2 || aboutHeroData.title.line2;
    const titleLine3 = displayData.titleLine3 || displayData.title?.line3 || aboutHeroData.title.line3;
    const description = displayData.description || aboutHeroData.description;
    const buttonText = displayData.buttonText || displayData.button?.text || aboutHeroData.button.text;
    const buttonLink = displayData.buttonLink || displayData.button?.link || aboutHeroData.button.link;
    const image = displayData.image || aboutHeroData.image;

    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const [titleWidth, setTitleWidth] = useState<number | null>(null);

    useEffect(() => {
        const el = titleRef.current;
        if (!el) return;

        const update = () => {
            const next = Math.ceil(el.getBoundingClientRect().width);
            setTitleWidth((prev) => (prev === next ? prev : next));
        };

        update();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", update);
            return () => window.removeEventListener("resize", update);
        }

        const ro = new ResizeObserver(() => update());
        ro.observe(el);
        return () => ro.disconnect();
    }, [titleLine1, titleLine2, titleLine3]);

    return (
        <section
            className="relative w-full flex justify-center items-center overflow-hidden h-[847px] pt-[87px] max-md:h-auto max-md:pt-[clamp(72px,18vw,87px)] max-md:pb-[clamp(48px,12vw,84px)]"
            style={{
                background: backgroundGradient
            }}
        >
            {/* Techno Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)] min-[1920px]:px-0 min-[1920px]:pl-[269px] relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-center min-[1920px]:justify-start gap-16 max-md:gap-[clamp(24px,8vw,48px)] lg:gap-[clamp(48px,5.1042vw,98px)] min-[1920px]:gap-[45px]">
                    {/* Text Content */}
                    <StaggerContainer className="text-white lg:max-w-[45%] min-[1920px]:max-w-none min-[1920px]:w-[851px]">
                        <div className="inline-block max-w-full">
                            <FadeIn>
                                <h1 ref={titleRef} className="inline-block max-w-full text-5xl md:text-6xl max-sm:text-[clamp(32px,9vw,48px)] font-bold leading-tight mb-6 max-md:mb-5">
                                    {titleLine1}
                                    <span className="block mt-2 text-white font-medium text-[56px] max-sm:text-[clamp(28px,8vw,44px)] leading-[normal] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans']">
                                        {titleLine2}
                                        <br />
                                        {titleLine3}
                                    </span>
                                </h1>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <p
                                    className="max-w-full text-[16px] text-white/90 mb-10 leading-relaxed font-light"
                                    style={titleWidth ? { width: `${titleWidth}px` } : undefined}
                                >
                                    {description}
                                </p>
                            </FadeIn>
                        </div>

                        <FadeIn delay={0.4}>
                            <a
                                href={buttonLink}
                                className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] shadow-md"
                            >
                                {buttonText}
                                <ArrowRight size={18} />
                            </a>
                        </FadeIn>
                    </StaggerContainer>

                    {/* Image Content */}
                    <FadeIn delay={0.5} className="w-full lg:w-auto">
                        <div className="relative box-border flex-none w-full max-w-[851px] aspect-[851/512] min-[1920px]:w-[710px] flex justify-center items-center bg-white border-[10px] border-white rounded-[24px] shadow-[0_18px_36px_0_rgba(0,0,0,0.12)] flex-shrink-0 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-shadow duration-500">
                            <div className="w-full h-full rounded-[14px] overflow-hidden relative">
                                <ImageWithFallback
                                    src={image}
                                    alt="About Hero Detail"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                {/* Overlay Glint */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutHero;
