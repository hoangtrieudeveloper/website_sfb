import { Calendar, User, Clock, Eye, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import Link from "next/link";
import { newsSectionHeaders, uiText } from "./data";
import { motion } from "framer-motion";

interface FeaturedNewsProps {
    featuredNews: any;
}

export const FeaturedNews = ({ featuredNews }: FeaturedNewsProps) => {
    const isTuyenSinh = featuredNews?.title === "Hệ thống tuyển sinh đầu cấp";
    const featuredImageSrc = isTuyenSinh ? "/images/news/news1.png" : featuredNews?.image;

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-gray-900 mb-2">{newsSectionHeaders.featured.title}</h2>
                    <p className="text-gray-600">{newsSectionHeaders.featured.subtitle}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{
                        y: -5,
                        boxShadow: "0 25px 50px -12px rgba(34, 211, 238, 0.15)",
                        borderColor: "rgba(34, 211, 238, 0.5)"
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group"
                >
                    <div className="relative h-96 lg:h-full overflow-hidden">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.7 }}
                            className="w-full h-full"
                        >
                            <ImageWithFallback
                                src={featuredImageSrc}
                                alt={featuredNews.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <div
                            className={`absolute inset-0 bg-gradient-to-tr ${featuredNews.gradient} opacity-20`}
                        />

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-6 left-6"
                        >
                            <span
                                className={`px-5 py-2 bg-gradient-to-r ${featuredNews.gradient} text-white rounded-full text-sm font-semibold shadow-lg backdrop-blur-md`}
                            >
                                {featuredNews.category}
                            </span>
                        </motion.div>
                    </div>

                    <div className="p-10 lg:p-14">
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-900 mb-4 group-hover:text-blue-600 transition-colors"
                        >
                            {featuredNews.title}
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-gray-600 mb-8 leading-relaxed"
                        >
                            {featuredNews.excerpt}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-500"
                        >
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
                        </motion.div>

                        <Link
                            href={featuredNews.link || "/news-detail"}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${featuredNews.gradient} text-white rounded-xl hover:shadow-xl transition-all font-semibold`}
                            >
                                Đọc bài viết
                                <ArrowRight
                                    className="group-hover/btn:translate-x-2 transition-transform"
                                    size={20}
                                />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
