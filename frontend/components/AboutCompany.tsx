"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollAnimation } from "./ScrollAnimation";

export function AboutCompany() {
  const slides = [
    {
      title: "Tư vấn & Đánh giá hiện trạng",
      description:
        "Chúng tôi phân tích toàn diện hiện trạng vận hành, dữ liệu và quy trình của doanh nghiệp. Xác định điểm mạnh – điểm nghẽn – rủi ro tiềm ẩn để đưa ra bức tranh tổng thể.",
      buttonText: "Nhận tư vấn ngay",
      buttonLink: "/contact",
      image: "/images/card-consulting.jpg",
    },
    {
      title: "Thiết kế giải pháp phù hợp",
      description:
        "Xây dựng giải pháp tối ưu dựa trên nhu cầu thực tế và đặc thù ngành. Đảm bảo tính linh hoạt, khả năng mở rộng và hiệu quả vận hành lâu dài.",
      buttonText: "Xem case studies",
      buttonLink: "/products",
      image: "/images/card-solution.png",
    },
    {
      title: "Triển khai & Tích hợp hệ thống",
      description:
        "Thực hiện triển khai chuyên nghiệp, đảm bảo tiến độ và chất lượng. Kết nối liền mạch với các hệ thống hiện có để tối ưu vận hành tổng thể.",
      buttonText: "Tìm hiểu thêm",
      buttonLink: "/solutions",
      image: "/images/card-implementation.png",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Header Section */}
        <ScrollAnimation
          variant="fade-up"
          className="text-center max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] leading-tight mb-6">
            Chuyển đổi số{" "}
            <span className="text-[#0F172A]">không bắt đầu từ phần mềm</span> mà{" "}
            <span className="text-[#0F172A]">từ hiệu quả thực tế</span> của doanh nghiệp.
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            SFB giúp doanh nghiệp vận hành thông minh, giảm chi phí hạ tầng, tăng
            năng suất và bảo mật dữ liệu an toàn tuyệt đối.
          </p>
        </ScrollAnimation>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center">
          {slides.map((slide, index) => (
            <ScrollAnimation
              key={index}
              variant="fade-up"
              delay={index * 0.1}
              className="w-[410px]"
            >
              <div
                className="w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-gray-100 flex flex-col overflow-hidden"
                style={{ height: "523px", minHeight: "523px", maxHeight: "523px" }}
              >

                {/* Card Image */}
                <div
                  className="relative w-full mb-6 overflow-hidden flex-shrink-0"
                  style={{ height: "234px", borderRadius: "8px" }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="flex-1 flex flex-col text-center">
                  <h3
                    className="mb-4"
                    style={{
                      color: "#0F172A",
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: "20px",
                      fontWeight: 600,
                      lineHeight: "30px",
                    }}
                  >
                    {slide.title}
                  </h3>

                  <p
                    className="mb-6 flex-1 line-clamp-4"
                    style={{
                      color: "#0F172A",
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "26px",
                    }}
                  >
                    {slide.description}
                  </p>

                  {/* New Gradient Button */}
                  <Link
                    href={slide.buttonLink}
                    className="mt-auto flex justify-center items-center w-full h-12 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                      borderRadius: "8px",
                    }}
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
