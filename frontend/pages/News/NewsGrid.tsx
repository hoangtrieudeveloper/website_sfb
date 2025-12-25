import { Bookmark, Share2, User, Clock, Calendar, MessageCircle, Heart, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import Link from "next/link";
import { newsSectionHeaders, uiText } from "./data";

interface NewsGridProps {
    filteredNews: Array<{
        id: number;
        title: string;
        slug?: string;
        excerpt?: string;
        imageUrl?: string;
        image?: string;
        likes?: number;
        comments?: number;
        publishedDate?: string;
        categoryId?: string;
        categoryName?: string;
        category?: string;
        author?: string;
        readTime?: string;
        gradient?: string;
        link?: string;
    }>;
}

export const NewsGrid = ({ filteredNews }: NewsGridProps) => {
    return (
        <section className="py-28 bg-white">
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-gray-900 mb-2">{newsSectionHeaders.latest.title}</h2>
                    <p className="text-gray-600">
                        {newsSectionHeaders.latest.subtitle}
                    </p>
                </div>

                {filteredNews.length === 0 ? (
                    <div className="text-center text-gray-500">
                        {uiText.noResults}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((article) => (
                            (() => {
                                const imageSrc =
                                    article.imageUrl ||
                                    article.image ||
                                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80";

                                const gradient = article.gradient || "from-blue-600 to-cyan-600";

                                const categoryLabel =
                                    article.categoryName ||
                                    article.category ||
                                    (article.categoryId === "company"
                                        ? "Tin công ty"
                                        : article.categoryId === "product"
                                            ? "Sản phẩm & giải pháp"
                                            : article.categoryId === "tech"
                                                ? "Tin công nghệ"
                                                : "Tin tức");

                                const href = article.link || (article.slug ? `/news/${article.slug}` : "/news-detail");

                                return (
                            <article
                                key={article.id}
                                className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <ImageWithFallback
                                        src={imageSrc}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-tr ${gradient} opacity-20`}
                                    />

                                    <div className="absolute top-4 left-4">
                                        <span
                                            className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-full text-xs font-semibold shadow-lg`}
                                        >
                                            {categoryLabel}
                                        </span>
                                    </div>

                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110">
                                            <Bookmark size={16} className="text-gray-700" />
                                        </button>
                                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110">
                                            <Share2 size={16} className="text-gray-700" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h4 className="text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {article.title}
                                    </h4>

                                    {article.excerpt && (
                                        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <User size={14} />
                                            <span>{article.author || "SFB Technology"}</span>
                                        </div>
                                        {article.readTime && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} />
                                                <span>{article.readTime}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            {article.publishedDate && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{article.publishedDate}</span>
                                                </div>
                                            )}
                                            {typeof article.likes === "number" && (
                                                <div className="flex items-center gap-1">
                                                    <Heart size={14} />
                                                    <span>{article.likes}</span>
                                                </div>
                                            )}
                                            {typeof article.comments === "number" && (
                                                <div className="flex items-center gap-1">
                                                    <MessageCircle size={14} />
                                                    <span>{article.comments}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            href={href}
                                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 group/link"
                                        >
                                            {uiText.readMore}
                                            <ArrowRight
                                                size={16}
                                                className="group-hover/link:translate-x-1 transition-transform"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                                );
                            })()
                        ))}
                    </div>
                )}

                <div className="text-center mt-16">
                    <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 inline-flex items-center gap-3 font-semibold">
                        {uiText.loadMore}
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};
