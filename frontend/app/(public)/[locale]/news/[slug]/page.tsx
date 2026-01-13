import { NewsDetailPageClient } from "../../../../../pages/News/NewsDetailPageClient";
import { notFound } from "next/navigation";
import { generateSeoMetadata } from "@/lib/seo";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import { API_BASE_URL } from "@/lib/api/base";
import Script from "next/script";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
import { getLocalizedText, applyLocale } from "@/lib/utils/i18n";

type Locale = 'vi' | 'en' | 'ja';
const LOCALES: Locale[] = ['vi', 'en', 'ja'];

// Enable ISR - revalidate every 60 seconds for news detail
export const revalidate = 60;

async function getNewsBySlug(slug: string, locale: Locale) {
  try {
    const baseUrl = API_BASE_URL;

    const res = await fetch(`${baseUrl}/api/public/news/${slug}`, {
      headers: { 'Accept-Language': locale },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data.success && data.data) {
      return applyLocale(data.data, locale);
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function getRelatedNews(categoryId: string | undefined, excludeId: number | undefined, locale: Locale) {
  if (!categoryId) return [];

  try {
    const baseUrl = API_BASE_URL;

    const res = await fetch(`${baseUrl}/api/public/news?category=${encodeURIComponent(categoryId)}`, {
      headers: { 'Accept-Language': locale },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items = (data.data || []) as any[];
    const filtered = typeof excludeId === "number" ? items.filter((n) => n?.id !== excludeId) : items;
    return filtered.slice(0, 6).map((item: any) => applyLocale(item, locale));
  } catch (error) {
    return [];
  }
}

export async function generateStaticParams() {
  // Fetch all news slugs for all locales
  try {
    const baseUrl = API_BASE_URL;
    // Fetch with default locale (vi) to get all slugs
    const res = await fetch(`${baseUrl}/api/public/news`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept-Language': 'vi',
      },
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    const slugs = (data.data || []).map((item: any) => item.slug) || [];

    return LOCALES.flatMap((locale) =>
      slugs.map((slug: string) => ({ locale, slug }))
    );
  } catch (error) {
    return [];
  }
}

export default async function NewsDetailRoute({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const article = await getNewsBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedNews(article.categoryId, article.id, locale);

  // Generate structured data for article
  const articleSchema = generateArticleSchema({
    title: typeof article.title === 'string' ? article.title : getLocalizedText(article.title, locale),
    excerpt: typeof article.excerpt === 'string' ? article.excerpt : getLocalizedText(article.excerpt, locale),
    imageUrl: article.imageUrl,
    publishedDate: article.publishedDate,
    updatedAt: article.updatedAt,
    author: typeof article.author === 'string' ? article.author : getLocalizedText(article.author, locale),
    locale,
  });

  // Generate breadcrumbs schema
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  const breadcrumbSchema = generateBreadcrumbSchema([
    { 
      name: locale === 'vi' ? 'Trang chủ' : locale === 'en' ? 'Home' : 'ホーム', 
      url: `${baseUrl}/${locale}` 
    },
    { 
      name: locale === 'vi' ? 'Tin tức' : locale === 'en' ? 'News' : 'ニュース', 
      url: `${baseUrl}/${locale}/news` 
    },
    { 
      name: typeof article.title === 'string' ? article.title : getLocalizedText(article.title, locale), 
      url: `${baseUrl}/${locale}/news/${article.slug}` 
    },
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
      <NewsDetailPageClient article={article} relatedArticles={relatedArticles} locale={locale} />
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const article = await getNewsBySlug(slug, locale);

  if (!article) {
    return {
      title: locale === 'vi' ? "Không tìm thấy bài viết" : locale === 'en' ? "Article not found" : "記事が見つかりません",
    };
  }

  const pagePath = `/news/${slug}`;
  const seoTitle = typeof article.seoTitle === 'string' 
    ? article.seoTitle 
    : (article.seoTitle ? getLocalizedText(article.seoTitle, locale) : (typeof article.title === 'string' ? article.title : getLocalizedText(article.title, locale)));
  const seoDescription = typeof article.seoDescription === 'string' 
    ? article.seoDescription 
    : (article.seoDescription ? getLocalizedText(article.seoDescription, locale) : (typeof article.excerpt === 'string' ? article.excerpt : getLocalizedText(article.excerpt, locale)));
  const seoKeywords = typeof article.seoKeywords === 'string' 
    ? article.seoKeywords 
    : (article.seoKeywords ? getLocalizedText(article.seoKeywords, locale) : '');
  
  return await generateSeoMetadata(`/${locale}${pagePath}`, {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    og_title: seoTitle,
    og_description: seoDescription,
    og_image: article.imageUrl,
    og_type: 'article',
    canonical_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn'}/${locale}${pagePath}`,
  }, locale);
}
