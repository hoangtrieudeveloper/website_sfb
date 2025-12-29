import { AboutPage } from "../../../pages/About";

// Enable ISR - revalidate every 3600 seconds (1 hour) for about page
export const revalidate = 3600;

export default function AboutRoute() {
  return <AboutPage />;
}


