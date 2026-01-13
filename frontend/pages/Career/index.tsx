"use client";

import { useState, useEffect } from "react";
import { CareerHero } from "./CareerHero";
import { CareerBenefits } from "./CareerBenefits";
import { CareerPositions } from "./CareerPositions";
import { CareerCTA } from "./CareerCTA";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { applyLocale } from "@/lib/utils/i18n";

interface CareerSection {
  id: number;
  sectionType: string;
  data: any;
  isActive: boolean;
}

export const CareersPage = ({ locale: initialLocale }: { locale?: 'vi' | 'en' | 'ja' }) => {
  const { locale: contextLocale } = useLocale();
  const locale = (initialLocale || contextLocale) as 'vi' | 'en' | 'ja';
  const [heroData, setHeroData] = useState<CareerSection | null>(null);
  const [benefitsData, setBenefitsData] = useState<CareerSection | null>(null);
  const [positionsData, setPositionsData] = useState<CareerSection | null>(null);
  const [ctaData, setCtaData] = useState<CareerSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCareersData = async () => {
      try {
        const [
          heroResponse,
          benefitsResponse,
          positionsResponse,
          ctaResponse,
        ] = await Promise.all([
          publicApiCall<{ success: boolean; data?: CareerSection }>(PublicEndpoints.careers.hero, {}, locale),
          publicApiCall<{ success: boolean; data?: CareerSection }>(PublicEndpoints.careers.benefits, {}, locale),
          publicApiCall<{ success: boolean; data?: CareerSection }>(PublicEndpoints.careers.positions, {}, locale),
          publicApiCall<{ success: boolean; data?: CareerSection }>(PublicEndpoints.careers.cta, {}, locale),
        ]);

        if (heroResponse.success && heroResponse.data) setHeroData({ ...heroResponse.data, data: applyLocale(heroResponse.data.data, locale) });
        if (benefitsResponse.success && benefitsResponse.data) setBenefitsData({ ...benefitsResponse.data, data: applyLocale(benefitsResponse.data.data, locale) });
        if (positionsResponse.success && positionsResponse.data) setPositionsData({ ...positionsResponse.data, data: applyLocale(positionsResponse.data.data, locale) });
        if (ctaResponse.success && ctaResponse.data) setCtaData({ ...ctaResponse.data, data: applyLocale(ctaResponse.data.data, locale) });

      } catch (error) {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };

    void fetchAllCareersData();
  }, [locale]);

  const shouldRender = (data: CareerSection | null) => data && data.isActive;

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen">
      {shouldRender(heroData) && <CareerHero data={heroData} />}
      {shouldRender(benefitsData) && <CareerBenefits data={benefitsData} />}
      {shouldRender(positionsData) && <CareerPositions data={positionsData} />}
      {shouldRender(ctaData) && <CareerCTA data={ctaData} />}
    </div>
  );
};

export default CareersPage;
