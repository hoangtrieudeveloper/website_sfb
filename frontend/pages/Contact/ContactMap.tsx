import { mapData } from './data';

export function ContactMap() {
    return (
        <section className="h-[500px] w-full relative bg-gray-100">
            <iframe
                src={mapData.iframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            />
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ContactMapPage() {
    return null;
}