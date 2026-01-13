import type { ReactNode } from "react";
import { Header } from "../../components/public/Header";
import { Footer } from "../../components/public/Footer";
import { Toaster } from "@/components/ui/sonner";
import { PreconnectLinks } from "@/components/seo/PreconnectLinks";
import { LocaleProvider } from "@/lib/contexts/LocaleContext";
import { HtmlLangSetter } from "@/components/seo/HtmlLangSetter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <HtmlLangSetter />
      <PreconnectLinks />
      <Header />
      <main>{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </LocaleProvider>
  );
}


