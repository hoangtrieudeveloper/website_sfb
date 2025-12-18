
import { ArrowRight, MapPin, Phone, Mail, Building2 } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function AboutCompany() {
    return (
        <section className="py-20 bg-[#F8FBFE] overflow-hidden">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-[#2CA4E0] font-semibold text-sm tracking-wider uppercase mb-3 block">
                        GIỚI THIỆU SFB
                    </span>
                    <h2 className="text-[#1A202C] text-3xl md:text-4xl font-bold leading-tight">
                        Đối tác công nghệ chiến lược
                        <br />
                        cho doanh nghiệp Việt
                    </h2>
                </div>

                {/* Section 1: Intro + Handshake Image */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center mb-32">
                    {/* Left: Image Card - Forced width on large screens */}
                    <div className="relative w-full lg:w-[701px] flex-shrink-0">
                        <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] overflow-hidden bg-gray-200">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                                alt="SFB Team Meeting"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-6 flex-1">
                        <h3 className="text-gray-900 text-lg font-bold leading-relaxed">
                            CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB (SFB TECHNOLOGY JOINT STOCK COMPANY – viết tắt SFBTECH.,JSC)
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-light">
                            Công ty hoạt động theo mô hình cổ phần với giấy chứng nhận đăng ký kinh doanh số 0107857710 do Sở Kế hoạch và Đầu tư Hà Nội cấp ngày 24/05/2017.
                        </p>
                        <div className="pt-4">
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105"
                            >
                                Liên hệ với chúng tôi
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Section 2: Contact Info + Building Image */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                    {/* Left: Contact Info */}
                    <div className="order-2 lg:order-1 space-y-8 flex-1 pl-4 lg:pl-0">
                        <div className="space-y-6">
                            {/* Trụ sở */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <Building2 className="text-[#2CA4E0]" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Trụ sở</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc Thuỵ, quận Long Biên, Hà Nội.
                                    </p>
                                </div>
                            </div>

                            {/* Văn phòng */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <MapPin className="text-[#2CA4E0]" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Văn phòng</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        P303, Tầng 3, Khách sạn Thể Thao, 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.
                                    </p>
                                </div>
                            </div>

                            {/* Hotline */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <Phone className="text-[#2CA4E0]" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Hotline: <span className="font-normal text-gray-600">0888 917 999</span></h4>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <Mail className="text-[#2CA4E0]" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Email: <span className="font-normal text-gray-600">info@sfb.vn</span></h4>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105"
                            >
                                Liên hệ ngay
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Right: Building Image - Forced width on large screens */}
                    <div className="order-1 lg:order-2 relative w-full lg:w-[701px] flex-shrink-0">
                        <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] overflow-hidden bg-gray-200">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                                alt="SFB Office Building"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
