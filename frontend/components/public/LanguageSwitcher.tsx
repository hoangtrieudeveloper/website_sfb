"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCALE_OPTIONS = [
  { value: 'vi', label: '🇻🇳 VIE', flag: '🇻🇳' },
  { value: 'en', label: '🇬🇧 Eng', flag: '🇬🇧' },
  { value: 'ja', label: '🇯🇵 日本語', flag: '🇯🇵' },
] as const;

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const currentOption = LOCALE_OPTIONS.find(opt => opt.value === locale);

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as 'vi' | 'en' | 'ja')}>
      <SelectTrigger className="w-[140px] h-9 border-gray-300">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-600" />
          <SelectValue>
            {currentOption && (
              <span className="flex items-center gap-1.5">
                <span>{currentOption.flag}</span>
                <span className="hidden sm:inline">{currentOption.label.split(' ')[1]}</span>
              </span>
            )}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {LOCALE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <span>{option.flag}</span>
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
