"use client";

import { useState, useEffect } from "react";
import { FieldHero } from "./FieldHero";
import { FieldList } from "./FieldList";
import { FieldProcess } from "./FieldProcess";
import { Consult } from "../../components/public/Consult";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { applyLocale } from "@/lib/utils/i18n";

export function FieldPage({ locale: initialLocale }: { locale?: 'vi' | 'en' | 'ja' }) {
    const { locale: contextLocale } = useLocale();
    const locale = (initialLocale || contextLocale) as 'vi' | 'en' | 'ja';
    const [heroData, setHeroData] = useState<any>(null);
    const [listHeaderData, setListHeaderData] = useState<any>(null);
    const [industries, setIndustries] = useState<any[]>([]);
    const [processData, setProcessData] = useState<any>(null);
    const [ctaData, setCtaData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel
                const [heroRes, listHeaderRes, industriesRes, processRes, ctaRes] = await Promise.all([
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.industries.hero, {}, locale),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.industries.listHeader, {}, locale),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.industries.list, {}, locale),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.industries.process, {}, locale),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.industries.cta, {}, locale),
                ]);

                if (heroRes?.success && heroRes.data) {
                    setHeroData(applyLocale(heroRes.data, locale));
                }
                if (listHeaderRes?.success && listHeaderRes.data) {
                    setListHeaderData(applyLocale(listHeaderRes.data, locale));
                }
                if (industriesRes?.success && industriesRes.data) {
                    setIndustries(industriesRes.data.map((item: any) => applyLocale(item, locale)));
                }
                if (processRes?.success && processRes.data) {
                    setProcessData(applyLocale(processRes.data, locale));
                }
                if (ctaRes?.success && ctaRes.data) {
                    setCtaData(applyLocale(ctaRes.data, locale));
                }
            } catch (error) {
                // Silently fail
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [locale]);

    if (loading) {
        return null; // Hoặc có thể return loading state
    }

    return (
        <div className="min-h-screen">
            {heroData && <FieldHero data={heroData} />}
            {listHeaderData && industries.length > 0 && (
                <FieldList headerData={listHeaderData} industries={industries} />
            )}
            {processData && <FieldProcess data={processData} />}
            {ctaData && (
                <Consult 
                    data={{
                        title: ctaData.title,
                        description: ctaData.description,
                        buttons: {
                            primary: {
                                text: ctaData.primaryButtonText,
                                link: ctaData.primaryButtonLink,
                            },
                            secondary: {
                                text: ctaData.secondaryButtonText,
                                link: ctaData.secondaryButtonLink,
                            },
                        },
                        backgroundColor: ctaData.backgroundColor,
                    }} 
                />
            )}
        </div>
    );
}

export default FieldPage;
