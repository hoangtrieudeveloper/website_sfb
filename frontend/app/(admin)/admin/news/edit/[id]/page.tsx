"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NewsForm from "../../NewsForm";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(undefined);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await adminApiCall<{ data: any }>(AdminEndpoints.news.detail(Number(id)));
        const news = data?.data || data;
        // Map API fields to formData shape
        setInitialData({
          title: news.title,
          excerpt: news.excerpt || "",
          category: news.category || "",
          categoryId: news.categoryId || "",
          content: news.content || "",
          status: news.status || "draft",
          isFeatured: news.isFeatured ?? false,
          imageUrl: news.imageUrl,
          author: news.author || "SFB Technology",
          readTime: news.readTime || "5 phút đọc",
          gradient: news.gradient || "from-blue-600 to-cyan-600",
          link: news.link || "",
          publishedDate: news.publishedDate || new Date().toISOString().split("T")[0],
          seoTitle: news.seoTitle || "",
          seoDescription: news.seoDescription || "",
          seoKeywords: news.seoKeywords || "",
        });
      } catch (error: any) {
        toast.error(error?.message || "Không thể tải dữ liệu bài viết");
        router.push("/admin/news");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id, router]);

  const handleSave = async (formData: any) => {
    try {
      await adminApiCall(AdminEndpoints.news.detail(Number(id)), {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      toast.success("Đã cập nhật bài viết");
      router.push("/admin/news");
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi cập nhật bài viết");
      console.error(error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/news");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <NewsForm
      initialData={initialData}
      onSave={handleSave}
      onCancel={handleCancel}
      isEditing={true}
    />
  );
}

