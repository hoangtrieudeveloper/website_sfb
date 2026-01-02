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
        <section className="py-20 bg-white overflow-hidden relative">
            {/* Background Tech Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2CA4E0_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="max-w-[1340px] mx-auto px-6 relative z-10">
                {/* Section header */}
                <FadeIn className="max-w-4xl mx-auto text-center mb-16">
                    {headerTitle && (
                        <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-6">
                            {headerTitle}
                        </h2>
                    )}
                    {headerDescription && (
                        <p className="text-gray-600 md:text-lg leading-relaxed max-w-3xl mx-auto">
                            {headerDescription}
                        </p>
                    )}
                </FadeIn>

                {/* Cards Grid */}
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any, index: number) => (
                        <FadeIn key={item.id || index}>
                            <motion.div
                                whileHover={{ scale: 1.05, borderColor: "#2CA4E0", backgroundColor: "#F8FBFE" }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#EFF8FC] rounded-[16px] p-6 flex items-start gap-4 h-full border border-transparent cursor-default group relative overflow-hidden"
                            >
                                {/* Highlight overlay */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/10 to-transparent -mr-10 -mt-10 rounded-full group-hover:scale-150 transition-transform duration-500" />

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
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutVisionMission;
