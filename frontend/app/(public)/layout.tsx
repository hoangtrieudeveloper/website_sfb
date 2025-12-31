import type { ReactNode } from "react";
import { Header } from "../../components/public/Header";
import { Footer } from "../../components/public/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </>
  );
}


