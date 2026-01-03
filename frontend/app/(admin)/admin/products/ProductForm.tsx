"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, X, ArrowRight, Play, CheckCircle2, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
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
  const [activeDetailSubTab, setActiveDetailSubTab] = useState<string>("config");

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
        // Cập nhật thông tin cơ bản
        await adminApiCall(AdminEndpoints.products.detail(productId), {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        
        // Nếu có chi tiết sản phẩm, lưu luôn chi tiết
        if (detailData) {
          try {
            await adminApiCall(AdminEndpoints.products.detailPage(productId), {
              method: "PUT",
              body: JSON.stringify(detailData),
            });
          } catch (detailError: any) {
            console.error("Error saving detail:", detailError);
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
                      <p className="text-gray-600 mt-1">Cấu hình các section của trang chi tiết sản phẩm. Nhấn nút "Lưu" ở trên để lưu tất cả thay đổi.</p>
                    </div>

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
                                    {(section.paragraphs || []).map((para: string, paraIndex: number) => (
                                      <div key={paraIndex} className="flex gap-2">
                                        <Textarea
                                          value={para}
                                          onChange={(e) => {
                                            const newSections = [...detailData.numberedSections];
                                            const newParagraphs = [...(section.paragraphs || [])];
                                            newParagraphs[paraIndex] = e.target.value;
                                            newSections[index] = { ...section, paragraphs: newParagraphs };
                                            setDetailData({ ...detailData, numberedSections: newSections });
                                          }}
                                          rows={2}
                                          placeholder={`Đoạn ${paraIndex + 1}`}
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const newSections = [...detailData.numberedSections];
                                            const newParagraphs = (section.paragraphs || []).filter(
                                              (_: string, i: number) => i !== paraIndex
                                            );
                                            newSections[index] = { ...section, paragraphs: newParagraphs };
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
                                        const newSections = [...detailData.numberedSections];
                                        const newParagraphs = [...(section.paragraphs || []), ""];
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
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white">
                        {/* Hero Section */}
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
