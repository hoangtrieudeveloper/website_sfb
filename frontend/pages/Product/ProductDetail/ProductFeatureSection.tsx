import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { NumberedSection } from "./data";

interface ProductFeatureSectionProps {
    section: NumberedSection;
}

export function ProductFeatureSection({ section }: ProductFeatureSectionProps) {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-12 lg:gap-[90px]">
            <div
                className={
                    section.imageSide === "left" ? "order-1 lg:order-1" : "order-1 lg:order-2"
                }
            >
                <div className="w-full flex justify-center lg:justify-start">
                    <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top mb-[-266px] sm:mb-[-179px] md:mb-[-77px] lg:mb-0">
                        <div
                            className={`w-[701px] h-[511px] ${section.overlay?.back.frameClass ??
                                "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"
                                }`}
                        >
                            <ImageWithFallback
                                src={section.overlay?.back.src ?? section.image ?? "/images/no_cover.jpeg"}
                                alt={
                                    section.overlay?.back.alt ?? section.imageAlt ?? section.title
                                }
                                className={`w-full h-full ${section.overlay?.back.objectClass ?? "object-cover"
                                    }`}
                            />
                        </div>

                        {section.overlay?.front && (
                            <div
                                className={
                                    `${section.overlay.front.positionClass ??
                                    "absolute left-[183.5px] bottom-0"
                                    } ` +
                                    `${section.overlay.front.frameClass ??
                                    "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"
                                    } ` +
                                    `${section.overlay.front.sizeClass}`
                                }
                            >
                                <ImageWithFallback
                                    src={section.overlay.front.src || "/images/no_cover.jpeg"}
                                    alt={
                                        section.overlay.front.alt ??
                                        section.imageAlt ??
                                        section.title
                                    }
                                    className={`w-full h-full ${section.overlay.front.objectClass ?? "object-cover"
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div
                className={
                    section.imageSide === "left" ? "order-2 lg:order-2" : "order-2 lg:order-1"
                }
            >
                <div className="flex w-full max-w-[549px] flex-col items-start gap-6">
                    <div className="text-gray-900 text-xl md:text-2xl font-bold">
                        {section.no}. {section.title}
                    </div>
                    {section.paragraphs.map((p, i) => {
                        if (typeof p === "string") {
                            // Đoạn văn đơn giản: chỉ hiển thị nội dung, không có tiêu đề riêng
                            return (
                                <p
                                    key={`${section.no}-${i}`}
                                    className="self-stretch text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[30px]"
                                >
                                    {p}
                                </p>
                            );
                        }

                        // Đoạn văn có tiêu đề riêng
                        return (
                            <div key={`${section.no}-${i}`} className="flex flex-col self-stretch gap-2">
                                <div className="self-stretch text-[var(--Color-3,#29A3DD)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px]">
                                    {p.title}
                                </div>
                                <p className="self-stretch text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[30px]">
                                    {p.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ProductFeatureSectionPage() {
    return null;
}