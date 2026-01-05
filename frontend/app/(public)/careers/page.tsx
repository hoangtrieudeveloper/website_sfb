import { CareersPage } from "../../../pages/Career";
import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return await generateSeoMetadata('/careers', {
    title: 'Tuyển dụng - SFB Technology',
    description: 'Cơ hội nghề nghiệp tại SFB Technology',
  });
}

export default function CareersRoute() {
  return <CareersPage />;
}


