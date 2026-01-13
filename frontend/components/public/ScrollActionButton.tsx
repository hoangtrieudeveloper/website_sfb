"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useLocale } from "@/lib/contexts/LocaleContext";

export function ScrollActionButton() {
    const { locale } = useLocale();
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY < 300);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollAction = () => {
        if (isAtTop) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const label = isAtTop
        ? (locale === 'vi' ? "Cuộn xuống cuối" : locale === 'en' ? "Scroll to bottom" : "一番下までスクロール")
        : (locale === 'vi' ? "Cuộn lên đầu" : locale === 'en' ? "Scroll to top" : "一番上までスクロール");

    return (
        <button
            onClick={handleScrollAction}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#1D8FCF] text-white shadow-lg hover:bg-[#166FE5] transition-all duration-300 hover:scale-110"
            aria-label={label}
            title={label}
        >
            {isAtTop ? (
                <ArrowDown size={24} />
            ) : (
                <ArrowUp size={24} />
            )}
        </button>
    );
}
