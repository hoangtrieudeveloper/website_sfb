import { FieldPage } from "../../../../pages/Field";
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
      PublicEndpoints.seo.getByPath('/industries'),
      {},
      locale
    );
  } catch (error) {
    console.error(`Failed to fetch SEO data for industries page (${locale}):`, error);
  }

  const title = seoData?.data?.title 
    ? getLocalizedText(seoData.data.title, locale)
    : locale === 'vi' 
      ? 'Lĩnh vực - SFB Technology'
      : locale === 'en'
        ? 'Industries - SFB Technology'
        : '業界 - SFB Technology';

  const description = seoData?.data?.description
    ? getLocalizedText(seoData.data.description, locale)
    : locale === 'vi'
      ? 'Khám phá các lĩnh vực ứng dụng của SFB Technology'
      : locale === 'en'
        ? 'Discover SFB Technology\'s application industries'
        : 'SFB Technologyの応用業界を発見';

  return {
    ...await generateSeoMetadata(`/${locale}/industries`, { title, description }, locale),
    alternates: {
      languages: {
        'vi': 'https://sfb.vn/vi/industries',
        'en': 'https://sfb.vn/en/industries',
        'ja': 'https://sfb.vn/ja/industries',
      },
    },
  };
}

export default async function IndustriesRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();
  
  return <FieldPage locale={locale} />;
}
