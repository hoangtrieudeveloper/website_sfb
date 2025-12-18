export function AboutVisionMission() {
    const items = [
        {
            id: 1,
            text: "Phát triển bền vững trên nền tảng tri thức",
        },
        {
            id: 2,
            text: "Kết hợp trí tuệ tập thể & sự nhiệt huyết của đội ngũ",
        },
        {
            id: 3,
            text: "Xây dựng hệ thống, sản phẩm có giá trị lâu dài",
        },
        {
            id: 4,
            text: "Cung cấp sản phẩm, dịch vụ tốt nhất dựa trên công nghệ mới",
        },
        {
            id: 5,
            text: "Tạo dựng niềm tin vững chắc với khách hàng & nhà đầu tư",
        },
        {
            id: 6,
            text: "Chung tay cùng xã hội hướng tới nền công nghiệp 4.0",
        },
    ];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Section header */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-6">
                        Tầm nhìn & Sứ mệnh
                    </h2>
                    <p className="text-gray-600 md:text-lg leading-relaxed max-w-3xl mx-auto">
                        Trở thành một trong những công ty công nghệ hàng đầu về phát triển bền vững, xây dựng trên nền tảng tri thức và trí tuệ sáng tạo của đội ngũ nhân sự SFB.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#EFF8FC] rounded-[16px] p-6 flex items-start gap-4 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#2CA4E0] flex items-center justify-center bg-white/50">
                                <span className="text-[#2CA4E0] font-bold text-lg number-font">
                                    {item.id}
                                </span>
                            </div>
                            <div className="mt-2.5">
                                <p className="text-[#334155] font-medium leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
