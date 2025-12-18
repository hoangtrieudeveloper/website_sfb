import { ArrowRight } from "lucide-react";

export function ProductCTA() {
    return (
        <section id="contact" className="py-[60px] bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#2EABE2] rounded-2xl px-6 py-[120px] text-center flex flex-col items-center gap-[40px]">
                        <h2 className="text-white text-3xl md:text-4xl font-extrabold">
                            Miễn phí tư vấn
                        </h2>

                        <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                            Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách
                            chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình
                            chuyển đổi số.
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <a
                                href="/case-studies"
                                className="px-5 py-2.5 rounded-md border border-white/60 text-white text-xs font-semibold hover:bg-white/10 transition"
                            >
                                Xem case studies
                            </a>

                            <a
                                href="/contact"
                                className="px-5 py-2.5 rounded-md border border-white/60 text-white text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
                            >
                                Tư vấn miễn phí ngay
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
