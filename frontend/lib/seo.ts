import { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/api/base';
import { PLACEHOLDER_DESCRIPTION, PLACEHOLDER_NOT_AVAILABLE } from '@/lib/placeholders';

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  robots_noarchive?: boolean;
  robots_nosnippet?: boolean;
  structured_data?: any;
}

/**
 * Fetch SEO data from API
 */
async function fetchSeoData(pagePath: string): Promise<SeoData | null> {
  try {
    // Encode path để tránh lỗi với các ký tự đặc biệt
    const encodedPath = encodeURIComponent(pagePath);
    const res = await fetch(`${API_BASE_URL}/api/public/seo/${encodedPath}`, {
      next: { revalidate: 3600 }, // Cache 1 hour
      // Thêm timeout
      signal: AbortSignal.timeout(5000), // 5 seconds timeout
    });

    if (!res.ok) {
      // Không log error cho 404 (trang chưa có SEO config)
      if (res.status !== 404 && process.env.NODE_ENV === 'development') {
        console.warn(`[SEO] Failed to fetch SEO data for ${pagePath}: ${res.status}`);
      }
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error: any) {
    // Chỉ log error trong dev mode, không crash app
    if (process.env.NODE_ENV === 'development') {
      // Kiểm tra nếu là connection error (backend không chạy)
      if (error?.code === 'ECONNREFUSED' || error?.cause?.code === 'ECONNREFUSED') {
        console.warn(`[SEO] Backend không khả dụng, sử dụng default SEO data cho ${pagePath}`);
      } else if (error?.name !== 'AbortError') {
        // Không log timeout errors
        console.warn(`[SEO] Error fetching SEO data for ${pagePath}:`, error?.message || error);
      }
    }
    // Luôn return null để fallback về defaultData
    return null;
  }
}

/**
 * Generate SEO metadata for Next.js pages
 */
export async function generateSeoMetadata(
  pagePath: string,
  defaultData?: Partial<SeoData>
): Promise<Metadata> {
  // Fetch SEO data from API
  const seoData = await fetchSeoData(pagePath);

  const title = seoData?.title || defaultData?.title || 'SFB Technology';
  const description = seoData?.description || defaultData?.description || PLACEHOLDER_DESCRIPTION;
  const keywords = seoData?.keywords || defaultData?.keywords;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  const canonicalUrl = seoData?.canonical_url || defaultData?.canonical_url || `${baseUrl}${pagePath}`;

  // Open Graph type validation
  // Next.js chỉ hỗ trợ: 'website', 'article', 'book', 'profile'
  const ogType = seoData?.og_type || defaultData?.og_type || 'website';
  const validOgType = (ogType === 'article' || ogType === 'book' || ogType === 'profile') 
    ? ogType 
    : 'website';

  return {
    title: {
      default: title,
      template: '%s | SFB Technology',
    },
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,

    // Open Graph
    openGraph: {
      type: validOgType as 'website' | 'article' | 'book' | 'profile',
      locale: 'vi_VN',
      url: canonicalUrl,
      siteName: 'SFB Technology',
      title: seoData?.og_title || defaultData?.og_title || title,
      description: seoData?.og_description || defaultData?.og_description || description,
      images: (seoData?.og_image || defaultData?.og_image) ? [
        {
          url: seoData?.og_image || defaultData?.og_image || PLACEHOLDER_NOT_AVAILABLE,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
    },

    // Twitter Card
    twitter: {
      card: (seoData?.twitter_card || defaultData?.twitter_card || 'summary_large_image') as 'summary' | 'summary_large_image',
      title: seoData?.twitter_title || defaultData?.twitter_title || title,
      description: seoData?.twitter_description || defaultData?.twitter_description || description,
      images: (seoData?.twitter_image || defaultData?.twitter_image) ? [seoData?.twitter_image || defaultData?.twitter_image || PLACEHOLDER_NOT_AVAILABLE] : [],
    },

    // Robots
    robots: {
      index: seoData?.robots_index !== false && defaultData?.robots_index !== false,
      follow: seoData?.robots_follow !== false && defaultData?.robots_follow !== false,
      googleBot: {
        index: seoData?.robots_index !== false && defaultData?.robots_index !== false,
        follow: seoData?.robots_follow !== false && defaultData?.robots_follow !== false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical
    alternates: {
      canonical: canonicalUrl,
    },

    // Other
    metadataBase: new URL(baseUrl),
  };
}


