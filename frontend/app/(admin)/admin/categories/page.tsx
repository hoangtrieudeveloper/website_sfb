"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
  description: string;
  postCount: number;
  color: string;
}

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Công nghệ",
    description: "Tin tức về công nghệ, AI, phần mềm",
    postCount: 45,
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: 2,
    name: "Kinh doanh",
    description: "Kinh tế, doanh nghiệp, khởi nghiệp",
    postCount: 32,
    color: "from-purple-600 to-pink-600",
  },
  {
    id: 3,
    name: "Giải trí",
    description: "Phim ảnh, âm nhạc, nghệ thuật",
    postCount: 28,
    color: "from-green-600 to-emerald-600",
  },
  {
    id: 4,
    name: "Thể thao",
    description: "Bóng đá, thể thao điện tử, Olympic",
    postCount: 19,
    color: "from-orange-600 to-red-600",
  },
  {
    id: 5,
    name: "Ẩm thực",
    description: "Công thức nấu ăn, review nhà hàng",
    postCount: 15,
    color: "from-pink-600 to-rose-600",
  },
  {
    id: 6,
    name: "Du lịch",
    description: "Địa điểm du lịch, kinh nghiệm",
    postCount: 23,
    color: "from-cyan-600 to-blue-600",
  },
];

const colorOptions = [
  { value: "from-blue-600 to-indigo-600", label: "Xanh dương" },
  { value: "from-purple-600 to-pink-600", label: "Tím hồng" },
  { value: "from-green-600 to-emerald-600", label: "Xanh lá" },
  { value: "from-orange-600 to-red-600", label: "Cam đỏ" },
  { value: "from-pink-600 to-rose-600", label: "Hồng" },
  { value: "from-cyan-600 to-blue-600", label: "Xanh ngọc" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: colorOptions[0]?.value ?? "from-blue-600 to-indigo-600",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat,
        ),
      );
    } else {
      const newCategory: Category = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        postCount: 0,
      };
      setCategories([...categories, newCategory]);
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      color: colorOptions[0]?.value ?? "from-blue-600 to-indigo-600",
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-500 mt-1">
            Tổ chức nội dung theo danh mục
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => {
                setEditingCategory(null);
                setFormData({
                  name: "",
                  description: "",
                  color: colorOptions[0]?.value ?? "from-blue-600 to-indigo-600",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory
                  ? "Chỉnh sửa danh mục"
                  : "Thêm danh mục mới"}
              </DialogTitle>
              <DialogDescription>
                Tạo danh mục để phân loại bài viết
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên danh mục</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Mô tả về danh mục"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Màu sắc</Label>
                <div className="grid grid-cols-3 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, color: option.value })
                      }
                      className={`h-12 rounded-lg bg-gradient-to-r ${option.value} flex items-center justify-center text-white text-sm border-2 transition-all ${
                        formData.color === option.value
                          ? "border-gray-900 scale-105"
                          : "border-transparent"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {editingCategory ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all group"
          >
            <CardContent className="p-6">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <FolderTree className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {category.postCount} bài viết
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
