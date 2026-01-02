import { Consult } from "@/components/public/Consult";
import { ProductDetail } from "./data";
import { HeroSection } from "./HeroSection";
import { OverviewSection } from "./OverviewSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { ProductFeatureSection } from "./ProductFeatureSection";
import { ExpandSection } from "./ExpandSection";
import { GetStaticProps } from "next";

interface ProductDetailViewProps {
    product: ProductDetail | null;
}

// Component được sử dụng bởi App Router
export function ProductDetailView({ product }: ProductDetailViewProps) {
    if (!product || !product.numberedSections) {
        return null;
    }
    const numberedSections = product.numberedSections.sort((a, b) => a.no - b.no);

    return (
        <div className="bg-white">
            <HeroSection product={product} />

            <OverviewSection product={product} />

            <ShowcaseSection product={product} />

            <section className="w-full bg-white">
                <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px] space-y-[90px]">
                    {numberedSections.map((section) => (
                        <ProductFeatureSection key={section.no} section={section} />
                    ))}
                </div>
            </section>

            <ExpandSection product={product} />

            <div id="demo" />
            <Consult />
        </div>
    );
}

// Default export cho Pages Router - trả về empty page vì route thực tế nằm ở App Router
export default function ProductDetailPage() {
    return null;
}

// Đánh dấu page này không cần pre-render
export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
        notFound: true, // Không render page này trong Pages Router
    };
};
