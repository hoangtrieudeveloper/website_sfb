import {
  Code,
  Users,
  Heart,
  TrendingUp,
  Award,
  Coffee,
  Zap,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Star,
} from "lucide-react";

export function CareersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Lương thưởng hấp dẫn",
      description:
        "Mức lương cạnh tranh top đầu thị trường, thưởng theo hiệu quả công việc",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: TrendingUp,
      title: "Thăng tiến rõ ràng",
      description:
        "Lộ trình phát triển sự nghiệp minh bạch, đánh giá định kỳ 6 tháng",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Coffee,
      title: "Môi trường năng động",
      description:
        "Văn hóa startup, không gian làm việc hiện đại, team building định kỳ",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: Heart,
      title: "Chăm sóc sức khỏe",
      description:
        "Bảo hiểm sức khỏe toàn diện, khám sức khỏe định kỳ, gym membership",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: Rocket,
      title: "Công nghệ tiên tiến",
      description:
        "Làm việc với tech stack mới nhất, tham gia dự án quốc tế",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Đào tạo & phát triển",
      description:
        "Ngân sách training unlimited, hỗ trợ certification & conference",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const positions = [
    {
      id: 1,
      title: "Senior Full-stack Developer",
      department: "Engineering",
      type: "Full-time",
      location: "TP. HCM",
      salary: "2000 - 3500 USD",
      experience: "4+ years",
      skills: ["React", "Node.js", "AWS", "MongoDB"],
      description:
        "Phát triển và maintain các hệ thống enterprise cho khách hàng lớn. Lead team 3-5 developers.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Mobile Developer (Flutter)",
      department: "Engineering",
      type: "Full-time",
      location: "TP. HCM / Remote",
      salary: "1500 - 2500 USD",
      experience: "2+ years",
      skills: ["Flutter", "Dart", "Firebase", "RESTful API"],
      description:
        "Xây dựng mobile app cho các lĩnh vực fintech, e-commerce, healthcare.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "DevOps Engineer",
      department: "Infrastructure",
      type: "Full-time",
      location: "TP. HCM",
      salary: "1800 - 3000 USD",
      experience: "3+ years",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
      description:
        "Quản lý infrastructure, CI/CD pipeline, monitoring và scaling hệ thống.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: 4,
      title: "UI/UX Designer",
      department: "Design",
      type: "Full-time",
      location: "TP. HCM",
      salary: "1200 - 2000 USD",
      experience: "2+ years",
      skills: [
        "Figma",
        "Adobe XD",
        "Prototyping",
        "User Research",
      ],
      description:
        "Thiết kế giao diện và trải nghiệm người dùng cho web/mobile app.",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: 5,
      title: "Data Engineer",
      department: "Data",
      type: "Full-time",
      location: "TP. HCM",
      salary: "2000 - 3200 USD",
      experience: "3+ years",
      skills: ["Python", "Spark", "Airflow", "SQL"],
      description:
        "Xây dựng data pipeline, ETL và data warehouse cho dự án Big Data.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 6,
      title: "QA Automation Engineer",
      department: "Quality Assurance",
      type: "Full-time",
      location: "TP. HCM / Remote",
      salary: "1000 - 1800 USD",
      experience: "2+ years",
      skills: ["Selenium", "Jest", "Cypress", "CI/CD"],
      description:
        "Phát triển automation test, đảm bảo chất lượng sản phẩm.",
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <Star className="text-yellow-400" size={20} />
              <span className="text-white font-semibold text-sm">
                TUYỂN DỤNG
              </span>
            </div>

            <h1 className="text-white mb-8 text-5xl md:text-6xl">
              Cùng xây dựng
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                tương lai công nghệ
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-3xl mx-auto">
              Gia nhập đội ngũ 50+ chuyên gia công nghệ, làm
              việc với tech stack hiện đại nhất và triển khai dự
              án cho các khách hàng lớn
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#positions"
                className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
              >
                Xem vị trí tuyển dụng
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={20}
                />
              </a>
              <a
                href="#benefits"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
              >
                Phúc lợi & Đãi ngộ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-gray-900 mb-6">
              Phúc lợi & Đãi ngộ
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Chúng tôi tin rằng nhân viên hạnh phúc sẽ làm việc
              hiệu quả hơn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                    >
                      <Icon className="text-white" size={28} />
                    </div>
                    <div
                      className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}
                    />
                  </div>

                  <h4 className="text-gray-900 mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section id="positions" className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-gray-900 mb-6">
              Vị trí đang tuyển
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Tìm vị trí phù hợp với bạn và ứng tuyển ngay hôm
              nay
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {positions.map((position) => (
              <div
                key={position.id}
                className="group bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2">
                      {position.title}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Briefcase size={16} />
                      <span>{position.department}</span>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 bg-gradient-to-r ${position.gradient} text-white rounded-full text-sm font-medium`}
                  >
                    {position.type}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-start gap-2">
                    <MapPin
                      className="text-blue-600 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Địa điểm
                      </div>
                      <div className="text-gray-900 font-medium">
                        {position.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign
                      className="text-emerald-600 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Mức lương
                      </div>
                      <div className="text-gray-900 font-medium">
                        {position.salary}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock
                      className="text-orange-600 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Kinh nghiệm
                      </div>
                      <div className="text-gray-900 font-medium">
                        {position.experience}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award
                      className="text-purple-600 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Loại hình
                      </div>
                      <div className="text-gray-900 font-medium">
                        {position.type}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {position.description}
                </p>

                {/* Skills */}
                <div className="mb-8">
                  <div className="text-sm font-semibold text-gray-700 mb-3">
                    Kỹ năng yêu cầu:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {position.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="/contact"
                  className={`w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${position.gradient} text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-semibold`}
                >
                  Ứng tuyển ngay
                  <ArrowRight size={20} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-28 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white mb-6">
              Không tìm thấy vị trí phù hợp?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Gửi CV cho chúng tôi! Chúng tôi luôn tìm kiếm
              những tài năng xuất sắc
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:careers@sfb.vn"
                className="group px-10 py-5 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
              >
                Gửi CV qua email
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={20}
                />
              </a>
              <a
                href="/contact"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
              >
                Liên hệ HR
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}