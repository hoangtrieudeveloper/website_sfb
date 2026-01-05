"use client";

import { TrendingUp } from "lucide-react";
import { milestones } from "./data";
import { FadeIn } from "../../components/ui/motion";
import { motion, Variants } from "framer-motion";

interface AboutMilestonesProps {
  data?: any;
}

const cardVariants: Variants = {
    hidden: (isLeft: boolean) => ({
        opacity: 0,
        x: isLeft ? -50 : 50,
        transition: { duration: 0.2 }
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const badgeVariants: Variants = {
    hidden: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 200, damping: 20 }
    }
};

const lineContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const lineFillVariants: Variants = {
    hidden: { height: "0%", transition: { duration: 0.1 } },
    visible: {
        height: "100%",
        transition: { duration: 1.0, ease: "linear" }
    }
};

export function AboutMilestones({ data }: AboutMilestonesProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || { items: milestones };
    const headerTitle = displayData.headerTitle || "Hành trình phát triển";
    const headerDescription = displayData.headerDescription || "Từ năm 2017 đến nay, SFB liên tục mở rộng đội ngũ, nâng cấp sản phẩm và chuẩn hóa dịch vụ để đồng hành cùng khách hàng lâu dài";
    const items = displayData.items || milestones;

    return (
        <section className="py-[120px] max-md:py-[clamp(56px,12vw,96px)] bg-[#80C0E4] overflow-hidden">
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <div className="mx-auto w-full max-w-[1340px]">
                {/* Header */}
                <FadeIn className="text-center mb-24 max-w-4xl mx-auto">
                    {headerTitle && (
                        <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                            {headerTitle}
                        </h2>
                    )}
                    {headerDescription && (
                        <p className="text-gray-600 md:text-lg leading-relaxed max-w-2xl mx-auto">
                            {headerDescription}
                        </p>
                    )}
                </FadeIn>

                <div className="max-w-5xl mx-auto relative lg:min-h-[800px]">
                    <div className="space-y-12 lg:space-y-0 relative">
                        {items.filter((item: any) => item.isActive !== false).map((item: any, index: number) => {
                            const isLeft = index % 2 === 0;

                            return (
                                <div key={index} className="relative lg:min-h-[300px] flex flex-col lg:flex-row items-center justify-center">
                                    {/* Mobile Year Badge */}
                                    <div className="lg:hidden mb-6 bg-[#2CA4E0] text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg">
                                        {item.year}
                                    </div>

                                    {/* Left Side */}
                                    <div className={`flex-1 w-full lg:w-auto flex ${isLeft ? 'justify-end lg:pr-[clamp(24px,8.333vw,160px)]' : 'justify-start lg:pl-[clamp(24px,8.333vw,160px)] order-last'}`}>
                                        <motion.div
                                            custom={isLeft}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: false, margin: "-100px" }}
                                            variants={cardVariants}
                                            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(44, 164, 224, 0.15)" }}
                                            className="bg-white rounded-[24px] p-8 shadow-sm max-w-lg w-full relative z-10 border border-transparent hover:border-blue-100 transition-colors duration-300 cursor-default"
                                        >
                                            <div className="w-10 h-10 mb-4 text-[#2CA4E0] text-2xl">
                                                {item.icon || "🚀"}
                                            </div>
                                            {item.year && (
                                                <div className="mb-2">
                                                    <span className="text-[#2CA4E0] font-bold text-lg">{item.year}</span>
                                                </div>
                                            )}
                                            <h3 className="text-[#0F172A] font-bold text-lg mb-3">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    </div>

                                    {/* Center Year Badge (Desktop only) */}
                                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20 flex-col">
                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: false, margin: "-100px" }}
                                            variants={badgeVariants}
                                            className="bg-[#2CA4E0] text-white px-8 py-3 rounded-full text-2xl font-normal shadow-md whitespace-nowrap relative z-20 border-[4px] border-[#F8FBFE]"
                                        >
                                            {item.year}
                                        </motion.div>

                                        {/* Connecting Line to next item */}
                                        {index < items.filter((i: any) => i.isActive !== false).length - 1 && (
                                            <motion.div
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: false, amount: 0.5 }}
                                                variants={lineContainerVariants}
                                                className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-[220px] z-10 bg-[#E2E8F0] overflow-hidden"
                                            >
                                                <motion.div
                                                    variants={lineFillVariants}
                                                    className="w-full bg-[#2CA4E0]"
                                                />
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Right Side Spacer/Content */}
                                    <div className={`flex-1 hidden lg:block ${isLeft ? 'pl-[clamp(24px,8.333vw,160px)]' : 'pr-[clamp(24px,8.333vw,160px)]'}`}></div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutMilestones;