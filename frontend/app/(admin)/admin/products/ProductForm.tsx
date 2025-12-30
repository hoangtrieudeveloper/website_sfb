"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
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

interface ProductFormData {
  categoryId: number | "";
  name: string;
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

  const [formData, setFormData] = useState<ProductFormData>({
    categoryId: "",
    name: "",
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
  });

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProduct();
      fetchProductDetail();
    }
  }, [productId]);

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
        });
        return;
      }
      
      // API có thể trả về data: null nếu chưa có detail
      if (response.data === null || response.data === undefined) {
        setDetailData({
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
        });
      } else {
        // Đảm bảo tất cả các field đều có giá trị mặc định
        setDetailData({
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
        });
      }
    } catch (error: any) {
      console.error("Error fetching product detail:", error);
      // Nếu có lỗi, tạo empty data
      setDetailData({
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
      });
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
      console.log("🔄 Saving detail data:", data); // Debug log
      const response = await adminApiCall(AdminEndpoints.products.detailPage(productId), {
        method: "PUT",
        body: JSON.stringify(data),
      });
      console.log("✅ Save response:", response); // Debug log
      toast.success("Đã lưu chi tiết sản phẩm");
      // Reload lại data từ backend để cập nhật UI với sort_order mới (force reload để bypass cache)
      setEditingSection(null); // Đóng các dialog đang mở
      await fetchProductDetail(true);
    } catch (error: any) {
      console.error("❌ Save error:", error); // Debug log
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
      console.error(error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoadingData(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.products.detail(productId!),
      );
      if (data.data) {
        setFormData({
          categoryId: data.data.categoryId || "",
          name: data.data.name || "",
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
        await adminApiCall(AdminEndpoints.products.detail(productId), {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await adminApiCall(AdminEndpoints.products.list, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Đã tạo sản phẩm");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/products");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {productId ? "Sửa sản phẩm" : "Tạo sản phẩm mới"}
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

      <Tabs defaultValue={productId ? "preview" : "basic"} className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          {productId && <TabsTrigger value="preview">Preview & Chỉnh sửa</TabsTrigger>}
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
                  <Label htmlFor="tagline" className="text-gray-900">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Ví dụ: Tuyển sinh trực tuyến minh bạch, đúng quy chế"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta" className="text-gray-900">Meta</Label>
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
                  <Label htmlFor="badge" className="text-gray-900">Badge</Label>
                  <Input
                    id="badge"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ví dụ: Giải pháp nổi bật"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradient" className="text-gray-900">Gradient</Label>
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
                  <Label htmlFor="statsUsers" className="text-gray-900">Users</Label>
                  <Input
                    id="statsUsers"
                    value={formData.statsUsers}
                    onChange={(e) => setFormData({ ...formData, statsUsers: e.target.value })}
                    placeholder="Ví dụ: Nhiều trường học áp dụng"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statsRating" className="text-gray-900">Rating</Label>
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
                  <Label htmlFor="statsDeploy" className="text-gray-900">Deploy</Label>
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
        </TabsContent>

        {productId && (
          <TabsContent value="preview" className="space-y-0">
            {loadingDetail ? (
              <div className="text-center py-8 text-gray-900">Đang tải...</div>
            ) : (
              <div className="bg-white min-h-screen relative">
                <div className="max-w-[1920px] mx-auto px-6 lg:px-[120px] py-10 space-y-10">
                  {/* Hero Widget */}
                  {detailData && (
                    <section className="border border-slate-200 rounded-2xl bg-slate-50/70 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 bg-slate-100/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Khối 1 - Hero trang chi tiết
                          </p>
                          <p className="text-xs text-slate-500">
                            Tiêu đề, đoạn mở đầu và ảnh lớn ở đầu trang chi tiết sản phẩm.
                          </p>
                        </div>
                      </div>
                      <HeroWidget
                        productName={formData.name}
                        metaTop={detailData.metaTop || ""}
                        heroDescription={detailData.heroDescription || ""}
                        heroImage={detailData.heroImage || ""}
                        ctaContactText={detailData.ctaContactText}
                        ctaContactHref={detailData.ctaContactHref}
                        ctaDemoText={detailData.ctaDemoText}
                        ctaDemoHref={detailData.ctaDemoHref}
                        onUpdate={(data) => {
                          const updatedData = {
                            ...detailData,
                            metaTop: data.metaTop,
                            heroDescription: data.heroDescription,
                            heroImage: data.heroImage,
                            ctaContactText: data.ctaContactText,
                            ctaContactHref: data.ctaContactHref,
                            ctaDemoText: data.ctaDemoText,
                            ctaDemoHref: data.ctaDemoHref,
                          };
                          setDetailData(updatedData);
                          handleSaveDetail(updatedData);
                        }}
                        isEditing={editingSection === "hero"}
                        onEditClick={() => setEditingSection("hero")}
                      />
                    </section>
                  )}

                  {/* Overview Widget */}
                  {detailData && (
                    <section className="border border-slate-200 rounded-2xl bg-slate-50/70 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 bg-slate-100/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Khối 2 - Tổng quan (Overview)
                          </p>
                          <p className="text-xs text-slate-500">
                            Kicker, tiêu đề và các card mô tả các bước / tính năng chính.
                          </p>
                        </div>
                      </div>
                      <OverviewWidget
                        kicker={detailData.overviewKicker || ""}
                        title={detailData.overviewTitle || ""}
                        cards={detailData.overviewCards || []}
                        onUpdate={(data) => {
                          const updatedData = {
                            ...detailData,
                            overviewKicker: data.overviewKicker,
                            overviewTitle: data.overviewTitle,
                            overviewCards: data.overviewCards,
                          };
                          setDetailData(updatedData);
                          handleSaveDetail(updatedData);
                        }}
                        isEditing={editingSection === "overview"}
                        onEditClick={() => setEditingSection("overview")}
                      />
                    </section>
                  )}

                  {/* Showcase Widget */}
                  {detailData && detailData.showcase && (
                    <section className="border border-slate-200 rounded-2xl bg-slate-50/70 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 bg-slate-100/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Khối 3 - Showcase màn hình
                          </p>
                          <p className="text-xs text-slate-500">
                            Bố cục 2 cột: bên trái là ảnh màn hình (dashboard preview), bên phải là tiêu đề, mô tả và bullets.
                          </p>
                        </div>
                      </div>
                      <ShowcaseWidget
                        showcase={detailData.showcase}
                        onUpdate={(data) => {
                          const updatedData = { ...detailData, showcase: data };
                          setDetailData(updatedData);
                          handleSaveDetail(updatedData);
                        }}
                        isEditing={editingSection === "showcase"}
                        onEditClick={() => setEditingSection("showcase")}
                      />
                    </section>
                  )}

                  {/* Numbered Sections Widgets */}
                  {detailData && detailData.numberedSections && (
                    <section className="border border-slate-200 rounded-2xl bg-slate-50/70 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 bg-slate-100/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Khối 4 - Các section đánh số
                          </p>
                          <p className="text-xs text-slate-500">
                            Mỗi section gồm số thứ tự, tiêu đề, ảnh minh họa và các đoạn mô tả chi tiết.
                          </p>
                        </div>
                      </div>
                      <div className="w-full py-6 space-y-10">
                        {detailData.numberedSections.map((section: any, index: number) => (
                          <NumberedSectionWidget
                            key={index}
                            section={section}
                            onUpdate={(updatedSection) => {
                              const newSections = [...detailData.numberedSections];
                              newSections[index] = updatedSection;
                              const normalizedSections = newSections.map(
                                (s: any, i: number) => ({
                                  ...s,
                                  sectionNo: i + 1,
                                }),
                              );
                              const updatedData = {
                                ...detailData,
                                numberedSections: normalizedSections,
                              };
                              setDetailData(updatedData);
                              // Truyền data mới nhất vào handleSaveDetail để đảm bảo API được gọi với data đúng
                              handleSaveDetail(updatedData);
                            }}
                            onDelete={() => {
                              const newSections = detailData.numberedSections.filter(
                                (_: any, i: number) => i !== index,
                              );
                              const normalizedSections = newSections.map(
                                (s: any, i: number) => ({
                                  ...s,
                                  sectionNo: i + 1,
                                }),
                              );
                              const updatedData = {
                                ...detailData,
                                numberedSections: normalizedSections,
                              };
                              setDetailData(updatedData);
                              // Truyền data mới nhất vào handleSaveDetail để đảm bảo API được gọi với data đúng
                              handleSaveDetail(updatedData);
                            }}
                            onMoveUp={
                              index > 0
                                ? () => {
                                    const newSections = [...detailData.numberedSections];
                                    [newSections[index - 1], newSections[index]] = [
                                      newSections[index],
                                      newSections[index - 1],
                                    ];
                                    const normalizedSections = newSections.map(
                                      (s: any, i: number) => ({
                                        ...s,
                                        sectionNo: i + 1,
                                      }),
                                    );
                                    const updatedData = {
                                      ...detailData,
                                      numberedSections: normalizedSections,
                                    };
                                    setDetailData(updatedData);
                                    // Truyền data mới nhất vào handleSaveDetail để đảm bảo API được gọi với data đúng
                                    handleSaveDetail(updatedData);
                                  }
                                : undefined
                            }
                            onMoveDown={
                              index < detailData.numberedSections.length - 1
                                ? () => {
                                    const newSections = [...detailData.numberedSections];
                                    [newSections[index], newSections[index + 1]] = [
                                      newSections[index + 1],
                                      newSections[index],
                                    ];
                                    const normalizedSections = newSections.map(
                                      (s: any, i: number) => ({
                                        ...s,
                                        sectionNo: i + 1,
                                      }),
                                    );
                                    const updatedData = {
                                      ...detailData,
                                      numberedSections: normalizedSections,
                                    };
                                    setDetailData(updatedData);
                                    // Truyền data mới nhất vào handleSaveDetail để đảm bảo API được gọi với data đúng
                                    handleSaveDetail(updatedData);
                                  }
                                : undefined
                            }
                            isEditing={editingSection === `numbered-${index}`}
                            onEditClick={() => setEditingSection(`numbered-${index}`)}
                          />
                        ))}
                        <div className="px-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newSections = [
                                ...(detailData.numberedSections || []),
                                {
                                  sectionNo: (detailData.numberedSections?.length || 0) + 1,
                                  title: "",
                                  imageBack: "",
                                  imageFront: "",
                                  imageSide: "left",
                                  paragraphs: [],
                                },
                              ];
                              const normalizedSections = newSections.map(
                                (s: any, i: number) => ({
                                  ...s,
                                  sectionNo: i + 1,
                                }),
                              );
                              const updatedData = {
                                ...detailData,
                                numberedSections: normalizedSections,
                              };
                              setDetailData(updatedData);
                              // Truyền data mới nhất vào handleSaveDetail để đảm bảo API được gọi với data đúng
                              handleSaveDetail(updatedData);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm Numbered Section
                          </Button>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Expand Widget */}
                  {detailData && detailData.expand && (
                    <section className="border border-slate-200 rounded-2xl bg-slate-50/70 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 bg-slate-100/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Khối 5 - Expand (Mở rộng lợi ích)
                          </p>
                          <p className="text-xs text-slate-500">
                            Danh sách bullets nhấn mạnh lợi ích và một ảnh minh họa bên cạnh.
                          </p>
                        </div>
                      </div>
                      <ExpandWidget
                        expand={detailData.expand}
                        onUpdate={(data) => {
                          const updatedData = { ...detailData, expand: data };
                          setDetailData(updatedData);
                          handleSaveDetail(updatedData);
                        }}
                        isEditing={editingSection === "expand"}
                        onEditClick={() => setEditingSection("expand")}
                      />
                    </section>
                  )}
                </div>

                {/* Floating Action Buttons */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveDetail();
                    }}
                    size="lg"
                    className="shadow-lg"
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Đang lưu..." : "Lưu tất cả thay đổi"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </form>
  );
}

// Product Detail Tab Component
interface ProductDetailTabProps {
  productId: number;
}

function ProductDetailTab({ productId }: ProductDetailTabProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [detailData, setDetailData] = useState<any>(null);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoadingData(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.products.detailPage(productId),
      );
      setDetailData(data.data || {
        slug: "",
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
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải chi tiết sản phẩm");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveDetail = async (dataToSave?: any) => {
    // Sử dụng dataToSave nếu có, nếu không thì dùng detailData hiện tại
    const data = dataToSave || detailData;
    if (!productId || !data) return;
    try {
      setLoading(true);
      console.log("🔄 Saving detail data:", data); // Debug log
      const response = await adminApiCall(AdminEndpoints.products.detailPage(productId), {
        method: "PUT",
        body: JSON.stringify(data),
      });
      console.log("✅ Save response:", response); // Debug log
      toast.success("Đã lưu chi tiết sản phẩm");
      // Reload lại data từ backend để cập nhật UI với sort_order mới (force reload để bypass cache)
      await fetchProductDetail();
    } catch (error: any) {
      console.error("❌ Save error:", error); // Debug log
      toast.error(error?.message || "Không thể lưu chi tiết sản phẩm");
    } finally {
      setLoading(false);
    }
  };


  if (loadingData) {
    return <div className="text-center py-8 text-gray-900">Đang tải...</div>;
  }

  if (!detailData) {
    return <div className="text-center py-8 text-gray-900">Không có dữ liệu</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button type="button" onClick={handleSaveDetail} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Đang lưu..." : "Lưu chi tiết"}
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Meta Top</Label>
            <Input
              value={detailData.metaTop || ""}
              onChange={(e) => setDetailData({ ...detailData, metaTop: e.target.value })}
              placeholder="TÀI LIỆU GIỚI THIỆU PHẦN MỀM"
            />
          </div>
          <div>
            <Label>Hero Description</Label>
            <Textarea
              value={detailData.heroDescription || ""}
              onChange={(e) => setDetailData({ ...detailData, heroDescription: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label>Hero Image</Label>
            <ImageUpload
              currentImage={detailData.heroImage || ""}
              onImageSelect={(url: string) => setDetailData({ ...detailData, heroImage: url })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Overview Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kicker</Label>
              <Input
                value={detailData.overviewKicker || ""}
                onChange={(e) => setDetailData({ ...detailData, overviewKicker: e.target.value })}
                placeholder="SFB - HỒ SƠ HỌC SINH"
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={detailData.overviewTitle || ""}
                onChange={(e) => setDetailData({ ...detailData, overviewTitle: e.target.value })}
                placeholder="Tổng quan hệ thống"
              />
            </div>
          </div>
          <div>
            <Label>Overview Cards</Label>
            {(detailData.overviewCards || []).map((card: any, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={card.step || ""}
                  onChange={(e) => {
                    const newCards = [...(detailData.overviewCards || [])];
                    newCards[index] = { ...card, step: Number(e.target.value) };
                    setDetailData({ ...detailData, overviewCards: newCards });
                  }}
                  placeholder="Step"
                  type="number"
                  className="w-20"
                />
                <Input
                  value={card.title || ""}
                  onChange={(e) => {
                    const newCards = [...(detailData.overviewCards || [])];
                    newCards[index] = { ...card, title: e.target.value };
                    setDetailData({ ...detailData, overviewCards: newCards });
                  }}
                  placeholder="Title"
                />
                <Textarea
                  value={card.description || ""}
                  onChange={(e) => {
                    const newCards = [...(detailData.overviewCards || [])];
                    newCards[index] = { ...card, description: e.target.value };
                    setDetailData({ ...detailData, overviewCards: newCards });
                  }}
                  placeholder="Description"
                  rows={2}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newCards = (detailData.overviewCards || []).filter((_: any, i: number) => i !== index);
                    setDetailData({ ...detailData, overviewCards: newCards });
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
                setDetailData({
                  ...detailData,
                  overviewCards: [...(detailData.overviewCards || []), { step: 1, title: "", description: "" }],
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Card
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Showcase Section */}
      <Card>
        <CardHeader>
          <CardTitle>Showcase Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={detailData.showcase?.title || ""}
              onChange={(e) =>
                setDetailData({
                  ...detailData,
                  showcase: { ...detailData.showcase, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={detailData.showcase?.desc || ""}
              onChange={(e) =>
                setDetailData({
                  ...detailData,
                  showcase: { ...detailData.showcase, desc: e.target.value },
                })
              }
              rows={3}
            />
          </div>
          <div>
            <Label>Image Side</Label>
            <select
              value={detailData.showcase?.imageSide || "left"}
              onChange={(e) =>
                setDetailData({
                  ...detailData,
                  showcase: {
                    ...detailData.showcase,
                    imageSide: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            >
              <option value="left">Trái (ảnh bên trái, text bên phải)</option>
              <option value="right">Phải (ảnh bên phải, text bên trái)</option>
            </select>
          </div>
          <div>
            <Label>Bullets</Label>
            {(detailData.showcase?.bullets || []).map((bullet: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
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
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newBullets = (detailData.showcase?.bullets || []).filter((_: string, i: number) => i !== index);
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
                setDetailData({
                  ...detailData,
                  showcase: {
                    ...detailData.showcase,
                    bullets: [...(detailData.showcase?.bullets || []), ""],
                  },
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Bullet
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CTA Text</Label>
              <Input
                value={detailData.showcase?.ctaText || ""}
                onChange={(e) =>
                  setDetailData({
                    ...detailData,
                    showcase: { ...detailData.showcase, ctaText: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>CTA Href</Label>
              <Input
                value={detailData.showcase?.ctaHref || ""}
                onChange={(e) =>
                  setDetailData({
                    ...detailData,
                    showcase: { ...detailData.showcase, ctaHref: e.target.value },
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Image Back</Label>
              <ImageUpload
                currentImage={detailData.showcase?.imageBack || ""}
                onImageSelect={(url: string) =>
                  setDetailData({
                    ...detailData,
                    showcase: { ...detailData.showcase, imageBack: url },
                  })
                }
              />
            </div>
            <div>
              <Label>Image Front</Label>
              <ImageUpload
                currentImage={detailData.showcase?.imageFront || ""}
                onImageSelect={(url: string) =>
                  setDetailData({
                    ...detailData,
                    showcase: { ...detailData.showcase, imageFront: url },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numbered Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Numbered Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(detailData.numberedSections || []).map((section: any, sectionIndex: number) => (
            <Card key={sectionIndex} className="border-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Section {section.sectionNo || sectionIndex + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newSections = (detailData.numberedSections || []).filter(
                        (_: any, i: number) => i !== sectionIndex
                      );
                      setDetailData({ ...detailData, numberedSections: newSections });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Section No</Label>
                    <Input
                      value={section.sectionNo || ""}
                      onChange={(e) => {
                        const newSections = [...(detailData.numberedSections || [])];
                        newSections[sectionIndex] = { ...section, sectionNo: Number(e.target.value) };
                        setDetailData({ ...detailData, numberedSections: newSections });
                      }}
                      type="number"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={section.title || ""}
                      onChange={(e) => {
                        const newSections = [...(detailData.numberedSections || [])];
                        newSections[sectionIndex] = { ...section, title: e.target.value };
                        setDetailData({ ...detailData, numberedSections: newSections });
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Image</Label>
                  <ImageUpload
                    currentImage={section.image || ""}
                    onImageSelect={(url: string) => {
                      const newSections = [...(detailData.numberedSections || [])];
                      newSections[sectionIndex] = { ...section, image: url };
                      setDetailData({ ...detailData, numberedSections: newSections });
                    }}
                  />
                </div>
                <div>
                  <Label>Paragraphs</Label>
                  {(section.paragraphs || []).map((para: string, paraIndex: number) => (
                    <div key={paraIndex} className="flex gap-2 mb-2">
                      <Textarea
                        value={para}
                        onChange={(e) => {
                          const newSections = [...(detailData.numberedSections || [])];
                          const newParagraphs = [...(section.paragraphs || [])];
                          newParagraphs[paraIndex] = e.target.value;
                          newSections[sectionIndex] = { ...section, paragraphs: newParagraphs };
                          setDetailData({ ...detailData, numberedSections: newSections });
                        }}
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newSections = [...(detailData.numberedSections || [])];
                          const newParagraphs = (section.paragraphs || []).filter(
                            (_: string, i: number) => i !== paraIndex
                          );
                          newSections[sectionIndex] = { ...section, paragraphs: newParagraphs };
                          setDetailData({ ...detailData, numberedSections: newSections });
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
                      const newSections = [...(detailData.numberedSections || [])];
                      const newParagraphs = [...(section.paragraphs || []), ""];
                      newSections[sectionIndex] = { ...section, paragraphs: newParagraphs };
                      setDetailData({ ...detailData, numberedSections: newSections });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Paragraph
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDetailData({
                ...detailData,
                numberedSections: [
                  ...(detailData.numberedSections || []),
                  { sectionNo: (detailData.numberedSections?.length || 0) + 1, title: "", imageBack: "", imageFront: "", paragraphs: [] },
                ],
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Section
          </Button>
        </CardContent>
      </Card>

      {/* Expand Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expand Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={detailData.expand?.title || ""}
              onChange={(e) =>
                setDetailData({
                  ...detailData,
                  expand: { ...detailData.expand, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Bullets</Label>
            {(detailData.expand?.bullets || []).map((bullet: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={bullet}
                  onChange={(e) => {
                    const newBullets = [...(detailData.expand?.bullets || [])];
                    newBullets[index] = e.target.value;
                    setDetailData({
                      ...detailData,
                      expand: { ...detailData.expand, bullets: newBullets },
                    });
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newBullets = (detailData.expand?.bullets || []).filter((_: string, i: number) => i !== index);
                    setDetailData({
                      ...detailData,
                      expand: { ...detailData.expand, bullets: newBullets },
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
                setDetailData({
                  ...detailData,
                  expand: {
                    ...detailData.expand,
                    bullets: [...(detailData.expand?.bullets || []), ""],
                  },
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Bullet
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CTA Text</Label>
              <Input
                value={detailData.expand?.ctaText || ""}
                onChange={(e) =>
                  setDetailData({
                    ...detailData,
                    expand: { ...detailData.expand, ctaText: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>CTA Href</Label>
              <Input
                value={detailData.expand?.ctaHref || ""}
                onChange={(e) =>
                  setDetailData({
                    ...detailData,
                    expand: { ...detailData.expand, ctaHref: e.target.value },
                  })
                }
              />
            </div>
          </div>
          <div>
            <Label>Image</Label>
            <ImageUpload
              currentImage={detailData.expand?.image || ""}
              onImageSelect={(url: string) =>
                setDetailData({
                  ...detailData,
                  expand: { ...detailData.expand, image: url },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

