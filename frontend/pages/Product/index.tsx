import { ProductHero } from "./ProductHero";
import { ProductBenefits } from "./ProductBenefits";
import { ProductList } from "./ProductList";
import { ProductTestimonials } from "./ProductTestimonials";
import { Consult } from "../../components/public/Consult";

export function ProductsPage() {
    return (
        <div className="min-h-screen">
            <ProductHero />
            <ProductBenefits />
            <ProductList />
            <ProductTestimonials />
            <Consult />
        </div>
    );
}

export default ProductsPage;
