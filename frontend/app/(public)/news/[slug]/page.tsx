import { NewsDetailPageClient } from "../../../../pages/News/NewsDetailPageClient";
import { notFound } from "next/navigation";

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

  return <NewsDetailPageClient article={article} />;
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

