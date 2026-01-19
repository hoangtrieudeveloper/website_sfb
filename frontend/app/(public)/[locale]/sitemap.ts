import { MetadataRoute } from "next";
import { API_BASE_URL } from "@/lib/api/base";

const LOCALES = ["vi", "en", "ja"] as const;
type Locale = (typeof LOCALES)[number];

interface Product {
  slug: string;
  updated_at?: string;
}

interface News {
  slug: string;
  updated_at?: string;
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/products`, {
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function fetchPublishedNews(): Promise<News[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/news`, {
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(
  context?: { params?: { locale?: string } }
): Promise<MetadataRoute.Sitemap> {
  // Next có thể gọi sitemap() không truyền context trong một số trường hợp
  const localeParam = context?.params?.locale as Locale | undefined;
  const locale = localeParam && LOCALES.includes(localeParam) ? localeParam : "vi";

  // Nếu locale không hợp lệ, trả về rỗng để tránh lỗi runtime
  if (!LOCALES.includes(locale)) return [];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sfb.vn";

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static pages for this locale
  const staticPages = ["", "/products", "/about", "/contact", "/news", "/industries", "/careers"];

  staticPages.forEach((page) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 1 : 0.8,
    });
  });

  // Dynamic pages - fetch from API
  const [products, news] = await Promise.all([fetchProducts(), fetchPublishedNews()]);

  // Product pages for this locale
  products.forEach((product) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // News pages for this locale
  news.forEach((article) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/news/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  return sitemapEntries;
}

