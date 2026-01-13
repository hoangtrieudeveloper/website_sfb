/**
 * Structured Data (JSON-LD) generators for SEO
 */

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  contactPoint?: {
    '@type': string;
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string;
  };
  sameAs?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': string;
    name: string;
  };
  publisher?: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  inLanguage?: string;
}

export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  image?: string;
  brand?: {
    '@type': string;
    name: string;
  };
  offers?: {
    '@type': string;
    availability: string;
    priceCurrency: string;
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(
  options?: {
    name?: string;
    url?: string;
    logo?: string;
    phone?: string;
    socialLinks?: string[];
    locale?: 'vi' | 'en' | 'ja';
  }
): OrganizationSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  const locale = options?.locale || 'vi';
  
  // Localize contact type and available language
  const contactTypeMap = {
    vi: 'dịch vụ khách hàng',
    en: 'customer service',
    ja: 'カスタマーサービス',
  };
  
  const availableLanguageMap = {
    vi: 'Vietnamese',
    en: 'English',
    ja: 'Japanese',
  };
  
  const languagesMap = {
    vi: ['Vietnamese', 'English', 'Japanese'],
    en: ['Vietnamese', 'English', 'Japanese'],
    ja: ['Vietnamese', 'English', 'Japanese'],
  };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: options?.name || 'SFB Technology',
    url: options?.url || baseUrl,
    logo: options?.logo || `${baseUrl}/logo.png`,
    ...(options?.phone && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: options.phone,
        contactType: contactTypeMap[locale],
        areaServed: 'VN',
        availableLanguage: languagesMap[locale].join(', '),
      },
    }),
    ...(options?.socialLinks && options.socialLinks.length > 0 && {
      sameAs: options.socialLinks,
    }),
  };
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
} {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(article: {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  publishedDate?: string;
  updatedAt?: string;
  author?: string;
  locale?: 'vi' | 'en' | 'ja';
}): ArticleSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  const locale = article.locale || 'vi';
  
  // Publisher name is consistent across locales, but we can add locale-specific if needed
  const publisherName = 'SFB Technology';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    ...(article.excerpt && { description: article.excerpt }),
    ...(article.imageUrl && { image: article.imageUrl }),
    ...(article.publishedDate && { datePublished: article.publishedDate }),
    ...(article.updatedAt && { dateModified: article.updatedAt }),
    ...(article.author && {
      author: {
        '@type': 'Person',
        name: article.author,
      },
    }),
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    inLanguage: locale === 'vi' ? 'vi-VN' : locale === 'en' ? 'en-US' : 'ja-JP',
  };
}

/**
 * Generate Product schema
 */
export function generateProductSchema(product: {
  name: string;
  description?: string;
  heroImage?: string;
  price?: number;
  currency?: string;
  locale?: 'vi' | 'en' | 'ja';
}): ProductSchema {
  const locale = product.locale || 'vi';
  
  // Currency mapping based on locale
  const currencyMap = {
    vi: 'VND',
    en: 'USD',
    ja: 'JPY',
  };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description && { description: product.description }),
    ...(product.heroImage && { image: product.heroImage }),
    brand: {
      '@type': 'Brand',
      name: 'SFB Technology',
    },
    ...(product.price !== undefined && {
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: product.currency || currencyMap[locale],
        // @ts-expect-error: price is required by schema.org but not in type declaration
        price: product.price,
      }, 
    }),
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
} {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}


