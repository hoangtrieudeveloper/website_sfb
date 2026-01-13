import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/api/base';

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
  } catch (error) {
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
  } catch (error) {
    return [];
  }
}

const LOCALES = ['vi', 'en', 'ja'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static pages với tất cả locales
  const staticPages = ['', '/products', '/about', '/contact', '/news', '/industries', '/careers'];
  
  staticPages.forEach((page) => {
    LOCALES.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: {
            vi: `${baseUrl}/vi${page}`,
            en: `${baseUrl}/en${page}`,
            ja: `${baseUrl}/ja${page}`,
          },
        },
      });
    });
  });

  // Dynamic pages - fetch from API
  const [products, news] = await Promise.all([
    fetchProducts(),
    fetchPublishedNews(),
  ]);

  // Product pages với tất cả locales
  products.forEach((product) => {
    LOCALES.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/products/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            vi: `${baseUrl}/vi/products/${product.slug}`,
            en: `${baseUrl}/en/products/${product.slug}`,
            ja: `${baseUrl}/ja/products/${product.slug}`,
          },
        },
      });
    });
  });

  // News pages với tất cả locales
  news.forEach((article) => {
    LOCALES.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/news/${article.slug}`,
        lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            vi: `${baseUrl}/vi/news/${article.slug}`,
            en: `${baseUrl}/en/news/${article.slug}`,
            ja: `${baseUrl}/ja/news/${article.slug}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}


