"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { ContactForm } from "@/pages/Contact/ContactForm";

type Locale = "vi" | "en" | "ja";

const MODAL_TITLE: Record<Locale, string> = {
  vi: "Đăng ký dùng thử",
  en: "Request a trial",
  ja: "トライアル登録",
};

const MODAL_SUBTITLE: Record<Locale, string> = {
  vi: "Điền thông tin — chúng tôi sẽ liên hệ trong thời gian sớm nhất.",
  en: "Fill in your details — we will get back to you shortly.",
  ja: "ご記入ください。追ってご連絡いたします。",
};

const CLOSE_ARIA: Record<Locale, string> = {
  vi: "Đóng",
  en: "Close",
  ja: "閉じる",
};

export type ContactFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  /** Cùng cấu trúc `contactData.form` từ API / trang liên hệ */
  formData?: {
    header?: string;
    description?: string;
    fields?: any;
    button?: { submit?: string; success?: string };
    services?: string[];
  };
};

export function ContactFormModal({
  isOpen,
  onClose,
  locale,
  formData,
}: ContactFormModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-form-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[min(90vh,900px)] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#0870B4] to-[#2EABE2] px-5 py-4 sm:px-6 sm:py-5 text-white flex justify-between items-start gap-4 shrink-0">
          <div>
            <h2
              id="contact-form-modal-title"
              className="text-xl sm:text-2xl font-bold"
            >
              {MODAL_TITLE[locale]}
            </h2>
            <p className="text-blue-100 text-sm mt-1 leading-snug">
              {MODAL_SUBTITLE[locale]}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
            aria-label="Đóng"
          >
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-4 sm:px-6 py-5">
          <ContactForm data={formData} hideIntro locale={locale} />
        </div>
      </div>
    </div>
  );
}
