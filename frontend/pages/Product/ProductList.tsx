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
        subtitle: "",
        title: "",
        description: "",
    };

    const displayHeader = headerData || defaultHeader;

    // Kiểm tra xem có ảnh back hoặc front không
    const hasBackImage = headerData?.imageBack && headerData.imageBack.trim() !== '';
    const hasFrontImage = headerData?.imageFront && headerData.imageFront.trim() !== '';

    return (
        <section id="products" className="bg-white">
            <div className="w-full max-w-[1920px] mx-auto pb-[120px]">
                {/* Header với ảnh (nếu có) */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 sm:gap-12 lg:gap-[60px] min-[1920px]:gap-[90px] px-6 lg:px-10 min-[1920px]:px-[243px] mb-10">
                    {/* Left: Text */}
                    <div className="flex w-full max-w-[549px] flex-col items-start gap-6">
                        {displayHeader.subtitle && (
                            <div className="text-[15px] font-semibold tracking-widest text-[#2EABE2] uppercase">
                                {displayHeader.subtitle}
                            </div>
                        )}

                        {displayHeader.title && (
                            <h2 className="text-gray-900 text-4xl md:text-5xl font-extrabold">
                                {displayHeader.title}
                            </h2>
                        )}

                        {displayHeader.description && (
                            <p className="text-gray-600 leading-relaxed">
                                {displayHeader.description}
                            </p>
                        )}
                    </div>

                    {/* Right: Images */}
                    <div className="relative w-full lg:w-auto flex justify-center lg:justify-start">
                        <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                            {/* Chỉ hiển thị no-cover khi CẢ 2 ảnh đều không có */}
                            {!hasBackImage && !hasFrontImage ? (
                                <div className="w-[701px] h-[511px] rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden">
                                    <ImageWithFallback
                                        src="/images/no_cover.jpeg"
                                        alt="No cover image"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <>
                                    {/* Back image - Chỉ hiển thị nếu có */}
                                    {hasBackImage && (
                                        <div className="w-[701px] h-[511px] rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden">
                                            <ImageWithFallback
                                                src={headerData.imageBack}
                                                alt={displayHeader.title || "Product list header"}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    )}

                                    {/* Front image - Chỉ hiển thị nếu có */}
                                    {hasFrontImage && (
                                        <div
                                            className={`${hasBackImage
                                                    ? "absolute left-[183.5px] bottom-0"
                                                    : "relative"
                                                } rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden ${hasBackImage ? "w-[400px] h-[300px]" : "w-[701px] h-[511px]"}`}
                                        >
                                            <ImageWithFallback
                                                src={headerData.imageFront}
                                                alt={displayHeader.title || "Product list header"}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
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
                                        href={`/products/${product.slug || slugify(product.name || '')}`}
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

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ProductListPage() {
    return null;
}
