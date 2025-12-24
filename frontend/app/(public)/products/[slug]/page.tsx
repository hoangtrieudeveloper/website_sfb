import { notFound } from "next/navigation";
import { productDetails, getProductBySlug } from "@/pages/Product/ProductDetail/data";
import ProductDetailView from "@/pages/Product/ProductDetail";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = getProductBySlug(slug);
  if (!product) return notFound();

  return <ProductDetailView product={product} />;
}

export function generateStaticParams() {
  return productDetails.map((p) => ({ slug: p.slug }));
}
