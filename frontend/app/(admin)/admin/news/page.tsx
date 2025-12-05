"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

type NewsStatus = "draft" | "published";
type CategoryId = "product" | "company" | "tech";

interface NewsItem {
  id: number;
  title: string;
  excerpt?: string;
  category: string;
  categoryId?: CategoryId;
  status: NewsStatus;
  views: number;
  createdAt: string;
  image?: string;
  author?: string;
  readTime?: string;
  gradient?: string;
  link?: string;
}

export default function AdminNewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await adminApiCall<{ data: NewsItem[] }>(AdminEndpoints.news.list);
      setNews(data?.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách bài viết");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreateNew = () => {
    router.push("/admin/news/create");
  };

  const handleEdit = (item: NewsItem) => {
    router.push(`/admin/news/edit/${item.id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      await adminApiCall(AdminEndpoints.news.detail(id), { method: "DELETE" });
      toast.success("Đã xóa bài viết");
      fetchNews();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi khi xóa bài viết");
      console.error(error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: NewsStatus) => {
    try {
      const nextStatus = currentStatus === "published" ? "draft" : "published";
      await adminApiCall(AdminEndpoints.news.detail(id), {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });
      toast.success("Đã cập nhật trạng thái");
      fetchNews();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi khi cập nhật trạng thái");
      console.error(error);
    }
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

        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={handleCreateNew}
        >
          <Plus className="w-4 h-4 mr-2" />
          Viết bài mới
        </Button>
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
                        <span>{(item.views || 0).toLocaleString()}</span>
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
                        onClick={() => toggleStatus(item.id, item.status)}
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
