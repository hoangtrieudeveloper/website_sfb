"use client";

import { useState, useEffect } from "react";
import {
    Facebook,
    Twitter,
    Linkedin,
    Copy,
    Check,
    Share2,
    Bookmark,
    Link as LinkIcon,
    ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { Consult } from "@/components/public/Consult";
import { ProductDetail } from "./data";
import { HeroSection } from "./HeroSection";
import { OverviewSection } from "./OverviewSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { ProductFeatureSection } from "./ProductFeatureSection";
import { ExpandSection } from "./ExpandSection";
import { GetStaticProps } from "next";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { API_BASE_URL } from "@/lib/api/base";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollActionButton } from "@/components/public/ScrollActionButton";
import { useLocale } from "@/lib/contexts/LocaleContext";
interface ProductDetailViewProps {
    product: ProductDetail | null;
    locale?: 'vi' | 'en' | 'ja';
}

// Helper function để xử lý HTML và tạo TOC
function processContentHtml({
    html,
    enableToc,
}: {
    html: string;
    enableToc: boolean;
}) {
    let processed = html.replace(/&nbsp;/gi, " ");
    const tocItems: { id: string; text: string; level: number }[] = [];

    // Thêm id cho H2/H3 để làm TOC
    if (enableToc) {
        let counter = 1;
        processed = processed.replace(/<h([23])>(.*?)<\/h\1>/gi, (_m, level, text) => {
            const id = `toc-${counter++}`;
            const cleanText = String(text)
                .replace(/<[^>]+>/g, "")
                .replace(/&nbsp;/gi, " ")
                .trim();
            tocItems.push({ id, text: cleanText, level: Number(level) });
            return `<h${level} id="${id}">${text}</h${level}>`;
        });
    }

    return { processedHtml: processed, tocItems };
}

