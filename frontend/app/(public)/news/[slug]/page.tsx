import { NewsDetailPageClient } from "../../../../pages/News/NewsDetailPageClient";
import { notFound } from "next/navigation";
import { generateSeoMetadata } from "@/lib/seo";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import { API_BASE_URL } from "@/lib/api/base";
import Script from "next/script";

// Enable ISR - revalidate every 60 seconds for news detail
export const revalidate = 60;

async function getNewsBySlug(slug: string) {
  try {
    const baseUrl = API_BASE_URL;

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
    const baseUrl = API_BASE_URL;

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


export default async function NewsDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedNews(article.categoryId, article.id);

  // Generate structured data for article
  const articleSchema = generateArticleSchema({
    title: article.title,
    excerpt: article.excerpt,
    imageUrl: article.imageUrl,
    publishedDate: article.publishedDate,
    updatedAt: article.updatedAt,
    author: article.author,
  });

  // Generate breadcrumbs schema
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: baseUrl },
    { name: 'Tin tức', url: `${baseUrl}/news` },
    { name: article.title, url: `${baseUrl}/news/${article.slug}` },
  ]);

  return (
    <>
      <Script
        id="article-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NewsDetailPageClient article={article} relatedArticles={relatedArticles} />
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getNewsBySlug(slug);

  if (!article) {
    return {
      title: "Không tìm thấy bài viết",
    };
  }

  const pagePath = `/news/${slug}`;
  
  return await generateSeoMetadata(pagePath, {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    keywords: article.seoKeywords,
    og_title: article.seoTitle || article.title,
    og_description: article.seoDescription || article.excerpt,
    og_image: article.imageUrl,
    og_type: 'article',
    canonical_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn'}${pagePath}`,
  });
}

