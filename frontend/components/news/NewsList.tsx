"use client";

import {
  Calendar,
  User,
  ArrowRight,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  categoryName?: string;
  categoryId?: string;
  imageUrl?: string;
  author?: string;
  readTime?: string;
  gradient?: string;
  publishedDate?: string;
}

interface NewsListProps {
  news: NewsItem[];
}

export function NewsList({ news }: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Không có bài viết nào.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((article) => (
        <article
          key={article.id}
          className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <ImageWithFallback
              src={article.imageUrl || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"}
              alt={article.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${article.gradient || "from-blue-600 to-cyan-600"} opacity-20`}
            />

            {/* Category */}
            {article.categoryName && (
              <div className="absolute top-4 left-4">
                <span
                  className={`px-4 py-2 bg-gradient-to-r ${article.gradient || "from-blue-600 to-cyan-600"} text-white rounded-full text-xs font-semibold shadow-lg`}
                >
                  {article.categoryName}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110">
                <Bookmark size={16} className="text-gray-700" />
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110">
                <Share2 size={16} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h4 className="text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h4>

            {article.excerpt && (
              <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{article.author || "SFB Technology"}</span>
              </div>
              {article.readTime && (
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{article.readTime}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {article.publishedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {new Date(article.publishedDate).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <Link
                href={`/news/${article.slug}`}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 group/link"
                prefetch={true}
              >
                Đọc thêm
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

