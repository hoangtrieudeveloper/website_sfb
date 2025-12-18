import { ArrowRight } from "lucide-react";

export function AboutCTA() {
    return (
        <section className="py-28 bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-white mb-6">
                        Hãy cùng SFB xây dựng hệ thống phù hợp cho đơn vị
                        của bạn
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                        Liên hệ để được tư vấn về giải pháp phần mềm, hạ
                        tầng và chuyển đổi số phù hợp với nhu cầu thực tế
                        của cơ quan, tổ chức hoặc doanh nghiệp.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="group px-10 py-5 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
                        >
                            Liên hệ ngay
                            <ArrowRight
                                className="group-hover:translate-x-2 transition-transform"
                                size={20}
                            />
                        </a>
                        <a
                            href="/careers"
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
                        >
                            Tuyển dụng
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
