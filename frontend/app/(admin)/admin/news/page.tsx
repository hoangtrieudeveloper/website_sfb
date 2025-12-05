"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";

type NewsStatus = "draft" | "published";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  status: NewsStatus;
  views: number;
  createdAt: string;
}

const initialNews: NewsItem[] = [
  {
    id: 1,
    title: "Ra mắt nền tảng SFB Cloud mới",
    category: "Công nghệ",
    status: "published",
    views: 1234,
    createdAt: "2025-12-01",
  },
  {
    id: 2,
    title: "SFB ký kết hợp tác chuyển đổi số với đối tác A",
    category: "Kinh doanh",
    status: "published",
    views: 987,
    createdAt: "2025-11-28",
  },
  {
    id: 3,
    title: "Hướng dẫn triển khai hệ thống CRM hiệu quả",
    category: "Hướng dẫn",
    status: "draft",
    views: 321,
    createdAt: "2025-11-20",
  },
];

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    content: string;
    status: NewsStatus;
    imageUrl?: string;
  }>({
    title: "",
    category: "",
    content: "",
    status: "draft",
    imageUrl: undefined,
  });

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNews) {
      setNews(
        news.map((item) =>
          item.id === editingNews.id
            ? {
                ...item,
                title: formData.title,
                category: formData.category || item.category,
                status: formData.status,
              }
            : item,
        ),
      );
    } else {
      const newItem: NewsItem = {
        id: Math.max(...news.map((n) => n.id)) + 1,
        title: formData.title,
        category: formData.category || "Tin tức",
        status: formData.status,
        views: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setNews([newItem, ...news]);
    }

    setIsDialogOpen(false);
    setEditingNews(null);
    setFormData({
      title: "",
      category: "",
      content: "",
      status: "draft",
      imageUrl: undefined,
    });
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      category: item.category,
      content: "",
      status: item.status,
      imageUrl: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setNews(news.filter((item) => item.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setNews(
      news.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "published" ? "draft" : "published",
            }
          : item,
      ),
    );
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-gray-900">Quản lý tin tức</h1>
          <p className="text-gray-500 mt-1">
            Tạo và quản lý các bài viết tin tức hiển thị trên website
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => {
                setEditingNews(null);
                setFormData({
                  title: "",
                  category: "",
                  content: "",
                  status: "draft",
                  imageUrl: undefined,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Viết bài mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
              </DialogTitle>
              <DialogDescription>
                Nội dung bài viết sẽ được hiển thị trên trang tin tức của
                website
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề bài viết"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="VD: Công nghệ, Kinh doanh..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={
                        formData.status === "draft" ? "default" : "outline"
                      }
                      className={
                        formData.status === "draft"
                          ? "bg-gray-900 hover:bg-gray-800"
                          : ""
                      }
                      onClick={() =>
                        setFormData({ ...formData, status: "draft" })
                      }
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      Bản nháp
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.status === "published" ? "default" : "outline"
                      }
                      className={
                        formData.status === "published"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                      onClick={() =>
                        setFormData({ ...formData, status: "published" })
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xuất bản
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nội dung</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Ảnh đại diện</Label>
                <ImageUpload
                  currentImage={formData.imageUrl}
                  onImageSelect={(url) =>
                    setFormData({
                      ...formData,
                      imageUrl: url ? url : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Ghi chú nội bộ (không hiển thị)</Label>
                <Textarea rows={3} placeholder="Nhập ghi chú nếu cần" />
              </div>

              <div className="flex justify-between items-center pt-4 gap-3">
                <p className="text-xs text-gray-500">
                  Lưu ý: Bài viết ở trạng thái "Bản nháp" sẽ không hiển thị với
                  người dùng.
                </p>
                <div className="flex gap-3">
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
                    {editingNews ? "Lưu thay đổi" : "Tạo bài viết"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-lg w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Danh sách bài viết</CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tiêu đề..."
              className="pl-9 bg-gray-50 border-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-3 px-4 font-medium">Tiêu đề</th>
                  <th className="py-3 px-4 font-medium">Danh mục</th>
                  <th className="py-3 px-4 font-medium">Trạng thái</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">
                    Lượt xem
                  </th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">
                    Ngày tạo
                  </th>
                  <th className="py-3 px-4 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 max-w-md">
                      <div className="text-gray-900 line-clamp-2">
                        {item.title}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-gray-50">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          item.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {item.status === "published"
                          ? "Đã xuất bản"
                          : "Bản nháp"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-gray-500">{item.createdAt}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(item.id)}
                        >
                          {item.status === "published"
                            ? "Chuyển nháp"
                            : "Xuất bản"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredNews.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                Không tìm thấy bài viết phù hợp
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
