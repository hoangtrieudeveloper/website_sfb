"use client";

import { useState, useEffect } from "react";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import { ArrowLeft, Save, Clock, User, Link as LinkIcon, FileText, Image as ImageIcon, Settings, Info, Search as SearchIcon, Calendar, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buildUrl } from "@/lib/api/base";
import MediaLibraryPicker from "./MediaLibraryPicker";

type NewsStatus = "draft" | "pending" | "approved" | "rejected" | "published";
type CategoryId = "product" | "company" | "tech";

interface NewsCategory {
  id: CategoryId;
  name: string;
  isActive?: boolean;
}

interface MediaFileItem {
  id: number;
  file_url: string;
  original_name: string;
  file_size: number;
  created_at: string;
  alt_text?: string | null;
}

const GRADIENT_OPTIONS = [
  { value: "from-blue-600 to-cyan-600", label: "Xanh dương - Cyan", preview: "bg-gradient-to-r from-blue-600 to-cyan-600" },
  { value: "from-purple-600 to-pink-600", label: "Tím - Hồng", preview: "bg-gradient-to-r from-purple-600 to-pink-600" },
  { value: "from-emerald-600 to-teal-600", label: "Xanh lá - Teal", preview: "bg-gradient-to-r from-emerald-600 to-teal-600" },
  { value: "from-orange-600 to-amber-600", label: "Cam - Vàng", preview: "bg-gradient-to-r from-orange-600 to-amber-600" },
  { value: "from-red-600 to-rose-600", label: "Đỏ - Hồng", preview: "bg-gradient-to-r from-red-600 to-rose-600" },
  { value: "from-indigo-600 to-purple-600", label: "Indigo - Tím", preview: "bg-gradient-to-r from-indigo-600 to-purple-600" },
  { value: "from-cyan-600 to-blue-600", label: "Cyan - Xanh dương", preview: "bg-gradient-to-r from-cyan-600 to-blue-600" },
];

