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
            className="relative flex items-center overflow-hidden"
            style={{
                height: '787px',
                paddingTop: '57px',
                background: displayData.backgroundGradient || 'linear-gradient(to bottom right, #0870B4, #2EABE2)'
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0088D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {displayData.title && (
                        <h1 className="text-white mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-tight">
                            {displayData.title}
                            {displayData.subtitle && (
                                <span className="block text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-3">
                                    {displayData.subtitle}
                                </span>
                            )}
                        </h1>
                    )}

                    {displayData.description && (
                        <p className="text-base sm:text-lg lg:text-xl text-blue-100 leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
                            {displayData.description}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {displayData.primaryCtaText && (
                            <a
                                href={displayData.primaryCtaLink || "#products"}
                                className="group px-6 py-3 md:px-10 md:py-5 bg-white text-[#006FB3] rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold text-sm md:text-base"
                            >
                                {displayData.primaryCtaText}
                                <ArrowRight
                                    className="group-hover:translate-x-2 transition-transform"
                                    size={20}
                                />
                            </a>
                        )}
                        {displayData.secondaryCtaText && (
                            <a
                                href={displayData.secondaryCtaLink || "/contact"}
                                className="px-6 py-3 md:px-10 md:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold text-sm md:text-base"
                            >
                                {displayData.secondaryCtaText}
                                <ArrowRight
                                    className="group-hover:translate-x-2 transition-transform"
                                    size={20}
                                />
                            </a>
                        )}
                    </div>

                    {(displayData.stat1Value || displayData.stat2Value || displayData.stat3Value) && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-3xl mx-auto">
                            {displayData.stat1Value && (
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {displayData.stat1Value}
                                    </div>
                                    {displayData.stat1Label && (
                                        <div className="text-blue-200">{displayData.stat1Label}</div>
                                    )}
                                </div>
                            )}
                            {displayData.stat2Value && (
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {displayData.stat2Value}
                                    </div>
                                    {displayData.stat2Label && (
                                        <div className="text-blue-200">{displayData.stat2Label}</div>
                                    )}
                                </div>
                            )}
                            {displayData.stat3Value && (
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                                        {displayData.stat3Value}
                                    </div>
                                    {displayData.stat3Label && (
                                        <div className="text-blue-200">{displayData.stat3Label}</div>
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
