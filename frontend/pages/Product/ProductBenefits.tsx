import { benefits } from "./data";
import { PLACEHOLDER_TITLE } from "@/lib/placeholders";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface ProductBenefitsProps {
    data?: any[];
}

const BenefitCard = ({ benefit, className = "" }: { benefit: any, className?: string }) => {
    return (
        <div
            className={`bg-white rounded-2xl p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] transition-all duration-300 h-full ${className}`}
        >
            {/* Icon box */}
            {benefit.icon && (
                <div className="flex justify-center mb-5">
                    <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient || 'from-[#006FB3] to-[#0088D9]'}
flex items-center justify-center shadow-md`}
                    >
                        <img
                            src={benefit.icon}
                            alt={benefit.title || PLACEHOLDER_TITLE}
                            className="w-8 h-8"
                        />
                    </div>
                </div>
            )}

            {benefit.title && (
                <h4 className="text-gray-900 font-bold text-base mb-2">
                    {benefit.title}
                </h4>
            )}

            {benefit.description && (
                <p className="text-gray-500 text-sm leading-relaxed">
                    {benefit.description}
                </p>
            )}
        </div>
    );
};

export function ProductBenefits({ data }: ProductBenefitsProps) {
    const displayBenefits = data && data.length > 0 ? data : benefits;
    const items = displayBenefits
        .filter((benefit: any) => benefit.isActive !== false)
        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return (
        <section className="py-10 sm:py-20 bg-white">
            <div className="container mx-auto px-6">
                {/* Desktop Grid (>= lg) */}
                <div className="hidden lg:flex flex-wrap justify-center gap-8">
                    {items.map((benefit: any, index: number) => (
                        <div key={benefit.id || index} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] min-w-[250px]">
                            <BenefitCard benefit={benefit} />
                        </div>
                    ))}
                </div>

                {/* Mobile Slider (< lg) */}
                <div className="lg:hidden">
                    <MobileSlider items={items} />
                </div>
            </div>
        </section>
    );
}

// Mobile Slider Component
function MobileSlider({ items }: { items: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y touch-pinch-zoom gap-4 ml-[-1rem]">
                    {items.map((item, index) => (
                        <div key={index} className="flex-[0_0_85%] min-w-0 pl-4">
                            <BenefitCard benefit={item} className="shadow-none border-gray-200" />
                        </div>
                    ))}
                    {/* Spacer for right padding */}
                    <div className="flex-[0_0_1px]" />
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {items.map((_: any, index: number) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-[#2CA4E0] w-6" : "bg-blue-100"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ProductBenefitsPage() {
    return null;
}
