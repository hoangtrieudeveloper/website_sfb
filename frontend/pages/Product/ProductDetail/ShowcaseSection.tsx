import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ProductDetail } from "./data";

interface ShowcaseSectionProps {
    product: ProductDetail;
}

export function ShowcaseSection({ product }: ShowcaseSectionProps) {
    return (
        <section className="w-full bg-white">
            <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-10 min-[1920px]:px-[243px]">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 sm:gap-12 lg:gap-[60px] min-[1920px]:gap-[90px]  min-[1920px]:py-0 min-[1920px]:h-[567px]">
                    <div className="relative w-full lg:w-auto flex justify-center lg:justify-start">
                        {product.showcase.overlay && (product.showcase.overlay.back || product.showcase.overlay.front) ? (
                            <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                                {/* Back image - Chỉ hiển thị nếu có */}
                                {product.showcase.overlay.back && (
                                    <div
                                        className={`${product.showcase.overlay.back.sizeClass ?? "w-[701px] h-[511px]"} ${product.showcase.overlay.back.frameClass ?? "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"}`}
                                    >
                                        <ImageWithFallback
                                            src={product.showcase.overlay.back.src}
                                            alt={
                                                product.showcase.overlay.back.alt ??
                                                product.showcase.title
                                            }
                                            className={`w-full h-full ${product.showcase.overlay.back.objectClass ?? "object-contain"}`}
                                        />
                                    </div>
                                )}

                                {/* Front image - Chỉ hiển thị nếu có */}
                                {/* Nếu có back: front sẽ absolute (overlay) */}
                                {/* Nếu không có back: front sẽ relative (hiển thị như ảnh đơn) */}
                                {product.showcase.overlay.front && (
                                    <div
                                        className={`${product.showcase.overlay.back
                                                ? (product.showcase.overlay.front.positionClass ?? "absolute left-[183.5px] bottom-0")
                                                : "relative"
                                            } ${product.showcase.overlay.front.frameClass ?? "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"} ${product.showcase.overlay.front.sizeClass ?? (product.showcase.overlay.back ? "w-[400px] h-[300px]" : "w-[701px] h-[511px]")}`}
                                    >
                                        <ImageWithFallback
                                            src={product.showcase.overlay.front.src}
                                            alt={
                                                product.showcase.overlay.front.alt ??
                                                product.showcase.title
                                            }
                                            className={`w-full h-full ${product.showcase.overlay.front.objectClass ?? "object-contain"}`}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Nếu chỉ có 1 ảnh (sản phẩm khác vẫn dùng được)
                            <div
                                className={`${product.showcase.single?.sizeClass ?? "w-[701px] h-[511px]"} ${product.showcase.single?.frameClass ??
                                    "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"}`}
                            >
                                <ImageWithFallback
                                    src={
                                        product.showcase.single?.src ?? "/images/no_cover.jpeg"
                                    }
                                    alt={product.showcase.single?.alt ?? product.showcase.title}
                                    className={`w-full h-full ${product.showcase.single?.objectClass ?? "object-contain"}`}
                                />
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Text */}
                    <div className="flex w-full max-w-[549px] flex-col items-start gap-6">
                        <h3 className="text-gray-900 text-2xl font-bold">
                            {product.showcase.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {product.showcase.desc}
                        </p>

                        <div className="space-y-3">
                            {product.showcase.bullets.map((b, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-1">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 0C4.48608 0 0 4.48493 0 9.99999C0 15.514 4.48608 19.9994 9.99996 19.9994C15.5138 19.9994 20 15.514 20 9.99999C20 4.48493 15.5138 0 9.99996 0ZM15.575 6.66503L9.42112 13.5881C9.2696 13.758 9.05846 13.8457 8.84571 13.8457C8.67691 13.8457 8.50731 13.7903 8.3654 13.6779L4.51916 10.6005C4.18761 10.3355 4.13384 9.85106 4.39921 9.5188C4.66426 9.18763 5.1488 9.13332 5.48035 9.3989L8.7561 12.0193L14.4249 5.64245C14.7066 5.32418 15.1934 5.29568 15.5107 5.57849C15.8284 5.86074 15.8573 6.34676 15.575 6.66503Z" fill="#1D8FCF" />
                                    </svg>
                                    <span className="text-gray-700">{b}</span>
                                </div>
                            ))}
                        </div>

                        {product.showcase.ctaHref && (
                            <Link
                                href={product.showcase.ctaHref}
                                className="inline-flex items-center gap-2 h-[42px] px-5 rounded-lg bg-[#2EABE2] text-white font-semibold hover:opacity-90 transition"
                            >
                                {product.showcase.ctaText ?? "Liên hệ"} <ArrowRight size={18} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ShowcaseSectionPage() {
    return null;
}