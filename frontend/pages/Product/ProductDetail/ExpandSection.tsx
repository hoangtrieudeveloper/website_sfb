import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ProductDetail } from "./data";

interface ExpandSectionProps {
    product: ProductDetail;
}

export function ExpandSection({ product }: ExpandSectionProps) {
    return (
        <section className="w-full bg-white">
            <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-10 min-[1920px]:px-[365px] pb-[45px]">
                <div className="mx-auto w-full max-w-[1191px] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-[90px] min-[1920px]:h-[511px]">
                    <div className="space-y-5 w-full lg:max-w-[400px] lg:shrink-0">
                        <h3 className="text-gray-900 text-2xl font-bold">
                            {product.expandTitle}
                        </h3>

                        <div className="space-y-3">
                            {product.expandBullets.map((b, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-1">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 0C4.48608 0 0 4.48493 0 9.99999C0 15.514 4.48608 19.9994 9.99996 19.9994C15.5138 19.9994 20 15.514 20 9.99999C20 4.48493 15.5138 0 9.99996 0ZM15.575 6.66503L9.42112 13.5881C9.2696 13.758 9.05846 13.8457 8.84571 13.8457C8.67691 13.8457 8.50731 13.7903 8.3654 13.6779L4.51916 10.6005C4.18761 10.3355 4.13384 9.85106 4.39921 9.5188C4.66426 9.18763 5.1488 9.13332 5.48035 9.3989L8.7561 12.0193L14.4249 5.64245C14.7066 5.32418 15.1934 5.29568 15.5107 5.57849C15.8284 5.86074 15.8573 6.34676 15.575 6.66503Z" fill="#1D8FCF" />
                                    </svg>
                                    <span className="text-gray-700">{b}</span>
                                </div>
                            ))}
                        </div>

                        <a
                            href={product.expandCtaHref}
                            className="inline-flex items-center gap-2 h-[44px] px-5 rounded-lg bg-[#2EABE2] text-white font-semibold hover:opacity-90 transition"
                        >
                            {product.expandCtaText} <ArrowRight size={18} />
                        </a>
                    </div>

                    <div className="w-full lg:max-w-[701px] lg:shrink-0">
                        <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_14px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                            <div className="relative w-full aspect-[701/511] min-[1920px]:w-[701px] min-[1920px]:h-[511px] min-[1920px]:aspect-auto">
                                <ImageWithFallback
                                    src={product.expandImage || "/images/no_cover.jpeg"}
                                    alt={product.expandTitle}
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
export default function ExpandSectionPage() {
    return null;
}