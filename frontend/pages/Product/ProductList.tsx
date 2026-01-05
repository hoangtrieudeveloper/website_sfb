"use client";


import { Fragment, useState, useMemo } from "react";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { products as staticProducts, categories as staticCategories, CategoryId } from "./data";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

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

interface ProductListProps {
    headerData?: any;
    products?: any[];
    categories?: any[];
}

export function ProductList({ headerData, products: dynamicProducts, categories: dynamicCategories }: ProductListProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");

    // Use dynamic data if available, otherwise fallback to static
    const products = dynamicProducts && dynamicProducts.length > 0 ? dynamicProducts : staticProducts;
    const categories = dynamicCategories && dynamicCategories.length > 0 ? dynamicCategories : staticCategories;

    // Map dynamic categories to include icon component
    const categoriesWithIcons = useMemo(() => {
        if (dynamicCategories && dynamicCategories.length > 0) {
            return [
                { id: "all", name: "Tất cả sản phẩm", icon: Package, slug: "all" },
                ...dynamicCategories
                    .filter((cat: any) => cat.isActive !== false)
                    .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    .map((cat: any) => {
                        const IconComponent = (LucideIcons as any)[cat.iconName] || Package;
                        return {
                            id: cat.id,
                            name: cat.name,
                            icon: IconComponent,
                            slug: cat.slug,
                        };
                    }),
            ];
        }
        return categories;
    }, [dynamicCategories, categories]);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === "all") {
            return products;
        }
        return products.filter((p: any) => {
            // Support both old format (category as string) and new format (categoryId as number)
            if (typeof p.categoryId === 'number') {
                return p.categoryId === selectedCategory;
            }
            // Fallback for old format
            return false;
        });
    }, [products, selectedCategory]);


    // Default header data
    const defaultHeader = {
        subtitle: "GIẢI PHÁP CHUYÊN NGHIỆP",
        title: "Sản phẩm & giải pháp nổi bật",
        description: "Danh sách các hệ thống phần mềm đang được SFB triển khai cho nhà trường, cơ quan Nhà nước và doanh nghiệp.",
    };

    const displayHeader = headerData || defaultHeader;

    // Kiểm tra xem có ảnh back hoặc front không
    const hasBackImage = headerData?.imageBack && headerData.imageBack.trim() !== '';
    const hasFrontImage = headerData?.imageFront && headerData.imageFront.trim() !== '';

    return (
        <section id="products" className="bg-[#F8FBFE]">
            <div className="w-full max-w-[1920px] mx-auto pb-[120px]">
                {/* Header với ảnh (nếu có) */}
                <div className="flex flex-col items-center justify-center gap-10 sm:gap-12 px-6 lg:px-10 min-[1920px]:px-[243px] mb-10 text-center">
                    {/* Text */}
                    <div className="flex w-full max-w-[840px] flex-col items-center gap-6">
                        {displayHeader.subtitle && (
                            <div className="self-stretch text-[#1D8FCF] text-center [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[15px] font-medium leading-normal uppercase">
                                {displayHeader.subtitle}
                            </div>
                        )}

                        {displayHeader.title && (
                            <h2 className="w-full max-w-[840px] text-[#0F172A] text-center [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[56px] font-bold leading-normal">
                                {displayHeader.title}
                            </h2>
                        )}

                        {displayHeader.description && (
                            <p className="w-full max-w-[610px] text-[#0F172A] text-center font-['Plus_Jakarta_Sans'] text-[16px] font-medium leading-[26px]">
                                {displayHeader.description}
                            </p>
                        )}
                    </div>


                </div>

                {/* Pills filter ngay dưới title */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-10 mb-14">
                    {categoriesWithIcons.map((category: any) => {
                        const Icon = category.icon;
                        const active = selectedCategory === category.id;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`h-[44px] px-6 py-3 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2 border
              ${active
                                        ? "border-[#1D8FCF] bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white shadow-md"
                                        : "border-transparent bg-[#EAF5FF] text-[#0870B4] hover:bg-[#DCEFFF]"
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
                    {filteredProducts.map((product: any) => (
                        <div
                            key={product.id}
                            className="flex w-full h-full p-6 flex-col items-start gap-6 flex-[1_0_0] rounded-[24px] bg-[var(--Color-7,#FFF)] shadow-[0_8px_30px_0_rgba(0,0,0,0.06)]"
                        >
                            {/* Image kiểu ảnh: có padding + khung */}
                            {product.image && (
                                <div className="w-full">
                                    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                                        <div className="relative aspect-[16/7]">
                                            <ImageWithFallback
                                                src={product.image}
                                                alt={product.name || ''}
                                                className="w-full h-[300px] object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="w-full flex-1 flex flex-col">
                                {product.meta && (() => {
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

                                {product.name && (
                                    <h3 className="self-stretch mb-1 min-h-[60px] line-clamp-2 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[20px] font-semibold leading-[30px]">
                                        {product.name}
                                    </h3>
                                )}

                                {product.tagline && (
                                    <div className="self-stretch mb-3 line-clamp-1 overflow-hidden text-ellipsis text-[var(--Color,#1D8FCF)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[12px] sm:text-[13px] font-medium leading-normal">
                                        {product.tagline}
                                    </div>
                                )}

                                {product.description && (
                                    <p className="self-stretch mb-5 line-clamp-3 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[24px] sm:leading-[28px] lg:leading-[30px]">
                                        {product.description}
                                    </p>
                                )}

                                {/* Features */}
                                {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                                    <div className="space-y-3 w-full mt-auto flex-[1_0_0]">
                                        {product.features.slice(0, 4).map((feature: string, i: number) => (
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
                                )}
                            </div>


                            <div className="w-full flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <div className="text-xs text-gray-500">Giá tham khảo</div>
                                    <div className="text-lg font-extrabold text-gray-900">
                                        {product.pricing || "Liên hệ"}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        className="flex h-[48px] px-6 py-[7px] items-center gap-3 rounded-[12px] border border-[rgba(29,143,207,0.20)] bg-[linear-gradient(237deg,rgba(128,192,228,0.10)_7%,rgba(29,143,207,0.10)_71.94%)] text-[#0870B4] font-semibold text-sm transition hover:shadow-sm"
                                    >
                                        Demo nhanh
                                        <img
                                            src="/icons/custom/product_media.svg"
                                            alt="media"
                                            className="w-6 h-6"
                                        />
                                    </button>

                                    <Link
                                        href={`/products/${product.slug || slugify(product.name || '')}`}
                                        className="flex h-[48px] px-6 py-[7px] items-center gap-3 rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-semibold text-sm transition hover:shadow-md"
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

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ProductListPage() {
    return null;
}
