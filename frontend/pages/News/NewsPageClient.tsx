"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { TrendingUp, Filter, Tag, Inbox } from "lucide-react";
import { FeaturedNews } from "../../components/news/FeaturedNews";
import { NewsList } from "../../components/news/NewsList";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
import { newsHeroData, newsSectionHeaders, newsletterData, uiText } from "./data";
import { Consult } from "../../components/public/Consult";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  categoryName?: string;
  categoryId?: string;
  imageUrl?: string;
  author?: string;
  readTime?: string;
  gradient?: string;
  publishedDate?: string;
  isFeatured?: boolean;
}

interface NewsPageClientProps {
  initialNews: NewsItem[];
  initialFeatured?: NewsItem;
  categories: Array<{ id: string; name: string; code?: string }>;
}

export function NewsPageClient({
  initialNews,
  initialFeatured,
  categories = [],
}: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [news, setNews] = useState<NewsItem[]>(initialNews || []);
  const [loading, setLoading] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [pageSize, setPageSize] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch news with filters
  const fetchNews = useCallback(async (category: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (category && category !== "all") {
        const categoryCode = categories.find((c) => c.id === category)?.code || category;
        if (categoryCode && categoryCode !== "all") {
          params.append("category", categoryCode);
        }
      }

      const queryString = params.toString();
      const endpoint = `${PublicEndpoints.news.list}${queryString ? `?${queryString}` : ""}`;
      const data = await publicApiCall<{ success: boolean; data: NewsItem[] }>(endpoint);

      if (data.success && data.data) {
        // Remove featured from list to avoid duplication
        const newsWithoutFeatured = initialFeatured
          ? data.data.filter((item) => item.id !== initialFeatured.id)
          : data.data;
        setNews(newsWithoutFeatured);
      }
    } catch (error) {
      // Silently fail
      setNews(initialNews);
    } finally {
      setLoading(false);
    }
  }, [categories, initialFeatured, initialNews]);

  // Fetch category counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts: Record<string, number> = { all: 0 };

        // Fetch all news for "all" count
        const allData = await publicApiCall<{ success: boolean; data: NewsItem[] }>(
          PublicEndpoints.news.list
        );
        if (allData.success && allData.data) {
          counts.all = allData.data.length;
        }

        // Fetch count for each category
        for (const cat of categories) {
          if (cat.id === "all" || !cat.code) continue;

          // Note: doing this in a loop is not ideal for performance but matches original logic
          // ideally the backend should return counts
          const catData = await publicApiCall<{ success: boolean; data: NewsItem[] }>(
            `${PublicEndpoints.news.list}?category=${cat.code}`
          );
          if (catData.success && catData.data) {
            counts[cat.id] = catData.data.length;
          }
        }

        setCategoryCounts(counts);
      } catch (error) {
        // Silently fail
      }
    };

    fetchCounts();
  }, [categories]);

  // Category filter effect (no search)
  useEffect(() => {
    if (selectedCategory === "all") {
      setNews(initialNews);
      return;
    }

    fetchNews(selectedCategory);
  }, [selectedCategory, fetchNews, initialNews]);

  // Reset to page 1 when category or pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, pageSize]);

  // Map categories with counts
  const categoriesWithCount = useMemo(() => {
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    return categories.map((cat) => ({
      ...cat,
      count: categoryCounts[cat.id] ?? 0,
    }));
  }, [categories, categoryCounts]);

  // Calculate pagination
  const totalPages = Math.ceil(news.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNews = news.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maximum visible page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of news section
      const newsSection = document.querySelector('[data-news-section]');
      if (newsSection) {
        const top = newsSection.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({
          top: top,
          behavior: "smooth",
        });
      }
    }
  };

  const HeroIcon = newsHeroData.icon;
  const NewsletterIcon = newsletterData.icon;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* Categories Filter - Sticky */}
      <section className="pt-32 pb-8 bg-white border-b border-gray-100 z-40">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
               <div
          className="p-2.5 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center flex-none"
          aria-hidden="true"
        >
          <img
            src="/icons/interface/iconnews.svg"
            alt=""
            className="w-5 h-5"
            aria-hidden="true"
          />
        </div>
              {categoriesWithCount.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === category.id
                    ? "bg-[#0870B4] text-white shadow-md select-none"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {initialFeatured && (
        <section className="py-[45px] bg-white">
          <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
            <FeaturedNews article={initialFeatured} />
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-[45px] bg-white min-h-[500px]">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{newsSectionHeaders.latest.title}</h2>
              <p className="text-gray-500">{newsSectionHeaders.latest.subtitle}</p>
            </motion.div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Hiển thị:</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing page size
                  }}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#0870B4] focus:ring-1 focus:ring-[#0870B4] transition-all cursor-pointer hover:border-gray-300"
                >
                  <option value={6}>6 bài viết</option>
                  <option value={12}>12 bài viết</option>
                  <option value={24}>24 bài viết</option>
                  <option value={48}>48 bài viết</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0870B4]"></div>
              <p className="mt-4">{uiText.loading}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Inbox className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Hiện tại chưa có bài viết nào để hiển thị. Vui lòng quay lại sau.
              </p>
            </div>
          ) : (
            <>
              <div data-news-section>
                <AnimatePresence mode="wait">
                  <NewsList key={`page-${currentPage}`} news={paginatedNews} />
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {news.length > 0 && (
                <div className="flex justify-start mt-16 gap-2 w-full">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${currentPage === 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                      }`}
                    aria-label="Trang trước"
                  >
                    &lt;
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="w-10 h-10 flex items-center justify-center text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors font-medium ${isActive
                          ? "bg-[#0870B4] text-white border-[#0870B4] shadow-md"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                          }`}
                        aria-label={`Trang ${pageNum}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${currentPage === totalPages
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                      }`}
                    aria-label="Trang sau"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-[45px] bg-white">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          <Consult />
        </div>
      </section>
    </div>
  );
}

// Default export cho Pages Router - trả về empty page vì route thực tế nằm ở App Router
export default function NewsPageClientPage() {
  return null;
}
