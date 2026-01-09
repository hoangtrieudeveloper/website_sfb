"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

import { consultData } from "./data";

interface ConsultProps {
    data?: any;
}

export function Consult({ data }: ConsultProps) {
    // Use data from props if available, otherwise fallback to static data
    const title = data?.title || consultData.title;
    const description = data?.description || consultData.description;
    const buttons = data?.buttons || consultData.buttons;
    const backgroundColor = data?.backgroundColor || '#29A3DD';

    return (
        <section className="py-8 sm:py-10 px-4 flex justify-center">
            <div className="container mx-auto flex justify-center">
                <ScrollAnimation variant="elastic-up" className="w-full flex justify-center">
                    <div
                        className="
                            flex flex-col justify-center items-center
                            w-full max-w-[1298px]
                            py-12 sm:py-16 md:py-[120px] px-4 sm:px-6 md:px-[20px]
                            rounded-[16px]
                            text-center
                            shadow-lg
                        "
                        style={{ backgroundColor }}
                    >

                        {/* Content Container */}
                        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

                            <h2 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold mb-5 sm:mb-6">
                                {title}
                            </h2>

                            <p className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed mb-7 sm:mb-8 md:mb-10 max-w-2xl font-medium">
                                {description}
                            </p>

                            <div className="flex flex-row flex-nowrap items-stretch gap-2 sm:gap-4 w-full justify-center">
                                <Link
                                    href={buttons.secondary.link || "#"}
                                    className="flex min-h-[44px] sm:h-[48px] px-2 sm:px-[29px] py-2 sm:py-[7px] justify-center items-center gap-2 sm:gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors duration-300 flex-1 sm:flex-none min-w-0 text-[11px] sm:text-base leading-tight text-center"
                                >
                                    <span className="whitespace-normal break-words">{buttons.secondary.text}</span>
                                </Link>

                                <Link
                                    href={buttons.primary.link || "#"}
                                    className="group flex min-h-[44px] sm:h-[48px] px-2 sm:px-[29px] py-2 sm:py-[7px] justify-center items-center gap-2 sm:gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors duration-300 flex-1 sm:flex-none min-w-0 text-[11px] sm:text-base leading-tight text-center"
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
