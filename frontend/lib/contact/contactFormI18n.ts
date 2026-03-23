import type { Locale } from "@/lib/utils/i18n";
import { contactFormData, services as servicesVi } from "@/pages/Contact/data";

export type ContactFormI18nBundle = {
  header: string;
  description: string;
  fields: typeof contactFormData.fields;
  button: typeof contactFormData.button;
  sending: string;
  errorFallback: string;
  services: string[];
};

const en: ContactFormI18nBundle = {
  header: "Send a consultation request",
  description:
    "Fill in the details below — we will respond within 24 hours",
  fields: {
    name: { label: "Full name", placeholder: "John Smith" },
    email: { label: "Email", placeholder: "email@example.com" },
    phone: { label: "Phone number", placeholder: "+84 901 234 567" },
    company: { label: "Company", placeholder: "Company name" },
    service: { label: "Service of interest", placeholder: "Select a service" },
    message: {
      label: "Message",
      placeholder: "Describe your needs in detail...",
    },
  },
  button: { submit: "Send request", success: "Sent successfully!" },
  sending: "Sending...",
  errorFallback: "Something went wrong. Please try again.",
  services: [
    "Cloud computing",
    "Software development",
    "Data management",
    "Business intelligence",
    "AI & machine learning",
    "Cybersecurity",
    "Other",
  ],
};

const ja: ContactFormI18nBundle = {
  header: "ご相談・お問い合わせ",
  description:
    "以下にご入力ください。24時間以内にご返信いたします。",
  fields: {
    name: { label: "お名前", placeholder: "山田 太郎" },
    email: { label: "メール", placeholder: "email@example.com" },
    phone: { label: "電話番号", placeholder: "090-1234-5678" },
    company: { label: "会社名", placeholder: "会社名" },
    service: { label: "ご関心のサービス", placeholder: "サービスを選択" },
    message: {
      label: "お問い合わせ内容",
      placeholder: "ご要件を具体的にご記入ください...",
    },
  },
  button: { submit: "送信する", success: "送信しました！" },
  sending: "送信中...",
  errorFallback:
    "送信に失敗しました。しばらくしてからもう一度お試しください。",
  services: [
    "クラウドコンピューティング",
    "ソフトウェア開発",
    "データ管理",
    "ビジネスインテリジェンス",
    "AI・機械学習",
    "サイバーセキュリティ",
    "その他",
  ],
};

const vi: ContactFormI18nBundle = {
  ...contactFormData,
  sending: "Đang gửi...",
  errorFallback: "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.",
  services: [...servicesVi],
};

export const CONTACT_FORM_I18N: Record<Locale, ContactFormI18nBundle> = {
  vi,
  en,
  ja,
};
