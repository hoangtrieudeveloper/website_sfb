import { AboutPage } from "../../../pages/About";
import { generateSeoMetadata } from "@/lib/seo";

// Enable ISR - revalidate every 3600 seconds (1 hour) for about page
export const revalidate = 3600;

export async function generateMetadata() {
  return await generateSeoMetadata('/about', {
    title: 'Về chúng tôi - SFB Technology',
    description: 'Tìm hiểu về SFB Technology - Công ty công nghệ hàng đầu Việt Nam',
  });
}

export default function AboutRoute() {
  return <AboutPage />;
}


