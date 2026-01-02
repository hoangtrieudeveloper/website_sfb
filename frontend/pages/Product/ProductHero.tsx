import { ArrowRight } from "lucide-react";

interface ProductHeroProps {
    data?: any;
}

export function ProductHero({ data }: ProductHeroProps) {
    // Fallback data
    const defaultData = {
        title: "Bộ giải pháp phần mềm",
        subtitle: "Phục vụ Giáo dục, Công chứng & Doanh nghiệp",
        description: "Các sản phẩm SFB được xây dựng từ bài toán thực tế của cơ quan Nhà nước, nhà trường và doanh nghiệp, giúp tối ưu quy trình và nâng cao hiệu quả quản lý.",
        primaryCtaText: "Xem danh sách sản phẩm",
        primaryCtaLink: "#products",
        secondaryCtaText: "Tư vấn giải pháp",
        secondaryCtaLink: "/contact",
        stat1Label: "Giải pháp phần mềm",
        stat1Value: "+32.000",
        stat2Label: "Đơn vị triển khai thực tế",
        stat2Value: "+6.000",
        stat3Label: "Mức độ hài lòng trung bình",
        stat3Value: "4.9★",
        backgroundGradient: "linear-gradient(to bottom right, #0870B4, #2EABE2)",
    };

    const displayData = data || defaultData;

    return (
        <section
            className="relative flex items-center overflow-hidden"
            style={{
                height: '847px',
                paddingTop: '87px',
                background: displayData.backgroundGradient || defaultData.backgroundGradient
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0088D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {displayData.title && (
                        <h1 className="text-white mb-8 text-5xl md:text-5xl">
                            {displayData.title}
                            {displayData.subtitle && (
                                <span className="block text-white font-extrabold text-5xl mt-2">
                                    {displayData.subtitle}
                                </span>
                            )}
                        </h1>
                    )}

                    {displayData.description && (
                        <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-3xl mx-auto">
                            {displayData.description}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {displayData.primaryCtaText && (
                            <a
                                href={displayData.primaryCtaLink || "#products"}
                                className="group px-10 py-5 bg-white text-[#006FB3] rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
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
                                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
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
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                            {displayData.stat1Value && (
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {displayData.stat1Value}
                                    </div>
                                    {displayData.stat1Label && (
                                        <div className="text-blue-200">{displayData.stat1Label}</div>
                                    )}
                                </div>
                            )}
                            {displayData.stat2Value && (
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {displayData.stat2Value}
                                    </div>
                                    {displayData.stat2Label && (
                                        <div className="text-blue-200">{displayData.stat2Label}</div>
                                    )}
                                </div>
                            )}
                            {displayData.stat3Value && (
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white mb-2">
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
