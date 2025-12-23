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
    <div className="grid lg:grid-cols-12 gap-8 items-center group">
      {/* Image - Left Side (Span 7) */}
      <div className="lg:col-span-7">
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
          <ImageWithFallback
            src={article.imageUrl || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"}
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Content - Right Side (Span 5) */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-6">

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Category Name */}
          <span className="text-[#0870B4] font-medium">
            {article.categoryName || "Tin sản phẩm & giải pháp"}
          </span>

          {/* Date */}
          {article.publishedDate && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar size={14} />
              <span>
                {new Date(article.publishedDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Author */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <User size={14} />
            <span>{article.author || "SFB Technology"}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight group-hover:text-[#0870B4] transition-colors">
          {article.title}
        </h2>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Button */}
        <div className="pt-2">
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D9CDB] text-white rounded-lg font-medium hover:bg-[#2680B3] transition-colors shadow-sm hover:shadow-md"
            prefetch={true}
          >
            Đọc ngay
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
