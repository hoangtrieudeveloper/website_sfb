import { CareersPage } from "../../../../pages/Career";
import { generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
import { getLocalizedText } from "@/lib/utils/i18n";

type Locale = 'vi' | 'en' | 'ja';
const LOCALES: Locale[] = ['vi', 'en', 'ja'];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  let seoData = null;
  try {
    seoData = await publicApiCall<{ data?: any }>(
      PublicEndpoints.seo.getByPath('/careers'),
      {},
      locale
    );
  } catch (error) {
    console.error(`Failed to fetch SEO data for careers page (${locale}):`, error);
  }

  const title = seoData?.data?.title 
    ? getLocalizedText(seoData.data.title, locale)
    : locale === 'vi' 
      ? 'Tuyển dụng - SFB Technology'
      : locale === 'en'
        ? 'Careers - SFB Technology'
        : '採用情報 - SFB Technology';

  const description = seoData?.data?.description
    ? getLocalizedText(seoData.data.description, locale)
    : locale === 'vi'
      ? 'Cơ hội nghề nghiệp tại SFB Technology'
      : locale === 'en'
        ? 'Career opportunities at SFB Technology'
        : 'SFB Technologyでのキャリア機会';

  return {
    ...await generateSeoMetadata(`/${locale}/careers`, { title, description }, locale),
    alternates: {
      languages: {
        'vi': 'https://sfb.vn/vi/careers',
        'en': 'https://sfb.vn/en/careers',
        'ja': 'https://sfb.vn/ja/careers',
      },
    },
  };
}

export default async function CareersRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();
  
  return <CareersPage locale={locale} />;
}
