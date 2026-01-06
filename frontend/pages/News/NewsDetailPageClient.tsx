"use client";

import { useState, useEffect } from "react";
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
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import Link from "next/link";
import { newsDetailData, newsSectionHeaders } from "./data";
import { NewsList } from "../../components/news/NewsList";
import { Consult } from "../../components/public/Consult";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { toast } from "sonner";
import { PLACEHOLDER_EXCERPT, PLACEHOLDER_CONTENT } from "@/lib/placeholders";
import { API_BASE_URL } from "@/lib/api/base";

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
  const [linkCopied, setLinkCopied] = useState(false);
  const [supportsWebShare, setSupportsWebShare] = useState(false);
  
  // Kiểm tra Web Share API support
  useEffect(() => {
    if (typeof window !== "undefined" && "navigator" in window && "share" in navigator) {
      setSupportsWebShare(true);
    }
  }, []);
  
  if (!article) {
    return null;
  }
  
  const apiBase = API_BASE_URL;
  const featuredImageSrc = article?.imageUrl
    ? article.imageUrl.startsWith("http")
      ? article.imageUrl
      : `${apiBase}${article.imageUrl.startsWith("/") ? "" : "/"}${article.imageUrl}`
    : "/images/no_cover.jpeg";

  // Lấy URL hiện tại của trang
  const currentUrl = typeof window !== "undefined" 
    ? window.location.href 
    : "";
  const shareTitle = article.title;
  const shareDescription = article.excerpt || PLACEHOLDER_EXCERPT;

  // Hàm chia sẻ Facebook
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // Hàm chia sẻ Twitter
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // Hàm chia sẻ LinkedIn
  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // Hàm copy link
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setLinkCopied(true);
      toast.success("Đã sao chép liên kết!");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      // Fallback cho trình duyệt không hỗ trợ clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setLinkCopied(true);
        toast.success("Đã sao chép liên kết!");
        setTimeout(() => setLinkCopied(false), 2000);
      } catch (e) {
        toast.error("Không thể sao chép liên kết");
      }
      document.body.removeChild(textArea);
    }
  };

  // Hàm chia sẻ bằng Web Share API (nếu trình duyệt hỗ trợ)
  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled hoặc có lỗi
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback: mở dropdown menu
      toast.info("Trình duyệt không hỗ trợ chia sẻ trực tiếp");
    }
  };

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
          <div className="w-full rounded-2xl overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={featuredImageSrc}
              alt={article.title}
              className="w-full h-[220px] md:h-[420px] object-cover"
            />
          </div>

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 h-7 px-3 rounded bg-[#1877F2] text-white text-xs font-medium hover:bg-[#166FE5] transition-colors"
                      aria-label="Chia sẻ"
                    >
                      <Share2 size={14} />
                      <span>Chia sẻ</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={shareToFacebook}
                      className="cursor-pointer"
                    >
                      <Facebook size={16} className="mr-2 text-[#1877F2]" />
                      Chia sẻ Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={shareToTwitter}
                      className="cursor-pointer"
                    >
                      <Twitter size={16} className="mr-2 text-[#1DA1F2]" />
                      Chia sẻ Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={shareToLinkedIn}
                      className="cursor-pointer"
                    >
                      <Linkedin size={16} className="mr-2 text-[#0077B5]" />
                      Chia sẻ LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={copyToClipboard}
                      className="cursor-pointer"
                    >
                      {linkCopied ? (
                        <>
                          <Check size={16} className="mr-2 text-green-600" />
                          Đã sao chép
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-2" />
                          Sao chép liên kết
                        </>
                      )}
                    </DropdownMenuItem>
                    {supportsWebShare && (
                      <DropdownMenuItem
                        onClick={shareViaWebShare}
                        className="cursor-pointer"
                      >
                        <Share2 size={16} className="mr-2" />
                        Chia sẻ khác...
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  aria-label="Copy link"
                  className="hover:text-gray-600 transition-colors"
                  title="Sao chép liên kết"
                >
                  {linkCopied ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <LinkIcon size={18} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={shareToFacebook}
                  aria-label="Chia sẻ Facebook"
                  className="hover:text-[#1877F2] transition-colors"
                  title="Chia sẻ Facebook"
                >
                  <Facebook size={18} />
                </button>
                <button
                  type="button"
                  onClick={shareToTwitter}
                  aria-label="Chia sẻ Twitter"
                  className="hover:text-[#1DA1F2] transition-colors"
                  title="Chia sẻ Twitter"
                >
                  <Twitter size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Lưu bài viết"
                  className="hover:text-gray-600 transition-colors"
                  title="Lưu bài viết"
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
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.content || article.excerpt || PLACEHOLDER_CONTENT,
              }}
            />
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

            <NewsList news={relatedArticles.slice(0, 6)} />
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

// Default export cho Pages Router - trả về empty page vì route thực tế nằm ở App Router
export default function NewsDetailPageClientPage() {
    return null;
}
