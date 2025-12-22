import { AboutHero } from "./AboutHero";
import { AboutCompany } from "./AboutCompany";
import { AboutVisionMission } from "./AboutVisionMission";
import { AboutCoreValues } from "./AboutCoreValues";
import { AboutMilestones } from "./AboutMilestones";
import { AboutLeadership } from "./AboutLeadership";
import { Consult } from "../../components/public/Consult";

export function AboutPage() {
    return (
        <div className="min-h-screen">
            <AboutHero />
            <AboutCompany />
            <AboutVisionMission />
            <AboutCoreValues />
            <AboutMilestones />
            <AboutLeadership />
            <Consult />
        </div>
    );
}

export default AboutPage;
