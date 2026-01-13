import { NewsPageClient } from "@/pages/News/NewsPageClient";
import { API_BASE_URL } from "@/lib/api/base";
import { generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getLocalizedText } from "@/lib/utils/i18n";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
import { applyLocale } from "@/lib/utils/i18n";

type Locale = 'vi' | 'en' | 'ja';
const LOCALES: Locale[] = ['vi', 'en', 'ja'];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Enable ISR - revalidate every 30 seconds for news page
export const revalidate = 30;

async function getNews(locale: Locale) {
  try {
    const baseUrl = API_BASE_URL;

    // Fetch both all news and featured news with locale header
    const [newsRes, featuredRes] = await Promise.all([
      fetch(`${baseUrl}/api/public/news`, {
        next: { revalidate: 30 },
        headers: {
          'Accept-Language': locale,
        },
      }),
      fetch(`${baseUrl}/api/public/news/featured`, {
        next: { revalidate: 30 },
        headers: {
          'Accept-Language': locale,
        },
      }),
    ]);

    if (!newsRes.ok) {
      return { news: [], featured: null, categories: [] };
    }

    const newsData = await newsRes.json();
    const news = newsData.data || [];

    // Try to get featured news from dedicated endpoint
    let featured = null;
    if (featuredRes.ok) {
      const featuredData = await featuredRes.json();
      if (featuredData.data && featuredData.data.length > 0) {
        featured = applyLocale(featuredData.data[0], locale);
      }
    }

    // If no featured from endpoint, use first news item as fallback
    if (!featured && news.length > 0) {
      featured = applyLocale(news[0], locale);
    }

    // Remove featured from news list to avoid duplication
    const newsWithoutFeatured = featured
      ? news.filter((item: any) => item.id !== featured.id).map((item: any) => applyLocale(item, locale))
      : news.map((item: any) => applyLocale(item, locale));

    return {
      news: newsWithoutFeatured,
      featured,
      categories: [],
    };
  } catch (error) {
    return { news: [], featured: null, categories: [] };
  }
}

async function getCategories(locale: Locale) {
  try {
    const baseUrl = API_BASE_URL;

    const res = await fetch(`${baseUrl}/api/public/categories`, {
      next: { revalidate: 3600 }, // Cache categories for 1 hour
      headers: {
        'Accept-Language': locale,
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return (data.data || []).map((cat: any) => applyLocale(cat, locale));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  // Fetch SEO data for this locale
  let seoData = null;
  try {
    seoData = await publicApiCall<{ data?: any }>(
      PublicEndpoints.seo.getByPath('/news'),
      {},
      locale
    );
  } catch (error) {
    // Silently fail, use defaults
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  
  const title = seoData?.data?.title 
    ? getLocalizedText(seoData.data.title, locale)
    : locale === 'vi' 
      ? 'Tin tức - SFB Technology'
      : locale === 'en'
        ? 'News - SFB Technology'
        : 'ニュース - SFB Technology';

  const description = seoData?.data?.description
    ? getLocalizedText(seoData.data.description, locale)
    : locale === 'vi'
      ? 'Cập nhật tin tức mới nhất về công nghệ, sản phẩm và hoạt động của SFB Technology'
      : locale === 'en'
        ? 'Latest news about technology, products and activities of SFB Technology'
        : 'SFB Technologyのテクノロジー、製品、活動に関する最新ニュース';

  const metadata = await generateSeoMetadata(`/${locale}/news`, { title, description }, locale);
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/news`,
      languages: {
        'vi': `${baseUrl}/vi/news`,
        'en': `${baseUrl}/en/news`,
        'ja': `${baseUrl}/ja/news`,
        'x-default': `${baseUrl}/vi/news`,
      },
    },
  };
}

export default async function NewsRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const [newsData, categoriesData] = await Promise.all([
    getNews(locale),
    getCategories(locale),
  ]);

  // Map categories for the filter
  const categories = [
    { id: "all", name: locale === 'vi' ? "Tất cả" : locale === 'en' ? "All" : "すべて", code: "all" },
    ...(categoriesData || []).map((cat: any) => ({
      id: cat.code,
      name: typeof cat.name === 'string' ? cat.name : getLocalizedText(cat.name, locale),
      code: cat.code,
    })),
  ];

  return (
    <NewsPageClient
      initialNews={newsData.news || []}
      initialFeatured={newsData.featured || null}
      categories={categories}
      locale={locale}
    />
  );
}
