import { HomepageContent } from "../../components/homepage";
import { generateSeoMetadata } from "@/lib/seo";
import { generateOrganizationSchema } from "@/lib/structured-data";
import Script from "next/script";

// Enable ISR (Incremental Static Regeneration) - revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata() {
  // Metadata từ generateMetadata() sẽ được Next.js tự động inject vào <head>
  // Trong production build, metadata sẽ luôn nằm trong <head>
  return await generateSeoMetadata('/', {
    title: 'SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam',
    description: 'SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến',
  });
}

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* 
        JSON-LD Structured Data - Sử dụng Script component với strategy="afterInteractive"
        Script sẽ được đặt ngay sau <body> tag, vẫn hợp lệ cho SEO theo Google guidelines
        Metadata từ generateMetadata() đã được Next.js tự động đặt vào <head>
      */}
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomepageContent />
    </>
  );
}


