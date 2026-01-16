// Route solutions đã bị tắt
// Để bật lại, uncomment code bên dưới và xóa dòng notFound()

import { notFound } from "next/navigation";
// import { SolutionsPage } from "../../../../pages/Solutions";
// import { generateSeoMetadata } from "@/lib/seo";
// import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
// import { getLocalizedText } from "@/lib/utils/i18n";

// type Locale = 'vi' | 'en' | 'ja';
// const LOCALES: Locale[] = ['vi', 'en', 'ja'];

// export async function generateStaticParams() {
//   return LOCALES.map((locale) => ({ locale }));
// }

// export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
//   const { locale: localeParam } = await params;
//   const locale = localeParam as Locale;
//   if (!LOCALES.includes(locale)) notFound();

//   let seoData = null;
//   try {
//     seoData = await publicApiCall<{ data?: any }>(
//       PublicEndpoints.seo.getByPath('/solutions'),
//       {},
//       locale
//     );
//   } catch (error) {
//     console.error(`Failed to fetch SEO data for solutions page (${locale}):`, error);
//   }

//   const title = seoData?.data?.title 
//     ? getLocalizedText(seoData.data.title, locale)
//     : locale === 'vi' 
//       ? 'Giải pháp - SFB Technology'
//       : locale === 'en'
//         ? 'Solutions - SFB Technology'
//         : 'ソリューション - SFB Technology';

//   const description = seoData?.data?.description
//     ? getLocalizedText(seoData.data.description, locale)
//     : locale === 'vi'
//       ? 'Các giải pháp công nghệ của SFB Technology'
//       : locale === 'en'
//         ? 'Technology solutions from SFB Technology'
//         : 'SFB Technologyのテクノロジーソリューション';

//   return {
//     ...await generateSeoMetadata(`/${locale}/solutions`, { 
//       title, 
//       description,
//       image: seoData?.data?.image || undefined,
//     }, locale),
//     alternates: {
//       languages: {
//         'vi': 'https://sfb.vn/vi/solutions',
//         'en': 'https://sfb.vn/en/solutions',
//         'ja': 'https://sfb.vn/ja/solutions',
//       },
//     },
//   };
// }

export default async function SolutionsRoute({ params }: { params: Promise<{ locale: string }> }) {
  // Route đã bị tắt - trả về 404
  notFound();
  
  // Code cũ (đã comment):
  // const { locale: localeParam } = await params;
  // const locale = localeParam as Locale;
  // if (!LOCALES.includes(locale)) notFound();
  // return <SolutionsPage locale={locale} />;
}
