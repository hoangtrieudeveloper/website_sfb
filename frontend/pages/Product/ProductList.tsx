"use client";


import { Fragment, useState, useMemo } from "react";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { PLACEHOLDER_PRICING, PLACEHOLDER_TITLE } from "@/lib/placeholders";
import Image from "next/image";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

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

const ProductCard = ({ product, locale }: { product: any; locale: 'vi' | 'en' | 'ja' }) => {
    const [objectFitStyle, setObjectFitStyle] = useState<'cover' | 'contain'>('contain');

    // Localize all product fields
    const localizedName = getLocalizedText(product.name, locale);
    const localizedTagline = getLocalizedText(product.tagline, locale);
    const localizedDescription = getLocalizedText(product.description, locale);
    const localizedMeta = getLocalizedText(product.meta, locale);
    const localizedPricing = getLocalizedText(product.pricing, locale);
    
    // Localize features array
    const localizedFeatures = product.features && Array.isArray(product.features)
        ? product.features.map((feature: any) => getLocalizedText(feature, locale))
        : [];

    // Localized UI texts
    const pricingLabel = locale === 'vi' ? 'Giá tham khảo' : locale === 'en' ? 'Reference Price' : '参考価格';
    const demoQuickLabel = locale === 'vi' ? 'Demo nhanh' : locale === 'en' ? 'Quick Demo' : 'クイックデモ';
    const demoLabel = locale === 'vi' ? 'Demo' : locale === 'en' ? 'Demo' : 'デモ';
    const learnMoreLabel = locale === 'vi' ? 'Tìm hiểu thêm' : locale === 'en' ? 'Learn More' : '詳細を見る';
    const detailsLabel = locale === 'vi' ? 'Chi tiết' : locale === 'en' ? 'Details' : '詳細';

    return (
        <div
            className="flex w-full h-full p-5 lg:p-6 flex-col items-start gap-4 lg:gap-6 flex-[1_0_0] rounded-[24px] bg-[var(--Color-7,#FFF)] shadow-[0_8px_30px_0_rgba(0,0,0,0.06)] lg:h-[786px] lg:max-w-[606px]"
        >
            {/* Image kiểu ảnh: có padding + khung */}
            {product.image && (
                <div className="w-full self-stretch">
                    <div className="relative w-full h-[300px] rounded-[8px] bg-white overflow-hidden">
                        <ImageWithFallback
                            src={product.image}
                            alt={localizedName || PLACEHOLDER_TITLE}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            loading="lazy"
                            objectFit={objectFitStyle}
                            onLoad={(e) => {
                                const img = e.currentTarget;
                                const ratio = img.naturalWidth / img.naturalHeight;
                                // Reversed logic as requested
                                if (ratio > (3 / 2)) {
                                    setObjectFitStyle('contain');
                                } else {
                                    setObjectFitStyle('cover');
                                }
                            }}
                            className="rounded-[8px]"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="w-full flex-1 flex flex-col">
                {localizedMeta && (() => {
                    const { parts, separator } = splitMetaParts(localizedMeta);

                    if (parts.length <= 1) {
                        return (
                            <div className="text-xs text-gray-500 mb-2 truncate">
                                {localizedMeta}
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

                {localizedName && (
                    <h3 className="self-stretch mb-1 min-h-[48px] lg:min-h-[auto] line-clamp-2 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-lg lg:text-[20px] font-semibold lg:font-[600] leading-[28px] lg:leading-[30px]">
                        {localizedName}
                    </h3>
                )}

                {localizedTagline && (
                    <div className="self-stretch mb-3 line-clamp-1 overflow-hidden text-ellipsis text-[var(--Color,#1D8FCF)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-xs lg:text-[13px] font-medium lg:font-[500] leading-normal lg:leading-normal">
                        {localizedTagline}
                    </div>
                )}

                {localizedDescription && (
                    <p className={`self-stretch mb-4 lg:mb-5 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-sm lg:text-[16px] font-normal lg:font-[400] leading-relaxed lg:leading-[30px]
                        ${(localizedFeatures && localizedFeatures.length > 0)
                            ? 'line-clamp-3'
                            : 'line-clamp-[7]'
                        }
                    `}>
                        {localizedDescription}
                    </p>
                )}

                {/* Features */}
                {localizedFeatures && localizedFeatures.length > 0 && (
                    <div className="space-y-2 lg:space-y-3 w-full max-w-full mt-auto flex-[1_0_0] min-w-0">
                        {localizedFeatures.slice(0, 4).map((feature: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 w-full min-w-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-1 lg:mt-[5px] w-4 h-4 lg:w-[20px] lg:h-[20px]">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 0C4.48608 0 0 4.48493 0 9.99999C0 15.514 4.48608 19.9994 9.99996 19.9994C15.5138 19.9994 20 15.514 20 9.99999C20 4.48493 15.5138 0 9.99996 0ZM15.575 6.66503L9.42112 13.5881C9.2696 13.758 9.05846 13.8457 8.84571 13.8457C8.67691 13.8457 8.50731 13.7903 8.3654 13.6779L4.51916 10.6005C4.18761 10.3355 4.13384 9.85106 4.39921 9.5188C4.66426 9.18763 5.1488 9.13332 5.48035 9.3989L8.7561 12.0193L14.4249 5.64245C14.7066 5.32418 15.1934 5.29568 15.5107 5.57849C15.8284 5.86074 15.8573 6.34676 15.575 6.66503Z" fill="#1D8FCF" />
                                </svg>
                                <span className="flex-1 min-w-0 whitespace-normal break-words line-clamp-2 text-[var(--Color-2,#0F172A)] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] text-sm lg:text-[16px] font-normal lg:font-[400] leading-relaxed lg:leading-[30px]">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
                <div className="min-w-0 shrink">
                    <div className="text-xs text-gray-500 truncate">{pricingLabel}</div>
                    <div className="text-lg font-extrabold text-gray-900 truncate">
                        {localizedPricing || PLACEHOLDER_PRICING}
                    </div>
                </div>

                <div className="flex gap-2 shrink-0">
                    {product.demoLink && (
                        <Link
                            href={product.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            prefetch={false}
                            className="px-2 sm:px-4 lg:px-5 py-2 rounded-lg bg-[#EAF5FF] text-[#0870B4]
                font-semibold text-xs lg:text-sm hover:bg-[#DCEFFF] transition
                    inline-flex items-center gap-1 sm:gap-2"
                        >
                            <span className="whitespace-nowrap sm:inline hidden">{demoQuickLabel}</span>
                            <span className="whitespace-nowrap sm:hidden inline">{demoLabel}</span>
                            <Image
                                src="/icons/custom/product_media.svg"
                                alt="media icon"
                                width={24}
                                height={24}
                                className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
                            />
                        </Link>
                    )}

                    <Link
                        href={`/${locale}/products/${product.slug || slugify(localizedName || '')}`}
                        prefetch={true}
                        className="px-2 sm:px-4 lg:px-5 py-2 rounded-lg bg-[#0870B4] text-white font-semibold text-xs lg:text-sm hover:bg-[#075F98] transition inline-flex items-center gap-1 sm:gap-2"
                    >
                        <span className="whitespace-nowrap sm:inline hidden">{learnMoreLabel}</span>
                        <span className="whitespace-nowrap sm:hidden inline">{detailsLabel}</span>
                        <ArrowRight size={16} className="shrink-0" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

interface ProductListProps {
    headerData?: any;
    products?: any[];
    categories?: any[];
}

export function ProductList({ headerData, products: dynamicProducts, categories: dynamicCategories }: ProductListProps) {
    const { locale } = useLocale();
    const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
    const [mobilePage, setMobilePage] = useState(1);
    const MOBILE_ITEMS_PER_PAGE = 3;

    // Chỉ sử dụng data từ API, không fallback static data
    const products = dynamicProducts || [];
    const categories = dynamicCategories || [];

    // Không render nếu không có products
    if (!products || products.length === 0) {
        return null;
    }

    // Localized "All Products" text
    const allProductsText = locale === 'vi' ? 'Tất cả sản phẩm' : locale === 'en' ? 'All Products' : 'すべての製品';

    // Map dynamic categories to include icon component
    const categoriesWithIcons = useMemo(() => {
        if (categories && categories.length > 0) {
            return [
                { id: "all", name: allProductsText, icon: Package, slug: "all" },
                ...categories
                    .filter((cat: any) => cat.isActive !== false)
                    .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    .map((cat: any) => {
                        const IconComponent = (LucideIcons as any)[cat.iconName] || Package;
                        // Localize category name - getLocalizedText handles JSON strings automatically
                        const localizedName = getLocalizedText(cat.name, locale);
                        return {
                            id: cat.id,
                            name: localizedName,
                            icon: IconComponent,
                            slug: cat.slug,
                        };
                    }),
            ];
        }
        // Fallback: chỉ có "Tất cả sản phẩm" nếu không có categories
        return [{ id: "all", name: allProductsText, icon: Package, slug: "all" }];
    }, [categories, locale, allProductsText]);

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

    // Reset page when category changes
    useMemo(() => {
        setMobilePage(1);
    }, [selectedCategory]);

    const [pageSize, setPageSize] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);

    // Desktop Pagination Calculation
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const mobileTotalPages = Math.ceil(filteredProducts.length / MOBILE_ITEMS_PER_PAGE);
    const mobileProducts = filteredProducts.slice(
        (mobilePage - 1) * MOBILE_ITEMS_PER_PAGE,
        mobilePage * MOBILE_ITEMS_PER_PAGE
    );


    // Default header data
    const defaultHeader = {
        subtitle: "",
        title: "",
        description: "",
    };

    const displayHeader = headerData || defaultHeader;

    return (
        <section id="products" className="bg-white">
            <div className="w-full max-w-[1920px] mx-auto pb-[120px]">
                {/* Header */}
                <div className="flex flex-col items-center justify-center px-6 lg:px-10 min-[1920px]:px-[243px] pt-12 lg:pt-16">
                    <div className="flex w-full max-w-4xl flex-col items-center gap-4 lg:gap-6">
                        {displayHeader.subtitle && (
                            <div className="text-sm lg:text-[15px] font-semibold tracking-widest text-[#2EABE2] uppercase text-center">
                                {displayHeader.subtitle}
                            </div>
                        )}

                        {displayHeader.title && (
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 text-center">
                                {displayHeader.title}
                            </h2>
                        )}

                        {displayHeader.description && (
                            <p className="text-base lg:text-lg text-gray-600 leading-relaxed text-center max-w-3xl">
                                {displayHeader.description}
                            </p>
                        )}
                    </div>

                    {/* Pills filter ngay dưới description */}
                    <div className="w-full mx-auto max-w-[720px] sm:max-w-[900px] lg:max-w-[1244px] flex flex-wrap items-center justify-center gap-3 mt-8 lg:mt-10 mb-14">
                        {categoriesWithIcons.map((category: any) => {
                            const Icon = category.icon;
                            const active = selectedCategory === category.id;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2 min-w-0 max-w-[220px] sm:max-w-[280px] lg:max-w-none
                                        ${active
                                            ? "bg-[#0870B4] text-white shadow-md"
                                            : "bg-[#EAF5FF] text-[#0870B4] hover:bg-[#DCEFFF]"
                                        }`}
                                >
                                    <Icon size={16} className="shrink-0" />
                                    <span className="min-w-0 whitespace-normal break-words text-center leading-snug line-clamp-2">
                                        {category.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop Grid (>= lg) with Pagination */}
                <div className="hidden lg:block w-full max-w-[1244px] mx-auto px-6">
                    {/* Items per page selector */}
                    <div className="flex justify-end mb-6 z-10 relative">
                        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100">
                            <span className="text-sm font-medium text-gray-500">Hiển thị:</span>
                            <div className="flex gap-1">
                                {[4, 6, 12].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setPageSize(size);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${pageSize === size
                                            ? "bg-[#0870B4] text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-fr gap-x-8 gap-y-[45px] justify-items-center mb-12">
                        {paginatedProducts.map((product: any) => (
                            <ProductCard key={product.id} product={product} locale={locale} />
                        ))}
                    </div>

                    {/* Desktop Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 items-center">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className={`px-3 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                                    ${currentPage === 1
                                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                                    }`}
                            >
                                First
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                                        ${page === currentPage
                                            ? "bg-[#0870B4] text-white shadow-md"
                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <div className="flex items-center gap-2 px-2">
                                <span className="text-sm text-gray-500">Go to:</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={totalPages}
                                    className="w-16 h-10 border border-gray-200 rounded-lg px-2 text-sm text-center focus:outline-none focus:border-[#0870B4]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = parseInt((e.target as HTMLInputElement).value);
                                            if (val >= 1 && val <= totalPages) {
                                                setCurrentPage(val);
                                            }
                                        }
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`px-3 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                                    ${currentPage === totalPages
                                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-[#0870B4] hover:border-[#0870B4]"
                                    }`}
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Grid (< lg) - Pagination */}
                <div className="lg:hidden flex flex-col gap-[32px] px-6">
                    {mobileProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                    ))}

                    {/* Pagination Controls */}
                    {mobileTotalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: mobileTotalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setMobilePage(page)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                                        ${page === mobilePage
                                            ? "bg-[#0870B4] text-white shadow-md"
                                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function ProductListPage() {
    return null;
}
