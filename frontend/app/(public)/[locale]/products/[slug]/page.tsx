import { notFound } from "next/navigation";
import { ProductDetailView } from "@/pages/Product/ProductDetail";
import { generateSeoMetadata } from "@/lib/seo";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import { API_BASE_URL } from "@/lib/api/base";
import Script from "next/script";
import { getLocalizedText, applyLocale } from "@/lib/utils/i18n";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

type Locale = 'vi' | 'en' | 'ja';
const LOCALES: Locale[] = ['vi', 'en', 'ja'];

export async function generateStaticParams() {
  // This would need to fetch all product slugs for all locales
  // For now, return empty array and let Next.js generate on demand
  return [];
}

// Enable ISR - revalidate every 60 seconds for product detail
export const revalidate = 60;

async function getProductBySlugFromAPI(slug: string, locale: Locale) {
  try {
    const baseUrl = API_BASE_URL;
    
    const res = await fetch(`${baseUrl}/api/public/products/${slug}`, {
      next: { revalidate: 60 },
      cache: process.env.NODE_ENV === "production" ? "default" : "no-store",
      headers: {
        'Accept-Language': locale,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data.success || !data.data) {
      return null;
    }
    
    return data.data;
  } catch (error: any) {
    return null;
  }
}

// Transform API data to match ProductDetail interface
function transformProductData(apiData: any, locale: Locale): any {
  if (!apiData) return null;

  const detail = apiData.detail || {};
  const showcase = detail.showcase || {};
  const expand = detail.expand || {};

  // Apply locale to all translatable fields
  const localizedApiData = applyLocale(apiData, locale);
  const localizedDetail = applyLocale(detail, locale);
  const localizedShowcase = applyLocale(showcase, locale);
  const localizedExpand = applyLocale(expand, locale);

  // Transform numberedSections
  const numberedSections = (localizedDetail.numberedSections || []).map((section: any) => ({
    no: section.sectionNo || section.no || 0,
    title: typeof section.title === 'string' ? section.title : getLocalizedText(section.title, locale),
    paragraphs: (section.paragraphs || []).map((p: any) => typeof p === 'string' ? p : getLocalizedText(p, locale)),
    image: section.image || section.imageBack || '',
    imageAlt: typeof section.imageAlt === 'string' ? section.imageAlt : getLocalizedText(section.imageAlt, locale),
    imageSide: section.imageSide || 'left',
    overlay: section.imageBack || section.imageFront ? {
      back: {
        src: section.imageBack || section.image || '',
        alt: typeof section.imageAlt === 'string' ? section.imageAlt : getLocalizedText(section.imageAlt, locale),
        sizeClass: 'w-[701px] h-[511px]',
        frameClass: 'rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)]',
      },
      ...(section.imageFront ? {
        front: {
          src: section.imageFront,
          alt: typeof section.imageAlt === 'string' ? section.imageAlt : getLocalizedText(section.imageAlt, locale),
          sizeClass: 'w-[400px] h-[300px]',
          frameClass: 'rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)]',
        },
      } : {}),
    } : undefined,
  }));

  // Transform overviewCards
  const overviewCards = (localizedDetail.overviewCards || []).map((card: any) => ({
    step: card.step || 0,
    title: typeof card.title === 'string' ? card.title : getLocalizedText(card.title, locale),
    desc: typeof card.desc === 'string' ? card.desc : typeof card.description === 'string' ? card.description : getLocalizedText(card.description || card.desc, locale),
  }));

  // Transform showcase
  const transformedShowcase = {
    title: typeof localizedShowcase.title === 'string' ? localizedShowcase.title : getLocalizedText(localizedShowcase.title, locale),
    desc: typeof localizedShowcase.desc === 'string' ? localizedShowcase.desc : getLocalizedText(localizedShowcase.desc, locale),
    bullets: (localizedShowcase.bullets || []).map((b: any) => typeof b === 'string' ? b : getLocalizedText(b, locale)),
    ctaText: typeof localizedShowcase.ctaText === 'string' ? localizedShowcase.ctaText : getLocalizedText(localizedShowcase.ctaText, locale),
    ctaHref: localizedShowcase.ctaHref || '',
    overlay: localizedShowcase.imageBack || localizedShowcase.imageFront ? {
      ...(localizedShowcase.imageBack ? {
        back: {
          src: localizedShowcase.imageBack,
          alt: typeof localizedShowcase.title === 'string' ? localizedShowcase.title : getLocalizedText(localizedShowcase.title, locale),
          sizeClass: 'w-[701px] h-[511px]',
          objectClass: 'object-contain',
          frameClass: 'rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden',
        },
      } : {}),
      ...(localizedShowcase.imageFront ? {
        front: {
          src: localizedShowcase.imageFront,
          alt: typeof localizedShowcase.title === 'string' ? localizedShowcase.title : getLocalizedText(localizedShowcase.title, locale),
          sizeClass: 'w-[400px] h-[300px]',
          positionClass: 'absolute left-[183.5px] bottom-0',
          objectClass: 'object-contain',
          frameClass: 'rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden',
        },
      } : {}),
    } : undefined,
  };

  return {
    slug: localizedApiData.slug || '',
    contentMode: localizedDetail.contentMode || 'config',
    contentHtml: typeof localizedDetail.contentHtml === 'string' ? localizedDetail.contentHtml : getLocalizedText(localizedDetail.contentHtml, locale),
    metaTop: typeof localizedDetail.metaTop === 'string' ? localizedDetail.metaTop : getLocalizedText(localizedDetail.metaTop, locale),
    meta: typeof localizedApiData.meta === 'string' ? localizedApiData.meta : getLocalizedText(localizedApiData.meta, locale),
    name: typeof localizedApiData.name === 'string' ? localizedApiData.name : getLocalizedText(localizedApiData.name, locale),
    heroDescription: typeof localizedDetail.heroDescription === 'string' ? localizedDetail.heroDescription : getLocalizedText(localizedDetail.heroDescription, locale),
    heroImage: localizedDetail.heroImage || '',
    seoTitle: typeof localizedApiData.seoTitle === 'string' ? localizedApiData.seoTitle : getLocalizedText(localizedApiData.seoTitle, locale),
    seoDescription: typeof localizedApiData.seoDescription === 'string' ? localizedApiData.seoDescription : getLocalizedText(localizedApiData.seoDescription, locale),
    seoKeywords: typeof localizedApiData.seoKeywords === 'string' ? localizedApiData.seoKeywords : getLocalizedText(localizedApiData.seoKeywords, locale),
    overviewKicker: typeof localizedDetail.overviewKicker === 'string' ? localizedDetail.overviewKicker : getLocalizedText(localizedDetail.overviewKicker, locale),
    overviewTitle: typeof localizedDetail.overviewTitle === 'string' ? localizedDetail.overviewTitle : getLocalizedText(localizedDetail.overviewTitle, locale),
    overviewCards: overviewCards,
    showcase: transformedShowcase,
    numberedSections: numberedSections,
    expandTitle: typeof localizedExpand.title === 'string' ? localizedExpand.title : getLocalizedText(localizedExpand.title, locale),
    expandBullets: (localizedExpand.bullets || []).map((b: any) => typeof b === 'string' ? b : getLocalizedText(b, locale)),
    expandCtaText: typeof localizedExpand.ctaText === 'string' ? localizedExpand.ctaText : getLocalizedText(localizedExpand.ctaText, locale),
    expandCtaHref: localizedExpand.ctaHref || '',
    expandImage: localizedExpand.image || '',
    galleryTitle: typeof localizedDetail.galleryTitle === 'string' ? localizedDetail.galleryTitle : getLocalizedText(localizedDetail.galleryTitle, locale),
    galleryImages: (() => {
      if (!localizedDetail.galleryImages) return [];
      if (Array.isArray(localizedDetail.galleryImages)) return localizedDetail.galleryImages;
      if (typeof localizedDetail.galleryImages === 'string') {
        try {
          const parsed = JSON.parse(localizedDetail.galleryImages);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }
      return [];
    })(),
    galleryPosition: localizedDetail.galleryPosition || 'top',
    showTableOfContents: localizedDetail.showTableOfContents !== false,
    enableShareButtons: localizedDetail.enableShareButtons !== false,
    showAuthorBox: localizedDetail.showAuthorBox !== false,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  
  if (!LOCALES.includes(locale)) notFound();

  const apiData = await getProductBySlugFromAPI(slug, locale);
  
  if (!apiData) {
    notFound();
  }

  const product = transformProductData(apiData, locale);
  
  if (!product) {
    notFound();
  }

  // Generate structured data for product
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.heroDescription,
    heroImage: product.heroImage,
  });

  // Generate breadcrumbs schema
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: locale === 'vi' ? 'Trang chủ' : locale === 'en' ? 'Home' : 'ホーム', url: `${baseUrl}/${locale}` },
    { name: locale === 'vi' ? 'Sản phẩm' : locale === 'en' ? 'Products' : '製品', url: `${baseUrl}/${locale}/products` },
    { name: product.name, url: `${baseUrl}/${locale}/products/${product.slug}` },
  ]);

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailView product={product} locale={locale} />
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  
  if (!LOCALES.includes(locale)) notFound();

  const apiData = await getProductBySlugFromAPI(slug, locale);
  const product = transformProductData(apiData, locale);

  if (!product) {
    return {
      title: locale === 'vi' ? "Không tìm thấy sản phẩm" : locale === 'en' ? "Product not found" : "製品が見つかりません",
    };
  }

  const pagePath = `/${locale}/products/${slug}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';

  // Use SEO fields from database
  const seoTitle = product.seoTitle || product.name || (locale === 'vi' ? "Sản phẩm" : locale === 'en' ? "Product" : "製品");
  const seoDescription = product.seoDescription || product.heroDescription || "";
  const seoKeywords = product.seoKeywords || "";

  const metadata = await generateSeoMetadata(pagePath, {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    og_title: seoTitle,
    og_description: seoDescription,
    og_image: product.heroImage || product.image || "",
    og_type: 'website',
    canonical_url: `${baseUrl}${pagePath}`,
  }, locale);
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}${pagePath}`,
      languages: {
        'vi': `${baseUrl}/vi/products/${slug}`,
        'en': `${baseUrl}/en/products/${slug}`,
        'ja': `${baseUrl}/ja/products/${slug}`,
        'x-default': `${baseUrl}/vi/products/${slug}`,
      },
    },
  };
}
