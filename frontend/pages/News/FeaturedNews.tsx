import { Calendar, User, Clock, Eye, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import Link from "next/link";
import { newsSectionHeaders, uiText } from "./data";

interface FeaturedNewsProps {
    featuredNews: any;
}

export const FeaturedNews = ({ featuredNews }: FeaturedNewsProps) => {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-gray-900 mb-2">{newsSectionHeaders.featured.title}</h2>
                    <p className="text-gray-600">{newsSectionHeaders.featured.subtitle}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group hover:shadow-3xl transition-all duration-500">
                    <div className="relative h-96 lg:h-full overflow-hidden">
                        <ImageWithFallback
                            src={featuredNews.image}
                            alt={featuredNews.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div
                            className={`absolute inset-0 bg-gradient-to-tr ${featuredNews.gradient} opacity-20`}
                        />

                        <div className="absolute top-6 left-6">
                            <span
                                className={`px-5 py-2 bg-gradient-to-r ${featuredNews.gradient} text-white rounded-full text-sm font-semibold shadow-lg`}
                            >
                                {featuredNews.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-10 lg:p-14">
                        <h3 className="text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                            {featuredNews.title}
                        </h3>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {featuredNews.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{featuredNews.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{featuredNews.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{featuredNews.readTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye size={16} />
                                <span>{featuredNews.views} lượt xem</span>
                            </div>
                        </div>

                        <Link
                            href={featuredNews.link || "/news-detail"}
                            className={`group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${featuredNews.gradient} text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-semibold`}
                        >
                            Đọc bài viết
                            <ArrowRight
                                className="group-hover/btn:translate-x-2 transition-transform"
                                size={20}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
