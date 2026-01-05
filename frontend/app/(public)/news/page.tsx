import { NewsPageClient } from "../../../pages/News/NewsPageClient";
import { API_BASE_URL } from "@/lib/api/base";

// Enable ISR - revalidate every 30 seconds for news page
export const revalidate = 30;

async function getNews() {
  try {
    const baseUrl = API_BASE_URL;

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
    const baseUrl = API_BASE_URL;

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

import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return await generateSeoMetadata('/news', {
    title: 'Tin tức - SFB Technology',
    description: 'Cập nhật tin tức mới nhất về công nghệ, sản phẩm và hoạt động của SFB Technology',
  });
}

export default async function NewsRoute() {
  const [newsData, categoriesData] = await Promise.all([
    getNews(),
    getCategories(),
  ]);

  // Map categories for the filter
  const categories = [
    { id: "all", name: "Tất cả", code: "all" },
    ...(categoriesData || []).map((cat: any) => ({
      id: cat.code,
      name: cat.name,
      code: cat.code,
    })),
  ];

  return (
    <NewsPageClient
      initialNews={newsData.news || []}
      initialFeatured={newsData.featured || null}
      categories={categories}
    />
  );
}


