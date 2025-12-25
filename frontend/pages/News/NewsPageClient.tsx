"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { TrendingUp, Filter, Tag } from "lucide-react";
import { FeaturedNews } from "../../components/news/FeaturedNews";
import { NewsList } from "../../components/news/NewsList";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
import { newsHeroData, newsSectionHeaders, newsletterData, uiText } from "./data";
import { Consult } from "../../components/public/Consult";

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
  categories,
}: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

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
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === category.id
                    ? "bg-[#0870B4] text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {category.name}
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
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{newsSectionHeaders.latest.title}</h2>
              <p className="text-gray-500">{newsSectionHeaders.latest.subtitle}</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0870B4]"></div>
              <p className="mt-4">{uiText.loading}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              {uiText.noResults}
            </div>
          ) : (
            <>
              <NewsList
                news={news}
              />

              {/* Pagination Mock */}
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

export default NewsPageClient;
