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
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

interface NewsDetailPageClientProps {
  article: {
    id: number;
    title: string | Record<'vi' | 'en' | 'ja', string>;
    slug: string;
    excerpt?: string | Record<'vi' | 'en' | 'ja', string>;
    content?: string | Record<'vi' | 'en' | 'ja', string>;
    categoryName?: string | Record<'vi' | 'en' | 'ja', string>;
    categoryId?: string;
    imageUrl?: string;
    author?: string | Record<'vi' | 'en' | 'ja', string>;
    readTime?: string | Record<'vi' | 'en' | 'ja', string>;
    gradient?: string;
    publishedDate?: string;
    seoKeywords?: string | Record<'vi' | 'en' | 'ja', string>;
    // Các field mới phục vụ hiển thị chi tiết
    galleryTitle?: string | Record<'vi' | 'en' | 'ja', string>;
    galleryImages?: string[];
    galleryPosition?: "top" | "bottom";
    showTableOfContents?: boolean;
    enableShareButtons?: boolean;
    showAuthorBox?: boolean;
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

import { ScrollActionButton } from "../../components/public/ScrollActionButton";

export function NewsDetailPageClient({
  article,
  relatedArticles = [],
  locale: initialLocale,
}: NewsDetailPageClientProps & { locale?: 'vi' | 'en' | 'ja' }) {
  const { locale: contextLocale } = useLocale();
  const locale = (initialLocale || contextLocale) as 'vi' | 'en' | 'ja';

  const [linkCopied, setLinkCopied] = useState(false);
  const [supportsWebShare, setSupportsWebShare] = useState(false);

  // Localize article fields - getLocalizedText now handles JSON strings automatically
  const articleTitle = getLocalizedText(article.title, locale);
  const articleExcerpt = getLocalizedText(article.excerpt, locale);
  const articleContent = getLocalizedText(article.content, locale);
  const articleAuthor = getLocalizedText(article.author, locale);
  const articleReadTime = getLocalizedText(article.readTime, locale);
  const articleCategoryName = getLocalizedText(article.categoryName, locale);
  const articleGalleryTitle = getLocalizedText(article.galleryTitle, locale);
  const [relatedPage, setRelatedPage] = useState<number>(1);
  const RELATED_PAGE_SIZE = 6;

  // Kiểm tra Web Share API support
  useEffect(() => {
    if (typeof window !== "undefined" && "navigator" in window && "share" in navigator) {
      setSupportsWebShare(true);
    }
  }, []);

  // Reset phân trang bài liên quan khi dữ liệu thay đổi
  useEffect(() => {
    setRelatedPage(1);
  }, [relatedArticles]);

  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollAction = () => {
    if (isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
  const shareTitle = articleTitle;
  const shareDescription = articleExcerpt || PLACEHOLDER_EXCERPT;

  const showTableOfContents = article.showTableOfContents !== false;
  const enableShareButtons = article.enableShareButtons !== false;
  const showAuthorBox = article.showAuthorBox !== false;

  const galleryTitle = articleGalleryTitle || "";
  const galleryImages = article.galleryImages || [];
  const galleryPosition: "top" | "bottom" =
    (article.galleryPosition as any) === "top" ? "top" : "bottom";

  const contentHtml =
    articleContent || articleExcerpt || PLACEHOLDER_CONTENT;

  const { processedHtml, tocItems } = processContentHtml({
    html: contentHtml,
    enableToc: showTableOfContents,
  });

  // Pagination cho bài viết liên quan
  const relatedTotalPages = Math.max(1, Math.ceil(relatedArticles.length / RELATED_PAGE_SIZE));
  const relatedCurrentPage = Math.min(relatedPage, relatedTotalPages);
  const relatedStartIndex = (relatedCurrentPage - 1) * RELATED_PAGE_SIZE;
  const relatedPaginated = relatedArticles.slice(
    relatedStartIndex,
    relatedStartIndex + RELATED_PAGE_SIZE,
  );

  const getRelatedPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (relatedTotalPages <= maxVisible) {
      for (let i = 1; i <= relatedTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (relatedCurrentPage <= 3) {
        for (let i = 2; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(relatedTotalPages);
      } else if (relatedCurrentPage >= relatedTotalPages - 2) {
        pages.push("...");
        for (let i = relatedTotalPages - 3; i <= relatedTotalPages; i++) pages.push(i);
      } else {
        pages.push("...");
        for (let i = relatedCurrentPage - 1; i <= relatedCurrentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(relatedTotalPages);
      }
    }

    return pages;
  };

  const handleRelatedPageChange = (page: number) => {
    if (page < 1 || page > relatedTotalPages) return;
    setRelatedPage(page);

    const relatedSection = document.querySelector('[data-related-news-section]');
    if (relatedSection) {
      const top = relatedSection.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

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
      toast.success(locale === 'vi' ? "Đã sao chép liên kết!" : locale === 'en' ? "Link copied!" : "リンクをコピーしました！");
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
        toast.success(locale === 'vi' ? "Đã sao chép liên kết!" : locale === 'en' ? "Link copied!" : "リンクをコピーしました！");
        setTimeout(() => setLinkCopied(false), 2000);
      } catch (e) {
        toast.error(locale === 'vi' ? "Không thể sao chép liên kết" : locale === 'en' ? "Failed to copy link" : "リンクのコピーに失敗しました");
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
        // Error sharing - silently fail
      }
    } else {
      // Fallback: mở dropdown menu
      toast.info(locale === 'vi' ? "Trình duyệt không hỗ trợ chia sẻ trực tiếp" : locale === 'en' ? "Browser does not support direct sharing" : "ブラウザが直接共有をサポートしていません");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-10 bg-white">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 text-gray-500">
            <Link
              href={`/${locale}/news`}
              className="text-gray-600 hover:text-[#006FB3] transition-colors flex items-center gap-2"
              prefetch={true}
            >
              <ArrowLeft size={16} />
              {locale === 'vi' ? 'Tin tức' : locale === 'en' ? 'News' : 'ニュース'}
            </Link>
            {articleCategoryName && (
              <>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-400">
                  {articleCategoryName}
                </span>
              </>
            )}
          </nav>

          {/* Banner image */}
          <div className="w-full rounded-2xl overflow-hidden bg-gray-100 relative h-[220px] md:h-[420px]">
            <ImageWithFallback
              src={featuredImageSrc}
              alt={articleTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              loading="lazy"
              objectFit="cover"
            />
          </div>

          {/* Title + meta */}
          <div className="mt-10">
            {/* Row 1: Like/Share (left) + share icons (right) */}
            {enableShareButtons && (
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
            )}

            {/* Row 2: Category / Date / Author */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {articleCategoryName && (
                <span className="inline-flex items-center gap-2">
                  <Tag size={16} className="text-gray-400" />
                  <span className="text-[#006FB3]">{articleCategoryName}</span>
                </span>
              )}

              {article.publishedDate && (
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {new Date(article.publishedDate).toLocaleDateString(locale === 'vi' ? "vi-VN" : locale === 'en' ? "en-US" : "ja-JP")}
                </span>
              )}

              {articleAuthor && (
                <span className="inline-flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  {articleAuthor}
                </span>
              )}
            </div>

            <h1 className="mt-6 text-gray-900 text-3xl md:text-4xl font-bold">
              {articleTitle}
            </h1>

            {articleExcerpt && (
              <p className="mt-4 text-gray-600 leading-relaxed">
                {articleExcerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 bg-white">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          {/* Gallery phía trên nội dung nếu chọn TOP */}
          {galleryImages.length > 0 && galleryPosition === "top" && (
            <div className="mb-8">
              <NewsGallerySlider
                images={galleryImages}
                title={galleryTitle || undefined}
              />
            </div>
          )}

          {/* Table of Contents */}
          {showTableOfContents && (
            <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Mục lục</p>
              {tocItems.length > 0 ? (
                <ol className="space-y-1 text-sm text-blue-700">
                  {tocItems.map((item) => (
                    <li
                      key={item.id}
                      className={item.level === 3 ? "pl-4 text-blue-600" : ""}
                    >
                      <a href={`#${item.id}`} className="hover:underline">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-gray-500">
                  Chưa có tiêu đề
                </p>
              )}
            </div>
          )}

          <div>
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: processedHtml,
                }}
              />
            </div>
          </div>

          {/* Gallery phía dưới nội dung nếu chọn BOTTOM */}
          {galleryImages.length > 0 && galleryPosition === "bottom" && (
            <div className="mt-10">
              <NewsGallerySlider
                images={galleryImages}
                title={galleryTitle || undefined}
              />
            </div>
          )}
        </div>
      </section>

      {/* Author box */}
      {showAuthorBox && (
        <section className="pb-16 bg-white">
          <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
            {articleAuthor && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                  {articleAuthor.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{locale === 'vi' ? 'Tác giả' : locale === 'en' ? 'Author' : '著者'}</p>
                  <p className="text-base font-semibold text-gray-900">
                    {articleAuthor}
                  </p>
                  {article.publishedDate && (
                    <p className="text-xs text-gray-500">
                      {locale === 'vi' ? 'Ngày đăng' : locale === 'en' ? 'Published' : '公開日'}: {new Date(article.publishedDate).toLocaleDateString(locale === 'vi' ? "vi-VN" : locale === 'en' ? "en-US" : "ja-JP")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="pb-8 bg-white">
          <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
            {/* Divider above Related heading */}
            <div className="mb-10">
              <div className="h-px w-full bg-[#E5E5E5]" />
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {locale === 'vi' ? 'Bài viết liên quan' : locale === 'en' ? 'Related Articles' : '関連記事'}
              </h2>
              {/* <p className="text-gray-500">{newsSectionHeaders.latest.subtitle}</p> */}
            </div>

            <div data-related-news-section>
              <NewsList news={relatedPaginated.slice(0, 6)} locale={locale} />
            </div>

            {/* Divider between Related list and pagination */}
            <div className="mt-12">
              <div className="h-px w-full bg-[#E5E5E5]" />
            </div>

            {/* Pagination - Related */}
            {relatedTotalPages > 0 && (
              <div className="flex justify-start mt-8 gap-2 w-full">
                {/* Previous button */}
                <button
                  onClick={() => handleRelatedPageChange(relatedCurrentPage - 1)}
                  disabled={relatedCurrentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${relatedCurrentPage === 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                    }`}
                  aria-label={locale === 'vi' ? "Trang trước" : locale === 'en' ? "Previous page" : "前のページ"}
                >
                  &lt;
                </button>

                {/* Page numbers */}
                {getRelatedPageNumbers().map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-related-${index}`}
                        className="w-10 h-10 flex items-center justify-center text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  const pageNum = page as number;
                  const isActive = pageNum === relatedCurrentPage;

                  return (
                    <button
                      key={`related-${pageNum}`}
                      onClick={() => handleRelatedPageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors font-medium ${isActive
                        ? "bg-[#0870B4] text-white border-[#0870B4] shadow-md"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                        }`}
                      aria-label={locale === 'vi' ? `Trang ${pageNum}` : locale === 'en' ? `Page ${pageNum}` : `ページ ${pageNum}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  onClick={() => handleRelatedPageChange(relatedCurrentPage + 1)}
                  disabled={relatedCurrentPage === relatedTotalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${relatedCurrentPage === relatedTotalPages
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                    }`}
                  aria-label={locale === 'vi' ? "Trang sau" : locale === 'en' ? "Next page" : "次のページ"}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      <section className=" bg-white">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          <Consult locale={locale} />
        </div>
      </section>

      {/* Scroll Action Button */}
      <ScrollActionButton />
    </div>
  );
}


// Slider gallery đơn giản cho bài viết tin tức
function NewsGallerySlider({ images, title }: { images: string[]; title?: string }) {
  if (!images || images.length === 0) return null;

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto">
        {title && (
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        <div className="overflow-x-auto flex gap-3 pb-2">
          {images.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => setPreviewIndex(index)}
              className="flex-shrink-0 w-60 h-40 md:w-72 md:h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ImageWithFallback
                src={
                  img.startsWith("http")
                    ? img
                    : `${API_BASE_URL}${img.startsWith("/") ? "" : "/"
                    }${img}`
                }
                alt={`Ảnh gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {previewIndex !== null && images[previewIndex] && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center px-4"
          onClick={() => setPreviewIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewIndex(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-200 text-sm"
            >
              Đóng
            </button>
            <ImageWithFallback
              src={
                images[previewIndex].startsWith("http")
                  ? images[previewIndex]
                  : `${API_BASE_URL}${images[previewIndex].startsWith("/") ? "" : "/"
                  }${images[previewIndex]}`
              }
              alt={`Ảnh gallery ${previewIndex + 1}`}
              className="w-full max-h-[90vh] object-contain rounded-xl bg-black"
            />
          </div>
        </div>
      )}
    </>
  );
}

// Xử lý nội dung: chèn TOC (id cho H2/H3) và nhấn mạnh đoạn đầu nếu cần
function processContentHtml({
  html,
  enableToc,
}: {
  html: string;
  enableToc: boolean;
}) {
  let processed = html;
  const tocItems: { id: string; text: string; level: number }[] = [];

  // Thêm id cho H2/H3 để làm TOC
  if (enableToc) {
    let counter = 1;
    processed = processed.replace(/<h([23])>(.*?)<\/h\1>/gi, (_m, level, text) => {
      const id = `toc-${counter++}`;
      const cleanText = String(text).replace(/<[^>]+>/g, "").trim();
      tocItems.push({ id, text: cleanText, level: Number(level) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
  }

  return { processedHtml: processed, tocItems };
}

// Default export cho Pages Router - trả về empty page vì route thực tế nằm ở App Router
export default function NewsDetailPageClientPage() {
  return null;
}
