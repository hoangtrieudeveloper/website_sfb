"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { TrendingUp, Search, Filter } from "lucide-react";
import { FeaturedNews } from "../components/news/FeaturedNews";
import { NewsList } from "../components/news/NewsList";
import { Tag } from "lucide-react";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <TrendingUp className="text-cyan-400" size={20} />
              <span className="text-white font-semibold text-sm">
                TIN TỨC &amp; BLOG
              </span>
            </div>

            <h1 className="text-white mb-8 text-5xl md:text-6xl">
              Cập nhật
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                công nghệ &amp; hoạt động SFB
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10">
              Tin công ty, sản phẩm và tin công nghệ mới nhất từ SFB Technology
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter - Sticky */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-[88px] z-40 backdrop-blur-lg bg-white/95">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="text-gray-600 flex-shrink-0" size={20} />
            {categoriesWithCount.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      {initialFeatured && (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-gray-900 mb-2 text-3xl font-bold">Nổi bật</h2>
              <p className="text-gray-600 text-lg">Bài viết được quan tâm nhất</p>
            </div>
            <FeaturedNews article={initialFeatured} />
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-gray-900 mb-2 text-3xl font-bold">Bài viết mới nhất</h2>
            <p className="text-gray-600 text-lg">
              Cập nhật tin công ty, sản phẩm và công nghệ từ SFB
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4">Đang tải...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Không có bài viết phù hợp với từ khóa / bộ lọc hiện tại.
            </div>
          ) : (
            <>
              <NewsList news={news} />
              
              {/* Load More */}
              <div className="text-center mt-16">
                <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 inline-flex items-center gap-3 font-semibold">
                  Xem thêm bài viết
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-28 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
              <Tag className="text-cyan-400" size={20} />
              <span className="text-white font-semibold text-sm">
                ĐĂNG KÝ NHẬN TIN
              </span>
            </div>

            <h2 className="text-white mb-6">Đăng ký nhận bản tin</h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Nhận tin tức công nghệ mới nhất, case study và tips hữu ích mỗi tuần
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all"
              />
              <button className="px-10 py-5 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold whitespace-nowrap">
                Đăng ký ngay
              </button>
            </div>

            <p className="text-sm text-blue-200 mt-6">
              🔒 Chúng tôi cam kết bảo mật thông tin của bạn
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


export default NewsPageClient;
