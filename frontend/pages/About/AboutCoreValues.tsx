import { Lightbulb, Users, Handshake, ShieldCheck, Database, Globe2 } from "lucide-react";

export function AboutCoreValues() {
    const values = [
        {
            icon: Lightbulb,
            title: "Đổi mới sáng tạo",
            description: "Luôn tìm kiếm giải pháp mới, áp dụng công nghệ tiên tiến vào sản phẩm & dịch vụ.",
        },
        {
            icon: Handshake,
            title: "Tận tâm với khách hàng",
            description: "Đặt lợi ích khách hàng lên hàng đầu, cam kết đồng hành dài lâu.",
        },
        {
            icon: Users,
            title: "Hợp tác & đồng hành",
            description: "Làm việc nhóm chặt chẽ, cùng khách hàng xây dựng giải pháp phù hợp nhất.",
        },

        {
            icon: ShieldCheck,
            title: "Trách nhiệm & minh bạch",
            description: "Tuân thủ cam kết, quy trình rõ ràng, không phát sinh chi phí thiếu minh bạch.",
        },
        {
            icon: Database,
            title: "Học hỏi không ngừng",
            description: "Liên tục cập nhật xu hướng mới: Cloud, AI, Big Data, DevOps..",
        },
        {
            icon: Globe2,
            title: "Tư duy toàn cầu",
            description: "Tiếp cận theo chuẩn quốc tế, sẵn sàng mở rộng sang các thị trường mới.",
        },
    ];

    return (
        <section className="py-20 bg-[#F8FBFE]">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                        Giá trị cốt lõi
                    </h2>
                    <p className="text-gray-600 md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Những nguyên tắc định hình văn hoá và cách SFB hợp tác với khách hàng, đối tác và đội ngũ nội bộ
                    </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-[24px] p-8 flex flex-col items-center text-center shadow-[0_18px_36px_0_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_0_rgba(0,0,0,0.1)] transition-shadow duration-300"
                            >
                                <div className="mb-6 text-[#2CA4E0]">
                                    {/* Used a stroke width of 1.5 to match the lighter feel of the design icons */}
                                    <Icon size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[#0F172A] text-xl font-bold mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
