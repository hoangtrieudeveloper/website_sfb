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
        <section className="py-20 bg-white">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <FadeIn className="text-center mb-16 max-w-4xl mx-auto">
                    {headerTitle && (
                        <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                            {headerTitle}
                        </h2>
                    )}
                    {headerDescription && (
                        <p className="text-gray-600 md:text-lg leading-relaxed max-w-3xl mx-auto">
                            {headerDescription}
                        </p>
                    )}
                </FadeIn>

                {/* Carousel */}
                <FadeIn delay={0.2} className="px-12 relative animate-in fade-in zoom-in duration-700">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4 py-4">
                            {items.filter((item: any) => item.isActive !== false).map((leader: any, index: number) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="group h-full bg-[#f9fafb] rounded-[16px] overflow-hidden hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 flex flex-col items-center p-8 text-center border border-transparent hover:border-blue-200"
                                    >
                                        <div className="mb-6 relative w-48 h-48 flex-shrink-0">
                                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-blue-100 transition-colors">
                                                <ImageWithFallback
                                                    src={leader.image}
                                                    alt={leader.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-[#0F172A] text-xl font-bold mb-1">
                                            {leader.name}
                                        </h3>

                                        <div className="text-[#2CA4E0] font-semibold text-sm uppercase mb-4 tracking-wider">
                                            {leader.position}
                                        </div>

                                        <p className="text-gray-500 text-xs leading-relaxed mb-6 max-w-xs mx-auto flex-grow">
                                            {leader.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-center gap-6 w-full pt-4 border-t border-gray-100 group-hover:border-blue-100">
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
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutLeadership;
