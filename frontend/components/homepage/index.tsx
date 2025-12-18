import { HeroBanner } from "./HeroBanner";
import { Features } from "./Features";
import { Solutions } from "./Solutions";
import { Trusts } from "./Trusts";
import { AboutCompany } from "./AboutCompany";
import { Testimonials } from "./Testimonials";
import { Consult } from "./Consult";

export function HomepageContent() {
    return (
        <>
            <HeroBanner />
            <AboutCompany />
            <Features />
            <Solutions />
            <Trusts />
            <Testimonials />
            <Consult />
        </>
    );
}

export * from "./HeroBanner";
export * from "./Features";
export * from "./Solutions";
export * from "./Trusts";
export * from "./AboutCompany";
export * from "./Testimonials";
export * from "./Consult";
