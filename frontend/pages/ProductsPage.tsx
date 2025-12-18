"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
import { useRef, useState, useEffect } from "react";


type CategoryId = "all" | "edu" | "justice" | "gov" | "kpi";

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>("all");
  const testimonials = [
    {
      company: "Đối tác khối Công",
      quote:
        "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.",
      author: "Ông Nguyễn Khánh Tâm",
      rating: 5,
    },
    {
      company: "Đối tác khối Giáo dục",
      quote:
        "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.",
      author: "Ông Nguyễn Hoàng Chinh",
      rating: 5,
    },
    {
      company: "Đối tác khối Công",
      quote:
        "Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.",
      author: "Ông Nguyễn Khánh Tùng",
      rating: 5,
    },
    {
      company: "Khối Doanh nghiệp",
      quote:
        "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.",
      author: "Ông Vũ Kim Trung",
      rating: 5,
    },
    {
      company: "Khối Doanh nghiệp",
      quote:
        "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.",
      author: "Ông nguyễn Khanh",
      rating: 5,
    },
  ];

  // ===== Testimonials carousel =====
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };


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
      icon: "/icons/custom/product1.svg",
      title: "Bảo mật cao",
      description:
        "Tuân thủ chuẩn bảo mật, mã hóa dữ liệu end-to-end.",
      gradient: "from-[#006FB3] to-[#0088D9]",
    },
    {
      icon: "/icons/custom/product2.svg",
      title: "Hiệu năng ổn định",
      description:
        "Hệ thống tối ưu, uptime cao, đáp ứng nhu cầu vận hành.",
      gradient: "from-[#FF81C2] to-[#667EEA]",
    },
    {
      icon: "/icons/custom/product3.svg",
      title: "Dễ triển khai & sử dụng",
      description:
        "Giao diện trực quan, đào tạo & hỗ trợ cho người dùng.",
      gradient: "from-[#2AF598] to-[#009EFD]",
    },
    {
      icon: "/icons/custom/product4.svg",
      title: "Sẵn sàng mở rộng",
      description:
        "Kiến trúc linh hoạt, dễ tích hợp và mở rộng về sau.",
      gradient: "from-[#FA709A] to-[#FEE140]",
    },
  ];



  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0870B4] to-[#2EABE2] pt-32 pb-20">


        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0088D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">


            <h1 className="text-white mb-8 text-5xl md:text-5xl">
              Bộ giải pháp phần mềm
              <span className="block text-white font-extrabold text-5xl mt-2">
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

                Tư vấn giải pháp
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={20}
                />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  +32.000
                </div>
                <div className="text-blue-200">
                  Giải pháp phần mềm
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  +6.000
                </div>
                <div className="text-blue-200">
                  Đơn vị triển khai thực tế
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  4.9★
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100
          hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] transition-all duration-300"
              >
                {/* Icon box */}
                <div className="flex justify-center mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient}
              flex items-center justify-center shadow-md`}
                  >
                    <img
                      src={benefit.icon}
                      alt={benefit.title}
                      className="w-8 h-8"
                    />
                  </div>
                </div>

                <h4 className="text-gray-900 font-bold text-base mb-2">
                  {benefit.title}
                </h4>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section (giống ảnh) */}
      <section id="products" className=" bg-white">
        <div className="w-full max-w-[1920px] mx-auto">
          {/* Title */}
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-[24px]">
            <div className="text-[15px] font-semibold tracking-widest text-[#2EABE2] uppercase">
              GIẢI PHÁP CHUYÊN NGHIỆP
            </div>

            <h2 className="text-gray-900 text-4xl md:text-5xl font-extrabold">
              Sản phẩm &amp; giải pháp nổi bật
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Danh sách các hệ thống phần mềm đang được SFB triển khai cho nhà trường,
              cơ quan Nhà nước và doanh nghiệp.
            </p>
          </div>


          {/* Pills filter ngay dưới title */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 mb-14">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2
              ${active
                      ? "bg-[#0870B4] text-white shadow-md"
                      : "bg-[#EAF5FF] text-[#0870B4] hover:bg-[#DCEFFF]"
                    }`}
                >
                  <Icon size={16} />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Grid cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] px-6 lg:px-[290px]">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex w-full h-fit p-6 flex-col items-start gap-6 flex-[1_0_0] rounded-[24px] bg-[var(--Color-7,#FFF)] shadow-[0_8px_30px_0_rgba(0,0,0,0.06)]"
              >
                {/* Image kiểu ảnh: có padding + khung */}
                <div className="w-full">
                  <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                    <div className="relative aspect-[16/7]">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full">
                  <div className="text-xs text-gray-500 mb-2">{product.meta}</div>

                  <h3 className="text-gray-900 font-bold mb-1">
                    {product.name}
                  </h3>

                  <div className="text-[#0870B4] font-semibold text-sm mb-3">
                    {product.tagline}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 w-full">
                    {product.features.slice(0, 4).map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className="text-white fill-[#1D8FCF] flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer giống ảnh: button nhỏ + button xanh */}
                <div className="w-full flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-xs text-gray-500">Giá tham khảo</div>
                    <div className="text-lg font-extrabold text-gray-900">
                      Liên hệ
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="px-5 py-2 rounded-lg bg-[#EAF5FF] text-[#0870B4]
                            font-semibold text-sm hover:bg-[#DCEFFF] transition
                             inline-flex items-center gap-2"
                    >
                      Demo nhanh
                      <img
                        src="/icons/custom/product_media.svg"
                        alt="media"
                        className="w-6 h-6"
                      />
                    </button>


                    <button className="px-5 py-2 rounded-lg bg-[#0870B4] text-white font-semibold text-sm hover:bg-[#075F98] transition inline-flex items-center gap-2">
                      Tìm hiểu thêm <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >


      {/* Testimonials (Carousel y như ảnh) */}
      <section
        className="w-full flex flex-col items-center gap-[60px] py-[120px] overflow-hidden"
        style={{
          background:
            "linear-gradient(237deg, rgba(128, 192, 228, 0.10) 7%, rgba(29, 143, 207, 0.10) 71.94%)",
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-extrabold text-gray-900">
            Khách hàng nói gì về SFB ?
          </h2>

          {/* Track */}
          {/* Carousel */}
          <div className="w-full mt-[60px] px-0 md:px-10">
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((t, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4"
                  >
                    <div className="bg-white rounded-[28px] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.08)] h-full mx-4">
                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-6">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className="text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-gray-700 leading-relaxed text-sm mb-8 line-clamp-4">
                        “{t.quote}”
                      </p>

                      {/* Author */}
                      <div className="text-sm font-semibold text-gray-900">
                        {t.author}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                aria-label={`Đi tới phản hồi ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${current === i ? "w-8 bg-[#1E293B]" : "w-2 bg-[#9CA3AF]"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section id="contact" className="py-[60px] bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#2EABE2] rounded-2xl px-6 py-[120px] text-center flex flex-col items-center gap-[40px]">
              <h2 className="text-white text-3xl md:text-4xl font-extrabold">
                Miễn phí tư vấn
              </h2>

              <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành
                cùng doanh nghiệp bạn trong hành trình chuyển đổi số.
              </p>

              <div className="flex items-center justify-center gap-3">
                <a
                  href="/case-studies"
                  className="px-5 py-2.5 rounded-md border border-white/60 text-white text-xs font-semibold hover:bg-white/10 transition"
                >
                  Xem case studies
                </a>

                <a
                  href="/contact"
                  className="px-5 py-2.5 rounded-md border border-white/60 text-white text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
                >
                  Tư vấn miễn phí ngay
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div >
  );
}
export default ProductsPage;
