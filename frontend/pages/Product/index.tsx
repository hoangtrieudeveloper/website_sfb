
import { ProductHero } from "./ProductHero";
import { ProductBenefits } from "./ProductBenefits";
import { ProductList } from "./ProductList";
import { Testimonials } from "../../components/homepage/Testimonials";
import { Consult } from "../../components/public/Consult";

export function ProductsPage() {
    return (
        <div className="min-h-screen">
            <ProductHero />
            <ProductBenefits />
            <ProductList />
            <Testimonials />
            <Consult />
        </div>
    );
}

export default ProductsPage;
