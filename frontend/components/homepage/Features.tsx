"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "../public/ScrollAnimation";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

function FeatureImageFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="box-border w-full max-w-[701px] aspect-[701/511] overflow-hidden rounded-[24px] border-[10px] border-[var(--White,#FFF)] bg-[lightgray] shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] relative lg:ml-auto min-[1920px]:w-[701px] min-[1920px]:h-[511px] min-[1920px]:aspect-auto">
      <ImageWithFallback
        src={src}
        alt={alt}
        width={701}
        height={511}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 701px"
        loading="lazy"
        objectFit="cover"
        className="w-full h-full transition-transform duration-700 hover:scale-105"
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
      prefetch={true}
      className="inline-flex h-10 sm:h-[54px] w-fit items-center gap-[8px] sm:gap-[12px] rounded-[10px] sm:rounded-[12px] border border-[var(--Color-7,#FFF)] bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] px-5 sm:px-[29px] py-[7px] text-xs sm:text-sm font-semibold text-white transition-all hover:brightness-110 active:brightness-95"
    >
      {children}
    </Link>
  );
}

import * as LucideIcons from "lucide-react";

function FeaturesTickIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      style={{
        height: "19.999px",
        flexShrink: 0,
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99996 0C4.48608 0 0 4.48493 0 9.99999C0 15.514 4.48608 19.9994 9.99996 19.9994C15.5138 19.9994 20 15.514 20 9.99999C20 4.48493 15.5138 0 9.99996 0ZM15.575 6.66503L9.42112 13.5881C9.2696 13.758 9.05846 13.8457 8.84571 13.8457C8.67691 13.8457 8.50731 13.7903 8.3654 13.6779L4.51916 10.6005C4.18761 10.3355 4.13384 9.85106 4.39921 9.5188C4.66426 9.18763 5.1488 9.13332 5.48035 9.3989L8.7561 12.0193L14.4249 5.64245C14.7066 5.32418 15.1934 5.29568 15.5107 5.57849C15.8284 5.86074 15.8573 6.34676 15.575 6.66503Z"
        fill="#1D8FCF"
      />
    </svg>
  );
}

interface FeaturesProps {
  data?: any;
  locale?: 'vi' | 'en' | 'ja';
}

