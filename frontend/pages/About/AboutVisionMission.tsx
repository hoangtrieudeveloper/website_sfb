"use client";

import { visionMissionSectionData } from "./data";
import { FadeIn, StaggerContainer, InViewSection } from "../../components/ui/motion";
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
        <section className="py-10 sm:py-20 bg-white overflow-hidden relative">
            {/* Background Tech Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2CA4E0_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)] relative z-10">
                <InViewSection className="mx-auto w-full max-w-[1340px]">
                    {/* Section header */}
                    <FadeIn className="max-w-4xl mx-auto text-center mb-8 sm:mb-16">
                        {headerTitle && (
                            <h2 className="text-[#0F172A] text-2xl sm:text-4xl md:text-5xl font-bold mb-6">
                                {headerTitle}
                            </h2>
                        )}
                        {headerDescription && (
                            <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-3xl mx-auto">
                                {headerDescription}
                            </p>
                        )}
                    </FadeIn>

                    {/* Cards Grid */}
                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        {items.map((item: any, index: number) => (
                            <FadeIn key={item.id || index}>
                                <motion.div
                                    className="flex flex-1 items-center gap-3 px-6 py-[42px] rounded-[12px] border border-white bg-[linear-gradient(237deg,rgba(128,192,228,0.10)_7%,rgba(29,143,207,0.10)_71.94%)] relative overflow-hidden"
                                >
                                    <div className="relative w-[42px] h-[42px] flex items-center justify-center flex-shrink-0">
                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 text-[#1D8FCF]">
                                            <path d="M38.2 12.9 A 19 19 0 1 1 29 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute top-0 right-0 translate-x-[10%] translate-y-[-10%]">
                                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16.457px', height: '16.457px' }}>
                                                <path d="M1.60121 7.08803C1.38641 6.88939 1.50309 6.53028 1.79363 6.49584L5.91037 6.00755C6.02878 5.99351 6.13163 5.91915 6.18157 5.81087L7.91795 2.04645C8.0405 1.78078 8.41818 1.78072 8.54072 2.0464L10.2771 5.81079C10.327 5.91907 10.4292 5.99363 10.5476 6.00767L14.6646 6.49584C14.9551 6.53028 15.0715 6.88949 14.8567 7.08814L11.8134 9.90298C11.7259 9.98394 11.6869 10.1044 11.7101 10.2214L12.5178 14.2875C12.5748 14.5744 12.2694 14.7968 12.0141 14.6539L8.39677 12.6285C8.29272 12.5702 8.16631 12.5705 8.06226 12.6288L4.44451 14.6533C4.18922 14.7963 3.88326 14.5744 3.94028 14.2875L4.74808 10.2216C4.77132 10.1047 4.73244 9.98391 4.6449 9.90296L1.60121 7.08803Z" fill={`url(#paint0_linear_${index})`} />
                                                <defs>
                                                    <linearGradient id={`paint0_linear_${index}`} x1="7.57267" y1="15.598" x2="15.5458" y2="13.0224" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#1D8FCF" />
                                                        <stop offset="1" stopColor="#2EABE2" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <span className="text-[#1D8FCF] font-['Plus_Jakarta_Sans'] font-semibold text-[20px] leading-none pt-1">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div className="relative z-10 self-stretch flex items-center">
                                        <p className="w-full text-[#64748B] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px]">
                                            {item.text}
                                        </p>
                                    </div>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </StaggerContainer>
                </InViewSection>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutVisionMission;
