import { Tag } from "lucide-react";
import { newsletterData } from "./data";

export const Newsletter = () => {
    const Icon = newsletterData.icon;

    return (
        <section className="py-28 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
                        <Icon className="text-cyan-400" size={20} />
                        <span className="text-white font-semibold text-sm">
                            {newsletterData.badge}
                        </span>
                    </div>

                    <h2 className="text-white mb-6">{newsletterData.title}</h2>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                        {newsletterData.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder={newsletterData.emailPlaceholder}
                            className="flex-1 px-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                        <button className="px-10 py-5 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold whitespace-nowrap">
                            {newsletterData.buttonText}
                        </button>
                    </div>

                    <p className="text-sm text-blue-200 mt-6">
                        {newsletterData.securityNote}
                    </p>
                </div>
            </div>
        </section>
    );
};
