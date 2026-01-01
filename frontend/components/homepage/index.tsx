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

interface HomepageBlock {
  id: number;
  sectionType: string;
  data: any;
  isActive: boolean;
}

export function HomepageContent() {
  const [blocks, setBlocks] = useState<Record<string, HomepageBlock>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await publicApiCall<{ success: boolean; data: HomepageBlock[] }>(
          PublicEndpoints.homepage.list
        );
        
        if (response.success && response.data) {
          const blocksMap: Record<string, HomepageBlock> = {};
          response.data.forEach((block) => {
            blocksMap[block.sectionType] = block;
          });
          setBlocks(blocksMap);
        }
      } catch (error) {
        console.error("Error fetching homepage blocks:", error);
        // Fallback: continue with empty blocks, components will use static data
      } finally {
        setLoading(false);
      }
    };

    void fetchBlocks();
  }, []);

  // Chỉ render các blocks có isActive = true
  const shouldRender = (sectionType: string) => {
    const block = blocks[sectionType];
    // Nếu có block trong API và isActive = false thì không render
    // Nếu không có block trong API (chưa fetch được hoặc chưa có data) thì render (fallback về static data)
    return block ? block.isActive : true;
  };

  if (loading) {
    // Có thể hiển thị loading hoặc render với static data
    return (
      <>
        <HeroBanner />
        <AboutCompany />
        <Features />
        <Solutions />
        <Trusts />
        <Testimonials />
        <Consult />
      </>
    );
  }

  return (
    <>
      {shouldRender("hero") && <HeroBanner />}
      {shouldRender("aboutCompany") && <AboutCompany />}
      {shouldRender("features") && <Features />}
      {shouldRender("solutions") && <Solutions />}
      {shouldRender("trusts") && <Trusts />}
      <Testimonials />
      {shouldRender("consult") && <Consult />}
    </>
  );
}

export default HomepageContent;
