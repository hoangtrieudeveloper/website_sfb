import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ProductDetail } from "./data";

interface HeroSectionProps {
    product: ProductDetail;
}

export function HeroSection({ product }: HeroSectionProps) {
    return (
        <section className="w-full">
            <div className="bg-[linear-gradient(31deg,#0870B4_51.21%,#2EABE2_97.73%)]">
                <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[243px] pt-[120px] sm:pt-[160px] lg:pt-[194.5px] pb-[80px] sm:pb-[110px] lg:pb-[127.5px]">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-[98px]">
                        {/* LEFT */}
                        <div className="text-white flex flex-col items-start gap-[29px] w-full lg:w-[486px]">
                            <div
                                className="text-white uppercase font-medium text-[16px]"
                                style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                            >
                                {product.metaTop}
                            </div>

                            <h1
                                className="text-[32px] sm:text-[44px] lg:text-[56px] leading-[normal] font-extrabold w-full lg:w-[543px]"
                                style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                            >
                                {product.name}
                            </h1>

                            <p className="text-white/85 text-[14px] leading-[22px]">
                                {product.heroDescription}
                            </p>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                                <Link
                                    href="/contact"
                                    className="h-[48px] px-6 rounded-xl bg-white text-[#0B78B8] font-semibold text-[16px]
                         inline-flex items-center gap-2 hover:bg-white/90 transition"
                                >
                                    LIÊN HỆ NGAY <ArrowRight size={18} />
                                </Link>

                                <a
                                    href="#demo"
                                    className="h-[48px] px-6 rounded-xl border border-white/80 text-white font-semibold text-[16px]
                         inline-flex items-center gap-3 hover:bg-white/10 transition"
                                >
                                    DEMO HỆ THỐNG
                                    <span className="w-7 h-7 rounded-full border border-white/70 flex items-center justify-center">
                                        <Play size={14} className="ml-[1px]" />
                                    </span>
                                </a>
                            </div>
                        </div>

                        {/* RIGHT (Ảnh đúng kích thước Figma) */}
                        <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-start">
                            <div
                                className="w-full max-w-[701px] aspect-[701/511] lg:w-[701px] lg:h-[511px] rounded-[24px] border-[6px] lg:border-[10px] border-white bg-white
                          shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"
                            >
                                <ImageWithFallback
                                    src={product.heroImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
