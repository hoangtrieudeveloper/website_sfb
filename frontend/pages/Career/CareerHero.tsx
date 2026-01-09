"use client";

import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { FadeIn, StaggerContainer } from "../../components/ui/motion";

interface CareerHeroProps {
  data?: any;
}

export function CareerHero({ data }: CareerHeroProps) {
    // Chỉ sử dụng data từ API, không có fallback static data
    if (!data || !data.data) {
        return null;
    }

    const displayData = data.data;

    // Không render nếu thiếu dữ liệu cần thiết
    if (!displayData.titleLine1 || !displayData.titleLine2 || !displayData.image) {
        return null;
    }

    return (
        <section
            className="relative w-full flex justify-center items-center overflow-hidden"
            style={{
                height: '847px',
                paddingTop: '87px',
                background: displayData.backgroundGradient || 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)'
            }}
        >
            {/* Techno Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-[98px]">
                    {/* Text Content */}
                    <StaggerContainer className="text-white lg:max-w-[45%]">
                        <FadeIn>
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                                {displayData.titleLine1}
                                <span className="block mt-2">
                                    {displayData.titleLine2}
                                </span>
                            </h1>
                        </FadeIn>

                        {displayData.description && (
                            <FadeIn delay={0.2}>
                                <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed font-light">
                                    {displayData.description}
                                </p>
                            </FadeIn>
                        )}

                        {displayData.buttonText && (
                            <FadeIn delay={0.4}>
                                <a
                                    href={displayData.buttonLink || "#positions"}
                                    className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] shadow-md"
                                >
                                    {displayData.buttonText}
                                    <ArrowRight size={18} />
                                </a>
                            </FadeIn>
                        )}
                    </StaggerContainer>

                    {/* Image Content */}
                    {displayData.image && (
                        <FadeIn delay={0.5} className="w-full lg:w-auto">
                            <div className="relative flex-none lg:w-[851px] lg:h-[512px] w-full h-auto flex justify-center items-center bg-white border-[10px] border-white rounded-[24px] shadow-[0_18px_36px_0_rgba(0,0,0,0.12)] flex-shrink-0 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-shadow duration-500">
                                <div className="w-full h-full rounded-[14px] overflow-hidden relative">
                                    <ImageWithFallback
                                        src={displayData.image}
                                        alt={displayData.titleLine1 && displayData.titleLine2 
                                            ? `${displayData.titleLine1} ${displayData.titleLine2}` 
                                            : "Career Hero"}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 851px"
                                        priority={true}
                                        objectFit="cover"
                                        className="transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    {/* Overlay Glint */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                </div>
                            </div>
                        </FadeIn>
                    )}
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function CareerHeroPage() {
    return null;
}
