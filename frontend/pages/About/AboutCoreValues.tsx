// Icons are now imported in data.tsx and passed as components

import { coreValues } from "./data";
export function AboutCoreValues() {

    return (
        <section className="py-20 bg-[#F8FBFE]">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                        Giá trị cốt lõi
                    </h2>
                    <p className="text-gray-600 md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Những nguyên tắc định hình văn hoá và cách SFB hợp tác với khách hàng, đối tác và đội ngũ nội bộ
                    </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coreValues.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-[24px] p-8 flex flex-col items-center text-center shadow-[0_18px_36px_0_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_0_rgba(0,0,0,0.1)] transition-shadow duration-300"
                            >
                                <div className="mb-6 text-[#2CA4E0]">
                                    {/* Used a stroke width of 1.5 to match the lighter feel of the design icons */}
                                    <Icon size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[#0F172A] text-xl font-bold mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
