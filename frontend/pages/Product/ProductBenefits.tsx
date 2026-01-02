import { benefits } from "./data";

interface ProductBenefitsProps {
    data?: any[];
}

export function ProductBenefits({ data }: ProductBenefitsProps) {
    const displayBenefits = data && data.length > 0 ? data : benefits;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayBenefits
                        .filter((benefit: any) => benefit.isActive !== false)
                        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
                        .map((benefit: any, index: number) => (
                        <div
                            key={benefit.id || index}
                            className="bg-white rounded-2xl p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100
          hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] transition-all duration-300"
                        >
                            {/* Icon box */}
                            {benefit.icon && (
                                <div className="flex justify-center mb-5">
                                    <div
                                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient || 'from-[#006FB3] to-[#0088D9]'}
              flex items-center justify-center shadow-md`}
                                    >
                                        <img
                                            src={benefit.icon}
                                            alt={benefit.title || ''}
                                            className="w-8 h-8"
                                        />
                                    </div>
                                </div>
                            )}

                            {benefit.title && (
                                <h4 className="text-gray-900 font-bold text-base mb-2">
                                    {benefit.title}
                                </h4>
                            )}

                            {benefit.description && (
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ProductBenefitsPage() {
    return null;
}
