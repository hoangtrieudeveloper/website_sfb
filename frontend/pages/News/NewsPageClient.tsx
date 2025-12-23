"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { TrendingUp, Search, Filter, Tag } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Fetch news with filters
  const fetchNews = useCallback(async (category: string, search: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (category && category !== "all") {
        const categoryCode = categories.find((c) => c.id === category)?.code || category;
        if (categoryCode && categoryCode !== "all") {
          params.append("category", categoryCode);
        }
      }

      if (search.trim()) {
        params.append("search", search.trim());
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

  // Debounced search effect
  useEffect(() => {
    // Don't fetch on initial mount if no filters are applied
    if (selectedCategory === "all" && !searchQuery.trim()) {
      setNews(initialNews);
      return;
    }

    const timer = setTimeout(() => {
      fetchNews(selectedCategory, searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, fetchNews, initialNews]);

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
        <div className="container mx-auto px-6">
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

            {/* Search - Compact */}
            <div className="relative w-full md:w-64 flex-shrink-0">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0870B4] transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {initialFeatured && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <FeaturedNews article={initialFeatured} />
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-12 bg-white min-h-[500px]">
        <div className="container mx-auto px-6">
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
                news={news.length > 0 && news.length < 12
                  ? Array(12).fill(null).map((_, i) => ({
                    ...news[i % news.length],
                    id: 10000 + i // Ensure unique ID for React keys
                  }))
                  : news
                }
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


      <Consult />
    </div>
  );
}

export default NewsPageClient;
