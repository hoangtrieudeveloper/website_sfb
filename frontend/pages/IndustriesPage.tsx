import {
  Code2,
  MonitorSmartphone,
  Network,
  Globe2,
  ShieldCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  Target,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function IndustriesPage() {
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

  const successMetrics = [
    {
      icon: Award,
      value: "8+ năm",
      label: "Kinh nghiệm triển khai",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      value: "Hàng trăm",
      label: "Dự án & triển khai thực tế",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      value: "Nhiều đơn vị",
      label: "Cơ quan Nhà nước & doanh nghiệp",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Sparkles,
      value: "Đội ngũ",
      label: "Chuyên gia CNTT tận tâm",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <Sparkles className="text-cyan-400" size={20} />
              <span className="text-white font-semibold text-sm">
                VỀ CHÚNG TÔI
              </span>
            </div>

            <h1 className="text-white mb-4 text-4xl md:text-5xl">
              SFB Technology
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mt-1">
                CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-3xl mx-auto">
              Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC
              đồng hành cùng nhiều cơ quan Nhà nước và doanh
              nghiệp trong hành trình chuyển đổi số với hàng
              trăm dự án triển khai thực tế.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {successMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <Icon
                      className="text-cyan-400 mx-auto mb-3"
                      size={28}
                    />
                    <div
                      className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-1`}
                    >
                      {metric.value}
                    </div>
                    <div className="text-blue-100 text-xs md:text-sm">
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Fields / Services List */}
      <section className="py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200 mb-4">
              <Sparkles className="text-blue-600" size={18} />
              <span className="text-sm font-semibold text-blue-700">
                Lĩnh vực
              </span>
            </div>
            <h2 className="text-gray-900 mb-6">
              Các lĩnh vực hoạt động & dịch vụ
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Những mảng chuyên môn chính mà SFB đang cung cấp
              giải pháp và dịch vụ công nghệ thông tin cho cơ
              quan Nhà nước & doanh nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.id}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 px-6 py-7 md:px-7 md:py-8 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
                >
                  {/* accent */}
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 w-28 h-28 rounded-full bg-gradient-to-br ${field.gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}
                  />

                  <div className="relative z-10 flex flex-col gap-4">
                    {/* header */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${field.gradient} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                          {field.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Lĩnh vực #
                          {String(field.id).padStart(2, "0")}
                        </p>
                      </div>
                    </div>

                    {/* short */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {field.short}
                    </p>

                    {/* points */}
                    <ul className="mt-1 space-y-1.5">
                      {field.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-0.5 text-blue-600"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Why SFB Section – Process Style */}
      <section className="py-28 bg-gradient-to-b from-white via-slate-50 to-blue-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a06_1px,transparent_1px),linear-gradient(to_bottom,#0f172a06_1px,transparent_1px)] bg-[size:18px_28px]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 rounded-full border border-blue-100 shadow-sm mb-4">
              <Sparkles className="text-blue-600" size={18} />
              <span className="text-sm font-semibold text-blue-700">
                LỘ TRÌNH ĐỒNG HÀNH CÙNG SFB
              </span>
            </div>
            <h2 className="text-gray-900 mb-4">
              Vì sao SFB phù hợp cho nhiều lĩnh vực khác nhau
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Mỗi dự án là một hành trình: từ việc hiểu đúng bài
              toán, xây dựng đội ngũ phù hợp cho đến vận hành &
              cải tiến liên tục cùng khách hàng.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Rail nối 3 bước (desktop) */}
            <div className="hidden lg:block absolute top-[42px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300 rounded-full" />

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="group relative flex flex-col">
                {/* Badge số */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-blue-500 to-cyan-500 shadow-xl flex items-center justify-center border-4 border-slate-50">
                    <span className="text-white font-bold text-lg">
                      01
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-blue-100 shadow-[0_16px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
                  {/* strip trên đầu */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400" />
                  <div className="p-7 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg mb-5">
                      <Target size={24} />
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-3">
                      Hiểu rõ đặc thù từng ngành
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Kinh nghiệm triển khai cho khối Nhà nước,
                      giáo dục, y tế, doanh nghiệp giúp SFB nắm
                      rõ quy định, quy trình và nhu cầu thực tế
                      của từng đơn vị.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mt-auto">
                      <li className="flex items-start gap-2">
                        <CheckCircle2
                          className="mt-0.5 text-blue-600"
                          size={16}
                        />
                        <span>
                          Nắm bắt nhanh yêu cầu nghiệp vụ
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2
                          className="mt-0.5 text-blue-600"
                          size={16}
                        />
                        <span>
                          Giải pháp “fit” quy trình, không
                          one-size-fits-all
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative flex flex-col">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-500 shadow-xl flex items-center justify-center border-4 border-slate-50">
                    <span className="text-white font-bold text-lg">
                      02
                    </span>
                  </div>
                </div>

                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-emerald-100 shadow-[0_16px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.22)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400" />
                  <div className="p-7 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg mb-5">
                      <Users size={24} />
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-3">
                      Đội ngũ chuyên gia đồng hành
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Kết hợp BA, dev, QA, DevOps và chuyên gia
                      nghiệp vụ theo từng lĩnh vực, hỗ trợ khách
                      hàng từ giai đoạn ý tưởng đến vận hành.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mt-auto">
                      <li className="flex items-start gap-2">
                        <CheckCircle2
                          className="mt-0.5 text-emerald-600"
                          size={16}
                        />
                        <span>
                          Trao đổi trực tiếp với team tư vấn &
                          triển khai
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2
                          className="mt-0.5 text-emerald-600"
                          size={16}
                        />
                        <span>
                          Đào tạo & hỗ trợ sau khi go-live
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative flex flex-col">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-purple-500 to-pink-500 shadow-xl flex items-center justify-center border-4 border-slate-50">
                    <span className="text-white font-bold text-lg">
                      03
                    </span>
                  </div>
                </div>

                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-purple-100 shadow-[0_16px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.22)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
                  <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-400" />
                  <div className="p-7 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg mb-5">
                      <Award size={24} />
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-3">
                      Quy trình & chất lượng nhất quán
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Áp dụng quy trình chuẩn trong phân tích,
                      phát triển, kiểm thử và triển khai, đảm
                      bảo mỗi dự án đều đạt chất lượng như cam
                      kết.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mt-auto">
                      <li className="flex items-start gap-2">
                        <CheckCircle2
                          className="mt-0.5 text-purple-600"
                          size={16}
                        />
                        <span>
                          Quy trình rõ ràng, minh bạch tiến độ
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2
                          className="mt-0.5 text-purple-600"
                          size={16}
                        />
                        <span>
                          Dễ dàng mở rộng & bảo trì về sau
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white mb-6">
              Bạn cần lĩnh vực hoặc dịch vụ khác?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              SFB có thể tư vấn và xây dựng giải pháp phù hợp
              cho nhiều mô hình tổ chức khác nhau. Liên hệ để
              trao đổi chi tiết.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="group px-10 py-5 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
              >
                Liên hệ tư vấn
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={20}
                />
              </a>
              <a
                href="/solutions"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
              >
                Xem các giải pháp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default IndustriesPage;
