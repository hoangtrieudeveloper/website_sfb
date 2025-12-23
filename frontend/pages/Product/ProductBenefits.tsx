"use client";

import { benefits } from "./data";
import { FadeIn, StaggerContainer, ZoomIn } from "../../components/ui/motion";
import { motion } from "framer-motion";

export function ProductBenefits() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <ZoomIn key={index} className="h-full">
                            <motion.div
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                                className="bg-white rounded-2xl p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 h-full transition-all duration-300"
                            >
                                {/* Icon box */}
                                <div className="flex justify-center mb-5">
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient}
                  flex items-center justify-center shadow-md`}
                                    >
                                        <img
                                            src={benefit.icon}
                                            alt={benefit.title}
                                            className="w-8 h-8"
                                        />
                                    </motion.div>
                                </div>

                                <h4 className="text-gray-900 font-bold text-base mb-2">
                                    {benefit.title}
                                </h4>

                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        </ZoomIn>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
