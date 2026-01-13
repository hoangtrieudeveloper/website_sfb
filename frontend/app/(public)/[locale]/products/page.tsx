import { ProductsPage } from "@/pages/Product";
import { generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getLocalizedText } from "@/lib/utils/i18n";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

type Locale = 'vi' | 'en' | 'ja';
const LOCALES: Locale[] = ['vi', 'en', 'ja'];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Enable ISR - revalidate every 60 seconds for products page
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  // Fetch SEO data for this locale
  let seoData = null;
  try {
    seoData = await publicApiCall<{ data?: any }>(
      PublicEndpoints.seo.getByPath('/products'),
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
      ? 'Sản phẩm & Giải pháp - SFB Technology'
      : locale === 'en'
        ? 'Products & Solutions - SFB Technology'
        : '製品・ソリューション - SFB Technology';

  const description = seoData?.data?.description
    ? getLocalizedText(seoData.data.description, locale)
    : locale === 'vi'
      ? 'Khám phá các sản phẩm và giải pháp công nghệ của SFB Technology'
      : locale === 'en'
        ? 'Discover SFB Technology products and technology solutions'
        : 'SFB Technologyの製品とテクノロジーソリューションを探索';

  const metadata = await generateSeoMetadata(`/${locale}/products`, { title, description }, locale);
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/products`,
      languages: {
        'vi': `${baseUrl}/vi/products`,
        'en': `${baseUrl}/en/products`,
        'ja': `${baseUrl}/ja/products`,
        'x-default': `${baseUrl}/vi/products`,
      },
    },
  };
}

export default async function ProductsRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();
  
  return <ProductsPage locale={locale} />;
}
