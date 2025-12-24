import { Filter } from "lucide-react";

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
        <section className="py-8 bg-white border-b border-gray-200 sticky top-[88px] z-40 backdrop-blur-lg bg-white/95">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    <Filter className="text-gray-600 flex-shrink-0" size={20} />
                    {categoriesWithCount.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {category.name} ({category.count})
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};
