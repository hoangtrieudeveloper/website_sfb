"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import ImageUpload from "@/components/admin/ImageUpload";

interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  sortOrder: number;
  isActive: boolean;
}

export default function ProductBenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Benefit>>({});

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      const data = await adminApiCall<{ success: boolean; data?: Benefit[] }>(
        AdminEndpoints.productBenefits.list,
      );
      setBenefits(data.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách lợi ích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBenefits();
  }, []);

  const handleCreate = () => {
    setEditingId(-1);
    setFormData({
      icon: "",
      title: "",
      description: "",
      gradient: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const handleEdit = (benefit: Benefit) => {
    setEditingId(benefit.id);
    setFormData(benefit);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (!formData.title) {
        toast.error("Title không được để trống");
        return;
      }

      if (editingId === -1) {
        await adminApiCall(AdminEndpoints.productBenefits.list, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        toast.success("Đã tạo lợi ích");
      } else if (editingId) {
        await adminApiCall(AdminEndpoints.productBenefits.detail(editingId), {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        toast.success("Đã cập nhật lợi ích");
      }

      handleCancel();
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu lợi ích");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lợi ích này?")) return;
    try {
      await adminApiCall(AdminEndpoints.productBenefits.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa lợi ích");
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa lợi ích");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    try {
      const newBenefits = [...benefits];
      [newBenefits[index - 1], newBenefits[index]] = [newBenefits[index], newBenefits[index - 1]];
      
      // Cập nhật sortOrder cho tất cả benefits
      const updates = newBenefits.map((benefit, i) => ({
        id: benefit.id,
        sortOrder: i,
      }));

      // Gửi tất cả updates
      await Promise.all(
        updates.map((update) =>
          adminApiCall(AdminEndpoints.productBenefits.detail(update.id), {
            method: "PUT",
            body: JSON.stringify({ sortOrder: update.sortOrder }),
          })
        )
      );

      toast.success("Đã cập nhật vị trí");
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật vị trí");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === benefits.length - 1) return;
    try {
      const newBenefits = [...benefits];
      [newBenefits[index], newBenefits[index + 1]] = [newBenefits[index + 1], newBenefits[index]];
      
      // Cập nhật sortOrder cho tất cả benefits
      const updates = newBenefits.map((benefit, i) => ({
        id: benefit.id,
        sortOrder: i,
      }));

      // Gửi tất cả updates
      await Promise.all(
        updates.map((update) =>
          adminApiCall(AdminEndpoints.productBenefits.detail(update.id), {
            method: "PUT",
            body: JSON.stringify({ sortOrder: update.sortOrder }),
          })
        )
      );

      toast.success("Đã cập nhật vị trí");
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật vị trí");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Lợi ích Sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý 4 thẻ lợi ích hiển thị trên trang products
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo lợi ích mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.sort((a, b) => a.sortOrder - b.sortOrder).map((benefit, index) => (
          <Card key={benefit.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-normal">#{index + 1}</span>
                  <span>{benefit.title}</span>
                </div>
                <div className="flex gap-2">
                  {editingId === benefit.id ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Di chuyển lên"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === benefits.length - 1}
                        title="Di chuyển xuống"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(benefit)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(benefit.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingId === benefit.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Icon/Image</Label>
                    <ImageUpload
                      currentImage={formData.icon || ""}
                      onImageSelect={(url: string) => setFormData({ ...formData, icon: url })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Bảo mật cao"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Mô tả lợi ích..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gradient</Label>
                    <Input
                      value={formData.gradient || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, gradient: e.target.value })
                      }
                      placeholder="from-[#006FB3] to-[#0088D9]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Switch
                      checked={formData.isActive !== false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {benefit.icon && (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                      <img src={benefit.icon} alt={benefit.title} className="w-12 h-12" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    Gradient: {benefit.gradient}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sort: {benefit.sortOrder} |{" "}
                    {benefit.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-gray-400">Inactive</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {editingId === -1 && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Tạo lợi ích mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Icon/Image</Label>
                <ImageUpload
                  currentImage={formData.icon || ""}
                  onImageSelect={(url: string) => setFormData({ ...formData, icon: url })}
                />
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Bảo mật cao"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả lợi ích..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Gradient</Label>
                <Input
                  value={formData.gradient || ""}
                  onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                  placeholder="from-[#006FB3] to-[#0088D9]"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.isActive !== false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

