"use client";

import { useState } from 'react';
import { Phone, Calendar, MapPin, Mail } from 'lucide-react';
import { contactSidebarData } from './data';
import { AppointmentModal } from './AppointmentModal';

export function ContactSidebar() {
    const { quickActions, offices, socials } = contactSidebarData;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#0870B4] to-[#2EABE2] rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

                <div className="relative z-10">
                    <h3 className="text-white mb-6">{quickActions.title}</h3>
                    <p className="text-blue-100 mb-8 leading-relaxed">
                        {quickActions.description}
                    </p>

                    <div className="space-y-4">
                        <a
                            href={quickActions.buttons.hotline.href}
                            className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-blue-200 mb-1">{quickActions.buttons.hotline.label}</div>
                                <div className="font-semibold">{quickActions.buttons.hotline.value}</div>
                            </div>
                        </a>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all group text-left"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calendar className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-blue-200 mb-1">{quickActions.buttons.appointment.label}</div>
                                <div className="font-semibold">{quickActions.buttons.appointment.value}</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Office Locations */}
            <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
                <h3 className="text-gray-900 mb-6">{offices.title}</h3>
                <div className="space-y-6">
                    {offices.items.map((office, idx) => (
                        <div key={idx} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
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
                    ))}
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl p-10 border-2 border-gray-100">
                <h4 className="text-gray-900 mb-6">{socials.title}</h4>
                <div className="flex gap-4">
                    {socials.items.map((social, idx) => {
                        const Icon = social.icon;
                        return (
                            <a
                                key={idx}
                                href={social.href}
                                className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${social.gradient} text-white rounded-full hover:shadow-lg transition-all transform hover:scale-110`}
                                aria-label={social.label}
                            >
                                <Icon size={24} />
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
