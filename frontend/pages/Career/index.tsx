"use client";

import { useState, useEffect } from "react";
import { CareerHero } from "./CareerHero";
import { CareerBenefits } from "./CareerBenefits";
import { CareerPositions } from "./CareerPositions";
import { CareerCTA } from "./CareerCTA";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";

interface CareerSection {
  id: number;
  sectionType: string;
  data: any;
  isActive: boolean;
}

export const CareersPage = () => {
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
          publicApiCall<{ success: boolean; data?: CareerSection }>(PublicEndpoints.careers.hero),
          publicApiCall<{ success: boolean; data?: CareerSection }>(PublicEndpoints.careers.benefits),
          publicApiCall<{ success: boolean; data?: CareerSection }>(PublicEndpoints.careers.positions),
          publicApiCall<{ success: boolean; data?: CareerSection }>(PublicEndpoints.careers.cta),
        ]);

        if (heroResponse.success && heroResponse.data) setHeroData(heroResponse.data);
        if (benefitsResponse.success && benefitsResponse.data) setBenefitsData(benefitsResponse.data);
        if (positionsResponse.success && positionsResponse.data) setPositionsData(positionsResponse.data);
        if (ctaResponse.success && ctaResponse.data) setCtaData(ctaResponse.data);

      } catch (error) {
        console.error("Error fetching careers page data:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchAllCareersData();
  }, []);

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
