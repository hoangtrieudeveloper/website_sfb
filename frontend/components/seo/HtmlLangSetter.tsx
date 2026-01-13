"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function HtmlLangSetter() {
  const pathname = usePathname();

  useEffect(() => {
    // Extract locale from pathname
    const localeMatch = pathname?.match(/^\/(vi|en|ja)(\/|$)/);
    const locale = (localeMatch?.[1] || 'vi') as 'vi' | 'en' | 'ja';
    
    // Set lang attribute on html element
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [pathname]);

  return null;
}
