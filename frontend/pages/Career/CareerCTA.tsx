"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "../../components/ui/motion";

interface CareerCTAProps {
  data?: any;
}

export const CareerCTA = ({ data }: CareerCTAProps) => {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || {
        title: "Không tìm thấy vị trí phù hợp?",
        description: "Gửi CV cho chúng tôi! Chúng tôi luôn tìm kiếm những tài năng xuất sắc",
        primaryButtonText: "Gửi CV qua email",
        primaryButtonLink: "mailto:careers@sfb.vn",
        secondaryButtonText: "Liên hệ HR",
        secondaryButtonLink: "/contact",
        backgroundGradient: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
    };

    return (
        <section
            id="contact"
            className="py-28 relative overflow-hidden flex items-center justify-center"
            style={{
                background: displayData.backgroundGradient || 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)'
            }}
        >
            {/* Techno Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10">
                <FadeIn className="max-w-4xl mx-auto text-center">
                    {displayData.title && (
                        <h2 className="text-white text-3xl md:text-5xl font-bold mb-6">{displayData.title}</h2>
                    )}
                    {displayData.description && (
                        <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
                            {displayData.description}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {displayData.primaryButtonText && (
                            <a
                                href={displayData.primaryButtonLink || '#'}
                                className="group px-8 py-4 bg-white text-[#0870B4] rounded-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 inline-flex items-center justify-center gap-2 font-bold shadow-lg"
                            >
                                {displayData.primaryButtonText}
                                <ArrowRight
                                    className="group-hover:translate-x-1 transition-transform"
                                    size={20}
                                />
                            </a>
                        )}
                        {displayData.secondaryButtonText && (
                            <a
                                href={displayData.secondaryButtonLink || '#'}
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/40 hover:bg-white hover:text-[#0870B4] hover:border-white transition-all inline-flex items-center justify-center gap-2 font-semibold"
                            >
                                {displayData.secondaryButtonText}
                            </a>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function CareerCTAPage() {
    return null;
}
