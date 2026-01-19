import { MetadataRoute } from "next";

const LOCALES = ["vi", "en", "ja"] as const;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sfb.vn";

  const sitemaps: string[] = [
    `${baseUrl}/sitemap.xml`, // global sitemap
    // locale-specific sitemaps
    ...LOCALES.map((locale) => `${baseUrl}/${locale}/sitemap.xml`),
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: sitemaps,
  };
}
