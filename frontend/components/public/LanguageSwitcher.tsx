"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCALE_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt', code: 'VN', icon: '/icons/flags/vi.svg' },
  { value: 'en', label: 'English', code: 'EN', icon: '/icons/flags/en.svg' },
  { value: 'ja', label: '日本語', code: 'JP', icon: '/icons/flags/ja.svg' },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const currentOption = LOCALE_OPTIONS.find(opt => opt.value === locale);

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as 'vi' | 'en' | 'ja')}>
      <SelectTrigger className={`flex !w-[40px] !h-[40px] !p-0 justify-center items-center gap-0 !rounded-full border border-[#222] bg-transparent focus:ring-0 focus:ring-offset-0 [&_svg]:hidden data-[state=open]:opacity-80 hover:opacity-80 transition-opacity ${className}`}>
        {currentOption && (
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img
              src={currentOption.icon}
              alt={currentOption.label}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[150px]">
        {LOCALE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value} className="cursor-pointer py-2">
            <div className="flex items-center gap-3">
              <div className="relative w-6 h-6 rounded-full overflow-hidden shadow-sm shrink-0 border border-border">
                <img
                  src={option.icon}
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium">{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
