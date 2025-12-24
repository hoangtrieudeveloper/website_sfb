import { Search } from "lucide-react";
import { newsHeroData } from "./data";

interface NewsHeroProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const NewsHero = ({ searchQuery, setSearchQuery }: NewsHeroProps) => {
    const Icon = newsHeroData.icon;

    return (
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-32 pb-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
                        <Icon className="text-cyan-400" size={20} />
                        <span className="text-white font-semibold text-sm">
                            {newsHeroData.badge}
                        </span>
                    </div>

                    <h1 className="text-white mb-8 text-5xl md:text-6xl">
                        {newsHeroData.title.prefix}
                        <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {newsHeroData.title.highlight}
                        </span>
                    </h1>

                    <p className="text-xl text-blue-100 leading-relaxed mb-10">
                        {newsHeroData.description}
                    </p>

                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <Search
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder={newsHeroData.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
