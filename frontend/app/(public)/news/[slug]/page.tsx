import { NewsDetailPageClient } from "../../../../pages/News/NewsDetailPageClient";
import { notFound } from "next/navigation";
import {
  newsList as mockNewsList,
  featuredNewsData as mockFeatured,
  categories as mockCategories,
} from "../../../../pages/News/data";

// Enable ISR - revalidate every 60 seconds for news detail
export const revalidate = 60;

async function getNewsBySlug(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_SFB_URL ||
      process.env.API_SFB_URL ||
      "http://localhost:4000";

    const res = await fetch(`${baseUrl}/api/public/news/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return null;
  }
}

async function getRelatedNews(categoryId: string | undefined, excludeId: number | undefined) {
  if (!categoryId) return [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_SFB_URL ||
      process.env.API_SFB_URL ||
      "http://localhost:4000";

    const res = await fetch(`${baseUrl}/api/public/news?category=${encodeURIComponent(categoryId)}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items = (data.data || []) as any[];
    const filtered = typeof excludeId === "number" ? items.filter((n) => n?.id !== excludeId) : items;
    return filtered.slice(0, 6);
  } catch (error) {
    console.error("Error fetching related news:", error);
    return [];
  }
}

function getMockArticleBySlug(slug: string) {
  const allMock = [mockFeatured, ...mockNewsList] as any[];
  const found = allMock.find((item) => item?.slug === slug);
  if (!found) return null;

  const categoryNameFromId = (categoryId?: string) => {
    if (!categoryId) return undefined;
    return (mockCategories as readonly { id: string; name: string }[]).find((c) => c.id === categoryId)?.name;
  };

  return {
    id: found.id,
    title: found.title,
    slug: found.slug,
    excerpt: found.excerpt,
    content: found.content || found.excerpt || "",
    categoryId: found.categoryId,
    categoryName: found.categoryName || categoryNameFromId(found.categoryId),
    imageUrl: found.imageUrl || found.image,
    author: found.author,
    readTime: found.readTime,
    gradient: found.gradient,
    publishedDate: found.publishedDate || found.date,
    seoTitle: found.seoTitle,
    seoDescription: found.seoDescription,
    seoKeywords: found.seoKeywords,
  };
}

function getMockRelatedArticles(categoryId: string | undefined, excludeSlug: string) {
  const allMock = [mockFeatured, ...mockNewsList] as any[];
  const filtered = allMock.filter((item) => item?.slug !== excludeSlug);
  const sameCategory = categoryId ? filtered.filter((item) => item?.categoryId === categoryId) : filtered;
  return sameCategory.slice(0, 6).map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    categoryId: item.categoryId,
    imageUrl: item.imageUrl || item.image,
    publishedDate: item.publishedDate || item.date,
  }));
}

export default async function NewsDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useMockData =
    process.env.NEXT_PUBLIC_NEWS_USE_MOCK === "1" ||
    process.env.NODE_ENV !== "production";

  const article = useMockData ? getMockArticleBySlug(slug) : await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = useMockData
    ? getMockRelatedArticles(article.categoryId, slug)
    : await getRelatedNews(article.categoryId, article.id);

  return <NewsDetailPageClient article={article} relatedArticles={relatedArticles} />;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useMockData =
    process.env.NEXT_PUBLIC_NEWS_USE_MOCK === "1" ||
    process.env.NODE_ENV !== "production";

  const article = useMockData ? getMockArticleBySlug(slug) : await getNewsBySlug(slug);

  if (!article) {
    return {
      title: "Không tìm thấy bài viết",
    };
  }

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    keywords: article.seoKeywords,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

