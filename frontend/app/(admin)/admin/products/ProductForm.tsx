"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, X, ArrowRight, Play, CheckCircle2, ChevronUp, ChevronDown, Trash2, Link as LinkIcon, Search as SearchIcon, Sparkles, Image as ImageIcon } from "lucide-react";
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
import { generateSlug } from "@/lib/date";
import { buildUrl } from "@/lib/api/base";

interface ProductFormData {
  categoryId: number | "";
  name: string;
  slug: string;
  tagline: string;
  meta: string;
  description: string;
  image: string;
  gradient: string;
  pricing: string;
  badge: string;
  statsUsers: string;
  statsRating: number;
  statsDeploy: string;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  features: string[];
  demoLink: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
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

export default function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const router = useRouter();
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

  const [formData, setFormData] = useState<ProductFormData>({
    categoryId: "",
    name: "",
    slug: "",
    tagline: "",
    meta: "",
    description: "",
    image: "",
    gradient: GRADIENT_OPTIONS[0].value,
    pricing: "Liên hệ",
    badge: "",
    statsUsers: "",
    statsRating: 0,
    statsDeploy: "",
    sortOrder: 0,
    isFeatured: false,
    isActive: true,
    features: [],
    demoLink: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: ""
  });

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
      const autoSlug = generateSlug(formData.name);
      if (autoSlug && autoSlug !== formData.slug) {
        setFormData(prev => ({ ...prev, slug: autoSlug }));
      }
    }
  }, [formData.name, slugManuallyEdited, productId, formData.slug]);

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
        // If 304 or null, use empty data structure
        setDetailData({
          contentMode: "config",
          contentHtml: "",
          metaTop: "",
          heroDescription: "",
          heroImage: "",
          ctaContactText: "",
          ctaContactHref: "",
          ctaDemoText: "",
          ctaDemoHref: "",
          overviewKicker: "",
          overviewTitle: "",
          overviewCards: [],
          showcase: {
            title: "",
            desc: "",
            bullets: [],
            ctaText: "",
            ctaHref: "",
            imageBack: "",
            imageFront: "",
          },
          numberedSections: [],
          expand: {
            title: "",
            bullets: [],
            ctaText: "",
            ctaHref: "",
            image: "",
          },
          galleryImages: [],
          galleryPosition: "top",
          galleryTitle: "",
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
          contentHtml: "",
          metaTop: "",
          heroDescription: "",
          heroImage: "",
          ctaContactText: "",
          ctaContactHref: "",
          ctaDemoText: "",
          ctaDemoHref: "",
          overviewKicker: "",
          overviewTitle: "",
          overviewCards: [],
          showcase: {
            title: "",
            desc: "",
            bullets: [],
            ctaText: "",
            ctaHref: "",
            imageBack: "",
            imageFront: "",
          },
          numberedSections: [],
          expand: {
            title: "",
            bullets: [],
            ctaText: "",
            ctaHref: "",
            image: "",
          },
          galleryImages: [],
          galleryPosition: "top",
          galleryTitle: "",
          showTableOfContents: true,
          enableShareButtons: true,
          showAuthorBox: true,
        });
        setActiveContentModeTab("widget");
      } else {
        // Đảm bảo tất cả các field đều có giá trị mặc định
        setDetailData({
          contentMode: response.data.contentMode || "config",
          contentHtml: response.data.contentHtml || "",
          metaTop: response.data.metaTop || "",
          heroDescription: response.data.heroDescription || "",
          heroImage: response.data.heroImage || "",
          ctaContactText: response.data.ctaContactText || "",
          ctaContactHref: response.data.ctaContactHref || "",
          ctaDemoText: response.data.ctaDemoText || "",
          ctaDemoHref: response.data.ctaDemoHref || "",
          overviewKicker: response.data.overviewKicker || "",
          overviewTitle: response.data.overviewTitle || "",
          overviewCards: response.data.overviewCards || [],
          showcase: {
            title: response.data.showcase?.title || "",
            desc: response.data.showcase?.desc || "",
            bullets: response.data.showcase?.bullets || [],
            ctaText: response.data.showcase?.ctaText || "",
            ctaHref: response.data.showcase?.ctaHref || "",
            imageBack: response.data.showcase?.imageBack || "",
            imageFront: response.data.showcase?.imageFront || "",
          },
          numberedSections: response.data.numberedSections || [],
          expand: {
            title: response.data.expand?.title || "",
            bullets: response.data.expand?.bullets || [],
            ctaText: response.data.expand?.ctaText || "",
            ctaHref: response.data.expand?.ctaHref || "",
            image: response.data.expand?.image || "",
          },
          galleryImages: response.data.galleryImages || [],
          galleryPosition: response.data.galleryPosition || "top",
          galleryTitle: response.data.galleryTitle || "",
          showTableOfContents: response.data.showTableOfContents !== false,
          enableShareButtons: response.data.enableShareButtons !== false,
          showAuthorBox: response.data.showAuthorBox !== false,
        });
        setActiveContentModeTab(response.data.contentMode === "content" ? "content" : "widget");
      }
    } catch (error: any) {
      // Silently fail
      // Nếu có lỗi, tạo empty data
      setDetailData({
        contentMode: "config",
        contentHtml: "",
        metaTop: "",
        heroDescription: "",
        heroImage: "",
        overviewKicker: "",
        overviewTitle: "",
        overviewCards: [],
        showcase: {
          title: "",
          desc: "",
          bullets: [],
          ctaText: "",
          ctaHref: "",
          imageBack: "",
          imageFront: "",
        },
        numberedSections: [],
        expand: {
          title: "",
          bullets: [],
          ctaText: "",
          ctaHref: "",
          image: "",
        },
        galleryImages: [],
        galleryPosition: "top",
        galleryTitle: "",
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
        // Nếu đang edit và đã có slug từ DB, không tự động generate nữa
        const hasSlug = !!(data.data.slug);
        setSlugManuallyEdited(hasSlug);
        setFormData({
          categoryId: data.data.categoryId || "",
          name: data.data.name || "",
          slug: data.data.slug || "",
          tagline: data.data.tagline || "",
          meta: data.data.meta || "",
          description: data.data.description || "",
          image: data.data.image || "",
          gradient: data.data.gradient || GRADIENT_OPTIONS[0].value,
          pricing: data.data.pricing || "Liên hệ",
          badge: data.data.badge || "",
          statsUsers: data.data.statsUsers || "",
          statsRating: data.data.statsRating || 0,
          statsDeploy: data.data.statsDeploy || "",
          sortOrder: data.data.sortOrder || 0,
          isFeatured: data.data.isFeatured || false,
          isActive: data.data.isActive !== undefined ? data.data.isActive : true,
          features: data.data.features || [],
          demoLink: data.data.demoLink || "",
          seoTitle: data.data.seoTitle || "",
          seoDescription: data.data.seoDescription || "",
          seoKeywords: data.data.seoKeywords || ""
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

    if (!formData.name.trim()) {
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
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
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
        <div className="flex gap-2">
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
              <CardTitle>Thông tin sản phẩm</CardTitle>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.isActive && c.slug !== "all")
                        .map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                    required
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
                  <Label htmlFor="tagline" className="text-gray-900">Dòng mô tả ngắn (Tagline)</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Ví dụ: Tuyển sinh trực tuyến minh bạch, đúng quy chế"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta" className="text-gray-900">Thông tin meta</Label>
                  <Input
                    id="meta"
                    value={formData.meta}
                    onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                    placeholder="Ví dụ: Sản phẩm • Tin công nghệ • 07/08/2025"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricing" className="text-gray-900">Giá</Label>
                  <Input
                    id="pricing"
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    placeholder="Ví dụ: Liên hệ"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge" className="text-gray-900">Nhãn hiển thị (Badge)</Label>
                  <Input
                    id="badge"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ví dụ: Giải pháp nổi bật"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradient" className="text-gray-900">Màu nền gradient</Label>
                  <Select
                    value={formData.gradient}
                    onValueChange={(value) => setFormData({ ...formData, gradient: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={4}
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
                  <Label htmlFor="statsUsers" className="text-gray-900">Số lượng người dùng</Label>
                  <Input
                    id="statsUsers"
                    value={formData.statsUsers}
                    onChange={(e) => setFormData({ ...formData, statsUsers: e.target.value })}
                    placeholder="Ví dụ: Nhiều trường học áp dụng"
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
                  <Label htmlFor="statsDeploy" className="text-gray-900">Hình thức triển khai</Label>
                  <Input
                    id="statsDeploy"
                    value={formData.statsDeploy}
                    onChange={(e) => setFormData({ ...formData, statsDeploy: e.target.value })}
                    placeholder="Ví dụ: Triển khai Cloud/On-premise"
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
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Tính năng ${index + 1}`}
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
                        if (formData.name) {
                          const autoTitle =
                            formData.name.length > 60
                              ? formData.name.substring(0, 57) + "..."
                              : formData.name;
                          setFormData({ ...formData, seoTitle: autoTitle });
                        }
                      }}
                      disabled={!formData.name}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Tự động
                    </Button>
                  </div>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, seoTitle: e.target.value })
                    }
                    placeholder={
                      formData.name
                        ? `Tự động: ${formData.name.substring(0, 40)}...`
                        : "Nhập tiêu đề SEO..."
                    }
                    maxLength={60}
                    className="text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Khuyến nghị: 50-60 ký tự</p>
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded ${formData.seoTitle.length > 60
                          ? "text-red-600 bg-red-50"
                          : formData.seoTitle.length >= 50 &&
                            formData.seoTitle.length <= 60
                            ? "text-green-600 bg-green-50"
                            : formData.seoTitle.length > 0
                              ? "text-yellow-600 bg-yellow-50"
                              : "text-gray-400 bg-gray-50"
                        }`}
                    >
                      {formData.seoTitle.length}/60
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
                        if (formData.description) {
                          const autoDesc =
                            formData.description.length > 160
                              ? formData.description.substring(0, 157) + "..."
                              : formData.description;
                          setFormData({
                            ...formData,
                            seoDescription: autoDesc,
                          });
                        }
                      }}
                      disabled={!formData.description}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Tự động
                    </Button>
                  </div>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seoDescription: e.target.value,
                      })
                    }
                    placeholder={
                      formData.description
                        ? `Tự động: ${formData.description.substring(0, 60)}...`
                        : "Nhập mô tả SEO..."
                    }
                    rows={3}
                    maxLength={160}
                    className="resize-none text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Khuyến nghị: 150-160 ký tự
                    </p>
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded ${formData.seoDescription.length > 160
                          ? "text-red-600 bg-red-50"
                          : formData.seoDescription.length >= 150 &&
                            formData.seoDescription.length <= 160
                            ? "text-green-600 bg-green-50"
                            : formData.seoDescription.length > 0
                              ? "text-yellow-600 bg-yellow-50"
                              : "text-gray-400 bg-gray-50"
                        }`}
                    >
                      {formData.seoDescription.length}/160
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeywords" className="text-sm font-semibold">
                    Từ khóa SEO
                  </Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) =>
                      setFormData({ ...formData, seoKeywords: e.target.value })
                    }
                    placeholder="từ khóa 1, từ khóa 2..."
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
                        {formData.seoTitle || formData.name || "Tên sản phẩm"}
                      </div>
                      <div className="text-xs text-green-700">
                        {formData.slug ? `/products/${formData.slug}` : "/products/..."}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {formData.seoDescription ||
                          formData.description ||
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
                              <SelectTrigger>
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
                                  <CardTitle>Khối 1 - Hero trang chi tiết</CardTitle>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Tiêu đề, đoạn mở đầu và ảnh lớn ở đầu trang chi tiết sản phẩm.
                                  </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label className="mb-2">Dòng chữ phía trên (Meta Top)</Label>
                                    <Input
                                      value={detailData.metaTop || ""}
                                      onChange={(e) => {
                                        setDetailData({ ...detailData, metaTop: e.target.value });
                                      }}
                                      placeholder="Ví dụ: Giải pháp phần mềm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Mô tả Hero</Label>
                                    <Textarea
                                      value={detailData.heroDescription || ""}
                                      onChange={(e) => {
                                        setDetailData({ ...detailData, heroDescription: e.target.value });
                                      }}
                                      rows={4}
                                      placeholder="Mô tả về sản phẩm..."
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
                                      <Label className="mb-2">Nút liên hệ - Văn bản</Label>
                                      <Input
                                        value={detailData.ctaContactText || ""}
                                        onChange={(e) => {
                                          setDetailData({ ...detailData, ctaContactText: e.target.value });
                                        }}
                                        placeholder="LIÊN HỆ NGAY"
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
                                      <Label className="mb-2">Nút demo - Văn bản</Label>
                                      <Input
                                        value={detailData.ctaDemoText || ""}
                                        onChange={(e) => {
                                          setDetailData({ ...detailData, ctaDemoText: e.target.value });
                                        }}
                                        placeholder="DEMO HỆ THỐNG"
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
                                  <CardTitle>Khối 2 - Tổng quan (Overview)</CardTitle>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Kicker, tiêu đề và các card mô tả các bước / tính năng chính.
                                  </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label className="mb-2">Dòng chữ nhỏ phía trên (Kicker)</Label>
                                    <Input
                                      value={detailData.overviewKicker || ""}
                                      onChange={(e) => {
                                        setDetailData({ ...detailData, overviewKicker: e.target.value });
                                      }}
                                      placeholder="Ví dụ: Tổng quan"
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Tiêu đề chính</Label>
                                    <Input
                                      value={detailData.overviewTitle || ""}
                                      onChange={(e) => {
                                        setDetailData({ ...detailData, overviewTitle: e.target.value });
                                      }}
                                      placeholder="Tiêu đề overview"
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
                                              <Label className="mb-2">Tiêu đề thẻ</Label>
                                              <Input
                                                value={card.title || ""}
                                                onChange={(e) => {
                                                  const newCards = [...(detailData.overviewCards || [])];
                                                  newCards[index] = { ...card, title: e.target.value };
                                                  setDetailData({ ...detailData, overviewCards: newCards });
                                                }}
                                                placeholder="Tiêu đề card"
                                              />
                                            </div>
                                            <div>
                                              <Label className="mb-2">Mô tả thẻ</Label>
                                              <Textarea
                                                value={card.description || card.desc || ""}
                                                onChange={(e) => {
                                                  const newCards = [...(detailData.overviewCards || [])];
                                                  newCards[index] = { ...card, description: e.target.value, desc: e.target.value };
                                                  setDetailData({ ...detailData, overviewCards: newCards });
                                                }}
                                                rows={2}
                                                placeholder="Mô tả card"
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
                                            { step: (detailData.overviewCards?.length || 0) + 1, title: "", description: "", desc: "" },
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
                                  <CardTitle>Khối 3 - Showcase màn hình</CardTitle>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Bố cục 2 cột: bên trái là ảnh màn hình, bên phải là tiêu đề, mô tả và bullets.
                                  </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label className="mb-2">Tiêu đề showcase</Label>
                                    <Input
                                      value={detailData.showcase?.title || ""}
                                      onChange={(e) => {
                                        setDetailData({
                                          ...detailData,
                                          showcase: { ...detailData.showcase, title: e.target.value },
                                        });
                                      }}
                                      placeholder="Tiêu đề showcase"
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Mô tả showcase</Label>
                                    <Textarea
                                      value={detailData.showcase?.desc || ""}
                                      onChange={(e) => {
                                        setDetailData({
                                          ...detailData,
                                          showcase: { ...detailData.showcase, desc: e.target.value },
                                        });
                                      }}
                                      rows={3}
                                      placeholder="Mô tả showcase"
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Danh sách điểm nổi bật (Bullets)</Label>
                                    <div className="space-y-2">
                                      {(detailData.showcase?.bullets || []).map((bullet: string, index: number) => (
                                        <div key={index} className="flex gap-2">
                                          <Input
                                            value={bullet}
                                            onChange={(e) => {
                                              const newBullets = [...(detailData.showcase?.bullets || [])];
                                              newBullets[index] = e.target.value;
                                              setDetailData({
                                                ...detailData,
                                                showcase: { ...detailData.showcase, bullets: newBullets },
                                              });
                                            }}
                                            placeholder={`Bullet ${index + 1}`}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              const newBullets = (detailData.showcase?.bullets || []).filter(
                                                (_: string, i: number) => i !== index
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
                                          const newBullets = [...(detailData.showcase?.bullets || []), ""];
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
                                      <Label className="mb-2">Nút kêu gọi hành động - Văn bản</Label>
                                      <Input
                                        value={detailData.showcase?.ctaText || ""}
                                        onChange={(e) => {
                                          setDetailData({
                                            ...detailData,
                                            showcase: { ...detailData.showcase, ctaText: e.target.value },
                                          });
                                        }}
                                        placeholder="Liên hệ"
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
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        const newSections = [
                                          ...(detailData.numberedSections || []),
                                          {
                                            sectionNo: (detailData.numberedSections?.length || 0) + 1,
                                            no: (detailData.numberedSections?.length || 0) + 1,
                                            title: "",
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
                                          <Label className="mb-2">Tiêu đề section</Label>
                                          <Input
                                            value={section.title || ""}
                                            onChange={(e) => {
                                              const newSections = [...detailData.numberedSections];
                                              newSections[index] = { ...section, title: e.target.value };
                                              setDetailData({ ...detailData, numberedSections: newSections });
                                            }}
                                            placeholder="Tiêu đề section"
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
                                            <SelectTrigger>
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
                                                      <Label className="mb-1">Tiêu đề đoạn</Label>
                                                      <Input
                                                        value={paraObj.title || ""}
                                                        onChange={(e) => {
                                                          const newSections = [...detailData.numberedSections];
                                                          const newParagraphs = [...(section.paragraphs || [])];
                                                          newParagraphs[paraIndex] = { ...paraObj, title: e.target.value };
                                                          newSections[index] = { ...section, paragraphs: newParagraphs };
                                                          setDetailData({ ...detailData, numberedSections: newSections });
                                                        }}
                                                        placeholder="Ví dụ: Học sinh"
                                                      />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                      <Label className="mb-1">Nội dung</Label>
                                                      <Textarea
                                                        value={paraObj.text || ""}
                                                        onChange={(e) => {
                                                          const newSections = [...detailData.numberedSections];
                                                          const newParagraphs = [...(section.paragraphs || [])];
                                                          newParagraphs[paraIndex] = { ...paraObj, text: e.target.value };
                                                          newSections[index] = { ...section, paragraphs: newParagraphs };
                                                          setDetailData({ ...detailData, numberedSections: newSections });
                                                        }}
                                                        rows={2}
                                                        placeholder={`Đoạn ${paraIndex + 1}`}
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
                                                const newParagraphs = [...(section.paragraphs || []), { title: "", text: "" }];
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
                                  <CardTitle>Khối 5 - Expand (Mở rộng lợi ích)</CardTitle>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Danh sách bullets nhấn mạnh lợi ích và một ảnh minh họa bên cạnh.
                                  </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label className="mb-2">Tiêu đề expand</Label>
                                    <Input
                                      value={detailData.expand?.title || detailData.expandTitle || ""}
                                      onChange={(e) => {
                                        setDetailData({
                                          ...detailData,
                                          expand: { ...detailData.expand, title: e.target.value },
                                          expandTitle: e.target.value,
                                        });
                                      }}
                                      placeholder="Tiêu đề expand"
                                    />
                                  </div>
                                  <div>
                                    <Label className="mb-2">Danh sách điểm nổi bật (Bullets)</Label>
                                    <div className="space-y-2">
                                      {((detailData.expand?.bullets || detailData.expandBullets) || []).map(
                                        (bullet: string, index: number) => (
                                          <div key={index} className="flex gap-2">
                                            <Input
                                              value={bullet}
                                              onChange={(e) => {
                                                const newBullets = [...((detailData.expand?.bullets || detailData.expandBullets) || [])];
                                                newBullets[index] = e.target.value;
                                                setDetailData({
                                                  ...detailData,
                                                  expand: { ...detailData.expand, bullets: newBullets },
                                                  expandBullets: newBullets,
                                                });
                                              }}
                                              placeholder={`Bullet ${index + 1}`}
                                            />
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="icon"
                                              onClick={() => {
                                                const newBullets = ((detailData.expand?.bullets || detailData.expandBullets) || []).filter(
                                                  (_: string, i: number) => i !== index
                                                );
                                                setDetailData({
                                                  ...detailData,
                                                  expand: { ...detailData.expand, bullets: newBullets },
                                                  expandBullets: newBullets,
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
                                          const newBullets = [...currentBullets, ""];
                                          setDetailData({
                                            ...detailData,
                                            expand: { ...detailData.expand, bullets: newBullets },
                                            expandBullets: newBullets,
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
                                      <Label className="mb-2">Nút kêu gọi hành động - Văn bản</Label>
                                      <Input
                                        value={detailData.expand?.ctaText || detailData.expandCtaText || ""}
                                        onChange={(e) => {
                                          setDetailData({
                                            ...detailData,
                                            expand: { ...detailData.expand, ctaText: e.target.value },
                                            expandCtaText: e.target.value,
                                          });
                                        }}
                                        placeholder="Liên hệ"
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
                                            expandCtaHref: e.target.value,
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
                            <Card>
                              <CardHeader>
                                <CardTitle>Nội dung HTML</CardTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                  Sử dụng trình soạn thảo để tạo nội dung chi tiết sản phẩm với định dạng phong phú.
                                </p>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold">
                                    Nội dung chi tiết
                                  </Label>
                                  <div className="border rounded-lg min-h-[360px]">
                                    <RichTextEditor
                                      value={detailData?.contentHtml || ""}
                                      onChange={(value) => {
                                        setDetailData({
                                          ...detailData,
                                          contentHtml: value,
                                          contentMode: "content"
                                        });
                                        // Đảm bảo tab cũng được cập nhật khi thay đổi nội dung
                                        if (activeContentModeTab !== "content") {
                                          setActiveContentModeTab("content");
                                        }
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Sử dụng trình soạn thảo để tạo nội dung sản phẩm với định dạng phong phú.
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
                                    <Label htmlFor="galleryTitle" className="text-sm font-semibold">
                                      Tiêu đề bộ sưu tập (tuỳ chọn)
                                    </Label>
                                    <Input
                                      id="galleryTitle"
                                      placeholder="Nhập tiêu đề cho gallery (nếu cần)"
                                      value={detailData?.galleryTitle || ""}
                                      onChange={(e) =>
                                        setDetailData({
                                          ...detailData,
                                          galleryTitle: e.target.value,
                                        })
                                      }
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
                                      {detailData.metaTop}
                                    </div>
                                  )}
                                  <h1
                                    className="text-[56px] leading-[normal] font-extrabold w-[543px]"
                                    style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                                  >
                                    {formData.name}
                                  </h1>
                                  {detailData.heroDescription && (
                                    <p className="text-white/85 text-[14px] leading-[22px]">
                                      {detailData.heroDescription}
                                    </p>
                                  )}
                                  <div className="flex flex-row items-center gap-4">
                                    {detailData.ctaContactText && (
                                      <a
                                        href={detailData.ctaContactHref || "#"}
                                        className="h-[48px] px-6 rounded-xl bg-white text-[#0B78B8] font-semibold text-[16px] inline-flex items-center gap-2 hover:bg-white/90 transition"
                                      >
                                        {detailData.ctaContactText} <ArrowRight size={18} />
                                      </a>
                                    )}
                                    {detailData.ctaDemoText && (
                                      <a
                                        href={detailData.ctaDemoHref || "#"}
                                        className="h-[48px] px-6 rounded-xl border border-white/80 text-white font-semibold text-[16px] inline-flex items-center gap-3 hover:bg-white/10 transition"
                                      >
                                        {detailData.ctaDemoText}
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
                                        alt={formData.name}
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
                                dangerouslySetInnerHTML={{ __html: detailData.contentHtml }}
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
                                          {detailData.overviewKicker}
                                        </div>
                                      )}
                                      {detailData.overviewTitle && (
                                        <h2 className="mx-auto max-w-[840px] text-center text-[#0F172A] font-plus-jakarta text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-normal [font-feature-settings:'liga'_off,'clig'_off]">
                                          {detailData.overviewTitle}
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
                                                {card.title}
                                              </div>
                                            )}
                                            {(card.description || card.desc) && (
                                              <div className="text-gray-600 text-sm leading-relaxed text-center">
                                                {card.description || card.desc}
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
                                          {detailData.showcase.title}
                                        </h3>
                                      )}
                                      {detailData.showcase.desc && (
                                        <p className="text-gray-600 leading-relaxed">
                                          {detailData.showcase.desc}
                                        </p>
                                      )}
                                      {detailData.showcase.bullets && detailData.showcase.bullets.length > 0 && (
                                        <div className="space-y-3">
                                          {detailData.showcase.bullets.map((b: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                              <CheckCircle2 size={18} className="text-[#0B78B8] mt-0.5" />
                                              <span className="text-gray-700">{b}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {detailData.showcase.ctaHref && detailData.showcase.ctaText && (
                                        <a
                                          href={detailData.showcase.ctaHref}
                                          className="inline-flex items-center gap-2 h-[42px] px-5 rounded-lg bg-[#2EABE2] text-white font-semibold hover:opacity-90 transition"
                                        >
                                          {detailData.showcase.ctaText} <ArrowRight size={18} />
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
                                              {(section.sectionNo || section.no || index + 1)}. {section.title}
                                            </div>
                                          )}
                                          {section.paragraphs && section.paragraphs.length > 0 && (
                                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                              {section.paragraphs.map((p: string, i: number) => (
                                                <p key={i}>{p}</p>
                                              ))}
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
                                          {detailData.expand.title || detailData.expandTitle}
                                        </h3>
                                      )}
                                      {((detailData.expand.bullets || detailData.expandBullets) || []).length > 0 && (
                                        <div className="space-y-3">
                                          {(detailData.expand.bullets || detailData.expandBullets || []).map((b: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                              <CheckCircle2 size={18} className="text-[#0B78B8] mt-0.5" />
                                              <span className="text-gray-700">{b}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {((detailData.expand.ctaHref || detailData.expandCtaHref) && (detailData.expand.ctaText || detailData.expandCtaText)) && (
                                        <a
                                          href={detailData.expand.ctaHref || detailData.expandCtaHref}
                                          className="inline-flex items-center gap-2 h-[44px] px-5 rounded-lg bg-[#2EABE2] text-white font-semibold hover:opacity-90 transition"
                                        >
                                          {detailData.expand.ctaText || detailData.expandCtaText} <ArrowRight size={18} />
                                        </a>
                                      )}
                                    </div>
                                    {(detailData.expand.image || detailData.expandImage) && (
                                      <div>
                                        <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_14px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                                          <div className="relative aspect-[16/9]">
                                            <img
                                              src={detailData.expand.image || detailData.expandImage}
                                              alt={detailData.expand.title || detailData.expandTitle}
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
