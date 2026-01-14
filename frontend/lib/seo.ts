import { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/api/base';
import { PLACEHOLDER_DESCRIPTION, PLACEHOLDER_NOT_AVAILABLE } from '@/lib/placeholders';
import { getLocalizedText } from '@/lib/utils/i18n';

type Locale = 'vi' | 'en' | 'ja';

interface SeoData {
  title?: string | Record<Locale, string>;
  description?: string | Record<Locale, string>;
  keywords?: string | Record<Locale, string>;
  image?: string;
  og_title?: string | Record<Locale, string>;
  og_description?: string | Record<Locale, string>;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_title?: string | Record<Locale, string>;
  twitter_description?: string | Record<Locale, string>;
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
async function fetchSeoData(pagePath: string, locale?: 'vi' | 'en' | 'ja'): Promise<SeoData | null> {
  try {
    // Encode path để tránh lỗi với các ký tự đặc biệt
    const encodedPath = encodeURIComponent(pagePath);
    
    // Build URL with locale query parameter
    let url = `${API_BASE_URL}/api/public/seo/${encodedPath}`;
    if (locale) {
      url += `?locale=${locale}`;
    }
    
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache 1 hour
      // Thêm timeout
      signal: AbortSignal.timeout(5000), // 5 seconds timeout
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error: any) {
    // Silently fail
    // Luôn return null để fallback về defaultData
    return null;
  }
}

/**
 * Generate SEO metadata for Next.js pages
 */
export async function generateSeoMetadata(
  pagePath: string,
  defaultData?: Partial<SeoData>,
  locale?: 'vi' | 'en' | 'ja'
): Promise<Metadata> {
  // Fetch SEO data from API
  const seoData = await fetchSeoData(pagePath, locale);
  
  // Use provided locale or default to 'vi'
  const currentLocale = locale || 'vi';

  // Localize all fields that might be locale objects
  const title = seoData?.title 
    ? (typeof seoData.title === 'string' ? seoData.title : getLocalizedText(seoData.title, currentLocale))
    : (defaultData?.title 
        ? (typeof defaultData.title === 'string' ? defaultData.title : getLocalizedText(defaultData.title, currentLocale))
        : 'SFB Technology');
  
  const description = seoData?.description
    ? (typeof seoData.description === 'string' ? seoData.description : getLocalizedText(seoData.description, currentLocale))
    : (defaultData?.description
        ? (typeof defaultData.description === 'string' ? defaultData.description : getLocalizedText(defaultData.description, currentLocale))
        : PLACEHOLDER_DESCRIPTION);
  
  const keywords = seoData?.keywords
    ? (typeof seoData.keywords === 'string' ? seoData.keywords : getLocalizedText(seoData.keywords, currentLocale))
    : (defaultData?.keywords
        ? (typeof defaultData.keywords === 'string' ? defaultData.keywords : getLocalizedText(defaultData.keywords, currentLocale))
        : undefined);
  
  const ogTitle = seoData?.og_title
    ? (typeof seoData.og_title === 'string' ? seoData.og_title : getLocalizedText(seoData.og_title, currentLocale))
    : (defaultData?.og_title
        ? (typeof defaultData.og_title === 'string' ? defaultData.og_title : getLocalizedText(defaultData.og_title, currentLocale))
        : title);
  
  const ogDescription = seoData?.og_description
    ? (typeof seoData.og_description === 'string' ? seoData.og_description : getLocalizedText(seoData.og_description, currentLocale))
    : (defaultData?.og_description
        ? (typeof defaultData.og_description === 'string' ? defaultData.og_description : getLocalizedText(defaultData.og_description, currentLocale))
        : description);
  
  const twitterTitle = seoData?.twitter_title
    ? (typeof seoData.twitter_title === 'string' ? seoData.twitter_title : getLocalizedText(seoData.twitter_title, currentLocale))
    : (defaultData?.twitter_title
        ? (typeof defaultData.twitter_title === 'string' ? defaultData.twitter_title : getLocalizedText(defaultData.twitter_title, currentLocale))
        : title);
  
  const twitterDescription = seoData?.twitter_description
    ? (typeof seoData.twitter_description === 'string' ? seoData.twitter_description : getLocalizedText(seoData.twitter_description, currentLocale))
    : (defaultData?.twitter_description
        ? (typeof defaultData.twitter_description === 'string' ? defaultData.twitter_description : getLocalizedText(defaultData.twitter_description, currentLocale))
        : description);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  const canonicalUrl = seoData?.canonical_url || defaultData?.canonical_url || `${baseUrl}${pagePath}`;

  // Open Graph type validation
  // Next.js chỉ hỗ trợ: 'website', 'article', 'book', 'profile'
  const ogType = seoData?.og_type || defaultData?.og_type || 'website';
  const validOgType = (ogType === 'article' || ogType === 'book' || ogType === 'profile') 
    ? ogType 
    : 'website';

  // Set locale based on current locale
  const ogLocale = currentLocale === 'vi' ? 'vi_VN' : currentLocale === 'en' ? 'en_US' : 'ja_JP';
  
  // Set HTML lang attribute
  const htmlLang = currentLocale;

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
      locale: ogLocale,
      url: canonicalUrl,
      siteName: 'SFB Technology',
      title: ogTitle,
      description: ogDescription,
      images: (seoData?.og_image || defaultData?.og_image || seoData?.image || defaultData?.image) ? [
        {
          url: seoData?.og_image || defaultData?.og_image || seoData?.image || defaultData?.image || PLACEHOLDER_NOT_AVAILABLE,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
    },

    // Twitter Card
    twitter: {
      card: (seoData?.twitter_card || defaultData?.twitter_card || 'summary_large_image') as 'summary' | 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: (seoData?.twitter_image || defaultData?.twitter_image || seoData?.image || defaultData?.image) ? [seoData?.twitter_image || defaultData?.twitter_image || seoData?.image || defaultData?.image || PLACEHOLDER_NOT_AVAILABLE] : [],
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
    
    // Set HTML lang attribute via other metadata
    other: {
      'html-lang': htmlLang,
    },
  };
}


