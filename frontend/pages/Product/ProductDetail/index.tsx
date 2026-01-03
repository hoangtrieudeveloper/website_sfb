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
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center py-16 px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                </div>
            </div>
        );
    }
    // numberedSections có thể là empty array, không nên return null
    const numberedSections = (product.numberedSections || []).sort((a, b) => (a.no || 0) - (b.no || 0));

    // Helper function để check string có giá trị thực sự
    const hasValue = (value: string | undefined | null): boolean => {
        return value !== undefined && value !== null && value.trim() !== '';
    };

    // Kiểm tra xem các section có dữ liệu không
    const hasHeroData = hasValue(product.name) || hasValue(product.heroImage) || hasValue(product.heroDescription);
    
    const hasOverviewData = hasValue(product.overviewTitle) || 
        hasValue(product.overviewKicker) || 
        (product.overviewCards && product.overviewCards.length > 0);
    
    const hasShowcaseData = product.showcase && (
        hasValue(product.showcase.title) || 
        hasValue(product.showcase.desc) || 
        hasValue(product.showcase.overlay?.back?.src) || 
        hasValue(product.showcase.overlay?.front?.src) || 
        hasValue(product.showcase.single?.src)
    );
    
    const hasNumberedSections = numberedSections.length > 0;
    
    const hasExpandData = hasValue(product.expandTitle) || 
        (product.expandBullets && product.expandBullets.length > 0) || 
        hasValue(product.expandImage);

    return (
        <div className="bg-white">
            {hasHeroData && <HeroSection product={product} />}

            {hasOverviewData && <OverviewSection product={product} />}

            {hasShowcaseData && <ShowcaseSection product={product} />}

            {hasNumberedSections && (
                <section className="w-full bg-white">
                    <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px] space-y-[90px]">
                        {numberedSections.map((section) => (
                            <ProductFeatureSection key={section.no} section={section} />
                        ))}
                    </div>
                </section>
            )}

            {hasExpandData && <ExpandSection product={product} />}

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
