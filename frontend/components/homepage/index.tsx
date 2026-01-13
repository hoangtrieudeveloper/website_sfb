"use client";

import { useEffect, useState } from "react";
import { HeroBanner } from "./HeroBanner";
import { Features } from "./Features";
import { Solutions } from "./Solutions";
import { Trusts } from "./Trusts";
import { AboutCompany } from "./AboutCompany";
import { Testimonials } from "./Testimonials";
import { Consult } from "../public/Consult";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { applyLocale } from "@/lib/utils/i18n";

interface HomepageBlock {
  id: number;
  sectionType: string;
  data: any;
  isActive: boolean;
}

export function HomepageContent({ locale: initialLocale }: { locale?: 'vi' | 'en' | 'ja' }) {
  const { locale: contextLocale } = useLocale();
  const locale = (initialLocale || contextLocale) as 'vi' | 'en' | 'ja';
  const [blocks, setBlocks] = useState<Record<string, HomepageBlock>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      setLoading(true);
      try {
        
        const response = await publicApiCall<{ success: boolean; data: HomepageBlock[] }>(
          PublicEndpoints.homepage.list,
          {},
          locale
        );
        
        if (response.success && response.data) {
          const blocksMap: Record<string, HomepageBlock> = {};
          response.data.forEach((block) => {
            blocksMap[block.sectionType] = block;
          });
          setBlocks(blocksMap);
        }
      } catch (error: any) {
        // Silently fail - components sẽ return null nếu không có data
        if (process.env.NODE_ENV === 'development') {
          console.error('[HomepageContent] Error fetching blocks:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchBlocks();
  }, [locale]);

  // Chỉ render các blocks có isActive = true
  // Nếu không có block trong API hoặc isActive = false thì không render (không fallback)
  const shouldRender = (sectionType: string) => {
    const block = blocks[sectionType];
    // Chỉ render nếu có block trong API và isActive = true
    return block ? block.isActive : false;
  };

  // Get block data, return null if not active or not found
  // Apply locale để đảm bảo data luôn được localize đúng cách
  const getBlockData = (sectionType: string) => {
    const block = blocks[sectionType];
    if (!block || !block.isActive) return null;
    
    // Apply locale cho data để đảm bảo tất cả locale objects được chuyển thành strings
    // Điều này đảm bảo hoạt động đúng dù backend có apply locale hay chưa
    // Xử lý đệ quy tất cả nested objects và arrays
    try {
      const localizedData = applyLocale(block.data || {}, locale);
      
      // Debug log trong development
      if (process.env.NODE_ENV === 'development') {
        // Kiểm tra xem còn locale objects nào không được xử lý
        const checkLocaleObjects = (obj: any, path: string = ''): string[] => {
          const issues: string[] = [];
          if (!obj || typeof obj !== 'object') return issues;
          
          if (Array.isArray(obj)) {
            obj.forEach((item, idx) => {
              if (item && typeof item === 'object') {
                if ('vi' in item || 'en' in item || 'ja' in item) {
                  issues.push(`${path}[${idx}] is still a locale object`);
                } else {
                  issues.push(...checkLocaleObjects(item, `${path}[${idx}]`));
                }
              }
            });
          } else {
            for (const [key, value] of Object.entries(obj)) {
              const currentPath = path ? `${path}.${key}` : key;
              if (value && typeof value === 'object' && !Array.isArray(value)) {
                if ('vi' in value || 'en' in value || 'ja' in value) {
                  issues.push(`${currentPath} is still a locale object`);
                } else {
                  issues.push(...checkLocaleObjects(value, currentPath));
                }
              } else if (Array.isArray(value)) {
                issues.push(...checkLocaleObjects(value, currentPath));
              }
            }
          }
          return issues;
        };
        
        const issues = checkLocaleObjects(localizedData, sectionType);
        if (issues.length > 0) {
          console.warn(`[${sectionType}] Locale objects not fully processed:`, issues);
        }
      }
      
      return localizedData;
    } catch (error) {
      // Nếu có lỗi khi apply locale, trả về data gốc
      console.warn(`Error applying locale to ${sectionType}:`, error);
      return block.data;
    }
  };

  // Render hero ngay khi có data (không cần đợi loading = false)
  // Điều này giúp cải thiện LCP và FCP
  const heroData = getBlockData("hero");
  const shouldRenderHero = shouldRender("hero");

  return (
    <>
      {/* Hero được render ngay khi có data, không cần đợi loading */}
      {shouldRenderHero && <HeroBanner data={heroData} locale={locale} />}
      
      {/* Các sections khác render sau khi loading xong để tránh flash */}
      {!loading && (
        <>
          {shouldRender("aboutCompany") && <AboutCompany data={getBlockData("aboutCompany")} locale={locale} />}
          {shouldRender("features") && <Features data={getBlockData("features")} locale={locale} />}
          {shouldRender("solutions") && <Solutions data={getBlockData("solutions")} locale={locale} />}
          {shouldRender("trusts") && <Trusts data={getBlockData("trusts")} locale={locale} />}
          {shouldRender("testimonials") && <Testimonials data={getBlockData("testimonials")} locale={locale} />}
          {shouldRender("consult") && <Consult data={getBlockData("consult")} locale={locale} />}
        </>
      )}
    </>
  );
}

export default HomepageContent;
