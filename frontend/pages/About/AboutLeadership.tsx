"use client";

import { Phone, Mail } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";

import { leaders } from "./data";
import { FadeIn } from "../../components/ui/motion";
import { motion } from "framer-motion";

interface AboutLeadershipProps {
  data?: any;
}

export function AboutLeadership({ data }: AboutLeadershipProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || { items: leaders };
    const headerTitle = displayData.headerTitle || "Ban lãnh đạo";
    const headerDescription = displayData.headerDescription || "Đội ngũ lãnh đạo chủ chốt của SFB Technology, định hướng chiến lược và đồng hành cùng khách hàng trong mọi dự án";
    const items = displayData.items || leaders;

    return (
        <section className="bg-white pt-[120px] pb-[80px] max-md:py-[72px] max-sm:py-14">
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <div className="mx-auto w-full max-w-[1340px]">
                {/* Header */}
                <FadeIn className="mx-auto max-w-4xl text-center mb-[90px] max-md:mb-12 max-sm:mb-10">
                    {headerTitle && (
                        <h2 className="text-[#0F172A] text-5xl font-bold mb-4 max-md:text-3xl">
                            {headerTitle}
                        </h2>
                    )}
                    {headerDescription && (
                        <p className="mx-auto w-full max-w-[576px] text-center text-[var(--Color-2,#0F172A)] font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[26px]">
                            {headerDescription}
                        </p>
                    )}
                </FadeIn>

                {/* Carousel */}
                <FadeIn delay={0.2} className="px-[clamp(16px,3.125vw,48px)] relative animate-in fade-in zoom-in duration-700">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-[34px] py-4 max-sm:-ml-4">
                            {items.filter((item: any) => item.isActive !== false).map((leader: any, index: number) => (
                                <CarouselItem key={index} className="pl-[34px] max-sm:pl-4 md:basis-1/2 lg:basis-1/3">
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="group h-full bg-[#f9fafb] rounded-[16px] overflow-hidden hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 flex flex-col items-center p-8 max-sm:p-6 text-center border border-transparent hover:border-blue-200"
                                    >
                                        <div className="mb-6 relative w-48 h-48 flex-shrink-0 max-sm:w-40 max-sm:h-40">
                                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-blue-100 transition-colors">
                                                <ImageWithFallback
                                                    src={leader.image}
                                                    alt={leader.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-[#0F172A] text-xl font-bold mb-3">
                                            {leader.name}
                                        </h3>

                                        <div className="text-[#2CA4E0] font-semibold text-sm uppercase mb-3 tracking-wider">
                                            {leader.position}
                                        </div>

                                        <p className="text-gray-500 text-xs leading-relaxed mb-3 max-w-xs mx-auto flex-grow">
                                            {leader.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-center gap-6 w-full pt-4 border-t border-gray-100 group-hover:border-blue-100 max-sm:flex-col max-sm:gap-3">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-[#2CA4E0]" />
                                                <a href={`tel:${leader.phone}`} className="text-[#334155] text-xs hover:text-[#2CA4E0] transition-colors font-medium">
                                                    {leader.phone}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-[#2CA4E0]" />
                                                <a href={`mailto:${leader.email}`} className="text-[#334155] text-xs hover:text-[#2CA4E0] transition-colors font-medium">
                                                    {leader.email}
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 border-[#2CA4E0] text-[#2CA4E0] hover:bg-[#2CA4E0] hover:text-white" />
                        <CarouselNext className="hidden md:flex -right-12 border-[#2CA4E0] text-[#2CA4E0] hover:bg-[#2CA4E0] hover:text-white" />
                    </Carousel>
                </FadeIn>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutLeadership;
