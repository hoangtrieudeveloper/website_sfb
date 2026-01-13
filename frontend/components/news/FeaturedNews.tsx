"use client";

import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api/base";
import { formatDateVN } from "@/lib/date";
import { PLACEHOLDER_CATEGORY } from "@/lib/placeholders";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

type Locale = 'vi' | 'en' | 'ja';

interface FeaturedNewsProps {
  article: {
    id: number;
    title: string | Record<Locale, string>;
    slug: string;
    excerpt?: string | Record<Locale, string>;
    categoryName?: string | Record<Locale, string>;
    imageUrl?: string;
    author?: string | Record<Locale, string>;
    readTime?: string | Record<Locale, string>;
    gradient?: string;
    publishedDate?: string;
  };
}

export function FeaturedNews({ article }: FeaturedNewsProps) {
  const { locale } = useLocale();
  const title = typeof article.title === 'string' ? article.title : getLocalizedText(article.title, locale);
  const isTuyenSinh = title === "";
  const apiBase = API_BASE_URL;
  
  const excerpt = article.excerpt 
    ? (typeof article.excerpt === 'string' ? article.excerpt : getLocalizedText(article.excerpt, locale))
    : undefined;
  const categoryName = article.categoryName
    ? getLocalizedText(article.categoryName, locale)
    : undefined;
  const author = article.author
    ? (typeof article.author === 'string' ? article.author : getLocalizedText(article.author, locale))
    : undefined;

  // Gradient cho từng bài viết (lưu trong DB từ admin)
  const gradient = article.gradient || "from-blue-600 to-cyan-600";
  const gradientBg = `bg-gradient-to-r ${gradient}`;

  const imageSrc = isTuyenSinh
    ? "/images/news/news1.png"
    : article.imageUrl
      ? article.imageUrl.startsWith("http")
        ? article.imageUrl
        : !article.imageUrl.includes("/")
          ? `/images/news/${article.imageUrl}`
          : article.imageUrl.includes("images/")
            ? article.imageUrl.startsWith("/") ? article.imageUrl : `/${article.imageUrl}`
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
            alt={title || "Featured news article"}
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
          className="flex flex-wrap items-center gap-4 text-sm"
        >
          {/* Category Name */}
          {categoryName && (
            <div className="flex items-center">
              <span className="text-[#1D8FCF] text-[14px] font-normal leading-[250%] font-['Plus_Jakarta_Sans']">
                {categoryName}
              </span>
            </div>
          )}

          {/* Date */}
          {article.publishedDate && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.66634 3.33332H5.99984C5.06642 3.33332 4.59936 3.33332 4.24284 3.51498C3.92924 3.67477 3.67445 3.92955 3.51466 4.24315C3.33301 4.59967 3.33301 5.06673 3.33301 6.00015V6.66666M6.66634 3.33332H13.333M6.66634 3.33332V1.66666M13.333 3.33332H13.9998C14.9333 3.33332 15.3993 3.33332 15.7558 3.51498C16.0694 3.67477 16.3251 3.92955 16.4849 4.24315C16.6663 4.59932 16.6663 5.06582 16.6663 5.99741V6.66666M13.333 3.33332V1.66666M3.33301 6.66666V14.0002C3.33301 14.9336 3.33301 15.4 3.51466 15.7566C3.67445 16.0702 3.92924 16.3254 4.24284 16.4852C4.59901 16.6667 5.0655 16.6667 5.9971 16.6667H14.0022C14.9338 16.6667 15.3997 16.6667 15.7558 16.4852C16.0694 16.3254 16.3251 16.0702 16.4849 15.7566C16.6663 15.4004 16.6663 14.9346 16.6663 14.003V6.66666M3.33301 6.66666H16.6663M13.333 13.3333H13.3347L13.3346 13.335L13.333 13.335V13.3333ZM9.99967 13.3333H10.0013L10.0013 13.335L9.99967 13.335V13.3333ZM6.66634 13.3333H6.66801L6.66797 13.335L6.66634 13.335V13.3333ZM13.3346 9.99999V10.0017L13.333 10.0016V9.99999H13.3346ZM9.99967 9.99999H10.0013L10.0013 10.0017L9.99967 10.0016V9.99999ZM6.66634 9.99999H6.66801L6.66797 10.0017L6.66634 10.0016V9.99999Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[#64748B] text-[14px] font-normal leading-[250%] font-['Plus_Jakarta_Sans']">
                {formatDateVN(article.publishedDate)}
              </span>
            </div>
          )}

          {/* Author */}
          {author && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 15C5.05305 15 5.10772 15 5.16409 15H10M5 15C4.17644 14.9993 3.74445 14.989 3.40983 14.8185C3.09623 14.6587 2.84144 14.4031 2.68166 14.0895C2.5 13.733 2.5 13.2669 2.5 12.3335V7.66683C2.5 6.73341 2.5 6.26635 2.68166 5.90983C2.84144 5.59623 3.09623 5.34144 3.40983 5.18166C3.76635 5 4.23341 5 5.16683 5H14.8335C15.7669 5 16.233 5 16.5895 5.18166C16.9031 5.34144 17.1587 5.59623 17.3185 5.90983C17.5 6.266 17.5 6.73249 17.5 7.66409V12.3359C17.5 13.2675 17.5 13.7333 17.3185 14.0895C17.1587 14.4031 16.9031 14.6587 16.5895 14.8185C16.2333 15 15.7675 15 14.8359 15H10M5 15C5.00003 14.0795 6.11931 13.3333 7.5 13.3333C8.88071 13.3333 10 14.0795 10 15M5 15C5 15 5 14.9999 5 15ZM15 11.6667H11.6667M15 9.16667H12.5M7.5 10.8333C6.57953 10.8333 5.83333 10.0871 5.83333 9.16667C5.83333 8.24619 6.57953 7.5 7.5 7.5C8.42047 7.5 9.16667 8.24619 9.16667 9.16667C9.16667 10.0871 8.42047 10.8333 7.5 10.8333Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[#64748B] text-[14px] font-normal leading-[250%] font-['Plus_Jakarta_Sans']">
                {author}
              </span>
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
            {title}
          </h2>
        </motion.div>

        {/* Excerpt */}
        {excerpt && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-base lg:text-lg leading-relaxed line-clamp-3"
          >
            {excerpt}
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
            href={`/${locale}/news/${article.slug}`}
            className={`inline-flex h-[54px] items-center gap-[12px] px-[29px] py-[7px] rounded-[12px] border border-white text-white font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all ${gradientBg}`}
            prefetch={true}
          >
            {locale === 'vi' ? 'Đọc ngay' : locale === 'en' ? 'Read more' : '続きを読む'}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
