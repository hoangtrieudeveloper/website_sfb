"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

interface ConsultProps {
    data?: any;
    locale?: 'vi' | 'en' | 'ja';
}

export function Consult({ data, locale }: ConsultProps) {
    // Chỉ sử dụng data từ API, không có fallback static data
    if (!data) {
        return null;
    }

    const title = data?.title;
    const description = data?.description;
    const buttons = data?.buttons;
    const backgroundColor = data?.backgroundColor || '#29A3DD';

    // Không render nếu không có dữ liệu cần thiết
    if (!title || !description || !buttons) {
        return null;
    }

    return (
        <section className="pt-8 md:pt-[45px] pb-12 md:pb-[90px]">
            <div className="relative z-10 w-full container mx-auto px-4 md:px-6">
                <ScrollAnimation variant="elastic-up" className="w-full">
                    <div
                        className="
                            flex flex-col justify-center items-center
                            w-full
                            py-10 md:py-16 lg:py-20 2xl:py-[120px]
                            px-6 md:px-10 2xl:px-[72px]
                            rounded-[16px]
                            text-center
                            shadow-lg
                        "
                        style={{ backgroundColor }}
                    >

                        {/* Content Container */}
                        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

                            <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-[56px] font-bold mb-5 sm:mb-6">
                                {title}
                            </h2>

                            <p className="text-white/95 text-base md:text-lg leading-relaxed mb-7 sm:mb-8 md:mb-10 max-w-2xl font-medium">
                                {description}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch gap-3 sm:gap-4 w-full justify-center">
                                <Link
                                    href={buttons.secondary.link || "#"}
                                    prefetch={true}
                                    className="flex w-full sm:w-auto min-h-[44px] sm:h-[48px] px-4 sm:px-[29px] py-2 sm:py-[7px] justify-center items-center gap-2 sm:gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors duration-300 text-sm sm:text-base leading-tight text-center"
                                >
                                    <span className="whitespace-normal break-words">{buttons.secondary.text}</span>
                                </Link>

                                <Link
                                    href={buttons.primary.link || "#"}
                                    prefetch={true}
                                    className="group flex w-full sm:w-auto min-h-[44px] sm:h-[48px] px-4 sm:px-[29px] py-2 sm:py-[7px] justify-center items-center gap-2 sm:gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors duration-300 text-sm sm:text-base leading-tight text-center"
                                >
                                    <span className="whitespace-normal break-words">{buttons.primary.text}</span>
                                    <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
