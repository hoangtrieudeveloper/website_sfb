import {
  Code2,
  MonitorSmartphone,
  Network,
  Globe2,
  ShieldCheck,
  Users,
  Target,
  TrendingUp,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function Industries() {
  const fields = [
    {
      id: 1,
      icon: Code2,
      title: "Phát triển phần mềm",
      short:
        "Thiết kế & xây dựng các hệ thống phần mềm nghiệp vụ, web, mobile và sản phẩm đóng gói.",
      points: [
        "Ứng dụng quản lý nghiệp vụ cho cơ quan, doanh nghiệp",
        "Web / portal nội bộ & bên ngoài",
        "Sản phẩm phần mềm đóng gói, triển khai nhanh",
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      icon: MonitorSmartphone,
      title: "Tư vấn xây dựng & phát triển hệ thống CNTT",
      short:
        "Đồng hành từ khảo sát, tư vấn kiến trúc đến lộ trình triển khai tổng thể hệ thống CNTT.",
      points: [
        "Khảo sát hiện trạng & nhu cầu nghiệp vụ",
        "Đề xuất kiến trúc hệ thống & lộ trình chuyển đổi số",
        "Tư vấn lựa chọn nền tảng công nghệ phù hợp",
      ],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      icon: Network,
      title: "Tích hợp hệ thống & quản trị vận hành",
      short:
        "Kết nối các hệ thống hiện hữu, quản lý vận hành tập trung, an toàn và ổn định.",
      points: [
        "Xây dựng nền tảng tích hợp dữ liệu & dịch vụ",
        "Kết nối các hệ thống lõi, ứng dụng vệ tinh",
        "Giám sát, vận hành hệ thống 24/7",
      ],
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: 4,
      icon: Globe2,
      title: "Giải pháp cổng thông tin điện tử",
      short:
        "Cổng thông tin cho tổ chức, doanh nghiệp với trải nghiệm người dùng hiện đại.",
      points: [
        "Cổng thông tin nội bộ & đối ngoại",
        "Quản lý nội dung, tin tức, dịch vụ trực tuyến",
        "Tối ưu tra cứu, tìm kiếm & tra cứu hồ sơ",
      ],
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: 5,
      icon: ShieldCheck,
      title:
        "Cổng thông tin Chính phủ điện tử trên nền tảng SharePoint",
      short:
        "Giải pháp chuyên sâu cho khối nhà nước dựa trên Microsoft SharePoint.",
      points: [
        "Kiến trúc tuân thủ quy định Chính phủ điện tử",
        "Quy trình phê duyệt, luân chuyển hồ sơ điện tử",
        "Bảo mật cao, phân quyền chi tiết",
      ],
      gradient: "from-sky-500 to-blue-600",
    },
    {
      id: 6,
      icon: Users,
      title: "Outsourcing",
      short:
        "Cung cấp đội ngũ phát triển phần mềm chuyên nghiệp, linh hoạt theo mô hình dự án.",
      points: [
        "Team dev, BA, QA, DevOps theo yêu cầu",
        "Linh hoạt thời gian & hình thức hợp tác",
        "Đảm bảo quy trình & chất lượng theo tiêu chuẩn SFB",
      ],
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <section
      id="industries"
      className="relative py-28 overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe_1px,transparent_1px)] bg-[size:18px_18px] opacity-60" />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full mb-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-xs">
              Lĩnh vực hoạt động
            </span>
          </div>
          <h2 className="text-gray-900 mb-4">
            SFB đồng hành trong nhiều mảng giải pháp CNTT
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Qua một chặng đường xây dựng và phát triển, SFB
            không ngừng nỗ lực với sứ mệnh cung cấp những giải
            pháp công nghệ thông tin, phần mềm và sản phẩm tốt
            nhất cho khách hàng.
          </p>
        </div>

        {/* Fields Grid – style giống card Figma */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div
                key={field.id}
                className="group relative bg-white rounded-[26px] p-7 md:p-8 border border-blue-100 shadow-[0_18px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_22px_60px_rgba(37,99,235,0.18)] hover:border-blue-300 transition-all duration-400 hover:-translate-y-2 cursor-pointer overflow-hidden fade-in-up"
                style={{
                  animationDelay: `${index * 90}ms`,
                }}
              >
                {/* Glow background on hover */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${field.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-6">
                    {/* Icon */}
                    <div className="relative inline-flex">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${field.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <Icon
                          className="text-white"
                          size={24}
                        />
                      </div>
                      <div
                        className={`absolute inset-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${field.gradient} opacity-40 blur-xl`}
                      />
                    </div>

                    {/* Small badge */}
                    <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold border border-emerald-100">
                      Lĩnh vực{" "}
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Title + short desc */}
                  <h3 className="text-gray-900 mb-2 text-sm md:text-base font-semibold group-hover:text-blue-700 transition-colors">
                    {field.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {field.short}
                  </p>

                  {/* Detail bullets */}
                  <ul className="space-y-1.5 mb-5">
                    {field.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-[12px] md:text-sm text-gray-600"
                      >
                        <CheckCircle2
                          size={14}
                          className="mt-[2px] text-emerald-500 flex-shrink-0"
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  {/* bottom line + CTA */}
                  <div className="mt-auto pt-4 border-t border-blue-50 flex items-center justify-between">
                    <span
                      className={`text-xs md:text-sm font-semibold bg-gradient-to-r ${field.gradient} bg-clip-text text-transparent`}
                    >
                      Tìm hiểu giải pháp chi tiết
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}