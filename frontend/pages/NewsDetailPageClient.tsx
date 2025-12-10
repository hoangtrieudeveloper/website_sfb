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
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import Link from "next/link";

interface NewsDetailPageClientProps {
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    categoryName?: string;
    categoryId?: string;
    imageUrl?: string;
    author?: string;
    readTime?: string;
    gradient?: string;
    publishedDate?: string;
    seoKeywords?: string;
  };
}

export function NewsDetailPageClient({ article }: NewsDetailPageClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(125);
  const [isLiked, setIsLiked] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tags = article.seoKeywords
    ? article.seoKeywords.split(",").map((tag) => tag.trim())
    : [];

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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:18px_28px]" />
        <div className="absolute -top-24 -right-10 w-80 h-80 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8 text-gray-500">
            <Link
              href="/news"
              className="text-gray-600 hover:text-[#006FB3] transition-colors flex items-center gap-2"
              prefetch={true}
            >
              <ArrowLeft size={16} />
              Tin tức
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-400">
              {article.categoryName || "Bài viết"}
            </span>
          </nav>

          <div className="max-w-6xl">
            {/* Category Badge */}
            {article.categoryName && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-full text-sm font-semibold shadow-lg mb-6">
                <TrendingUp size={16} />
                {article.categoryName}
              </div>
            )}

            {/* Title */}
            <h1 className="text-gray-900 mb-6 max-w-5xl text-3xl md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.excerpt && (
              <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-4xl leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Meta + social */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] border-2 border-white shadow-lg flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {article.author || "SFB Technology"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  {article.publishedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        {new Date(article.publishedDate).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {article.readTime && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{article.readTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    isLiked
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600"
                  }`}
                >
                  <Heart size={18} className={isLiked ? "fill-red-600" : ""} />
                  <span>{likes}</span>
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
                    isBookmarked
                      ? "bg-[#E6F4FF] border-[#006FB3] text-[#006FB3]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-[#006FB3] hover:text-[#006FB3]"
                  }`}
                >
                  <Bookmark
                    size={18}
                    className={isBookmarked ? "fill-[#006FB3]" : ""}
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
      {article.imageUrl && (
        <section className="container mx-auto px-6 -mt-10 relative z-20 mb-20">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <ImageWithFallback
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-28">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Article Content */}
          <article className="lg:col-span-9">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.content || article.excerpt || "",
              }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="not-prose pt-8 border-t-2 border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gray-600 font-medium">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/news?tag=${encodeURIComponent(tag)}`}
                      className="px-4 py-2 bg-[#E6F4FF] text-[#006FB3] rounded-xl hover:bg-gradient-to-r hover:from-[#006FB3] hover:to-[#0088D9] hover:text-white transition-all font-medium"
                      prefetch={true}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-gray-900 flex items-center gap-3">
                  <MessageCircle className="text-[#006FB3]" size={28} />
                  Bình luận (0)
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
    </div>
  );
}


export default NewsDetailPageClient;
