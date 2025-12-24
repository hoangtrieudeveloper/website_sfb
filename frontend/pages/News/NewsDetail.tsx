"use client";

import {
  Calendar,
  User,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  Quote,
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";

export function NewsDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(125);
  const [isLiked, setIsLiked] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  // Mock article – sau này bạn có thể thay bằng dữ liệu từ slug / id
  const article = {
    title:
      "SFB Technology triển khai thành công hệ thống AI cho tập đoàn tài chính hàng đầu",
    subtitle:
      "Giải pháp AI/ML giúp tăng 85% hiệu quả phân tích rủi ro và giảm 40% thời gian xử lý giao dịch",
    category: "Case Study",
    author: {
      name: "Nguyễn Văn A",
      position: "Senior Solution Architect",
      avatar:
        "https://images.unsplash.com/photo-1589114207353-1fc98a11070b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRhbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY0NTA2ODE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "15+ năm kinh nghiệm trong lĩnh vực AI/ML và Data Science, từng làm việc cho các tập đoàn Fortune 500.",
      linkedin: "#",
    },
    date: "25 Tháng 11, 2024",
    readTime: "8 phút đọc",
    views: "2.5K",
    image:
      "https://images.unsplash.com/photo-1744640326166-433469d102f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY0NTA5MzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  };

  const tableOfContents = [
    { id: "overview", title: "Tổng quan dự án" },
    { id: "challenge", title: "Thách thức" },
    { id: "solution", title: "Giải pháp" },
    { id: "implementation", title: "Triển khai" },
    { id: "results", title: "Kết quả" },
    { id: "conclusion", title: "Kết luận" },
  ];

  const relatedArticles = [
    {
      id: 1,
      title: "Top 5 xu hướng Cloud Computing năm 2024",
      image:
        "https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?auto=format&fit=crop&w=1080&q=80",
      category: "Xu hướng",
      readTime: "6 phút đọc",
      gradient: "from-[#006FB3] to-[#0088D9]",
    },
    {
      id: 2,
      title: "Bảo mật dữ liệu trong kỷ nguyên số",
      image:
        "https://images.unsplash.com/photo-1744640326166-433469d102f2?auto=format&fit=crop&w=1080&q=80",
      category: "Tips & Tricks",
      readTime: "10 phút đọc",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      id: 3,
      title:
        "AI & Machine Learning: Từ lý thuyết đến thực tiễn",
      image:
        "https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?auto=format&fit=crop&w=1080&q=80",
      category: "Tin công nghệ",
      readTime: "9 phút đọc",
      gradient: "from-emerald-600 to-teal-600",
    },
  ];

  const tags = [
    "AI/ML",
    "Fintech",
    "Digital Transformation",
    "Case Study",
    "Big Data",
    "Cloud Computing",
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (totalHeight <= 0) {
        setReadProgress(0);
        return;
      }
      const progress = (window.scrollY / totalHeight) * 100;
      setReadProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200/60 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#006FB3] via-[#00B4D8] to-[#8B5CF6] transition-all"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-50 via-[#E6F4FF] to-[#D6EEFF] overflow-hidden">
        {/* grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:18px_28px]" />
        {/* blobs */}
        <div className="absolute -top-24 -right-10 w-80 h-80 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8 text-gray-500">
            <a
              href="/news"
              className="text-gray-600 hover:text-[#006FB3] transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Tin tức
            </a>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-400">
              {article.category}
            </span>
          </nav>

          <div className="max-w-6xl">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-full text-sm font-semibold shadow-lg mb-6">
              <TrendingUp size={16} />
              {article.category}
            </div>

            {/* Title */}
            <h1 className="text-gray-900 mb-6 max-w-5xl text-3xl md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-4xl leading-relaxed">
              {article.subtitle}
            </p>

            {/* Meta + social */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] border-2 border-white shadow-lg overflow-hidden">
                    <ImageWithFallback
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {article.author.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {article.author.position}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{article.views} lượt xem</span>
                  </div>
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${isLiked
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-white border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600"
                    }`}
                >
                  <Heart
                    size={18}
                    className={isLiked ? "fill-red-600" : ""}
                  />
                  <span>{likes}</span>
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`px-4 py-2.5 rounded-xl border-2 transition-all ${isBookmarked
                    ? "bg-[#E6F4FF] border-[#006FB3] text-[#006FB3]"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#006FB3] hover:text-[#006FB3]"
                    }`}
                >
                  <Bookmark
                    size={18}
                    className={
                      isBookmarked ? "fill-[#006FB3]" : ""
                    }
                  />
                </button>

                <div className="hidden md:flex items-center gap-2 ml-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1877F2] text-white hover:shadow-lg transition-all transform hover:scale-105">
                    <Facebook size={18} />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1DA1F2] text-white hover:shadow-lg transition-all transform hover:scale-105">
                    <Twitter size={18} />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0A66C2] text-white hover:shadow-lg transition-all transform hover:scale-105">
                    <Linkedin size={18} />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                    <LinkIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container mx-auto px-6 -mt-10 relative z-20 mb-20">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <ImageWithFallback
            src={article.image}
            alt={article.title}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />

          {/* small label on image */}
          <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm flex items-center gap-2">
            <Eye size={14} />
            <span>{article.views} lượt xem</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-28">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Table of Contents - Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="bg-gradient-to-br from-[#E6F4FF] to-white border-2 border-[#006FB3]/15 rounded-2xl p-6">
                <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#006FB3] to-[#0088D9] rounded-full" />
                  Mục lục
                </h3>
                <nav className="space-y-3 text-sm">
                  {tableOfContents.map((item, index) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="group flex items-start gap-3 text-gray-600 hover:text-[#006FB3] transition-all py-1.5"
                    >
                      <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-[#006FB3] group-hover:to-[#0088D9] flex items-center justify-center flex-shrink-0 transition-all">
                        <span className="text-xs font-semibold group-hover:text-white">
                          {index + 1}
                        </span>
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform">
                        {item.title}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Share Widget */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <h4 className="text-gray-900 mb-4">
                  Chia sẻ bài viết
                </h4>
                <div className="space-y-2 text-sm">
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-xl hover:shadow-lg transition-all">
                    <Facebook size={18} />
                    <span className="font-medium">
                      Facebook
                    </span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#1DA1F2] text-white rounded-xl hover:shadow-lg transition-all">
                    <Twitter size={18} />
                    <span className="font-medium">Twitter</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#0A66C2] text-white rounded-xl hover:shadow-lg transition-all">
                    <Linkedin size={18} />
                    <span className="font-medium">
                      LinkedIn
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-9">
            <div className="prose prose-lg max-w-none">
              {/* Overview */}
              <div id="overview" className="mb-16 scroll-mt-32">
                <h2 className="text-gray-900 mb-6">
                  Tổng quan dự án
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Trong bối cảnh ngành tài chính đang chuyển
                  mình mạnh mẽ với công nghệ số, một tập đoàn
                  tài chính hàng đầu Việt Nam đã hợp tác cùng
                  SFB Technology để xây dựng hệ thống phân tích
                  rủi ro và xử lý giao dịch thông minh dựa trên
                  AI/ML. Dự án này đánh dấu bước đột phá quan
                  trọng trong chiến lược chuyển đổi số của khách
                  hàng.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Với quy mô triển khai lên đến 50+ chi nhánh và
                  hơn 1000 nhân viên sử dụng hàng ngày, hệ thống
                  AI mới đã mang lại những kết quả vượt ngoài kỳ
                  vọng, giúp tăng 85% hiệu quả trong phân tích
                  rủi ro và giảm 40% thời gian xử lý giao dịch.
                </p>

                {/* Stats Card */}
                <div className="grid md:grid-cols-3 gap-6 my-10 not-prose">
                  <div className="bg-gradient-to-br from-[#006FB3] to-[#0088D9] rounded-2xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">
                      85%
                    </div>
                    <div className="text-white/90">
                      Tăng hiệu quả phân tích
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">
                      40%
                    </div>
                    <div className="text-white/90">
                      Giảm thời gian xử lý
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">
                      50+
                    </div>
                    <div className="text-white/90">
                      Chi nhánh triển khai
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge */}
              <div
                id="challenge"
                className="mb-16 scroll-mt-32"
              >
                <h2 className="text-gray-900 mb-6">
                  Thách thức
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Trước khi triển khai hệ thống AI, khách hàng
                  đang gặp phải một số thách thức lớn trong vận
                  hành:
                </p>

                <div className="space-y-4 not-prose mb-6">
                  {[
                    "Quy trình phân tích rủi ro thủ công, tốn nhiều thời gian và dễ sai sót",
                    "Khó khăn trong việc phát hiện các giao dịch bất thường và gian lận",
                    "Không có hệ thống dự đoán xu hướng thị trường hiệu quả",
                    "Thiếu công cụ hỗ trợ ra quyết định đầu tư thông minh",
                    "Dữ liệu khách hàng phân tán, khó tích hợp và phân tích",
                  ].map((challenge, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-700 pt-1">
                        {challenge}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution */}
              <div id="solution" className="mb-16 scroll-mt-32">
                <h2 className="text-gray-900 mb-6">
                  Giải pháp
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Đội ngũ chuyên gia của SFB Technology đã
                  nghiên cứu kỹ lưỡng quy trình nghiệp vụ và đề
                  xuất một giải pháp AI/ML toàn diện, bao gồm:
                </p>

                <div className="grid md:grid-cols-2 gap-6 not-prose mb-8">
                  {[
                    {
                      title: "AI Risk Analysis Engine",
                      description:
                        "Hệ thống phân tích rủi ro tự động sử dụng Machine Learning",
                      icon: "🤖",
                      gradient: "from-[#006FB3] to-[#0088D9]",
                    },
                    {
                      title: "Fraud Detection System",
                      description:
                        "Phát hiện gian lận real-time với độ chính xác 99.2%",
                      icon: "🛡️",
                      gradient: "from-purple-500 to-pink-500",
                    },
                    {
                      title: "Predictive Analytics",
                      description:
                        "Dự đoán xu hướng thị trường và hành vi khách hàng",
                      icon: "📊",
                      gradient: "from-emerald-500 to-teal-500",
                    },
                    {
                      title: "Smart Dashboard",
                      description:
                        "Giao diện trực quan hóa dữ liệu và insights thông minh",
                      icon: "📱",
                      gradient: "from-orange-500 to-red-500",
                    },
                  ].map((solution, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#006FB3] hover:shadow-xl transition-all group"
                    >
                      <div className="text-4xl mb-4">
                        {solution.icon}
                      </div>
                      <h4 className="text-gray-900 mb-3">
                        {solution.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {solution.description}
                      </p>
                      <div
                        className={`h-1 mt-4 bg-gradient-to-r ${solution.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
                      />
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="bg-gradient-to-br from-[#E6F4FF] to-white border-l-4 border-[#006FB3] rounded-2xl p-8 my-10 not-prose">
                  <Quote
                    className="text-[#006FB3] mb-4"
                    size={32}
                  />
                  <p className="text-xl text-gray-800 italic leading-relaxed mb-4">
                    "Hệ thống AI của SFB không chỉ giúp chúng
                    tôi tự động hóa quy trình, mà còn mang lại
                    những insights sâu sắc về khách hàng và thị
                    trường mà trước đây chúng tôi chưa bao giờ
                    có được."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9]" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Trần Văn B
                      </div>
                      <div className="text-sm text-gray-600">
                        CIO, Khách hàng
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Implementation */}
              <div
                id="implementation"
                className="mb-16 scroll-mt-32"
              >
                <h2 className="text-gray-900 mb-6">
                  Triển khai
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Dự án được triển khai theo phương pháp Agile
                  với 4 giai đoạn chính:
                </p>

                <div className="space-y-6 not-prose">
                  {[
                    {
                      phase: "Phase 1",
                      title: "Discovery & Planning",
                      duration: "2 tuần",
                      tasks: [
                        "Phân tích yêu cầu nghiệp vụ",
                        "Thiết kế kiến trúc hệ thống",
                        "Lập kế hoạch triển khai",
                      ],
                    },
                    {
                      phase: "Phase 2",
                      title: "Development & Training",
                      duration: "8 tuần",
                      tasks: [
                        "Phát triển các AI models",
                        "Training với dữ liệu thực tế",
                        "Tích hợp hệ thống",
                      ],
                    },
                    {
                      phase: "Phase 3",
                      title: "Testing & Optimization",
                      duration: "4 tuần",
                      tasks: [
                        "UAT testing",
                        "Fine-tuning models",
                        "Performance optimization",
                      ],
                    },
                    {
                      phase: "Phase 4",
                      title: "Deployment & Support",
                      duration: "2 tuần",
                      tasks: [
                        "Triển khai production",
                        "Đào tạo người dùng",
                        "Hỗ trợ go-live",
                      ],
                    },
                  ].map((phase, index) => (
                    <div
                      key={index}
                      className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-0 last:pb-0"
                    >
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] border-4 border-white shadow-lg" />

                      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="px-4 py-2 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-full text-sm font-semibold">
                            {phase.phase}
                          </span>
                          <span className="text-sm text-gray-500">
                            {phase.duration}
                          </span>
                        </div>

                        <h4 className="text-gray-900 mb-4">
                          {phase.title}
                        </h4>

                        <div className="space-y-2">
                          {phase.tasks.map((task, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 text-gray-600"
                            >
                              <CheckCircle2
                                size={16}
                                className="text-[#006FB3] flex-shrink-0"
                              />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div id="results" className="mb-16 scroll-mt-32">
                <h2 className="text-gray-900 mb-6">Kết quả</h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  Sau 6 tháng vận hành, hệ thống AI đã mang lại
                  những kết quả ấn tượng:
                </p>

                <div className="grid md:grid-cols-2 gap-6 not-prose">
                  {[
                    {
                      metric: "85%",
                      label: "Tăng hiệu quả phân tích rủi ro",
                      icon: TrendingUp,
                      color: "from-[#006FB3] to-[#0088D9]",
                    },
                    {
                      metric: "40%",
                      label: "Giảm thời gian xử lý giao dịch",
                      icon: Clock,
                      color: "from-emerald-500 to-teal-500",
                    },
                    {
                      metric: "99.2%",
                      label: "Độ chính xác phát hiện gian lận",
                      icon: CheckCircle2,
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      metric: "60%",
                      label: "Giảm chi phí vận hành",
                      icon: TrendingUp,
                      color: "from-orange-500 to-red-500",
                    },
                  ].map((result, index) => {
                    const Icon = result.icon;
                    return (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#006FB3] hover:shadow-xl transition-all group"
                      >
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${result.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <Icon
                            className="text-white"
                            size={24}
                          />
                        </div>
                        <div
                          className={`text-5xl font-bold bg-gradient-to-r ${result.color} bg-clip-text text-transparent mb-3`}
                        >
                          {result.metric}
                        </div>
                        <div className="text-gray-600">
                          {result.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Conclusion */}
              <div
                id="conclusion"
                className="mb-16 scroll-mt-32"
              >
                <h2 className="text-gray-900 mb-6">Kết luận</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Dự án AI cho tập đoàn tài chính là minh chứng
                  cho năng lực và kinh nghiệm của SFB Technology
                  trong việc triển khai các giải pháp công nghệ
                  tiên tiến. Chúng tôi tự hào đã góp phần vào sự
                  thành công của khách hàng và cam kết tiếp tục
                  đồng hành trong hành trình chuyển đổi số.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Nếu doanh nghiệp của bạn cũng đang tìm kiếm
                  một đối tác công nghệ uy tín để triển khai
                  AI/ML hoặc các giải pháp chuyển đổi số khác,
                  hãy liên hệ với chúng tôi để được tư vấn chi
                  tiết.
                </p>
              </div>

              {/* Tags */}
              <div className="not-prose pt-8 border-t-2 border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gray-600 font-medium">
                    Tags:
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag, index) => (
                    <a
                      key={index}
                      href={`/news?tag=${encodeURIComponent(tag)}`}
                      className="px-4 py-2 bg-[#E6F4FF] text-[#006FB3] rounded-xl hover:bg-gradient-to-r hover:from-[#006FB3] hover:to-[#0088D9] hover:text-white transition-all font-medium"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-16 bg-gradient-to-br from-[#E6F4FF] to-white rounded-3xl p-10 border-2 border-[#006FB3]/20">
              <h3 className="text-gray-900 mb-8">Về tác giả</h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex-shrink-0 overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-2">
                    {article.author.name}
                  </h4>
                  <div className="text-[#006FB3] mb-4">
                    {article.author.position}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {article.author.bio}
                  </p>
                  <a
                    href={article.author.linkedin}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Linkedin size={18} />
                    Kết nối trên LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-gray-900 flex items-center gap-3">
                  <MessageCircle
                    className="text-[#006FB3]"
                    size={28}
                  />
                  Bình luận (12)
                </h3>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8">
                <textarea
                  placeholder="Chia sẻ suy nghĩ của bạn..."
                  rows={4}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#006FB3] focus:outline-none transition-all resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Đăng nhập để bình luận
                  </div>
                  <button className="px-8 py-3 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold">
                    Gửi bình luận
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-[#E6F4FF] to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">
              Bài viết liên quan
            </h2>
            <p className="text-xl text-gray-600">
              Khám phá thêm các bài viết hữu ích khác
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {relatedArticles.map((rel) => (
              <a
                key={rel.id}
                href="/news-detail"
                className="group bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:border-[#006FB3] transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr ${rel.gradient} opacity-20`}
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-4 py-2 bg-gradient-to-r ${rel.gradient} text-white rounded-full text-xs font-semibold shadow-lg`}
                    >
                      {rel.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-gray-900 mb-4 line-clamp-2 group-hover:text-[#006FB3] transition-colors">
                    {rel.title}
                  </h4>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{rel.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#006FB3] font-semibold group-hover:gap-3 transition-all">
                      <span>Đọc thêm</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-28 bg-gradient-to-br from-[#006FB3] via-[#005589] to-[#006FB3] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
              <MessageCircle className="text-white" size={36} />
            </div>

            <h2 className="text-white mb-6">
              Đăng ký nhận bản tin
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Nhận tin tức công nghệ mới nhất, case study và
              tips hữu ích mỗi tuần
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all"
              />
              <button className="px-10 py-5 bg-white text-[#006FB3] rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold whitespace-nowrap">
                Đăng ký ngay
              </button>
            </div>

            <p className="text-sm text-white/70 mt-6">
              🔒 Chúng tôi cam kết bảo mật thông tin của bạn
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default NewsDetailPage;
