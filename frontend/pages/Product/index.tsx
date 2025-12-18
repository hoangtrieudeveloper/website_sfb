
import { ProductHero } from "./ProductHero";
import { ProductBenefits } from "./ProductBenefits";
import { ProductList } from "./ProductList";
import { ProductTestimonials } from "./ProductTestimonials";
import { ProductCTA } from "./ProductCTA";

export function ProductsPage() {
    return (
        <div className="min-h-screen">
            <ProductHero />
            <ProductBenefits />
            <ProductList />
            <ProductTestimonials />
            <ProductCTA />
        </div>
    );
}

export default ProductsPage;
