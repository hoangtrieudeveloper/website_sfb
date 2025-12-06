"use client";

import {
  Calendar,
  User,
  ArrowRight,
  Clock,
  Eye,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";

interface FeaturedNewsProps {
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    categoryName?: string;
    imageUrl?: string;
    author?: string;
    readTime?: string;
    gradient?: string;
    publishedDate?: string;
  };
}

export function FeaturedNews({ article }: FeaturedNewsProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group hover:shadow-3xl transition-all duration-500">
      {/* Image */}
      <div className="relative h-96 lg:h-full overflow-hidden">
        <ImageWithFallback
          src={article.imageUrl || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"}
          alt={article.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${article.gradient || "from-blue-600 to-cyan-600"} opacity-20`}
        />

        {/* Category Badge */}
        {article.categoryName && (
          <div className="absolute top-6 left-6">
            <span
              className={`px-5 py-2 bg-gradient-to-r ${article.gradient || "from-blue-600 to-cyan-600"} text-white rounded-full text-sm font-semibold shadow-lg`}
            >
              {article.categoryName}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-10 lg:p-14">
        <h3 className="text-gray-900 mb-4 group-hover:text-blue-600 transition-colors text-2xl lg:text-3xl">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-500">
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
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{article.author || "SFB Technology"}</span>
          </div>
          {article.readTime && (
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{article.readTime}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span>1.5K lượt xem</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/news/${article.slug}`}
          className={`group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${article.gradient || "from-blue-600 to-cyan-600"} text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-semibold`}
          prefetch={true}
        >
          Đọc bài viết
          <ArrowRight
            className="group-hover/btn:translate-x-2 transition-transform"
            size={20}
          />
        </Link>
      </div>
    </div>
  );
}

