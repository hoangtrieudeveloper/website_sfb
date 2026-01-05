"use client";

// Icons are now imported in data.tsx and passed as components

import { coreValues } from "./data";
import { FadeIn, StaggerContainer } from "../../components/ui/motion";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface AboutCoreValuesProps {
  data?: any;
}

export function AboutCoreValues({ data }: AboutCoreValuesProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || { items: coreValues };
    const headerTitle = displayData.headerTitle || "Giá trị cốt lõi";
    const headerDescription = displayData.headerDescription || "Những nguyên tắc định hình văn hoá và cách SFB hợp tác với khách hàng, đối tác và đội ngũ nội bộ";
    const items = displayData.items || coreValues;

    return (
        <section className="bg-[#F8FBFE] py-[120px] max-md:py-20 max-sm:py-16">
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <div className="mx-auto w-full max-w-[1340px]">
                {/* Header */}
                <FadeIn className="mx-auto max-w-4xl text-center mb-[46px] max-md:mb-10">
                    {headerTitle && (
                        <h2 className="text-[#0F172A] text-5xl font-bold mb-6 max-md:text-3xl">
                            {headerTitle}
                        </h2>
                    )}
                    {headerDescription && (
                        <p className="mx-auto w-full max-w-[544px] text-center text-[var(--Color-2,#0F172A)] font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[26px]">
                            {headerDescription}
                        </p>
                    )}
                </FadeIn>

                {/* Grid */}
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.filter((item: any) => item.isActive !== false).map((item: any, idx: number) => {
                        const IconComponent = item.iconName
                            ? ((LucideIcons as any)[item.iconName] || LucideIcons.Lightbulb)
                            : (item.icon || LucideIcons.Lightbulb);
                        return (
                            <FadeIn key={item.id || idx}>
                                <motion.div
                                    whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                                    className="bg-white rounded-[24px] p-8 max-sm:p-6 flex flex-col items-center text-center shadow-[0_18px_36px_0_rgba(0,0,0,0.05)] transition-all duration-300 h-full border border-transparent hover:border-blue-100"
                                >
                                    <motion.div
                                        className="mb-6 text-[#2CA4E0] p-4 bg-blue-50/50 rounded-full"
                                        whileHover={{ rotate: 360, backgroundColor: "#E0F2FE" }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <IconComponent size={48} strokeWidth={1.5} />
                                    </motion.div>
                                    <h3 className="text-[#0F172A] text-xl font-bold mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                        {item.description}
                                    </p>
                                </motion.div>
                            </FadeIn>
                        );
                    })}
                </StaggerContainer>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutCoreValues;
