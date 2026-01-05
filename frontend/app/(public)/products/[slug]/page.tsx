import { notFound } from "next/navigation";
import { ProductDetailView } from "@/pages/Product/ProductDetail";
import { generateSeoMetadata } from "@/lib/seo";
import { generateProductSchema } from "@/lib/structured-data";
import { API_BASE_URL } from "@/lib/api/base";

// Enable ISR - revalidate every 60 seconds for product detail
export const revalidate = 60;

async function getProductBySlugFromAPI(slug: string) {
  try {
    const baseUrl = API_BASE_URL;
    
    console.log(`[Product API] Fetching product from: ${baseUrl}/api/public/products/${slug}`);
    
    const res = await fetch(`${baseUrl}/api/public/products/${slug}`, {
      next: { revalidate: 60 },
      // Thêm cache control cho dev mode
      cache: process.env.NODE_ENV === "production" ? "default" : "no-store",
    });

    if (!res.ok) {
      console.error(`[Product API] Failed to fetch product ${slug}: ${res.status} ${res.statusText}`);
      // Log response body nếu có
      try {
        const errorBody = await res.text();
        console.error(`[Product API] Error response body:`, errorBody);
      } catch (e) {
        // Ignore
      }
      return null;
    }

    const data = await res.json();
    if (!data.success || !data.data) {
      console.error(`[Product API] Invalid response for product ${slug}:`, data);
      return null;
    }
    
    console.log(`[Product API] Successfully fetched product: ${slug}`);
    return data.data;
  } catch (error: any) {
    console.error(`[Product API] Error fetching product detail for ${slug}:`, error?.message || error);
    // Log thêm thông tin về error
    if (error?.cause) {
      console.error(`[Product API] Error cause:`, error.cause);
    }
    return null;
  }
}

// Transform API data to match ProductDetail interface
function transformProductData(apiData: any): any {
  if (!apiData) return null;

  const detail = apiData.detail || {};
  const showcase = detail.showcase || {};
  const expand = detail.expand || {};

  // Transform numberedSections để đảm bảo có đúng format
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

  // Transform overviewCards
  const overviewCards = (detail.overviewCards || []).map((card: any) => ({
    step: card.step || 0,
    title: card.title || '',
    desc: card.description || card.desc || '',
  }));

  // Transform showcase - Tạo overlay nếu có ít nhất 1 ảnh (back hoặc front)
  const transformedShowcase = {
    title: showcase.title || '',
    desc: showcase.desc || '',
    bullets: showcase.bullets || [],
    ctaText: showcase.ctaText || '',
    ctaHref: showcase.ctaHref || '',
    overlay: showcase.imageBack || showcase.imageFront ? {
      // Chỉ thêm back nếu có imageBack
      ...(showcase.imageBack ? {
        back: {
          src: showcase.imageBack,
          alt: showcase.title || '',
          sizeClass: 'w-[701px] h-[511px]',
          objectClass: 'object-contain',
          frameClass: 'rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden',
        },
      } : {}),
      // Chỉ thêm front nếu có imageFront
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
    metaTop: detail.metaTop || '',
    name: apiData.name || '',
    heroDescription: detail.heroDescription || '',
    heroImage: detail.heroImage || '',
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
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const apiData = await getProductBySlugFromAPI(slug);
  
  if (!apiData) {
    console.error(`[Product Page] Product not found: ${slug}`);
    notFound();
  }

  const product = transformProductData(apiData);
  
  if (!product) {
    console.error(`[Product Page] Failed to transform product data: ${slug}`);
    notFound();
  }

  // Generate structured data for product
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.heroDescription,
    heroImage: product.heroImage,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailView product={product} />
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const apiData = await getProductBySlugFromAPI(slug);
  const product = transformProductData(apiData);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm",
    };
  }

  const pagePath = `/products/${slug}`;

  return await generateSeoMetadata(pagePath, {
    title: product.name || "Sản phẩm",
    description: product.heroDescription || "",
    og_title: product.name || "Sản phẩm",
    og_description: product.heroDescription || "",
    og_image: product.heroImage,
    og_type: 'website', // Next.js chỉ hỗ trợ 'website', 'article', 'book', 'profile'
    canonical_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn'}${pagePath}`,
  });
}
