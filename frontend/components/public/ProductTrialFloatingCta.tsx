"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { ContactFormModal } from "@/components/public/ContactFormModal";
import { publicApiCall } from "@/lib/api/public/client";
import { PublicEndpoints } from "@/lib/api/public/endpoints";
import { applyLocale } from "@/lib/utils/i18n";
import type { Locale } from "@/lib/utils/i18n";

const TRIAL_CTA_LABEL: Record<Locale, string> = {
  vi: "Đăng ký dùng thử",
  en: "Request a trial",
  ja: "トライアル登録",
};

const DEFAULT_BTN_POS = "bottom-5 right-5";

type ProductTrialFloatingCtaProps = {
  locale: Locale;
  /** Ví dụ `bottom-24 right-6` khi trang có nút cuộn fixed góc phải dưới */
  buttonPositionClassName?: string;
};

export function ProductTrialFloatingCta({
  locale,
  buttonPositionClassName = DEFAULT_BTN_POS,
}: ProductTrialFloatingCtaProps) {
  const [contactFormData, setContactFormData] = useState<any>(null);
  const [trialModalOpen, setTrialModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const contactResponse = await publicApiCall<{
          success: boolean;
          data?: { form?: unknown };
        }>(PublicEndpoints.contact.get, {}, locale);
        if (cancelled) return;
        if (contactResponse?.success && contactResponse.data?.form) {
          setContactFormData(
            applyLocale(contactResponse.data.form as Record<string, unknown>, locale),
          );
        } else {
          setContactFormData(null);
        }
      } catch {
        if (!cancelled) setContactFormData(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <>
      <button
        type="button"
        onClick={() => setTrialModalOpen(true)}
        className={`fixed z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 ${buttonPositionClassName}`}
      >
        <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
        {TRIAL_CTA_LABEL[locale]}
      </button>

      <ContactFormModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        locale={locale}
        formData={contactFormData ?? undefined}
      />
    </>
  );
}
