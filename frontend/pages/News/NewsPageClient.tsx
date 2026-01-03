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
      console.error("Error fetching filtered news:", error);
      // Fallback to initial news on error
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
        console.error("Error fetching category counts:", error);
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
              {categoriesWithCount.map((category) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === category.id
                    ? "bg-[#0870B4] text-white shadow-md select-none"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {category.name} ({category.count})
                </motion.button>
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
              viewport={{ once: false }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{newsSectionHeaders.latest.title}</h2>
              <p className="text-gray-500">{newsSectionHeaders.latest.subtitle}</p>
            </motion.div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Hiển thị:</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
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
            <AnimatePresence mode="wait">
              <NewsList
                news={news.slice(0, pageSize)}
              />

              {/* Pagination Mock - Hide if less items than pageSize */}
              {news.length > pageSize && (
                <div className="flex justify-center mt-16 gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0870B4] transition-colors">
                    &lt;
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0870B4] text-white shadow-md font-medium">
                    1
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#0870B4] transition-colors font-medium">
                    2
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#0870B4] transition-colors font-medium">
                    3
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0870B4] transition-colors">
                    &gt;
                  </button>
                </div>
              )}
            </AnimatePresence>
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
