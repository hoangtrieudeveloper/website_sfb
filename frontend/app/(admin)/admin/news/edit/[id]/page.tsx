"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NewsForm from "../../NewsForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(undefined);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/admin/news/${id}`);
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err?.message || "Không thể tải dữ liệu bài viết");
        }
        const data = await response.json();
        const news = data?.data || data;
        // Map API fields to formData shape
        setInitialData({
          title: news.title,
          excerpt: news.excerpt || "",
          category: news.category || "",
          categoryId: news.categoryId || "",
          content: news.content || "",
          status: news.status || "draft",
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
      } catch (error) {
        toast.error("Không thể tải dữ liệu bài viết");
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
      const response = await fetch(`${API_BASE}/api/admin/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || "Không thể cập nhật bài viết");
      }

      toast.success("Đã cập nhật bài viết");
      router.push("/admin/news");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật bài viết");
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

