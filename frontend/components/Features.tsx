"use client";

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
import { ScrollAnimation } from "./ScrollAnimation";

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
        <ScrollAnimation variant="fade-up" className="mb-20">
          <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gray-900 shadow-[0_24px_60px_rgba(15,23,42,0.45)] group hover:shadow-[0_40px_80px_rgba(15,23,42,0.6)] transition-shadow duration-500">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1526491109672-74740652b963?auto=format&fit=crop&w=1600&q=80"
                alt="Digital Transformation"
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-blue-900/80 to-purple-900/90" />
            </div>

            <div className="relative px-6 py-12 md:px-12 md:py-14 lg:px-16 lg:py-16 flex flex-col lg:flex-row gap-10 lg:gap-14">
              {/* LEFT – PROCESS */}
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-wide text-blue-100 uppercase">
                    Quy trình dịch vụ chuyển đổi số
                  </span>
                </div>

                {/* Title & Intro */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4 leading-tight">
                  Chuyển đổi số không bắt đầu từ phần mềm{" "}
                  <span className="block text-xl md:text-2xl text-blue-100 font-normal mt-2">
                    mà từ hiệu quả thực tế của doanh nghiệp.
                  </span>
                </h2>
                <p className="text-sm md:text-base text-blue-100 max-w-xl mb-8 leading-relaxed">
                  SFB giúp doanh nghiệp vận hành thông minh,
                  giảm chi phí hạ tầng, tăng năng suất và bảo
                  mật dữ liệu an toàn tuyệt đối. Chúng tôi không
                  chỉ xây phần mềm –{" "}
                  <span className="font-semibold text-white">
                    chúng tôi xây hiệu quả.
                  </span>
                </p>

                {/* 4-step process */}
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Tư vấn & Đánh giá hiện trạng",
                      desc: "Phân tích nhu cầu, xác định điểm nghẽn trong hệ thống hiện tại.",
                    },
                    {
                      step: "2",
                      title: "Thiết kế giải pháp phù hợp",
                      desc: "Xây dựng kiến trúc số hoá và mô hình triển khai cụ thể.",
                    },
                    {
                      step: "3",
                      title: "Triển khai & Tích hợp hệ thống",
                      desc: "Lắp đặt, cấu hình và tối ưu vận hành hạ tầng công nghệ.",
                    },
                    {
                      step: "4",
                      title: "Đào tạo & Hỗ trợ vận hành",
                      desc: "Chuyển giao kiến thức và hỗ trợ kỹ thuật 24/7.",
                    },
                  ].map((item, idx) => (
                    <ScrollAnimation key={item.step} variant="slide-right" delay={idx * 0.1} className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/60 text-xs font-bold text-emerald-300 shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-50 mb-0.5">
                          {item.title}
                        </div>
                        <p className="text-xs md:text-sm text-blue-100/80">
                          {item.desc}
                        </p>
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 px-6 py-3.5 text-xs md:text-sm font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-white/10"
                  >
                    Nhận tư vấn miễn phí
                    <ArrowRight size={16} className="ml-0.5" />
                  </Link>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-xs md:text-sm font-semibold text-blue-50 hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    Khám phá giải pháp
                  </Link>
                </div>
              </div>

              {/* RIGHT – TRUST & CASE STUDIES */}
              <div className="w-full lg:w-[40%] space-y-6">
                {/* Trusted by */}
                <ScrollAnimation variant="fade-in" delay={0.4}>
                  <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4 text-blue-50 backdrop-blur shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wide text-blue-200">
                        Được tin tưởng bởi các tổ chức hàng đầu
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
                      <span className="rounded-full bg-white/10 px-3 py-1.5 border border-white/5">
                        Nam Việt JSC
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1.5 border border-white/5">
                        Hoàng Khánh
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1.5 border border-white/5">
                        Khoso.vn
                      </span>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-4">
                  <ScrollAnimation variant="scale-up" delay={0.5} className="rounded-2xl bg-white/5 border border-emerald-300/30 px-3 py-4 text-blue-50 text-center backdrop-blur hover:bg-emerald-500/10 transition-colors">
                    <div className="text-[10px] uppercase tracking-wide text-emerald-200 mb-2">
                      Hiệu quả
                    </div>
                    <div className="text-2xl font-bold text-emerald-300">
                      +40%
                    </div>
                  </ScrollAnimation>
                  <ScrollAnimation variant="scale-up" delay={0.6} className="rounded-2xl bg-white/5 border border-rose-300/30 px-3 py-4 text-blue-50 text-center backdrop-blur hover:bg-rose-500/10 transition-colors">
                    <div className="text-[10px] uppercase tracking-wide text-rose-200 mb-2">
                      Chi phí IT
                    </div>
                    <div className="text-2xl font-bold text-rose-300">
                      -30%
                    </div>
                  </ScrollAnimation>
                  <ScrollAnimation variant="scale-up" delay={0.7} className="rounded-2xl bg-white/5 border border-cyan-300/30 px-3 py-4 text-blue-50 text-center backdrop-blur hover:bg-cyan-500/10 transition-colors">
                    <div className="text-[10px] uppercase tracking-wide text-cyan-200 mb-2">
                      Uptime
                    </div>
                    <div className="text-2xl font-bold text-cyan-300">
                      99.9%
                    </div>
                  </ScrollAnimation>
                </div>

                {/* Case study list */}
                <ScrollAnimation variant="fade-in" delay={0.8} className="rounded-2xl bg-white/5 border border-white/15 px-5 py-5 text-blue-50 backdrop-blur shadow-lg">
                  <div className="text-xs uppercase tracking-wide text-blue-200 mb-3">
                    Một số case study tiêu biểu
                  </div>
                  <ul className="space-y-3 text-xs text-blue-100">
                    <li className="flex gap-3 items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
                      <span>
                        Triển khai hệ thống ERP cho doanh nghiệp
                        sản xuất.
                      </span>
                    </li>
                    <li className="flex gap-3 items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
                      <span>
                        Tối ưu hoá hạ tầng cho ngân hàng và đơn
                        vị tài chính.
                      </span>
                    </li>
                    <li className="flex gap-3 items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
                      <span>
                        Bảo mật và giám sát mạng cho tập đoàn
                        dầu khí.
                      </span>
                    </li>
                  </ul>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* TITLE */}
        <ScrollAnimation variant="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide text-blue-700 uppercase">
              Giới thiệu SFB
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Chúng tôi là ai?
          </h2>
          <p className="text-gray-600 text-lg mt-3">
            Đơn vị phát triển phần mềm với kinh nghiệm thực
            chiến, chuyên sâu công nghệ và định hướng xây dựng
            hệ thống bền vững.
          </p>
        </ScrollAnimation>

        {/* MAIN GRID – INTRO + PURPOSE + LEADERS */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* INTRO BLOCK + WHY SFB */}
          <ScrollAnimation variant="fade-up" className="bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-100/40 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
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
                  <span className="text-gray-800 text-sm font-medium">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* WHY SFB GỘP VÀO TRONG CARD NÀY */}
            <div className="mt-8 pt-6 border-t border-blue-100/70">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold tracking-[0.25em] text-blue-600 uppercase">
                  Why SFB
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {advantages.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <ScrollAnimation variant="fade-up" delay={index * 0.05}
                      key={item.title}
                      className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50/60 border border-blue-100 px-4 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <Icon size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[13px] font-bold text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </ScrollAnimation>
                  );
                })}
              </div>
            </div>

            <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center gap-2 text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all">
              Xem chi tiết
              <ArrowRight size={16} />
            </button>
          </ScrollAnimation>

          {/* PURPOSE BLOCK + LEADERS COMPACT */}
          <ScrollAnimation variant="fade-up" delay={0.2} className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8 rounded-3xl shadow-xl border border-blue-800 flex flex-col h-full">
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

            <div className="space-y-5 mb-8">
              {purposeItems.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle
                      size={14}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5 text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-blue-100 mb-8 bg-blue-900/40 p-3 rounded-lg border border-blue-500/30">
              <Users size={15} />
              <span>
                Đội ngũ SFB kết hợp chuyên môn sâu và tinh thần
                dịch vụ tận tâm.
              </span>
            </div>

            {/* LEADERS – DÀN NGANG, GỌN GÀNG */}
            <div className="mt-auto pt-6 border-t border-blue-800/40">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-blue-200 uppercase mb-4">
                Ban lãnh đạo
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {leaders.map((leader, idx) => (
                  <ScrollAnimation variant="fade-in" delay={0.3 + (idx * 0.1)}
                    key={leader.email}
                    className="flex items-center gap-3 group p-2.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 flex-shrink-0 shadow-lg">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-xs leading-relaxed overflow-hidden">
                      <p className="text-white font-bold text-sm truncate">
                        {leader.name}
                      </p>
                      <p className="text-cyan-300 text-[11px] mb-0.5 truncate uppercase tracking-wider font-medium">
                        {leader.position}
                      </p>
                      <p className="text-blue-200 text-[10px] truncate">
                        {leader.email}
                      </p>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}