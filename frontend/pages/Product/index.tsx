"use client";

import { useState, useEffect } from "react";
import { ProductHero } from "./ProductHero";
import { ProductBenefits } from "./ProductBenefits";
import { ProductList } from "./ProductList";
import { Testimonials } from "../../components/homepage/Testimonials";
import { Consult } from "../../components/public/Consult";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { applyLocale } from "@/lib/utils/i18n";

export function ProductsPage({ locale: initialLocale }: { locale?: 'vi' | 'en' | 'ja' }) {
    const { locale: contextLocale } = useLocale();
    const locale = (initialLocale || contextLocale) as 'vi' | 'en' | 'ja';
    
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
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.products.hero, {}, locale),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.products.benefits, {}, locale),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.products.listHeader, {}, locale),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.products.list, {}, locale),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.products.categories, {}, locale),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.products.testimonials, {}, locale),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.products.cta, {}, locale),
                ]);

                if (heroResponse?.success && heroResponse.data) {
                    setHeroData(applyLocale(heroResponse.data, locale));
                }
                if (benefitsResponse?.success && benefitsResponse.data) {
                    setBenefitsData(benefitsResponse.data.map((item: any) => applyLocale(item, locale)));
                }
                if (listHeaderResponse?.success && listHeaderResponse.data) {
                    setListHeaderData(applyLocale(listHeaderResponse.data, locale));
                }
                if (productsResponse?.success && productsResponse.data) {
                    setProductsData(productsResponse.data.map((item: any) => applyLocale(item, locale)));
                }
                if (categoriesResponse?.success && categoriesResponse.data) {
                    setCategoriesData(categoriesResponse.data.map((item: any) => applyLocale(item, locale)));
                }
                if (testimonialsResponse?.success && testimonialsResponse.data) {
                    setTestimonialsData(testimonialsResponse.data.map((item: any) => applyLocale(item, locale)));
                }
                if (ctaResponse?.success && ctaResponse.data) {
                    setCtaData(applyLocale(ctaResponse.data, locale));
                }
            } catch (error) {
                // Silently fail
            } finally {
                setLoading(false);
            }
        };

        void fetchAllProductsData();
    }, [locale]);

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
