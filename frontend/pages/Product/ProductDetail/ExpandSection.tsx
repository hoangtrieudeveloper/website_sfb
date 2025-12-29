import { CheckCircle2, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ProductDetail } from "./data";

interface ExpandSectionProps {
    product: ProductDetail;
}

export function ExpandSection({ product }: ExpandSectionProps) {
    return (
        <section className="w-full bg-white">
            <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-5">
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

                    <div>
                        <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_14px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                            <div className="relative aspect-[16/9]">
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
