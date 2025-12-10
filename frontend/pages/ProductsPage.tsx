"use client";

import {
  Package,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Cloud,
  Smartphone,
  Cpu,
  MessageCircle,
  Download,
  Award,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

type CategoryId = "all" | "edu" | "justice" | "gov" | "kpi";

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>("all");

  // Nhóm sản phẩm theo lĩnh vực cho dễ hiểu
  const categories: {
    id: CategoryId;
    name: string;
    icon: any;
  }[] = [
    { id: "all", name: "Tất cả sản phẩm", icon: Package },
    { id: "edu", name: "Giải pháp Giáo dục", icon: Cloud },
    {
      id: "justice",
      name: "Công chứng – Pháp lý",
      icon: Shield,
    },
    {
      id: "gov",
      name: "Quản lý Nhà nước/Doanh nghiệp",
      icon: TrendingUp,
    },
    { id: "kpi", name: "Quản lý KPI cá nhân", icon: Cpu },
  ];

  // === DATA SẢN PHẨM TỪ SFB.VN (đã thiết kế lại) ===
  const products = [
    {
      id: 1,
      category: "edu" as CategoryId,
      name: "Hệ thống tuyển sinh đầu cấp",
      tagline: "Tuyển sinh trực tuyến minh bạch, đúng quy chế",
      meta: "Sản phẩm • Tin công nghệ • 07/08/2025",
      description:
        "Phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.",
      image:
        "https://sfb.vn/wp-content/uploads/2025/08/HDD-404x269.png",
      gradient: "from-[#006FB3] to-[#0088D9]",
      features: [
        "Đăng ký tuyển sinh trực tuyến cho phụ huynh",
        "Tích hợp quy chế tuyển sinh của Bộ/Ngành",
        "Tự động lọc, duyệt hồ sơ theo tiêu chí",
        "Tra cứu kết quả tuyển sinh online",
        "Báo cáo thống kê theo lớp, khối, khu vực",
        "Kết nối chặt chẽ giữa phụ huynh và nhà trường",
      ],
      stats: {
        users: "Nhiều trường học áp dụng",
        rating: 4.8,
        deploy: "Triển khai Cloud/On-premise",
      },
      pricing: "Liên hệ",
      badge: "Giải pháp nổi bật",
    },
    {
      id: 2,
      category: "edu" as CategoryId,
      name: "Báo giá sản phẩm – hệ thống Giáo dục thông minh",
      tagline: "Hệ sinh thái giáo dục số cho nhà trường",
      meta: "Sản phẩm • Tin công nghệ • 08/12/2023",
      description:
        "Gói sản phẩm và dịch vụ cho hệ thống Giáo dục thông minh của SFB, giúp nhà trường số hóa toàn bộ hoạt động quản lý, giảng dạy và tương tác với phụ huynh, học sinh.",
      image:
        "https://sfb.vn/wp-content/uploads/2023/12/Daiien-512x341.png",
      gradient: "from-purple-600 to-pink-600",
      features: [
        "Quản lý hồ sơ học sinh – giáo viên",
        "Quản lý học tập, điểm số, thời khóa biểu",
        "Cổng thông tin điện tử cho phụ huynh & học sinh",
        "Học bạ điện tử và sổ liên lạc điện tử",
        "Tích hợp học trực tuyến, bài tập online",
        "Báo cáo, thống kê theo năm học/kỳ học",
      ],
      stats: {
        users: "Nhiều cơ sở giáo dục triển khai",
        rating: 4.9,
        deploy: "Mô hình Cloud",
      },
      pricing: "Theo gói triển khai",
      badge: "Giải pháp giáo dục",
    },
    {
      id: 3,
      category: "justice" as CategoryId,
      name: "Hệ thống CSDL quản lý công chứng, chứng thực",
      tagline: "Cơ sở dữ liệu công chứng tập trung, an toàn",
      meta: "Sản phẩm • Tin công nghệ • 16/09/2023",
      description:
        "Giải pháp quản lý cơ sở dữ liệu công chứng, chứng thực tập trung, giúp giảm rủi ro trong các giao dịch, hỗ trợ nghiệp vụ cho các tổ chức hành nghề công chứng.",
      image:
        "https://sfb.vn/wp-content/uploads/2023/09/C3T-318x212.png",
      gradient: "from-orange-600 to-amber-600",
      features: [
        "Lưu trữ tập trung hợp đồng công chứng, chứng thực",
        "Tra cứu nhanh lịch sử giao dịch theo nhiều tiêu chí",
        "Cảnh báo trùng lặp, rủi ro trong giao dịch",
        "Phân quyền chi tiết theo vai trò nghiệp vụ",
        "Tích hợp chữ ký số và chứng thư số",
        "Báo cáo thống kê, hỗ trợ thanh tra, kiểm tra",
      ],
      stats: {
        users: "Phòng công chứng, VP công chứng",
        rating: 4.8,
        deploy: "Triển khai toàn tỉnh/thành",
      },
      pricing: "Liên hệ",
      badge: "Cho lĩnh vực công chứng",
    },
    {
      id: 4,
      category: "edu" as CategoryId,
      name: "Phần mềm quản lý Đại học – Học viện – Cao đẳng",
      tagline: "Giải pháp quản lý tổng thể cơ sở đào tạo",
      meta: "Sản phẩm • 01/11/2022",
      description:
        "Giải pháp quản lý tổng thể dành cho các trường Đại học, Học viện, Cao đẳng, hỗ trợ quản lý đào tạo, sinh viên, chương trình học và chất lượng đào tạo.",
      image:
        "https://sfb.vn/wp-content/uploads/2022/11/BG-768x512.png",
      gradient: "from-emerald-600 to-teal-600",
      features: [
        "Quản lý tuyển sinh, hồ sơ sinh viên",
        "Quản lý chương trình đào tạo, tín chỉ, lớp học",
        "Quản lý giảng viên, phân công giảng dạy",
        "Cổng thông tin cho sinh viên & giảng viên",
        "Quản lý học phí, công nợ, học bổng",
        "Báo cáo theo chuẩn Bộ/Ngành",
      ],
      stats: {
        users: "Phù hợp ĐH, HV, CĐ",
        rating: 4.7,
        deploy: "Cloud/On-premise",
      },
      pricing: "Theo quy mô trường",
      badge: "Giải pháp tổng thể",
    },
    {
      id: 5,
      category: "gov" as CategoryId,
      name: "Hệ thống thông tin quản lý, giám sát doanh nghiệp",
      tagline: "Giám sát doanh nghiệp Nhà nước hiệu quả",
      meta: "Sản phẩm • 16/01/2021",
      description:
        "Hệ thống thông tin quản lý, giám sát Nhà nước tại doanh nghiệp, hỗ trợ cơ quan quản lý nắm bắt tình hình hoạt động và chỉ tiêu của doanh nghiệp một cách chi tiết.",
      image:
        "https://sfb.vn/wp-content/uploads/2021/01/btc-255x170.png",
      gradient: "from-indigo-600 to-purple-600",
      features: [
        "Quản lý hồ sơ, thông tin doanh nghiệp",
        "Theo dõi tình hình tài chính và sản xuất kinh doanh",
        "Bộ chỉ tiêu báo cáo chuẩn hóa",
        "Cảnh báo sớm các rủi ro, vi phạm",
        "Dashboard giám sát trực quan theo ngành/lĩnh vực",
        "Kết nối, chia sẻ dữ liệu với hệ thống khác",
      ],
      stats: {
        users: "Cơ quan quản lý Nhà nước",
        rating: 4.8,
        deploy: "Triển khai tập trung",
      },
      pricing: "Thiết kế theo bài toán",
      badge: null,
    },
    {
      id: 6,
      category: "kpi" as CategoryId,
      name: "Hệ thống quản lý KPI cá nhân (BSC/KPIs)",
      tagline: "Quản trị hiệu suất cá nhân & tổ chức",
      meta: "Sản phẩm • 16/01/2021",
      description:
        "Hệ thống quản lý BSC/KPIs cá nhân giúp thiết kế bảng điểm cân bằng và hệ thống chỉ tiêu KPI, hỗ trợ đo lường và đánh giá hiệu quả công việc.",
      image:
        "https://sfb.vn/wp-content/uploads/2021/02/Skpi-red-768x512.png",
      gradient: "from-red-600 to-rose-600",
      features: [
        "Thiết kế BSC và hệ thống chỉ tiêu KPI",
        "Giao KPI theo cá nhân, phòng ban, đơn vị",
        "Theo dõi tiến độ, kết quả thực hiện theo kỳ",
        "Tự động tính điểm và xếp loại",
        "Kết nối với hệ thống lương thưởng, đánh giá",
        "Báo cáo phân tích hiệu suất đa chiều",
      ],
      stats: {
        users: "Doanh nghiệp mọi quy mô",
        rating: 4.7,
        deploy: "Cloud/On-premise",
      },
      pricing: "Tùy theo số lượng user",
      badge: "Tập trung KPI",
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const benefits = [
    {
      icon: Shield,
      title: "Bảo mật cao",
      description:
        "Tuân thủ chuẩn bảo mật, mã hóa dữ liệu end-to-end.",
      gradient: "from-[#006FB3] to-[#0088D9]",
    },
    {
      icon: Zap,
      title: "Hiệu năng ổn định",
      description:
        "Hệ thống tối ưu, uptime cao, đáp ứng nhu cầu vận hành.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: "Dễ triển khai & sử dụng",
      description:
        "Giao diện trực quan, đào tạo & hỗ trợ cho người dùng.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: TrendingUp,
      title: "Sẵn sàng mở rộng",
      description:
        "Kiến trúc linh hoạt, dễ tích hợp và mở rộng về sau.",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const testimonials = [
    {
      company: "Đối tác khối Giáo dục",
      logo: "🏫",
      quote:
        "Các giải pháp giáo dục của SFB giúp nhà trường số hóa quy trình và giao tiếp với phụ huynh hiệu quả hơn rất nhiều.",
      author: "Đại diện nhà trường",
      position: "Ban Giám hiệu",
      rating: 5,
    },
    {
      company: "Đối tác khối Công",
      logo: "🏛️",
      quote:
        "Hệ thống quản lý công chứng và giám sát doanh nghiệp hỗ trợ tốt cho công tác quản lý, giảm rủi ro và nâng cao minh bạch.",
      author: "Đại diện cơ quan quản lý",
      position: "Lãnh đạo đơn vị",
      rating: 5,
    },
    {
      company: "Khối Doanh nghiệp",
      logo: "🏢",
      quote:
        "Giải pháp KPI cá nhân giúp chúng tôi chuẩn hóa hệ thống mục tiêu và quản trị hiệu suất rõ ràng, minh bạch.",
      author: "Đại diện doanh nghiệp",
      position: "HR/CEO",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-[#006FB3] to-[#005589] pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0088D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <Package className="text-cyan-400" size={20} />
              <span className="text-white font-semibold text-sm">
                SẢN PHẨM &amp; GIẢI PHÁP
              </span>
            </div>

            <h1 className="text-white mb-8 text-5xl md:text-6xl">
              Bộ giải pháp phần mềm
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-2">
                Phục vụ Giáo dục, Công chứng &amp; Doanh nghiệp
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-3xl mx-auto">
              Các sản phẩm SFB được xây dựng từ bài toán thực tế
              của cơ quan Nhà nước, nhà trường và doanh nghiệp,
              giúp tối ưu quy trình và nâng cao hiệu quả quản
              lý.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#products"
                className="group px-10 py-5 bg-white text-[#006FB3] rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
              >
                Xem danh sách sản phẩm
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={20}
                />
              </a>
              <a
                href="/contact"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
              >
                <MessageCircle size={20} />
                Tư vấn giải pháp
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  Rất nhiều+
                </div>
                <div className="text-blue-200">
                  Giải pháp phần mềm
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  Rất nhiều+
                </div>
                <div className="text-blue-200">
                  Đơn vị triển khai thực tế
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  4.8★
                </div>
                <div className="text-blue-200">
                  Mức độ hài lòng trung bình
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex mb-6">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}
                    >
                      <Icon className="text-white" size={32} />
                    </div>
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

      {/* Category Filter */}
      <section
        id="products"
        className="py-8 bg-gray-50 border-y border-gray-200 sticky top-[88px] z-40 backdrop-blur-lg bg-gray-50/95"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Package
              className="text-gray-600 flex-shrink-0"
              size={20}
            />
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(category.id)
                  }
                  className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all inline-flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-28 bg-gradient-to-br from-gray-50 via-[#E6F4FF] to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-gray-900 mb-6">
              Sản phẩm &amp; giải pháp nổi bật
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Danh sách các hệ thống phần mềm đang được SFB
              triển khai cho nhà trường, cơ quan Nhà nước và
              doanh nghiệp.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-gray-100 hover:border-[#006FB3] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr ${product.gradient} opacity-30`}
                  />

                  {product.badge && (
                    <div className="absolute top-6 right-6">
                      <div
                        className={`px-5 py-2 bg-gradient-to-r ${product.gradient} text-white rounded-full text-sm font-semibold shadow-lg flex items-center gap-2`}
                      >
                        <Star
                          size={16}
                          className="fill-white"
                        />
                        {product.badge}
                      </div>
                    </div>
                  )}

                  {/* Stats Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl flex items-center gap-2">
                      <Users
                        size={16}
                        className="text-[#006FB3]"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {product.stats.users}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {product.stats.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="mb-4 text-sm text-gray-500">
                    {product.meta}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-gray-900 mb-2 group-hover:text-[#006FB3] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[#006FB3] font-semibold mb-3">
                      {product.tagline}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {product.features
                      .slice(0, 4)
                      .map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2
                            size={18}
                            className="text-[#006FB3] flex-shrink-0 mt-0.5"
                          />
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    {product.features.length > 4 && (
                      <button className="text-[#006FB3] font-semibold text-sm hover:underline">
                        +{product.features.length - 4} tính năng
                        khác
                      </button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Giá tham khảo
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {product.pricing}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                        Demo nhanh
                      </button>
                      <button
                        className={`px-8 py-3 bg-gradient-to-r ${product.gradient} text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold`}
                      >
                        Tìm hiểu thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-[#006FB3] to-[#005589] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-white mb-6">
              Khách hàng nói gì về SFB
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Những phản hồi từ các đơn vị đã triển khai giải
              pháp của chúng tôi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white hover:border-white transition-all duration-500 group"
              >
                <div className="flex items-center gap-2 mb-6">
                  {Array.from({
                    length: testimonial.rating,
                  }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-lg text-white group-hover:text-gray-700 mb-8 leading-relaxed italic transition-colors">
                  “{testimonial.quote}”
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center text-2xl">
                    {testimonial.logo}
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-gray-900 transition-colors">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-blue-200 group-hover:text-gray-600 transition-colors">
                      {testimonial.position},{" "}
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-[#E6F4FF] to-white rounded-3xl p-12 lg:p-16 border-2 border-[#006FB3]/20 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border-2 border-[#006FB3]/20 mb-8">
              <MessageCircle
                className="text-[#006FB3]"
                size={20}
              />
              <span className="text-[#006FB3] font-semibold text-sm">
                LIÊN HỆ TƯ VẤN GIẢI PHÁP
              </span>
            </div>

            <h2 className="text-gray-900 mb-6">
              Cần tư vấn thêm về sản phẩm/dịch vụ?
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Hãy để lại thông tin, đội ngũ SFB sẽ liên hệ và tư
              vấn giải pháp phù hợp nhất với nhu cầu của bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="group px-10 py-5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl hover:shadow-2xl hover:shadow-[#006FB3]/50 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
              >
                Đặt lịch tư vấn
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={20}
                />
              </a>
              <a
                href="/contact"
                className="px-10 py-5 bg-white text-[#006FB3] rounded-xl border-2 border-[#006FB3]/20 hover:border-[#006FB3] hover:shadow-lg transition-all inline-flex items-center justify-center gap-3 font-semibold"
              >
                <Download size={20} />
                Tải brochure sản phẩm
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default ProductsPage;
