"use client";

import { SolutionsHero } from "./SolutionsHero";
import { SolutionsList } from "./SolutionsList";
import { SolutionsProcess } from "./SolutionsProcess";
import { SolutionsCTA } from "./SolutionsCTA";
import { useLocale } from "@/lib/contexts/LocaleContext";

export function SolutionsPage({ locale: initialLocale }: { locale?: 'vi' | 'en' | 'ja' }) {
    const { locale: contextLocale } = useLocale();
    const locale = (initialLocale || contextLocale) as 'vi' | 'en' | 'ja';
    
    return (
        <div className="min-h-screen bg-white">
            <SolutionsHero locale={locale} />
            <SolutionsList locale={locale} />
            <SolutionsProcess locale={locale} />
            <SolutionsCTA locale={locale} />
        </div>
    );
}

export default SolutionsPage;
