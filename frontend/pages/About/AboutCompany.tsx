"use client";

import { ArrowRight, MapPin, Phone, Mail, Building2 } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { aboutCompanySectionData } from "./data";
import { FadeIn, TechBorderReveal } from "../../components/ui/motion";

export function AboutCompany() {
    const { header, content, contact } = aboutCompanySectionData;

    return (
        <section className="py-20 bg-[#F8FBFE] overflow-hidden">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <FadeIn className="text-center mb-16">
                    <span className="text-[#2CA4E0] font-semibold text-sm tracking-wider uppercase mb-3 block">
                        {header.sub}
                    </span>
                    <h2 className="text-[#1A202C] text-3xl md:text-4xl font-bold leading-tight">
                        {header.title.line1}
                        <br />
                        {header.title.line2}
                    </h2>
                </FadeIn>

                {/* Section 1: Intro + Handshake Image */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center mb-32">
                    {/* Left: Image Card */}
                    <FadeIn className="relative w-full lg:w-[701px] flex-shrink-0" delay={0.2}>
                        <TechBorderReveal className="rounded-[24px] p-1">
                            <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] overflow-hidden bg-gray-200 relative group">
                                <ImageWithFallback
                                    src={content.image1}
                                    alt="SFB Team Meeting"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </TechBorderReveal>
                    </FadeIn>

                    {/* Right: Content */}
                    <FadeIn className="space-y-6 flex-1" delay={0.4}>
                        <h3 className="text-gray-900 text-lg font-bold leading-relaxed">
                            {content.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-light">
                            {content.description}
                        </p>
                        <div className="pt-4">
                            <a
                                href={content.button.link}
                                className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
                            >
                                {content.button.text}
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </FadeIn>
                </div>

                {/* Section 2: Contact Info + Building Image */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                    {/* Left: Contact Info */}
                    <FadeIn className="order-2 lg:order-1 space-y-8 flex-1 pl-4 lg:pl-0" delay={0.2}>
                        <div className="space-y-6">
                            {contact.items.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div key={idx} className="flex items-start gap-4 group">
                                        <div className="mt-1 p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                                            <Icon className="text-[#2CA4E0]" size={20} />
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

                        <div className="pt-2">
                            <a
                                href={contact.button.link}
                                className="inline-flex items-center gap-[12px] px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm transition-transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
                            >
                                {contact.button.text}
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </FadeIn>

                    {/* Right: Building Image */}
                    <FadeIn className="order-1 lg:order-2 relative w-full lg:w-[701px] flex-shrink-0" delay={0.4}>
                        <TechBorderReveal className="rounded-[24px] p-1">
                            <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-[0_18px_36px_0_rgba(0,95,148,0.12)] overflow-hidden bg-gray-200 relative group">
                                <ImageWithFallback
                                    src={contact.image2}
                                    alt="SFB Office Building"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </TechBorderReveal>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
