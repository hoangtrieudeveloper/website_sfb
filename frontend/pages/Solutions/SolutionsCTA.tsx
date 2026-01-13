"use client";

import { ArrowRight } from "lucide-react";
import { ctaData } from "./data";
import { FadeIn } from "../../components/ui/motion";

interface SolutionsCTAProps {
  locale?: 'vi' | 'en' | 'ja';
}

export function SolutionsCTA({ locale }: SolutionsCTAProps) {
    return (
        <section
            className="py-28 relative overflow-hidden flex items-center justify-center"
            style={{
                background: 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)'
            }}
        >
            {/* Techno Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="container mx-auto px-6 relative z-10">
                <FadeIn className="max-w-4xl mx-auto text-center">
                    <h2 className="text-white text-3xl md:text-5xl font-bold mb-6">
                        {ctaData.title}
                    </h2>
                    <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
                        {ctaData.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={ctaData.primaryButton.link}
                            className="group px-8 py-4 bg-white text-[#0870B4] rounded-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 inline-flex items-center justify-center gap-2 font-bold shadow-lg"
                        >
                            {ctaData.primaryButton.text}
                            <ArrowRight
                                className="group-hover:translate-x-1 transition-transform"
                                size={20}
                            />
                        </a>
                        <a
                            href={ctaData.secondaryButton.link}
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/40 hover:bg-white hover:text-[#0870B4] hover:border-white transition-all inline-flex items-center justify-center gap-2 font-semibold"
                        >
                            {ctaData.secondaryButton.text}
                        </a>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function SolutionsCTAPage() {
    return null;
}