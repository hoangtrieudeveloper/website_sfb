"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NewsForm from "../NewsForm";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

export default function CreateNewsPage() {
  const router = useRouter();

  const handleSave = async (formData: any) => {
    try {
      await adminApiCall(AdminEndpoints.news.list, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success("Đã tạo bài viết mới");
      router.push("/admin/news");
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi tạo bài viết");
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

