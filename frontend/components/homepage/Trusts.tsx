"use client";

import Link from "next/link";
import { trustSectionData } from "./data";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "../public/ScrollAnimation";
import * as LucideIcons from "lucide-react";

interface TrustsProps {
  data?: any;
}

export function Trusts({ data }: TrustsProps) {
  // Use data from props if available, otherwise fallback to static data
  const subHeader = data?.subHeader || trustSectionData.subHeader;
  const title = data?.title || trustSectionData.title;
  const description = data?.description || trustSectionData.description;
  const image = data?.image || trustSectionData.image;
  const button = data?.button || trustSectionData.button;
  const features = data?.features || trustSectionData.features;

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="mx-auto w-full max-w-[1920px] px-6 xl:px-0 xl:px-[clamp(24px,7.8125vw,150px)]">
        {/* Header */}
        <ScrollAnimation variant="fade-up" className="text-center mb-16">
          <span className="text-[#0088D9] font-bold text-sm tracking-widest uppercase mb-3 block">
            {subHeader}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </ScrollAnimation>

        <div className="flex flex-col xl:flex-row justify-center items-center gap-12 xl:gap-20">
          {/* Left Column - Image */}
          <ScrollAnimation variant="slide-right" className="relative group">
            <div
              className="relative box-border w-full max-w-[701px] aspect-[701/555]"
              style={{
                flexShrink: 0,
                borderRadius: "24px",
                background: `url(${image}) lightgray -51.4px 0px / 140.667% 100% no-repeat`,
                boxShadow: "0px 24px 36px 0px rgba(0, 0, 0, 0.12)",
              }}
            />
          </ScrollAnimation>

          {/* Right Column - Content */}
          <div className="flex w-full max-w-[549px] flex-col items-start gap-[30px] min-w-0">
            {features.map((feature: any, idx: number) => {
              const IconComponent = feature.iconName ? (LucideIcons as any)[feature.iconName] : feature.icon;
              const Icon = IconComponent || LucideIcons.BarChart3;
              
              return (
              <ScrollAnimation
                key={idx}
                variant="flip-up"
                delay={idx * 0.1}
                className="flex gap-4 items-start flex-1 min-w-0"
              >
                <div className="flex-shrink-0 pt-1">
                  {Icon ? <Icon className="w-6 h-6 text-[#1D8FCF]" /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 15.0002V16.8C3 17.9201 3 18.4798 3.21799 18.9076C3.40973 19.2839 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H21.0002M3 15.0002V5M3 15.0002L6.8534 11.7891L6.85658 11.7865C7.55366 11.2056 7.90288 10.9146 8.28154 10.7964C8.72887 10.6567 9.21071 10.6788 9.64355 10.8584C10.0105 11.0106 10.3323 11.3324 10.9758 11.9759L10.9822 11.9823C11.6357 12.6358 11.9633 12.9635 12.3362 13.1153C12.7774 13.2951 13.2685 13.3106 13.7207 13.1606C14.1041 13.0334 14.4542 12.7275 15.1543 12.115L21 7" stroke="#1D8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  )}
                </div>
                <div>
                  <h3
                    className="self-stretch text-[#0F172A] mb-2 group-hover:text-[#006FB3] transition-colors"
                    style={{
                      fontFamily: '"Plus Jakarta Sans"',
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "30px",
                      fontFeatureSettings: "'liga' off, 'clig' off",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="self-stretch text-[#0F172A]"
                    style={{
                      textAlign: "justify",
                      fontFamily: '"Plus Jakarta Sans"',
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "30px",
                      fontFeatureSettings: "'liga' off, 'clig' off",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </ScrollAnimation>
              );
            })}

            <ScrollAnimation variant="fade-up" delay={0.4}>
              <Link
                href={button.link || "#"}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 transition-all duration-300 group"
              >
                <span>{button.text}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}