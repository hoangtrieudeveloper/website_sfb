import {
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Cpu,
  DollarSign,
  Zap,
} from "lucide-react";
import Link from "next/link";

export function Features() {
  const purposeItems = [
    {
      title: "Chúng tôi hiện diện để",
      text: "Cung cấp hệ thống hoạt động hiệu quả 24/7, đáp ứng mọi nghiệp vụ công nghệ thông tin.",
    },
    {
      title: "Xây dựng niềm tin",
      text: "Lấy niềm tin khách hàng và uy tín thương hiệu làm triết lý kinh doanh.",
    },
    {
      title: "Giá trị của nhân viên",
      text: "Đề cao trung thực – kinh nghiệm – sáng tạo – trách nhiệm.",
    },
  ];

  const advantages = [
    {
      icon: Award,
      title: "Nhiều năm kinh nghiệm",
      text: "Thực hiện hàng trăm dự án từ nhỏ tới lớn, phức tạp.",
    },
    {
      icon: Users,
      title: "Nhân viên nhiệt huyết",
      text: "Đội ngũ trẻ, chuyên sâu, giàu tinh thần trách nhiệm.",
    },
    {
      icon: Zap,
      title: "Dự án lớn liên tục hoàn thành",
      text: "Đáp ứng yêu cầu khó, nghiệp vụ đa ngành.",
    },
    {
      icon: DollarSign,
      title: "Chi phí hợp lý",
      text: "Tổ chức Agile tinh gọn – tối ưu chi phí vận hành.",
    },
    {
      icon: Cpu,
      title: "Làm chủ công nghệ",
      text: "Hạ tầng server riêng, khả năng mở rộng tức thời.",
    },
    {
      icon: Shield,
      title: "Tích lũy niềm tin",
      text: "Đồng hành lâu dài cùng khách hàng trong suốt vòng đời sản phẩm.",
    },
  ];

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

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-blue-100 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 right-1/4 w-72 h-72 rounded-full bg-purple-100 blur-3xl opacity-40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* DIGITAL TRANSFORMATION BANNER */}
        <div className="mb-16 animate-fade-in-up">
          <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gray-900 shadow-[0_24px_60px_rgba(15,23,42,0.45)]">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1526491109672-74740652b963?auto=format&fit=crop&w=1600&q=80"
                alt="Digital Transformation"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-blue-900/75 to-purple-900/85" />
            </div>

            <div className="relative px-6 py-10 md:px-12 md:py-12 lg:px-16 lg:py-14 flex flex-col lg:flex-row gap-10 lg:gap-14">
              {/* LEFT – PROCESS */}
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-wide text-blue-100 uppercase">
                    Quy trình dịch vụ chuyển đổi số
                  </span>
                </div>

                {/* Title & Intro */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-3 md:mb-4">
                  Chuyển đổi số không bắt đầu từ phần mềm{" "}
                  <span className="block text-xl md:text-2xl text-blue-100 font-normal">
                    mà từ hiệu quả thực tế của doanh nghiệp.
                  </span>
                </h2>
                <p className="text-sm md:text-base text-blue-100 max-w-xl mb-6">
                  SFB giúp doanh nghiệp vận hành thông minh,
                  giảm chi phí hạ tầng, tăng năng suất và bảo
                  mật dữ liệu an toàn tuyệt đối. Chúng tôi không
                  chỉ xây phần mềm –{" "}
                  <span className="font-semibold">
                    chúng tôi xây hiệu quả.
                  </span>
                </p>

                {/* 4-step process */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/60 text-[11px] font-semibold text-emerald-300">
                      1
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-50">
                        Tư vấn &amp; Đánh giá hiện trạng
                      </div>
                      <p className="text-xs md:text-sm text-blue-100/90">
                        Phân tích nhu cầu, xác định điểm nghẽn
                        trong hệ thống hiện tại.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/60 text-[11px] font-semibold text-emerald-300">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-50">
                        Thiết kế giải pháp phù hợp
                      </div>
                      <p className="text-xs md:text-sm text-blue-100/90">
                        Xây dựng kiến trúc số hoá và mô hình
                        triển khai cụ thể.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/60 text-[11px] font-semibold text-emerald-300">
                      3
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-50">
                        Triển khai &amp; Tích hợp hệ thống
                      </div>
                      <p className="text-xs md:text-sm text-blue-100/90">
                        Lắp đặt, cấu hình và tối ưu vận hành hạ
                        tầng công nghệ.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/60 text-[11px] font-semibold text-emerald-300">
                      4
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-50">
                        Đào tạo &amp; Hỗ trợ vận hành
                      </div>
                      <p className="text-xs md:text-sm text-blue-100/90">
                        Chuyển giao kiến thức và hỗ trợ kỹ thuật
                        24/7.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 px-5 py-3 text-xs md:text-sm font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Nhận tư vấn miễn phí
                    <ArrowRight size={16} className="ml-0.5" />
                  </Link>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-5 py-3 text-xs md:text-sm font-semibold text-blue-50 hover:bg-white/10 transition-all"
                  >
                    Khám phá giải pháp
                  </Link>
                </div>
              </div>

              {/* RIGHT – TRUST & CASE STUDIES */}
              <div className="w-full lg:w-[40%] space-y-4">
                {/* Trusted by */}
                <div className="rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-blue-50 backdrop-blur">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wide text-blue-200">
                      Được tin tưởng bởi các tổ chức hàng đầu
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      Nam Việt JSC
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      Hoàng Khánh
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      Khoso.vn
                    </span>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/5 border border-emerald-300/40 px-3 py-3 text-blue-50 text-center">
                    <div className="text-xs uppercase tracking-wide text-emerald-200 mb-1">
                      Hiệu quả vận hành
                    </div>
                    <div className="text-xl font-semibold text-emerald-300">
                      +40%
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-rose-300/40 px-3 py-3 text-blue-50 text-center">
                    <div className="text-xs uppercase tracking-wide text-rose-200 mb-1">
                      Chi phí IT
                    </div>
                    <div className="text-xl font-semibold text-rose-300">
                      -30%
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-cyan-300/40 px-3 py-3 text-blue-50 text-center">
                    <div className="text-xs uppercase tracking-wide text-cyan-200 mb-1">
                      Uptime hệ thống
                    </div>
                    <div className="text-xl font-semibold text-cyan-300">
                      99.9%
                    </div>
                  </div>
                </div>

                {/* Case study list */}
                <div className="rounded-2xl bg-white/5 border border-white/15 px-4 py-4 text-blue-50 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-blue-200 mb-2">
                    Một số case study tiêu biểu
                  </div>
                  <ul className="space-y-1.5 text-[11px] md:text-xs text-blue-100">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <span>
                        Triển khai hệ thống ERP cho doanh nghiệp
                        sản xuất.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <span>
                        Tối ưu hoá hạ tầng cho ngân hàng và đơn
                        vị tài chính.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <span>
                        Bảo mật và giám sát mạng cho tập đoàn
                        dầu khí.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide text-blue-700 uppercase">
              Giới thiệu SFB
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Chúng tôi là ai?
          </h2>
          <p className="text-gray-600 text-lg mt-3">
            Đơn vị phát triển phần mềm với kinh nghiệm thực
            chiến, chuyên sâu công nghệ và định hướng xây dựng
            hệ thống bền vững.
          </p>
        </div>

        {/* MAIN GRID – INTRO + PURPOSE + LEADERS */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* INTRO BLOCK + WHY SFB */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-100/40 p-8 animate-fade-in-up">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Giới thiệu SFB
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              SFB với kinh nghiệm qua nhiều dự án lớn nhỏ, tự
              tin xử lý các bài toán phần mềm phức tạp, yêu cầu
              chuyên môn sâu. Đội ngũ trẻ – đam mê – trách nhiệm
              giúp xây dựng hệ thống ổn định, hiệu quả và tối ưu
              chi phí.
            </p>

            {/* 3 bullet ngắn */}
            <div className="space-y-3 mb-6">
              {[
                "Tự tin trong các dự án phức tạp",
                "Tối ưu quy trình và chi phí",
                "Đồng hành trọn vòng đời sản phẩm",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3"
                >
                  <CheckCircle
                    size={18}
                    className="text-cyan-500"
                  />
                  <span className="text-gray-800 text-sm">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* WHY SFB GỘP VÀO TRONG CARD NÀY */}
            <div className="mt-2 pt-5 border-t border-blue-100/70">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold tracking-[0.25em] text-blue-600 uppercase">
                  Why SFB
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {advantages.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50/60 border border-blue-100 px-3 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center flex-shrink-0">
                        <Icon size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[13px] font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center gap-2 text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all">
              Xem chi tiết
              <ArrowRight size={16} />
            </button>
          </div>

          {/* PURPOSE BLOCK + LEADERS COMPACT */}
          <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8 rounded-3xl shadow-xl border border-blue-800 animate-fade-in-up md:animate-fade-in-up-delay">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-blue-200 mb-1">
                  Giá trị & Mục tiêu
                </p>
                <h3 className="text-xl font-semibold">
                  SFB làm gì?
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Shield size={24} className="text-cyan-300" />
              </div>
            </div>

            <div className="space-y-5 mb-5">
              {purposeItems.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle
                      size={14}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-blue-100 mb-6">
              <Users size={15} />
              <span>
                Đội ngũ SFB kết hợp chuyên môn sâu và tinh thần
                dịch vụ tận tâm.
              </span>
            </div>

            {/* LEADERS – DÀN NGANG, GỌN GÀNG */}
            <div className="pt-5 border-t border-blue-800/40">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-blue-200 uppercase mb-4">
                Ban lãnh đạo
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaders.map((leader) => (
                  <div
                    key={leader.email}
                    className="flex items-center gap-3 group p-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 flex-shrink-0">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-xs leading-relaxed">
                      <p className="text-white font-semibold text-sm">
                        {leader.name}
                      </p>
                      <p className="text-cyan-300 text-[11px] mb-1">
                        {leader.position}
                      </p>
                      <p className="text-blue-100 text-[11px]">
                        <span className="text-blue-200">
                          Email:
                        </span>{" "}
                        {leader.email}
                      </p>
                      <p className="text-blue-100 text-[11px]">
                        <span className="text-blue-200">
                          SĐT:
                        </span>{" "}
                        {leader.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}