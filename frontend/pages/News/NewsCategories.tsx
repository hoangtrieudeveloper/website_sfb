import { Filter } from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";

interface Category {
    id: string;
    name: string;
    count?: number;
}

interface NewsCategoriesProps {
    categoriesWithCount: Category[];
    selectedCategory: string;
    setSelectedCategory: (category: any) => void;
}

export const NewsCategories = ({
    categoriesWithCount,
    selectedCategory,
    setSelectedCategory,
}: NewsCategoriesProps) => {
    return (
        <motion.section
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="py-8 bg-white border-b border-gray-200 sticky top-[88px] z-40 backdrop-blur-lg bg-white/95"
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
                    <Filter className="text-gray-600 flex-shrink-0" size={20} />
                    <LayoutGroup>
                        {categoriesWithCount.map((category) => {
                            const isSelected = selectedCategory === category.id;
                            return (
                                <motion.button
                                    layout
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`relative px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors z-10 ${isSelected ? "text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {category.name} <span className="opacity-80 text-xs ml-1">({category.count})</span>
                                </motion.button>
                            );
                        })}
                    </LayoutGroup>
                </div>
            </div>
        </motion.section>
    );
};
