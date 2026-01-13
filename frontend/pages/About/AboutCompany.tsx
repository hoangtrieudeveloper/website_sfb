"use client";

import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { FadeIn, InViewSection } from "../../components/ui/motion";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

interface AboutCompanyProps {
    data?: any;
}

export function AboutCompany({ data }: AboutCompanyProps) {
    const { locale } = useLocale();

    // Chỉ sử dụng data từ API, không fallback static data
    if (!data || !data.data) {
        return null;
    }

    const displayData = data.data;
    const header = displayData.header;
    const content = displayData.content;
    const contact = displayData.contact;

    // Handle contacts array
    const contacts = displayData.contacts || contact?.items || [];

    // Localize fields
    const headerSub = displayData.headerSub
        ? (typeof displayData.headerSub === 'string' ? displayData.headerSub : getLocalizedText(displayData.headerSub, locale))
        : undefined;
    const headerTitleLine1 = displayData.headerTitleLine1
        ? (typeof displayData.headerTitleLine1 === 'string' ? displayData.headerTitleLine1 : getLocalizedText(displayData.headerTitleLine1, locale))
        : undefined;
    const headerTitleLine2 = displayData.headerTitleLine2
        ? (typeof displayData.headerTitleLine2 === 'string' ? displayData.headerTitleLine2 : getLocalizedText(displayData.headerTitleLine2, locale))
        : undefined;
    const contentTitle = displayData.contentTitle
        ? (typeof displayData.contentTitle === 'string' ? displayData.contentTitle : getLocalizedText(displayData.contentTitle, locale))
        : undefined;
    const contentDescription = displayData.contentDescription
        ? (typeof displayData.contentDescription === 'string' ? displayData.contentDescription : getLocalizedText(displayData.contentDescription, locale))
        : undefined;
    const contentButtonText = displayData.contentButtonText
        ? (typeof displayData.contentButtonText === 'string' ? displayData.contentButtonText : getLocalizedText(displayData.contentButtonText, locale))
        : undefined;
    const contactButtonText = displayData.contactButtonText || contact?.button?.text
        ? (typeof (displayData.contactButtonText || contact?.button?.text) === 'string'
            ? (displayData.contactButtonText || contact?.button?.text)
            : getLocalizedText(displayData.contactButtonText || contact?.button?.text, locale))
        : undefined;

    // Không render nếu thiếu dữ liệu quan trọng
    if (!displayData.headerTitleLine1 && !displayData.headerTitleLine2) {
        return null;
    }

    return (
        <section className="py-10 sm:py-20 bg-[#F8FBFE] overflow-hidden">
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <InViewSection className="mx-auto w-full max-w-[1340px]">
                    {/* Header */}
                    <FadeIn className="text-center mb-8 sm:mb-16">
                        {headerSub && (
                            <span className="text-[#2CA4E0] font-semibold text-[11px] sm:text-xs tracking-wider uppercase mb-3 block">
                                {headerSub}
                            </span>
                        )}
                        {(headerTitleLine1 || headerTitleLine2) && (
                            <h2 className="text-center text-[#0F172A] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl md:text-3xl lg:text-[56px] leading-tight sm:leading-[normal] break-words">
                                <span className="font-bold">
                                    {headerTitleLine1}
                                </span>
                                <br />
                                <span className="font-medium">
                                    {headerTitleLine2}
                                </span>
                            </h2>
                        )}
                    </FadeIn>

                    {/* Section 1: Intro + Handshake Image */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-24 items-center mb-16 sm:mb-32">
                        {/* Left: Image Card */}
                        <FadeIn className="relative w-full max-w-[450px] xl:max-w-[701px] flex-shrink-0" delay={0.2}>
                            <div className="rounded-[24px] p-1">
                                <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] overflow-hidden bg-gray-200 relative lg:ml-auto min-[1920px]:w-[701px] min-[1920px]:h-[511px] min-[1920px]:aspect-auto">
                                    <ImageWithFallback
                                        src={displayData.contentImage1 || content?.image1}
                                        alt={displayData.contentTitle || displayData.headerTitleLine1 || "SFB Team Meeting"}
                                        fill
                                        sizes="(max-width: 450px) 100vw, (max-width: 1200px) 50vw, 701px"
                                        loading="lazy"
                                        objectFit="cover"
                                        className="rounded-[14px] transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </FadeIn>

                        {/* Right: Content */}
                        <FadeIn className="flex-1" delay={0.4}>
                            {(contentTitle || contentDescription) && (
                                <div className="space-y-6 mb-[30px]">
                                    {contentTitle && (
                                        <h3 className="self-stretch w-full text-[#0F172A] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-xs sm:text-sm md:text-base lg:text-[20px] font-normal leading-relaxed md:leading-[30px] lg:leading-[38px] break-words">
                                            {contentTitle}
                                        </h3>
                                    )}
                                    {contentDescription && (
                                        <p className="self-stretch w-full text-[#0F172A] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-xs sm:text-sm md:text-base lg:text-[20px] font-normal leading-relaxed md:leading-[30px] lg:leading-[38px] break-words">
                                            {contentDescription}
                                        </p>
                                    )}
                                </div>
                            )}
                            {contentButtonText && (
                                <div>
                                    <Link
                                        href={displayData.contentButtonLink || content?.button?.link || '#'}
                                        prefetch={true}
                                        className="inline-flex items-center gap-[12px] px-6 sm:px-[30px] py-[7px] h-12 sm:h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-xs sm:text-sm transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
                                    >
                                        {contentButtonText}
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </FadeIn>
                    </div>

                    {/* Section 2: Contact Info + Building Image */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-24 items-center">
                        {/* Left: Contact Info */}
                        <FadeIn className="order-2 lg:order-1 space-y-8 flex-1 pl-4 lg:pl-0" delay={0.2}>
                            <div className="space-y-6">
                                {contacts.map((item: any, idx: number) => {
                                    const IconComponent = item.iconName
                                        ? ((LucideIcons as any)[item.iconName] || LucideIcons.Building2)
                                        : (item.icon || LucideIcons.Building2);
                                    const itemTitle = typeof item.title === 'string' ? item.title : getLocalizedText(item.title, locale);
                                    const itemText = typeof item.text === 'string' ? item.text : getLocalizedText(item.text, locale);
                                    return (
                                        <div key={idx} className="flex items-start gap-4 group">
                                            <div className="flex-shrink-0 p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                                                <IconComponent className="text-[#2CA4E0]" size={20} />
                                            </div>
                                            <div className="flex flex-col justify-center min-h-[40px]">
                                                {item.isHighlight ? (
                                                    <h4 className="self-stretch font-bold text-gray-900 text-xs sm:text-base lg:text-[20px] lg:font-semibold lg:text-[#0F172A] lg:leading-[30px] lg:font-['Plus_Jakarta_Sans'] [font-feature-settings:'liga'_off,'clig'_off] break-words leading-relaxed">
                                                        {itemTitle}: <span className="font-normal text-gray-600 lg:text-[#0F172A] lg:text-[16px] lg:leading-[26px] lg:font-normal lg:font-['Plus_Jakarta_Sans']">{itemTitle}</span>
                                                    </h4>
                                                ) : (
                                                    <>
                                                        <h4 className="self-stretch text-[#0F172A] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-xs sm:text-base lg:text-[20px] font-bold lg:font-semibold leading-tight lg:leading-[30px] break-words mb-1">{itemText}</h4>
                                                        <p className="text-gray-600 text-[11px] sm:text-sm leading-relaxed break-words self-stretch lg:text-[#0F172A] lg:text-[16px] lg:leading-[26px] lg:font-normal lg:font-['Plus_Jakarta_Sans']">
                                                            {itemText}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {contactButtonText && (
                                <div className="pt-2">
                                    <Link
                                        href={displayData.contactButtonLink || contact?.button?.link || '#'}
                                        prefetch={true}
                                        className="inline-flex items-center gap-[12px] px-6 sm:px-[30px] py-[7px] h-12 sm:h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-xs sm:text-sm transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
                                    >
                                        {contactButtonText}
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </FadeIn>

                        {/* Right: Building Image */}
                        <FadeIn className="order-1 lg:order-2 relative w-full max-w-[450px] xl:max-w-[701px] flex-shrink-0" delay={0.4}>
                            <div className="rounded-[24px] p-1">
                                <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] overflow-hidden bg-gray-200 relative lg:ml-auto min-[1920px]:w-[701px] min-[1920px]:h-[511px] min-[1920px]:aspect-auto">
                                    <ImageWithFallback
                                        src={displayData.contactImage2 || contact?.image2}
                                        alt={displayData.headerTitleLine1 || displayData.headerTitleLine2 || "SFB Office Building"}
                                        fill
                                        sizes="(max-width: 450px) 100vw, (max-width: 1200px) 50vw, 701px"
                                        loading="lazy"
                                        objectFit="cover"
                                        className="rounded-[14px] transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </InViewSection>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutCompany;
