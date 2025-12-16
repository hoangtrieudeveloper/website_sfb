import { HeroBanner } from "../../components/HeroBanner";
import { Features } from "../../components/Features";
import { Solutions } from "../../components/Solutions";
import { Trusts } from "../../components/Trusts";
import { AboutCompany } from "../../components/AboutCompany";
import { Testimonials } from "../../components/Testimonials";
import { Consult } from "../../components/Consult";

// Enable ISR (Incremental Static Regeneration) - revalidate every 60 seconds
export const revalidate = 60;

export default function HomePage() {
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


