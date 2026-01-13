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
    // Sử dụng publicApiCall để đảm bảo header Accept-Language được set đúng
    const data = await publicApiCall<{ success: boolean; data: any }>(
      `/api/public/products/${slug}`,
      {},
      locale
    );
    
    if (!data.success || !data.data) {
      return null;
    }
    
    // Backend đã localize data, nhưng vẫn apply locale ở frontend để đảm bảo
    return applyLocale(data.data, locale);
  } catch (error: any) {
    return null;
  }
}

// Transform API data to match ProductDetail interface
// Backend đã localize data, nhưng vẫn cần transform structure để match interface
function transformProductData(apiData: any, locale: Locale): any {
  if (!apiData) return null;

  // Backend đã localize, chỉ cần transform structure
  const detail = apiData.detail || {};
  const showcase = detail.showcase || {};
  const expand = detail.expand || {};

  // Transform numberedSections - data đã được localize từ backend
  const numberedSections = (detail.numberedSections || []).map((section: any) => ({
    no: section.sectionNo || section.no || 0,
    title: section.title || '',
    paragraphs: section.paragraphs || [],
    image: section.image || section.imageBack || '',
    imageAlt: section.imageAlt || '',
    imageSide: section.imageSide || 'left',
    overlay: section.imageBack || section.imageFront ? {
      back: {
        src: section.imageBack || section.image || '',
        alt: section.imageAlt || '',
        sizeClass: 'w-[701px] h-[511px]',
        frameClass: 'rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)]',
      },
      ...(section.imageFront ? {
        front: {
          src: section.imageFront,
          alt: section.imageAlt || '',
          sizeClass: 'w-[400px] h-[300px]',
          frameClass: 'rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)]',
        },
      } : {}),
    } : undefined,
  }));

  // Transform overviewCards - data đã được localize từ backend
  const overviewCards = (detail.overviewCards || []).map((card: any) => ({
    step: card.step || 0,
    title: card.title || '',
    desc: card.desc || card.description || '',
  }));

  // Transform showcase - data đã được localize từ backend
  const transformedShowcase = {
    title: showcase.title || '',
    desc: showcase.desc || '',
    bullets: showcase.bullets || [],
    ctaText: showcase.ctaText || '',
    ctaHref: showcase.ctaHref || '',
    overlay: showcase.imageBack || showcase.imageFront ? {
      ...(showcase.imageBack ? {
        back: {
          src: showcase.imageBack,
          alt: showcase.title || '',
          sizeClass: 'w-[701px] h-[511px]',
          objectClass: 'object-contain',
          frameClass: 'rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden',
        },
      } : {}),
      ...(showcase.imageFront ? {
        front: {
          src: showcase.imageFront,
          alt: showcase.title || '',
          sizeClass: 'w-[400px] h-[300px]',
          positionClass: 'absolute left-[183.5px] bottom-0',
          objectClass: 'object-contain',
          frameClass: 'rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden',
        },
      } : {}),
    } : undefined,
  };

  return {
    slug: apiData.slug || '',
    contentMode: detail.contentMode || 'config',
    contentHtml: detail.contentHtml || '',
    metaTop: detail.metaTop || '',
    meta: apiData.meta || '',
    name: apiData.name || '',
    heroDescription: detail.heroDescription || '',
    heroImage: detail.heroImage || '',
    seoTitle: apiData.seoTitle || '',
    seoDescription: apiData.seoDescription || '',
    seoKeywords: apiData.seoKeywords || '',
    overviewKicker: detail.overviewKicker || '',
    overviewTitle: detail.overviewTitle || '',
    overviewCards: overviewCards,
    showcase: transformedShowcase,
    numberedSections: numberedSections,
    expandTitle: expand.title || '',
    expandBullets: expand.bullets || [],
    expandCtaText: expand.ctaText || '',
    expandCtaHref: expand.ctaHref || '',
    expandImage: expand.image || '',
    galleryTitle: detail.galleryTitle || '',
    galleryImages: (() => {
      if (!detail.galleryImages) return [];
      if (Array.isArray(detail.galleryImages)) return detail.galleryImages;
      if (typeof detail.galleryImages === 'string') {
        try {
          const parsed = JSON.parse(detail.galleryImages);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }
      return [];
    })(),
    galleryPosition: detail.galleryPosition || 'top',
    showTableOfContents: detail.showTableOfContents !== false,
    enableShareButtons: detail.enableShareButtons !== false,
    showAuthorBox: detail.showAuthorBox !== false,
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
    locale,
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
