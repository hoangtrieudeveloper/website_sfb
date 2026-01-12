"use client";

import * as LucideIcons from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { API_BASE_URL } from "@/lib/api/base";

interface ContactHeroProps {
    data?: {
        badge?: string;
        title?: { prefix?: string; highlight?: string };
        description?: string;
        iconName?: string;
        image?: string;
    };
}

export function ContactHero({ data }: ContactHeroProps = {}) {
    // Chỉ sử dụng data từ API, không có fallback static data
    if (!data) {
        return null;
    }

    const heroData = data;

    // Không render nếu thiếu dữ liệu cần thiết
    if (!heroData.title?.prefix || !heroData.title?.highlight) {
        return null;
    }

    let Icon: any = LucideIcons.MessageCircle;
    if (heroData.iconName && (LucideIcons as any)[heroData.iconName]) {
        Icon = (LucideIcons as any)[heroData.iconName];
    }

    const apiBase = API_BASE_URL;
    const imageSrc = heroData.image
        ? heroData.image.startsWith("http")
            ? heroData.image
            : !heroData.image.includes("/")
                ? `/images/${heroData.image}`
                : heroData.image.includes("images/")
                    ? heroData.image.startsWith("/") ? heroData.image : `/${heroData.image}`
                    : `${apiBase}${heroData.image.startsWith("/") ? "" : "/"}${heroData.image}`
        : "/images/no_cover.jpeg";

    // Fallback if imageSrc is still invalid or empty
    const finalImageSrc = imageSrc || "/images/no_cover.jpeg";

    return (
        <section
            className="relative flex items-center overflow-hidden pt-20 md:pt-24 lg:pt-0 pb-10 md:pb-16 lg:pb-0 lg:h-[847px] lg:pt-[87px]"
            style={{
                minHeight: 'auto',
                height: 'auto',
                background: 'linear-gradient(to bottom right, #0870B4, #2EABE2)'
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0088D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-6 relative z-10 w-full flex items-center py-6 md:py-8 lg:py-0 lg:h-full">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-8 md:gap-12 lg:gap-20">

                    {/* Left Column: Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
                        {heroData.badge && (
                            <div className="inline-flex items-center gap-2 px-4 md:px-6 lg:px-6 py-2 md:py-3 lg:py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-6 md:mb-6 lg:mb-8">
                                <Icon className="text-cyan-400" size={20} />
                                <span className="text-white font-semibold text-xs md:text-sm lg:text-sm">{heroData.badge}</span>
                            </div>
                        )}

                        <h1 className="text-white mb-4 md:mb-6 lg:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            {heroData.title.prefix} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
                                {heroData.title.highlight}
                            </span>
                        </h1>

                        {heroData.description && (
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-blue-50 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                {heroData.description}
                            </p>
                        )}
                    </div>

                    {/* Right Column: Image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative order-1 lg:order-2 mb-6 lg:mb-0">
                        {/* Decorative background elements for image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#ffffff30] to-transparent rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />

                        <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-lg aspect-square 
                                        bg-white/10 backdrop-blur-md rounded-[32px] overflow-hidden border border-white/20 
                                        shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] 
                                        transition-all duration-500 hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.3)] hover:-translate-y-2">
                            {/* Inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                            <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                                <ImageWithFallback
                                    src={finalImageSrc}
                                    alt={heroData.title?.prefix && heroData.title?.highlight
                                        ? `${heroData.title.prefix} ${heroData.title.highlight}`
                                        : "Contact Support"}
                                    fill
                                    sizes="(max-width: 320px) 280px, (max-width: 400px) 320px, 400px"
                                    priority={true}
                                    objectFit="contain"
                                    className="drop-shadow-2xl transition-transform duration-700 hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ContactHeroPage() {
    return null;
}