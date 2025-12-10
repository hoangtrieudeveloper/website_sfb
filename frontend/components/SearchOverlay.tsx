"use client";

import { Search, X, TrendingUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Popular searches (could be fetched from API)
    const popularSearches = [
        "Hệ thống ERP",
        "Giải pháp Cloud",
        "Chuyển đổi số",
        "Phần mềm quản lý",
        "Big Data",
    ];

    // Load recent searches from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("recentSearches");
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            }
        }
    }, []);

    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        // Save to recent searches
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));

        // Navigate to search results (implement your search logic)
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {/* Search Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed top-0 left-0 right-0 z-[101] bg-white shadow-2xl"
                    >
                        <div className="container mx-auto px-6 py-8">
                            {/* Search Input */}
                            <div className="relative max-w-3xl mx-auto mb-8">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch(query);
                                        }
                                    }}
                                    placeholder="Tìm kiếm sản phẩm, giải pháp, tin tức..."
                                    className="w-full pl-16 pr-16 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#006FB3] focus:outline-none transition-colors"
                                    aria-label="Search input"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Close search"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Search Suggestions */}
                            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Clock size={16} />
                                                Tìm kiếm gần đây
                                            </h3>
                                            <button
                                                onClick={clearRecentSearches}
                                                className="text-xs text-gray-500 hover:text-[#006FB3] transition-colors"
                                            >
                                                Xóa tất cả
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {recentSearches.map((search, idx) => (
                                                <motion.button
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    onClick={() => handleSearch(search)}
                                                    className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    {search}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Popular Searches */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <TrendingUp size={16} />
                                        Tìm kiếm phổ biến
                                    </h3>
                                    <div className="space-y-2">
                                        {popularSearches.map((search, idx) => (
                                            <motion.button
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => handleSearch(search)}
                                                className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                {search}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="max-w-3xl mx-auto mt-8 pt-8 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-3">Hoặc khám phá:</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "Sản phẩm", href: "/products" },
                                        { label: "Giải pháp", href: "/solutions" },
                                        { label: "Tin tức", href: "/news" },
                                        { label: "Liên hệ", href: "/contact" },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="px-4 py-2 bg-blue-50 text-[#006FB3] rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                            onClick={onClose}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
