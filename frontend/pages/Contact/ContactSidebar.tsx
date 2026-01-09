"use client";

import { useState } from 'react';
import { Phone, Calendar, MapPin, Mail } from 'lucide-react';
import { contactSidebarData } from './data';
import { AppointmentModal } from './AppointmentModal';
import * as LucideIcons from "lucide-react";

interface ContactSidebarProps {
    data?: {
        quickActions?: any;
        offices?: Array<{
            city?: string;
            address?: string;
            phone?: string;
            email?: string;
        }>;
        socials?: Array<{
            iconName?: string;
            href?: string;
            label?: string;
            gradient?: string;
        }>;
    };
}

export function ContactSidebar({ data }: ContactSidebarProps = {}) {
    const sidebarConfig = data || contactSidebarData;
    const { quickActions, offices: officesData, socials: socialsData } = sidebarConfig;

    // Handle offices - có thể là array hoặc object với items
    const offices = Array.isArray(officesData)
        ? officesData
        : ((officesData && 'items' in officesData) ? officesData.items : (contactSidebarData.offices?.items || []));
    const officesTitle = (officesData && 'title' in officesData)
        ? officesData.title
        : (contactSidebarData.offices?.title || "Văn phòng chi nhánh");

    // Handle socials - có thể là array hoặc object với items
    const socials = Array.isArray(socialsData)
        ? socialsData
        : ((socialsData && 'items' in socialsData) ? socialsData.items : (contactSidebarData.socials?.items || []));
    const socialsTitle = (socialsData && 'title' in socialsData)
        ? socialsData.title
        : (contactSidebarData.socials?.title || "Kết nối với chúng tôi");

    return (
        <div className="space-y-8 w-full box-border px-4 sm:px-0">

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#0870B4] to-[#2EABE2] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden">
               

                <div className="relative z-10">
                    <h3 className="text-white mb-6">{quickActions?.title || contactSidebarData.quickActions.title}</h3>
                    <p className="text-blue-100 mb-8 leading-relaxed">
                        {quickActions?.description || contactSidebarData.quickActions.description}
                    </p>

                    <div className="space-y-4">
                        <a
                            href={quickActions?.buttons?.hotline?.href || contactSidebarData.quickActions.buttons.hotline.href}
                            className="flex items-center gap-4 p-4 sm:p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-blue-200 mb-1">{quickActions?.buttons?.hotline?.label || contactSidebarData.quickActions.buttons.hotline.label}</div>
                                <div className="font-semibold">{quickActions?.buttons?.hotline?.value || contactSidebarData.quickActions.buttons.hotline.value}</div>
                            </div>
                        </a>

                        <button
                            className="w-full flex items-center gap-4 p-4 sm:p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all group text-left"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calendar className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-blue-200 mb-1">{quickActions?.buttons?.appointment?.label || contactSidebarData.quickActions.buttons.appointment.label}</div>
                                <div className="font-semibold">{quickActions?.buttons?.appointment?.value || contactSidebarData.quickActions.buttons.appointment.value}</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Office Locations */}
            {offices.map((office: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-100">
                    <h3 className="text-gray-900 mb-6">{officesTitle}</h3>
                    <div className="space-y-6">
                        <div className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                            <div className="font-semibold text-gray-900 mb-3">{office.city}</div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                    <MapPin className="flex-shrink-0 mt-0.5" size={16} />
                                    <span>{office.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="flex-shrink-0" size={16} />
                                    <a href={`tel:${office.phone}`} className="hover:text-blue-600 transition-colors">
                                        {office.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="flex-shrink-0" size={16} />
                                    <a href={`mailto:${office.email}`} className="hover:text-blue-600 transition-colors">
                                        {office.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {/* Social Media */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-gray-100">
                <h4 className="text-gray-900 mb-6">{socialsTitle}</h4>
                <div className="flex flex-nowrap gap-3 sm:gap-4 justify-center sm:justify-start overflow-x-auto">
                    {socials.map((social: any, idx: number) => {
                        const Icon = social.iconName ? ((LucideIcons as any)[social.iconName] || LucideIcons.Facebook) : (social.icon || LucideIcons.Facebook);
                        return (
                            <a
                                key={idx}
                                href={social.href}
                                className={`flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0 bg-gradient-to-r ${social.gradient || "from-blue-600 to-blue-700"} text-white rounded-full md:hover:shadow-lg transition-all md:hover:scale-110`}
                                aria-label={social.label || ""}
                            >
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ContactSidebarPage() {
    return null;
}