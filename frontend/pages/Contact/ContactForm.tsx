"use client";

import { useState } from 'react';
import { Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { services, contactFormData } from './data';
import { PublicEndpoints } from '@/lib/api/public/endpoints';
import { baseFetch } from '@/lib/api/base';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formConfig = data || contactFormData;
    const { header, description, fields, button } = formConfig;
    const buttonConfig = button || contactFormData.button;
    const servicesList = (data?.services && data.services.length > 0) ? data.services : services;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await baseFetch(PublicEndpoints.contact.submit, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            setSubmitted(true);
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                service: '',
                message: ''
            });
            setTimeout(() => setSubmitted(false), 3000);
        } catch (err: any) {
            setError(err?.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="w-full box-border px-4 sm:px-0">
            <div className="mb-8 sm:mb-10">
                <h2 className="text-gray-900 mb-4">{header}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
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
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder={fields.email.placeholder}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
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
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
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
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
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
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder={fields.message.placeholder}
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || submitted}
                    className="group w-auto mx-auto sm:w-full sm:mx-0 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl md:hover:shadow-2xl md:hover:shadow-cyan-500/50 transition-all md:hover:scale-105 flex items-center justify-center gap-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {submitted ? (
                        <>
                            <CheckCircle2 size={24} />
                            {buttonConfig.success}
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            {loading ? 'Đang gửi...' : buttonConfig.submit}
                            {!loading && <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />}
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