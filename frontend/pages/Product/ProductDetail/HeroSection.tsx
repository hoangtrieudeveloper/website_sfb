import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ProductDetail } from "./data";

interface HeroSectionProps {
    product: ProductDetail;
}

export function HeroSection({ product }: HeroSectionProps) {
    return (
        <section className="w-full max-w-[100vw] overflow-hidden">
            <div className="bg-[linear-gradient(31deg,#0870B4_51.21%,#2EABE2_97.73%)]">
                <div className="mx-auto w-full max-w-[1920px] px-4 min-[1920px]:px-[243px] py-[80px] sm:py-[110px] lg:py-[127.5px] min-[1920px]:py-0">
                    <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-[56px] min-[1920px]:gap-[98px] min-[1920px]:h-[760px]">
                        {/* LEFT */}
                        <div className="text-white flex flex-col items-start gap-[29px] w-full lg:w-[543px] lg:shrink-0 max-w-full min-w-0">
                            <div
                                className="text-white uppercase font-medium text-[16px]"
                                style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                            >
                                {product.metaTop}
                            </div>

                            <h1
                                className="text-[32px] sm:text-[44px] lg:text-[56px] leading-[normal] font-extrabold w-full break-words"
                                style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                            >
                                {product.name}
                            </h1>

                            <p className="text-white/85 text-[14px] leading-[22px] max-w-full break-words">
                                {product.heroDescription}
                            </p>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full max-w-full">
                                <Link
                                    href="/contact"
                                    className="flex min-h-[56px] px-5 items-center justify-center gap-[12px] rounded-[12px] border border-[#29A3DD] bg-white text-[#0B78B8] font-semibold text-[16px] transition hover:bg-white/90 max-w-full text-center"
                                >
                                    LIÊN HỆ NGAY <ArrowRight size={18} className="shrink-0" />
                                </Link>

                                <a
                                    href="#demo"
                                    className="flex min-h-[54px] px-5 items-center justify-center gap-[12px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-['Plus_Jakarta_Sans'] text-[16px] font-semibold leading-normal tracking-[0.64px] uppercase transition hover:opacity-90 shadow-[0_12px_36px_0_rgba(59,90,136,0.12)] max-w-full text-center"
                                >
                                    DEMO HỆ THỐNG
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                        <path d="M6 7.5002V7.2002C6 6.08009 6 5.51962 6.21799 5.0918C6.40973 4.71547 6.71547 4.40973 7.0918 4.21799C7.51962 4 8.08009 4 9.2002 4H17.8002C18.9203 4 19.4796 4 19.9074 4.21799C20.2837 4.40973 20.5905 4.71547 20.7822 5.0918C21 5.5192 21 6.07899 21 7.19691V13.8031C21 14.921 21 15.48 20.7822 15.9074C20.5905 16.2837 20.2839 16.5905 19.9076 16.7822C19.4802 17 18.921 17 17.8031 17H10.5M3 16.8002V11.2002C3 10.0801 3 9.51962 3.21799 9.0918C3.40973 8.71547 3.71547 8.40973 4.0918 8.21799C4.51962 8 5.08009 8 6.2002 8H6.80019C7.9203 8 8.47957 8 8.9074 8.21799C9.28372 8.40973 9.59048 8.71547 9.78223 9.0918C10 9.5192 10 10.079 10 11.1969V16.8031C10 17.921 10 18.48 9.78223 18.9074C9.59048 19.2837 9.28372 19.5905 8.9074 19.7822C8.47999 20 7.921 20 6.80309 20H6.19691C5.07899 20 4.5192 20 4.0918 19.7822C3.71547 19.5905 3.40973 19.2837 3.21799 18.9074C3 18.4796 3 17.9203 3 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* RIGHT (Ảnh đúng kích thước Figma) */}
                        <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-start min-w-0 max-w-full">
                            <div
                                className="w-full max-w-[701px] aspect-[701/511] lg:w-[701px] lg:h-[511px] rounded-[24px] border-[6px] lg:border-[10px] border-white bg-white
                          shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden relative box-border"
                            >
                                <ImageWithFallback
                                    src={product.heroImage || "/images/no_cover.jpeg"}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 701px"
                                    loading="lazy"
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function HeroSectionPage() {
    return null;
}