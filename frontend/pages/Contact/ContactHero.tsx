"use client";

import { contactHeroData } from "./data";
import * as LucideIcons from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

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
    const heroData = data || contactHeroData;
    let Icon: any = LucideIcons.MessageCircle;
    if (data?.iconName && (LucideIcons as any)[data.iconName]) {
        Icon = (LucideIcons as any)[data.iconName];
    } else if (contactHeroData.icon) {
        Icon = contactHeroData.icon;
    }

    return (
        <section
            className="relative flex items-center overflow-hidden"
            style={{
                height: '847px',
                paddingTop: '87px',
                background: 'linear-gradient(to bottom right, #0870B4, #2EABE2)'
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0088D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
                <div className="flex flex-row items-center justify-between w-full gap-12 lg:gap-20">

                    {/* Left Column: Content */}
                    <div className="lg:w-1/2 text-left">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
                            <Icon className="text-cyan-400" size={20} />
                            <span className="text-white font-semibold text-sm">{heroData.badge || contactHeroData.badge}</span>
                        </div>

                        <h1 className="text-white mb-8 text-5xl md:text-6xl font-bold leading-tight">
                            {(heroData.title?.prefix || contactHeroData.title.prefix)} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
                                {(heroData.title?.highlight || contactHeroData.title.highlight)}
                            </span>
                        </h1>

                        <p className="text-xl text-blue-50 leading-relaxed max-w-xl">
                            {(heroData.description || contactHeroData.description)}
                        </p>
                    </div>

                    {/* Right Column: Image */}
                    <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
                        <div className="relative w-full max-w-lg aspect-square">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full filter blur-3xl opacity-40 transform scale-90 animate-pulse" />
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <ImageWithFallback
                                    src={
                                        data 
                                            ? ((heroData.image && heroData.image.trim() !== '') 
                                                ? heroData.image 
                                                : "/images/no_cover.jpeg")
                                            : ((contactHeroData.image && contactHeroData.image.trim() !== '') 
                                                ? contactHeroData.image 
                                                : "/images/no_cover.jpeg")
                                    }
                                    alt="Contact Support"
                                    className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
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