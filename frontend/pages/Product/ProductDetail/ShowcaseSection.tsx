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
                        {product.showcase.overlay ? (
                            <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                                <div
                                    className={`${product.showcase.overlay.back.sizeClass} ${product.showcase.overlay.back.frameClass ?? ""}`}
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

                                <div
                                    className={`${product.showcase.overlay.front.positionClass ?? ""} ${product.showcase.overlay.front.frameClass ?? ""} ${product.showcase.overlay.front.sizeClass}`}
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
                            </div>
                        ) : (
                            // Nếu chỉ có 1 ảnh (sản phẩm khác vẫn dùng được)
                            <div
                                className={`${product.showcase.single?.sizeClass ?? "w-[701px] h-[511px]"} ${product.showcase.single?.frameClass ??
                                    "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"}`}
                            >
                                <ImageWithFallback
                                    src={
                                        product.showcase.single?.src ?? "/images/placeholder.png"
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
                                    <CheckCircle2 size={18} className="text-[#0B78B8] mt-0.5" />
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