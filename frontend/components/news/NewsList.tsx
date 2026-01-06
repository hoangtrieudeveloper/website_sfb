"use client";

import { Calendar, Heart, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  categoryName?: string;
  imageUrl?: string;
  publishedDate?: string;

  // optional: nếu bạn có data
  likes?: number;
  comments?: number;
}

interface NewsListProps {
  news: NewsItem[];
}

export function NewsList({ news }: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">Không có bài viết nào.</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-[45px]"
    >
      <AnimatePresence>
        {news.map((article, index) => {
          const img = article.imageUrl || "/images/no_cover.jpeg";

          const likes = article.likes ?? 0;
          const comments = article.comments ?? 0;

          const dateText = article.publishedDate
            ? new Date(article.publishedDate).toLocaleDateString("vi-VN")
            : "";

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.05, type: "spring", stiffness: 50 }}
              key={article.id}
            >
              <Link
                href={`/news/${article.slug}`}
                aria-label={article.title}
                className="block h-full"
              >
                <motion.article
                  whileHover={{
                    y: -10,
                    boxShadow: "0 20px 40px -5px rgba(29, 143, 207, 0.2)",
                    borderColor: "rgba(29, 143, 207, 0.4)"
                  }}
                  className={[
                    "flex flex-col items-start gap-6 flex-[1_0_0] pb-6",
                    "h-[530px]",
                    "rounded-[24px] bg-[var(--Color-7,#FFF)]",
                    "border border-transparent", // Adjusted for animation
                    "shadow-[0_12px_36px_0_rgba(59,90,136,0.12)]",
                    "overflow-hidden",
                    "transition-colors duration-300"
                  ].join(" ")}
                >
                  {/* IMAGE */}
                  <div className="w-full rounded-[12px] overflow-hidden shrink-0 relative group">
                    <ImageWithFallback
                      src={img}
                      alt={article.title}
                      className="w-full h-[220px] md:h-[273.243px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* CONTENT */}
                  <div className="w-full px-6 flex flex-col flex-1 min-h-0">
                    <h3
                      className="h-[60px] self-stretch line-clamp-2 font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px] text-[var(--Color-2,#0F172A)] group-hover:text-[#1D8FCF] transition-colors"
                      style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                    >
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p
                        className="mt-3 flex-[1_0_0] min-h-0 overflow-hidden line-clamp-3 font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[30px] text-[var(--Color-2,#0F172A)]"
                        style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                      >
                        {article.excerpt}
                      </p>
                    )}

                    {/* ICON ROW giống ảnh */}
                    <div className="mt-auto pt-4 flex items-center gap-5 text-[13px] text-gray-500">
                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-red-500" />
                        <span>{likes}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-blue-600" />
                        <span>{comments}</span>
                      </div>

                      {dateText && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{dateText}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.article>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
