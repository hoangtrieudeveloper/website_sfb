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
      } catch (error: any) {
        console.error("Error fetching homepage blocks:", error);
        // If it's a connection error, log more details
        if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('backend')) {
          console.warn("Backend server may not be running. Homepage will use empty blocks.");
        }
        // Fallback: continue with empty blocks, components will use static data
      } finally {
        setLoading(false);
      }
    };

    void fetchBlocks();
  }, []);

  // Chỉ render các blocks có isActive = true
  // Nếu không có block trong API hoặc isActive = false thì không render (không fallback)
  const shouldRender = (sectionType: string) => {
    const block = blocks[sectionType];
    // Chỉ render nếu có block trong API và isActive = true
    return block ? block.isActive : false;
  };

  // Get block data, return null if not active or not found
  const getBlockData = (sectionType: string) => {
    const block = blocks[sectionType];
    return block && block.isActive ? block.data : null;
  };

  // Khi loading, không render gì cả (hoặc có thể render loading state)
  if (loading) {
    return null; // Hoặc có thể return <div>Loading...</div>
  }

  return (
    <>
      {shouldRender("hero") && <HeroBanner data={getBlockData("hero")} />}
      {shouldRender("aboutCompany") && <AboutCompany data={getBlockData("aboutCompany")} />}
      {shouldRender("features") && <Features data={getBlockData("features")} />}
      {shouldRender("solutions") && <Solutions data={getBlockData("solutions")} />}
      {shouldRender("trusts") && <Trusts data={getBlockData("trusts")} />}
      {shouldRender("testimonials") && <Testimonials data={getBlockData("testimonials")} />}
      {shouldRender("consult") && <Consult data={getBlockData("consult")} />}
    </>
  );
}

export default HomepageContent;
