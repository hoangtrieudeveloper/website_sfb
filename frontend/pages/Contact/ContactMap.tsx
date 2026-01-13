import { mapData } from './data';
import { getLocalizedText } from '@/lib/utils/i18n';

type Locale = 'vi' | 'en' | 'ja';

interface ContactMapProps {
    data?: {
        address?: string | Record<Locale, string>;
        iframeSrc?: string;
    };
    locale?: Locale;
}

export function ContactMap({ data, locale = 'vi' }: ContactMapProps = {}) {
    const mapConfig = data || mapData;
    
    // Localize address if it's a locale object
    const address = mapConfig.address
        ? (typeof mapConfig.address === 'string' 
            ? mapConfig.address 
            : getLocalizedText(mapConfig.address, locale))
        : undefined;
    
    return (
        <section className="w-full relative bg-gray-100 h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] xl:h-[560px] 2xl:h-[600px]">
            <iframe
                src={mapConfig.iframeSrc || mapData.iframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                title={address || "Map"}
            />
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ContactMapPage() {
    return null;
}