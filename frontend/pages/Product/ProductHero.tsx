import { ArrowRight } from "lucide-react";

export function ProductHero() {
    return (
        <section
            className="relative flex items-center overflow-hidden"
            style={{
                height: '847px',
                paddingTop: '87px',
                background: 'linear-gradient(to bottom right, #0870B4, #2EABE2)' // Approximate existing gradient
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0088D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-white mb-8 text-5xl md:text-5xl">
                        Bộ giải pháp phần mềm
                        <span className="block text-white font-extrabold text-5xl mt-2">
                            Phục vụ Giáo dục, Công chứng &amp; Doanh nghiệp
                        </span>
                    </h1>

                    <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-3xl mx-auto">
                        Các sản phẩm SFB được xây dựng từ bài toán thực tế của cơ quan Nhà
                        nước, nhà trường và doanh nghiệp, giúp tối ưu quy trình và nâng cao
                        hiệu quả quản lý.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#products"
                            className="group px-10 py-5 bg-white text-[#006FB3] rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
                        >
                            Xem danh sách sản phẩm
                            <ArrowRight
                                className="group-hover:translate-x-2 transition-transform"
                                size={20}
                            />
                        </a>
                        <a
                            href="/contact"
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
                        >
                            Tư vấn giải pháp
                            <ArrowRight
                                className="group-hover:translate-x-2 transition-transform"
                                size={20}
                            />
                        </a>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">
                                +32.000
                            </div>
                            <div className="text-blue-200">Giải pháp phần mềm</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">
                                +6.000
                            </div>
                            <div className="text-blue-200">Đơn vị triển khai thực tế</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">4.9★</div>
                            <div className="text-blue-200">Mức độ hài lòng trung bình</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
