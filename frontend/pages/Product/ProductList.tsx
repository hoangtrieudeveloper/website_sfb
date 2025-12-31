"use client";


import { Fragment, useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { products, categories, CategoryId } from "./data";
import Link from "next/link";

const slugify = (s: string) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const splitMetaParts = (meta: string) => {
    const normalized = meta.trim();
    if (!normalized) return { parts: [] as string[], separator: "•" as string };

    if (/[•·]/.test(normalized)) {
        const parts = normalized
            .split(/[•·]/)
            .map((p) => p.trim())
            .filter(Boolean);
        const separator = normalized.includes("•") ? "•" : "·";
        return { parts, separator };
    }

    // Only treat '.' as a separator when it looks like a list delimiter.
    const dotParts = normalized
        .split(/\s*\.\s*/)
        .map((p) => p.trim())
        .filter(Boolean);
    if (dotParts.length >= 2) return { parts: dotParts, separator: "." };

    return { parts: [normalized], separator: "•" };
};

export function ProductList() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter((p) => p.category === selectedCategory);


    return (
        <section id="products" className="bg-white">
            <div className="w-full max-w-[1920px] mx-auto pb-[120px]">
                {/* Title */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-[24px]">
                    <div className="text-[15px] font-semibold tracking-widest text-[#2EABE2] uppercase">
                        GIẢI PHÁP CHUYÊN NGHIỆP
                    </div>

                    <h2 className="text-gray-900 text-4xl md:text-5xl font-extrabold">
                        Sản phẩm &amp; giải pháp nổi bật
                    </h2>

                    <p className="text-gray-600 leading-relaxed">
                        Danh sách các hệ thống phần mềm đang được SFB triển khai cho nhà
                        trường, cơ quan Nhà nước và doanh nghiệp.
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
                <div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-fr gap-[32px] px-6 lg:px-[290px]">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex w-full h-full p-6 flex-col items-start gap-6 flex-[1_0_0] rounded-[24px] bg-[var(--Color-7,#FFF)] shadow-[0_8px_30px_0_rgba(0,0,0,0.06)]"
                        >
                            {/* Image kiểu ảnh: có padding + khung */}
                            <div className="w-full">
                                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                                    <div className="relative aspect-[16/7]">
                                        <ImageWithFallback
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-[300px] object-contain"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full flex-1 flex flex-col">
                                {(() => {
                                    const { parts, separator } = splitMetaParts(product.meta);

                                    if (parts.length <= 1) {
                                        return (
                                            <div className="text-xs text-gray-500 mb-2 truncate">
                                                {product.meta}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 whitespace-nowrap overflow-hidden">
                                            {parts.map((part, idx) => (
                                                <Fragment key={`${part}-${idx}`}>
                                                    <span className="truncate">{part}</span>
                                                    {idx !== parts.length - 1 && (
                                                        <span className="shrink-0" aria-hidden="true">{separator}</span>
                                                    )}
                                                </Fragment>
                                            ))}
                                        </div>
                                    );
                                })()}

                                <h3 className="self-stretch mb-1 min-h-[60px] line-clamp-2 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px]">
                                    {product.name}
                                </h3>

                                <div className="self-stretch mb-3 line-clamp-1 overflow-hidden text-ellipsis text-[var(--Color,#1D8FCF)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[12px] sm:text-[13px] font-medium leading-normal">
                                    {product.tagline}
                                </div>

                                <p className="self-stretch mb-5 line-clamp-3 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[24px] sm:leading-[28px] lg:leading-[30px]">
                                    {product.description}
                                </p>

                                {/* Features */}
                                <div className="space-y-3 w-full mt-auto flex-[1_0_0]">
                                    {product.features.slice(0, 4).map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2
                                                size={18}
                                                className="text-white fill-[#1D8FCF] flex-shrink-0 mt-0.5"
                                            />
                                            <span className="line-clamp-1 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[24px] sm:leading-[28px] lg:leading-[30px]">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            
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

                                    <Link
                                        href={`/products/${slugify(product.name)}`}
                                        className="px-5 py-2 rounded-lg bg-[#0870B4] text-white font-semibold text-sm hover:bg-[#075F98] transition inline-flex items-center gap-2"
                                    >
                                        Tìm hiểu thêm <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
