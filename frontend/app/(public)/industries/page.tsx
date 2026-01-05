import { FieldPage } from "../../../pages/Field";
import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return await generateSeoMetadata('/industries', {
    title: 'Lĩnh vực - SFB Technology',
    description: 'Khám phá các lĩnh vực ứng dụng của SFB Technology',
  });
}

export default function IndustriesRoute() {
  return <FieldPage />;
}


