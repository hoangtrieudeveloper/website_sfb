"use client";

import { useState } from "react";
import { NewsHero } from "./NewsHero";
import { NewsCategories } from "./NewsCategories";
import { FeaturedNews } from "./FeaturedNews";
import { NewsGrid } from "./NewsGrid";
import { Newsletter } from "./Newsletter";
import { categories, featuredNewsData, newsList } from "./data";

export function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Tự động tính số lượng bài theo từng category
  const categoriesWithCount = categories.map((cat) => {
    if (cat.id === "all") {
      return { ...cat, count: newsList.length };
    }
    const count = newsList.filter(
      (n) => n.categoryId === cat.id,
    ).length;
    return { ...cat, count };
  });

  // Lọc theo danh mục + ô search
  const filteredNews = newsList.filter((article) => {
    const matchCategory =
      selectedCategory === "all" ||
      article.categoryId === selectedCategory;

    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q);

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen">
      <NewsHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <NewsCategories
        categoriesWithCount={categoriesWithCount}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <FeaturedNews featuredNews={featuredNewsData} />
      <NewsGrid filteredNews={filteredNews} />
      <Newsletter />
    </div>
  );
}

export default NewsPage;
