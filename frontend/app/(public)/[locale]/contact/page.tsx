import { ContactPage } from "@/pages/Contact";
import { getContactData } from "../../contact/getContactData";
import { generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getLocalizedText } from "@/lib/utils/i18n";
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
import { applyLocale } from "@/lib/utils/i18n";

type Locale = 'vi' | 'en' | 'ja';
const LOCALES: Locale[] = ['vi', 'en', 'ja'];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  // Fetch SEO data for this locale
  let seoData = null;
  try {
    seoData = await publicApiCall<{ data?: any }>(
      PublicEndpoints.seo.getByPath('/contact'),
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
      ? 'Liên hệ - SFB Technology'
      : locale === 'en'
        ? 'Contact Us - SFB Technology'
        : 'お問い合わせ - SFB Technology';

  const description = seoData?.data?.description
    ? getLocalizedText(seoData.data.description, locale)
    : locale === 'vi'
      ? 'Liên hệ với SFB Technology để được tư vấn về các giải pháp công nghệ'
      : locale === 'en'
        ? 'Contact SFB Technology for technology solution consultation'
        : 'テクノロジーソリューションのご相談はSFB Technologyにお問い合わせください';

  const metadata = await generateSeoMetadata(`/${locale}/contact`, { title, description }, locale);
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        'vi': `${baseUrl}/vi/contact`,
        'en': `${baseUrl}/en/contact`,
        'ja': `${baseUrl}/ja/contact`,
        'x-default': `${baseUrl}/vi/contact`,
      },
    },
  };
}

export default async function ContactRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();
  
  const contactData = await getContactData(locale);
  // Apply locale to contact data (backend đã localize nhưng vẫn cần applyLocale để đảm bảo)
  const localizedContactData = contactData ? applyLocale(contactData, locale) : null;
  
  return <ContactPage contactData={localizedContactData} locale={locale} />;
}
