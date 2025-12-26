"use client";

import { Zap } from "lucide-react";
import { processData } from "./data";
import { FadeIn, StaggerContainer } from "../../components/ui/motion";
import { motion } from "framer-motion";

export function SolutionsProcess() {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#F1F5F9_1px,transparent_1px),linear-gradient(to_bottom,#F1F5F9_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />

            <div className="max-w-[1340px] mx-auto px-6 relative z-10">
                {/* Header */}
                <FadeIn className="text-center mb-20 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#0870B4] rounded-full text-sm font-semibold mb-6">
                        <Zap size={16} />
                        <span>{processData.badge}</span>
                    </div>
                    <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-6">
                        {processData.title}
                    </h2>
                    <p className="text-gray-600 md:text-lg leading-relaxed">
                        {processData.description}
                    </p>
                </FadeIn>

                {/* Timeline + cards */}
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[46px] left-[6%] right-[6%] h-[3px] bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-200 rounded-full z-0" />

                    <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10">
                        {processData.steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <FadeIn key={index} className="h-full">
                                    <div className="group relative flex flex-col items-stretch h-full">
                                        {/* Number Badge */}
                                        <div className="relative flex justify-center mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0870B4] to-[#2EABE2] text-white font-bold text-lg flex items-center justify-center shadow-lg border-4 border-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <motion.div
                                            whileHover={{ y: -10, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
                                            className="bg-white rounded-[24px] border border-gray-100 p-8 pt-10 shadow-sm flex flex-col h-full relative overflow-hidden hover:border-blue-100 transition-all duration-300"
                                        >
                                            {/* Top Strip */}
                                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0870B4] to-[#2EABE2] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Icon */}
                                            <div className="mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0870B4] group-hover:bg-[#0870B4] group-hover:text-white transition-all duration-300 shadow-sm">
                                                    <Icon size={28} />
                                                </div>
                                            </div>

                                            <h4 className="text-[#0F172A] text-xl font-bold mb-4 group-hover:text-[#0870B4] transition-colors">
                                                {step.title}
                                            </h4>

                                            <p className="text-gray-600 leading-relaxed text-[15px] flex-grow">
                                                {step.description}
                                            </p>
                                        </motion.div>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
}
