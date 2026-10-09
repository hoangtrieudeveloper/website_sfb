import { Hs2PrivacyPolicy } from "@/pages/Legal/Hs2PrivacyPolicy";
import { generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type Locale = "vi" | "en" | "ja";
const LOCALES: Locale[] = ["vi", "en", "ja"];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sfb.vn";
  const path = "/chinh-sach-quyen-rieng-tu-hs2";
  const title = "Chính sách quyền riêng tư — ứng dụng HS2";
  const description =
    "Chính sách quyền riêng tư của ứng dụng HS2 (gói com.hs2_app), sổ liên lạc điện tử do Công ty Cổ phần Công nghệ SFB cung cấp. Có hiệu lực từ ngày 9 tháng 10 năm 2026.";

  const metadata = await generateSeoMetadata(
    `/${locale}${path}`,
    { title, description },
    locale
  );

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}/${locale}${path}`,
      languages: {
        vi: `${baseUrl}/vi${path}`,
        en: `${baseUrl}/en${path}`,
        ja: `${baseUrl}/ja${path}`,
        "x-default": `${baseUrl}/vi${path}`,
      },
    },
  };
}

export default async function Hs2PrivacyPolicyRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!LOCALES.includes(locale)) notFound();

  return <Hs2PrivacyPolicy />;
}
