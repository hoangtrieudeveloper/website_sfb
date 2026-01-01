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
export function Features() {

  return (
    <section
      className="relative overflow-hidden mx-auto w-full max-w-[1920px] min-h-[2166px] flex justify-center items-start gap-[10px] py-[90px] px-[10px] bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F9FD_100%)]"
    >
      <div className="relative z-10 w-full max-w-[1340px]">
        {/* HEADER */}
        <ScrollAnimation variant="blur-in" className="mx-auto mb-[46px] max-w-4xl text-center flex flex-col items-center gap-6">
          <p className="text-[15px] font-medium uppercase text-[#1D8FCF]">
            {featureData.header.sub}
          </p>

          <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] font-bold text-[#0F172A]">
            {featureData.header.title}
          </h2>

          <p className="mx-auto max-w-3xl text-[16px] leading-[26px] text-[#0F172A]">
            {featureData.header.description}
          </p>
        </ScrollAnimation>

        <div className="flex flex-col gap-[90px]">
          {/* BLOCK 1 */}
          <div className="mx-auto flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-[90px] lg:min-h-[511px] w-full">
            <ScrollAnimation variant="slide-right" className="flex justify-center lg:justify-start">
              <FeatureImageFrame src={featureData.block1.image} alt="SFB overview" />
            </ScrollAnimation>

            <ScrollAnimation variant="slide-left" delay={0.1}>
              <div className="flex w-[549px] max-w-full flex-col items-start gap-[30px]">
                <p className="w-full text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-normal leading-[38px]">
                  {featureData.block1.text}
                </p>

                <div className="w-full space-y-[18px]">
                  {featureData.block1.list.map((t, idx) => (
                    <ScrollAnimation
                      key={t}
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

                <div>
                  <PrimaryLinkButton href={featureData.block1.button.link}>
                    {featureData.block1.button.text} <ArrowRight className="h-4 w-4" />
                  </PrimaryLinkButton>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* BLOCK 2 */}
          <div className="mx-auto flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-[90px] lg:min-h-[511px] w-full">
          <ScrollAnimation variant="slide-right">
            {/* ✅ bỏ shadow */}
          <div className="flex w-[549px] max-w-full min-h-[374px] flex-col items-start gap-[30px] bg-transparent">
              <div className="w-full space-y-5">
                {featureData.block2.items.map((item, idx) => (
                  <ScrollAnimation
                    key={item.title}
                    variant="slide-right"
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

              <div>
                <PrimaryLinkButton href={featureData.block2.button.link}>
                  {featureData.block2.button.text} <ArrowRight className="h-4 w-4" />
                </PrimaryLinkButton>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation variant="slide-left" delay={0.1} className="flex justify-center lg:justify-end">
            <FeatureImageFrame src={featureData.block2.image} alt="Business tech" />
          </ScrollAnimation>
          </div>

          {/* BLOCK 3 */}
          <div className="mx-auto flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-[90px] lg:min-h-[511px] w-full">
          <ScrollAnimation variant="zoom-in" className="flex justify-center lg:justify-start">
            <FeatureImageFrame src={featureData.block3.image} alt="Workflow" />
          </ScrollAnimation>

          <ScrollAnimation variant="zoom-in" delay={0.1}>
            {/* ✅ bỏ shadow */}
          <div className="flex w-[549px] max-w-full min-h-[374px] flex-col items-start gap-[30px] bg-transparent">
              <div className="w-full space-y-5">
                {featureData.block3.items.map((item, idx) => (
                  <ScrollAnimation
                    key={item.title}
                    variant="slide-left"
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

              <div>
                <PrimaryLinkButton href={featureData.block3.button.link}>
                  {featureData.block3.button.text} <ArrowRight className="h-4 w-4" />
                </PrimaryLinkButton>
              </div>
            </div>
          </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
