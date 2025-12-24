import { Eye } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { newsDetailData } from "../data";

interface DetailFeaturedImageProps {
    article: any;
}

export const DetailFeaturedImage = ({ article }: DetailFeaturedImageProps) => {
    return (
        <section className="container mx-auto px-6 -mt-10 relative z-20 mb-20">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />

                <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm flex items-center gap-2">
                    <Eye size={14} />
                    <span>
                        {article.views}
                        {newsDetailData.viewsSuffix}
                    </span>
                </div>
            </div>
        </section>
    );
};
