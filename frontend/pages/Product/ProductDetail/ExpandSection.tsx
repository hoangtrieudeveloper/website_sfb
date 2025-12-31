import { CheckCircle2, ArrowRight } from "lucide-react";
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
                                    <CheckCircle2 size={18} className="text-[#0B78B8] mt-0.5" />
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
                                    src={product.expandImage}
                                    alt={product.expandTitle}
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
