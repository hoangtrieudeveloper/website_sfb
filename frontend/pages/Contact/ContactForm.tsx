"use client";

import { useState } from 'react';
import { Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { services, contactFormData } from './data';

interface ContactFormProps {
    data?: {
        header?: string;
        description?: string;
        fields?: any;
        button?: { submit?: string; success?: string };
        services?: string[];
    };
}

export function ContactForm({ data }: ContactFormProps = {}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const formConfig = data || contactFormData;
    const { header, description, fields, button } = formConfig;
    const buttonConfig = button || contactFormData.button;
    const servicesList = (data?.services && data.services.length > 0) ? data.services : services;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <div className="mb-10">
                <h2 className="text-gray-900 mb-4">{header}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2">
                            {fields.name.label} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder={fields.name.placeholder}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">
                            {fields.email.label} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder={fields.email.placeholder}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2">
                            {fields.phone.label} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder={fields.phone.placeholder}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">
                            {fields.company.label}
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder={fields.company.placeholder}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">
                        {fields.service.label} <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="">{fields.service.placeholder}</option>
                        {servicesList.map((service, idx) => (
                            <option key={idx} value={service}>{service}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">
                        {fields.message.label} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder={fields.message.placeholder}
                    />
                </div>

                <button
                    type="submit"
                    className="group w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-3 font-semibold"
                >
                    {submitted ? (
                        <>
                            <CheckCircle2 size={24} />
                            {buttonConfig.success}
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            {buttonConfig.submit}
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ContactFormPage() {
    return null;
}