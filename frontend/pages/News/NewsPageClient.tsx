"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { TrendingUp, Filter, Tag, Inbox, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { FeaturedNews } from "../../components/news/FeaturedNews";
import { NewsList } from "../../components/news/NewsList";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
import { newsHeroData, newsletterData, uiText } from "./data";
import { Consult } from "../../components/public/Consult";
import { motion, AnimatePresence } from "framer-motion";
import { CustomPagination } from "../../components/common/CustomPagination";

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
  locale?: 'vi' | 'en' | 'ja';
}

export function NewsPageClient({
  initialNews,
  initialFeatured,
  categories = [],
  locale = 'vi',
}: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(initialNews || []);
  const [loading, setLoading] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [pageSize, setPageSize] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Localized UI texts
  const uiTexts = {
    vi: {
      showLabel: "Hiển thị:",
      articles6: "6 bài viết",
      articles12: "12 bài viết",
      articles24: "24 bài viết",
      articles48: "48 bài viết",
      noArticlesTitle: "Chưa có bài viết",
      noArticlesMessage: "Hiện tại chưa có bài viết nào để hiển thị. Vui lòng quay lại sau.",
      searchPlaceholder: "Tìm kiếm bài viết...",
      latestTitle: "Bài viết mới nhất",
      latestSubtitle: "Cập nhật tin công ty, sản phẩm và công nghệ từ SFB",
      consultTitle: "Miễn phí tư vấn",
      consultDescription: "Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số.",
      consultPrimaryButton: "Tư vấn miễn phí ngay",
      consultSecondaryButton: "Xem case studies",
    },
    en: {
      showLabel: "Show:",
      articles6: "6 articles",
      articles12: "12 articles",
      articles24: "24 articles",
      articles48: "48 articles",
      noArticlesTitle: "No articles",
      noArticlesMessage: "There are currently no articles to display. Please check back later.",
      searchPlaceholder: "Search articles...",
      latestTitle: "Latest Articles",
      latestSubtitle: "Latest company news, products and technology updates from SFB",
      consultTitle: "Free Consultation",
      consultDescription: "Schedule a free consultation with SFB experts and discover how we can partner with your business on your digital transformation journey.",
      consultPrimaryButton: "Get Free Consultation",
      consultSecondaryButton: "View Case Studies",
    },
    ja: {
      showLabel: "表示:",
      articles6: "6記事",
      articles12: "12記事",
      articles24: "24記事",
      articles48: "48記事",
      noArticlesTitle: "記事がありません",
      noArticlesMessage: "現在表示する記事がありません。後でもう一度確認してください。",
      searchPlaceholder: "記事を検索...",
      latestTitle: "最新記事",
      latestSubtitle: "SFBからの最新の会社ニュース、製品、技術アップデート",
      consultTitle: "無料相談",
      consultDescription: "SFBの専門家による無料相談を予約し、デジタル変革の旅でビジネスとどのようにパートナーシップを組めるかを発見してください。",
      consultPrimaryButton: "今すぐ無料相談",
      consultSecondaryButton: "ケーススタディを見る",
    },
  };

  const t = uiTexts[locale];

  // Localized section headers
  const localizedSectionHeaders = {
    latest: {
      title: t.latestTitle,
      subtitle: t.latestSubtitle,
    },
  };

  // Localized consult data
  const localizedConsultData = {
    title: t.consultTitle,
    description: t.consultDescription,
    buttons: {
      primary: {
        text: t.consultPrimaryButton,
        link: "/contact",
      },
      secondary: {
        text: t.consultSecondaryButton,
        link: "/solutions",
      },
    },
  };

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

  // Filter news by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setNews(initialNews);
      return;
    }

    fetchNews(selectedCategory);
  }, [selectedCategory, fetchNews, initialNews]);

  // Apply search filter (client-side) on current news list
  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) {
      return news;
    }

    const query = searchQuery.toLowerCase().trim();
    return news.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const excerpt = (item.excerpt || "").toLowerCase();
      const categoryName = (item.categoryName || "").toLowerCase();
      return title.includes(query) || excerpt.includes(query) || categoryName.includes(query);
    });
  }, [news, searchQuery]);

  // Reset to page 1 when category, search, or pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, pageSize]);

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
  const totalPages = Math.ceil(filteredNews.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNews = filteredNews.slice(startIndex, endIndex);



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

            {/* Search and Categories */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
              {/* Search Input - Show/Hide */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex-1 min-w-[200px] max-w-md overflow-hidden"
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 transition-all"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Categories */}
              <div className="flex-1 w-full">
                {/* Mobile Dropdown & Search Button */}
                <div className="lg:hidden flex items-stretch gap-2 relative">
                  <div className="flex-1 relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#EAF5FF] text-[#0870B4] rounded-xl font-semibold border border-[#0870B4]/20"
                    >
                      <div className="flex items-center gap-2 max-w-[80%]">
                        <span className="truncate">
                          {categoriesWithCount.find(c => c.id === selectedCategory)?.name || "All"}
                          {categoriesWithCount.find(c => c.id === selectedCategory) ? ` (${categoriesWithCount.find(c => c.id === selectedCategory)?.count})` : ""}
                        </span>
                      </div>
                      {isDropdownOpen ? <ChevronUp size={18} className="shrink-0" /> : <ChevronDown size={18} className="shrink-0" />}
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden flex flex-col max-h-[300px] overflow-y-auto z-50"
                        >
                          {categoriesWithCount.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => {
                                setSelectedCategory(category.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`flex items-center justify-between px-4 py-3 text-left transition-colors
                                                 ${selectedCategory === category.id ? 'bg-[#EAF5FF] text-[#0870B4]' : 'text-gray-600 hover:bg-gray-50'}
                                              `}
                            >
                              <span className="text-sm font-medium">{category.name}</span>
                              <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full border border-gray-100">{category.count}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${showSearch
                      ? "bg-[#0870B4] text-white border-[#0870B4]"
                      : "bg-[#EAF5FF] text-[#0870B4] border-[#0870B4]/20 hover:bg-[#DCEFFF]"
                      }`}
                  >
                    <Search className={`w-5 h-5 ${showSearch ? "text-white" : "text-[#0870B4]"}`} />
                  </button>
                </div>

                {/* Desktop Pills */}
                <div className="hidden lg:flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`p-2 sm:p-2.5 rounded-lg flex items-center justify-center flex-none transition-all cursor-pointer ${showSearch
                      ? "bg-[#0870B4] text-white hover:bg-[#0066A3]"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    aria-label={showSearch ? "Ẩn tìm kiếm" : "Hiện tìm kiếm"}
                    title={showSearch ? "Ẩn tìm kiếm" : "Hiện tìm kiếm"}
                  >
                    <Search
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${showSearch ? "text-white" : "text-gray-600"
                        }`}
                      aria-hidden="true"
                    />
                  </button>
                  {categoriesWithCount.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === category.id
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
          </div>
        </div>
      </section>

      {/* Featured N ews */}

      {initialFeatured && (
        <>
          <section className="py-[45px] bg-white">
            <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
              <FeaturedNews article={initialFeatured} />
            </div>
          </section>

          {/* Divider between Featured and Latest */}
          <div className="bg-white">
            <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
              <div className="h-px w-full bg-[#E5E5E5]" />
            </div>
          </div>
        </>

      )}

      {/* News G rid */}
      <section className="py-[45px] bg-white min-h-[500px]">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{localizedSectionHeaders.latest.title}</h2>
              <p className="text-gray-500">{localizedSectionHeaders.latest.subtitle}</p>
            </motion.div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">{t.showLabel}</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing page size
                  }}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#0870B4] focus:ring-1 focus:ring-[#0870B4] transition-all cursor-pointer hover:border-gray-300"
                >
                  <option value={6}>{t.articles6}</option>
                  <option value={12}>{t.articles12}</option>
                  <option value={24}>{t.articles24}</option>
                  <option value={48}>{t.articles48}</option>
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
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Inbox className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.noArticlesTitle}</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {t.noArticlesMessage}
              </p>
            </div>
          ) : (
            <>
              <div data-news-section>
                <AnimatePresence mode="wait">
                  <NewsList key={`page-${currentPage}`} news={paginatedNews} />
                </AnimatePresence>
              </div>

              {/* Divider between Latest and Pagination */}
              <div className="mt-12">
                <div className="h-px w-full bg-[#E5E5E5]" />
              </div>

              {/* Pagination */}
              {filteredNews.length > 0 && (
                <div className="mt-8 flex justify-start">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="!justify-start"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="pb-[45px] bg-white">
        <div className="mx-auto max-w-[1340px] px-6 2xl:px-0">
          <Consult data={localizedConsultData} locale={locale} />
        </div>
      </section>
    </div>
  );
}

// Default export cho Pages Router - trả về empty page vì route thực tế nằm ở App Router
export default function NewsPageClientPage() {
  return null;
}