interface NewsFormData {
  title: string;
  excerpt: string;
  category: string;
  categoryId: CategoryId | "";
  content: string;
  status: NewsStatus;
  isFeatured: boolean;
  imageUrl?: string;
  author: string;
  readTime: string;
  gradient: string;
  link: string;
  publishedDate: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface NewsFormProps {
  initialData?: Partial<NewsFormData>;
  onSave: (data: NewsFormData) => void | Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function NewsForm({ initialData, onSave, onCancel, isEditing = false }: NewsFormProps) {
  const [formData, setFormData] = useState<NewsFormData>({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    category: initialData?.category || "",
    categoryId: initialData?.categoryId || "",
    content: initialData?.content || "",
    status: (initialData?.status as NewsStatus) || "draft",
    isFeatured: initialData?.isFeatured ?? false,
    imageUrl: initialData?.imageUrl,
    author: initialData?.author || "SFB Technology",
    readTime: initialData?.readTime || "5 phút đọc",
    gradient: initialData?.gradient || "from-blue-600 to-cyan-600",
    link: initialData?.link || "",
    publishedDate: initialData?.publishedDate || new Date().toISOString().split("T")[0],
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    seoKeywords: initialData?.seoKeywords || "",
  });

  const [saving, setSaving] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await adminApiCall<{ data: any[] }>(AdminEndpoints.categories.list);
        const cats = (data?.data || data || []).map((c: any) => ({
          id: c.code,
          name: c.name,
          isActive: c.isActive !== false,
        }));
        setCategories(cats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    try {
      setSaving(true);
      await onSave(formData);
      toast.success(isEditing ? "Đã cập nhật bài viết" : "Đã tạo bài viết mới");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu bài viết");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditing ? "Cập nhật thông tin bài viết" : "Điền đầy đủ thông tin để tạo bài viết"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={saving}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Đang lưu..." : isEditing ? "Cập nhật" : "Lưu bài viết"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="content" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-white shadow-sm border rounded-xl p-1 gap-1 relative">
                <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 opacity-60" />
                <TabsTrigger
                  value="content"
                  className="relative px-4 py-2 rounded-lg text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-600 data-[state=active]:scale-[1.01] data-[state=active]:ring-2 data-[state=active]:ring-blue-200"
                >
                  Nội dung
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="relative px-4 py-2 rounded-lg text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-600 data-[state=active]:scale-[1.01] data-[state=active]:ring-2 data-[state=active]:ring-blue-200"
                >
                  SEO & Cài đặt
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Nội dung */}
            <TabsContent value="content" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <div className="lg:col-span-8 space-y-4 lg:space-y-5">
                  {/* Block 1: Thông tin cơ bản */}
                  <Card className="border border-gray-100 shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">
                          Tiêu đề bài viết <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          placeholder="Nhập tiêu đề bài viết..."
                          required
                          className="text-base"
                        />
                        <p className="text-xs text-gray-500">
                          Tiêu đề sẽ hiển thị nổi bật trên trang tin tức
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-sm font-semibold">
                          Mô tả ngắn (Excerpt)
                        </Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) =>
                            setFormData({ ...formData, excerpt: e.target.value })
                          }
                          placeholder="Nhập mô tả ngắn về nội dung bài viết (hiển thị dưới tiêu đề)..."
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Mô tả này sẽ hiển thị trong danh sách tin tức
                          </p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            formData.excerpt.length > 200 
                              ? 'text-red-600 bg-red-50' 
                              : formData.excerpt.length > 150
                              ? 'text-yellow-600 bg-yellow-50'
                              : 'text-gray-400 bg-gray-50'
                          }`}>
                            {formData.excerpt.length}/200
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryId" className="text-sm font-semibold">
                            Danh mục <span className="text-red-500">*</span>
                          </Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value: CategoryId) => {
                          const selectedCategory = categories.find(
                            (c) => c.id === value && c.isActive !== false,
                          );
                          setFormData({
                            ...formData,
                            categoryId: value,
                            category: selectedCategory?.name || "",
                          });
                        }}
                        disabled={loadingCategories}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCategories ? "Đang tải..." : "Chọn danh mục"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((cat) => cat.isActive !== false)
                            .map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="link" className="text-sm font-semibold">
                            <LinkIcon className="w-3 h-3 inline mr-1" />
                            Đường dẫn (Slug)
                          </Label>
                          <Input
                            id="link"
                            value={formData.link}
                            onChange={(e) =>
                              setFormData({ ...formData, link: e.target.value })
                            }
                            placeholder="/news-detail hoặc để trống"
                          />
                          <p className="text-xs text-gray-500">
                            Đường dẫn tùy chỉnh cho bài viết (tùy chọn)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="publishedDate" className="text-sm font-semibold">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Ngày xuất bản
                        </Label>
                        <Input
                          id="publishedDate"
                          type="date"
                          value={formData.publishedDate}
                          onChange={(e) =>
                            setFormData({ ...formData, publishedDate: e.target.value })
                          }
                          className="w-full max-w-xs"
                        />
                        <p className="text-xs text-gray-500">
                          Ngày hiển thị bài viết trên website (mặc định: hôm nay)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onCheckedChange={(checked: boolean) =>
                            setFormData({ ...formData, isFeatured: checked })
                          }
                        />
                        <Label htmlFor="isFeatured" className="text-sm font-semibold">
                          Bài viết nổi bật
                        </Label>
                        <span className="text-xs text-gray-500">
                          Hiển thị tại khu vực nổi bật nếu bật
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Block 2: Nội dung */}
                  <Card className="border border-gray-100 shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Nội dung bài viết</h2>
                        <span className="text-red-500 text-sm">*</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        <div className="border rounded-lg min-h-[360px]">
                          <RichTextEditor
                            value={formData.content}
                            onChange={(value) =>
                              setFormData({ ...formData, content: value })
                            }
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Sử dụng trình soạn thảo để tạo nội dung bài viết với định dạng phong phú
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-4 space-y-4 lg:space-y-5">
                  {/* Block 3: Hình ảnh */}
                  <Card className="border border-gray-100 shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Hình ảnh đại diện</h2>
                        <span className="text-red-500 text-sm">*</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {formData.imageUrl ? (
                          <div
                            className="inline-block relative group cursor-pointer"
                            onClick={() => setShowImageDialog(true)}
                          >
                            <img
                              src={
                                formData.imageUrl.startsWith("/")
                                  ? buildUrl(formData.imageUrl)
                                  : formData.imageUrl
                              }
                              alt="Ảnh đại diện"
                              className="w-64 h-40 md:w-72 md:h-44 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({
                                  ...formData,
                                  imageUrl: "",
                                });
                              }}
                            >
                              <span className="text-xs font-semibold">✕</span>
                            </button>
                            <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                              <span className="text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Thay đổi ảnh
                              </span>
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-40 flex flex-col items-center justify-center gap-2 border-dashed"
                            onClick={() => setShowImageDialog(true)}
                          >
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-700">Chọn ảnh bìa cho bài viết</span>
                            <span className="text-xs text-gray-500">Từ thư viện hoặc tải lên từ máy</span>
                          </Button>
                        )}
                        <p className="text-xs text-gray-500">
                          Khuyến nghị: 1200x600px
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: SEO & Cài đặt */}
            <TabsContent value="seo" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <div className="lg:col-span-8 space-y-4 lg:space-y-5">
                  {/* Block SEO */}
                  <Card className="border border-gray-100 shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center gap-2">
                        <SearchIcon className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Tối ưu hóa SEO</h2>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Banner hướng dẫn SEO */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-3 shadow-sm">
                        <div className="flex items-start gap-2">
                          <div className="bg-blue-100 rounded-full p-1.5">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-blue-900 mb-1">
                              Tối ưu hóa SEO
                            </p>
                            <p className="text-xs text-blue-700 leading-relaxed">
                              Điền đầy đủ thông tin SEO để bài viết dễ dàng được tìm thấy trên Google. Nhấn "Tự động" để sử dụng tiêu đề và mô tả hiện có.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="seoTitle" className="text-sm font-semibold">
                              Tiêu đề SEO
                            </Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                if (formData.title) {
                                  const autoTitle = formData.title.length > 60 
                                    ? formData.title.substring(0, 57) + "..."
                                    : formData.title;
                                  setFormData({ ...formData, seoTitle: autoTitle });
                                }
                              }}
                              disabled={!formData.title}
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              Tự động
                            </Button>
                          </div>
                          <Input
                            id="seoTitle"
                            value={formData.seoTitle}
                            onChange={(e) =>
                              setFormData({ ...formData, seoTitle: e.target.value })
                            }
                            placeholder={formData.title ? `Tự động: ${formData.title.substring(0, 40)}...` : "Nhập tiêu đề SEO..."}
                            maxLength={60}
                            className="text-sm"
                          />
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              Khuyến nghị: 50-60 ký tự
                            </p>
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                              formData.seoTitle.length > 60 
                                ? 'text-red-600 bg-red-50' 
                                : formData.seoTitle.length >= 50 && formData.seoTitle.length <= 60
                                ? 'text-green-600 bg-green-50'
                                : formData.seoTitle.length > 0
                                ? 'text-yellow-600 bg-yellow-50'
                                : 'text-gray-400 bg-gray-50'
                            }`}>
                              {formData.seoTitle.length}/60
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="seoDescription" className="text-sm font-semibold">
                              Mô tả SEO
                            </Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                if (formData.excerpt) {
                                  const autoDesc = formData.excerpt.length > 160
                                    ? formData.excerpt.substring(0, 157) + "..."
                                    : formData.excerpt;
                                  setFormData({ ...formData, seoDescription: autoDesc });
                                }
                              }}
                              disabled={!formData.excerpt}
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              Tự động
                            </Button>
                          </div>
                          <Textarea
                            id="seoDescription"
                            value={formData.seoDescription}
                            onChange={(e) =>
                              setFormData({ ...formData, seoDescription: e.target.value })
                            }
                            placeholder={formData.excerpt ? `Tự động: ${formData.excerpt.substring(0, 60)}...` : "Nhập mô tả SEO..."}
                            rows={3}
                            maxLength={160}
                            className="resize-none text-sm"
                          />
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              Khuyến nghị: 150-160 ký tự
                            </p>
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                              formData.seoDescription.length > 160 
                                ? 'text-red-600 bg-red-50' 
                                : formData.seoDescription.length >= 150 && formData.seoDescription.length <= 160
                                ? 'text-green-600 bg-green-50'
                                : formData.seoDescription.length > 0
                                ? 'text-yellow-600 bg-yellow-50'
                                : 'text-gray-400 bg-gray-50'
                            }`}>
                              {formData.seoDescription.length}/160
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="seoKeywords" className="text-sm font-semibold">
                            Từ khóa SEO
                          </Label>
                          <Input
                            id="seoKeywords"
                            value={formData.seoKeywords}
                            onChange={(e) =>
                              setFormData({ ...formData, seoKeywords: e.target.value })
                            }
                            placeholder="từ khóa 1, từ khóa 2..."
                            className="text-sm"
                          />
                          <p className="text-xs text-gray-500">
                            Phân cách bằng dấu phẩy
                          </p>
                        </div>

                        {/* Preview SEO */}
                        {(formData.seoTitle || formData.seoDescription) && (
                          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Xem trước:</p>
                            <div className="space-y-1">
                              <div className="text-xs text-blue-600 font-medium line-clamp-1">
                                {formData.seoTitle || formData.title || "Tiêu đề bài viết"}
                              </div>
                              <div className="text-xs text-green-700">
                                {formData.link || "/news/..."}
                              </div>
                              <div className="text-xs text-gray-600 line-clamp-2">
                                {formData.seoDescription || formData.excerpt || "Mô tả bài viết..."}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-4 space-y-4 lg:space-y-5">
                  {/* Block Cài đặt */}
                  <Card className="border border-gray-100 shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Cài đặt</h2>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="author" className="text-sm font-semibold">
                          <User className="w-3 h-3 inline mr-1" />
                          Tác giả
                        </Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) =>
                            setFormData({ ...formData, author: e.target.value })
                          }
                          placeholder="SFB Technology"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="readTime" className="text-sm font-semibold">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Thời gian đọc
                        </Label>
                        <Input
                          id="readTime"
                          value={formData.readTime}
                          onChange={(e) =>
                            setFormData({ ...formData, readTime: e.target.value })
                          }
                          placeholder="5 phút đọc"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gradient" className="text-sm font-semibold">
                          Màu gradient
                        </Label>
                        <Select
                          value={formData.gradient}
                          onValueChange={(value) =>
                            setFormData({ ...formData, gradient: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADIENT_OPTIONS.map((grad) => (
                              <SelectItem key={grad.value} value={grad.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded ${grad.preview}`} />
                                  <span>{grad.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 pt-3 border-t">
                        <Label className="text-sm font-semibold">Trạng thái</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: NewsStatus) =>
                            setFormData({ ...formData, status: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Bản nháp</SelectItem>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="approved">Đã duyệt</SelectItem>
                            <SelectItem value="rejected">Từ chối</SelectItem>
                            <SelectItem value="published">Xuất bản</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          Chọn trạng thái: Nháp, Chờ duyệt, Đã duyệt, Từ chối, Xuất bản.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>

      {/* Image picker dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent
          className="w-full h-[80vh] flex flex-col"
          style={{ maxWidth: "72rem" }}
        >
          <DialogHeader>
            <DialogTitle>Chọn ảnh bìa cho bài viết</DialogTitle>
            <DialogDescription>
              Bạn có thể chọn ảnh từ thư viện Media hoặc tải ảnh mới từ máy tính.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="library" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <TabsList className="bg-gray-100 border rounded-xl p-1 gap-1">
                <TabsTrigger value="library">Thư viện file</TabsTrigger>
                <TabsTrigger value="upload">Upload từ máy</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="library"
              className="flex-1 flex flex-col mt-0 overflow-y-auto"
            >
              <MediaLibraryPicker
                onSelectImage={(url) => {
                  setFormData({
                    ...formData,
                    imageUrl: url,
                  });
                  setShowImageDialog(false);
                }}
              />
            </TabsContent>

            <TabsContent value="upload" className="flex-1 mt-0">
              <div className="w-full">
                <ImageUpload
                  currentImage={formData.imageUrl}
                  onImageSelect={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: url,
                    }));
                    // Không đóng popup để người dùng xem thông tin ảnh
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowImageDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

