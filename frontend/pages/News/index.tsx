"use client";

import {
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Tag,
  Search,
  Filter,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useState } from "react";
import Link from "next/link";

export function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "company" | "product" | "tech"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Danh mục bám theo tin trên sfb.vn
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "company", name: "Tin công ty" },
    { id: "product", name: "Sản phẩm & giải pháp" },
    { id: "tech", name: "Tin công nghệ" },
  ] as const;

  // Tin nổi bật – Hệ thống tuyển sinh đầu cấp
  const featuredNews = {
    id: 1,
    title: "Hệ thống tuyển sinh đầu cấp",
    excerpt:
      "Giải pháp phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    category: "Sản phẩm & giải pháp",
    categoryId: "product" as const,
    date: "07 Tháng 8, 2025",
    author: "SFB Technology",
    readTime: "10 phút đọc",
    views: "1.5K",
    gradient: "from-blue-600 to-cyan-600",
    link: "/news-detail",
  };

  // Danh sách bài viết lấy từ /tin-cong-ty và /tin-cong-nghe (snapshot)
  const news = [
    {
      id: 2,
      title: "Sinh nhật lần thứ 8",
      excerpt:
        "SFB kỷ niệm 8 năm hình thành và phát triển với sự tham gia của Ban lãnh đạo, toàn thể nhân sự và các đối tác thân thiết, đánh dấu chặng đường nỗ lực không ngừng.",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
      category: "Tin công ty",
      categoryId: "company" as const,
      date: "28 Tháng 5, 2025",
      author: "SFB Technology",
      readTime: "6 phút đọc",
      views: "1.2K",
      gradient: "from-purple-600 to-pink-600",
      link: "/news-detail",
    },
    {
      id: 3,
      title: "Báo giá sản phẩm – hệ thống Giáo dục thông minh",
      excerpt:
        "Thông tin báo giá và gói dịch vụ cho hệ thống Giáo dục thông minh của SFB, hỗ trợ nhà trường triển khai dạy và học số một cách hiệu quả.",
      image:
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
      category: "Sản phẩm & giải pháp",
      categoryId: "product" as const,
      date: "08 Tháng 12, 2023",
      author: "SFB Technology",
      readTime: "5 phút đọc",
      views: "980",
      gradient: "from-emerald-600 to-teal-600",
      link: "/news-detail",
    },
    {
      id: 4,
      title: "Hệ thống CSDL quản lý công chứng, chứng thực",
      excerpt:
        "Giải pháp quản lý cơ sở dữ liệu công chứng, chứng thực tập trung, bảo đảm an toàn thông tin và hỗ trợ nghiệp vụ cho các phòng công chứng.",
      image:
        "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?auto=format&fit=crop&w=900&q=80",
      category: "Sản phẩm & giải pháp",
      categoryId: "product" as const,
      date: "16 Tháng 9, 2023",
      author: "SFB Technology",
      readTime: "8 phút đọc",
      views: "1.1K",
      gradient: "from-orange-600 to-amber-600",
      link: "/news-detail",
    },
    {
      id: 5,
      title: "Điều khoản sử dụng app HS2",
      excerpt:
        "Quy định và điều khoản sử dụng ứng dụng HS2, giúp người dùng nắm rõ quyền lợi và trách nhiệm khi sử dụng phần mềm của SFB.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      category: "Tin công nghệ",
      categoryId: "tech" as const,
      date: "08 Tháng 6, 2023",
      author: "SFB Technology",
      readTime: "7 phút đọc",
      views: "860",
      gradient: "from-red-600 to-rose-600",
      link: "/news-detail",
    },
    {
      id: 6,
      title: "Mã hóa tuyến tính Hamming",
      excerpt:
        "Giới thiệu khái niệm và ứng dụng của mã Hamming trong hệ thống truyền tin, giúp phát hiện và sửa lỗi dữ liệu.",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
      category: "Tin công nghệ",
      categoryId: "tech" as const,
      date: "06 Tháng 4, 2023",
      author: "SFB Technology",
      readTime: "12 phút đọc",
      views: "1.4K",
      gradient: "from-indigo-600 to-purple-600",
      link: "/news-detail",
    },
    {
      id: 7,
      title:
        "Công ty cổ phần công nghệ SFB đăng ký thành công hệ thống mã số DUNS",
      excerpt:
        "SFB chính thức đăng ký thành công mã số DUNS, khẳng định uy tín và chuẩn hóa thông tin doanh nghiệp trên hệ thống quốc tế.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      category: "Tin công ty",
      categoryId: "company" as const,
      date: "Năm 2020",
      author: "SFB Technology",
      readTime: "4 phút đọc",
      views: "740",
      gradient: "from-cyan-600 to-blue-600",
      link: "/news-detail",
    },
  ];

  // Tự động tính số lượng bài theo từng category
  const categoriesWithCount = categories.map((cat) => {
    if (cat.id === "all") {
      return { ...cat, count: news.length };
    }
    const count = news.filter(
      (n) => n.categoryId === cat.id,
    ).length;
    return { ...cat, count };
  });

  // Lọc theo danh mục + ô search
  const filteredNews = news.filter((article) => {
    const matchCategory =
      selectedCategory === "all" ||
      article.categoryId === selectedCategory;

    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q);

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <TrendingUp className="text-cyan-400" size={20} />
              <span className="text-white font-semibold text-sm">
                TIN TỨC &amp; BLOG
              </span>
            </div>

            <h1 className="text-white mb-8 text-5xl md:text-6xl">
              Cập nhật
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                công nghệ &amp; hoạt động SFB
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10">
              Tin công ty, sản phẩm và tin công nghệ mới nhất từ
              SFB Technology
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-[88px] z-40 backdrop-blur-lg bg-white/95">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter
              className="text-gray-600 flex-shrink-0"
              size={20}
            />
            {categoriesWithCount.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    category.id as typeof selectedCategory,
                  )
                }
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-gray-900 mb-2">Nổi bật</h2>
            <p className="text-gray-600">
              Bài viết được quan tâm nhất
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group hover:shadow-3xl transition-all duration-500">
            {/* Image */}
            <div className="relative h-96 lg:h-full overflow-hidden">
              <ImageWithFallback
                src={featuredNews.image}
                alt={featuredNews.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${featuredNews.gradient} opacity-20`}
              />

              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <span
                  className={`px-5 py-2 bg-gradient-to-r ${featuredNews.gradient} text-white rounded-full text-sm font-semibold shadow-lg`}
                >
                  {featuredNews.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-10 lg:p-14">
              <h3 className="text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {featuredNews.title}
              </h3>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {featuredNews.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{featuredNews.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{featuredNews.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{featuredNews.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{featuredNews.views} lượt xem</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/news-detail"
                className={`group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${featuredNews.gradient} text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-semibold`}
              >
                Đọc bài viết
                <ArrowRight
                  className="group-hover/btn:translate-x-2 transition-transform"
                  size={20}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-gray-900 mb-2">
              Bài viết mới nhất
            </h2>
            <p className="text-gray-600">
              Cập nhật tin công ty, sản phẩm và công nghệ từ SFB
            </p>
          </div>

          {filteredNews.length === 0 ? (
            <div className="text-center text-gray-500">
              Không có bài viết phù hợp với từ khóa / bộ lọc
              hiện tại.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-tr ${article.gradient} opacity-20`}
                    />

                    {/* Category */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-4 py-2 bg-gradient-to-r ${article.gradient} text-white rounded-full text-xs font-semibold shadow-lg`}
                      >
                        {article.category}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110">
                        <Bookmark
                          size={16}
                          className="text-gray-700"
                        />
                      </button>
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110">
                        <Share2
                          size={16}
                          className="text-gray-700"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h4>

                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={14} />
                          <span>125</span>
                        </div>
                      </div>

                      <Link
                        href="/news-detail"
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 group/link"
                      >
                        Đọc thêm
                        <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More – có thể sau này nối API / pagination */}
          <div className="text-center mt-16">
            <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 inline-flex items-center gap-3 font-semibold">
              Xem thêm bài viết
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter giữ nguyên */}
      <section className="py-28 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <Tag className="text-cyan-400" size={20} />
              <span className="text-white font-semibold text-sm">
                ĐĂNG KÝ NHẬN TIN
              </span>
            </div>

            <h2 className="text-white mb-6">
              Đăng ký nhận bản tin
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Nhận tin tức công nghệ mới nhất, case study và
              tips hữu ích mỗi tuần
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all"
              />
              <button className="px-10 py-5 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold whitespace-nowrap">
                Đăng ký ngay
              </button>
            </div>

            <p className="text-sm text-blue-200 mt-6">
              🔒 Chúng tôi cam kết bảo mật thông tin của bạn
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default NewsPage;
