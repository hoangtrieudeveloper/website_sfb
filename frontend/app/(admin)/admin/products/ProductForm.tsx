"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, X, ArrowRight, Play, CheckCircle2, ChevronUp, ChevronDown, Trash2, Link as LinkIcon, Search as SearchIcon, Sparkles, Image as ImageIcon, Languages, Loader2 } from "lucide-react";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { HeroWidget } from "@/components/admin/ProductWidgets/HeroWidget";
import { OverviewWidget } from "@/components/admin/ProductWidgets/OverviewWidget";
import { ShowcaseWidget } from "@/components/admin/ProductWidgets/ShowcaseWidget";
import { NumberedSectionWidget } from "@/components/admin/ProductWidgets/NumberedSectionWidget";
import { ExpandWidget } from "@/components/admin/ProductWidgets/ExpandWidget";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { generateSlug, formatDateForInput } from "@/lib/date";
import { buildUrl } from "@/lib/api/base";
import { LocaleInput } from "@/components/admin/LocaleInput";
import { getLocaleValue, setLocaleValue, migrateObjectToLocale } from "@/lib/utils/locale-admin";
import { getLocalizedText } from "@/lib/utils/i18n";
import { useTranslationControls } from "@/lib/hooks/useTranslationControls";
import { TranslationControls } from "@/components/admin/TranslationControls";
import { AIProviderSelector } from "@/components/admin/AIProviderSelector";

type Locale = 'vi' | 'en' | 'ja';

interface ProductFormData {
  categoryId: number | "";
  name: string | Record<Locale, string>;
  slug: string;
  tagline: string | Record<Locale, string>;
  meta: string | Record<Locale, string>;
  description: string | Record<Locale, string>;
  image: string;
  gradient: string;
  pricing: string | Record<Locale, string>;
  badge: string | Record<Locale, string>;
  statsUsers: string | Record<Locale, string>;
  statsRating: number;
  statsDeploy: string | Record<Locale, string>;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  features: (string | Record<Locale, string>)[];
  demoLink: string;
  seoTitle: string | Record<Locale, string>;
  seoDescription: string | Record<Locale, string>;
  seoKeywords: string | Record<Locale, string>;
  publishedAt?: string | null;
}

interface CategoryOption {
  id: number;
  slug: string;
  name: string;
  isActive: boolean;
}

const GRADIENT_OPTIONS = [
  { value: "from-[#006FB3] to-[#0088D9]", label: "Xanh dương SFB" },
  { value: "from-purple-600 to-pink-600", label: "Tím - Hồng" },
  { value: "from-emerald-600 to-teal-600", label: "Xanh lá - Teal" },
  { value: "from-orange-600 to-amber-600", label: "Cam - Vàng" },
  { value: "from-red-600 to-rose-600", label: "Đỏ - Hồng" },
  { value: "from-indigo-600 to-purple-600", label: "Indigo - Tím" },
];

interface ProductFormProps {
  productId?: number;
  onSuccess?: () => void;
}

