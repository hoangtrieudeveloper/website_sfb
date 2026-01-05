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
import { motion } from "framer-motion";

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
  const isTuyenSinh = article?.title === "Hệ thống tuyển sinh đầu cấp";
  const imageSrc = isTuyenSinh
    ? "/images/news/news1.png"
    : (article.imageUrl || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="grid lg:grid-cols-12 gap-[clamp(24px,3vw,60px)] items-center group relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-blue-500/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

      {/* Image - Left Side (Span 7) */}
      <div className="lg:col-span-7 relative z-10">
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-[0_0_30px_rgba(8,112,180,0.2)] transition-shadow duration-500">
          <ImageWithFallback
            src={imageSrc}
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0870B4]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      {/* Content - Right Side (Span 5) */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-4 relative z-10 ">

        {/* Meta Row */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-4"
        >
          {/* Category Name */}
          <span className="text-[#0870B4] font-medium px-4 py-1 bg-[#0870B4]/10 rounded-full border border-[#0870B4]/20">
            {article.categoryName || "Tin sản phẩm & giải pháp"}
          </span>

          {/* Date */}
          {article.publishedDate && (
            <div className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[35px] text-[var(--Color-5,#64748B)]">
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
          <div className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[35px] text-[var(--Color-5,#64748B)]">
            <User size={14} />
            <span>{article.author || "SFB Technology"}</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3 }}
          className="line-clamp-2 self-stretch overflow-hidden text-ellipsis font-['Plus_Jakarta_Sans'] font-bold text-[26px] leading-[38px] text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] max-md:text-[clamp(20px,5.5vw,26px)] max-md:leading-[clamp(28px,7vw,38px)] transition-colors"
        >
          {article.title}
        </motion.h2>

        {/* Excerpt */}
        {article.excerpt && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg leading-relaxed line-clamp-3 max-md:text-[16px] max-md:leading-[28px]"
          >
            {article.excerpt}
          </motion.p>
        )}

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5 }}
          className="pt-0"
        >
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex h-[54px] items-center gap-[12px] px-[29px] py-[7px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium shadow-sm hover:shadow-[0_0_20px_rgba(45,156,219,0.4)] transform hover:-translate-y-1 transition-all"
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
