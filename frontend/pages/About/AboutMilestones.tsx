import { TrendingUp } from "lucide-react";

export function AboutMilestones() {
    const milestones = [
        {
            year: "2017",
            title: "Thành lập SFBTECH.,JSC",
            description: "Được cấp giấy chứng nhận đăng ký kinh doanh số 0107857710 bởi Sở KH&ĐT Hà Nội, bắt đầu hoạt động theo mô hình công ty cổ phần."
        },
        {
            year: "2018-2019",
            title: "Xây dựng đội ngũ & sản phẩm lõi",
            description: "Hình thành các giải pháp về cổng thông tin điện tử, văn bản điều hành, thư viện số và các hệ thống nghiệp vụ cho cơ quan Nhà nước."
        },
        {
            year: "2020-2022",
            title: "Mở rộng lĩnh vực & quy mô triển khai",
            description: "Triển khai nhiều dự án cho khối Tài chính, Bảo hiểm, Ngân hàng, Viễn thông, Chính phủ điện tử và Doanh nghiệp."
        },
        {
            year: "2023 - nay",
            title: "Tiếp tục tăng trưởng & chuyển đổi số",
            description: "Đẩy mạnh các giải pháp theo nhu cầu riêng của từng đơn vị, chú trọng mở rộng, an toàn, bảo mật và tích hợp hệ thống."
        }
    ];

    return (
        <section className="py-20 bg-[#F8FBFE] overflow-hidden">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-24 max-w-4xl mx-auto">
                    <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                        Hành trình phát triển
                    </h2>
                    <p className="text-gray-600 md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Từ năm 2017 đến nay, SFB liên tục mở rộng đội ngũ, nâng cấp sản phẩm và chuẩn hóa dịch vụ để đồng hành cùng khách hàng lâu dài
                    </p>
                </div>

                <div className="max-w-5xl mx-auto relative lg:min-h-[800px]">
                    <div className="space-y-12 lg:space-y-0 relative">
                        {milestones.map((item, index) => {
                            const isLeft = index % 2 === 0;

                            return (
                                <div key={index} className="relative lg:min-h-[300px] flex flex-col lg:flex-row items-center justify-center">
                                    {/* Mobile Year Badge (visible on mobile only) */}
                                    <div className="lg:hidden mb-6 bg-[#2CA4E0] text-white px-6 py-2 rounded-full text-xl font-bold">
                                        {item.year}
                                    </div>

                                    {/* Left Side */}
                                    <div className={`flex-1 w-full lg:w-auto flex ${isLeft ? 'justify-end lg:pr-40' : 'justify-start lg:pl-40 order-last'}`}>
                                        {/* Content Card */}
                                        <div className="bg-white rounded-[24px] p-8 shadow-sm max-w-lg w-full relative z-10 hover:-translate-y-1 transition-transform duration-300">
                                            <div className="w-10 h-10 mb-4 text-[#2CA4E0]">
                                                {/* Placeholder icon matching the graph-up style */}
                                                <TrendingUp size={32} strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-[#0F172A] font-bold text-lg mb-3">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Center Year Badge (Desktop only) */}
                                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20 flex-col">
                                        <div className="bg-[#2CA4E0] text-white px-8 py-3 rounded-full text-2xl font-normal shadow-lg whitespace-nowrap relative z-20">
                                            {item.year}
                                        </div>

                                        {/* Connecting Line to next item */}
                                        {index < milestones.length - 1 && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-[220px] z-10">
                                                <svg width="2" height="100%" className="overflow-visible">
                                                    <line
                                                        x1="1"
                                                        y1="0"
                                                        x2="1"
                                                        y2="100%"
                                                        stroke="#1D8FCF"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side Spacer/Content */}
                                    <div className={`flex-1 hidden lg:block ${isLeft ? 'pl-40' : 'pr-40'}`}></div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
