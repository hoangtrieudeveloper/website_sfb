'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { getLocalizedText, applyLocale } from '@/lib/utils/i18n';

export type Locale = 'vi' | 'en' | 'ja';

/**
 * Hook để lấy locale hiện tại từ localStorage hoặc URL
 * Hỗ trợ format: /vi/..., /en/..., /ja/...
 * Hoặc lấy từ localStorage nếu không có trong URL
 * Fallback về 'vi' nếu không tìm thấy
 */
export function useLocale(): Locale {
  const pathname = usePathname();
  
  return useMemo(() => {
    // First, try to extract locale from pathname: /vi/..., /en/..., /ja/...
    if (pathname) {
      const segments = pathname.split('/').filter(Boolean);
      const firstSegment = segments[0];
      
      if (firstSegment === 'en' || firstSegment === 'ja') {
        return firstSegment;
      }
    }
    
    // If not in URL, try localStorage
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Locale | null;
      if (savedLang && ['vi', 'en', 'ja'].includes(savedLang)) {
        return savedLang;
      }
    }
    
    return 'vi'; // Default
  }, [pathname]);
}

/**
 * Hook để lấy function dịch text
 */
export function useLocalizedText() {
  const locale = useLocale();
  
  return (field: string | Record<Locale, string> | undefined, fallback = '') => {
    return getLocalizedText(field, locale, fallback);
  };
}

/**
 * Hook để apply locale cho toàn bộ object
 */
export function useLocalizedData<T extends Record<string, any>>(data: T | null | undefined): T | null {
  const locale = useLocale();
  
  return useMemo(() => {
    if (!data) return null;
    return applyLocale(data, locale);
  }, [data, locale]);
}

