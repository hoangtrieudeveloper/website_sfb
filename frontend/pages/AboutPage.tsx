import {
  Target,
  Users,
  Award,
  TrendingUp,
  Eye,
  Heart,
  Zap,
  Globe,
  Shield,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MapPin,
  Linkedin,
  Phone,
  Mail,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function AboutPage() {
  // Tầm nhìn & Sứ mệnh (theo nội dung bạn cung cấp)
  const visionMission = [
    {
      icon: Eye,
      title: "Tầm nhìn",
      subtitle: "Vision",
      content:
        "Trở thành một trong những công ty công nghệ hàng đầu về phát triển bền vững, xây dựng trên nền tảng tri thức và trí tuệ sáng tạo của đội ngũ nhân sự SFB.",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      highlights: [
        "Phát triển bền vững trên nền tảng tri thức",
        "Kết hợp trí tuệ tập thể & sự nhiệt huyết của đội ngũ",
        "Xây dựng hệ thống, sản phẩm có giá trị lâu dài",
      ],
    },
    {
      icon: Target,
      title: "Sứ mệnh",
      subtitle: "Mission",
      content:
        "Cung cấp các giải pháp và dịch vụ công nghệ thông tin chất lượng cao, mang lại giá trị thực tế cho khách hàng, nhà đầu tư, nhân sự và xã hội.",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      highlights: [
        "Cung cấp sản phẩm, dịch vụ tốt nhất dựa trên công nghệ mới",
        "Tạo dựng niềm tin vững chắc với khách hàng & nhà đầu tư",
        "Xây dựng môi trường làm việc chuyên nghiệp, nhân văn",
        "Chung tay cùng xã hội hướng tới nền công nghiệp 4.0",
      ],
    },
  ];

  const coreValues = [
    {
      icon: Zap,
      title: "Đổi mới sáng tạo",
      description:
        "Luôn tìm kiếm giải pháp mới, áp dụng công nghệ tiên tiến vào sản phẩm & dịch vụ.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Hợp tác & đồng hành",
      description:
        "Làm việc nhóm chặt chẽ, cùng khách hàng xây dựng giải pháp phù hợp nhất.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "Tận tâm với khách hàng",
      description:
        "Đặt lợi ích khách hàng lên hàng đầu, cam kết đồng hành dài lâu.",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Trách nhiệm & minh bạch",
      description:
        "Tuân thủ cam kết, quy trình rõ ràng, không phát sinh chi phí thiếu minh bạch.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Lightbulb,
      title: "Học hỏi không ngừng",
      description:
        "Liên tục cập nhật xu hướng mới: Cloud, AI, Big Data, DevOps…",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: Globe,
      title: "Tư duy toàn cầu",
      description:
        "Tiếp cận theo chuẩn quốc tế, sẵn sàng mở rộng sang các thị trường mới.",
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  // Mốc phát triển (điều chỉnh theo thực tế SFB – thành lập 2017)
  const milestones = [
    {
      year: "2017",
      title: "Thành lập SFBTECH.,JSC",
      description:
        "Được cấp giấy chứng nhận đăng ký kinh doanh số 0107857710 bởi Sở KH&ĐT Hà Nội, bắt đầu hoạt động theo mô hình công ty cổ phần.",
      icon: "🚀",
    },
    {
      year: "2018–2019",
      title: "Xây dựng đội ngũ & sản phẩm lõi",
      description:
        "Hình thành các giải pháp về cổng thông tin điện tử, văn bản điều hành, thư viện số và các hệ thống nghiệp vụ cho cơ quan Nhà nước.",
      icon: "📘",
    },
    {
      year: "2020–2022",
      title: "Mở rộng lĩnh vực & quy mô triển khai",
      description:
        "Triển khai nhiều dự án cho khối Tài chính, Bảo hiểm, Ngân hàng, Viễn thông, Chính phủ điện tử và Doanh nghiệp.",
      icon: "📈",
    },
    {
      year: "Từ 2023",
      title: "Tiếp tục tăng trưởng & chuyển đổi số",
      description:
        "Đẩy mạnh các giải pháp theo nhu cầu riêng của từng đơn vị, chú trọng mở rộng, an toàn, bảo mật và tích hợp hệ thống.",
      icon: "🎯",
    },
  ];

  // Dữ liệu ban lãnh đạo (thay cho leadership cũ)
  const leaders = [
    {
      name: "Nguyễn Văn Điền",
      position: "Kế toán trưởng",
      email: "diennv@sfb.vn",
      phone: "0888 917 999",
      image:
        "https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg",
    },
    {
      name: "Nguyễn Đức Duy",
      position: "Giám Đốc Công Nghệ",
      email: "duynd@sfb.vn",
      phone: "0705 146 789",
      image:
        "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg",
    },
    {
      name: "Nguyễn Văn C",
      position: "Giám Đốc kinh doanh",
      email: "nvc@sfb.vn",
      phone: "0967 891 123",
      image:
        "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg",
    },
  ];

  // Stats hero – không ghi số cụ thể cho dự án / khách hàng
  const stats = [
    {
      value: "8+ năm",
      label: "Kinh nghiệm triển khai",
      icon: Calendar,
    },
    {
      value: "Hàng trăm",
      label: "Dự án & triển khai thực tế",
      icon: Target,
    },
    {
      value: "Nhiều đơn vị",
      label: "Cơ quan Nhà nước & doanh nghiệp",
      icon: Users,
    },
    {
      value: "Đội ngũ",
      label: "Chuyên gia CNTT tận tâm",
      icon: Award,
    },
  ];

  // Thông tin công ty chi tiết
  const companyStats = [
    {
      label: "Năm thành lập",
      value: "2017",
      description:
        "Hoạt động theo mô hình Công ty Cổ phần, GPKD số 0107857710 do Sở KH&ĐT Hà Nội cấp.",
    },
    {
      label: "Trụ sở chính",
      value: "Hà Nội",
      description:
        "41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc Thuỵ, quận Long Biên, thành phố Hà Nội.",
    },
    {
      label: "Văn phòng",
      value: "P303",
      description:
        "Tầng 3, Khách sạn Thể Thao, 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.",
    },
    {
      label: "Lĩnh vực kinh doanh",
      value: "Đa ngành",
      description:
        "Tài chính, Bảo hiểm, Ngân hàng, Viễn thông, Thư viện, Chính phủ & Doanh nghiệp.",
    },
  ];

  // Sơ đồ tổ chức – theo sơ đồ thực tế
  const orgDepartments = [
    {
      name: "Phòng Giải pháp",
      badge: "Giải pháp & tư vấn",
      gradient: "from-orange-400 to-rose-400",
      subUnits: [
        "Bộ phận triển khai",
        "Bộ phận phát triển phần mềm",
        "Bộ phận nghiệp vụ",
      ],
    },
    {
      name: "Phòng Sản phẩm",
      badge: "Quản lý & phát triển sản phẩm",
      gradient: "from-blue-400 to-indigo-500",
      subUnits: [
        "Bộ phận triển khai",
        "Bộ phận phát triển sản phẩm",
        "Bộ phận nghiệp vụ",
      ],
    },
    {
      name: "Phòng Dự án",
      badge: "Quản lý triển khai",
      gradient: "from-emerald-400 to-teal-500",
      subUnits: [
        "Bộ phận quản lý dự án",
        "Bộ phận hỗ trợ và đào tạo",
      ],
    },
    {
      name: "Phòng Kinh doanh",
      badge: "Bán hàng & đối tác",
      gradient: "from-purple-400 to-pink-500",
      subUnits: [],
    },
    {
      name: "Phòng Hành chính",
      badge: "Vận hành nội bộ",
      gradient: "from-cyan-400 to-blue-500",
      subUnits: [
        "Bộ phận hành chính",
        "Bộ phận nhân sự",
        "Bộ phận kế toán",
      ],
    },
    {
      name: "Phòng Hệ thống thông tin",
      badge: "Hạ tầng & vận hành hệ thống",
      gradient: "from-slate-500 to-slate-700",
      subUnits: [],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
                <Heart className="text-pink-400" size={20} />
                <span className="text-white font-semibold text-sm">
                  VỀ CHÚNG TÔI
                </span>
              </div>

              <h1 className="text-white mb-8 text-5xl md:text-6xl">
                SFB Technology
                <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-2">
                  CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB
                </span>
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed mb-10">
                Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC
                đồng hành cùng nhiều cơ quan Nhà nước và doanh
                nghiệp trong hành trình chuyển đổi số với hàng
                trăm dự án triển khai thực tế.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="text-center">
                      <Icon
                        className="text-cyan-400 mx-auto mb-2"
                        size={28}
                      />
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-blue-200">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?auto=format&fit=crop&w=1080&q=80"
                  alt="SFB Office"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-28 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50 relative overflow-hidden">
        {/* subtle grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:18px_28px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-[1.4fr,1fr] gap-12 items-stretch">
            {/* Left: main company card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-8 md:p-10">
              {/* Tag + subtitle */}
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  <Globe size={16} />
                  <span>THÔNG TIN CÔNG TY</span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                  <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                    Thành lập: 24/05/2017
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                    Mã ĐKKD: 0107857710
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-gray-900 text-2xl md:text-3xl mb-4">
                Đối tác công nghệ chiến lược cho doanh nghiệp
                Việt
              </h2>

              {/* Legal name */}
              <div className="mb-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 px-4 py-3 text-sm text-gray-700">
                <span className="font-semibold text-gray-900">
                  CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB
                </span>{" "}
                (SFB TECHNOLOGY JOINT STOCK COMPANY – viết tắt{" "}
                <span className="font-semibold text-[#006FB3]">
                  SFBTECH.,JSC
                </span>
                ).
              </div>

              {/* Description */}
              <div className="space-y-4 text-sm md:text-[15px] text-gray-600 leading-relaxed mb-6">
                <p>
                  Công ty hoạt động theo mô hình cổ phần với
                  giấy chứng nhận đăng ký kinh doanh số{" "}
                  <span className="font-medium">
                    0107857710
                  </span>{" "}
                  do Sở Kế hoạch và Đầu tư Hà Nội cấp ngày{" "}
                  <span className="font-medium">
                    24/05/2017
                  </span>
                  .
                </p>
                <p>
                  Qua quá trình hình thành và phát triển, SFB
                  từng bước khẳng định vị thế trong ngành công
                  nghệ thông tin Việt Nam với sứ mệnh cung cấp
                  các giải pháp phần mềm, hệ thống và dịch vụ
                  chất lượng cao, đáp ứng những yêu cầu khắt khe
                  nhất của khách hàng.
                </p>
              </div>

              {/* Addresses */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                    <MapPin
                      className="text-blue-600"
                      size={16}
                    />
                    <span>Trụ sở</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc
                    Thuỵ, quận Long Biên, Hà Nội.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                    <MapPin
                      className="text-blue-600"
                      size={16}
                    />
                    <span>Văn phòng</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    P303, Tầng 3, Khách sạn Thể Thao, 15 Lê Văn
                    Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.
                  </p>
                </div>
              </div>

              {/* Contact + highlight */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone
                      className="text-emerald-600"
                      size={18}
                    />
                    <span className="text-gray-700">
                      <span className="text-gray-500">
                        Hotline:&nbsp;
                      </span>
                      <a
                        href="tel:0888917999"
                        className="font-semibold text-emerald-600"
                      >
                        0888 917 999
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail
                      className="text-purple-600"
                      size={18}
                    />
                    <span className="text-gray-700">
                      <span className="text-gray-500">
                        Email:&nbsp;
                      </span>
                      <a
                        href="mailto:info@sfb.vn"
                        className="font-semibold text-[#006FB3]"
                      >
                        info@sfb.vn
                      </a>
                    </span>
                  </div>
                </div>

                <div className="sm:text-right text-sm text-gray-600 max-w-xs">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#006FB3] font-semibold text-xs mb-1">
                    Đội ngũ chuyên gia công nghệ
                  </span>
                  <p>
                    Luôn cập nhật xu hướng mới để xây dựng hệ
                    thống ổn định, dễ mở rộng và tối ưu chi phí
                    cho khách hàng.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: stats & quick facts */}
            <div className="space-y-6">
              {/* Stats card */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                <h3 className="text-gray-900 mb-5 text-lg">
                  Một vài con số nổi bật
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {companyStats.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/95 rounded-2xl p-4 shadow-sm border border-gray-100"
                    >
                      <div className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                        {item.label}
                      </div>
                      <div className="text-2xl font-semibold text-gray-900 mb-1">
                        {item.value}
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                      <div className="mt-3 h-1 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick highlight */}
              <div className="bg-slate-900 text-slate-50 rounded-3xl p-6 md:p-7 shadow-xl">
                <div className="text-xs font-semibold tracking-wide text-cyan-300 mb-2">
                  SỨ MỆNH & ĐỊNH HƯỚNG
                </div>
                <p className="text-sm md:text-[15px] leading-relaxed mb-4 text-slate-100">
                  SFB tập trung vào các giải pháp phần mềm, hệ
                  thống và dịch vụ chuyển đổi số cho khối Nhà
                  nước, giáo dục, tài chính và doanh nghiệp.
                </p>
                <p className="text-xs text-slate-300">
                  Mục tiêu của chúng tôi là trở thành đối tác
                  công nghệ tin cậy, đồng hành dài hạn cùng
                  khách hàng trên hành trình hiện đại hóa và số
                  hóa toàn diện.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-28 bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/30 relative overflow-hidden">
        {/* subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:18px_28px]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
              <Globe size={16} />
              <span>TẦM NHÌN &amp; SỨ MỆNH</span>
            </div>
            <h2 className="text-gray-900 mb-3">
              Định hướng phát triển của SFB
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Tầm nhìn dài hạn và sứ mệnh rõ ràng là nền tảng
              cho mọi quyết định, sản phẩm và dịch vụ mà SFB
              mang tới khách hàng.
            </p>
          </div>

          {/* Cards */}
          <div className="grid lg:grid-cols-2 gap-10">
            {visionMission.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="group relative">
                  {/* Card */}
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 h-full overflow-hidden">
                    {/* Left color stripe */}
                    <div
                      className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${item.gradient}`}
                    />

                    {/* Big background word */}
                    <div className="absolute right-4 top-6 text-4xl md:text-5xl font-black tracking-widest text-gray-100 uppercase pointer-events-none">
                      {item.subtitle}
                    </div>

                    <div className="px-8 py-8 md:px-9 md:py-9">
                      {/* Icon + titles */}
                      <div className="flex items-start gap-4 mb-8">
                        <div className="relative">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                          >
                            <Icon
                              className="text-white"
                              size={30}
                            />
                          </div>
                          <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500`}
                          />
                        </div>

                        <div>
                          <h3 className="text-gray-900 text-xl md:text-2xl mb-2">
                            {item.title}
                          </h3>
                          <div
                            className={`inline-flex items-center gap-2 text-xs font-semibold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent uppercase tracking-[0.18em]`}
                          >
                            <span>{item.subtitle}</span>
                          </div>
                        </div>
                      </div>

                      {/* Main content */}
                      <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed mb-7">
                        {item.content}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-3">
                        {item.highlights.map(
                          (highlight, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 px-4 py-3 transition-all group/item"
                            >
                              <CheckCircle2
                                className="flex-shrink-0 mt-0.5 text-[#006FB3] group-hover/item:scale-110 transition-transform"
                                size={18}
                              />
                              <span className="text-sm text-gray-700">
                                {highlight}
                              </span>
                            </div>
                          ),
                        )}
                      </div>

                      {/* Small tag at bottom */}
                      <div className="mt-7 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                        <span>
                          Cốt lõi định hướng{" "}
                          <span className="font-semibold text-[#006FB3]">
                            SFB
                          </span>
                        </span>
                        <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                          Đồng hành dài hạn cùng khách hàng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-28 bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/10 relative overflow-hidden">
        {/* grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:18px_28px]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-blue-100 text-xs font-semibold text-blue-700 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>CORE VALUES</span>
            </div>
            <h2 className="text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Những nguyên tắc định hình văn hoá và cách SFB hợp
              tác với khách hàng, đối tác và đội ngũ nội bộ
            </p>
          </div>

          {/* content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              const order = index + 1;

              return (
                <div
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl px-6 py-5 md:px-8 md:py-7 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
                >
                  {/* accent gradient */}
                  <div className="pointer-events-none absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200/40 via-purple-200/40 to-cyan-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex gap-5 items-start">
                    {/* icon + index */}
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <div
                        className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}
                      >
                        <Icon
                          className="text-white"
                          size={26}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400 tracking-widest">
                        {order.toString().padStart(2, "0")}
                      </span>
                    </div>

                    {/* text */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-gray-900 text-base md:text-lg">
                          {value.title}
                        </h4>
                        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-gray-50 text-[11px] font-medium text-gray-500 border border-gray-200">
                          Core value
                        </span>
                      </div>
                      <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed mb-3">
                        {value.description}
                      </p>

                      {/* progress / accent line */}
                      <div className="h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full w-1/2 bg-gradient-to-r ${value.gradient} group-hover:w-full transition-all duration-500`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-28 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50 relative overflow-hidden">
        {/* subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:18px_28px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Từ năm 2017 đến nay, SFB liên tục mở rộng đội ngũ,
              nâng cấp sản phẩm và chuẩn hóa dịch vụ để đồng
              hành cùng khách hàng lâu dài
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-3 bottom-3 md:left-1/2 md:-translate-x-1/2 w-px bg-gradient-to-b from-blue-200 via-cyan-200 to-purple-200 pointer-events-none" />

            <div className="space-y-10">
              {milestones.map((milestone, index) => {
                const isLeft = index % 2 === 0; // cho desktop: card trái/phải luân phiên

                return (
                  <div
                    key={index}
                    className={`
                relative flex flex-col md:flex-row md:items-stretch
                ${isLeft ? "md:justify-start" : "md:justify-end"}
              `}
                  >
                    {/* Dot + icon */}
                    <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-2xl shadow-lg border-4 border-white">
                          {milestone.icon}
                        </div>
                        {/* glow */}
                        <div className="absolute inset-0 rounded-2xl bg-cyan-500/40 blur-xl -z-10 opacity-0 md:group-hover:opacity-70 transition-opacity" />
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className={`
                  mt-10 md:mt-0 md:w-1/2
                  ${isLeft ? "md:pr-10 md:pl-0 md:text-right" : "md:pl-10 md:pr-0 md:text-left"}
                  pl-16
                `}
                    >
                      <div className="group bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-1">
                        {/* Year chip */}
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4
                    ${isLeft ? "md:flex-row-reverse" : ""}
                    bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 text-blue-700
                  `}
                        >
                          <span className="inline-flex w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                          <span>{milestone.year}</span>
                        </div>

                        <h4 className="text-gray-900 mb-2 text-lg md:text-xl">
                          {milestone.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Organization Chart */}
      <section className="py-28 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
        {/* grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:18px_28px]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-blue-100 text-xs font-semibold text-blue-700 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>ORGANIZATION</span>
            </div>
            <h2 className="text-gray-900 mb-4">
              Sơ đồ tổ chức
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Cấu trúc tổ chức tinh gọn, rõ vai trò, giúp phối
              hợp hiệu quả giữa khối kỹ thuật, kinh doanh và vận
              hành
            </p>
          </div>

          {/* Top level: HĐQT -> TGĐ */}
          <div className="flex flex-col items-center mb-16">
            <div className="bg-white rounded-2xl px-8 py-4 shadow-md border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                <Users size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  HỘI ĐỒNG QUẢN TRỊ
                </div>
                <div className="text-xs text-gray-500">
                  Định hướng chiến lược & giám sát
                </div>
              </div>
            </div>

            {/* line */}
            <div className="w-px h-10 bg-gradient-to-b from-blue-200 to-purple-200 my-2" />

            <div className="bg-white rounded-2xl px-8 py-4 shadow-md border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Target size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  TỔNG GIÁM ĐỐC
                </div>
                <div className="text-xs text-gray-500">
                  Điều hành toàn bộ hoạt động công ty
                </div>
              </div>
            </div>
          </div>

          {/* Departments grid */}
          <div className="bg-white/90 backdrop-blur-sm rounded-4xl border border-gray-100 shadow-xl p-8 lg:p-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Các phòng ban trực thuộc Tổng Giám đốc, phối hợp
                chặt chẽ trong suốt vòng đời dự án: từ giải
                pháp, sản phẩm, triển khai đến vận hành.
              </div>
              <div className="hidden md:inline-flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Đơn vị phòng ban</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {orgDepartments.map((dept, idx) => (
                <div
                  key={idx}
                  className="relative group bg-white rounded-3xl border border-gray-100 px-5 py-5 md:px-6 md:py-6 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
                >
                  {/* accent */}
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${dept.gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}
                  />

                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {dept.name}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          {dept.badge}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400">
                        {`0${idx + 1}`}
                      </span>
                    </div>

                    {dept.subUnits.length > 0 ? (
                      <ul className="mt-2 space-y-1.5 text-xs text-gray-700">
                        {dept.subUnits.map((unit) => (
                          <li
                            key={unit}
                            className="flex items-start gap-2"
                          >
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            <span>{unit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-gray-500">
                        Phối hợp với các phòng ban khác trong
                        hoạt động kinh doanh và vận hành chung.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-28 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/10 relative overflow-hidden">
        {/* grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:18px_28px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-blue-100 text-xs font-semibold text-blue-700 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>LEADERSHIP TEAM</span>
            </div>
            <h2 className="text-gray-900 mb-4">Ban lãnh đạo</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Đội ngũ lãnh đạo chủ chốt của SFB Technology, định
              hướng chiến lược và đồng hành cùng khách hàng
              trong mọi dự án
            </p>
          </div>

          {/* Card lãnh đạo */}
          <div className="grid md:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden px-6 py-7 flex flex-col items-center text-center"
              >
                {/* accent */}
                <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/50 via-purple-200/50 to-cyan-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* avatar */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-4">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-[2px] shadow-lg">
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-gray-900 text-base md:text-lg font-semibold mb-1">
                    {leader.name}
                  </h4>
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                    {leader.position}
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Thành viên ban lãnh đạo phụ trách{" "}
                    <span className="font-medium text-gray-700">
                      {leader.position.toLowerCase()}
                    </span>
                    , phối hợp chặt chẽ với các khối giải pháp,
                    sản phẩm và vận hành.
                  </div>

                  {/* contact */}
                  <div className="w-full border-t border-gray-100 pt-4 mt-2 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Mail
                        size={14}
                        className="text-blue-600"
                      />
                      <a
                        href={`mailto:${leader.email}`}
                        className="hover:text-blue-600 hover:underline break-all"
                      >
                        {leader.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone
                        size={14}
                        className="text-emerald-600"
                      />
                      <a
                        href={`tel:${leader.phone}`}
                        className="hover:text-emerald-600"
                      >
                        {leader.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <a
                        href="https://www.linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-blue-50 border border-gray-200 text-[11px] font-medium text-gray-700 hover:text-blue-700 transition-colors"
                      >
                        <Linkedin size={14} />
                        <span>Hồ sơ LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white mb-6">
              Hãy cùng SFB xây dựng hệ thống phù hợp cho đơn vị
              của bạn
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Liên hệ để được tư vấn về giải pháp phần mềm, hạ
              tầng và chuyển đổi số phù hợp với nhu cầu thực tế
              của cơ quan, tổ chức hoặc doanh nghiệp.
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
                href="/careers"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
              >
                Tuyển dụng
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default AboutPage;
