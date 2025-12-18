import { AboutHero } from "./AboutHero";
import { AboutCompany } from "./AboutCompany";
import { AboutVisionMission } from "./AboutVisionMission";
import { AboutCoreValues } from "./AboutCoreValues";
import { AboutMilestones } from "./AboutMilestones";
import { AboutLeadership } from "./AboutLeadership";
import { AboutCTA } from "./AboutCTA";

export function AboutPage() {
    return (
        <div className="min-h-screen">
            <AboutHero />
            <AboutCompany />
            <AboutVisionMission />
            <AboutCoreValues />
            <AboutMilestones />
            <AboutLeadership />
            <AboutCTA />
        </div>
    );
}

export default AboutPage;
