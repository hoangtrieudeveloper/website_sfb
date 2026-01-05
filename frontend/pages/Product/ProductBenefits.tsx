import { benefits } from "./data";

interface ProductBenefitsProps {
    data?: any[];
}

export function ProductBenefits({ data }: ProductBenefitsProps) {
    const displayBenefits = data && data.length > 0 ? data : benefits;

    return (
        <section className="py-[120px] bg-[#F8FBFE]">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-6">
                    {displayBenefits
                        .filter((benefit: any) => benefit.isActive !== false)
                        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
                        .map((benefit: any, index: number) => (
                            <div
                                key={benefit.id || index}
                                className="flex flex-col items-center flex-[1_0_0] p-[45px_14px] gap-[24px] rounded-[24px] border border-white bg-white shadow-[0_12px_36px_0_rgba(59,90,136,0.12)]"
                            >
                                {/* Icon box */}
                                {benefit.icon && (
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
                                )}

                                {benefit.title && (
                                    <h4 className="self-stretch text-[#0F172A] text-center text-[26px] font-bold leading-[38px]">
                                        {benefit.title}
                                    </h4>
                                )}

                                {benefit.description && (
                                    <p className="self-stretch text-[#0F172A] text-center text-[16px] font-normal leading-[26px]">
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
