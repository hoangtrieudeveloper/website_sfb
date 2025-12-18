import { HomepageContent } from "../../components/homepage";

// Enable ISR (Incremental Static Regeneration) - revalidate every 60 seconds
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HomepageContent />
    </>
  );
}


