"use client";

import { visionMissionSectionData } from "./data";
import { FadeIn, StaggerContainer } from "../../components/ui/motion";
import { motion } from "framer-motion";

interface AboutVisionMissionProps {
  data?: any;
}

export function AboutVisionMission({ data }: AboutVisionMissionProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || visionMissionSectionData;
    const headerTitle = displayData.headerTitle || visionMissionSectionData.header.title;
    const headerDescription = displayData.headerDescription || visionMissionSectionData.header.description;
    const items = displayData.items || visionMissionSectionData.items;

    return (
        <section className="bg-white overflow-hidden relative py-[120px] max-md:py-20 max-sm:py-16">
            {/* Background Tech Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2CA4E0_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)] relative z-10">
                <div className="mx-auto w-full max-w-[1340px]">
                {/* Section header */}
                <FadeIn className="mx-auto max-w-4xl text-center mb-[42px] max-md:mb-10">
                    {headerTitle && (
                        <h2 className="text-[#0F172A] text-5xl font-bold mb-[46px] max-md:mb-8 max-md:text-3xl">
                            {headerTitle}
                        </h2>
                    )}
                    {headerDescription && (
                        <p className="mx-auto w-full max-w-[1018px] text-center text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-normal leading-[38px] max-md:text-[16px] max-md:leading-[26px]">
                            {headerDescription}
                        </p>
                    )}
                </FadeIn>

                {/* Cards Grid */}
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                    {items.map((item: any, index: number) => (
                        <FadeIn key={item.id || index}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-[1_0_0] items-center gap-3 rounded-[12px] border border-[var(--Color-7,#FFF)] bg-[linear-gradient(237deg,rgba(128,192,228,0.10)_7%,rgba(29,143,207,0.10)_71.94%)] px-6 py-[42px] max-sm:px-4 max-sm:py-6 h-full cursor-default group relative overflow-hidden"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#2CA4E0] flex items-center justify-center bg-white/50 relative z-10 group-hover:bg-white transition-colors">
                                    <span className="text-[#2CA4E0] font-bold text-lg number-font">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="mt-2.5 relative z-10">
                                    <p className="text-[#334155] font-medium leading-relaxed group-hover:text-[#0F172A] transition-colors">
                                        {item.text}
                                    </p>
                                </div>
                            </motion.div>
                        </FadeIn>
                    ))}
                </StaggerContainer>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutVisionMission;
