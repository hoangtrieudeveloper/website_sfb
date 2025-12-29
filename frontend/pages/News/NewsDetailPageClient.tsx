"use client";

import {
  Calendar,
  ChevronRight,
  ArrowLeft,
  Tag,
  User,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Bookmark,
  Share2,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import Link from "next/link";
import { newsDetailData, newsSectionHeaders } from "./data";
import { NewsList } from "../../components/news/NewsList";
import { Consult } from "../../components/public/Consult";

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
  relatedArticles?: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    categoryName?: string;
    imageUrl?: string;
    publishedDate?: string;
  }>;
}

export function NewsDetailPageClient({
  article,
  relatedArticles = [],
}: NewsDetailPageClientProps) {
  const featuredImageSrc = article?.imageUrl;
  const isTuyenSinhDauCap =
    article?.slug === "he-thong-tuyen-sinh-dau-cap" ||
    article?.title === "Hệ thống tuyển sinh đầu cấp";

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-10 bg-white">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 text-gray-500">
            <Link
              href="/news"
              className="text-gray-600 hover:text-[#006FB3] transition-colors flex items-center gap-2"
              prefetch={true}
            >
              <ArrowLeft size={16} />
              {newsDetailData.breadcrumb}
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-400">
              {article.categoryName || newsDetailData.defaultCategory}
            </span>
          </nav>

          {/* Banner image */}
          {featuredImageSrc && (
            <div className="w-full rounded-2xl overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={featuredImageSrc}
                alt={article.title}
                className="w-full h-[220px] md:h-[420px] object-cover"
              />
            </div>
          )}

          {/* Title + meta */}
          <div className="mt-10">
            {/* Row 1: Like/Share (left) + share icons (right) */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 h-7 px-3 rounded bg-[#1877F2] text-white text-xs font-medium"
                  aria-label="Thích"
                >
                  <Facebook size={14} />
                  <span>Thích 1,7k</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 h-7 px-3 rounded bg-[#1877F2] text-white text-xs font-medium"
                  aria-label="Chia sẻ"
                >
                  <Share2 size={14} />
                  <span>Chia sẻ</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <button
                  type="button"
                  aria-label="Copy link"
                  className="hover:text-gray-600 transition-colors"
                >
                  <LinkIcon size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Chia sẻ Facebook"
                  className="hover:text-gray-600 transition-colors"
                >
                  <Facebook size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Chia sẻ Twitter"
                  className="hover:text-gray-600 transition-colors"
                >
                  <Twitter size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Lưu bài viết"
                  className="hover:text-gray-600 transition-colors"
                >
                  <Bookmark size={18} />
                </button>
              </div>
            </div>

            {/* Row 2: Category / Date / Author */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {article.categoryName && (
                <span className="inline-flex items-center gap-2">
                  <Tag size={16} className="text-gray-400" />
                  <span className="text-[#006FB3]">{article.categoryName}</span>
                </span>
              )}

              {article.publishedDate && (
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {new Date(article.publishedDate).toLocaleDateString("vi-VN")}
                </span>
              )}

              <span className="inline-flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                {article.author || newsDetailData.authorDefault}
              </span>
            </div>

            <h1 className="mt-6 text-gray-900 text-3xl md:text-4xl font-bold">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-4 text-gray-600 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 bg-white">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          <div>
            {isTuyenSinhDauCap ? (
              <div
                className="prose prose-lg max-w-none font-['Plus_Jakarta_Sans'] text-[var(--Color-2,#0F172A)] prose-p:mt-0 prose-p:mb-4 prose-ul:mt-0 prose-ul:mb-4 prose-li:my-0 prose-p:text-[16px] prose-p:leading-[30px] prose-p:text-[var(--Color-2,#0F172A)] prose-li:text-[16px] prose-li:leading-[30px] prose-li:text-[var(--Color-2,#0F172A)] prose-strong:text-[16px] prose-strong:font-bold prose-strong:leading-[30px] prose-strong:text-[var(--Color-2,#0F172A)] prose-ul:list-none prose-ul:pl-0 [&>ul>li]:relative [&>ul>li]:pl-5 sm:[&>ul>li]:pl-6 [&>ul>li]:before:absolute [&>ul>li]:before:left-1 sm:[&>ul>li]:before:left-2 [&>ul>li]:before:top-[15px] [&>ul>li]:before:-translate-y-1/2 [&>ul>li]:before:transform [&>ul>li]:before:content-['•'] [&>ul>li]:before:text-[16px] [&>ul>li]:before:leading-[30px] [&>ul>li]:before:text-[var(--Color-2,#0F172A)] [&_ul_ul]:mt-4 [&_ul_ul]:list-none [&_ul_ul]:pl-6 sm:[&_ul_ul]:pl-7 [&_ul_ul>li]:relative [&_ul_ul>li]:pl-5 sm:[&_ul_ul>li]:pl-6 [&_ul_ul>li]:before:absolute [&_ul_ul>li]:before:left-0 [&_ul_ul>li]:before:top-[15px] [&_ul_ul>li]:before:-translate-y-1/2 [&_ul_ul>li]:before:transform [&_ul_ul>li]:before:content-['+'] [&_ul_ul>li]:before:text-[16px] [&_ul_ul>li]:before:leading-[30px] [&_ul_ul>li]:before:text-[var(--Color-2,#0F172A)]"
                style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
              >
                
                <p>
                  <strong>1. Phần mềm tuyển sinh đầu cấp đối với nhà trường</strong>
                </p>
                <p>
                  Là phần mềm được phát triển để phục vụ công tác tuyển sinh của trường học, đồng thời là công cụ để kết nối phụ huynh và nhà trường một cách chặt chẽ hơn. Các tiện ích khi sử dụng phần mềm:
                </p>
                <ul>
                  <li>Tổ chức tuyển sinh đúng quy chế, đảm bảo tính chính xác, công bằng, khách quan.</li>
                  <li>Đảm bảo tiến độ tuyển sinh, hướng dẫn tuyển sinh đầy đủ, rõ ràng, công khai tạo thuận lợi cho học sinh và cha mẹ học sinh.</li>
                  <li>Quản lý chính xác số trẻ theo từng độ tuổi trên địa bàn, phân tuyến và giao chỉ tiêu tránh tình trạng quá tải ở các trường.</li>
                  <li>Góp phần nâng cao chất lượng giáo dục toàn diện ở các cấp học</li>
                </ul>

                <p>
                  <strong>2. Phần mềm tuyển sinh đầu cấp đối với phụ huynh</strong>
                </p>
                <ul>
                  <li>Phụ huynh có thể thực hiện đăng ký cho con em trên các thiết bị thông minh có thể truy cập internet.</li>
                  <li>Có thể tra cứu các thông tin học sinh, thông tin kỳ tuyển sinh, kết quả khi đăng ký.</li>
                  <li>
                    Hệ thống hỗ trợ hướng dẫn sử dụng cụ thể, rõ ràng theo từng bước thực hiện
                    <ul>
                      <li>Dễ dàng thực hiện</li>
                      <li>Đăng ký mọi lúc mọi nơi không cần đến trực tiếp nhà trường</li>
                    </ul>
                  </li>
                </ul>

                <p>
                  <strong>I. CÁC CHỨC NĂNG CHÍNH</strong>
                </p>
                <p>
                  01. Chức năng quản lý thông tin kỳ tuyển sinh cho phép cán bộ quản lý thêm mới các kỳ theo năm học, cập nhật thông tin cơ bản của kỳ tuyển sinh như: địa bàn, năm sinh, thời gian trực tuyến, trực tiếp, điều kiện phân tuyến chỉ tiêu.
                </p>

                <div className="not-prose my-4">
                  <ImageWithFallback
                    src="/images/news/news5.png"
                    alt="Bảng quản lý thông tin kỳ tuyển sinh"
                    className="w-full h-auto rounded-xl border border-gray-200"
                  />
                </div>

                <p>
                  02. Chức năng quản lý thông tin đăng ký trái tuyến cho phép theo dõi, phê duyệt chỉ tiêu học sinh đăng ký trái tuyến, từ đó theo dõi được số lượng chỉ tiêu, tránh thừa thiếu trên địa bàn
                </p>

                <div className="not-prose my-4">
                  <ImageWithFallback
                    src="/images/news/news6.png"
                    alt="Bảng quản lý đăng ký trái tuyến"
                    className="w-full h-auto rounded-xl border border-gray-200"
                  />
                </div>
              </div>
            ) : (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: article.content || article.excerpt || "",
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="pb-28 bg-white">
          <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bài viết liên quan</h2>
              <p className="text-gray-500">{newsSectionHeaders.latest.subtitle}</p>
            </div>

            <NewsList news={relatedArticles} />
          </div>
        </section>
      )}
       <section className=" bg-white">
              <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
                <Consult />
              </div>
            </section>
    </div>
  );
}

export default NewsDetailPageClient;