// Component Gallery Slider cho Product
function ProductGallerySlider({ images, title, locale = 'vi' }: { images: string[]; title?: string; locale?: 'vi' | 'en' | 'ja' }) {
    if (!images || images.length === 0) return null;

    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const galleryTexts = {
        vi: { close: "Đóng", prevImage: "Ảnh trước", nextImage: "Ảnh sau" },
        en: { close: "Close", prevImage: "Previous image", nextImage: "Next image" },
        ja: { close: "閉じる", prevImage: "前の画像", nextImage: "次の画像" },
    };

    const gt = galleryTexts[locale];

    return (
        <>
            <div className="w-full max-w-7xl mx-auto">
                {title && (
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                )}
                <div className="overflow-x-auto flex gap-3 pb-2">
                    {images.map((img, index) => (
                        <button
                            key={`${img}-${index}`}
                            type="button"
                            onClick={() => setPreviewIndex(index)}
                            className="flex-shrink-0 w-60 h-40 md:w-72 md:h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <ImageWithFallback
                                src={
                                    img.startsWith("http")
                                        ? img
                                        : `${API_BASE_URL}${img.startsWith("/") ? "" : "/"
                                        }${img}`
                                }
                                alt={locale === 'vi' ? `Ảnh gallery ${index + 1}` : locale === 'en' ? `Gallery image ${index + 1}` : `ギャラリー画像 ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Full screen preview */}
            {previewIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setPreviewIndex(null)}
                >
                    <button
                        type="button"
                        onClick={() => setPreviewIndex(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        aria-label={gt.close}
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <div className="max-w-7xl max-h-full">
                        <ImageWithFallback
                            src={
                                images[previewIndex].startsWith("http")
                                    ? images[previewIndex]
                                    : `${API_BASE_URL}${images[previewIndex].startsWith("/") ? "" : "/"
                                    }${images[previewIndex]}`
                            }
                            alt={locale === 'vi' ? `Ảnh gallery ${previewIndex + 1}` : locale === 'en' ? `Gallery image ${previewIndex + 1}` : `ギャラリー画像 ${previewIndex + 1}`}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                    </div>
                    {images.length > 1 && (
                        <>
                            {previewIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewIndex(previewIndex - 1);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                                    aria-label={gt.prevImage}
                                >
                                    <svg
                                        className="w-8 h-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                            )}
                            {previewIndex < images.length - 1 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewIndex(previewIndex + 1);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                                    aria-label={gt.nextImage}
                                >
                                    <svg
                                        className="w-8 h-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}

// Component được sử dụng bởi App Router
export function ProductDetailView({ product, locale: propLocale }: ProductDetailViewProps) {
    const { locale: contextLocale } = useLocale();
    const locale = (propLocale || contextLocale || 'vi') as 'vi' | 'en' | 'ja';

    const [linkCopied, setLinkCopied] = useState(false);
    const [supportsWebShare, setSupportsWebShare] = useState(false);

    // Localized texts
    const uiTexts = {
        vi: {
            productNotFound: "Không tìm thấy sản phẩm",
            productNotFoundDesc: "Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
            linkCopied: "Đã sao chép liên kết!",
            copyLinkFailed: "Không thể sao chép liên kết",
            share: "Chia sẻ",
            shareFacebook: "Chia sẻ Facebook",
            shareTwitter: "Chia sẻ Twitter",
            shareLinkedIn: "Chia sẻ LinkedIn",
            shareOther: "Chia sẻ khác...",
            copyLink: "Sao chép liên kết",
            copied: "Đã sao chép",
            tableOfContents: "Mục lục",
            noHeadings: "Chưa có tiêu đề.",
            author: "Tác giả",
            authorDesc: "Nhà phát triển giải pháp công nghệ hàng đầu Việt Nam",
            shareNotSupported: "Trình duyệt không hỗ trợ chia sẻ trực tiếp",
            contactNow: "LIÊN HỆ NGAY",
            demoSystem: "DEMO HỆ THỐNG",
            saveArticle: "Lưu bài viết",
            close: "Đóng",
            prevImage: "Ảnh trước",
            nextImage: "Ảnh sau",
        },
        en: {
            productNotFound: "Product not found",
            productNotFoundDesc: "The product you are looking for does not exist or has been removed.",
            linkCopied: "Link copied!",
            copyLinkFailed: "Failed to copy link",
            share: "Share",
            shareFacebook: "Share on Facebook",
            shareTwitter: "Share on Twitter",
            shareLinkedIn: "Share on LinkedIn",
            shareOther: "Share more...",
            copyLink: "Copy link",
            copied: "Copied",
            tableOfContents: "Table of Contents",
            noHeadings: "No headings yet.",
            author: "Author",
            authorDesc: "Leading technology solutions developer in Vietnam",
            shareNotSupported: "Browser does not support direct sharing",
            contactNow: "CONTACT US NOW",
            demoSystem: "DEMO SYSTEM",
            saveArticle: "Save article",
            close: "Close",
            prevImage: "Previous image",
            nextImage: "Next image",
        },
        ja: {
            productNotFound: "製品が見つかりません",
            productNotFoundDesc: "お探しの製品は存在しないか、削除されました。",
            linkCopied: "リンクをコピーしました！",
            copyLinkFailed: "リンクのコピーに失敗しました",
            share: "共有",
            shareFacebook: "Facebookで共有",
            shareTwitter: "Twitterで共有",
            shareLinkedIn: "LinkedInで共有",
            shareOther: "その他で共有...",
            copyLink: "リンクをコピー",
            copied: "コピー済み",
            tableOfContents: "目次",
            noHeadings: "見出しがまだありません。",
            author: "著者",
            authorDesc: "ベトナムのトップテクノロジーソリューション開発者",
            shareNotSupported: "ブラウザは直接共有をサポートしていません",
            contactNow: "今すぐお問い合わせ",
            demoSystem: "システムデモ",
            saveArticle: "記事を保存",
            close: "閉じる",
            prevImage: "前の画像",
            nextImage: "次の画像",
        },
    };

    const t = uiTexts[locale];

    // Kiểm tra Web Share API support
    useEffect(() => {
        if (typeof window !== "undefined" && "navigator" in window && "share" in navigator) {
            setSupportsWebShare(true);
        }
    }, []);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center py-16 px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.productNotFound}</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        {t.productNotFoundDesc}
                    </p>
                </div>
            </div>
        );
    }

    // Lấy các cấu hình hiển thị
    const showTableOfContents = product.showTableOfContents !== false;
    const enableShareButtons = product.enableShareButtons !== false;
    const showAuthorBox = product.showAuthorBox !== false;

    // Xử lý galleryImages - có thể là array hoặc JSON string
    let galleryImages: string[] = [];
    if (product.galleryImages) {
        if (Array.isArray(product.galleryImages)) {
            galleryImages = product.galleryImages;
        } else if (typeof product.galleryImages === 'string') {
            try {
                const parsed = JSON.parse(product.galleryImages);
                galleryImages = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                // Nếu không parse được, coi như là một string đơn
                galleryImages = [product.galleryImages];
            }
        }
    }

    const galleryTitle = product.galleryTitle || "";
    const galleryPosition: "top" | "bottom" =
        (product.galleryPosition as any) === "top" ? "top" : "bottom";

    // Lấy URL hiện tại của trang
    const currentUrl = typeof window !== "undefined"
        ? window.location.href
        : "";
    const shareTitle = product.name;
    const shareDescription = product.heroDescription || "";

    // Hàm chia sẻ Facebook
    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    // Hàm chia sẻ Twitter
    const shareToTwitter = () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    // Hàm chia sẻ LinkedIn
    const shareToLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    // Hàm copy link
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setLinkCopied(true);
            toast.success(t.linkCopied);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            // Fallback cho trình duyệt không hỗ trợ clipboard API
            const textArea = document.createElement("textarea");
            textArea.value = currentUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                setLinkCopied(true);
                toast.success(t.linkCopied);
                setTimeout(() => setLinkCopied(false), 2000);
            } catch (e) {
                toast.error(t.copyLinkFailed);
            }
            document.body.removeChild(textArea);
        }
    };

    // Hàm chia sẻ bằng Web Share API (nếu trình duyệt hỗ trợ)
    const shareViaWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareDescription,
                    url: currentUrl,
                });
            } catch (err) {
                // User cancelled hoặc có lỗi
                // Error sharing - silently fail
            }
        } else {
            // Fallback: mở dropdown menu
            toast.info(t.shareNotSupported);
        }
    };
    // numberedSections có thể là empty array, không nên return null
    const numberedSections = (product.numberedSections || []).sort((a, b) => (a.no || 0) - (b.no || 0));

    // Helper function để check string có giá trị thực sự
    const hasValue = (value: string | undefined | null): boolean => {
        return value !== undefined && value !== null && value.trim() !== '';
    };

    // Kiểm tra xem các section có dữ liệu không
    const hasHeroData = hasValue(product.name) || hasValue(product.heroImage) || hasValue(product.heroDescription);

    const hasOverviewData = hasValue(product.overviewTitle) ||
        hasValue(product.overviewKicker) ||
        (product.overviewCards && product.overviewCards.length > 0);

    const hasShowcaseData = product.showcase && (
        hasValue(product.showcase.title) ||
        hasValue(product.showcase.desc) ||
        hasValue(product.showcase.overlay?.back?.src) ||
        hasValue(product.showcase.overlay?.front?.src) ||
        hasValue(product.showcase.single?.src)
    );

    const hasNumberedSections = numberedSections.length > 0;

    const hasExpandData = hasValue(product.expandTitle) ||
        (product.expandBullets && product.expandBullets.length > 0) ||
        hasValue(product.expandImage);

    // Kiểm tra contentMode: nếu là 'content' thì hiển thị HTML, nếu là 'config' thì hiển thị widget
    const isContentMode = product.contentMode === 'content';
    const hasContentHtml = isContentMode && hasValue(product.contentHtml);
    const hasGallery = galleryImages.length > 0;

    // Debug log để kiểm tra gallery data
    useEffect(() => {
        // Content mode debug - removed
    }, [isContentMode, hasContentHtml, hasGallery, galleryImages, galleryPosition, galleryTitle]);

    return (
        <div className="bg-white">
            {hasHeroData && <HeroSection product={product} locale={locale} />}

            {/* Hiển thị theo chế độ: Content HTML hoặc Widget */}
            {(hasContentHtml || (isContentMode && hasGallery)) ? (
                // Chế độ Content: Hiển thị HTML từ RichTextEditor
                <section className="w-full bg-white">
                    <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-[120px] py-[20px]">
                        {/* Share buttons và Meta thông tin */}
                        {enableShareButtons && (
                            <div className="mb-6 flex flex-col gap-4 pb-4 border-b border-gray-200">
                                {/* Meta thông tin - trên các button */}
                                {(product.meta || product.metaTop) && (
                                    <p className="text-sm text-gray-500 font-medium">
                                        {product.meta || product.metaTop}
                                    </p>
                                )}

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 h-7 px-3 rounded bg-[#1877F2] text-white text-xs font-medium hover:bg-[#166FE5] transition-colors"
                                            onClick={shareToFacebook}
                                            aria-label={t.shareFacebook}
                                        >
                                            <Facebook size={14} />
                                            <span>{t.share}</span>
                                        </button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 h-7 px-3 rounded bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
                                                    aria-label={t.shareOther}
                                                >
                                                    <Share2 size={14} />
                                                    <span>{locale === 'vi' ? 'Khác' : locale === 'en' ? 'More' : 'その他'}</span>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem
                                                    onClick={shareToTwitter}
                                                    className="cursor-pointer"
                                                >
                                                    <Twitter size={16} className="mr-2 text-[#1DA1F2]" />
                                                    {t.shareTwitter}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={shareToLinkedIn}
                                                    className="cursor-pointer"
                                                >
                                                    <Linkedin size={16} className="mr-2 text-[#0077B5]" />
                                                    {t.shareLinkedIn}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={copyToClipboard}
                                                    className="cursor-pointer"
                                                >
                                                    {linkCopied ? (
                                                        <>
                                                            <Check size={16} className="mr-2 text-green-600" />
                                                            {t.copied}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={16} className="mr-2" />
                                                            {t.copyLink}
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                {supportsWebShare && (
                                                    <DropdownMenuItem
                                                        onClick={shareViaWebShare}
                                                        className="cursor-pointer"
                                                    >
                                                        <Share2 size={16} className="mr-2" />
                                                        {t.shareOther}
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-400">
                                        <button
                                            type="button"
                                            onClick={copyToClipboard}
                                            aria-label={t.copyLink}
                                            className="hover:text-gray-600 transition-colors"
                                            title={t.copyLink}
                                        >
                                            {linkCopied ? (
                                                <Check size={18} className="text-green-600" />
                                            ) : (
                                                <LinkIcon size={18} />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={shareToFacebook}
                                            aria-label={t.shareFacebook}
                                            className="hover:text-[#1877F2] transition-colors"
                                            title={t.shareFacebook}
                                        >
                                            <Facebook size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={shareToTwitter}
                                            aria-label={t.shareTwitter}
                                            className="hover:text-[#1DA1F2] transition-colors"
                                            title={t.shareTwitter}
                                        >
                                            <Twitter size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={t.saveArticle}
                                            className="hover:text-gray-600 transition-colors"
                                            title={t.saveArticle}
                                        >
                                            <Bookmark size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gallery phía trên nội dung nếu chọn TOP */}
                        {galleryImages.length > 0 && galleryPosition === "top" && (
                            <div className="mb-8">
                                <ProductGallerySlider
                                    images={galleryImages}
                                    title={galleryTitle || undefined}
                                    locale={locale}
                                />
                            </div>
                        )}

                        {/* Table of Contents - chỉ hiển thị khi có contentHtml */}
                        {hasContentHtml && showTableOfContents && product.contentHtml && (
                            <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-sm font-semibold text-gray-900 mb-2">{t.tableOfContents}</p>
                                {(() => {
                                    const { tocItems } = processContentHtml({
                                        html: product.contentHtml,
                                        enableToc: true,
                                    });
                                    return tocItems.length > 0 ? (
                                        <ol className="space-y-1 text-sm text-blue-700">
                                            {tocItems.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className={item.level === 3 ? "pl-4 text-blue-600" : ""}
                                                >
                                                    <a href={`#${item.id}`} className="hover:underline">
                                                        {item.text}
                                                    </a>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p className="text-xs text-gray-500">
                                            {t.noHeadings}
                                        </p>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Nội dung HTML - chỉ hiển thị khi có contentHtml */}
                        {hasContentHtml && (
                            <div>
                                {(() => {
                                    const { processedHtml } = processContentHtml({
                                        html: product.contentHtml || '',
                                        enableToc: showTableOfContents,
                                    });
                                    return (
                                        <div
                                            className="prose prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: processedHtml }}
                                        />
                                    );
                                })()}
                            </div>
                        )}

                        {/* Gallery phía dưới nội dung nếu chọn BOTTOM */}
                        {galleryImages.length > 0 && galleryPosition === "bottom" && (
                            <div className="mt-10">
                                <ProductGallerySlider
                                    images={galleryImages}
                                    title={galleryTitle || undefined}
                                    locale={locale}
                                />
                            </div>
                        )}

                        {/* Author box */}
                        {showAuthorBox && (
                            <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-3 shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                    SFB
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t.author}</p>
                                    <p className="text-base font-semibold text-gray-900">
                                        SFB Technology
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t.authorDesc}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            ) : (
                // Chế độ Widget: Hiển thị các section như bình thường
                <>
                    {hasOverviewData && <OverviewSection product={product} />}

                    {hasShowcaseData && <ShowcaseSection product={product} />}

                    {hasNumberedSections && (
                        <section className="w-full bg-white">
                            <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-[120px] py-10 lg:py-[90px] space-y-10 lg:space-y-[90px]">
                                {numberedSections.map((section) => (
                                    <ProductFeatureSection key={section.no} section={section} locale={locale} />
                                ))}
                            </div>
                        </section>
                    )}

                    {hasExpandData && <ExpandSection product={product} />}
                </>
            )}

            <div id="demo" />
            <Consult locale={locale} />
            {/* Scroll Action Button */}
            <ScrollActionButton />
        </div>
    );
}

// Default export cho Pages Router - trả về empty page vì route thực tế nằm ở App Router
export default function ProductDetailPage() {
    return null;
}

// Đánh dấu page này không cần pre-render
export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
        notFound: true, // Không render page này trong Pages Router
    };
};
