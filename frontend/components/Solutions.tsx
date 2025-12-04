import {
  Cloud,
  Code,
  Database,
  LineChart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export function Solutions() {
  const solutions = [
    {
      id: 1,
      icon: LineChart,
      title: "Quy trình được chuẩn hóa",
      description:
        "Tất cả công việc tại SFB đều được chuẩn hóa theo quy trình rõ ràng – từ tác vụ đơn giản đến các hạng mục phức tạp. Giúp kiểm soát chất lượng, tiến độ và rủi ro một cách nhất quán.",
      benefits: [
        "Minh bạch & dễ kiểm soát",
        "Giảm rủi ro dự án",
        "Chất lượng đồng nhất",
      ],
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
    },
    {
      id: 2,
      icon: Code,
      title: "Công nghệ .NET của Microsoft",
      description:
        "SFB lựa chọn nền tảng .NET phổ biến và ổn định của Microsoft để xây dựng hệ thống cho khách hàng – dễ phát triển, bảo mật cao, dễ bảo trì và mở rộng lâu dài.",
      benefits: [
        "Bảo mật cao",
        "Dễ bảo trì",
        "Hệ sinh thái mạnh",
      ],
      gradient: "from-purple-500 via-indigo-500 to-blue-500",
    },
    {
      id: 3,
      icon: Database,
      title: "Giải pháp lưu trữ hiện đại & Big Data",
      description:
        "Xu hướng dữ liệu lớn (Big Data) giống như các hệ thống Google, Facebook là tất yếu. SFB tiên phong xây dựng giải pháp lưu trữ hiện đại, xử lý khối lượng dữ liệu lớn một cách an toàn và hiệu quả.",
      benefits: [
        "Big Data-ready",
        "Hiệu năng cao",
        "An toàn dữ liệu",
      ],
      gradient: "from-emerald-500 via-green-500 to-lime-500",
    },
    {
      id: 4,
      icon: Cloud,
      title: "Khả năng mở rộng linh hoạt",
      description:
        "Kiến trúc hệ thống được thiết kế với tư duy mở rộng: cả về hạ tầng vật lý (N-Tier) lẫn kiến trúc phần mềm (N-Layer). Sẵn sàng đáp ứng nhu cầu tăng trưởng của doanh nghiệp.",
      benefits: [
        "N-Tier / N-Layer",
        "Dễ mở rộng",
        "Sẵn sàng quy mô lớn",
      ],
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
    },
  ];

  const domains = [
    "Chính phủ & cơ quan nhà nước",
    "Doanh nghiệp",
    "Ngân hàng & bảo hiểm",
    "Giáo dục & đào tạo",
    "Viễn thông & hạ tầng số",
  ];

  return (
    <section
      id="solutions"
      className="relative py-28 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-6 shadow-lg">
            <Sparkles className="text-cyan-400" size={20} />
            <span className="text-white font-semibold uppercase tracking-wider text-xs">
              Giải pháp chuyên nghiệp
            </span>
          </div>
          <h2 className="text-white mb-4">
            Giải pháp phần mềm đóng gói cho nhiều lĩnh vực
          </h2>
          <p className="text-base md:text-lg text-blue-100 leading-relaxed mb-4">
            SFB cung cấp giải pháp và sản phẩm phần mềm đóng gói
            nhằm giải quyết các bài toán hệ thống công nghệ
            thông tin trong các khối Chính phủ, Doanh nghiệp,
            Ngân hàng, Bảo hiểm, Giáo dục và Viễn thông.
          </p>

          {/* Domains chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {domains.map((d) => (
              <span
                key={d}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs md:text-sm text-blue-100"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.id}
                className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-9 hover:bg-white hover:border-white transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl overflow-hidden fade-in-up"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`}
                />

                {/* Top Row */}
                <div className="flex items-start justify-between mb-6">
                  {/* Icon block */}
                  <div className="relative">
                    <div
                      className={`w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br ${solution.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}
                    >
                      <Icon className="text-white" size={30} />
                    </div>
                    <div
                      className={`absolute inset-0 w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br ${solution.gradient} rounded-2xl opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-500`}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-white group-hover:text-gray-900 transition-colors mb-3 text-lg md:text-xl">
                  {solution.title}
                </h3>

                {/* Description */}
                <p className="text-blue-100 group-hover:text-gray-600 transition-colors leading-relaxed mb-6 text-sm md:text-base">
                  {solution.description}
                </p>

                {/* Benefits tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {solution.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-cyan-50 text-[11px] md:text-xs text-white group-hover:text-blue-700 rounded-full border border-white/20 group-hover:border-blue-200 transition-all font-medium"
                    >
                      <CheckCircle2
                        size={14}
                        className="group-hover:text-blue-600"
                      />
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* CTA inline (optional) */}
                <div className="flex items-center gap-3 text-xs md:text-sm text-white group-hover:text-blue-600 transition-all transform translate-x-0 group-hover:translate-x-1 cursor-pointer">
                  <span className="font-semibold">
                    Tìm hiểu cách SFB triển khai
                  </span>
                  <ArrowRight
                    size={18}
                    className="transform group-hover:scale-110 transition-transform"
                  />
                </div>

                {/* Corner Decoration */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className={`absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl ${solution.gradient} opacity-10 rounded-tl-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center relative">
          <div className="inline-block bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-10 md:p-12 max-w-3xl">
            <h3 className="text-white mb-4">
              Sẵn sàng chuyển đổi hệ thống CNTT?
            </h3>
            <p className="text-blue-100 text-base md:text-lg mb-8">
              Đặt lịch tư vấn miễn phí với đội ngũ chuyên gia
              SFB để lựa chọn giải pháp phù hợp nhất cho doanh
              nghiệp của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group px-10 py-4 md:py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold text-sm md:text-base"
              >
                Tư vấn miễn phí
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={20}
                />
              </Link>
              <Link
                href="/industries"
                className="px-10 py-4 md:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/20 hover:bg-white hover:text-gray-900 hover:border-white transition-all inline-flex items-center justify-center gap-3 font-semibold text-sm md:text-base"
              >
                Xem case studies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}