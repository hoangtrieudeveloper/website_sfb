"use client";

import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { solutionsListData } from "./data";
import { FadeIn, StaggerContainer } from "../../components/ui/motion";
import { motion } from "framer-motion";

interface SolutionsListProps {
  locale?: 'vi' | 'en' | 'ja';
}

export function SolutionsList({ locale }: SolutionsListProps) {
    return (
        <section id="solutions-list" className="py-20 bg-[#F8FBFE]">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <FadeIn className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#0870B4] rounded-full text-sm font-semibold mb-6">
                        <Sparkles size={16} />
                        <span>{solutionsListData.badge}</span>
                    </div>
                    <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-6">
                        {solutionsListData.title}
                    </h2>
                    <p className="text-gray-600 md:text-lg leading-relaxed">
                        {solutionsListData.description}
                    </p>
                </FadeIn>

                {/* Grid */}
                <StaggerContainer className="grid md:grid-cols-2 gap-8 mb-16">
                    {solutionsListData.items.map((solution, index) => {
                        const Icon = solution.icon;
                        return (
                            <FadeIn key={solution.id}>
                                <motion.div
                                    whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
                                    className="relative bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-gray-100 hover:border-blue-100 transition-all duration-300 overflow-hidden group h-full"
                                >
                                    {/* Accent Gradient Background Blob */}
                                    <div
                                        className={`absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br ${solution.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500 blur-3xl`}
                                    />

                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between gap-4 mb-6">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                                                >
                                                    <Icon size={28} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-[#0F172A] mb-1 group-hover:text-[#0870B4] transition-colors">
                                                        {solution.title}
                                                    </h3>
                                                    <span className="text-sm text-gray-400 font-medium">
                                                        Giải pháp #{String(index + 1).padStart(2, "0")}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-4xlfont-bold text-gray-100 select-none">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 leading-relaxed mb-8 text-[15px] flex-grow">
                                            {solution.description}
                                        </p>

                                        {/* Benefits Tags */}
                                        <div className="flex flex-wrap gap-2.5 mt-auto">
                                            {solution.benefits.map((benefit) => (
                                                <span
                                                    key={benefit}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700 group-hover:bg-white group-hover:shadow-sm transition-all"
                                                >
                                                    <CheckCircle2 size={14} className="text-[#0870B4]" />
                                                    <span>{benefit}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Progress Line */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50">
                                        <div className={`h-full w-0 bg-gradient-to-r ${solution.gradient} group-hover:w-full transition-all duration-700 ease-out`} />
                                    </div>
                                </motion.div>
                            </FadeIn>
                        );
                    })}
                </StaggerContainer>

                <FadeIn className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-white rounded-[20px] border border-gray-100 shadow-sm">
                    <p className="text-gray-600 text-center sm:text-left max-w-2xl">
                        Các nguyên tắc trên được áp dụng xuyên suốt trong mọi dự án – từ hệ thống cho cơ quan Nhà nước đến doanh nghiệp tư nhân.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0870B4] text-white font-semibold hover:bg-[#065A93] transition-all whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Trao đổi về nhu cầu
                        <ArrowRight size={18} />
                    </a>
                </FadeIn>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function SolutionsListPage() {
    return null;
}