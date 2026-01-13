import { ContactHero } from "./ContactHero";
import { ContactInfoCards } from "./ContactInfoCards";
import { ContactForm } from "./ContactForm";
import { ContactSidebar } from "./ContactSidebar";
import { ContactMap } from "./ContactMap";

interface ContactPageProps {
    contactData?: {
        hero?: any;
        infoCards?: any[];
        form?: any;
        sidebar?: any;
        map?: any;
    } | null;
    locale?: 'vi' | 'en' | 'ja';
}

export function ContactPage({ contactData, locale }: ContactPageProps) {
    return (
        <div className="min-h-screen">
            {contactData?.hero && <ContactHero data={contactData.hero} />}
            {contactData?.infoCards && contactData.infoCards.length > 0 && (
                <ContactInfoCards data={contactData.infoCards} />
            )}

            {/* Main Contact Section */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {contactData?.form && <ContactForm data={contactData.form} />}
                        {contactData?.sidebar && <ContactSidebar data={contactData.sidebar} />}
                    </div>
                </div>
            </section>

            {contactData?.map && <ContactMap data={contactData.map} locale={locale} />}
        </div>
    );
}

export default ContactPage;
