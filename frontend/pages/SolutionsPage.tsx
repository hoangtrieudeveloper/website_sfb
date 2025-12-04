import {
  Target,
  Globe,
  Cloud,
  Code,
  Database,
  LineChart,
  Cpu,
  Network,
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Zap,
  TrendingUp,
  Users,
  Award,
  Sparkles,
} from "lucide-react";

export function SolutionsPage() {
  // Sản phẩm / giải pháp tiêu biểu – dùng đúng dữ liệu bạn cung cấp
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

  const processSteps = [
    {
      number: "01",
      title: "Khảo sát hiện trạng & tư vấn giải pháp",
      description:
        "Làm việc với đơn vị để hiểu quy trình nghiệp vụ, phân tích hệ thống hiện tại, xác định vấn đề và thống nhất mục tiêu chuyển đổi số.",
      icon: Users,
    },
    {
      number: "02",
      title: "Thiết kế kiến trúc & kế hoạch triển khai",
      description:
        "Thiết kế kiến trúc hệ thống trên nền tảng .NET, cơ sở dữ liệu & hạ tầng (N-Tier / N-Layer), lập roadmap triển khai chi tiết theo từng giai đoạn.",
      icon: TrendingUp,
    },
    {
      number: "03",
      title: "Phát triển, kiểm thử & hoàn thiện",
      description:
        "Phát triển chức năng, tích hợp dữ liệu, kiểm thử (unit, integration, UAT) liên tục; demo định kỳ với khách hàng để tinh chỉnh theo thực tế.",
      icon: Zap,
    },
    {
      number: "04",
      title: "Triển khai, đào tạo & hỗ trợ vận hành",
      description:
        "Triển khai lên môi trường chính thức, đào tạo người dùng, bàn giao tài liệu và đồng hành hỗ trợ, bảo trì – tối ưu hiệu năng, mở rộng về sau.",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 pt-32 pb-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-white font-semibold text-sm">
                CÁC GIẢI PHÁP CÔNG NGHỆ
              </span>
            </div>

            <h1 className="text-white mb-8 text-5xl md:text-6xl">
              Giải pháp toàn diện cho
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                chuyển đổi số
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-3xl mx-auto">
              Từ tư vấn, thiết kế đến triển khai và vận hành -
              chúng tôi đồng hành cùng bạn trong suốt hành trình
              số hóa doanh nghiệp
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#solutions-list"
                className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
              >
                Khám phá giải pháp
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={20}
                />
              </a>
              <a
                href="/contact"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white hover:text-gray-900 hover:border-white transition-all inline-flex items-center justify-center gap-3 font-semibold"
              >
                Tư vấn miễn phí
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions List */}
      <section
        id="solutions-list"
        className="py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200 mb-4">
              <Sparkles className="text-blue-600" size={18} />
              <span className="text-sm font-semibold text-blue-700">
                Giải pháp
              </span>
            </div>
            <h2 className="text-gray-900 mb-6">
              Lý do chọn giải pháp của SFB
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Nền tảng công nghệ và quy trình triển khai được
              chuẩn hóa, đảm bảo hệ thống ổn định, bảo mật và
              sẵn sàng mở rộng lâu dài
            </p>
          </div>

          {/* Grid 4 giải pháp cốt lõi */}
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;

              return (
                <div
                  key={solution.id}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 px-6 py-7 md:px-8 md:py-8 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
                >
                  {/* Accent gradient */}
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-br ${solution.gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}
                  />

                  <div className="relative z-10 flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center text-white shadow-lg`}
                        >
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                            {solution.title}
                          </h3>
                          <p className="text-[11px] text-gray-500">
                            Lợi thế giải pháp #
                            {String(index + 1).padStart(2, "0")}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed">
                      {solution.description}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2">
                      {solution.benefits.map((benefit) => (
                        <span
                          key={benefit}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-700"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-blue-600"
                          />
                          <span>{benefit}</span>
                        </span>
                      ))}
                    </div>

                    {/* Bottom accent line */}
                    <div className="mt-2 h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full w-1/2 bg-gradient-to-r ${solution.gradient} group-hover:w-full transition-all duration-500`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA dưới grid */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p>
              Các nguyên tắc trên được áp dụng xuyên suốt trong
              mọi dự án – từ hệ thống cho cơ quan Nhà nước đến
              doanh nghiệp tư nhân.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Trao đổi về nhu cầu của bạn
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-28 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 relative overflow-hidden">
        {/* background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a06_1px,transparent_1px),linear-gradient(to_bottom,#0f172a06_1px,transparent_1px)] bg-[size:18px_28px]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 rounded-full border border-blue-100 shadow-sm mb-6">
              <Zap className="text-blue-600" size={18} />
              <span className="text-sm font-semibold text-blue-700">
                QUY TRÌNH LÀM VIỆC
              </span>
            </div>
            <h2 className="text-gray-900 mb-4">
              Quy trình triển khai giải pháp tại SFB
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Từ khảo sát, thiết kế đến vận hành, quy trình được
              chuẩn hóa giúp dự án minh bạch, đúng tiến độ và dễ
              mở rộng trong tương lai
            </p>
          </div>

          {/* Timeline + cards */}
          <div className="relative">
            {/* đường rail nối các bước (desktop) */}
            <div className="hidden lg:block absolute top-[46px] left-[6%] right-[6%] h-[3px] bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 rounded-full" />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={index}
                    className="group relative flex flex-col items-stretch"
                  >
                    {/* Badge số */}
                    <div className="relative flex justify-center mb-3 lg:mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-blue-500 to-cyan-500 shadow-xl flex items-center justify-center border-4 border-slate-50">
                        <span className="text-white font-bold text-lg">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Card */}
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.06)] hover:shadow-[0_22px_55px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden">
                      {/* strip màu trên đầu card */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400" />

                      <div className="p-7 flex flex-col h-full">
                        {/* Icon */}
                        <div className="mb-5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                            <Icon
                              className="text-blue-600"
                              size={26}
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <h4 className="text-gray-900 font-semibold mb-3">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-[15px] flex-1">
                          {step.description}
                        </p>

                        {/* Progress bar */}
                        <div className="mt-6">
                          <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-[width] duration-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white mb-6">
              Sẵn sàng bắt đầu dự án của bạn?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Liên hệ với chúng tôi ngay để được tư vấn miễn phí
              và nhận báo giá chi tiết
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
                href="tel:+842812345678"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
              >
                Hotline: (+84) 28 1234 5678
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}