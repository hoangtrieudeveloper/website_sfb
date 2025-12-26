import {
    ArrowLeft,
    ChevronRight,
    TrendingUp,
    Calendar,
    Clock,
    Eye,
    Heart,
    Bookmark,
    Facebook,
    Twitter,
    Linkedin,
    Link as LinkIcon,
} from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { newsDetailData } from "../data";

interface DetailHeroProps {
    article: any;
    likes: number;
    isLiked: boolean;
    handleLike: () => void;
    isBookmarked: boolean;
    setIsBookmarked: (val: boolean) => void;
}

export const DetailHero = ({
    article,
    likes,
    isLiked,
    handleLike,
    isBookmarked,
    setIsBookmarked,
}: DetailHeroProps) => {
    return (
        <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-50 via-[#E6F4FF] to-[#D6EEFF] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:18px_28px]" />
            <div className="absolute -top-24 -right-10 w-80 h-80 rounded-full bg-cyan-400/30 blur-3xl" />
            <div className="absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="mx-auto max-w-[1340px] px-6 2xl:px-0 relative z-10">
                <nav className="flex items-center gap-2 text-sm mb-8 text-gray-500">
                    <a
                        href="/news"
                        className="text-gray-600 hover:text-[#006FB3] transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        {newsDetailData.breadcrumb}
                    </a>
                    <ChevronRight size={16} className="text-gray-400" />
                    <span className="text-gray-400">{article.category}</span>
                </nav>

                <div className="max-w-6xl">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white rounded-full text-sm font-semibold shadow-lg mb-6">
                        <TrendingUp size={16} />
                        {article.category}
                    </div>

                    <h1 className="text-gray-900 mb-6 max-w-5xl text-3xl md:text-4xl lg:text-5xl">
                        {article.title}
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-4xl leading-relaxed">
                        {article.subtitle}
                    </p>

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] border-2 border-white shadow-lg overflow-hidden">
                                    <ImageWithFallback
                                        src={article.author.avatar}
                                        alt={article.author.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {article.author.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {article.author.position}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{article.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{article.readTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={16} />
                                    <span>{article.views}{newsDetailData.viewsSuffix}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${isLiked
                                        ? "bg-red-50 border-red-200 text-red-600"
                                        : "bg-white border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600"
                                    }`}
                            >
                                <Heart size={18} className={isLiked ? "fill-red-600" : ""} />
                                <span>{likes}</span>
                            </button>

                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`px-4 py-2.5 rounded-xl border-2 transition-all ${isBookmarked
                                        ? "bg-[#E6F4FF] border-[#006FB3] text-[#006FB3]"
                                        : "bg-white border-gray-200 text-gray-700 hover:border-[#006FB3] hover:text-[#006FB3]"
                                    }`}
                            >
                                <Bookmark
                                    size={18}
                                    className={isBookmarked ? "fill-[#006FB3]" : ""}
                                />
                            </button>

                            <div className="hidden md:flex items-center gap-2 ml-2">
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1877F2] text-white hover:shadow-lg transition-all transform hover:scale-105">
                                    <Facebook size={18} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1DA1F2] text-white hover:shadow-lg transition-all transform hover:scale-105">
                                    <Twitter size={18} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0A66C2] text-white hover:shadow-lg transition-all transform hover:scale-105">
                                    <Linkedin size={18} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                                    <LinkIcon size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
