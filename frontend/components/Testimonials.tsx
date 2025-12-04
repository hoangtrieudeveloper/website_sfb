import { Quote, Star, ArrowRight, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote:
        "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.",
      author: "Ông Nguyễn Hoàng Chinh",
      position: "CEO",
      company: "Công ty Hoàng Khánh",
      industry: "Xây dựng & Bất động sản",
      avatar:
        "https://sfb.vn/wp-content/uploads/2020/05/IMG_0486-scaled-300x300.jpg",
      rating: 5,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      quote:
        "Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.",
      author: "Ông Vũ Kim Trung",
      position: "CEO",
      company: "khoso.vn",
      industry: "Thương mại điện tử & Kho vận",
      avatar:
        "https://sfb.vn/wp-content/uploads/2020/06/98471888_3322644664415254_3076656250046382080_o-300x300.jpg",
      rating: 5,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      quote:
        "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.",
      author: "Ông Nguyễn Khánh Tùng",
      position: "CEO",
      company: "Công ty Nam Việt",
      industry: "Logistics & Dịch vụ",
      avatar:
        "https://sfb.vn/wp-content/uploads/2020/06/vk-300x300.jpg",
      rating: 5,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Decorative Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 mb-6 shadow-lg">
            <Award className="text-blue-600" size={18} />
            <span className="text-sm font-semibold text-blue-700">
              Đánh giá từ khách hàng
            </span>
          </div>
          <h2 className="text-gray-900 mb-6">
            Khách hàng nói gì về SFB?
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Sự hài lòng và niềm tin của khách hàng là thước đo
            thành công, cũng là động lực để chúng tôi không
            ngừng nâng cấp sản phẩm và dịch vụ.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0,
              }}
            >
              {/* Gradient Border on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-6">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                  >
                    <Quote className="text-white" size={24} />
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map(
                    (_, i) => (
                      <div
                        key={i}
                        className="transform group-hover:scale-110 transition-transform"
                        style={{
                          transitionDelay: `${i * 50}ms`,
                        }}
                      >
                        <Star
                          className="text-yellow-400 fill-yellow-400"
                          size={18}
                        />
                      </div>
                    ),
                  )}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed mb-8 italic text-lg">
                  “{testimonial.quote}”
                </p>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6 group-hover:via-blue-300 transition-colors" />

                {/* Reviewer Info */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-blue-200 transition-colors shadow-lg">
                      <ImageWithFallback
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${testimonial.gradient} rounded-full border-2 border-white flex items-center justify-center shadow-lg`}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div
                      className={`font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:${testimonial.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all mb-1`}
                    >
                      {testimonial.author}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.position}
                    </div>
                  </div>
                </div>

                {/* Company & Industry */}
                <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100 group-hover:border-blue-100 transition-colors mt-auto">
                  <div>
                    <div
                      className={`font-semibold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}
                    >
                      {testimonial.company}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.industry}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

          <div className="relative z-10 p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white text-sm font-semibold">
                  Nhanh lên! Liên lạc với chúng tôi ngay và nhận
                  được
                </span>
              </div>
              <h3 className="text-white mb-6">
                MIỄN PHÍ TƯ VẤN LẦN ĐẦU
              </h3>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Đặt lịch tư vấn miễn phí với chuyên gia của SFB
                và khám phá cách chúng tôi có thể đồng hành cùng
                doanh nghiệp bạn trong hành trình chuyển đổi số.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold"
                >
                  Tư vấn miễn phí ngay
                  <ArrowRight
                    className="group-hover:translate-x-2 transition-transform"
                    size={20}
                  />
                </Link>
                  <Link
                    href="/solutions"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all font-semibold"
                >
                  Xem case studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}