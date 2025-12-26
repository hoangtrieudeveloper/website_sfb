import { Search } from "lucide-react";
import { newsHeroData } from "./data";
import { motion, Variants } from "framer-motion";

interface NewsHeroProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const NewsHero = ({ searchQuery, setSearchQuery }: NewsHeroProps) => {
    const Icon = newsHeroData.icon;

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-32 pb-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.3, 0.2],
                        x: [0, 50, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl mx-auto text-center"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8 hover:bg-white/20 transition-colors cursor-default">
                        <Icon className="text-cyan-400" size={20} />
                        <span className="text-white font-semibold text-sm">
                            {newsHeroData.badge}
                        </span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-white mb-8 text-5xl md:text-6xl font-bold tracking-tight">
                        {newsHeroData.title.prefix}
                        <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent relative">
                            {newsHeroData.title.highlight}
                            <motion.span
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-50"
                            />
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-blue-100 leading-relaxed mb-10">
                        {newsHeroData.description}
                    </motion.p>

                    <motion.div variants={itemVariants} className="max-w-xl mx-auto">
                        <div className="relative group">
                            <Search
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-400 transition-colors"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder={newsHeroData.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] focus:shadow-[0_0_25px_rgba(34,211,238,0.3)]"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
