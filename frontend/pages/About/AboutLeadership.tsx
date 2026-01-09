"use client";

import { Phone, Mail } from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";

import { leaders } from "./data";
import { FadeIn, InViewSection } from "../../components/ui/motion";
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
        <section className="py-10 sm:py-20 bg-white">
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <InViewSection className="mx-auto w-full max-w-[1340px]">
                    {/* Header */}
                    <FadeIn className="text-center mb-8 sm:mb-16 max-w-4xl mx-auto">
                        {headerTitle && (
                            <h2 className="text-[#0F172A] text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
                                {headerTitle}
                            </h2>
                        )}
                        {headerDescription && (
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                                {headerDescription}
                            </p>
                        )}
                    </FadeIn>

                    {/* Carousel */}
                    <FadeIn delay={0.2} className="px-[clamp(16px,3.125vw,48px)] relative">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4 py-4">
                                {items.filter((item: any) => item.isActive !== false).map((leader: any, index: number) => (
                                    <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                                        <motion.div
                                            whileHover={{ y: -8 }}
                                            className="group flex flex-col w-full max-w-[410px] h-[523px] p-6 items-start gap-6 rounded-[24px] bg-white shadow-none transition-all duration-300 mx-auto"
                                        >
                                            <div
                                                className="h-[234px] flex-shrink-0 self-stretch rounded-[8px] bg-lightgray bg-no-repeat bg-cover bg-center"
                                                style={{ backgroundImage: `url(${leader.image})` }}
                                            />

                                            <div className="flex flex-col items-start w-full">
                                                <h3 className="self-stretch text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px] [font-feature-settings:'liga'_off,'clig'_off] mb-1">
                                                    {leader.name}
                                                </h3>

                                                <div className="w-full max-w-[336px] self-center text-[#1D8FCF] text-center font-['Plus_Jakarta_Sans'] text-[13px] font-medium leading-normal uppercase [font-feature-settings:'liga'_off,'clig'_off] overflow-hidden text-ellipsis line-clamp-1 mb-3">
                                                    {leader.position}
                                                </div>

                                                <p className="w-full max-w-[336px] self-center text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[26px] [font-feature-settings:'liga'_off,'clig'_off] mb-0">
                                                    {leader.description}
                                                </p>
                                            </div>

                                            <div className="mt-auto flex flex-row flex-wrap sm:flex-nowrap gap-4 sm:gap-6 w-full pt-4 border-t border-gray-100 group-hover:border-blue-50 items-center justify-center">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={16} className="text-[#2CA4E0] flex-shrink-0" />
                                                    <a href={`tel:${leader.phone}`} className="text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[26px] [font-feature-settings:'liga'_off,'clig'_off] hover:text-[#2CA4E0] transition-colors whitespace-nowrap">
                                                        {leader.phone}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={16} className="text-[#2CA4E0] flex-shrink-0" />
                                                    <a href={`mailto:${leader.email}`} className="text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[26px] [font-feature-settings:'liga'_off,'clig'_off] hover:text-[#2CA4E0] transition-colors whitespace-nowrap">
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
                </InViewSection>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutLeadership;
