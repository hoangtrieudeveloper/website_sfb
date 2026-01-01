"use client";

import { useState, useEffect } from "react";
import { FieldHero } from "./FieldHero";
import { FieldList } from "./FieldList";
import { FieldProcess } from "./FieldProcess";
import { Consult } from "../../components/public/Consult";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";

export function FieldPage() {
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
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.industries.hero),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.industries.listHeader),
                    publicApiCall<{ success: boolean; data?: any[] }>(PublicEndpoints.industries.list),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.industries.process),
                    publicApiCall<{ success: boolean; data?: any }>(PublicEndpoints.industries.cta),
                ]);

                if (heroRes?.success && heroRes.data) {
                    setHeroData(heroRes.data);
                }
                if (listHeaderRes?.success && listHeaderRes.data) {
                    setListHeaderData(listHeaderRes.data);
                }
                if (industriesRes?.success && industriesRes.data) {
                    setIndustries(industriesRes.data);
                }
                if (processRes?.success && processRes.data) {
                    setProcessData(processRes.data);
                }
                if (ctaRes?.success && ctaRes.data) {
                    setCtaData(ctaRes.data);
                }
            } catch (error) {
                console.error("Error fetching industries data:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, []);

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
