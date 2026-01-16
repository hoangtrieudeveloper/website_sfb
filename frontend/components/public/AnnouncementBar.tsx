"use client";

import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

interface AnnouncementBarProps {
    isVisible: boolean;
    onDismiss: () => void;
    title?: string | Record<'vi' | 'en' | 'ja', string>;
    message?: string | Record<'vi' | 'en' | 'ja', string>;
    ctaText?: string | Record<'vi' | 'en' | 'ja', string>;
    ctaLink?: string;
}

export function AnnouncementBar({ isVisible, onDismiss, title, message, ctaText, ctaLink }: AnnouncementBarProps) {
    const { locale } = useLocale();

    // Fallback texts nếu không có từ settings
    const defaultTexts = {
        vi: {
            emoji: "🎉",
            title: "Khuyến mãi đặc biệt:",
            message: "Giảm 20% cho khách hàng mới đăng ký tư vấn trong tháng 12!",
            cta: "Nhận ưu đãi",
            dismissLabel: "Đóng thông báo"
        },
        en: {
            emoji: "🎉",
            title: "Special Promotion:",
            message: "Get 20% off for new customers registering for consultation in December!",
            cta: "Get Offer",
            dismissLabel: "Dismiss announcement"
        },
        ja: {
            emoji: "🎉",
            title: "特別プロモーション:",
            message: "12月に新規お客様が相談登録すると20%オフ！",
            cta: "オファーを受け取る",
            dismissLabel: "お知らせを閉じる"
        }
    };

    // Sử dụng text từ settings hoặc fallback
    const localizedTitle = title ? getLocalizedText(title, locale) : defaultTexts[locale]?.title || defaultTexts.vi.title;
    const localizedMessage = message ? getLocalizedText(message, locale) : defaultTexts[locale]?.message || defaultTexts.vi.message;
    const localizedCta = ctaText ? getLocalizedText(ctaText, locale) : defaultTexts[locale]?.cta || defaultTexts.vi.cta;
    const dismissLabel = defaultTexts[locale]?.dismissLabel || defaultTexts.vi.dismissLabel;
    const emoji = defaultTexts[locale]?.emoji || defaultTexts.vi.emoji;
    
    // Link CTA: nếu có từ settings thì dùng, không thì fallback về /contact
    const ctaHref = ctaLink || `/${locale}/contact`;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white"
                >
                    <div className="container mx-auto px-6 py-3">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                                <Sparkles size={18} className="flex-shrink-0 animate-pulse" />
                                <p className="text-sm md:text-base font-medium">
                                    <span className="hidden sm:inline">{emoji} </span>
                                    {localizedTitle && <strong>{localizedTitle} </strong>}
                                    {localizedMessage}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {localizedCta && (
                                    <Link
                                        href={ctaHref}
                                        className="hidden sm:inline-flex px-4 py-1.5 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
                                    >
                                        {localizedCta}
                                    </Link>
                                )}
                                <button
                                    onClick={onDismiss}
                                    className="p-1 hover:bg-white/20 rounded transition-colors"
                                    aria-label={dismissLabel}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
