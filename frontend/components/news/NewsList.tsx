"use client";

import { Calendar, Heart, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-[45px]">
      {news.map((article) => {
        const img =
          article.imageUrl ||
          "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80";

        const likes = article.likes ?? 20;
        const comments = article.comments ?? 16;

        const dateText = article.publishedDate
          ? new Date(article.publishedDate).toLocaleDateString("vi-VN")
          : "";

        return (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            aria-label={article.title}
            className="block"
          >
            <article
              className={[
                "flex flex-col items-start gap-6 flex-[1_0_0] pb-6",
                "h-[530px]",
                "rounded-[24px] bg-[var(--Color-7,#FFF)]",
                "border-[0px] border-[var(--Linear,#1D8FCF)]",
                "shadow-[0_12px_36px_0_rgba(59,90,136,0.12)]",
                "overflow-hidden",
              ].join(" ")}
            >
              {/* IMAGE */}
              <div className="w-full rounded-[12px] overflow-hidden shrink-0">
                <ImageWithFallback
                  src={img}
                  alt={article.title}
                  className="w-full h-[220px] md:h-[273.243px] object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="w-full px-6 flex flex-col flex-1 min-h-0">
                <h3
                  className="h-[60px] self-stretch line-clamp-2 font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px] text-[var(--Color-2,#0F172A)]"
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
            </article>
          </Link>
        );
      })}
    </div>
  );
}
