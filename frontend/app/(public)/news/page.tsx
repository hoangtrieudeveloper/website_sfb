import { NewsPageClient } from "../../../pages/News/NewsPageClient";
import { newsList as mockNewsList, categories as mockCategories, featuredNewsData as mockFeatured } from "../../../pages/News/data";

// Enable ISR - revalidate every 30 seconds for news page
export const revalidate = 30;

async function getNews() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_SFB_URL ||
      process.env.API_SFB_URL ||
      "http://localhost:4000";

    // Fetch both all news and featured news
    const [newsRes, featuredRes] = await Promise.all([
      fetch(`${baseUrl}/api/public/news`, {
        next: { revalidate: 30 },
      }),
      fetch(`${baseUrl}/api/public/news/featured`, {
        next: { revalidate: 30 },
      }),
    ]);

    if (!newsRes.ok) {
      const errorText = await newsRes.text();
      console.error("Failed to fetch news:", newsRes.status, errorText);
      return { news: [], featured: null, categories: [] };
    }

    const newsData = await newsRes.json();
    console.log("News data received:", newsData);

    const news = newsData.data || [];

    // Try to get featured news from dedicated endpoint
    let featured = null;
    if (featuredRes.ok) {
      const featuredData = await featuredRes.json();
      if (featuredData.data && featuredData.data.length > 0) {
        featured = featuredData.data[0];
      }
    }

    // If no featured from endpoint, use first news item as fallback
    if (!featured && news.length > 0) {
      featured = news[0];
    }

    // Remove featured from news list to avoid duplication
    const newsWithoutFeatured = featured
      ? news.filter((item: any) => item.id !== featured.id)
      : news;

    return {
      news: newsWithoutFeatured,
      featured,
      categories: [],
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { news: [], featured: null, categories: [] };
  }
}

async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_SFB_URL ||
      process.env.API_SFB_URL ||
      "http://localhost:4000";

    const res = await fetch(`${baseUrl}/api/public/categories`, {
      next: { revalidate: 3600 }, // Cache categories for 1 hour
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch categories:", res.status, errorText);
      return [];
    }

    const data = await res.json();
    console.log("Categories data received:", data);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function NewsRoute() {
  const [newsData, categoriesData] = await Promise.all([
    getNews(),
    getCategories(),
  ]);

  const useMockData = process.env.NEXT_PUBLIC_NEWS_USE_MOCK === "1" || process.env.NODE_ENV !== "production";

  const categoryNameFromId = (categoryId?: string) => {
    if (!categoryId) return undefined;
    return (mockCategories as readonly { id: string; name: string }[]).find((c) => c.id === categoryId)?.name;
  };

  const mapMockItem = (item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    imageUrl: item.imageUrl,
    publishedDate: item.publishedDate,
    categoryId: item.categoryId,
    categoryName: item.categoryName || categoryNameFromId(item.categoryId),
    author: item.author,
    readTime: item.readTime,
    gradient: item.gradient,
  });

  const effectiveNews = useMockData ? mockNewsList.map(mapMockItem) : newsData.news;
  const effectiveFeatured = useMockData ? mapMockItem(mockFeatured) : newsData.featured;
  const effectiveCategoriesData = useMockData ? [] : categoriesData;

  // Map categories for the filter
  const categories = useMockData
    ? (mockCategories as readonly { id: string; name: string }[]).map((c) => ({ id: c.id, name: c.name, code: c.id }))
    : [
        { id: "all", name: "Tất cả", code: "all" },
        ...effectiveCategoriesData.map((cat: any) => ({
          id: cat.code,
          name: cat.name,
          code: cat.code,
        })),
      ];

  return (
    <NewsPageClient
      initialNews={effectiveNews}
      initialFeatured={effectiveFeatured}
      categories={categories}
    />
  );
}


