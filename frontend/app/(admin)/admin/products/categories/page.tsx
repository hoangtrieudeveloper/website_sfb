"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

interface Category {
  id: number;
  slug: string;
  name: string;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApiCall<{ success: boolean; data?: Category[] }>(
        AdminEndpoints.productCategories.list,
      );
      setCategories(data.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingId(-1);
    setFormData({ slug: "", name: "", iconName: "", sortOrder: 0, isActive: true });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData(category);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (!formData.slug || !formData.name) {
        toast.error("Slug và name không được để trống");
        return;
      }

      if (editingId === -1) {
        // Create
        await adminApiCall(AdminEndpoints.productCategories.list, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        toast.success("Đã tạo danh mục");
      } else if (editingId) {
        // Update
        await adminApiCall(AdminEndpoints.productCategories.detail(editingId), {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        toast.success("Đã cập nhật danh mục");
      }

      handleCancel();
      void fetchCategories();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu danh mục");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await adminApiCall(AdminEndpoints.productCategories.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa danh mục");
      void fetchCategories();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa danh mục");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Danh mục Sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các danh mục sản phẩm (edu, justice, gov, kpi)
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo danh mục mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có danh mục nào
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  {editingId === category.id ? (
                    <div className="flex-1 grid grid-cols-5 gap-4">
                      <Input
                        value={formData.slug || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="Slug"
                      />
                      <Input
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Tên"
                      />
                      <Input
                        value={formData.iconName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, iconName: e.target.value })
                        }
                        placeholder="Icon name"
                      />
                      <Input
                        type="number"
                        value={formData.sortOrder || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sortOrder: Number(e.target.value),
                          })
                        }
                        placeholder="Sort order"
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.isActive !== false}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, isActive: checked })
                          }
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                      <div className="font-mono text-sm">{category.slug}</div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.iconName || "-"}
                      </div>
                      <div className="text-sm">{category.sortOrder}</div>
                      <div>
                        {category.isActive ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-gray-400">Inactive</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {editingId === category.id ? (
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
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(category.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {editingId === -1 && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <Input
                      value={formData.slug || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="Slug"
                    />
                    <Input
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Tên"
                    />
                    <Input
                      value={formData.iconName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, iconName: e.target.value })
                      }
                      placeholder="Icon name"
                    />
                    <Input
                      type="number"
                      value={formData.sortOrder || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sortOrder: Number(e.target.value),
                        })
                      }
                      placeholder="Sort order"
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isActive !== false}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isActive: checked })
                        }
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

