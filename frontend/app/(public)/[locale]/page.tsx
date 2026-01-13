import { HomepageContent } from "../../../components/homepage";
import { generateSeoMetadata } from "@/lib/seo";
import { generateOrganizationSchema } from "@/lib/structured-data";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getLocalizedText, applyLocale } from "@/lib/utils/i18n";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

type Locale = 'vi' | 'en' | 'ja';
const LOCALES: Locale[] = ['vi', 'en', 'ja'];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  // Fetch SEO data for this locale
  let seoData = null;
  try {
    seoData = await publicApiCall<{ data?: any }>(
      PublicEndpoints.seo.getByPath('/'),
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
      ? 'SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam'
      : locale === 'en'
        ? 'SFB Technology - Leading Technology Solutions in Vietnam'
        : 'SFB Technology - ベトナムのトップテクノロジーソリューション';

  const description = seoData?.data?.description
    ? getLocalizedText(seoData.data.description, locale)
    : locale === 'vi'
      ? 'SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến'
      : locale === 'en'
        ? 'SFB Technology partners with businesses in their digital transformation journey with advanced technology solutions'
        : 'SFB Technologyは、先進的なテクノロジーソリューションで企業のデジタル変革の旅路でパートナーとして同行します';

  const metadata = await generateSeoMetadata(`/${locale}`, { title, description }, locale);
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'vi': `${baseUrl}/vi`,
        'en': `${baseUrl}/en`,
        'ja': `${baseUrl}/ja`,
        'x-default': `${baseUrl}/vi`,
      },
    },
  };
}

// Enable ISR (Incremental Static Regeneration) - revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomepageContent locale={locale} />
    </>
  );
}
