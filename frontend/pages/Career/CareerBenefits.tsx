"use client";

import React from "react";
import { benefits } from "./data";
import { FadeIn, StaggerContainer } from "../../components/ui/motion";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface CareerBenefitsProps {
  data?: any;
}

export const CareerBenefits = ({ data }: CareerBenefitsProps) => {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || { items: benefits };
    const headerTitle = displayData.headerTitle || "Phúc lợi & Đãi ngộ";
    const headerDescription = displayData.headerDescription || "Chúng tôi tin rằng nhân viên hạnh phúc sẽ làm việc hiệu quả hơn";
    const items = displayData.items || benefits;

    return (
        <section id="benefits" className="py-20 bg-[#F8FBFE]">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <FadeIn className="text-center mb-16">
                    {headerTitle && (
                        <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                            {headerTitle}
                        </h2>
                    )}
                    {headerDescription && (
                        <p className="text-gray-600 md:text-lg max-w-2xl mx-auto leading-relaxed">
                            {headerDescription}
                        </p>
                    )}
                </FadeIn>

                {/* Grid */}
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.filter((item: any) => item.isActive !== false).map((benefit: any, index: number) => {
                        const IconComponent = benefit.iconName
                            ? ((LucideIcons as any)[benefit.iconName] || LucideIcons.DollarSign)
                            : (benefit.icon || LucideIcons.DollarSign);
                        return (
                            <FadeIn key={benefit.id || index}>
                                <motion.div
                                    whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                                    className="bg-white rounded-[24px] p-8 flex flex-col items-start shadow-[0_18px_36px_0_rgba(0,0,0,0.05)] transition-all duration-300 h-full border border-transparent hover:border-blue-100 group"
                                >
                                    <div className="mb-6 text-[#2CA4E0] p-4 bg-blue-50/50 rounded-2xl group-hover:bg-[#E0F2FE] transition-colors duration-300">
                                        <IconComponent size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-[#0F172A] text-xl font-bold mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            </FadeIn>
                        );
                    })}
                </StaggerContainer>
            </div>
        </section>
    );
};
