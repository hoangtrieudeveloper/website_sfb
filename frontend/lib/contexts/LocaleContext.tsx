"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Locale = 'vi' | 'en' | 'ja';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  locales: readonly Locale[];
  defaultLocale: Locale;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>('vi');

  // Extract locale from pathname
  useEffect(() => {
    if (!pathname) return;
    const pathLocale = pathname.split('/')[1] as Locale;
    if (['vi', 'en', 'ja'].includes(pathLocale)) {
      setLocaleState(pathLocale);
      // Save to cookie
      document.cookie = `locale=${pathLocale}; path=/; max-age=31536000`; // 1 year
    }
  }, [pathname]);

  const setLocale = (newLocale: Locale) => {
    // Replace locale in current path
    if (!pathname) return;
    const pathWithoutLocale = pathname.replace(/^\/(vi|en|ja)/, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        locales: ['vi', 'en', 'ja'] as const,
        defaultLocale: 'vi',
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
