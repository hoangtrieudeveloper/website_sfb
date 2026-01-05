import { ProductsPage } from "@/pages/Product";
import { generateSeoMetadata } from "@/lib/seo";

// Enable ISR - revalidate every 60 seconds for products page
export const revalidate = 60;

export async function generateMetadata() {
  return await generateSeoMetadata('/products', {
    title: 'Sản phẩm & Giải pháp - SFB Technology',
    description: 'Khám phá các sản phẩm và giải pháp công nghệ của SFB Technology',
  });
}

export default function ProductsRoute() {
  return <ProductsPage />;
}


