"use client";

import { useState, useEffect } from "react";
import { AboutHero } from "./AboutHero";
import { AboutCompany } from "./AboutCompany";
import { AboutVisionMission } from "./AboutVisionMission";
import { AboutCoreValues } from "./AboutCoreValues";
import { AboutMilestones } from "./AboutMilestones";
import { AboutLeadership } from "./AboutLeadership";
import { Consult } from "../../components/public/Consult";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { applyLocale } from "@/lib/utils/i18n";

interface AboutSection {
  id: number;
  sectionType: string;
  data: any;
  isActive: boolean;
}

export function AboutPage({ locale: initialLocale }: { locale?: 'vi' | 'en' | 'ja' }) {
  const { locale: contextLocale } = useLocale();
  const locale = (initialLocale || contextLocale) as 'vi' | 'en' | 'ja';
  
  const [heroData, setHeroData] = useState<AboutSection | null>(null);
  const [companyData, setCompanyData] = useState<AboutSection | null>(null);
  const [visionMissionData, setVisionMissionData] = useState<AboutSection | null>(null);
  const [coreValuesData, setCoreValuesData] = useState<AboutSection | null>(null);
  const [milestonesData, setMilestonesData] = useState<AboutSection | null>(null);
  const [leadershipData, setLeadershipData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAboutData = async () => {
      try {
        const [
          heroResponse,
          companyResponse,
          visionMissionResponse,
          coreValuesResponse,
          milestonesResponse,
          leadershipResponse,
        ] = await Promise.all([
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.hero, {}, locale),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.company, {}, locale),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.visionMission, {}, locale),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.coreValues, {}, locale),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.milestones, {}, locale),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.leadership, {}, locale),
        ]);
        if (heroResponse.success && heroResponse.data) {
          setHeroData({ ...heroResponse.data, data: applyLocale(heroResponse.data.data, locale) });
        }
        if (companyResponse.success && companyResponse.data) {
          setCompanyData({ ...companyResponse.data, data: applyLocale(companyResponse.data.data, locale) });
        }
        if (visionMissionResponse.success && visionMissionResponse.data) {
          setVisionMissionData({ ...visionMissionResponse.data, data: applyLocale(visionMissionResponse.data.data, locale) });
        }
        if (coreValuesResponse.success && coreValuesResponse.data) {
          setCoreValuesData({ ...coreValuesResponse.data, data: applyLocale(coreValuesResponse.data.data, locale) });
        }
        if (milestonesResponse.success && milestonesResponse.data) {
          setMilestonesData({ ...milestonesResponse.data, data: applyLocale(milestonesResponse.data.data, locale) });
        }
        if (leadershipResponse.success && leadershipResponse.data) {
          setLeadershipData({ ...leadershipResponse.data, data: applyLocale(leadershipResponse.data.data, locale) });
        }

      } catch (error) {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };

      void fetchAllAboutData();
    }, [locale]);

  const shouldRender = (data: AboutSection | null) => data && data.isActive;

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen">
      {shouldRender(heroData) && <AboutHero data={heroData} locale={locale} />}
      {shouldRender(companyData) && <AboutCompany data={companyData} locale={locale} />}
      {shouldRender(visionMissionData) && <AboutVisionMission data={visionMissionData} locale={locale} />}

      {/* Separator Line */}
      <div className="flex justify-center w-full">
        <div
          className="w-full h-[1px] max-w-[1920px]"
          style={{
            background: 'linear-gradient(80deg, rgba(29, 143, 207, 0.00) 25.47%, #269DD9 58.86%, rgba(46, 171, 226, 0.00) 97.94%)'
          }}
        />
      </div>

      {shouldRender(coreValuesData) && <AboutCoreValues data={coreValuesData} locale={locale} />}
      {shouldRender(milestonesData) && <AboutMilestones data={milestonesData} locale={locale} />}
      {shouldRender(leadershipData) && <AboutLeadership data={leadershipData} locale={locale} />}
      <Consult locale={locale} />
    </div>
  );
}

export default AboutPage;
