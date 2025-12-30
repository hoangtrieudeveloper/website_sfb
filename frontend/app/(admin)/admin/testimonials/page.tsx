"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Star, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  company: string;
  rating: number;
  sortOrder: number;
  isActive: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});
  const [showPreview, setShowPreview] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await adminApiCall<{ success: boolean; data?: Testimonial[] }>(
        AdminEndpoints.testimonials.list,
      );
      setTestimonials(data.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTestimonials();
  }, []);

  const handleCreate = () => {
    setEditingId(-1);
    setFormData({
      quote: "",
      author: "",
      company: "",
      rating: 5,
      sortOrder: testimonials.length,
      isActive: true,
    });
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData(testimonial);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (!formData.quote || !formData.author) {
        toast.error("Quote và Author không được để trống");
        return;
      }

      if (editingId === -1) {
        await adminApiCall(AdminEndpoints.testimonials.list, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        toast.success("Đã tạo đánh giá");
      } else if (editingId) {
        await adminApiCall(AdminEndpoints.testimonials.detail(editingId), {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        toast.success("Đã cập nhật đánh giá");
      }

      handleCancel();
      void fetchTestimonials();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu đánh giá");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await adminApiCall(AdminEndpoints.testimonials.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa đánh giá");
      void fetchTestimonials();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa đánh giá");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const activeTestimonials = testimonials.filter((t) => t.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đánh giá khách hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý các đánh giá/testimonials của khách hàng về SFB</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm đánh giá
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Form Create/Edit */}
          {editingId !== null && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId === -1 ? "Thêm đánh giá mới" : "Chỉnh sửa đánh giá"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="quote">Nội dung đánh giá *</Label>
                    <Textarea
                      id="quote"
                      value={formData.quote || ""}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      placeholder="Nhập nội dung đánh giá..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Tên khách hàng *</Label>
                    <Input
                      id="author"
                      value={formData.author || ""}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Ví dụ: Ông Nguyễn Khánh Tùng"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Công ty/Đơn vị (tùy chọn)</Label>
                    <Input
                      id="company"
                      value={formData.company || ""}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Ví dụ: Công ty ABC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Đánh giá sao</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating || 5}
                      onChange={(e) =>
                        setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">Thứ tự sắp xếp</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive !== undefined ? formData.isActive : true}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Hiển thị</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Lưu
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* List */}
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : testimonials.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Chưa có đánh giá nào. Nhấn "Thêm đánh giá" để tạo mới.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(testimonial.rating)}
                        </div>
                        <p className="text-gray-700 mb-2 italic">"{testimonial.quote}"</p>
                        <div className="text-sm text-gray-600">
                          <p className="font-semibold">{testimonial.author}</p>
                          {testimonial.company && (
                            <p className="text-gray-500">{testimonial.company}</p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span>Thứ tự: #{testimonial.sortOrder}</span>
                          <span
                            className={`${
                              testimonial.isActive ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {testimonial.isActive ? "Đang hiển thị" : "Ẩn"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview - Khách hàng nói về SFB?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 py-12 px-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  Khách hàng nói về SFB?
                </h2>
                {activeTestimonials.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Chưa có đánh giá nào đang hiển thị
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTestimonials.map((testimonial) => (
                      <Card key={testimonial.id} className="bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-1 mb-4">
                            {renderStars(testimonial.rating)}
                          </div>
                          <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                          <div className="text-sm">
                            <p className="font-semibold text-gray-900">{testimonial.author}</p>
                            {testimonial.company && (
                              <p className="text-gray-600">{testimonial.company}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

