import type { ReactNode } from "react";

type Locale = 'vi' | 'en' | 'ja';

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Note: In Next.js 15+, params is a Promise
  // We'll handle the lang attribute in the page components via metadata
  // For now, return children as-is
  return <>{children}</>;
}
