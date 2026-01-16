import { ArrowRight } from "lucide-react";

interface ProductHeroProps {
    data?: any;
}

export function ProductHero({ data }: ProductHeroProps) {
    // Nếu không có data thì không hiển thị gì
    if (!data) {
        return null;
    }

    const displayData = data;

    return (
        <section
            className="relative flex flex-col justify-start md:justify-center items-center overflow-hidden min-h-[100dvh] lg:min-h-0 lg:h-[787px] pt-32 md:pt-24 lg:pt-0 pb-16 lg:pb-0"
            style={{
                background: displayData.backgroundGradient || 'linear-gradient(to bottom right, #0870B4, #2EABE2)'
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0088D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 lg:mt-[57px]">
                <div className="max-w-4xl mx-auto text-center">
                    {displayData.title && (
                        <h1 className="text-white mb-6 min-[400px]:mb-10 sm:mb-8 text-2xl min-[400px]:text-4xl sm:text-4xl md:text-5xl lg:text-5xl leading-tight">
                            {displayData.title}
                            {displayData.subtitle && (
                                <span className="block text-white font-extrabold text-2xl min-[400px]:text-4xl sm:text-3xl md:text-4xl lg:text-5xl mt-3 min-[400px]:mt-6 sm:mt-3">
                                    {displayData.subtitle}
                                </span>
                            )}
                        </h1>
                    )}

                    {displayData.description && (
                        <p className="text-base min-[400px]:text-xl sm:text-lg lg:text-xl text-blue-100 leading-relaxed mb-8 min-[400px]:mb-14 sm:mb-10 max-w-3xl mx-auto px-2">
                            {displayData.description}
                        </p>
                    )}

                    <div className="flex flex-row flex-nowrap gap-2 sm:gap-4 justify-center w-full sm:w-auto px-1 sm:px-0">
                        {displayData.primaryCtaText && (
                            <a
                                href={displayData.primaryCtaLink || "#products"}
                                className="group px-3 py-3 sm:px-6 sm:py-3 md:px-10 md:py-5 bg-white text-[#006FB3] rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-1 sm:gap-3 font-semibold text-sm min-[400px]:text-base md:text-base min-w-[140px] sm:w-auto"
                            >
                                <span className="truncate">{displayData.primaryCtaText}</span>
                                <ArrowRight
                                    className="group-hover:translate-x-2 transition-transform flex-shrink-0"
                                    size={16}
                                />
                            </a>
                        )}
                        {displayData.secondaryCtaText && (
                            <a
                                href={displayData.secondaryCtaLink || "/contact"}
                                className="px-3 py-3 sm:px-6 sm:py-3 md:px-10 md:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-1 sm:gap-3 font-semibold text-sm min-[400px]:text-base md:text-base min-w-[140px] sm:w-auto"
                            >
                                <span className="truncate">{displayData.secondaryCtaText}</span>
                                <ArrowRight
                                    className="group-hover:translate-x-2 transition-transform flex-shrink-0"
                                    size={16}
                                />
                            </a>
                        )}
                    </div>

                    {(displayData.stat1Value || displayData.stat2Value || displayData.stat3Value) && (
                        <div className="grid grid-cols-3 gap-2 sm:gap-8 mt-8 min-[400px]:mt-20 sm:mt-16 max-w-3xl mx-auto">
                            {displayData.stat1Value && (
                                <div className="text-center">
                                    <div className="text-lg min-[400px]:text-2xl sm:text-4xl font-bold text-white mb-1">
                                        {displayData.stat1Value}
                                    </div>
                                    {displayData.stat1Label && (
                                        <div className="text-blue-100/90 text-[10px] min-[400px]:text-sm sm:text-base font-medium leading-tight">{displayData.stat1Label}</div>
                                    )}
                                </div>
                            )}
                            {displayData.stat2Value && (
                                <div className="text-center relative">
                                    {/* Separators for mobile */}
                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-white/20 sm:hidden"></div>
                                    <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-white/20 sm:hidden"></div>

                                    <div className="text-lg min-[400px]:text-2xl sm:text-4xl font-bold text-white mb-1">
                                        {displayData.stat2Value}
                                    </div>
                                    {displayData.stat2Label && (
                                        <div className="text-blue-100/90 text-[10px] min-[400px]:text-sm sm:text-base font-medium leading-tight">{displayData.stat2Label}</div>
                                    )}
                                </div>
                            )}
                            {displayData.stat3Value && (
                                <div className="text-center">
                                    <div className="text-lg min-[400px]:text-2xl sm:text-4xl font-bold text-white mb-1">
                                        {displayData.stat3Value}
                                    </div>
                                    {displayData.stat3Label && (
                                        <div className="text-blue-100/90 text-[10px] min-[400px]:text-sm sm:text-base font-medium leading-tight">{displayData.stat3Label}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ProductHeroPage() {
    return null;
}
