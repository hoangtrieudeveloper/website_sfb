import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";
import { newsDetailData } from "../data";

interface RelatedArticlesProps {
    relatedArticles: any[];
}

export const RelatedArticles = ({ relatedArticles }: RelatedArticlesProps) => {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-[#E6F4FF] to-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-gray-900 mb-4">
                        {newsDetailData.relatedArticlesTitle}
                    </h2>
                    <p className="text-xl text-gray-600">
                        {newsDetailData.relatedArticlesSubtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {relatedArticles.map((article) => (
                        <a
                            key={article.id}
                            href="#"
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <ImageWithFallback
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span
                                        className={`px-3 py-1 bg-gradient-to-r ${article.gradient} text-white rounded-full text-xs font-semibold shadow-lg`}
                                    >
                                        {article.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-gray-900 mb-3 line-clamp-2 group-hover:text-[#006FB3] transition-colors">
                                    {article.title}
                                </h4>
                                <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                                    <span>{article.readTime}</span>
                                    <span className="flex items-center gap-1 text-[#006FB3] font-medium group-hover:translate-x-1 transition-transform">
                                        {newsDetailData.readNow}
                                        <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
