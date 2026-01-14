import { AboutPage } from "@/pages/About";
import { generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getLocalizedText } from "@/lib/utils/i18n";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

type Locale = 'vi' | 'en' | 'ja';
const LOCALES: Locale[] = ['vi', 'en', 'ja'];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Enable ISR - revalidate every 3600 seconds (1 hour) for about page
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  // Fetch SEO data for this locale
  let seoData = null;
  try {
    seoData = await publicApiCall<{ data?: any }>(
      PublicEndpoints.seo.getByPath('/about'),
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
      ? 'Về chúng tôi - SFB Technology'
      : locale === 'en'
        ? 'About Us - SFB Technology'
        : '私たちについて - SFB Technology';

  const description = seoData?.data?.description
    ? getLocalizedText(seoData.data.description, locale)
    : locale === 'vi'
      ? 'Tìm hiểu về SFB Technology - Công ty công nghệ hàng đầu Việt Nam'
      : locale === 'en'
        ? 'Learn about SFB Technology - Leading technology company in Vietnam'
        : 'ベトナムのトップテクノロジー企業、SFB Technologyについて学ぶ';

  const metadata = await generateSeoMetadata(`/${locale}/about`, { 
    title, 
    description,
    image: seoData?.data?.image || undefined,
  }, locale);
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        'vi': `${baseUrl}/vi/about`,
        'en': `${baseUrl}/en/about`,
        'ja': `${baseUrl}/ja/about`,
        'x-default': `${baseUrl}/vi/about`,
      },
    },
  };
}

export default async function AboutRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();
  
  return <AboutPage locale={locale} />;
}
