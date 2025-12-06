"use client";

import { Search, Filter } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface NewsFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function NewsFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: NewsFiltersProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-[88px] z-40 backdrop-blur-lg bg-white/95">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="text-gray-600 flex-shrink-0" size={20} />
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
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
    </>
  );
}

