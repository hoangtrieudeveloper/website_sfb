
import { ProductHero } from "./ProductHero";
import { ProductBenefits } from "./ProductBenefits";
import { ProductList } from "./ProductList";
import { Testimonials } from "../../components/homepage/Testimonials";
import { ProductCTA } from "./ProductCTA";

export function ProductsPage() {
    return (
        <div className="min-h-screen">
            <ProductHero />
            <ProductBenefits />
            <ProductList />
            <Testimonials />
            <ProductCTA />
        </div>
    );
}

export default ProductsPage;
