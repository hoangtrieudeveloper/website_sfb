"use client";


import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { products, categories, CategoryId, productListSectionData } from "./data";

export function ProductList() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter((p) => p.category === selectedCategory);


    return (
        <section id="products" className="bg-white">
            <div className="w-full max-w-[1920px] mx-auto">
                {/* Title */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-[24px]">
                    <div className="text-[15px] font-semibold tracking-widest text-[#2EABE2] uppercase">
                        {productListSectionData.header.subtitle}
                    </div>

                    <h2 className="text-gray-900 text-4xl md:text-5xl font-extrabold">
                        {productListSectionData.header.title}
                    </h2>

                    <p className="text-gray-600 leading-relaxed">
                        {productListSectionData.header.description}
                    </p>
                </div>

                {/* Pills filter ngay dưới title */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-10 mb-14">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const active = selectedCategory === category.id;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2
              ${active
                                        ? "bg-[#0870B4] text-white shadow-md"
                                        : "bg-[#EAF5FF] text-[#0870B4] hover:bg-[#DCEFFF]"
                                    }`}
                            >
                                <Icon size={16} />
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {/* Grid cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] px-6 lg:px-[290px]">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex w-full h-fit p-6 flex-col items-start gap-6 flex-[1_0_0] rounded-[24px] bg-[var(--Color-7,#FFF)] shadow-[0_8px_30px_0_rgba(0,0,0,0.06)]"
                        >
                            {/* Image kiểu ảnh: có padding + khung */}
                            <div className="w-full">
                                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                                    <div className="relative aspect-[16/7]">
                                        <ImageWithFallback
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full">
                                <div className="text-xs text-gray-500 mb-2">{product.meta}</div>

                                <h3 className="text-gray-900 font-bold mb-1">{product.name}</h3>

                                <div className="text-[#0870B4] font-semibold text-sm mb-3">
                                    {product.tagline}
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                                    {product.description}
                                </p>

                                {/* Features */}
                                <div className="space-y-3 w-full">
                                    {product.features.slice(0, 4).map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2
                                                size={18}
                                                className="text-white fill-[#1D8FCF] flex-shrink-0 mt-0.5"
                                            />
                                            <span className="text-gray-700 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer giống ảnh: button nhỏ + button xanh */}
                            <div className="w-full flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <div className="text-xs text-gray-500">Giá tham khảo</div>
                                    <div className="text-lg font-extrabold text-gray-900">
                                        Liên hệ
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        className="px-5 py-2 rounded-lg bg-[#EAF5FF] text-[#0870B4]
                            font-semibold text-sm hover:bg-[#DCEFFF] transition
                             inline-flex items-center gap-2"
                                    >
                                        Demo nhanh
                                        <img
                                            src="/icons/custom/product_media.svg"
                                            alt="media"
                                            className="w-6 h-6"
                                        />
                                    </button>

                                    <button className="px-5 py-2 rounded-lg bg-[#0870B4] text-white font-semibold text-sm hover:bg-[#075F98] transition inline-flex items-center gap-2">
                                        Tìm hiểu thêm <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
