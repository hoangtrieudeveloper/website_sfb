"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NewsForm from "../NewsForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CreateNewsPage() {
  const router = useRouter();

  const handleSave = async (formData: any) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || "Không thể tạo bài viết");
      }

      toast.success("Đã tạo bài viết mới");
      router.push("/admin/news");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo bài viết");
      console.error(error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/news");
  };

  return (
    <NewsForm
      initialData={undefined}
      onSave={handleSave}
      onCancel={handleCancel}
      isEditing={false}
    />
  );
}

