"use client";

import Link from "next/link";
import { ArrowRight, Play, ChevronLeft } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ProductDetail } from "./data";
import { getLocalizedText } from "@/lib/utils/i18n";

interface HeroSectionProps {
    product: ProductDetail;
    locale?: 'vi' | 'en' | 'ja';
}

export function HeroSection({ product, locale = 'vi' }: HeroSectionProps) {
    const heroTexts = {
        vi: {
            contactNow: "LIÊN HỆ NGAY",
            demoSystem: "DEMO HỆ THỐNG",
            backFull: "Quay lại danh sách sản phẩm",
            backShort: "Danh sách sản phẩm",
        },
        en: {
            contactNow: "CONTACT US NOW",
            demoSystem: "DEMO SYSTEM",
            backFull: "Back to product list",
            backShort: "Product list",
        },
        ja: {
            contactNow: "今すぐお問い合わせ",
            demoSystem: "システムデモ",
            backFull: "製品一覧に戻る",
            backShort: "製品一覧",
        },
    };

    const t = heroTexts[locale];
    return (
        <section className="w-full max-w-[100vw] overflow-hidden">
            <div className="bg-[linear-gradient(31deg,#0870B4_51.21%,#2EABE2_97.73%)]">
                <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-[120px] pb-[60px] pt-[100px] sm:py-[110px] lg:py-[127.5px] min-[1920px]:py-0">
                    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-[56px] min-[1920px]:gap-[98px] min-[1920px]:h-[760px]">
                        {/* LEFT */}
                        <div className="text-white flex flex-col items-start gap-[29px] w-full lg:w-[543px] lg:shrink-0 max-w-full min-w-0">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-[#0B78B8] text-xs sm:text-sm font-semibold shadow-sm hover:bg-white/90 transition-all group -mb-1 sm:-mb-2"
                            >
                                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="hidden sm:inline">{t.backFull}</span>
                                <span className="sm:hidden">{t.backShort}</span>
                            </Link>
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

                            {(() => {
                                // Text và link từ cấu hình chi tiết sản phẩm, fallback về text mặc định
                                // Parse locale cho text từ cấu hình (có thể là string hoặc locale object)
                                const contactLabel = product.ctaContactText
                                    ? getLocalizedText(product.ctaContactText, locale)
                                    : t.contactNow;
                                const contactHref = product.ctaContactHref || `/${locale}/contact`;

                                const demoLabel = product.ctaDemoText
                                    ? getLocalizedText(product.ctaDemoText, locale)
                                    : t.demoSystem;
                                const demoHref = product.ctaDemoHref || "#";

                                return (
                                    <div className="flex flex-row items-stretch justify-start gap-1.5 sm:gap-4 w-full max-w-full">
                                        <Link
                                            href={contactHref}
                                            className="flex flex-1 max-w-[48%] sm:flex-initial min-h-[38px] sm:min-h-[56px] px-2 sm:px-5 items-center justify-center gap-1 sm:gap-[12px] rounded-[10px] sm:rounded-[12px] border border-[#29A3DD] bg-white text-[#0B78B8] font-semibold text-[10px] sm:text-[16px] transition hover:bg-white/90 max-w-full text-center"
                                        >
                                            {contactLabel} <ArrowRight size={16} className="shrink-0 sm:w-[18px] sm:h-[18px]" />
                                        </Link>

                                        <a
                                            href={demoHref}
                                            className="flex flex-1 max-w-[48%] sm:flex-initial min-h-[38px] sm:min-h-[54px] px-2 sm:px-5 items-center justify-center gap-1 sm:gap-[12px] rounded-[10px] sm:rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-['Plus_Jakarta_Sans'] text-[10px] sm:text-[16px] font-semibold leading-normal tracking-[0.32px] sm:tracking-[0.64px] uppercase transition hover:opacity-90 shadow-[0_12px_36px_0_rgba(59,90,136,0.12)] max-w-full text-center"
                                        >
                                            {demoLabel}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 sm:w-6 sm:h-6">
                                                <path d="M6 7.5002V7.2002C6 6.08009 6 5.51962 6.21799 5.0918C6.40973 4.71547 6.71547 4.40973 7.0918 4.21799C7.51962 4 8.08009 4 9.2002 4H17.8002C18.9203 4 19.4796 4 19.9074 4.21799C20.2837 4.40973 20.5905 4.71547 20.7822 5.0918C21 5.5192 21 6.07899 21 7.19691V13.8031C21 14.921 21 15.48 20.7822 15.9074C20.5905 16.2837 20.2839 16.5905 19.9076 16.7822C19.4802 17 18.921 17 17.8031 17H10.5M3 16.8002V11.2002C3 10.0801 3 9.51962 3.21799 9.0918C3.40973 8.71547 3.71547 8.40973 4.0918 8.21799C4.51962 8 5.08009 8 6.2002 8H6.80019C7.9203 8 8.47957 8 8.9074 8.21799C9.28372 8.40973 9.59048 8.71547 9.78223 9.0918C10 9.5192 10 10.079 10 11.1969V16.8031C10 17.921 10 18.48 9.78223 18.9074C9.59048 19.2837 9.28372 19.5905 8.9074 19.7822C8.47999 20 7.921 20 6.80309 20H6.19691C5.07899 20 4.5192 20 4.0918 19.7822C3.71547 19.5905 3.40973 19.2837 3.21799 18.9074C3 18.4796 3 17.9203 3 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </a>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* RIGHT (Ảnh/Video đúng kích thước Figma) */}
                        <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-center min-w-0 max-w-full">
                            <div
                                className="w-full max-w-[620px] aspect-[701/511] lg:w-[620px] lg:h-[500px] rounded-[24px] border-[6px] lg:border-[10px] border-white bg-white
                          shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden relative box-border"
                            >
                                {(() => {
                                    if (!product.heroImage) {
                                        return (
                                            <ImageWithFallback
                                                src="/images/no_cover.jpeg"
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 701px"
                                                loading="lazy"
                                                objectFit="cover"
                                            />
                                        );
                                    }

                                    let mediaUrl = product.heroImage;
                                    const lower = mediaUrl.toLowerCase();
                                    const isYouTube = lower.includes('youtube.com') || lower.includes('youtu.be');

                                    // Thêm protocol nếu thiếu (youtube.com -> https://youtube.com)
                                    if (!mediaUrl.startsWith('http')) {
                                        mediaUrl = `https://${mediaUrl}`;
                                    }

                                    if (isYouTube) {
                                        // Chuyển link watch / short sang embed
                                        let videoId = '';
                                        try {
                                            const urlObj = new URL(mediaUrl);
                                            if (urlObj.hostname.includes('youtu.be')) {
                                                videoId = urlObj.pathname.replace('/', '');
                                            } else if (urlObj.searchParams.get('v')) {
                                                videoId = urlObj.searchParams.get('v') || '';
                                            }
                                        } catch {
                                            // ignore parse error, fallback bên dưới
                                        }

                                        const embedSrc = videoId
                                            ? `https://www.youtube.com/embed/${videoId}`
                                            : mediaUrl;

                                        return (
                                            <iframe
                                                src={embedSrc}
                                                className="w-full h-full"
                                                title={product.name}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        );
                                    }

                                    const isVideoFile =
                                        mediaUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) || mediaUrl.includes('/video/');

                                    return isVideoFile ? (
                                        <video
                                            src={mediaUrl}
                                            controls
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <ImageWithFallback
                                            src={mediaUrl}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 701px"
                                            loading="lazy"
                                            objectFit="cover"
                                        />
                                    );
                                })()}
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
