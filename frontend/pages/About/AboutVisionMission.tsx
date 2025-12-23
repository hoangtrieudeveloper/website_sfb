import { visionMissionSectionData } from "./data";

export function AboutVisionMission() {

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-[1340px] mx-auto px-6">
                {/* Section header */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-6">
                        {visionMissionSectionData.header.title}
                    </h2>
                    <p className="text-gray-600 md:text-lg leading-relaxed max-w-3xl mx-auto">
                        {visionMissionSectionData.header.description}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visionMissionSectionData.items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#EFF8FC] rounded-[16px] p-6 flex items-start gap-4 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#2CA4E0] flex items-center justify-center bg-white/50">
                                <span className="text-[#2CA4E0] font-bold text-lg number-font">
                                    {item.id}
                                </span>
                            </div>
                            <div className="mt-2.5">
                                <p className="text-[#334155] font-medium leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
