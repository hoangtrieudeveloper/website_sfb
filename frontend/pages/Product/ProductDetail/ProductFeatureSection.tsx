import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { NumberedSection } from "./data";

interface ProductFeatureSectionProps {
    section: NumberedSection;
}

export function ProductFeatureSection({ section }: ProductFeatureSectionProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
                className={
                    section.imageSide === "left" ? "order-1" : "order-2 lg:order-2"
                }
            >
                <div className="w-full flex justify-center lg:justify-start">
                    <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                        <div
                            className={`w-[701px] h-[511px] ${section.overlay?.back.frameClass ??
                                "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"
                                }`}
                        >
                            <ImageWithFallback
                                src={section.overlay?.back.src ?? section.image}
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
                                    src={section.overlay.front.src}
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
                    section.imageSide === "left" ? "order-2" : "order-1 lg:order-1"
                }
            >
                <div className="text-gray-900 text-xl md:text-2xl font-bold mb-4">
                    {section.no}. {section.title}
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    {section.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
