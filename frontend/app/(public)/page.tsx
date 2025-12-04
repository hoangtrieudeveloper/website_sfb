import { HeroBanner } from "../../components/HeroBanner";
import { Features } from "../../components/Features";
import { Solutions } from "../../components/Solutions";
import { Industries } from "../../components/Industries";
import { AboutCompany } from "../../components/AboutCompany";
import { Testimonials } from "../../components/Testimonials";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <Features />
      <Solutions />
      <Industries />
      <AboutCompany />
      <Testimonials />
    </>
  );
}


