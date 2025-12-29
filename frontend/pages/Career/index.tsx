import React from "react";
import { CareerHero } from "./CareerHero";
import { CareerBenefits } from "./CareerBenefits";
import { CareerPositions } from "./CareerPositions";
import { CareerCTA } from "./CareerCTA";

export const CareersPage = () => {
    return (
        <div className="min-h-screen">
            <CareerHero />
            <CareerBenefits />
            <CareerPositions />
            <CareerCTA />
        </div>
    );
};

export default CareersPage;
