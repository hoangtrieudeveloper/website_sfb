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

interface AboutSection {
  id: number;
  sectionType: string;
  data: any;
  isActive: boolean;
}

export function AboutPage() {
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
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.hero),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.company),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.visionMission),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.coreValues),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.milestones),
          publicApiCall<{ success: boolean; data?: AboutSection }>(PublicEndpoints.about.leadership),
        ]);

        if (heroResponse.success && heroResponse.data) setHeroData(heroResponse.data);
        if (companyResponse.success && companyResponse.data) setCompanyData(companyResponse.data);
        if (visionMissionResponse.success && visionMissionResponse.data) setVisionMissionData(visionMissionResponse.data);
        if (coreValuesResponse.success && coreValuesResponse.data) setCoreValuesData(coreValuesResponse.data);
        if (milestonesResponse.success && milestonesResponse.data) setMilestonesData(milestonesResponse.data);
        if (leadershipResponse.success && leadershipResponse.data) setLeadershipData(leadershipResponse.data);

      } catch (error) {
        console.error("Error fetching about page data:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchAllAboutData();
  }, []);

  const shouldRender = (data: AboutSection | null) => data && data.isActive;

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen">
      {shouldRender(heroData) && <AboutHero data={heroData} />}
      {shouldRender(companyData) && <AboutCompany data={companyData} />}
      {shouldRender(visionMissionData) && <AboutVisionMission data={visionMissionData} />}
      {shouldRender(coreValuesData) && <AboutCoreValues data={coreValuesData} />}
      {shouldRender(milestonesData) && <AboutMilestones data={milestonesData} />}
      {shouldRender(leadershipData) && <AboutLeadership data={leadershipData} />}
      <Consult />
    </div>
  );
}

export default AboutPage;