const getTodayDateString = () => {
  try {
    return new Date().toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export default function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const router = useRouter();
  // Use translation controls hook
  const {
    globalLocale,
    setGlobalLocale,
    aiProvider,
    setAiProvider,
    translatingAll,
    translateSourceLang,
    setTranslateSourceLang,
    translateData
  } = useTranslationControls();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!productId);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [activeDetailSubTab, setActiveDetailSubTab] = useState<string>("config");
  const [activeContentModeTab, setActiveContentModeTab] = useState<string>("widget");
  // Nếu đang edit và đã có slug từ DB, không tự động generate nữa
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [galleryUploadKey, setGalleryUploadKey] = useState(0);
  const [contentHtmlEditorKey, setContentHtmlEditorKey] = useState(0);

  const [formData, setFormData] = useState<ProductFormData>(() => ({
    categoryId: "",
    name: { vi: "", en: "", ja: "" },
    slug: "",
    tagline: { vi: "", en: "", ja: "" },
    meta: { vi: "", en: "", ja: "" },
    description: { vi: "", en: "", ja: "" },
    image: "",
    gradient: GRADIENT_OPTIONS[0].value,
    pricing: { vi: "Liên hệ", en: "", ja: "" },
    badge: { vi: "", en: "", ja: "" },
    statsUsers: { vi: "", en: "", ja: "" },
    statsRating: 0,
    statsDeploy: { vi: "", en: "", ja: "" },
    sortOrder: 0,
    isFeatured: false,
    isActive: true,
    features: [],
    demoLink: "",
    seoTitle: { vi: "", en: "", ja: "" },
    seoDescription: { vi: "", en: "", ja: "" },
    seoKeywords: { vi: "", en: "", ja: "" },
    // Mặc định ngày xuất bản là hôm nay cho sản phẩm mới
    publishedAt: getTodayDateString(),
  }));

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProduct();
      fetchProductDetail();
    }
  }, [productId]);

  // Tự động generate slug từ name khi name thay đổi (chỉ khi chưa chỉnh sửa thủ công và không có slug từ DB)
  useEffect(() => {
    // Chỉ tự động generate khi:
    // 1. Chưa chỉnh sửa thủ công
    // 2. Có tên sản phẩm
    // 3. Không phải đang edit với slug đã có từ DB
    if (!slugManuallyEdited && formData.name && !(productId && formData.slug)) {
      const nameStr = typeof formData.name === 'string' ? formData.name : getLocalizedText(formData.name, globalLocale);
      if (nameStr) {
        const autoSlug = generateSlug(nameStr);
        if (autoSlug && autoSlug !== formData.slug) {
          setFormData(prev => ({ ...prev, slug: autoSlug }));
        }
      }
    }
  }, [formData.name, slugManuallyEdited, productId, formData.slug, globalLocale]);

  // Force re-mount RichTextEditor khi globalLocale thay đổi
  useEffect(() => {
    setContentHtmlEditorKey(prev => prev + 1);
  }, [globalLocale]);

  const fetchProductDetail = async (forceReload = false) => {
    if (!productId) return;
    try {
      setLoadingDetail(true);
      // Thêm timestamp vào URL để bypass cache khi force reload
      const endpoint = forceReload
        ? `${AdminEndpoints.products.detailPage(productId)}?_t=${Date.now()}`
        : AdminEndpoints.products.detailPage(productId);
      const response = await adminApiCall<{ success: boolean; data?: any }>(
        endpoint,
      );

      // Handle 304 Not Modified or null response
      if (!response || response === null) {
        // If 304 or null, use empty data structure with locale objects
        setDetailData({
          contentMode: "config",
          contentHtml: { vi: "", en: "", ja: "" },
          metaTop: { vi: "", en: "", ja: "" },
          heroDescription: { vi: "", en: "", ja: "" },
          heroImage: "",
          ctaContactText: { vi: "", en: "", ja: "" },
          ctaContactHref: "",
          ctaDemoText: { vi: "", en: "", ja: "" },
          ctaDemoHref: "",
          overviewKicker: { vi: "", en: "", ja: "" },
          overviewTitle: { vi: "", en: "", ja: "" },
          overviewCards: [],
          showcase: {
            title: { vi: "", en: "", ja: "" },
            desc: { vi: "", en: "", ja: "" },
            bullets: [],
            ctaText: { vi: "", en: "", ja: "" },
            ctaHref: "",
            imageBack: "",
            imageFront: "",
          },
          numberedSections: [],
          expand: {
            title: { vi: "", en: "", ja: "" },
            bullets: [],
            ctaText: { vi: "", en: "", ja: "" },
            ctaHref: "",
            image: "",
          },
          galleryImages: [],
          galleryPosition: "top",
          galleryTitle: { vi: "", en: "", ja: "" },
          showTableOfContents: true,
          enableShareButtons: true,
          showAuthorBox: true,
        });
        setActiveContentModeTab("widget");
        return;
      }

      // API có thể trả về data: null nếu chưa có detail
      if (response.data === null || response.data === undefined) {
        setDetailData({
          contentMode: "config",
          contentHtml: { vi: "", en: "", ja: "" },
          metaTop: { vi: "", en: "", ja: "" },
          heroDescription: { vi: "", en: "", ja: "" },
          heroImage: "",
          ctaContactText: { vi: "", en: "", ja: "" },
          ctaContactHref: "",
          ctaDemoText: { vi: "", en: "", ja: "" },
          ctaDemoHref: "",
          overviewKicker: { vi: "", en: "", ja: "" },
          overviewTitle: { vi: "", en: "", ja: "" },
          overviewCards: [],
          showcase: {
            title: { vi: "", en: "", ja: "" },
            desc: { vi: "", en: "", ja: "" },
            bullets: [],
            ctaText: { vi: "", en: "", ja: "" },
            ctaHref: "",
            imageBack: "",
            imageFront: "",
          },
          numberedSections: [],
          expand: {
            title: { vi: "", en: "", ja: "" },
            bullets: [],
            ctaText: { vi: "", en: "", ja: "" },
            ctaHref: "",
            image: "",
          },
          galleryImages: [],
          galleryPosition: "top",
          galleryTitle: { vi: "", en: "", ja: "" },
          showTableOfContents: true,
          enableShareButtons: true,
          showAuthorBox: true,
        });
        setActiveContentModeTab("widget");
      } else {
        // Normalize dữ liệu để đảm bảo các field có thể dịch luôn là locale object
        const normalizedData = migrateObjectToLocale(response.data);
        
        // Helper function để normalize nested objects
        const normalizeDetailData = (data: any) => {
          const normalized: any = {
            contentMode: data.contentMode || "config",
            contentHtml: migrateObjectToLocale(data.contentHtml || ""),
            metaTop: migrateObjectToLocale(data.metaTop || ""),
            heroDescription: migrateObjectToLocale(data.heroDescription || ""),
            heroImage: data.heroImage || "",
            ctaContactText: migrateObjectToLocale(data.ctaContactText || ""),
            ctaContactHref: data.ctaContactHref || "",
            ctaDemoText: migrateObjectToLocale(data.ctaDemoText || ""),
            ctaDemoHref: data.ctaDemoHref || "",
            overviewKicker: migrateObjectToLocale(data.overviewKicker || ""),
            overviewTitle: migrateObjectToLocale(data.overviewTitle || ""),
            overviewCards: (data.overviewCards || []).map((card: any) => ({
              ...card,
              step: card.step || card.no || 0,
              title: migrateObjectToLocale(card.title || ""),
              description: migrateObjectToLocale(card.description || card.desc || ""),
              desc: migrateObjectToLocale(card.description || card.desc || ""),
            })),
            showcase: {
              title: migrateObjectToLocale(data.showcase?.title || ""),
              desc: migrateObjectToLocale(data.showcase?.desc || ""),
              bullets: (data.showcase?.bullets || []).map((b: any) => 
                typeof b === 'string' ? migrateObjectToLocale(b) : migrateObjectToLocale(b)
              ),
              ctaText: migrateObjectToLocale(data.showcase?.ctaText || ""),
              ctaHref: data.showcase?.ctaHref || "",
              imageBack: data.showcase?.imageBack || "",
              imageFront: data.showcase?.imageFront || "",
              overlay: data.showcase?.overlay || {},
            },
            numberedSections: (data.numberedSections || []).map((section: any) => ({
              ...section,
              sectionNo: section.sectionNo || section.no || 0,
              no: section.sectionNo || section.no || 0,
              title: migrateObjectToLocale(section.title || ""),
              image: section.image || "",
              imageBack: section.imageBack || "",
              imageFront: section.imageFront || "",
              imageSide: section.imageSide || "left",
              paragraphs: (section.paragraphs || []).map((para: any) => {
                if (typeof para === 'string') {
                  return { title: { vi: "", en: "", ja: "" }, text: migrateObjectToLocale(para) };
                }
                return {
                  title: migrateObjectToLocale(para.title || ""),
                  text: migrateObjectToLocale(para.text || ""),
                };
              }),
              overlay: section.overlay || {},
            })),
            expand: {
              title: migrateObjectToLocale(data.expand?.title || ""),
              bullets: (data.expand?.bullets || []).map((b: any) => 
                typeof b === 'string' ? migrateObjectToLocale(b) : migrateObjectToLocale(b)
              ),
              ctaText: migrateObjectToLocale(data.expand?.ctaText || ""),
              ctaHref: data.expand?.ctaHref || "",
              image: data.expand?.image || "",
            },
            galleryImages: data.galleryImages || [],
            galleryPosition: data.galleryPosition || "top",
            galleryTitle: migrateObjectToLocale(data.galleryTitle || ""),
            showTableOfContents: data.showTableOfContents !== false,
            enableShareButtons: data.enableShareButtons !== false,
            showAuthorBox: data.showAuthorBox !== false,
          };
          return normalized;
        };
        
        const normalizedDetail = normalizeDetailData(normalizedData);
        setDetailData(normalizedDetail);
        setActiveContentModeTab(normalizedDetail.contentMode === "content" ? "content" : "widget");
      }
    } catch (error: any) {
      // Silently fail
      // Nếu có lỗi, tạo empty data với locale objects
      setDetailData({
        contentMode: "config",
        contentHtml: "",
        metaTop: { vi: "", en: "", ja: "" },
        heroDescription: { vi: "", en: "", ja: "" },
        heroImage: "",
        ctaContactText: { vi: "", en: "", ja: "" },
        ctaContactHref: "",
        ctaDemoText: { vi: "", en: "", ja: "" },
        ctaDemoHref: "",
        overviewKicker: { vi: "", en: "", ja: "" },
        overviewTitle: { vi: "", en: "", ja: "" },
        overviewCards: [],
        showcase: {
          title: { vi: "", en: "", ja: "" },
          desc: { vi: "", en: "", ja: "" },
          bullets: [],
          ctaText: { vi: "", en: "", ja: "" },
          ctaHref: "",
          imageBack: "",
          imageFront: "",
        },
        numberedSections: [],
        expand: {
          title: { vi: "", en: "", ja: "" },
          bullets: [],
          ctaText: { vi: "", en: "", ja: "" },
          ctaHref: "",
          image: "",
        },
        galleryImages: [],
        galleryPosition: "top",
        galleryTitle: { vi: "", en: "", ja: "" },
        showTableOfContents: true,
        enableShareButtons: true,
        showAuthorBox: true,
      });
      setActiveContentModeTab("widget");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSaveDetail = async (dataToSave?: any) => {
    // Sử dụng dataToSave nếu có, nếu không thì dùng detailData hiện tại
    const data = dataToSave || detailData;
    if (!productId || !data) return;
    try {
      setLoading(true);
      // Sử dụng contentMode từ detailData (được set từ Select field hoặc tab)
      const dataToSaveWithMode = {
        ...data,
        contentMode: data.contentMode || (activeContentModeTab === "content" ? "content" : "config"),
      };
      // Saving detail data
      const response = await adminApiCall(AdminEndpoints.products.detailPage(productId), {
        method: "PUT",
        body: JSON.stringify(dataToSaveWithMode),
      });
      // Save successful
      toast.success("Đã lưu chi tiết sản phẩm");
      // Reload lại data từ backend để cập nhật UI với sort_order mới (force reload để bypass cache)
      setEditingSection(null); // Đóng các dialog đang mở
      await fetchProductDetail(true);
    } catch (error: any) {
      // Save error - silently fail
      toast.error(error?.message || "Không thể lưu chi tiết sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminApiCall<{ success: boolean; data?: CategoryOption[] }>(
        AdminEndpoints.productCategories.list,
      );
      setCategories(data.data || []);
    } catch (error) {
      // Silently fail
    }
  };

  const fetchProduct = async () => {
    try {
      setLoadingData(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.products.detail(productId!),
      );
      if (data.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedData = migrateObjectToLocale(data.data);
        // Nếu đang edit và đã có slug từ DB, không tự động generate nữa
        const hasSlug = !!(normalizedData.slug);
        setSlugManuallyEdited(hasSlug);
        setFormData({
          categoryId: normalizedData.categoryId || "",
          name: normalizedData.name || { vi: "", en: "", ja: "" },
          slug: normalizedData.slug || "",
          tagline: normalizedData.tagline || { vi: "", en: "", ja: "" },
          meta: normalizedData.meta || { vi: "", en: "", ja: "" },
          description: normalizedData.description || { vi: "", en: "", ja: "" },
          image: normalizedData.image || "",
          gradient: normalizedData.gradient || GRADIENT_OPTIONS[0].value,
          pricing: normalizedData.pricing || { vi: "Liên hệ", en: "", ja: "" },
          badge: normalizedData.badge || { vi: "", en: "", ja: "" },
          statsUsers: normalizedData.statsUsers || { vi: "", en: "", ja: "" },
          statsRating: normalizedData.statsRating || 0,
          statsDeploy: normalizedData.statsDeploy || { vi: "", en: "", ja: "" },
          sortOrder: normalizedData.sortOrder || 0,
          isFeatured: normalizedData.isFeatured || false,
          isActive: normalizedData.isActive !== undefined ? normalizedData.isActive : true,
          features: (normalizedData.features || []).map((f: any) => 
            typeof f === 'string' ? { vi: f, en: "", ja: "" } : migrateObjectToLocale(f)
          ),
          demoLink: normalizedData.demoLink || "",
          seoTitle: normalizedData.seoTitle || { vi: "", en: "", ja: "" },
          seoDescription: normalizedData.seoDescription || { vi: "", en: "", ja: "" },
          seoKeywords: normalizedData.seoKeywords || { vi: "", en: "", ja: "" },
          publishedAt: normalizedData.publishedAt || ""
        });
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải thông tin sản phẩm");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.categoryId) {
      toast.error("Danh mục không được để trống");
      return;
    }

    const nameStr =
      typeof formData.name === "string"
        ? formData.name
        : getLocalizedText(formData.name, globalLocale);
    if (!nameStr || !nameStr.trim()) {
      toast.error("Tên sản phẩm không được để trống");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        categoryId: formData.categoryId || null,
        statsRating: Number(formData.statsRating) || 0,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (productId) {
        // Cập nhật thông tin cơ bản
        await adminApiCall(AdminEndpoints.products.detail(productId), {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        // Nếu có chi tiết sản phẩm, lưu luôn chi tiết
        if (detailData) {
          try {
            // Đảm bảo contentMode được set đúng từ detailData
            const detailToSave = {
              ...detailData,
              contentMode: detailData.contentMode || (activeContentModeTab === "content" ? "content" : "config"),
            };
            await adminApiCall(AdminEndpoints.products.detailPage(productId), {
              method: "PUT",
              body: JSON.stringify(detailToSave),
            });
          } catch (detailError: any) {
            // Silently fail
            // Không throw error để vẫn lưu được thông tin cơ bản
          }
        }

        toast.success("Đã cập nhật sản phẩm");
        // Reload lại data để cập nhật UI
        await Promise.all([
          fetchProduct(),
          productId ? fetchProductDetail() : Promise.resolve(),
        ]);
      } else {
        // Tạo sản phẩm mới
        const response = await adminApiCall<{ success: boolean; data?: { id: number } }>(
          AdminEndpoints.products.list,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        toast.success("Đã tạo sản phẩm");

        // Nếu có onSuccess callback, gọi nó
        if (onSuccess) {
          onSuccess();
        } else {
          // Chuyển đến trang edit với ID mới
          if (response.data?.id) {
            router.push(`/admin/products/edit/${response.data.id}`);
          } else {
            router.push("/admin/products");
          }
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, { vi: "", en: "", ja: "" }] });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string | Record<Locale, string>) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  if (loadingData) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 -mx-6 px-6 py-4 mb-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-3xl font-bold">
            {productId ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {productId ? "Cập nhật thông tin sản phẩm" : "Thêm sản phẩm mới vào hệ thống"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AIProviderSelector
            value={aiProvider}
            onChange={setAiProvider}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue={productId ? "detail" : "basic"} className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          {productId && <TabsTrigger value="detail">Chi tiết sản phẩm</TabsTrigger>}
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thông tin sản phẩm</CardTitle>
                <TranslationControls
                  globalLocale={globalLocale}
                  setGlobalLocale={setGlobalLocale}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="text-gray-900">Danh mục *</Label>
                  <Select
                    value={formData.categoryId === "" ? "" : String(formData.categoryId)}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value === "" ? "" : Number(value) })
                    }
                  >
                    <SelectTrigger suppressHydrationWarning>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.isActive && c.slug !== "all")
                        .map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {typeof category.name === 'string' ? category.name : getLocalizedText(category.name, globalLocale)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Tên sản phẩm *"
                    value={getLocaleValue(formData, 'name')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'name', value);
                      setFormData(updated);
                    }}
                    placeholder="Nhập tên sản phẩm"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-gray-900">
                    <LinkIcon className="w-3 h-3 inline mr-1" />
                    Slug / Đường dẫn
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      // Tự động format slug: remove dấu và chuyển thành lowercase với dấu gạch ngang
                      const formattedSlug = generateSlug(e.target.value);
                      setFormData({ ...formData, slug: formattedSlug });
                    }}
                    placeholder="san-pham-slug"
                  />
                  <p className="text-[11px] text-gray-500">
                    Dùng tiếng Việt không dấu, cách nhau bằng dấu gạch ngang.
                  </p>
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Dòng mô tả ngắn (Tagline)"
                    value={getLocaleValue(formData, 'tagline')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'tagline', value);
                      setFormData(updated);
                    }}
                    placeholder="Ví dụ: Tuyển sinh trực tuyến minh bạch, đúng quy chế"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Thông tin meta"
                    value={getLocaleValue(formData, 'meta')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'meta', value);
                      setFormData(updated);
                    }}
                    placeholder="Ví dụ: Sản phẩm • Tin công nghệ • 07/08/2025"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Giá"
                    value={getLocaleValue(formData, 'pricing')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'pricing', value);
                      setFormData(updated);
                    }}
                    placeholder="Ví dụ: Liên hệ"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Nhãn hiển thị (Badge)"
                    value={getLocaleValue(formData, 'badge')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'badge', value);
                      setFormData(updated);
                    }}
                    placeholder="Ví dụ: Giải pháp nổi bật"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradient" className="text-gray-900">Màu nền gradient</Label>
                  <Select
                    value={formData.gradient}
                    onValueChange={(value) => setFormData({ ...formData, gradient: value })}
                  >
                    <SelectTrigger suppressHydrationWarning>
                      <SelectValue>
                        {GRADIENT_OPTIONS.find(opt => opt.value === formData.gradient)?.label || "Chọn màu"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {GRADIENT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demoLink" className="text-gray-900">Link Demo nhanh</Label>
                  <Input
                    id="demoLink"
                    value={formData.demoLink}
                    onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                    placeholder="Ví dụ: /demo hoặc https://demo.example.com"
                  />
                  <p className="text-xs text-gray-500">
                    Link đến trang demo của sản phẩm
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className="text-gray-900">Thứ tự sắp xếp</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishedAt" className="text-gray-900">Ngày xuất bản</Label>
                  <Input
                    id="publishedAt"
                    type="date"
                    value={formatDateForInput(formData.publishedAt || "")}
                    onChange={(e) =>
                      setFormData({ ...formData, publishedAt: e.target.value || "" })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Ngày bài viết/sản phẩm được xuất bản (dùng cho hiển thị & sắp xếp).
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <LocaleInput
                  label="Mô tả"
                  value={getLocaleValue(formData, 'description')}
                  onChange={(value) => {
                    const updated = setLocaleValue(formData, 'description', value);
                    setFormData(updated);
                  }}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  multiline={true}
                  defaultLocale={globalLocale}
                  aiProvider={aiProvider}
                />
              </div>


              <div className="space-y-2">
                <Label className="text-gray-900">Hình ảnh</Label>
                <ImageUpload
                  currentImage={formData.image}
                  onImageSelect={(url: string) => setFormData({ ...formData, image: url })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <LocaleInput
                    label="Số lượng người dùng"
                    value={getLocaleValue(formData, 'statsUsers')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'statsUsers', value);
                      setFormData(updated);
                    }}
                    placeholder="Ví dụ: Nhiều trường học áp dụng"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statsRating" className="text-gray-900">Đánh giá (Rating)</Label>
                  <Input
                    id="statsRating"
                    type="number"
                    step="0.1"
                    value={formData.statsRating}
                    onChange={(e) =>
                      setFormData({ ...formData, statsRating: Number(e.target.value) || 0 })
                    }
                    placeholder="4.8"
                  />
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Hình thức triển khai"
                    value={getLocaleValue(formData, 'statsDeploy')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'statsDeploy', value);
                      setFormData(updated);
                    }}
                    placeholder="Ví dụ: Triển khai Cloud/On-premise"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tính năng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <LocaleInput
                      label={`Tính năng ${index + 1}`}
                      value={getLocaleValue(feature, '')}
                      onChange={(value) => updateFeature(index, value)}
                      placeholder={`Tính năng ${index + 1}`}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm tính năng
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900">Nổi bật</Label>
                  <p className="text-sm text-muted-foreground">
                    Hiển thị sản phẩm này ở vị trí nổi bật
                  </p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900">Đang hoạt động</Label>
                  <p className="text-sm text-muted-foreground">
                    Sản phẩm sẽ hiển thị trên website
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
          {/* SEO Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SearchIcon className="w-5 h-5 text-blue-600" />
                <CardTitle>Tối ưu hóa SEO</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-3 shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 rounded-full p-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      Tối ưu hóa SEO
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Điền đầy đủ thông tin SEO để sản phẩm dễ dàng được tìm thấy trên Google. Nhấn "Tự động" để sử dụng tên và mô tả hiện có.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seoTitle" className="text-sm font-semibold">
                      Tiêu đề SEO
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => {
                        const nameStr = typeof formData.name === 'string' ? formData.name : getLocalizedText(formData.name, globalLocale);
                        if (nameStr) {
                          const autoTitle =
                            nameStr.length > 60
                              ? nameStr.substring(0, 57) + "..."
                              : nameStr;
                          setFormData({ ...formData, seoTitle: { ...(typeof formData.seoTitle === 'object' ? formData.seoTitle : { vi: "", en: "", ja: "" }), [globalLocale]: autoTitle } });
                        }
                      }}
                      disabled={!formData.name}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Tự động
                    </Button>
                  </div>
                  <LocaleInput
                    label=""
                    value={getLocaleValue(formData, 'seoTitle')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'seoTitle', value);
                      setFormData(updated);
                    }}
                    placeholder={
                      (typeof formData.name === 'string' ? formData.name : getLocalizedText(formData.name, globalLocale))
                        ? `Tự động: ${(typeof formData.name === 'string' ? formData.name : getLocalizedText(formData.name, globalLocale)).substring(0, 40)}...`
                        : "Nhập tiêu đề SEO..."
                    }
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                    className="text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Khuyến nghị: 50-60 ký tự</p>
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded ${(typeof formData.seoTitle === 'string' ? formData.seoTitle : getLocalizedText(formData.seoTitle, globalLocale)).length > 60
                          ? "text-red-600 bg-red-50"
                          : (typeof formData.seoTitle === 'string' ? formData.seoTitle : getLocalizedText(formData.seoTitle, globalLocale)).length >= 50 &&
                            (typeof formData.seoTitle === 'string' ? formData.seoTitle : getLocalizedText(formData.seoTitle, globalLocale)).length <= 60
                            ? "text-green-600 bg-green-50"
                            : (typeof formData.seoTitle === 'string' ? formData.seoTitle : getLocalizedText(formData.seoTitle, globalLocale)).length > 0
                              ? "text-yellow-600 bg-yellow-50"
                              : "text-gray-400 bg-gray-50"
                        }`}
                    >
                      {(typeof formData.seoTitle === 'string' ? formData.seoTitle : getLocalizedText(formData.seoTitle, globalLocale)).length}/60
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seoDescription" className="text-sm font-semibold">
                      Mô tả SEO
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => {
                        const descStr = typeof formData.description === 'string' ? formData.description : getLocalizedText(formData.description, globalLocale);
                        if (descStr) {
                          const autoDesc =
                            descStr.length > 160
                              ? descStr.substring(0, 157) + "..."
                              : descStr;
                          setFormData({
                            ...formData,
                            seoDescription: { ...(typeof formData.seoDescription === 'object' ? formData.seoDescription : { vi: "", en: "", ja: "" }), [globalLocale]: autoDesc },
                          });
                        }
                      }}
                      disabled={!formData.description}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Tự động
                    </Button>
                  </div>
                  <LocaleInput
                    label=""
                    value={getLocaleValue(formData, 'seoDescription')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'seoDescription', value);
                      setFormData(updated);
                    }}
                    placeholder={
                      (typeof formData.description === 'string' ? formData.description : getLocalizedText(formData.description, globalLocale))
                        ? `Tự động: ${(typeof formData.description === 'string' ? formData.description : getLocalizedText(formData.description, globalLocale)).substring(0, 60)}...`
                        : "Nhập mô tả SEO..."
                    }
                    multiline={true}
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                    className="resize-none text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Khuyến nghị: 150-160 ký tự
                    </p>
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded ${(typeof formData.seoDescription === 'string' ? formData.seoDescription : getLocalizedText(formData.seoDescription, globalLocale)).length > 160
                          ? "text-red-600 bg-red-50"
                          : (typeof formData.seoDescription === 'string' ? formData.seoDescription : getLocalizedText(formData.seoDescription, globalLocale)).length >= 150 &&
                            (typeof formData.seoDescription === 'string' ? formData.seoDescription : getLocalizedText(formData.seoDescription, globalLocale)).length <= 160
                            ? "text-green-600 bg-green-50"
                            : (typeof formData.seoDescription === 'string' ? formData.seoDescription : getLocalizedText(formData.seoDescription, globalLocale)).length > 0
                              ? "text-yellow-600 bg-yellow-50"
                              : "text-gray-400 bg-gray-50"
                        }`}
                    >
                      {(typeof formData.seoDescription === 'string' ? formData.seoDescription : getLocalizedText(formData.seoDescription, globalLocale)).length}/160
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Từ khóa SEO"
                    value={getLocaleValue(formData, 'seoKeywords')}
                    onChange={(value) => {
                      const updated = setLocaleValue(formData, 'seoKeywords', value);
                      setFormData(updated);
                    }}
                    placeholder="từ khóa 1, từ khóa 2..."
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Phân cách bằng dấu phẩy
                  </p>
                </div>

                {(formData.seoTitle || formData.seoDescription) && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Xem trước:
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs text-blue-600 font-medium line-clamp-1">
                        {typeof formData.seoTitle === 'string' ? formData.seoTitle : getLocalizedText(formData.seoTitle, globalLocale) || 
                         (typeof formData.name === 'string' ? formData.name : getLocalizedText(formData.name, globalLocale)) || 
                         "Tên sản phẩm"}
                      </div>
                      <div className="text-xs text-green-700">
                        {formData.slug ? `/products/${formData.slug}` : "/products/..."}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {(typeof formData.seoDescription === 'string' ? formData.seoDescription : getLocalizedText(formData.seoDescription, globalLocale)) ||
                          (typeof formData.description === 'string' ? formData.description : getLocalizedText(formData.description, globalLocale)) ||
                          "Mô tả sản phẩm..."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {productId && (
          <TabsContent value="detail" className="space-y-0">
            <Tabs value={activeDetailSubTab} onValueChange={setActiveDetailSubTab} className="w-full">
              <TabsList>
                <TabsTrigger value="config">Cấu hình</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="config" className="space-y-4 mt-4">
                {loadingDetail ? (
                  <div className="text-center py-8 text-gray-900">Đang tải...</div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm</h2>
                      <p className="text-gray-600 mt-1">Cấu hình các section của trang chi tiết sản phẩm hoặc nhập nội dung HTML. Nhấn nút "Lưu" ở trên để lưu tất cả thay đổi.</p>
                    </div>

                    {/* Content Mode Tabs */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Chế độ hiển thị</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              Chọn chế độ hiển thị: Widget (cấu hình từng section) hoặc Nội dung (HTML tự do).
                            </p>
                          </div>
                          <div className="w-[280px]">
                            <Label className="text-sm font-semibold mb-2 block">Chế độ hiển thị</Label>
                            <Select
                              value={detailData?.contentMode || "config"}
                              onValueChange={(value: "config" | "content") => {
                                setDetailData({ ...detailData, contentMode: value });
                                setActiveContentModeTab(value === "content" ? "content" : "widget");
                              }}
                            >
                              <SelectTrigger suppressHydrationWarning>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="config">Chế độ Widget</SelectItem>
                                <SelectItem value="content">Chế độ Nội dung</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Tabs
                          value={activeContentModeTab}
                          onValueChange={(value) => {
                            setActiveContentModeTab(value);
                            setDetailData({
                              ...detailData,
                              contentMode: value === "content" ? "content" : "config"
                            });
                          }}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="widget">Widget</TabsTrigger>
                            <TabsTrigger value="content">Nội dung</TabsTrigger>
                          </TabsList>

                          <TabsContent value="widget" className="space-y-4 mt-4">
                            {/* Hero Section Config */}
                            {detailData && (
                              <Card>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle>Khối 1 - Hero trang chi tiết</CardTitle>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Tiêu đề, đoạn mở đầu và ảnh lớn ở đầu trang chi tiết sản phẩm.
                                      </p>
                                    </div>
                                    <TranslationControls
                                      globalLocale={globalLocale}
                                      setGlobalLocale={setGlobalLocale}
                                    />
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <LocaleInput
                                      label="Dòng chữ phía trên (Meta Top)"
                                      value={getLocaleValue(detailData, 'metaTop')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData, 'metaTop', value);
                                        setDetailData(updated);
                                      }}
                                      placeholder="Ví dụ: Giải pháp phần mềm"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <LocaleInput
                                      label="Mô tả Hero"
                                      value={getLocaleValue(detailData, 'heroDescription')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData, 'heroDescription', value);
                                        setDetailData(updated);
                                      }}
                                      multiline={true}
                                      placeholder="Mô tả về sản phẩm..."
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Ảnh Hero</Label>
                                    <ImageUpload
                                      currentImage={detailData.heroImage || ""}
                                      onImageSelect={(url: string) => {
                                        setDetailData({ ...detailData, heroImage: url });
                                      }}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <LocaleInput
                                        label="Nút liên hệ - Văn bản"
                                        value={getLocaleValue(detailData, 'ctaContactText')}
                                        onChange={(value) => {
                                          const updated = setLocaleValue(detailData, 'ctaContactText', value);
                                          setDetailData(updated);
                                        }}
                                        placeholder="LIÊN HỆ NGAY"
                                        defaultLocale={globalLocale}
                                        aiProvider={aiProvider}
                                      />
                                    </div>
                                    <div>
                                      <Label className="mb-2">Nút liên hệ - Đường dẫn</Label>
                                      <Input
                                        value={detailData.ctaContactHref || ""}
                                        onChange={(e) => {
                                          setDetailData({ ...detailData, ctaContactHref: e.target.value });
                                        }}
                                        placeholder="/contact"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <LocaleInput
                                        label="Nút demo - Văn bản"
                                        value={getLocaleValue(detailData, 'ctaDemoText')}
                                        onChange={(value) => {
                                          const updated = setLocaleValue(detailData, 'ctaDemoText', value);
                                          setDetailData(updated);
                                        }}
                                        placeholder="DEMO HỆ THỐNG"
                                        defaultLocale={globalLocale}
                                        aiProvider={aiProvider}
                                      />
                                    </div>
                                    <div>
                                      <Label className="mb-2">Nút demo - Đường dẫn</Label>
                                      <Input
                                        value={detailData.ctaDemoHref || ""}
                                        onChange={(e) => {
                                          setDetailData({ ...detailData, ctaDemoHref: e.target.value });
                                        }}
                                        placeholder="/demo"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Overview Section Config */}
                            {detailData && (
                              <Card>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle>Khối 2 - Tổng quan (Overview)</CardTitle>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Kicker, tiêu đề và các card mô tả các bước / tính năng chính.
                                      </p>
                                    </div>
                                    <TranslationControls
                                      globalLocale={globalLocale}
                                      setGlobalLocale={setGlobalLocale}
                                    />
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <LocaleInput
                                      label="Dòng chữ nhỏ phía trên (Kicker)"
                                      value={getLocaleValue(detailData, 'overviewKicker')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData, 'overviewKicker', value);
                                        setDetailData(updated);
                                      }}
                                      placeholder="Ví dụ: Tổng quan"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <LocaleInput
                                      label="Tiêu đề chính"
                                      value={getLocaleValue(detailData, 'overviewTitle')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData, 'overviewTitle', value);
                                        setDetailData(updated);
                                      }}
                                      placeholder="Tiêu đề overview"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Danh sách thẻ (Cards)</Label>
                                    <div className="space-y-4">
                                      {(detailData.overviewCards || []).map((card: any, index: number) => (
                                        <Card key={index}>
                                          <CardContent className="pt-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                              <Label className="mb-2">Thẻ {index + 1}</Label>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  const newCards = (detailData.overviewCards || []).filter(
                                                    (_: any, i: number) => i !== index
                                                  );
                                                  setDetailData({ ...detailData, overviewCards: newCards });
                                                }}
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </div>
                                            <div>
                                              <Label className="mb-2">Số thứ tự</Label>
                                              <Input
                                                type="number"
                                                value={card.step || index + 1}
                                                onChange={(e) => {
                                                  const newCards = [...(detailData.overviewCards || [])];
                                                  newCards[index] = { ...card, step: Number(e.target.value) || index + 1 };
                                                  setDetailData({ ...detailData, overviewCards: newCards });
                                                }}
                                              />
                                            </div>
                                            <div>
                                              <LocaleInput
                                                label="Tiêu đề thẻ"
                                                value={getLocaleValue(card, 'title')}
                                                onChange={(value) => {
                                                  const newCards = [...(detailData.overviewCards || [])];
                                                  const updatedCard = setLocaleValue(card, 'title', value);
                                                  newCards[index] = updatedCard;
                                                  setDetailData({ ...detailData, overviewCards: newCards });
                                                }}
                                                placeholder="Tiêu đề card"
                                                defaultLocale={globalLocale}
                                                aiProvider={aiProvider}
                                              />
                                            </div>
                                            <div>
                                              <LocaleInput
                                                label="Mô tả thẻ"
                                                value={getLocaleValue(card, 'description')}
                                                onChange={(value) => {
                                                  const newCards = [...(detailData.overviewCards || [])];
                                                  const updatedCard = { ...setLocaleValue(card, 'description', value), desc: value };
                                                  newCards[index] = updatedCard;
                                                  setDetailData({ ...detailData, overviewCards: newCards });
                                                }}
                                                multiline={true}
                                                placeholder="Mô tả card"
                                                defaultLocale={globalLocale}
                                                aiProvider={aiProvider}
                                              />
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          const newCards = [
                                            ...(detailData.overviewCards || []),
                                            { 
                                              step: (detailData.overviewCards?.length || 0) + 1, 
                                              title: { vi: "", en: "", ja: "" }, 
                                              description: { vi: "", en: "", ja: "" }, 
                                              desc: { vi: "", en: "", ja: "" } 
                                            },
                                          ];
                                          setDetailData({ ...detailData, overviewCards: newCards });
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm Card
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Showcase Section Config */}
                            {detailData && detailData.showcase && (
                              <Card>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle>Khối 3 - Showcase màn hình</CardTitle>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Bố cục 2 cột: bên trái là ảnh màn hình, bên phải là tiêu đề, mô tả và bullets.
                                      </p>
                                    </div>
                                    <TranslationControls
                                      globalLocale={globalLocale}
                                      setGlobalLocale={setGlobalLocale}
                                    />
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <LocaleInput
                                      label="Tiêu đề showcase"
                                      value={getLocaleValue(detailData.showcase, 'title')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData.showcase, 'title', value);
                                        setDetailData({
                                          ...detailData,
                                          showcase: { ...detailData.showcase, ...updated },
                                        });
                                      }}
                                      placeholder="Tiêu đề showcase"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <LocaleInput
                                      label="Mô tả showcase"
                                      value={getLocaleValue(detailData.showcase, 'desc')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData.showcase, 'desc', value);
                                        setDetailData({
                                          ...detailData,
                                          showcase: { ...detailData.showcase, ...updated },
                                        });
                                      }}
                                      multiline={true}
                                      placeholder="Mô tả showcase"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Danh sách điểm nổi bật (Bullets)</Label>
                                    <div className="space-y-2">
                                      {(detailData.showcase?.bullets || []).map((bullet: any, index: number) => (
                                        <div key={index} className="flex gap-2">
                                          <LocaleInput
                                            label={`Bullet ${index + 1}`}
                                            value={getLocaleValue(bullet, '')}
                                            onChange={(value) => {
                                              const newBullets = [...(detailData.showcase?.bullets || [])];
                                              newBullets[index] = value;
                                              setDetailData({
                                                ...detailData,
                                                showcase: { ...detailData.showcase, bullets: newBullets },
                                              });
                                            }}
                                            placeholder={`Bullet ${index + 1}`}
                                            defaultLocale={globalLocale}
                                            aiProvider={aiProvider}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              const newBullets = (detailData.showcase?.bullets || []).filter(
                                                (_: any, i: number) => i !== index
                                              );
                                              setDetailData({
                                                ...detailData,
                                                showcase: { ...detailData.showcase, bullets: newBullets },
                                              });
                                            }}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          const newBullets = [...(detailData.showcase?.bullets || []), { vi: "", en: "", ja: "" }];
                                          setDetailData({
                                            ...detailData,
                                            showcase: { ...detailData.showcase, bullets: newBullets },
                                          });
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm Bullet
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <LocaleInput
                                        label="Nút kêu gọi hành động - Văn bản"
                                        value={getLocaleValue(detailData.showcase, 'ctaText')}
                                        onChange={(value) => {
                                          const updated = setLocaleValue(detailData.showcase, 'ctaText', value);
                                          setDetailData({
                                            ...detailData,
                                            showcase: { ...detailData.showcase, ...updated },
                                          });
                                        }}
                                        placeholder="Liên hệ"
                                        defaultLocale={globalLocale}
                                        aiProvider={aiProvider}
                                      />
                                    </div>
                                    <div>
                                      <Label className="mb-2">Nút kêu gọi hành động - Đường dẫn</Label>
                                      <Input
                                        value={detailData.showcase?.ctaHref || ""}
                                        onChange={(e) => {
                                          setDetailData({
                                            ...detailData,
                                            showcase: { ...detailData.showcase, ctaHref: e.target.value },
                                          });
                                        }}
                                        placeholder="/contact"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="mb-2">Ảnh nền (Back)</Label>
                                      <ImageUpload
                                        currentImage={detailData.showcase?.overlay?.back?.src || detailData.showcase?.imageBack || ""}
                                        onImageSelect={(url: string) => {
                                          const overlay = detailData.showcase?.overlay || {};
                                          setDetailData({
                                            ...detailData,
                                            showcase: {
                                              ...detailData.showcase,
                                              overlay: {
                                                ...overlay,
                                                back: { ...overlay.back, src: url },
                                              },
                                              imageBack: url,
                                            },
                                          });
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label className="mb-2">Ảnh phía trước (Front)</Label>
                                      <ImageUpload
                                        currentImage={detailData.showcase?.overlay?.front?.src || detailData.showcase?.imageFront || ""}
                                        onImageSelect={(url: string) => {
                                          const overlay = detailData.showcase?.overlay || {};
                                          setDetailData({
                                            ...detailData,
                                            showcase: {
                                              ...detailData.showcase,
                                              overlay: {
                                                ...overlay,
                                                front: { ...overlay.front, src: url },
                                              },
                                              imageFront: url,
                                            },
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Numbered Sections Config */}
                            {detailData && detailData.numberedSections && (
                              <Card>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle>Khối 4 - Các section đánh số</CardTitle>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Mỗi section gồm số thứ tự, tiêu đề, ảnh minh họa và các đoạn mô tả chi tiết.
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <TranslationControls
                                        globalLocale={globalLocale}
                                        setGlobalLocale={setGlobalLocale}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          const newSections = [
                                            ...(detailData.numberedSections || []),
                                            {
                                              sectionNo: (detailData.numberedSections?.length || 0) + 1,
                                              no: (detailData.numberedSections?.length || 0) + 1,
                                              title: { vi: "", en: "", ja: "" },
                                              image: "",
                                              imageSide: "left",
                                              paragraphs: [],
                                            },
                                          ];
                                          setDetailData({ ...detailData, numberedSections: newSections });
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm Section
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  {detailData.numberedSections.map((section: any, index: number) => (
                                    <Card key={index}>
                                      <CardHeader>
                                        <div className="flex items-center justify-between">
                                          <CardTitle>Section {index + 1}</CardTitle>
                                          <div className="flex gap-2">
                                            {index > 0 && (
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  const newSections = [...detailData.numberedSections];
                                                  [newSections[index - 1], newSections[index]] = [
                                                    newSections[index],
                                                    newSections[index - 1],
                                                  ];
                                                  const normalizedSections = newSections.map((s: any, i: number) => ({
                                                    ...s,
                                                    sectionNo: i + 1,
                                                    no: i + 1,
                                                  }));
                                                  setDetailData({ ...detailData, numberedSections: normalizedSections });
                                                }}
                                              >
                                                <ChevronUp className="h-4 w-4" />
                                              </Button>
                                            )}
                                            {index < detailData.numberedSections.length - 1 && (
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  const newSections = [...detailData.numberedSections];
                                                  [newSections[index], newSections[index + 1]] = [
                                                    newSections[index + 1],
                                                    newSections[index],
                                                  ];
                                                  const normalizedSections = newSections.map((s: any, i: number) => ({
                                                    ...s,
                                                    sectionNo: i + 1,
                                                    no: i + 1,
                                                  }));
                                                  setDetailData({ ...detailData, numberedSections: normalizedSections });
                                                }}
                                              >
                                                <ChevronDown className="h-4 w-4" />
                                              </Button>
                                            )}
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                const newSections = detailData.numberedSections.filter(
                                                  (_: any, i: number) => i !== index
                                                );
                                                const normalizedSections = newSections.map((s: any, i: number) => ({
                                                  ...s,
                                                  sectionNo: i + 1,
                                                  no: i + 1,
                                                }));
                                                setDetailData({ ...detailData, numberedSections: normalizedSections });
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <LocaleInput
                                            label="Tiêu đề section"
                                            value={getLocaleValue(section, 'title')}
                                            onChange={(value) => {
                                              const newSections = [...detailData.numberedSections];
                                              const updatedSection = setLocaleValue(section, 'title', value);
                                              newSections[index] = updatedSection;
                                              setDetailData({ ...detailData, numberedSections: newSections });
                                            }}
                                            placeholder="Tiêu đề section"
                                            defaultLocale={globalLocale}
                                            aiProvider={aiProvider}
                                          />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <Label className="mb-2">Ảnh nền (Back)</Label>
                                            <ImageUpload
                                              currentImage={section.imageBack || section.overlayBackImage || section.overlay?.back?.src || section.image || ""}
                                              onImageSelect={(url: string) => {
                                                const newSections = [...detailData.numberedSections];
                                                const overlay = section.overlay || {};
                                                newSections[index] = {
                                                  ...section,
                                                  image: url, // Giữ tương thích
                                                  imageBack: url, // Backend cần field này
                                                  overlayBackImage: url, // Backend cũng hỗ trợ field này
                                                  overlay: {
                                                    ...overlay,
                                                    back: { ...overlay.back, src: url },
                                                  },
                                                };
                                                setDetailData({ ...detailData, numberedSections: newSections });
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <Label className="mb-2">Ảnh phía trước (Front)</Label>
                                            <ImageUpload
                                              currentImage={section.imageFront || section.overlayFrontImage || section.overlay?.front?.src || ""}
                                              onImageSelect={(url: string) => {
                                                const newSections = [...detailData.numberedSections];
                                                const overlay = section.overlay || {};
                                                newSections[index] = {
                                                  ...section,
                                                  imageFront: url, // Backend cần field này
                                                  overlayFrontImage: url, // Backend cũng hỗ trợ field này
                                                  overlay: {
                                                    ...overlay,
                                                    front: { ...overlay.front, src: url },
                                                  },
                                                };
                                                setDetailData({ ...detailData, numberedSections: newSections });
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="mb-2">Vị trí ảnh</Label>
                                          <Select
                                            value={section.imageSide || "left"}
                                            onValueChange={(value: "left" | "right") => {
                                              const newSections = [...detailData.numberedSections];
                                              newSections[index] = { ...section, imageSide: value };
                                              setDetailData({ ...detailData, numberedSections: newSections });
                                            }}
                                          >
                                            <SelectTrigger suppressHydrationWarning>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="left">Bên trái</SelectItem>
                                              <SelectItem value="right">Bên phải</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label className="mb-2">Các đoạn văn (Paragraphs)</Label>
                                          <div className="space-y-2">
                                            {(section.paragraphs || []).map((para: any, paraIndex: number) => {
                                              const paraObj =
                                                typeof para === "string"
                                                  ? { title: "", text: para }
                                                  : para || { title: "", text: "" };

                                              return (
                                                <div key={paraIndex} className="space-y-2 rounded-lg border border-gray-200 p-3">
                                                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                                    <div className="md:col-span-2">
                                                      <LocaleInput
                                                        label="Tiêu đề đoạn"
                                                        value={getLocaleValue(paraObj, 'title')}
                                                        onChange={(value) => {
                                                          const newSections = [...detailData.numberedSections];
                                                          const newParagraphs = [...(section.paragraphs || [])];
                                                          const updatedPara = setLocaleValue(paraObj, 'title', value);
                                                          newParagraphs[paraIndex] = updatedPara;
                                                          newSections[index] = { ...section, paragraphs: newParagraphs };
                                                          setDetailData({ ...detailData, numberedSections: newSections });
                                                        }}
                                                        placeholder="Ví dụ: Học sinh"
                                                        defaultLocale={globalLocale}
                                                        aiProvider={aiProvider}
                                                      />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                      <LocaleInput
                                                        label="Nội dung"
                                                        value={getLocaleValue(paraObj, 'text')}
                                                        onChange={(value) => {
                                                          const newSections = [...detailData.numberedSections];
                                                          const newParagraphs = [...(section.paragraphs || [])];
                                                          const updatedPara = setLocaleValue(paraObj, 'text', value);
                                                          newParagraphs[paraIndex] = updatedPara;
                                                          newSections[index] = { ...section, paragraphs: newParagraphs };
                                                          setDetailData({ ...detailData, numberedSections: newSections });
                                                        }}
                                                        multiline={true}
                                                        placeholder={`Đoạn ${paraIndex + 1}`}
                                                        defaultLocale={globalLocale}
                                                        aiProvider={aiProvider}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="flex justify-end">
                                                    <Button
                                                      type="button"
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={() => {
                                                        const newSections = [...detailData.numberedSections];
                                                        const newParagraphs = (section.paragraphs || []).filter(
                                                          (_: any, i: number) => i !== paraIndex
                                                        );
                                                        newSections[index] = { ...section, paragraphs: newParagraphs };
                                                        setDetailData({ ...detailData, numberedSections: newSections });
                                                      }}
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                            <Button
                                              type="button"
                                              variant="outline"
                                              onClick={() => {
                                                const newSections = [...detailData.numberedSections];
                                                const newParagraphs = [...(section.paragraphs || []), { 
                                                  title: { vi: "", en: "", ja: "" }, 
                                                  text: { vi: "", en: "", ja: "" } 
                                                }];
                                                newSections[index] = { ...section, paragraphs: newParagraphs };
                                                setDetailData({ ...detailData, numberedSections: newSections });
                                              }}
                                            >
                                              <Plus className="h-4 w-4 mr-2" />
                                              Thêm Paragraph
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </CardContent>
                              </Card>
                            )}

                            {/* Expand Section Config */}
                            {detailData && detailData.expand && (
                              <Card>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle>Khối 5 - Expand (Mở rộng lợi ích)</CardTitle>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Danh sách bullets nhấn mạnh lợi ích và một ảnh minh họa bên cạnh.
                                      </p>
                                    </div>
                                    <TranslationControls
                                      globalLocale={globalLocale}
                                      setGlobalLocale={setGlobalLocale}
                                    />
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <LocaleInput
                                      label="Tiêu đề expand"
                                      value={getLocaleValue(detailData.expand, 'title')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData.expand, 'title', value);
                                        setDetailData({
                                          ...detailData,
                                          expand: { ...detailData.expand, ...updated },
                                        });
                                      }}
                                      placeholder="Tiêu đề expand"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Danh sách điểm nổi bật (Bullets)</Label>
                                    <div className="space-y-2">
                                      {((detailData.expand?.bullets || detailData.expandBullets) || []).map(
                                        (bullet: any, index: number) => (
                                          <div key={index} className="flex gap-2">
                                            <LocaleInput
                                              label={`Bullet ${index + 1}`}
                                              value={getLocaleValue(bullet, '')}
                                              onChange={(value) => {
                                                const newBullets = [...((detailData.expand?.bullets || detailData.expandBullets) || [])];
                                                newBullets[index] = value;
                                                setDetailData({
                                                  ...detailData,
                                                  expand: { ...detailData.expand, bullets: newBullets },
                                                });
                                              }}
                                              placeholder={`Bullet ${index + 1}`}
                                              defaultLocale={globalLocale}
                                              aiProvider={aiProvider}
                                            />
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="icon"
                                              onClick={() => {
                                                const newBullets = ((detailData.expand?.bullets || detailData.expandBullets) || []).filter(
                                                  (_: any, i: number) => i !== index
                                                );
                                                setDetailData({
                                                  ...detailData,
                                                  expand: { ...detailData.expand, bullets: newBullets },
                                                });
                                              }}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        )
                                      )}
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          const currentBullets = (detailData.expand?.bullets || detailData.expandBullets) || [];
                                          const newBullets = [...currentBullets, { vi: "", en: "", ja: "" }];
                                          setDetailData({
                                            ...detailData,
                                            expand: { ...detailData.expand, bullets: newBullets },
                                          });
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm Bullet
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <LocaleInput
                                        label="Nút kêu gọi hành động - Văn bản"
                                        value={getLocaleValue(detailData.expand, 'ctaText')}
                                        onChange={(value) => {
                                          const updated = setLocaleValue(detailData.expand, 'ctaText', value);
                                          setDetailData({
                                            ...detailData,
                                            expand: { ...detailData.expand, ...updated },
                                          });
                                        }}
                                        placeholder="Liên hệ"
                                        defaultLocale={globalLocale}
                                        aiProvider={aiProvider}
                                      />
                                    </div>
                                    <div>
                                      <Label className="mb-2">Nút kêu gọi hành động - Đường dẫn</Label>
                                      <Input
                                        value={detailData.expand?.ctaHref || detailData.expandCtaHref || ""}
                                        onChange={(e) => {
                                          setDetailData({
                                            ...detailData,
                                            expand: { ...detailData.expand, ctaHref: e.target.value },
                                          });
                                        }}
                                        placeholder="/contact"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="mb-2">Ảnh minh họa</Label>
                                    <ImageUpload
                                      currentImage={detailData.expand?.image || detailData.expandImage || ""}
                                      onImageSelect={(url: string) => {
                                        setDetailData({
                                          ...detailData,
                                          expand: { ...detailData.expand, image: url },
                                          expandImage: url,
                                        });
                                      }}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </TabsContent>

                          <TabsContent value="content" className="space-y-4 mt-4">
                            {/* Hero Section Config */}
                            {detailData && (
                              <Card>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle>Khối 1 - Hero trang chi tiết</CardTitle>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Tiêu đề, đoạn mở đầu và ảnh lớn ở đầu trang chi tiết sản phẩm.
                                      </p>
                                    </div>
                                    <TranslationControls
                                      globalLocale={globalLocale}
                                      setGlobalLocale={setGlobalLocale}
                                    />
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <LocaleInput
                                      label="Dòng chữ phía trên (Meta Top)"
                                      value={getLocaleValue(detailData, 'metaTop')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData, 'metaTop', value);
                                        setDetailData(updated);
                                      }}
                                      placeholder="Ví dụ: Giải pháp phần mềm"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <LocaleInput
                                      label="Mô tả Hero"
                                      value={getLocaleValue(detailData, 'heroDescription')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData, 'heroDescription', value);
                                        setDetailData(updated);
                                      }}
                                      multiline={true}
                                      placeholder="Mô tả về sản phẩm..."
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Ảnh Hero</Label>
                                    <ImageUpload
                                      currentImage={detailData.heroImage || ""}
                                      onImageSelect={(url: string) => {
                                        setDetailData({ ...detailData, heroImage: url });
                                      }}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <LocaleInput
                                        label="Nút liên hệ - Văn bản"
                                        value={getLocaleValue(detailData, 'ctaContactText')}
                                        onChange={(value) => {
                                          const updated = setLocaleValue(detailData, 'ctaContactText', value);
                                          setDetailData(updated);
                                        }}
                                        placeholder="LIÊN HỆ NGAY"
                                        defaultLocale={globalLocale}
                                        aiProvider={aiProvider}
                                      />
                                    </div>
                                    <div>
                                      <Label className="mb-2">Nút liên hệ - Đường dẫn</Label>
                                      <Input
                                        value={detailData.ctaContactHref || ""}
                                        onChange={(e) => {
                                          setDetailData({ ...detailData, ctaContactHref: e.target.value });
                                        }}
                                        placeholder="/contact"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <LocaleInput
                                        label="Nút demo - Văn bản"
                                        value={getLocaleValue(detailData, 'ctaDemoText')}
                                        onChange={(value) => {
                                          const updated = setLocaleValue(detailData, 'ctaDemoText', value);
                                          setDetailData(updated);
                                        }}
                                        placeholder="DEMO HỆ THỐNG"
                                        defaultLocale={globalLocale}
                                        aiProvider={aiProvider}
                                      />
                                    </div>
                                    <div>
                                      <Label className="mb-2">Nút demo - Đường dẫn</Label>
                                      <Input
                                        value={detailData.ctaDemoHref || ""}
                                        onChange={(e) => {
                                          setDetailData({ ...detailData, ctaDemoHref: e.target.value });
                                        }}
                                        placeholder="/demo"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            <Card>
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle>Nội dung HTML</CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Sử dụng trình soạn thảo để tạo nội dung chi tiết sản phẩm với định dạng phong phú.
                                    </p>
                                  </div>
                                  <TranslationControls
                                    globalLocale={globalLocale}
                                    setGlobalLocale={setGlobalLocale}
                                  />
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold">
                                    Nội dung chi tiết ({globalLocale.toUpperCase()})
                                  </Label>
                                  <div className="border rounded-lg min-h-[360px]">
                                    <RichTextEditor
                                      key={`contentHtml-${globalLocale}-${contentHtmlEditorKey}`}
                                      value={typeof detailData?.contentHtml === 'string' 
                                        ? detailData.contentHtml 
                                        : getLocalizedText(detailData?.contentHtml || { vi: "", en: "", ja: "" }, globalLocale) || ""}
                                      onChange={(value) => {
                                        const currentContentHtml = detailData?.contentHtml || { vi: "", en: "", ja: "" };
                                        const updatedContentHtml = typeof currentContentHtml === 'string' 
                                          ? { vi: currentContentHtml, en: "", ja: "" }
                                          : { ...currentContentHtml, [globalLocale]: value };
                                        setDetailData({
                                          ...detailData,
                                          contentHtml: updatedContentHtml,
                                          contentMode: "content"
                                        });
                                        // Đảm bảo tab cũng được cập nhật khi thay đổi nội dung
                                        if (activeContentModeTab !== "content") {
                                          setActiveContentModeTab("content");
                                        }
                                      }}
                                      globalLocale={globalLocale}
                                      translateData={translateData}
                                      translatingAll={translatingAll}
                                      translateSourceLang={translateSourceLang}
                                      setTranslateSourceLang={setTranslateSourceLang}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Sử dụng trình soạn thảo để tạo nội dung sản phẩm với định dạng phong phú. Nội dung sẽ được lưu riêng cho từng ngôn ngữ.
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Gallery ảnh và cấu hình vị trí hiển thị */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <ImageIcon className="w-4 h-4 text-blue-600" />
                                  Thư viện ảnh (Gallery)
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <LocaleInput
                                      label="Tiêu đề bộ sưu tập (tuỳ chọn)"
                                      value={getLocaleValue(detailData, 'galleryTitle')}
                                      onChange={(value) => {
                                        const updated = setLocaleValue(detailData, 'galleryTitle', value);
                                        setDetailData(updated);
                                      }}
                                      placeholder="Nhập tiêu đề cho gallery (nếu cần)"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Chọn nhiều ảnh để hiển thị dạng gallery trong bài viết. Ảnh sẽ
                                    được render ở vị trí bạn chọn bên dưới (trên/cuối nội dung).
                                  </p>

                                  <div className="border rounded-lg p-3 bg-gray-50 space-y-3">
                                    <div className="text-xs font-medium text-gray-600">
                                      Thêm ảnh vào gallery
                                    </div>
                                    <ImageUpload
                                      key={galleryUploadKey}
                                      multiple
                                      currentImage={undefined}
                                      onImagesSelect={(urls) => {
                                        if (!urls || urls.length === 0) return;
                                        setDetailData({
                                          ...detailData,
                                          galleryImages: [
                                            ...(detailData?.galleryImages || []),
                                            ...urls,
                                          ],
                                        });
                                        // Reset lại component upload để người dùng chọn ảnh tiếp theo nhanh
                                        setGalleryUploadKey((prev) => prev + 1);
                                      }}
                                    />
                                    <p className="text-[11px] text-gray-500">
                                      Sau khi chọn, ảnh sẽ được thêm vào danh sách bên dưới. Bạn có
                                      thể xoá từng ảnh nếu không cần.
                                    </p>

                                    {detailData?.galleryImages && detailData.galleryImages.length > 0 ? (
                                      <div className="flex flex-wrap gap-3 mt-2">
                                        {detailData.galleryImages.map((img: string, idx: number) => (
                                          <div
                                            key={idx}
                                            className="relative w-28 h-20 rounded-md overflow-hidden bg-white border border-gray-200 shadow-sm"
                                          >
                                            <img
                                              src={
                                                img.startsWith("/")
                                                  ? buildUrl(img)
                                                  : img
                                              }
                                              alt={`Gallery ${idx + 1}`}
                                              className="w-full h-full object-cover"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setDetailData({
                                                  ...detailData,
                                                  galleryImages: detailData.galleryImages.filter(
                                                    (_: string, i: number) => i !== idx,
                                                  ),
                                                })
                                              }
                                              className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] bg-red-600 text-white rounded opacity-0 hover:opacity-100 transition"
                                              title="Xoá ảnh"
                                            >
                                              Xoá
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-gray-400 mt-1">
                                        Chưa có ảnh nào trong gallery. Chọn ảnh để thêm.
                                      </p>
                                    )}
                                  </div>

                                  <div className="mt-3 space-y-2">
                                    <Label className="text-sm font-semibold">
                                      Vị trí hiển thị gallery trong bài viết
                                    </Label>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                                      <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name="gallery-position"
                                          value="top"
                                          checked={detailData?.galleryPosition === "top"}
                                          onChange={() =>
                                            setDetailData({
                                              ...detailData,
                                              galleryPosition: "top",
                                            })
                                          }
                                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span>Trên cùng bài viết</span>
                                      </label>
                                      <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name="gallery-position"
                                          value="bottom"
                                          checked={detailData?.galleryPosition === "bottom"}
                                          onChange={() =>
                                            setDetailData({
                                              ...detailData,
                                              galleryPosition: "bottom",
                                            })
                                          }
                                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span>Cuối bài viết</span>
                                      </label>
                                    </div>
                                    <p className="text-[11px] text-gray-500">
                                      Phần hiển thị thực tế bạn xử lý ở component trang public
                                      (chèn gallery tương ứng với vị trí đã chọn).
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Cấu hình hiển thị chi tiết bài viết */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Cấu hình hiển thị chi tiết bài viết</CardTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                  Các tuỳ chọn này chỉ ảnh hưởng tới cách hiển thị bài viết trên
                                  trang public (không ảnh hưởng dữ liệu SEO).
                                </p>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        Hiển thị mục lục (Table of Contents)
                                      </p>
                                      <p className="text-[11px] text-gray-500">
                                        Tự động tạo mục lục từ các heading (H2, H3) trong bài viết.
                                      </p>
                                    </div>
                                    <Switch
                                      checked={detailData?.showTableOfContents !== false}
                                      onCheckedChange={(checked) =>
                                        setDetailData({
                                          ...detailData,
                                          showTableOfContents: checked,
                                        })
                                      }
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        Nút chia sẻ mạng xã hội
                                      </p>
                                      <p className="text-[11px] text-gray-500">
                                        Hiển thị nút chia sẻ Facebook, LinkedIn… ở đầu/cuối bài viết.
                                      </p>
                                    </div>
                                    <Switch
                                      checked={detailData?.enableShareButtons !== false}
                                      onCheckedChange={(checked) =>
                                        setDetailData({
                                          ...detailData,
                                          enableShareButtons: checked,
                                        })
                                      }
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        Hiển thị box tác giả
                                      </p>
                                      <p className="text-[11px] text-gray-500">
                                        Hiển thị thông tin tác giả, avatar tại cuối bài viết.
                                      </p>
                                    </div>
                                    <Switch
                                      checked={detailData?.showAuthorBox !== false}
                                      onCheckedChange={(checked) =>
                                        setDetailData({
                                          ...detailData,
                                          showAuthorBox: checked,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preview" className="space-y-4 mt-4">
                {loadingDetail ? (
                  <div className="text-center py-8 text-gray-900">Đang tải...</div>
                ) : detailData ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview - Trang chi tiết sản phẩm</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {detailData?.contentMode === "content"
                          ? "Xem trước nội dung HTML"
                          : "Xem trước các widget sections"}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white">
                        {/* Hero Section - Hiển thị ở cả 2 chế độ */}
                        <section className="w-full">
                          <div className="bg-[linear-gradient(31deg,#0870B4_51.21%,#2EABE2_97.73%)]">
                            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[243px] pt-[120px] sm:pt-[160px] lg:pt-[194.5px] pb-[80px] sm:pb-[110px] lg:pb-[127.5px]">
                              <div className="flex flex-row items-center justify-between gap-[98px]">
                                <div className="text-white flex flex-col items-start gap-[29px] flex-shrink-0 w-[486px]">
                                  {detailData.metaTop && (
                                    <div
                                      className="text-white uppercase font-medium text-[16px]"
                                      style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                                    >
                                      {typeof detailData.metaTop === 'string' ? detailData.metaTop : getLocalizedText(detailData.metaTop, globalLocale)}
                                    </div>
                                  )}
                                  <h1
                                    className="text-[56px] leading-[normal] font-extrabold w-[543px]"
                                    style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                                  >
                                    {typeof formData.name === 'string' ? formData.name : getLocalizedText(formData.name, globalLocale)}
                                  </h1>
                                  {detailData.heroDescription && (
                                    <p className="text-white/85 text-[14px] leading-[22px]">
                                      {typeof detailData.heroDescription === 'string' ? detailData.heroDescription : getLocalizedText(detailData.heroDescription, globalLocale)}
                                    </p>
                                  )}
                                  <div className="flex flex-row items-center gap-4">
                                    {detailData.ctaContactText && (
                                      <a
                                        href={detailData.ctaContactHref || "#"}
                                        className="h-[48px] px-6 rounded-xl bg-white text-[#0B78B8] font-semibold text-[16px] inline-flex items-center gap-2 hover:bg-white/90 transition"
                                      >
                                        {typeof detailData.ctaContactText === 'string' ? detailData.ctaContactText : getLocalizedText(detailData.ctaContactText, globalLocale)} <ArrowRight size={18} />
                                      </a>
                                    )}
                                    {detailData.ctaDemoText && (
                                      <a
                                        href={detailData.ctaDemoHref || "#"}
                                        className="h-[48px] px-6 rounded-xl border border-white/80 text-white font-semibold text-[16px] inline-flex items-center gap-3 hover:bg-white/10 transition"
                                      >
                                        {typeof detailData.ctaDemoText === 'string' ? detailData.ctaDemoText : getLocalizedText(detailData.ctaDemoText, globalLocale)}
                                        <span className="w-7 h-7 rounded-full border border-white/70 flex items-center justify-center">
                                          <Play size={14} className="ml-[1px]" />
                                        </span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                                {detailData.heroImage && (
                                  <div className="flex-shrink-0 flex justify-start">
                                    <div className="w-[701px] h-[511px] rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden">
                                      <img
                                        src={detailData.heroImage}
                                        alt={typeof formData.name === 'string' ? formData.name : getLocalizedText(formData.name, globalLocale)}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* Hiển thị theo chế độ: Content HTML hoặc Widget */}
                        {detailData?.contentMode === "content" && detailData?.contentHtml ? (
                          // Chế độ Content: Hiển thị HTML preview
                          <section className="w-full bg-white">
                            <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px]">
                              <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ 
                                  __html: typeof detailData.contentHtml === 'string' 
                                    ? detailData.contentHtml 
                                    : getLocalizedText(detailData.contentHtml, globalLocale) 
                                }}
                              />
                            </div>
                          </section>
                        ) : (
                          // Chế độ Widget: Hiển thị các sections như bình thường
                          <>
                            {/* Overview Section */}
                            {(detailData.overviewKicker || detailData.overviewTitle || (detailData.overviewCards && detailData.overviewCards.length > 0)) && (
                              <section className="w-full">
                                <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px] flex justify-center">
                                  <div className="flex flex-col items-start gap-[60px] w-full lg:w-[1340px]">
                                    <div className="w-full text-center space-y-4">
                                      {detailData.overviewKicker && (
                                        <div className="w-full text-center text-[#1D8FCF] uppercase font-plus-jakarta text-[15px] font-medium leading-normal tracking-widest [font-feature-settings:'liga'_off,'clig'_off]">
                                          {typeof detailData.overviewKicker === 'string' ? detailData.overviewKicker : getLocalizedText(detailData.overviewKicker, globalLocale)}
                                        </div>
                                      )}
                                      {detailData.overviewTitle && (
                                        <h2 className="mx-auto max-w-[840px] text-center text-[#0F172A] font-plus-jakarta text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-normal [font-feature-settings:'liga'_off,'clig'_off]">
                                          {typeof detailData.overviewTitle === 'string' ? detailData.overviewTitle : getLocalizedText(detailData.overviewTitle, globalLocale)}
                                        </h2>
                                      )}
                                    </div>
                                    {detailData.overviewCards && detailData.overviewCards.length > 0 && (
                                      <div className="flex justify-center items-start content-start gap-[18px] flex-wrap w-full lg:w-[1340px]">
                                        {detailData.overviewCards.map((card: any, idx: number) => (
                                          <div
                                            key={idx}
                                            className="flex flex-col items-center gap-3 w-full max-w-[433px] lg:w-[433px] px-6 py-8 rounded-xl border border-white"
                                            style={{
                                              background: "linear-gradient(237deg, rgba(128, 192, 228, 0.10) 7%, rgba(29, 143, 207, 0.10) 71.94%)",
                                            }}
                                          >
                                            {card.step && (
                                              <div className="flex justify-center mb-3">
                                                <div className="w-12 h-12 rounded-full bg-[#1D8FCF] text-white flex items-center justify-center font-bold">
                                                  {card.step}
                                                </div>
                                              </div>
                                            )}
                                            {card.title && (
                                              <div className="text-[#0B78B8] font-semibold text-center">
                                                {typeof card.title === 'string' ? card.title : getLocalizedText(card.title, globalLocale)}
                                              </div>
                                            )}
                                            {(card.description || card.desc) && (
                                              <div className="text-gray-600 text-sm leading-relaxed text-center">
                                                {typeof (card.description || card.desc) === 'string' 
                                                  ? (card.description || card.desc) 
                                                  : getLocalizedText(card.description || card.desc, globalLocale)}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </section>
                            )}

                            {/* Showcase Section */}
                            {detailData.showcase && (
                              <section className="w-full bg-white">
                                <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px]">
                                  <div className="flex flex-row items-center justify-center gap-[90px]">
                                    {(detailData.showcase.overlay?.back?.src || detailData.showcase.imageBack) && (
                                      <div className="relative flex-shrink-0 flex justify-start">
                                        <div className="relative w-[701px] h-[511px]">
                                          <div className="rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden">
                                            <img
                                              src={detailData.showcase.overlay?.back?.src || detailData.showcase.imageBack}
                                              alt={detailData.showcase.title}
                                              className="w-full h-full object-contain"
                                            />
                                          </div>
                                          {detailData.showcase.overlay?.front?.src && (
                                            <div className="absolute left-[183.5px] bottom-0 rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden w-[400px] h-[300px]">
                                              <img
                                                src={detailData.showcase.overlay.front.src}
                                                alt={detailData.showcase.title}
                                                className="w-full h-full object-contain"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex flex-shrink-0 w-[549px] flex-col items-start gap-6">
                                      {detailData.showcase.title && (
                                        <h3 className="text-gray-900 text-2xl font-bold">
                                          {typeof detailData.showcase.title === 'string' ? detailData.showcase.title : getLocalizedText(detailData.showcase.title, globalLocale)}
                                        </h3>
                                      )}
                                      {detailData.showcase.desc && (
                                        <p className="text-gray-600 leading-relaxed">
                                          {typeof detailData.showcase.desc === 'string' ? detailData.showcase.desc : getLocalizedText(detailData.showcase.desc, globalLocale)}
                                        </p>
                                      )}
                                      {detailData.showcase.bullets && detailData.showcase.bullets.length > 0 && (
                                        <div className="space-y-3">
                                          {detailData.showcase.bullets.map((b: any, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                              <CheckCircle2 size={18} className="text-[#0B78B8] mt-0.5" />
                                              <span className="text-gray-700">
                                                {typeof b === 'string' ? b : getLocalizedText(b, globalLocale)}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {detailData.showcase.ctaHref && detailData.showcase.ctaText && (
                                        <a
                                          href={detailData.showcase.ctaHref}
                                          className="inline-flex items-center gap-2 h-[42px] px-5 rounded-lg bg-[#2EABE2] text-white font-semibold hover:opacity-90 transition"
                                        >
                                          {typeof detailData.showcase.ctaText === 'string' ? detailData.showcase.ctaText : getLocalizedText(detailData.showcase.ctaText, globalLocale)} <ArrowRight size={18} />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </section>
                            )}

                            {/* Numbered Sections */}
                            {detailData.numberedSections && detailData.numberedSections.length > 0 && (
                              <section className="w-full bg-white">
                                <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px] space-y-[90px]">
                                  {detailData.numberedSections
                                    .sort((a: any, b: any) => (a.sectionNo || a.no || 0) - (b.sectionNo || b.no || 0))
                                    .map((section: any, index: number) => (
                                      <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                        <div className={section.imageSide === "left" ? "order-1" : "order-2 lg:order-2"}>
                                          {section.image && (
                                            <div className="w-full flex justify-center lg:justify-start">
                                              <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                                                <div className="w-[701px] h-[511px] rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden">
                                                  <img
                                                    src={section.overlay?.back?.src || section.image}
                                                    alt={section.title}
                                                    className="w-full h-full object-cover"
                                                  />
                                                </div>
                                                {section.overlay?.front?.src && (
                                                  <div className="absolute left-[183.5px] bottom-0 rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden w-[400px] h-[300px]">
                                                    <img
                                                      src={section.overlay.front.src}
                                                      alt={section.title}
                                                      className="w-full h-full object-cover"
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className={section.imageSide === "left" ? "order-2" : "order-1 lg:order-1"}>
                                          {section.title && (
                                            <div className="text-gray-900 text-xl md:text-2xl font-bold mb-4">
                                              {(section.sectionNo || section.no || index + 1)}. {typeof section.title === 'string' ? section.title : getLocalizedText(section.title, globalLocale)}
                                            </div>
                                          )}
                                          {section.paragraphs && section.paragraphs.length > 0 && (
                                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                              {section.paragraphs.map((p: any, i: number) => {
                                                const paraText = typeof p === 'string' ? p : (p?.text ? (typeof p.text === 'string' ? p.text : getLocalizedText(p.text, globalLocale)) : '');
                                                const paraTitle = p?.title ? (typeof p.title === 'string' ? p.title : getLocalizedText(p.title, globalLocale)) : '';
                                                return (
                                                  <div key={i}>
                                                    {paraTitle && <p className="font-semibold mb-1">{paraTitle}</p>}
                                                    <p>{paraText}</p>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </section>
                            )}

                            {/* Expand Section */}
                            {detailData.expand && (
                              <section className="w-full bg-white">
                                <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px]">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-5">
                                      {(detailData.expand.title || detailData.expandTitle) && (
                                        <h3 className="text-gray-900 text-2xl font-bold">
                                          {typeof (detailData.expand.title || detailData.expandTitle) === 'string' 
                                            ? (detailData.expand.title || detailData.expandTitle) 
                                            : getLocalizedText(detailData.expand.title || detailData.expandTitle, globalLocale)}
                                        </h3>
                                      )}
                                      {((detailData.expand.bullets || detailData.expandBullets) || []).length > 0 && (
                                        <div className="space-y-3">
                                          {(detailData.expand.bullets || detailData.expandBullets || []).map((b: any, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                              <CheckCircle2 size={18} className="text-[#0B78B8] mt-0.5" />
                                              <span className="text-gray-700">
                                                {typeof b === 'string' ? b : getLocalizedText(b, globalLocale)}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {((detailData.expand.ctaHref || detailData.expandCtaHref) && (detailData.expand.ctaText || detailData.expandCtaText)) && (
                                        <a
                                          href={detailData.expand.ctaHref || detailData.expandCtaHref}
                                          className="inline-flex items-center gap-2 h-[44px] px-5 rounded-lg bg-[#2EABE2] text-white font-semibold hover:opacity-90 transition"
                                        >
                                          {typeof (detailData.expand.ctaText || detailData.expandCtaText) === 'string' 
                                            ? (detailData.expand.ctaText || detailData.expandCtaText) 
                                            : getLocalizedText(detailData.expand.ctaText || detailData.expandCtaText, globalLocale)} <ArrowRight size={18} />
                                        </a>
                                      )}
                                    </div>
                                    {(detailData.expand.image || detailData.expandImage) && (
                                      <div>
                                        <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_14px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                                          <div className="relative aspect-[16/9]">
                                            <img
                                              src={detailData.expand.image || detailData.expandImage}
                                              alt={typeof (detailData.expand.title || detailData.expandTitle) === 'string' 
                                                ? (detailData.expand.title || detailData.expandTitle) 
                                                : getLocalizedText(detailData.expand.title || detailData.expandTitle, globalLocale)}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </section>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có dữ liệu chi tiết. Vui lòng cấu hình ở tab "Cấu hình".
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        )}
      </Tabs>
    </form>
  );
}
