import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function AboutHero() {
    return (
        <section
            className="relative w-full flex justify-center items-center overflow-hidden"
            style={{
                height: '847px',
                paddingTop: '87px',
                background: 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)'
            }}
        >
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-[98px]">
                    {/* Text Content */}
                    <div className="text-white lg:max-w-[45%]">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                            SFB Technology
                            <span className="block mt-2">
                                Công ty cổ phần
                                <br />
                                công nghệ SFB
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed font-light">
                            Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành
                            cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình
                            chuyển đổi số với hàng trăm dự án triển khai thực tế.
                        </p>

                        <a
                            href="/solutions"
                            className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105"
                        >
                            KHÁM PHÁ GIẢI PHÁP
                            <ArrowRight size={18} />
                        </a>
                    </div>

                    {/* Image Content */}
                    <div className="relative flex-none lg:w-[851px] lg:h-[512px] w-full h-auto flex justify-center items-center bg-white border-[10px] border-white rounded-[24px] shadow-[0_18px_36px_0_rgba(0,0,0,0.12)] flex-shrink-0">
                        <ImageWithFallback
                            src="/images/abouthero.png"
                            alt="About Hero Detail"
                            className="w-full h-full object-cover rounded-[14px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
