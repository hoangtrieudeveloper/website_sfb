"use client";

import { useState, useEffect } from "react";
import { ProductHero } from "./ProductHero";
import { ProductBenefits } from "./ProductBenefits";
import { ProductList } from "./ProductList";
import { Testimonials } from "../../components/homepage/Testimonials";
import { Consult } from "../../components/public/Consult";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";

export function ProductsPage() {
    const [heroData, setHeroData] = useState<any>(null);
    const [benefitsData, setBenefitsData] = useState<any[]>([]);
    const [listHeaderData, setListHeaderData] = useState<any>(null);
    const [productsData, setProductsData] = useState<any[]>([]);
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [testimonialsData, setTestimonialsData] = useState<any[]>([]);
    const [ctaData, setCtaData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProductsData = async () => {
            try {
                const [
                    heroResponse,
                    benefitsResponse,
                    listHeaderResponse,
                    productsResponse,
                    categoriesResponse,
                    testimonialsResponse,
                    ctaResponse,
                ] = await Promise.all([
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.products.hero),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.products.benefits),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.products.listHeader),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.products.list),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.products.categories),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.products.testimonials),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.products.cta),
                ]);

                if (heroResponse?.success && heroResponse.data) {
                    setHeroData(heroResponse.data);
                }
                if (benefitsResponse?.success && benefitsResponse.data) {
                    setBenefitsData(benefitsResponse.data);
                }
                if (listHeaderResponse?.success && listHeaderResponse.data) {
                    setListHeaderData(listHeaderResponse.data);
                }
                if (productsResponse?.success && productsResponse.data) {
                    setProductsData(productsResponse.data);
                }
                if (categoriesResponse?.success && categoriesResponse.data) {
                    setCategoriesData(categoriesResponse.data);
                }
                if (testimonialsResponse?.success && testimonialsResponse.data) {
                    setTestimonialsData(testimonialsResponse.data);
                }
                if (ctaResponse?.success && ctaResponse.data) {
                    setCtaData(ctaResponse.data);
                }
            } catch (error) {
                console.error("Error fetching products page data:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchAllProductsData();
    }, []);

    const shouldRender = (data: any) => data && (data.isActive !== false);

    if (loading) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen">
            {shouldRender(heroData) && <ProductHero data={heroData} />}
            {benefitsData.length > 0 && <ProductBenefits data={benefitsData} />}
            {shouldRender(listHeaderData) && (
                <ProductList 
                    headerData={listHeaderData} 
                    products={productsData} 
                    categories={categoriesData}
                />
            )}
            {testimonialsData.length > 0 && <Testimonials data={{ reviews: testimonialsData }} />}
            {shouldRender(ctaData) && <Consult data={ctaData} />}
        </div>
    );
}

export default ProductsPage;
