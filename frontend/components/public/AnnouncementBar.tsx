"use client";

import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

interface AnnouncementBarProps {
    isVisible: boolean;
    onDismiss: () => void;
}

export function AnnouncementBar({ isVisible, onDismiss }: AnnouncementBarProps) {

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
                                    <span className="hidden sm:inline">🎉 </span>
                                    <strong>Khuyến mãi đặc biệt:</strong> Giảm 20% cho khách hàng mới đăng ký tư vấn trong tháng 12!
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/contact"
                                    className="hidden sm:inline-flex px-4 py-1.5 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
                                >
                                    Nhận ưu đãi
                                </Link>
                                <button
                                    onClick={onDismiss}
                                    className="p-1 hover:bg-white/20 rounded transition-colors"
                                    aria-label="Dismiss announcement"
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
