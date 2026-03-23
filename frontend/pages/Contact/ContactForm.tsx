"use client";

import { useState, useRef, useLayoutEffect } from 'react';
import { Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { services as servicesViBaseline, contactFormData } from './data';
import { CONTACT_FORM_I18N } from '@/lib/contact/contactFormI18n';
import { PublicEndpoints } from '@/lib/api/public/endpoints';
import { baseFetch } from '@/lib/api/base';
import {
    getLocalizedText,
    resolveContactFieldText,
    type Locale,
} from '@/lib/utils/i18n';

/** CMS có thể vẫn lưu label/placeholder cũ "Công ty" sau khi đổi mặc định sang Đơn vị */
const COMPANY_LABEL_LEGACY_VI = ['Công ty'];
const COMPANY_PLACEHOLDER_LEGACY_VI = ['Tên công ty'];

function resolveServiceOption(
    item: unknown,
    locale: Locale,
    viList: string[],
    i18nList: string[],
): string {
    const norm = (s: string) => s.trim();
    if (item === null || item === undefined) return '';
    if (typeof item === 'object' && !Array.isArray(item)) {
        if ('vi' in item || 'en' in item || 'ja' in item) {
            return getLocalizedText(item as Record<Locale, string>, locale);
        }
    }
    if (typeof item === 'string') {
        try {
            const p = JSON.parse(item);
            if (
                p &&
                typeof p === 'object' &&
                ('vi' in p || 'en' in p || 'ja' in p)
            ) {
                return getLocalizedText(p, locale);
            }
        } catch {
            /* plain */
        }
        const idx = viList.findIndex((v) => norm(v) === norm(item));
        if (locale !== 'vi' && idx >= 0) return i18nList[idx] ?? item;
        return item;
    }
    return String(item);
}

interface ContactFormProps {
    data?: {
        header?: string;
        description?: string;
        fields?: any;
        button?: { submit?: string; success?: string };
        services?: string[];
    };
    /** Ẩn tiêu đề + mô tả (dùng trong popup, cùng fields/API với trang liên hệ) */
    hideIntro?: boolean;
    className?: string;
    locale?: Locale;
}

export function ContactForm({
    data,
    hideIntro,
    className,
    locale = 'vi',
}: ContactFormProps) {
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
    const feedbackRef = useRef<HTMLDivElement>(null);
    const raw = data || {};
    const formConfig = {
        ...contactFormData,
        ...raw,
        fields: { ...contactFormData.fields, ...(raw.fields || {}) },
        button: { ...contactFormData.button, ...(raw.button || {}) },
    };
    const {
        header: headerRaw,
        description: descRaw,
        fields: fieldsRaw,
        button: buttonRaw,
    } = formConfig;

    const i18n = CONTACT_FORM_I18N[locale];

    const header = resolveContactFieldText(headerRaw, locale, {
        fallback: i18n.header,
        viBaseline: contactFormData.header,
    });
    const description = resolveContactFieldText(descRaw, locale, {
        fallback: i18n.description,
        viBaseline: contactFormData.description,
    });

    const fieldKeys = [
        'name',
        'email',
        'phone',
        'company',
        'service',
        'message',
    ] as const;
    const fields: Record<
        (typeof fieldKeys)[number],
        { label: string; placeholder: string }
    > = {} as Record<
        (typeof fieldKeys)[number],
        { label: string; placeholder: string }
    >;
    for (const key of fieldKeys) {
        const viF = contactFormData.fields[key];
        const i18nF = i18n.fields[key];
        const rawF = fieldsRaw?.[key] || {};
        const isCompany = key === 'company';
        fields[key] = {
            label: resolveContactFieldText(rawF.label, locale, {
                fallback: i18nF.label,
                viBaseline: viF.label,
                ...(isCompany && { legacyViBaselines: COMPANY_LABEL_LEGACY_VI }),
            }),
            placeholder: resolveContactFieldText(rawF.placeholder, locale, {
                fallback: i18nF.placeholder,
                viBaseline: viF.placeholder,
                ...(isCompany && { legacyViBaselines: COMPANY_PLACEHOLDER_LEGACY_VI }),
            }),
        };
    }

    const buttonConfig = {
        submit: resolveContactFieldText(buttonRaw?.submit, locale, {
            fallback: i18n.button.submit,
            viBaseline: contactFormData.button.submit,
        }),
        success: resolveContactFieldText(buttonRaw?.success, locale, {
            fallback: i18n.button.success,
            viBaseline: contactFormData.button.success,
        }),
    };

    const servicesList =
        data?.services && data.services.length > 0
            ? data.services.map((service: unknown) =>
                  resolveServiceOption(
                      service,
                      locale,
                      servicesViBaseline,
                      i18n.services,
                  ),
              )
            : i18n.services;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await baseFetch<{
                success?: boolean;
                message?: string;
            }>(PublicEndpoints.contact.submit, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (result?.success === false) {
                throw new Error(
                    result.message?.trim() || i18n.errorFallback,
                );
            }

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
            setError(err?.message || i18n.errorFallback);
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

    useLayoutEffect(() => {
        if (!submitted && !error) return;
        requestAnimationFrame(() => {
            feedbackRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        });
    }, [submitted, error]);

    return (
        <div
            className={[
                'w-full box-border',
                hideIntro ? '' : 'px-4 sm:px-0',
                className || '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {!hideIntro && (
                <div className="mb-8 sm:mb-10">
                    <h2 className="text-gray-900 mb-4">{header}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {description}
                    </p>
                </div>
            )}

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
                        {servicesList.map((service: string, idx: number) => (
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

                {(submitted || error) && (
                    <div ref={feedbackRef} className="scroll-mt-4 space-y-4">
                        {submitted && (
                            <div
                                className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900"
                                role="status"
                                aria-live="polite"
                            >
                                <CheckCircle2
                                    className="shrink-0 text-emerald-600 mt-0.5"
                                    size={22}
                                    aria-hidden
                                />
                                <p className="text-sm sm:text-base font-medium leading-snug">
                                    {buttonConfig.success}
                                </p>
                            </div>
                        )}
                        {error && (
                            <div
                                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm sm:text-base"
                                role="alert"
                                aria-live="assertive"
                            >
                                {error}
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || submitted}
                    className={[
                        'group w-auto mx-auto sm:w-full sm:mx-0 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl md:hover:shadow-2xl md:hover:shadow-cyan-500/50 transition-all md:hover:scale-105 flex items-center justify-center gap-3 font-semibold whitespace-nowrap',
                        loading && !submitted && 'opacity-60 cursor-wait',
                        submitted && 'opacity-100',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {submitted ? (
                        <>
                            <CheckCircle2 size={24} />
                            {buttonConfig.success}
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            {loading ? i18n.sending : buttonConfig.submit}
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