"use client";

import { useState, useEffect } from "react";
import { Save, ArrowRight } from "lucide-react";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactFormData {
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
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

export default function ContactBannerPage() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<ContactFormData>({
    title: "",
    description: "",
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    backgroundGradient: GRADIENT_OPTIONS[0].value,
    isActive: true,
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      setLoadingData(true);
      const data = await adminApiCall<{ success: boolean; data?: ContactFormData }>(
        AdminEndpoints.productContact.get,
      );
      if (data?.data) {
        setFormData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải dữ liệu banner liên hệ");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminApiCall(AdminEndpoints.productContact.update, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      toast.success("Đã lưu banner liên hệ thành công");
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi khi lưu banner liên hệ");
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Banner Liên hệ</h1>
          <p className="text-gray-600 mt-1">Cấu hình banner CTA liên hệ cho trang sản phẩm</p>
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
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Miễn phí tư vấn"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số."
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
                      placeholder="Xem case studies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryCtaLink">Link CTA chính</Label>
                    <Input
                      id="primaryCtaLink"
                      value={formData.primaryCtaLink}
                      onChange={(e) => setFormData({ ...formData, primaryCtaLink: e.target.value })}
                      placeholder="/case-studies"
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
                      placeholder="Tư vấn miễn phí ngay"
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
              <CardTitle>Preview Contact Banner</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg p-8 text-white text-center justify-center items-center"
                style={{ background: formData.backgroundGradient }}
              >
                <div className="max-w-4xl mx-auto space-y-6">
                  {formData.title && (
                    <h2 className="text-3xl font-bold">{formData.title}</h2>
                  )}
                  {formData.description && (
                    <p className="text-base opacity-90 leading-relaxed">{formData.description}</p>
                  )}

                  <div className="flex gap-4 mt-6 justify-center items-center">
                    {formData.primaryCtaText && (
                      <a
                        href={formData.primaryCtaLink || "#"}
                        className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition"
                      >
                        {formData.primaryCtaText}
                      </a>
                    )}
                    {formData.secondaryCtaText && (
                      <a
                        href={formData.secondaryCtaLink || "#"}
                        className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition"
                      >
                        {formData.secondaryCtaText} <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

