"use client";

import React, { useState, useEffect } from "react";
import {
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    Award,
    ArrowRight,
} from "lucide-react";
import { positions } from "./data";
import { FadeIn, StaggerContainer } from "../../components/ui/motion";
import { motion } from "framer-motion";
import { CustomPagination } from "../../components/common/CustomPagination";

interface CareerPositionsProps {
    data?: any;
}

export const CareerPositions = ({ data }: CareerPositionsProps) => {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || { items: positions };
    const headerTitle = displayData.headerTitle || "Vị trí đang tuyển";
    const headerDescription = displayData.headerDescription || "Tìm vị trí phù hợp với bạn và ứng tuyển ngay hôm nay";
    const items = displayData.items || positions;

    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter active items
    const activeItems = items.filter((item: any) => item.isActive !== false);

    // Calculate pagination
    const itemsPerPage = 2;
    const totalPages = Math.ceil(activeItems.length / itemsPerPage);

    const currentItems = isMobile
        ? activeItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : activeItems;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const section = document.getElementById('positions');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="positions" className="py-20 bg-white">
            <div className="max-w-[1340px] mx-auto px-6">
                <FadeIn className="text-center mb-16 max-w-3xl mx-auto">
                    {headerTitle && (
                        <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-6">{headerTitle}</h2>
                    )}
                    {headerDescription && (
                        <p className="text-gray-600 md:text-lg leading-relaxed">
                            {headerDescription}
                        </p>
                    )}
                </FadeIn>

                <StaggerContainer className="grid lg:grid-cols-2 gap-8">
                    {currentItems.map((position: any) => (
                        <FadeIn key={position.id} className="h-full">
                            <motion.div
                                whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
                                className="group bg-white rounded-[24px] p-4 md:p-8 border border-gray-100 hover:border-[#0870B4]/30 transition-all duration-300 h-full flex flex-col shadow-sm"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4 md:mb-6 gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[#0F172A] text-xl md:text-2xl font-bold mb-2 group-hover:text-[#0870B4] transition-colors truncate">
                                            {position.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-gray-500 text-xs md:text-sm font-medium flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} className="text-[#0870B4]" />
                                                <span>{position.department}</span>
                                            </div>
                                            <span className="px-2 md:px-4 py-1 md:py-1.5 bg-blue-50 text-[#0870B4] rounded-full text-xs md:text-sm font-semibold whitespace-nowrap">
                                                {position.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 md:gap-x-8 mb-6 md:mb-8 p-4 md:p-6 bg-gray-50/80 rounded-2xl border border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-gray-400 mt-0.5" size={18} />
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Địa điểm</div>
                                            <div className="text-gray-900 font-medium text-sm">{position.location}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <DollarSign className="text-gray-400 mt-0.5" size={18} />
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mức lương</div>
                                            <div className="text-gray-900 font-medium text-sm">{position.salary}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="text-gray-400 mt-0.5" size={18} />
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kinh nghiệm</div>
                                            <div className="text-gray-900 font-medium text-sm">{position.experience}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Award className="text-gray-400 mt-0.5" size={18} />
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Loại hình</div>
                                            <div className="text-gray-900 font-medium text-sm">{position.type}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                                    {position.description}
                                </p>

                                {/* Skills */}
                                <div className="mb-8">
                                    <div className="text-sm font-semibold text-gray-900 mb-3">
                                        Kỹ năng yêu cầu:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {position.skills.map((skill: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <a
                                    href="/contact"
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#0870B4] text-white rounded-xl hover:bg-[#065A93] transition-all transform hover:-translate-y-0.5 font-semibold shadow-md hover:shadow-lg"
                                >
                                    Ứng tuyển ngay
                                    <ArrowRight size={18} />
                                </a>
                            </motion.div>
                        </FadeIn>
                    ))}
                </StaggerContainer>

                {isMobile && totalPages > 1 && (
                    <div className="mt-8 md:hidden">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function CareerPositionsPage() {
    return null;
}
