"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HeroFormData {
  title: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  backgroundGradient: string;
  isActive: boolean;
}

const GRADIENT_OPTIONS = [
  { value: "linear-gradient(to bottom right, #0870B4, #2EABE2)", label: "Xanh dương SFB" },
  { value: "linear-gradient(to bottom right, #8B5CF6, #EC4899)", label: "Tím - Hồng" },
  { value: "linear-gradient(to bottom right, #10B981, #14B8A6)", label: "Xanh lá - Teal" },
  { value: "linear-gradient(to bottom right, #F59E0B, #FBBF24)", label: "Cam - Vàng" },
  { value: "linear-gradient(to bottom right, #EF4444, #F43F5E)", label: "Đỏ - Hồng" },
  { value: "linear-gradient(to bottom right, #6366F1, #8B5CF6)", label: "Indigo - Tím" },
];

export default function ProductHeroPage() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<HeroFormData>({
    title: "",
    subtitle: "",
    description: "",
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    stat1Label: "",
    stat1Value: "",
    stat2Label: "",
    stat2Value: "",
    stat3Label: "",
    stat3Value: "",
    backgroundGradient: GRADIENT_OPTIONS[0].value,
    isActive: true,
  });

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setLoadingData(true);
      const data = await adminApiCall<{ success: boolean; data?: HeroFormData }>(
        AdminEndpoints.productHero.get,
      );
      if (data?.data) {
        setFormData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải dữ liệu hero");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminApiCall(AdminEndpoints.productHero.update, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      toast.success("Đã lưu hero section thành công");
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi khi lưu hero section");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Hero Section</h1>
          <p className="text-gray-600 mt-1">Cấu hình hero section cho trang sản phẩm</p>
        </div>
      </div>

      <Tabs defaultValue="form" className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Form chỉnh sửa</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chính</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề chính *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Bộ giải pháp phần mềm"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Tiêu đề phụ</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Phục vụ Giáo dục, Công chứng & Doanh nghiệp"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Mô tả về các sản phẩm..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call-to-Action (CTA)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryCtaText">Text CTA chính</Label>
                    <Input
                      id="primaryCtaText"
                      value={formData.primaryCtaText}
                      onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                      placeholder="Xem danh sách sản phẩm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryCtaLink">Link CTA chính</Label>
                    <Input
                      id="primaryCtaLink"
                      value={formData.primaryCtaLink}
                      onChange={(e) => setFormData({ ...formData, primaryCtaLink: e.target.value })}
                      placeholder="#products"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="secondaryCtaText">Text CTA phụ</Label>
                    <Input
                      id="secondaryCtaText"
                      value={formData.secondaryCtaText}
                      onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                      placeholder="Tư vấn giải pháp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryCtaLink">Link CTA phụ</Label>
                    <Input
                      id="secondaryCtaLink"
                      value={formData.secondaryCtaLink}
                      onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê (Stats)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stat1Label">Label Stat 1</Label>
                    <Input
                      id="stat1Label"
                      value={formData.stat1Label}
                      onChange={(e) => setFormData({ ...formData, stat1Label: e.target.value })}
                      placeholder="Giải pháp phần mềm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat1Value">Value Stat 1</Label>
                    <Input
                      id="stat1Value"
                      value={formData.stat1Value}
                      onChange={(e) => setFormData({ ...formData, stat1Value: e.target.value })}
                      placeholder="+32.000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stat2Label">Label Stat 2</Label>
                    <Input
                      id="stat2Label"
                      value={formData.stat2Label}
                      onChange={(e) => setFormData({ ...formData, stat2Label: e.target.value })}
                      placeholder="Đơn vị triển khai thực tế"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat2Value">Value Stat 2</Label>
                    <Input
                      id="stat2Value"
                      value={formData.stat2Value}
                      onChange={(e) => setFormData({ ...formData, stat2Value: e.target.value })}
                      placeholder="+6.000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stat3Label">Label Stat 3</Label>
                    <Input
                      id="stat3Label"
                      value={formData.stat3Label}
                      onChange={(e) => setFormData({ ...formData, stat3Label: e.target.value })}
                      placeholder="Mức độ hài lòng trung bình"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat3Value">Value Stat 3</Label>
                    <Input
                      id="stat3Value"
                      value={formData.stat3Value}
                      onChange={(e) => setFormData({ ...formData, stat3Value: e.target.value })}
                      placeholder="4.9★"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hiển thị</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backgroundGradient">Background Gradient</Label>
                  <select
                    id="backgroundGradient"
                    value={formData.backgroundGradient}
                    onChange={(e) => setFormData({ ...formData, backgroundGradient: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    {GRADIENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Kích hoạt</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg p-8 text-white"
                style={{ background: formData.backgroundGradient }}
              >
                <div className="max-w-4xl mx-auto space-y-6">
                  {formData.title && (
                    <h1 className="text-4xl font-bold">{formData.title}</h1>
                  )}
                  {formData.subtitle && (
                    <p className="text-xl opacity-90">{formData.subtitle}</p>
                  )}
                  {formData.description && (
                    <p className="text-base opacity-80">{formData.description}</p>
                  )}

                  <div className="flex gap-4 mt-6">
                    {formData.primaryCtaText && (
                      <Button variant="secondary">{formData.primaryCtaText}</Button>
                    )}
                    {formData.secondaryCtaText && (
                      <Button variant="outline" className="bg-white/10 text-white border-white/20">
                        {formData.secondaryCtaText}
                      </Button>
                    )}
                  </div>

                  {(formData.stat1Value || formData.stat2Value || formData.stat3Value) && (
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                      {formData.stat1Value && (
                        <div>
                          <div className="text-2xl font-bold">{formData.stat1Value}</div>
                          <div className="text-sm opacity-80">{formData.stat1Label}</div>
                        </div>
                      )}
                      {formData.stat2Value && (
                        <div>
                          <div className="text-2xl font-bold">{formData.stat2Value}</div>
                          <div className="text-sm opacity-80">{formData.stat2Label}</div>
                        </div>
                      )}
                      {formData.stat3Value && (
                        <div>
                          <div className="text-2xl font-bold">{formData.stat3Value}</div>
                          <div className="text-sm opacity-80">{formData.stat3Label}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

