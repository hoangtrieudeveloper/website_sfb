import { Consult } from "@/components/public/Consult";
import { ProductDetail } from "./data";
import { HeroSection } from "./HeroSection";
import { OverviewSection } from "./OverviewSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { ProductFeatureSection } from "./ProductFeatureSection";
import { ExpandSection } from "./ExpandSection";

interface ProductDetailViewProps {
    product: ProductDetail;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
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
