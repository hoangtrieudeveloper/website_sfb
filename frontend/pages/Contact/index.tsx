import { ContactHero } from "./ContactHero";
import { ContactInfoCards } from "./ContactInfoCards";
import { ContactForm } from "./ContactForm";
import { ContactSidebar } from "./ContactSidebar";
import { ContactMap } from "./ContactMap";

export function ContactPage() {
    return (
        <div className="min-h-screen">
            <ContactHero />
            <ContactInfoCards />

            {/* Main Contact Section */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <ContactForm />
                        <ContactSidebar />
                    </div>
                </div>
            </section>

            <ContactMap />
        </div>
    );
}

export default ContactPage;