export function Features({ data, locale: propLocale }: FeaturesProps) {
  const { locale: contextLocale } = useLocale();
  const locale = (propLocale || contextLocale) as 'vi' | 'en' | 'ja';

  // Chỉ sử dụng data từ API, không có fallback static data
  if (!data) {
    return null;
  }

  const header = data?.header;
  const blocks = data?.blocks || [];

  // Localize header
  const headerSub = header?.sub
    ? (typeof header.sub === 'string' ? header.sub : getLocalizedText(header.sub, locale))
    : undefined;
  const headerTitle = header?.title
    ? (typeof header.title === 'string' ? header.title : getLocalizedText(header.title, locale))
    : undefined;
  const headerDescription = header?.description
    ? (typeof header.description === 'string' ? header.description : getLocalizedText(header.description, locale))
    : undefined;

  // Convert old block1/2/3 format to blocks array if needed
  let displayBlocks = blocks;
  if (blocks.length === 0 && (data?.block1 || data?.block2 || data?.block3)) {
    displayBlocks = [
      data.block1 ? { ...data.block1, type: 'type1', imageSide: 'left' } : null,
      data.block2 ? { ...data.block2, type: 'type2', imageSide: 'right' } : null,
      data.block3 ? { ...data.block3, type: 'type2', imageSide: 'left' } : null,
    ].filter(Boolean);
  }

  // Không render nếu không có blocks
  if (!displayBlocks || displayBlocks.length === 0) {
    return null;
  }

  // Không render nếu không có header
  if (!header) {
    return null;
  }

  const renderBlock = (block: any, index: number) => {
    // Force alternating layout: Even=Left (Image-Text), Odd=Right (Text-Image)
    const imageSide = index % 2 === 1 ? 'right' : 'left';
    const imageElement = block.image ? (
      <FeatureImageFrame src={block.image} alt={`Feature ${index + 1}`} />
    ) : null;

    // Localize block fields
    const blockText = block.text
      ? (typeof block.text === 'string' ? block.text : getLocalizedText(block.text, locale))
      : undefined;
    const blockTitle = block.title
      ? (typeof block.title === 'string' ? block.title : getLocalizedText(block.title, locale))
      : undefined;
    const blockDescription = block.description
      ? (typeof block.description === 'string' ? block.description : getLocalizedText(block.description, locale))
      : undefined;
    const blockButtonText = block.button?.text
      ? (typeof block.button.text === 'string' ? block.button.text : getLocalizedText(block.button.text, locale))
      : undefined;

    if (block.type === 'type1') {
      return (
        <div key={index} className={`mx-auto flex ${imageSide === 'right' ? 'flex-col-reverse' : 'flex-col'} xl:flex-row justify-center items-center gap-10 xl:gap-[90px] xl:min-h-[511px] w-full`}>
          {imageSide === 'left' && (
            <ScrollAnimation>
              {imageElement}
            </ScrollAnimation>
          )}

          <ScrollAnimation variant="slide-left" delay={0.1}>
            <div className="flex w-full max-w-[549px] flex-col items-start gap-4 sm:gap-[30px]">
              {blockText && (
                <p className="w-full text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-sm sm:text-[20px] font-normal leading-normal sm:leading-[38px]">
                  {blockText}
                </p>
              )}

              {block.list && block.list.length > 0 && (
                <div className="w-full space-y-1 sm:space-y-[18px]">
                  {block.list.map((t: any, idx: number) => {
                    const listItemText = typeof t === 'string' ? t : getLocalizedText(t, locale);
                    return (
                      <ScrollAnimation
                        key={idx}
                        variant="slide-left"
                        delay={0.1 + idx * 0.15}
                        className="flex items-start gap-2 sm:gap-3 p-1 sm:p-2 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        <FeaturesTickIcon className="mt-0.5 sm:mt-[5px]" />
                        <span className="w-full text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-xs sm:text-[16px] font-normal leading-tight sm:leading-[30px]">
                          {listItemText}
                        </span>
                      </ScrollAnimation>
                    );
                  })}
                </div>
              )}

              {blockButtonText && (
                <div>
                  <PrimaryLinkButton href={block.button.link || '#'}>
                    {blockButtonText} <ArrowRight className="h-4 w-4" />
                  </PrimaryLinkButton>
                </div>
              )}
            </div>
          </ScrollAnimation>

          {imageSide === 'right' && (
            <ScrollAnimation variant="slide-left" delay={0.1} className="flex justify-center xl:justify-end">
              {imageElement}
            </ScrollAnimation>
          )}
        </div>
      );
    } else if (block.type === 'type2') {
      return (
        <div key={index} className={`mx-auto flex ${imageSide === 'right' ? 'flex-col-reverse' : 'flex-col'} xl:flex-row justify-center items-center gap-10 xl:gap-[90px] xl:min-h-[511px] w-full`}>
          {imageSide === 'left' && (
            <ScrollAnimation variant="zoom-in" className="flex justify-center xl:justify-start">
              {imageElement}
            </ScrollAnimation>
          )}

          <ScrollAnimation variant={imageSide === 'right' ? 'slide-right' : 'zoom-in'} delay={0.1}>
            <div className="flex w-full max-w-[549px] min-h-0 sm:min-h-[374px] flex-col items-start gap-2 sm:gap-[30px] bg-transparent">
              {block.items && block.items.length > 0 && (
                <div className="w-full space-y-2 sm:space-y-5">
                  {block.items.map((item: any, idx: number) => {
                    const itemTitle = typeof item.title === 'string' ? item.title : getLocalizedText(item.title, locale);
                    const itemText = typeof item.text === 'string' ? item.text : getLocalizedText(item.text, locale);
                    return (
                      <ScrollAnimation
                        key={idx}
                        variant={imageSide === 'right' ? 'slide-right' : 'slide-left'}
                        delay={idx * 0.15}
                        className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <FeaturesTickIcon className="mt-0.5 sm:mt-[5px]" />
                        <div className="flex flex-col items-start">
                          <p className="self-stretch text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-sm sm:text-[20px] font-semibold leading-tight sm:leading-[30px]">
                            {itemTitle}
                          </p>
                          <p className="self-stretch text-[var(--Color-2,#0F172A)] font-['Plus_Jakarta_Sans'] text-xs sm:text-[16px] font-normal leading-snug sm:leading-[26px]">
                            {itemText}
                          </p>
                        </div>
                      </ScrollAnimation>
                    );
                  })}
                </div>
              )}

              {blockButtonText && (
                <div>
                  <PrimaryLinkButton href={block.button.link || '#'}>
                    {blockButtonText} <ArrowRight className="h-4 w-4" />
                  </PrimaryLinkButton>
                </div>
              )}
            </div>
          </ScrollAnimation>

          {imageSide === 'right' && (
            <ScrollAnimation variant="slide-left" delay={0.1} className="flex justify-center xl:justify-end">
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
      className="relative overflow-hidden mx-auto w-full max-w-[1920px] flex justify-center items-start gap-[10px] py-10 sm:py-[90px] px-6 lg:px-10 xl:px-[clamp(24px,7.8125vw,150px)] bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F9FD_100%)]"
    >
      <div className="relative z-10 w-full max-w-[1340px]">
        {/* HEADER */}
        <ScrollAnimation variant="blur-in" className="mx-auto mb-8 sm:mb-[46px] max-w-4xl text-center flex flex-col items-center gap-6">
          {headerSub && (
            <p className="text-[15px] font-medium uppercase text-[#1D8FCF]">
              {headerSub}
            </p>
          )}

          {headerTitle && (
            <h2 className="text-2xl sm:text-[44px] lg:text-[56px] font-bold text-[#0F172A]">
              {headerTitle}
            </h2>
          )}

          {headerDescription && (
            <p className="mx-auto max-w-3xl text-sm sm:text-[16px] leading-[26px] text-[#0F172A]">
              {headerDescription}
            </p>
          )}
        </ScrollAnimation>

        <div className="flex flex-col gap-8 sm:gap-[90px]">
          {displayBlocks.map((block: any, index: number) => renderBlock(block, index))}
        </div>
      </div>
    </section>
  );
}
