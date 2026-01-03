"use client";

import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { aboutCompanySectionData } from "./data";
import { FadeIn, TechBorderReveal } from "../../components/ui/motion";
import * as LucideIcons from "lucide-react";

interface AboutCompanyProps {
  data?: any;
}

export function AboutCompany({ data }: AboutCompanyProps) {
    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || aboutCompanySectionData;
    const header = displayData.header || aboutCompanySectionData.header;
    const content = displayData.content || aboutCompanySectionData.content;
    const contact = displayData.contact || aboutCompanySectionData.contact;
    
    // Handle contacts array
    const contacts = displayData.contacts || contact?.items || [];

    return (
        <section className="py-20 bg-[#F8FBFE] overflow-hidden">
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <div className="mx-auto w-full max-w-[1340px]">
                {/* Header */}
                <FadeIn className="text-center mb-16">
                    {displayData.headerSub && (
                        <span className="text-[#2CA4E0] font-semibold text-sm tracking-wider uppercase mb-3 block">
                            {displayData.headerSub}
                        </span>
                    )}
                    {(displayData.headerTitleLine1 || displayData.headerTitleLine2) && (
                        <h2 className="text-center text-[#0F172A] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[56px] leading-[normal]">
                            <span className="font-bold">
                                {displayData.headerTitleLine1}
                            </span>
                            <br />
                            <span className="font-medium">
                                {displayData.headerTitleLine2}
                            </span>
                        </h2>
                    )}
                </FadeIn>

                {/* Section 1: Intro + Handshake Image */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center mb-32">
                    {/* Left: Image Card */}
                    <FadeIn className="relative w-full max-w-[701px] flex-shrink-0" delay={0.2}>
                        <TechBorderReveal className="rounded-[24px] p-1">
                            <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] overflow-hidden bg-gray-200 relative group">
                                <ImageWithFallback
                                    src={displayData.contentImage1 || content?.image1}
                                    alt="SFB Team Meeting"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </TechBorderReveal>
                    </FadeIn>

                    {/* Right: Content */}
                    <FadeIn className="flex-1" delay={0.4}>
                        {(displayData.contentTitle || displayData.contentDescription) && (
                            <div className="space-y-6 mb-[30px]">
                                {displayData.contentTitle && (
                                    <h3 className="self-stretch w-full text-[#0F172A] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-normal leading-[38px]">
                                        {displayData.contentTitle}
                                    </h3>
                                )}
                                {displayData.contentDescription && (
                                    <p className="self-stretch w-full text-[#0F172A] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-normal leading-[38px]">
                                        {displayData.contentDescription}
                                    </p>
                                )}
                            </div>
                        )}
                        {displayData.contentButtonText && (
                            <div>
                                <a
                                    href={displayData.contentButtonLink || content?.button?.link || '#'}
                                    className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
                                >
                                    {displayData.contentButtonText}
                                    <ArrowRight size={16} />
                                </a>
                            </div>
                        )}
                    </FadeIn>
                </div>

                {/* Section 2: Contact Info + Building Image */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                    {/* Left: Contact Info */}
                    <FadeIn className="order-2 lg:order-1 space-y-8 flex-1 pl-4 lg:pl-0" delay={0.2}>
                        <div className="space-y-6">
                            {contacts.map((item: any, idx: number) => {
                                const IconComponent = item.iconName
                                    ? ((LucideIcons as any)[item.iconName] || LucideIcons.Building2)
                                    : (item.icon || LucideIcons.Building2);
                                return (
                                    <div key={idx} className="flex items-start gap-4 group">
                                        <div className="mt-1 p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                                            <IconComponent className="text-[#2CA4E0]" size={20} />
                                        </div>
                                        <div>
                                            {item.isHighlight ? (
                                                <h4 className="font-bold text-gray-900 mb-1">
                                                    {item.title}: <span className="font-normal text-gray-600">{item.text}</span>
                                                </h4>
                                            ) : (
                                                <>
                                                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {item.text}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {displayData.contactButtonText && (
                            <div className="pt-2">
                                <a
                                    href={displayData.contactButtonLink || contact?.button?.link || '#'}
                                    className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
                                >
                                    {displayData.contactButtonText || contact?.button?.text}
                                    <ArrowRight size={16} />
                                </a>
                            </div>
                        )}
                    </FadeIn>

                    {/* Right: Building Image */}
                    <FadeIn className="order-1 lg:order-2 relative w-full max-w-[701px] flex-shrink-0" delay={0.4}>
                        <TechBorderReveal className="rounded-[24px] p-1">
                            <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] overflow-hidden bg-gray-200 relative group">
                                <ImageWithFallback
                                    src={displayData.contactImage2 || contact?.image2}
                                    alt="SFB Office Building"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </TechBorderReveal>
                    </FadeIn>
                </div>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutCompany;
