"use client";

import { Calendar, User, ArrowRight, Clock, Eye } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api/base";
import { formatDateVN } from "@/lib/date";
import { PLACEHOLDER_CATEGORY } from "@/lib/placeholders";

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
  const isTuyenSinh = article?.title === "";
  const apiBase = API_BASE_URL;

  // Gradient cho từng bài viết (lưu trong DB từ admin)
  const gradient = article.gradient || "from-blue-600 to-cyan-600";
  const gradientBg = `bg-gradient-to-r ${gradient}`;

  const imageSrc = isTuyenSinh
    ? `${apiBase}/images/news/news1.png`
    : article.imageUrl
      ? article.imageUrl.startsWith("http")
        ? article.imageUrl
        : `${apiBase}${article.imageUrl.startsWith("/") ? "" : "/"}${article.imageUrl}`
      : "/images/no_cover.jpeg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="grid lg:grid-cols-12 gap-8 lg:gap-[90px] items-center group relative"
    >
      {/* Image - Left Side (Span 7) */}
      <div className="lg:col-span-7 relative z-10 order-1 lg:order-1">
        <div 
          className="relative overflow-hidden box-border w-full aspect-[16/10] rounded-[24px] lg:ml-auto min-[1920px]:w-[800px] min-[1920px]:h-[500px] min-[1920px]:aspect-auto"
          style={{
            border: "10px solid #FFF",
            background: "#FFF",
            boxShadow: "0 18px 36px 0 rgba(0, 95, 148, 0.12)",
          }}
        >
          <ImageWithFallback
            src={imageSrc}
            alt={article.title || "Featured news article"}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="lazy"
            objectFit="cover"
            className="rounded-[14px] transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content - Right Side (Span 5) */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-6 relative z-10 order-2 lg:order-2">

        {/* Meta Row */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 text-sm"
        >
          {/* Category Name */}
          {article.categoryName && (
            <span
              className={`${gradientBg} text-white font-medium px-3 py-1.5 rounded-full border border-white/40 shadow-sm text-xs`}
            >
              {article.categoryName}
            </span>
          )}

          {/* Date */}
          {article.publishedDate && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar size={14} />
              <span className="text-sm">{formatDateVN(article.publishedDate)}</span>
            </div>
          )}

          {/* Author */}
          {article.author && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <User size={14} />
              <span className="text-sm">{article.author}</span>
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-gray-900 mb-4">
            {article.title}
          </h2>
        </motion.div>

        {/* Excerpt */}
        {article.excerpt && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-base lg:text-lg leading-relaxed line-clamp-3"
          >
            {article.excerpt}
          </motion.p>
        )}

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-2"
        >
          <Link
            href={`/news/${article.slug}`}
            className={`inline-flex h-[54px] items-center gap-[12px] px-[29px] py-[7px] rounded-[12px] border border-white text-white font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all ${gradientBg}`}
            prefetch={true}
          >
            Đọc ngay
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
