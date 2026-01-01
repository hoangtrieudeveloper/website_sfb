"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { ScrollAnimation } from "../public/ScrollAnimation";

function FeatureImageFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="box-border w-full max-w-[701px] aspect-[701/511] overflow-hidden rounded-[24px] border-[10px] border-[var(--White,#FFF)] bg-[lightgray] shadow-[0_18px_36px_0_rgba(0,95,148,0.12)]">
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
}

function PrimaryLinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-[54px] w-fit items-center gap-[12px] rounded-[12px] border border-[var(--Color-7,#FFF)] bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] px-[29px] py-[7px] text-sm font-semibold text-white transition-all hover:brightness-110 active:brightness-95"
    >
      {children}
    </Link>
  );
}

import { featureData } from "./data";
import * as LucideIcons from "lucide-react";

interface FeaturesProps {
  data?: any;
}

export function Features({ data }: FeaturesProps) {
  // Use data from props if available, otherwise fallback to static data
  const header = data?.header || featureData.header;
  const blocks = data?.blocks || [];
  
  // Convert old block1/2/3 format to blocks array if needed
  let displayBlocks = blocks;
  if (blocks.length === 0 && (data?.block1 || data?.block2 || data?.block3)) {
    displayBlocks = [
      data.block1 ? { ...data.block1, type: 'type1', imageSide: 'left' } : null,
      data.block2 ? { ...data.block2, type: 'type2', imageSide: 'right' } : null,
      data.block3 ? { ...data.block3, type: 'type2', imageSide: 'left' } : null,
    ].filter(Boolean);
  }
  
  // Fallback to static data if no blocks
  if (displayBlocks.length === 0) {
    displayBlocks = [
      { ...featureData.block1, type: 'type1', imageSide: 'left' },
      { ...featureData.block2, type: 'type2', imageSide: 'right' },
      { ...featureData.block3, type: 'type2', imageSide: 'left' },
    ];
  }

  const renderBlock = (block: any, index: number) => {
    const imageSide = block.imageSide || 'left';
    const imageElement = block.image ? (
      <FeatureImageFrame src={block.image} alt={`Feature ${index + 1}`} />
    ) : null;

    if (block.type === 'type1') {
      return (
        <div key={index} className="mx-auto flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-[90px] lg:min-h-[511px] w-full">
          {imageSide === 'left' && (
            <ScrollAnimation variant="slide-right" className="flex justify-center lg:justify-start">
              {imageElement}
            </ScrollAnimation>
          )}
          
          <ScrollAnimation variant="slide-left" delay={0.1}>
            <div className="flex w-[549px] max-w-full flex-col items-start gap-[30px]">
              {block.text && (
                <p className="w-full text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-normal leading-[38px]">
                  {block.text}
                </p>
              )}
              
              {block.list && block.list.length > 0 && (
                <div className="w-full space-y-[18px]">
                  {block.list.map((t: string, idx: number) => (
                    <ScrollAnimation
                      key={idx}
                      variant="slide-left"
                      delay={0.1 + idx * 0.15}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5 text-sky-500" />
                      <span className="w-[265px] text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[30px]">
                        {t}
                      </span>
                    </ScrollAnimation>
                  ))}
                </div>
              )}
              
              {block.button?.text && (
                <div>
                  <PrimaryLinkButton href={block.button.link || '#'}>
                    {block.button.text} <ArrowRight className="h-4 w-4" />
                  </PrimaryLinkButton>
                </div>
              )}
            </div>
          </ScrollAnimation>
          
          {imageSide === 'right' && (
            <ScrollAnimation variant="slide-left" delay={0.1} className="flex justify-center lg:justify-end">
              {imageElement}
            </ScrollAnimation>
          )}
        </div>
      );
    } else if (block.type === 'type2') {
      return (
        <div key={index} className="mx-auto flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-[90px] lg:min-h-[511px] w-full">
          {imageSide === 'left' && (
            <ScrollAnimation variant="zoom-in" className="flex justify-center lg:justify-start">
              {imageElement}
            </ScrollAnimation>
          )}
          
          <ScrollAnimation variant={imageSide === 'right' ? 'slide-right' : 'zoom-in'} delay={0.1}>
            <div className="flex w-[549px] max-w-full min-h-[374px] flex-col items-start gap-[30px] bg-transparent">
              {block.items && block.items.length > 0 && (
                <div className="w-full space-y-5">
                  {block.items.map((item: any, idx: number) => (
                    <ScrollAnimation
                      key={idx}
                      variant={imageSide === 'right' ? 'slide-right' : 'slide-left'}
                      delay={idx * 0.15}
                      className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 text-sky-500 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <p className="self-stretch text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px]">
                          {item.title}
                        </p>
                        <p className="self-stretch text-[var(--Color-2,#0F172A)] font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[26px]">
                          {item.text}
                        </p>
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>
              )}
              
              {block.button?.text && (
                <div>
                  <PrimaryLinkButton href={block.button.link || '#'}>
                    {block.button.text} <ArrowRight className="h-4 w-4" />
                  </PrimaryLinkButton>
                </div>
              )}
            </div>
          </ScrollAnimation>
          
          {imageSide === 'right' && (
            <ScrollAnimation variant="slide-left" delay={0.1} className="flex justify-center lg:justify-end">
              {imageElement}
            </ScrollAnimation>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section
      className="relative overflow-hidden mx-auto w-full max-w-[1920px] min-h-[2166px] flex justify-center items-start gap-[10px] py-[90px] px-[10px] bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F9FD_100%)]"
    >
      <div className="relative z-10 w-full max-w-[1340px]">
        {/* HEADER */}
        <ScrollAnimation variant="blur-in" className="mx-auto mb-[46px] max-w-4xl text-center flex flex-col items-center gap-6">
          <p className="text-[15px] font-medium uppercase text-[#1D8FCF]">
            {header.sub}
          </p>

          <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] font-bold text-[#0F172A]">
            {header.title}
          </h2>

          <p className="mx-auto max-w-3xl text-[16px] leading-[26px] text-[#0F172A]">
            {header.description}
          </p>
        </ScrollAnimation>

        <div className="flex flex-col gap-[90px]">
          {displayBlocks.map((block: any, index: number) => renderBlock(block, index))}
        </div>
      </div>
    </section>
  );
}
