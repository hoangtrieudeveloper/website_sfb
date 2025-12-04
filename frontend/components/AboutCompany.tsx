import {
  Target,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  Globe,
  Heart,
  Shield,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";

export function AboutCompany() {
  const trustPillars = [
    {
      icon: Target,
      title: "Năng lực được chứng minh",
      description:
        "Triển khai nhiều dự án quy mô lớn cho cơ quan Nhà nước, doanh nghiệp và tổ chức trong các lĩnh vực Tài chính, Ngân hàng, Giáo dục, Viễn thông, Công nghiệp.",
      bullets: [
        "Tiến độ luôn đúng kế hoạch",
        "Hệ thống ổn định, vận hành lâu dài",
        "Đáp ứng đúng – đủ – vượt yêu cầu nghiệp vụ",
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Đội ngũ chuyên gia giàu kinh nghiệm",
      description:
        "Chuyên gia nhiều năm trong phát triển phần mềm, bảo mật, hạ tầng số và thiết kế hệ thống.",
      bullets: [
        "Kinh nghiệm dự án lớn: dầu khí, tài chính, giáo dục, chính phủ điện tử",
        "Luôn cập nhật Cloud, AI, Big Data, DevOps…",
      ],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Quy trình & cam kết minh bạch",
      description:
        "Quy trình quản lý dự án rõ ràng, từ khảo sát đến vận hành, luôn minh bạch với khách hàng.",
      bullets: [
        "Báo cáo thường xuyên, dễ theo dõi",
        "Không phát sinh chi phí không rõ ràng",
        "Bảo trì & hỗ trợ kỹ thuật 24/7",
      ],
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const trustValues = [
    {
      icon: Shield,
      title: "An toàn & bảo mật",
      text: "Áp dụng bảo mật nhiều lớp, tuân thủ quy định pháp luật về an toàn thông tin và bảo vệ dữ liệu.",
    },
    {
      icon: Heart,
      title: "Uy tín từ sự hài lòng",
      text: "Tỉ lệ khách hàng quay lại cao, nhiều đơn vị tiếp tục chọn SFB cho các dự án tiếp theo.",
    },
    {
      icon: Globe,
      title: "Pháp lý & nền tảng vững chắc",
      text: "Mô hình CTCP, GPKD 0107857710, thương hiệu được đăng ký & hạ tầng đầy đủ, minh bạch khi hợp tác.",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 overflow-hidden bg-white"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50 via-cyan-50 to-transparent rounded-full filter blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-50 via-pink-50 to-transparent rounded-full filter blur-3xl opacity-60" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-sm font-semibold text-blue-700">
              Về SFB Technology
            </span>
          </div>
          <h2 className="text-gray-900 mb-3">
            Độ tin cậy của SFB Technology
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Năng lực thực chiến, đội ngũ chuyên gia và quy trình
            minh bạch giúp SFB trở thành đối tác công nghệ tin
            cậy của hàng trăm tổ chức, doanh nghiệp.
          </p>
        </div>

        {/* Top Grid: Image + pillars */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-18">
          {/* Image Section */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
                alt="SFB Project Meeting"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-cyan-600/20" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 max-w-xs hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp
                    className="text-white"
                    size={24}
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Hàng trăm
                  </div>
                  <div className="text-gray-600 text-sm">
                    Dự án triển khai thành công
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="space-y-4 order-1 lg:order-2">
            {trustPillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-5 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                      >
                        <Icon
                          className="text-white"
                          size={22}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`text-gray-900 mb-1.5 bg-gradient-to-r ${item.gradient} bg-clip-text group-hover:text-transparent transition-all`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.description}
                      </p>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {item.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom compact dark block */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <h3 className="text-white mb-2">
                  Bảo mật, uy tín & pháp lý rõ ràng
                </h3>
                <p className="text-sm md:text-base text-blue-100 max-w-xl">
                  SFB chú trọng bảo mật, tuân thủ pháp luật, duy
                  trì uy tín qua sự hài lòng và gắn bó lâu dài
                  của khách hàng.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 text-sm font-semibold"
              >
                Trao đổi về dự án của bạn
                <CheckCircle2 size={18} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {trustValues.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white hover:border-white transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl"
                  >
                    <div className="inline-flex mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                        <Icon
                          className="text-white"
                          size={22}
                        />
                      </div>
                    </div>
                    <div className="text-white group-hover:text-gray-900 font-semibold mb-1.5 transition-colors text-sm">
                      {item.title}
                    </div>
                    <p className="text-[13px] text-blue-100 group-hover:text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}