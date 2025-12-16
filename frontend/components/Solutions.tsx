"use client";

import Link from "next/link";
import { ScrollAnimation } from "./ScrollAnimation";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Code,
  Database,
  LineChart,
} from "lucide-react";

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
      buttonText: "Tìm hiểu cách SFB triển khai",
      buttonLink: "/contact",
      iconGradient: "from-cyan-400 to-blue-600",
    },
    {
      id: 2,
      icon: Code,
      title: "Công nghệ .Net của Microsoft",
      description:
        "Nền tảng phát triển mạnh mẽ, đa ngôn ngữ và đa hệ điều hành, hỗ trợ xây dựng ứng dụng từ web, mobile đến enterprise. .NET mang lại hiệu suất cao, bảo mật và tốc độ triển khai tối ưu.",
      benefits: ["Bảo mật cao", "Dễ bảo trì", "Hệ sinh thái mạnh"],
      buttonText: "Xem case studies",
      buttonLink: "/industries",
      iconGradient: "from-fuchsia-400 to-indigo-600",
    },
    {
      id: 3,
      icon: Database,
      title: "Giải pháp lưu trữ hiện đại & Big Data",
      description:
        "Hạ tầng lưu trữ tiên tiến giúp xử lý và quản lý dữ liệu khổng lồ theo thời gian thực. Big Data cho phép phân tích sâu, phát hiện xu hướng và đưa ra quyết định dựa trên dữ liệu chính xác.",
      benefits: ["Big Data-ready", "Hiệu năng cao", "An toàn dữ liệu"],
      buttonText: "Tư vấn miễn phí",
      buttonLink: "/contact",
      iconGradient: "from-emerald-400 to-green-600",
    },
    {
      id: 4,
      icon: Cloud,
      title: "Khả năng mở rộng linh hoạt",
      description:
        "Hệ thống được thiết kế để dễ dàng mở rộng theo nhu cầu: từ tăng tải người dùng đến mở rộng dịch vụ. Kiến trúc linh hoạt giúp tối ưu hiệu năng và đảm bảo hoạt động ổn định ngay cả khi quy mô tăng nhanh.",
      benefits: ["n-Tier / n-Layer", "Dễ mở rộng", "Sẵn sàng quy mô lớn"],
      buttonText: "Tìm hiểu cách SFB triển khai",
      buttonLink: "/contact",
      iconGradient: "from-orange-400 to-pink-600",
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
      className="relative py-24 overflow-visible"
      style={{
        background: "linear-gradient(236.99deg, #80C0E4 7%, #1D8FCF 71.94%)",
      }}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollAnimation variant="fade-up" className="text-center max-w-5xl mx-auto">
          <div className="text-white/85 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            GIẢI PHÁP CHUYÊN NGHIỆP
          </div>

          <h2 className="text-white font-extrabold leading-tight text-3xl md:text-5xl">
            Giải pháp phần mềm
            <br />
            <span className="font-medium">đóng gói cho nhiều lĩnh vực</span>
          </h2>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {domains.map((d, i) => (
              <ScrollAnimation
                key={d}
                variant="fade-in"
                delay={i * 0.06}
                className="px-4 py-2 rounded-full text-sm text-white/90 border border-white/35 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors"
              >
                {d}
              </ScrollAnimation>
            ))}
          </div>
        </ScrollAnimation>

        {/* ✅ GRID: gap-6 (24px) for both row and column */}
        <div className="mt-16 grid grid-cols-1 xl:grid-cols-2 gap-6 place-items-center">
          {solutions.map((s, idx) => {
            const Icon = s.icon;

            return (
              <div
                key={s.id}
                className="
                  box-border
                  w-full max-w-[606px] h-auto min-h-[487px]
                  p-[45px]
                  rounded-[24px]
                  border border-[#E6E6E6]
                  bg-white
                  shadow-[0_18px_60px_rgba(13,80,140,0.20)]
                  overflow-hidden
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_26px_80px_rgba(13,80,140,0.26)]
                "
              >
                <ScrollAnimation variant="fade-up" delay={idx * 0.08}>
                  <div className="h-full flex flex-col items-center gap-[24px]">
                    {/* Icon */}
                    <div
                      className={`
                        w-16 h-16 rounded-2xl
                        flex items-center justify-center
                        bg-gradient-to-br ${s.iconGradient}
                        shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                      `}
                    >
                      <Icon className="text-white" size={28} />
                    </div>

                    {/* Title */}
                    <h3 className="text-center text-gray-900 font-extrabold text-xl md:text-2xl">
                      {s.title}
                    </h3>

                    {/* Description */}
                    <p className="text-center text-gray-600 leading-relaxed text-sm md:text-base">
                      {s.description}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {s.benefits.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-gray-600 bg-gray-50 border border-gray-200"
                        >
                          <CheckCircle2 size={14} className="text-gray-400" />
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Button */}
                    <Link
                      href={s.buttonLink}
                      className="
                        mt-auto
                        inline-flex items-center justify-center gap-3
                        px-6 md:px-7 py-3.5
                        rounded-xl
                        text-white font-semibold text-sm
                        shadow-[0_14px_40px_rgba(29,143,207,0.35)]
                        hover:shadow-[0_18px_54px_rgba(29,143,207,0.45)]
                        transition-all
                      "
                      style={{
                        background:
                          "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                      }}
                    >
                      {s.buttonText}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </ScrollAnimation>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
