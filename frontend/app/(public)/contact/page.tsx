import { ContactPage } from "../../../pages/Contact";
import { getContactData } from "./getContactData";
import { generateSeoMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await generateSeoMetadata('/contact', {
    title: 'Liên hệ - SFB Technology',
    description: 'Liên hệ với SFB Technology để được tư vấn về các giải pháp công nghệ',
  });
}

export default async function ContactRoute() {
  const contactData = await getContactData();
  return <ContactPage contactData={contactData} />;
}


