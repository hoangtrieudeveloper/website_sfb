import { ContactPage } from "../../../pages/Contact";
import { getContactData } from "./getContactData";

export const revalidate = 60;

export default async function ContactRoute() {
  const contactData = await getContactData();
  return <ContactPage contactData={contactData} />;
}


