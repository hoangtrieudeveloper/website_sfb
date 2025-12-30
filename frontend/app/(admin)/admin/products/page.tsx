"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Star, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductItem {
  id: number;
  categoryId?: number;
  category?: string;
  slug: string;
  name: string;
  tagline?: string;
  meta?: string;
  description?: string;
  image?: string;
  gradient?: string;
  pricing?: string;
  badge?: string | null;
  statsUsers?: string;
  statsRating?: number;
  statsDeploy?: string;
  sortOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  features?: string[];
}

interface CategoryOption {
  id: number;
  slug: string;
  name: string;
  isActive: boolean;
}

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "normal">("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApiCall<{ success: boolean; data?: ProductItem[] }>(
        AdminEndpoints.products.list,
      );
      setProducts(data?.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await adminApiCall<{
        success: boolean;
        data?: CategoryOption[];
      }>(AdminEndpoints.productCategories.list);
      setCategories(data.data || []);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
    void fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, featuredFilter, activeFilter]);

  const filteredProducts = useMemo(() => {
    const searchLower = search.toLowerCase();

    return products.filter((item) => {
      const matchesSearch =
        !searchLower ||
        item.name.toLowerCase().includes(searchLower) ||
        (item.tagline || "").toLowerCase().includes(searchLower) ||
        (item.description || "").toLowerCase().includes(searchLower);

      const matchesCategory =
        categoryFilter === "all" || item.categoryId === categoryFilter;

      const matchesFeatured =
        featuredFilter === "all"
          ? true
          : featuredFilter === "featured"
          ? !!item.isFeatured
          : !item.isFeatured;

      const matchesActive =
        activeFilter === "all"
          ? true
          : activeFilter === "active"
          ? item.isActive !== false
          : item.isActive === false;

      return matchesSearch && matchesCategory && matchesFeatured && matchesActive;
    });
  }, [products, search, categoryFilter, featuredFilter, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

  const totalProducts = products.length;
  const totalFeatured = products.filter((p) => p.isFeatured).length;
  const totalActive = products.filter((p) => p.isActive !== false).length;

  const handleCreateNew = () => {
    router.push("/admin/products/create");
  };

  const handleEdit = (item: ProductItem) => {
    router.push(`/admin/products/edit/${item.id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await adminApiCall(AdminEndpoints.products.detail(id), { method: "DELETE" });
      toast.success("Đã xóa sản phẩm");
      void fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa sản phẩm");
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await adminApiCall(AdminEndpoints.products.toggle(id), {
        method: "PATCH",
        body: JSON.stringify({ field: "active" }),
      });
      toast.success(currentActive ? "Đã ẩn sản phẩm" : "Đã hiển thị sản phẩm");
      void fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      await adminApiCall(AdminEndpoints.products.toggle(id), {
        method: "PATCH",
        body: JSON.stringify({ field: "featured" }),
      });
      toast.success(currentFeatured ? "Đã bỏ nổi bật" : "Đã đánh dấu nổi bật");
      void fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách sản phẩm và giải pháp
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo sản phẩm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sản phẩm nổi bật
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeatured}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full sm:flex-[3] sm:max-w-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10"
              />
            </div>

            <Select
              value={categoryFilter === "all" ? "all" : String(categoryFilter)}
              onValueChange={(value) =>
                setCategoryFilter(value === "all" ? "all" : Number(value))
              }
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories
                  .filter((c) => c.isActive)
                  .map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={featuredFilter}
              onValueChange={(value) =>
                setFeaturedFilter(value as "all" | "featured" | "normal")
              }
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Nổi bật" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="featured">Nổi bật</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={activeFilter}
              onValueChange={(value) =>
                setActiveFilter(value as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Đã ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách sản phẩm ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có sản phẩm nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Hình ảnh</th>
                    <th className="text-left p-2">Tên sản phẩm</th>
                    <th className="text-left p-2">Danh mục</th>
                    <th className="text-left p-2">Tagline</th>
                    <th className="text-center p-2">Trạng thái</th>
                    <th className="text-center p-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="font-medium">{product.name}</div>
                        {product.badge && (
                          <Badge variant="secondary" className="mt-1">
                            {product.badge}
                          </Badge>
                        )}
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">
                          {product.category || "Chưa phân loại"}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {product.tagline || "-"}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleActive(product.id, product.isActive !== false)
                            }
                            title={product.isActive !== false ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
                          >
                            {product.isActive !== false ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleFeatured(product.id, !!product.isFeatured)
                            }
                            title={product.isFeatured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                product.isFeatured
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

