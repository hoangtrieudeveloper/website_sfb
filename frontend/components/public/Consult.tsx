"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

export function Consult() {
    return (
        <section className="py-10 px-4 flex justify-center">
            <div className="container mx-auto flex justify-center">
                <ScrollAnimation variant="elastic-up" className="w-full flex justify-center">
                    <div className="
            flex flex-col justify-center items-center
            w-full max-w-[1298px]
            py-[120px] px-[20px]
            rounded-[16px]
            bg-[#29A3DD]
            text-center
            shadow-lg
          ">

                        {/* Content Container */}
                        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

                            <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">
                                Miễn phí tư vấn
                            </h2>

                            <p className="text-white/95 text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-medium">
                                Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                                <Link
                                    href="/solutions"
                                    className="flex h-[48px] px-[29px] py-[7px] justify-center items-center gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors duration-300 w-full sm:w-auto min-w-[180px]"
                                >
                                    Xem case studies
                                </Link>

                                <Link
                                    href="/contact"
                                    className="group flex h-[48px] px-[29px] py-[7px] justify-center items-center gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors duration-300 w-full sm:w-auto min-w-[200px]"
                                >
                                    <span>Tư vấn miễn phí ngay</span>
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
