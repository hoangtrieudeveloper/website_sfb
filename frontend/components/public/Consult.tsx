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
        <section className="py-10 px-4 flex justify-center">
            <div className="container mx-auto flex justify-center">
                <ScrollAnimation variant="elastic-up" className="w-full flex justify-center">
                    <div
                        className="
                            flex flex-col justify-center items-center
                            w-full max-w-[1298px]
                            py-16 md:py-[120px] px-6 md:px-[20px]
                            rounded-[16px]
                            text-center
                            shadow-lg
                        "
                        style={{ backgroundColor }}
                    >

                        {/* Content Container */}
                        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

                            <h2 className="text-white text-3xl md:text-5xl font-bold mb-6">
                                {title}
                            </h2>

                            <p className="text-white/95 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-2xl font-medium">
                                {description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                                <Link
                                    href={buttons.secondary.link || "#"}
                                    className="flex h-[48px] px-[29px] py-[7px] justify-center items-center gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors duration-300 w-full sm:w-auto min-w-[180px]"
                                >
                                    {buttons.secondary.text}
                                </Link>

                                <Link
                                    href={buttons.primary.link || "#"}
                                    className="group flex h-[48px] px-[29px] py-[7px] justify-center items-center gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors duration-300 w-full sm:w-auto min-w-[200px]"
                                >
                                    <span>{buttons.primary.text}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
