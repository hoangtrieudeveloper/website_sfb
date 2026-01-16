"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Star, Package, Save, ChevronUp, ChevronDown, X, CheckCircle2, Target, Award, FolderTree, MessageSquare, Phone, Languages, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import { LocaleInput } from "@/components/admin/LocaleInput";
import { getLocaleValue, setLocaleValue, migrateObjectToLocale } from "@/lib/utils/locale-admin";
import { getLocalizedText } from "@/lib/utils/i18n";
import { useTranslationControls } from "@/lib/hooks/useTranslationControls";
import { AIProviderSelector } from "@/components/admin/AIProviderSelector";

type Locale = 'vi' | 'en' | 'ja';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface ProductItem {
  id: number;
  categoryId?: number;
  category?: string | Record<Locale, string>;
  slug: string;
  name: string | Record<Locale, string>;
  tagline?: string | Record<Locale, string>;
  meta?: string;
  description?: string | Record<Locale, string>;
  image?: string;
  gradient?: string;
  pricing?: string | Record<Locale, string>;
  badge?: string | Record<Locale, string> | null;
  statsUsers?: string | Record<Locale, string>;
  statsRating?: number;
  statsDeploy?: string | Record<Locale, string>;
  sortOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  publishedAt?: string;
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

interface HeroFormData {
  title: string | Record<Locale, string>;
  subtitle: string | Record<Locale, string>;
  description: string | Record<Locale, string>;
  primaryCtaText: string | Record<Locale, string>;
  primaryCtaLink: string;
  secondaryCtaText: string | Record<Locale, string>;
  secondaryCtaLink: string;
  stat1Label: string | Record<Locale, string>;
  stat1Value: string | Record<Locale, string>;
  stat2Label: string | Record<Locale, string>;
  stat2Value: string | Record<Locale, string>;
  stat3Label: string | Record<Locale, string>;
  stat3Value: string | Record<Locale, string>;
  backgroundGradient: string;
  isActive: boolean;
}

interface Benefit {
  id: number;
  icon: string;
  title: string | Record<Locale, string>;
  description: string | Record<Locale, string>;
  gradient: string;
  sortOrder: number;
  isActive: boolean;
}

interface Category {
  id: number;
  slug: string;
  name: string | Record<Locale, string>;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
}

interface ListHeaderFormData {
  subtitle: string | Record<Locale, string>;
  title: string | Record<Locale, string>;
  description: string | Record<Locale, string>;
  isActive: boolean;
}

interface CtaFormData {
  title: string | Record<Locale, string>;
  description: string | Record<Locale, string>;
  primaryButtonText: string | Record<Locale, string>;
  primaryButtonLink: string;
  secondaryButtonText: string | Record<Locale, string>;
  secondaryButtonLink: string;
  backgroundColor: string;
  isActive: boolean;
}

interface Testimonial {
  id: number;
  quote: string | Record<Locale, string>;
  author: string | Record<Locale, string>;
  company?: string | Record<Locale, string>;
  rating: number;
  sortOrder: number;
  isActive: boolean;
}

const PAGE_SIZE = 10;

// Danh sách icon names từ lucide-react
const ICON_OPTIONS = [
  "Code2",
  "MonitorSmartphone",
  "Network",
  "Globe2",
  "ShieldCheck",
  "Users",
  "Award",
  "Target",
  "Sparkles",
  "ArrowRight",
  "Phone",
  "Package",
  "Settings",
  "Database",
  "Cloud",
  "Server",
  "Cpu",
  "HardDrive",
];

const GRADIENT_OPTIONS = [
  { value: "linear-gradient(to bottom right, #0870B4, #2EABE2)", label: "Xanh dương SFB" },
  { value: "linear-gradient(to bottom right, #8B5CF6, #EC4899)", label: "Tím - Hồng" },
  { value: "linear-gradient(to bottom right, #10B981, #14B8A6)", label: "Xanh lá - Teal" },
  { value: "linear-gradient(to bottom right, #F59E0B, #FBBF24)", label: "Cam - Vàng" },
  { value: "linear-gradient(to bottom right, #EF4444, #F43F5E)", label: "Đỏ - Hồng" },
  { value: "linear-gradient(to bottom right, #6366F1, #8B5CF6)", label: "Indigo - Tím" },
];

export default function AdminProductsPage() {
  const router = useRouter();
  
  // Use translation controls hook
  const {
    globalLocale,
    setGlobalLocale,
    aiProvider,
    setAiProvider,
    translatingAll,
    translateSourceLang,
    setTranslateSourceLang,
    translateData
  } = useTranslationControls();
  
  // Products List State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "normal">("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Hero State
  const [heroData, setHeroData] = useState<HeroFormData>({
    title: { vi: '', en: '', ja: '' },
    subtitle: { vi: '', en: '', ja: '' },
    description: { vi: '', en: '', ja: '' },
    primaryCtaText: { vi: '', en: '', ja: '' },
    primaryCtaLink: "",
    secondaryCtaText: { vi: '', en: '', ja: '' },
    secondaryCtaLink: "",
    stat1Label: { vi: '', en: '', ja: '' },
    stat1Value: { vi: '', en: '', ja: '' },
    stat2Label: { vi: '', en: '', ja: '' },
    stat2Value: { vi: '', en: '', ja: '' },
    stat3Label: { vi: '', en: '', ja: '' },
    stat3Value: { vi: '', en: '', ja: '' },
    backgroundGradient: GRADIENT_OPTIONS[0].value,
    isActive: true,
  });
  const [loadingHero, setLoadingHero] = useState(false);

  // Benefits State
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loadingBenefits, setLoadingBenefits] = useState(false);
  const [editingBenefitId, setEditingBenefitId] = useState<number | null>(null);
  const [benefitFormData, setBenefitFormData] = useState<Partial<Benefit>>({});
  const [benefitModalOpen, setBenefitModalOpen] = useState(false);

  // Categories State
  const [categoriesForManagement, setCategoriesForManagement] = useState<Category[]>([]);
  const [loadingCategoriesForManagement, setLoadingCategoriesForManagement] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({});
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // List Header State
  const [listHeaderData, setListHeaderData] = useState<ListHeaderFormData>({
    subtitle: { vi: '', en: '', ja: '' },
    title: { vi: '', en: '', ja: '' },
    description: { vi: '', en: '', ja: '' },
    isActive: true,
  });
  const [loadingListHeader, setLoadingListHeader] = useState(false);

  // CTA State
  const [ctaData, setCtaData] = useState<CtaFormData>({
    title: { vi: '', en: '', ja: '' },
    description: { vi: '', en: '', ja: '' },
    primaryButtonText: { vi: '', en: '', ja: '' },
    primaryButtonLink: "",
    secondaryButtonText: { vi: '', en: '', ja: '' },
    secondaryButtonLink: "",
    backgroundColor: "#29A3DD",
    isActive: true,
  });
  const [loadingCta, setLoadingCta] = useState(false);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState<Partial<Testimonial>>({});
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [testimonialsTitle, setTestimonialsTitle] = useState("Khách hàng nói về SFB?");

  // Active tab state (persist to localStorage)
  const [activeMainTab, setActiveMainTab] = useState<string>("hero");
  
  // Initialize from localStorage on client side only
  useEffect(() => {
    const saved = localStorage.getItem("products_active_main_tab");
    if (saved) {
      setActiveMainTab(saved);
    }
  }, []);

  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("products_active_sub_tabs");
      return saved ? JSON.parse(saved) : { hero: "config", benefits: "config", categories: "config", testimonials: "config", cta: "config", products: "config" };
    }
    return { hero: "config", benefits: "config", categories: "config", testimonials: "config", cta: "config", products: "config" };
  });

  // Collapse state for config blocks (default: all hidden)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({
    heroSection: true,
    categoriesList: true,
    testimonialsList: true,
    ctaConfig: true,
    productsListHeader: true,
    productsList: true,
  });

  const toggleBlock = (blockKey: string) => {
    setCollapsedBlocks(prev => ({
      ...prev,
      [blockKey]: !prev[blockKey]
    }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("products_active_main_tab", activeMainTab);
    }
  }, [activeMainTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("products_active_sub_tabs", JSON.stringify(activeSubTabs));
    }
  }, [activeSubTabs]);

  // Tab configuration with descriptions
  const tabsConfig = [
    {
      value: "hero",
      label: "Hero Banner",
      description: "Banner đầu trang với tiêu đề..",
      icon: Target,
    },
    {
      value: "benefits",
      label: "Lợi ích Sản phẩm",
      description: "Quản lý các lợi ích..",
      icon: Award,
    },
    {
      value: "categories",
      label: "Danh mục",
      description: "Quản lý danh mục sản phẩm..",
      icon: FolderTree,
    },
    {
      value: "testimonials",
      label: "Khách hàng nói về SFB",
      description: "Đánh giá từ khách hàng..",
      icon: MessageSquare,
    },
    {
      value: "cta",
      label: "CTA",
      description: "Phần kêu gọi hành động..",
      icon: Phone,
    },
    {
      value: "products",
      label: "Danh sách Sản phẩm",
      description: "Quản lý danh sách sản phẩm..",
      icon: Package,
    },
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveMainTab(value);
  };

  // Fetch functions
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApiCall<{ success: boolean; data?: ProductItem[] }>(
        AdminEndpoints.products.list,
      );
      setProducts(data?.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách sản phẩm");
      // Silently fail
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
      // Silently fail
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchHero = async () => {
    try {
      setLoadingHero(true);
      const data = await adminApiCall<{ success: boolean; data?: HeroFormData }>(
        AdminEndpoints.productHero.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedHero = migrateObjectToLocale(data.data);
        // Đảm bảo backgroundGradient là string, không phải locale object
        if (normalizedHero.backgroundGradient && typeof normalizedHero.backgroundGradient === 'object' && !Array.isArray(normalizedHero.backgroundGradient)) {
          if ('vi' in normalizedHero.backgroundGradient || 'en' in normalizedHero.backgroundGradient || 'ja' in normalizedHero.backgroundGradient) {
            normalizedHero.backgroundGradient = (normalizedHero.backgroundGradient as any).vi || (normalizedHero.backgroundGradient as any).en || GRADIENT_OPTIONS[0].value;
          }
        }
        // Đảm bảo các link là string
        if (normalizedHero.primaryCtaLink && typeof normalizedHero.primaryCtaLink === 'object' && !Array.isArray(normalizedHero.primaryCtaLink)) {
          if ('vi' in normalizedHero.primaryCtaLink || 'en' in normalizedHero.primaryCtaLink || 'ja' in normalizedHero.primaryCtaLink) {
            normalizedHero.primaryCtaLink = (normalizedHero.primaryCtaLink as any).vi || (normalizedHero.primaryCtaLink as any).en || '';
          }
        }
        if (normalizedHero.secondaryCtaLink && typeof normalizedHero.secondaryCtaLink === 'object' && !Array.isArray(normalizedHero.secondaryCtaLink)) {
          if ('vi' in normalizedHero.secondaryCtaLink || 'en' in normalizedHero.secondaryCtaLink || 'ja' in normalizedHero.secondaryCtaLink) {
            normalizedHero.secondaryCtaLink = (normalizedHero.secondaryCtaLink as any).vi || (normalizedHero.secondaryCtaLink as any).en || '';
          }
        }
        setHeroData(normalizedHero as HeroFormData);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải hero");
    } finally {
      setLoadingHero(false);
    }
  };

  const fetchBenefits = async () => {
    try {
      setLoadingBenefits(true);
      const data = await adminApiCall<{ success: boolean; data?: Benefit[] }>(
        AdminEndpoints.productBenefits.list,
      );
      // Normalize dữ liệu để đảm bảo các field luôn là locale object
      const normalizedBenefits = (data.data || []).map(benefit => {
        const normalized = migrateObjectToLocale(benefit);
        // Đảm bảo icon, gradient không bị convert thành locale object
        return {
          ...normalized,
          icon: benefit.icon || '',
          gradient: benefit.gradient || '',
          sortOrder: benefit.sortOrder ?? 0,
          isActive: benefit.isActive ?? true
        };
      });
      setBenefits(normalizedBenefits);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách lợi ích");
    } finally {
      setLoadingBenefits(false);
    }
  };

  const fetchCategoriesForManagement = async () => {
    try {
      setLoadingCategoriesForManagement(true);
      const data = await adminApiCall<{ success: boolean; data?: Category[] }>(
        AdminEndpoints.productCategories.list,
      );
      // Normalize dữ liệu để đảm bảo các field luôn là locale object
      const normalizedCategories = (data.data || []).map(category => {
        const normalized = migrateObjectToLocale(category);
        // Đảm bảo slug, iconName không bị convert thành locale object
        return {
          ...normalized,
          slug: category.slug || '',
          iconName: category.iconName || 'Package',
          sortOrder: category.sortOrder ?? 0,
          isActive: category.isActive ?? true
        };
      });
      setCategoriesForManagement(normalizedCategories);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách danh mục");
    } finally {
      setLoadingCategoriesForManagement(false);
    }
  };

  const fetchListHeader = async () => {
    try {
      setLoadingListHeader(true);
      const data = await adminApiCall<{ success: boolean; data?: ListHeaderFormData }>(
        AdminEndpoints.productListHeader.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedHeader = migrateObjectToLocale(data.data);
        setListHeaderData(normalizedHeader as ListHeaderFormData);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải list header");
    } finally {
      setLoadingListHeader(false);
    }
  };

  const fetchCta = async () => {
    try {
      setLoadingCta(true);
      const data = await adminApiCall<{ success: boolean; data?: CtaFormData }>(
        AdminEndpoints.productCta.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedCta = migrateObjectToLocale(data.data);
        // Đảm bảo primaryButtonLink, secondaryButtonLink, backgroundColor là string
        if (normalizedCta.primaryButtonLink && typeof normalizedCta.primaryButtonLink === 'object' && !Array.isArray(normalizedCta.primaryButtonLink)) {
          if ('vi' in normalizedCta.primaryButtonLink || 'en' in normalizedCta.primaryButtonLink || 'ja' in normalizedCta.primaryButtonLink) {
            normalizedCta.primaryButtonLink = (normalizedCta.primaryButtonLink as any).vi || (normalizedCta.primaryButtonLink as any).en || '';
          }
        }
        if (normalizedCta.secondaryButtonLink && typeof normalizedCta.secondaryButtonLink === 'object' && !Array.isArray(normalizedCta.secondaryButtonLink)) {
          if ('vi' in normalizedCta.secondaryButtonLink || 'en' in normalizedCta.secondaryButtonLink || 'ja' in normalizedCta.secondaryButtonLink) {
            normalizedCta.secondaryButtonLink = (normalizedCta.secondaryButtonLink as any).vi || (normalizedCta.secondaryButtonLink as any).en || '';
          }
        }
        if (normalizedCta.backgroundColor && typeof normalizedCta.backgroundColor === 'object' && !Array.isArray(normalizedCta.backgroundColor)) {
          if ('vi' in normalizedCta.backgroundColor || 'en' in normalizedCta.backgroundColor || 'ja' in normalizedCta.backgroundColor) {
            normalizedCta.backgroundColor = (normalizedCta.backgroundColor as any).vi || (normalizedCta.backgroundColor as any).en || '#29A3DD';
          }
        }
        setCtaData(normalizedCta as CtaFormData);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải CTA");
    } finally {
      setLoadingCta(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoadingTestimonials(true);
      const data = await adminApiCall<{ success: boolean; data?: Testimonial[] }>(
        AdminEndpoints.testimonials.list,
      );
      // Normalize dữ liệu để đảm bảo các field luôn là locale object
      const normalizedTestimonials = (data.data || []).map(testimonial => {
        const normalized = migrateObjectToLocale(testimonial);
        // Đảm bảo rating, sortOrder, isActive không bị convert thành locale object
        return {
          ...normalized,
          rating: testimonial.rating ?? 5,
          sortOrder: testimonial.sortOrder ?? 0,
          isActive: testimonial.isActive ?? true
        };
      });
      setTestimonials(normalizedTestimonials);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách đánh giá");
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
    void fetchCategories();
    void fetchHero();
    void fetchBenefits();
    void fetchCategoriesForManagement();
    void fetchListHeader();
    void fetchCta();
    void fetchTestimonials();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, featuredFilter, activeFilter]);

  // Products handlers
  const filteredProducts = useMemo(() => {
    const searchLower = search.toLowerCase();

    return products.filter((item) => {
      // Extract string values from locale objects for search
      const nameStr = typeof item.name === 'string' ? item.name : (item.name?.vi || item.name?.en || item.name?.ja || '');
      const taglineStr = typeof item.tagline === 'string' ? item.tagline : (item.tagline?.vi || item.tagline?.en || item.tagline?.ja || '');
      const descriptionStr = typeof item.description === 'string' ? item.description : (item.description?.vi || item.description?.en || item.description?.ja || '');

      const matchesSearch =
        !searchLower ||
        nameStr.toLowerCase().includes(searchLower) ||
        taglineStr.toLowerCase().includes(searchLower) ||
        descriptionStr.toLowerCase().includes(searchLower);

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

  const handleEdit = useCallback((item: ProductItem) => {
    router.push(`/admin/products/edit/${item.id}`);
  }, [router]);

  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await adminApiCall(AdminEndpoints.products.detail(id), { method: "DELETE" });
      toast.success("Đã xóa sản phẩm");
      void fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa sản phẩm");
    }
  }, []);

  const handleToggleActive = useCallback(async (id: number, currentActive: boolean) => {
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
  }, []);

  const handleToggleFeatured = useCallback(async (id: number, currentFeatured: boolean) => {
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
  }, []);

  // Hero handlers
  const handleSaveHero = async () => {
    try {
      setLoadingHero(true);
      
      // Fetch current data from backend to preserve fields not in form
      let currentData = heroData;
      try {
        const response = await adminApiCall<{ success: boolean; data?: HeroFormData }>(
          AdminEndpoints.productHero.get,
        );
        if (response?.data) {
          currentData = response.data;
        }
      } catch (error) {
        // If fetch fails, use current state
        // Silently fail
      }

      // Merge: prioritize form values if they are not empty, otherwise use existing values
      const dataToSave: HeroFormData = {
        title: heroData.title || (currentData?.title || { vi: '', en: '', ja: '' }),
        subtitle: heroData.subtitle || (currentData?.subtitle || { vi: '', en: '', ja: '' }),
        description: heroData.description || (currentData?.description || { vi: '', en: '', ja: '' }),
        primaryCtaText: heroData.primaryCtaText || (currentData?.primaryCtaText || { vi: '', en: '', ja: '' }),
        primaryCtaLink: heroData.primaryCtaLink || (currentData?.primaryCtaLink || ''),
        secondaryCtaText: heroData.secondaryCtaText || (currentData?.secondaryCtaText || { vi: '', en: '', ja: '' }),
        secondaryCtaLink: heroData.secondaryCtaLink || (currentData?.secondaryCtaLink || ''),
        stat1Label: heroData.stat1Label || (currentData?.stat1Label || { vi: '', en: '', ja: '' }),
        stat1Value: heroData.stat1Value || (currentData?.stat1Value || { vi: '', en: '', ja: '' }),
        stat2Label: heroData.stat2Label || (currentData?.stat2Label || { vi: '', en: '', ja: '' }),
        stat2Value: heroData.stat2Value || (currentData?.stat2Value || { vi: '', en: '', ja: '' }),
        stat3Label: heroData.stat3Label || (currentData?.stat3Label || { vi: '', en: '', ja: '' }),
        stat3Value: heroData.stat3Value || (currentData?.stat3Value || { vi: '', en: '', ja: '' }),
        backgroundGradient: heroData.backgroundGradient || (currentData?.backgroundGradient || GRADIENT_OPTIONS[0].value),
        isActive: heroData.isActive !== undefined ? heroData.isActive : (currentData?.isActive !== undefined ? currentData.isActive : true),
      };

      await adminApiCall(AdminEndpoints.productHero.update, {
        method: "PUT",
        body: JSON.stringify(dataToSave),
      });
      toast.success("Đã lưu hero section thành công");
      void fetchHero();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi khi lưu hero section");
    } finally {
      setLoadingHero(false);
    }
  };

  // Translation handlers for sections
  const handleTranslateSection = async (section: 'hero' | 'benefits' | 'categories' | 'listHeader' | 'cta' | 'testimonials') => {
    let dataToTranslate: any;
    let updateCallback: (translatedData: any) => void;
    let sectionName: string;

    // Prepare data and update callback based on section
    if (section === 'hero') {
      // Loại bỏ các trường không cần dịch: primaryCtaLink, secondaryCtaLink, backgroundGradient, isActive
      const { primaryCtaLink, secondaryCtaLink, backgroundGradient, isActive, ...dataToTranslateFields } = heroData;
      dataToTranslate = dataToTranslateFields;
      updateCallback = (translated: any) => {
        setHeroData({
          ...translated,
          primaryCtaLink,
          secondaryCtaLink,
          backgroundGradient,
          isActive
        } as HeroFormData);
      };
      sectionName = 'Hero Banner';
    } else if (section === 'benefits') {
      // Loại bỏ các trường không cần dịch: icon, gradient, sortOrder, isActive
      const translatedBenefits = benefits.map((benefit: any) => {
        const { icon, gradient, sortOrder, isActive, ...benefitFields } = benefit;
        return benefitFields;
      });
      dataToTranslate = { benefits: translatedBenefits };
      updateCallback = (translated: any) => {
        // Giữ nguyên icon, gradient, sortOrder, isActive của benefits
        const updatedBenefits = translated.benefits.map((benefit: any, index: number) => ({
          ...benefit,
          icon: benefits[index]?.icon || '',
          gradient: benefits[index]?.gradient || '',
          sortOrder: benefits[index]?.sortOrder ?? index,
          isActive: benefits[index]?.isActive ?? true
        }));
        setBenefits(updatedBenefits);
      };
      sectionName = 'Lợi ích Sản phẩm';
    } else if (section === 'categories') {
      // Loại bỏ các trường không cần dịch: slug, iconName, sortOrder, isActive
      const translatedCategories = categoriesForManagement.map((category: any) => {
        const { slug, iconName, sortOrder, isActive, ...categoryFields } = category;
        return categoryFields;
      });
      dataToTranslate = { categories: translatedCategories };
      updateCallback = (translated: any) => {
        // Giữ nguyên slug, iconName, sortOrder, isActive của categories
        const updatedCategories = translated.categories.map((category: any, index: number) => ({
          ...category,
          slug: categoriesForManagement[index]?.slug || '',
          iconName: categoriesForManagement[index]?.iconName || 'Package',
          sortOrder: categoriesForManagement[index]?.sortOrder ?? index,
          isActive: categoriesForManagement[index]?.isActive ?? true
        }));
        setCategoriesForManagement(updatedCategories);
      };
      sectionName = 'Danh mục';
    } else if (section === 'listHeader') {
      dataToTranslate = listHeaderData;
      updateCallback = (translated: any) => {
        setListHeaderData(translated as ListHeaderFormData);
      };
      sectionName = 'Header Danh sách Sản phẩm';
    } else if (section === 'cta') {
      // Loại bỏ các trường không cần dịch: primaryButtonLink, secondaryButtonLink, backgroundColor, isActive
      const { primaryButtonLink, secondaryButtonLink, backgroundColor, isActive, ...dataWithoutLinks } = ctaData;
      dataToTranslate = dataWithoutLinks;
      updateCallback = (translated: any) => {
        // Giữ nguyên các giá trị link, backgroundColor, isActive khi cập nhật dữ liệu đã dịch
        setCtaData({
          ...translated,
          primaryButtonLink,
          secondaryButtonLink,
          backgroundColor,
          isActive
        } as CtaFormData);
      };
      sectionName = 'CTA';
    } else if (section === 'testimonials') {
      // Loại bỏ các trường không cần dịch: rating, sortOrder, isActive
      const translatedTestimonials = testimonials.map((testimonial: any) => {
        const { rating, sortOrder, isActive, ...testimonialFields } = testimonial;
        return testimonialFields;
      });
      dataToTranslate = { testimonials: translatedTestimonials };
      updateCallback = (translated: any) => {
        // Giữ nguyên rating, sortOrder, isActive của testimonials
        const updatedTestimonials = translated.testimonials.map((testimonial: any, index: number) => ({
          ...testimonial,
          rating: testimonials[index]?.rating ?? 5,
          sortOrder: testimonials[index]?.sortOrder ?? index,
          isActive: testimonials[index]?.isActive ?? true
        }));
        setTestimonials(updatedTestimonials);
      };
      sectionName = 'Khách hàng nói về SFB';
    } else {
      return;
    }

    // Use translateData from hook
    await translateData(dataToTranslate, updateCallback, sectionName);
  };

  // Benefits handlers
  const handleCreateBenefit = () => {
    setEditingBenefitId(-1);
    setBenefitFormData({
      icon: "",
      title: { vi: '', en: '', ja: '' },
      description: { vi: '', en: '', ja: '' },
      gradient: "",
      sortOrder: benefits.length,
      isActive: true,
    });
    setBenefitModalOpen(true);
  };

  const handleEditBenefit = (benefit: Benefit) => {
    setEditingBenefitId(benefit.id);
    // Normalize dữ liệu để đảm bảo các field luôn là locale object
    const normalizedBenefit = migrateObjectToLocale(benefit);
    setBenefitFormData({
      ...normalizedBenefit,
      icon: benefit.icon || '',
      gradient: benefit.gradient || '',
      sortOrder: benefit.sortOrder ?? 0,
      isActive: benefit.isActive ?? true
    });
    setBenefitModalOpen(true);
  };

  const handleSaveBenefit = async () => {
    try {
      if (!benefitFormData.title) {
        toast.error("Title không được để trống");
        return;
      }

      if (editingBenefitId === -1) {
        await adminApiCall(AdminEndpoints.productBenefits.list, {
          method: "POST",
          body: JSON.stringify(benefitFormData),
        });
        toast.success("Đã tạo lợi ích");
      } else if (editingBenefitId) {
        await adminApiCall(AdminEndpoints.productBenefits.detail(editingBenefitId), {
          method: "PUT",
          body: JSON.stringify(benefitFormData),
        });
        toast.success("Đã cập nhật lợi ích");
      }

      setBenefitModalOpen(false);
      setEditingBenefitId(null);
      setBenefitFormData({});
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu lợi ích");
    }
  };

  const handleDeleteBenefit = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lợi ích này?")) return;
    try {
      await adminApiCall(AdminEndpoints.productBenefits.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa lợi ích");
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa lợi ích");
    }
  };

  const handleMoveBenefitUp = async (index: number) => {
    if (index === 0) return;
    try {
      const sortedBenefits = [...benefits].sort((a, b) => a.sortOrder - b.sortOrder);
      const newBenefits = [...sortedBenefits];
      [newBenefits[index - 1], newBenefits[index]] = [newBenefits[index], newBenefits[index - 1]];

      await Promise.all(
        newBenefits.map((benefit, i) =>
          adminApiCall(AdminEndpoints.productBenefits.detail(benefit.id), {
            method: "PUT",
            body: JSON.stringify({ ...benefit, sortOrder: i }),
          })
        )
      );

      toast.success("Đã cập nhật vị trí");
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật vị trí");
    }
  };

  const handleMoveBenefitDown = async (index: number) => {
    const sortedBenefits = [...benefits].sort((a, b) => a.sortOrder - b.sortOrder);
    if (index === sortedBenefits.length - 1) return;
    try {
      const newBenefits = [...sortedBenefits];
      [newBenefits[index], newBenefits[index + 1]] = [newBenefits[index + 1], newBenefits[index]];

      await Promise.all(
        newBenefits.map((benefit, i) =>
          adminApiCall(AdminEndpoints.productBenefits.detail(benefit.id), {
            method: "PUT",
            body: JSON.stringify({ ...benefit, sortOrder: i }),
          })
        )
      );

      toast.success("Đã cập nhật vị trí");
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật vị trí");
    }
  };

  const sortedBenefits = [...benefits].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedCategories = [...categoriesForManagement].sort((a, b) => a.sortOrder - b.sortOrder);

  // Categories handlers
  const handleCreateCategory = () => {
    setEditingCategoryId(-1);
    setCategoryFormData({
      slug: "",
      name: { vi: '', en: '', ja: '' },
      iconName: "Package",
      sortOrder: categoriesForManagement.length,
      isActive: true,
    });
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    // Normalize dữ liệu để đảm bảo các field luôn là locale object
    const normalizedCategory = migrateObjectToLocale(category);
    setCategoryFormData({
      ...normalizedCategory,
      slug: category.slug || '',
      iconName: category.iconName || 'Package',
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive ?? true
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      // Kiểm tra name không rỗng (hỗ trợ cả string và locale object)
      const nameStr = typeof categoryFormData.name === 'string' 
        ? categoryFormData.name 
        : (categoryFormData.name?.vi || categoryFormData.name?.en || categoryFormData.name?.ja || '');
      
      if (!categoryFormData.slug || !nameStr.trim()) {
        toast.error("Slug và name không được để trống");
        return;
      }

      if (editingCategoryId === -1) {
        await adminApiCall(AdminEndpoints.productCategories.list, {
          method: "POST",
          body: JSON.stringify(categoryFormData),
        });
        toast.success("Đã tạo danh mục");
      } else if (editingCategoryId) {
        await adminApiCall(AdminEndpoints.productCategories.detail(editingCategoryId), {
          method: "PUT",
          body: JSON.stringify(categoryFormData),
        });
        toast.success("Đã cập nhật danh mục");
      }

      setCategoryModalOpen(false);
      setEditingCategoryId(null);
      setCategoryFormData({});
      void fetchCategoriesForManagement();
      void fetchCategories(); // Refresh categories for products filter
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu danh mục");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await adminApiCall(AdminEndpoints.productCategories.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa danh mục");
      void fetchCategoriesForManagement();
      void fetchCategories(); // Refresh categories for products filter
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa danh mục");
    }
  };

  // Testimonials handlers
  const handleCreateTestimonial = () => {
    setEditingTestimonialId(-1);
    setTestimonialFormData({
      quote: { vi: '', en: '', ja: '' },
      author: { vi: '', en: '', ja: '' },
      company: { vi: '', en: '', ja: '' },
      rating: 5,
      sortOrder: testimonials.length,
      isActive: true,
    });
    setTestimonialModalOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonialId(testimonial.id);
    // Normalize dữ liệu để đảm bảo các field luôn là locale object
    const normalizedTestimonial = migrateObjectToLocale(testimonial);
    setTestimonialFormData({
      ...normalizedTestimonial,
      rating: testimonial.rating ?? 5,
      sortOrder: testimonial.sortOrder ?? 0,
      isActive: testimonial.isActive !== undefined ? testimonial.isActive : true,
    });
    setTestimonialModalOpen(true);
  };

  const handleCancelTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialFormData({});
    setTestimonialModalOpen(false);
  };

  const handleSaveTestimonial = async () => {
    try {
      const quoteStr = typeof testimonialFormData.quote === 'string'
        ? testimonialFormData.quote
        : (testimonialFormData.quote?.vi || testimonialFormData.quote?.en || testimonialFormData.quote?.ja || '');
      const authorStr = typeof testimonialFormData.author === 'string'
        ? testimonialFormData.author
        : (testimonialFormData.author?.vi || testimonialFormData.author?.en || testimonialFormData.author?.ja || '');

      if (!quoteStr || !quoteStr.trim() || !authorStr || !authorStr.trim()) {
        toast.error("Quote và Author không được để trống");
        return;
      }

      const dataToSave = {
        ...testimonialFormData,
        isActive: testimonialFormData.isActive !== undefined ? testimonialFormData.isActive : true,
      };

      if (editingTestimonialId === -1) {
        await adminApiCall(AdminEndpoints.testimonials.list, {
          method: "POST",
          body: JSON.stringify(dataToSave),
        });
        toast.success("Đã tạo đánh giá");
      } else if (editingTestimonialId) {
        await adminApiCall(AdminEndpoints.testimonials.detail(editingTestimonialId), {
          method: "PUT",
          body: JSON.stringify(dataToSave),
        });
        toast.success("Đã cập nhật đánh giá");
      }

      handleCancelTestimonial();
      void fetchTestimonials();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu đánh giá");
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await adminApiCall(AdminEndpoints.testimonials.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa đánh giá");
      void fetchTestimonials();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa đánh giá");
    }
  };

  const handleMoveTestimonialUp = async (index: number) => {
    if (index === 0) return;
    try {
      const sortedTestimonials = [...testimonials].sort((a, b) => a.sortOrder - b.sortOrder);
      const newTestimonials = [...sortedTestimonials];
      [newTestimonials[index - 1], newTestimonials[index]] = [
        newTestimonials[index],
        newTestimonials[index - 1],
      ];

      await Promise.all(
        newTestimonials.map((testimonial, i) =>
          adminApiCall(AdminEndpoints.testimonials.detail(testimonial.id), {
            method: "PUT",
            body: JSON.stringify({
              ...testimonial,
              sortOrder: i,
            }),
          })
        )
      );
      toast.success("Đã cập nhật thứ tự");
      void fetchTestimonials();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật thứ tự");
    }
  };

  const handleMoveTestimonialDown = async (index: number) => {
    const sortedTestimonials = [...testimonials].sort((a, b) => a.sortOrder - b.sortOrder);
    if (index === sortedTestimonials.length - 1) return;
    try {
      const newTestimonials = [...sortedTestimonials];
      [newTestimonials[index], newTestimonials[index + 1]] = [
        newTestimonials[index + 1],
        newTestimonials[index],
      ];

      await Promise.all(
        newTestimonials.map((testimonial, i) =>
          adminApiCall(AdminEndpoints.testimonials.detail(testimonial.id), {
            method: "PUT",
            body: JSON.stringify({
              ...testimonial,
              sortOrder: i,
            }),
          })
        )
      );
      toast.success("Đã cập nhật thứ tự");
      void fetchTestimonials();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật thứ tự");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // List Header handlers
  const handleSaveListHeader = async () => {
    try {
      setLoadingListHeader(true);
      
      // Fetch current data from backend to preserve fields not in form
      let currentData = listHeaderData;
      try {
        const response = await adminApiCall<{ success: boolean; data?: ListHeaderFormData }>(
          AdminEndpoints.productListHeader.get,
        );
        if (response?.data) {
          currentData = response.data;
        }
      } catch (error) {
        // If fetch fails, use current state
        // Silently fail
      }

      // Merge: prioritize form values
      const dataToSave: ListHeaderFormData = {
        subtitle: listHeaderData.subtitle || (currentData?.subtitle || { vi: '', en: '', ja: '' }),
        title: listHeaderData.title || (currentData?.title || { vi: '', en: '', ja: '' }),
        description: listHeaderData.description || (currentData?.description || { vi: '', en: '', ja: '' }),
        isActive: listHeaderData.isActive !== undefined ? listHeaderData.isActive : (currentData?.isActive !== undefined ? currentData.isActive : true),
      };

      await adminApiCall(AdminEndpoints.productListHeader.update, {
        method: "PUT",
        body: JSON.stringify(dataToSave),
      });
      toast.success("Đã lưu list header thành công");
      void fetchListHeader();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi khi lưu list header");
    } finally {
      setLoadingListHeader(false);
    }
  };

  // CTA handlers
  const handleSaveCta = async () => {
    try {
      setLoadingCta(true);
      
      // Fetch current data from backend to preserve fields not in form
      let currentData = ctaData;
      try {
        const response = await adminApiCall<{ success: boolean; data?: CtaFormData }>(
          AdminEndpoints.productCta.get,
        );
        if (response?.data) {
          currentData = response.data;
        }
      } catch (error) {
        // If fetch fails, use current state
        // Silently fail
      }

      // Merge: prioritize form values if they are not empty, otherwise use existing values
      const dataToSave: CtaFormData = {
        title: ctaData.title || (currentData?.title || { vi: '', en: '', ja: '' }),
        description: ctaData.description || (currentData?.description || { vi: '', en: '', ja: '' }),
        primaryButtonText: ctaData.primaryButtonText || (currentData?.primaryButtonText || { vi: '', en: '', ja: '' }),
        primaryButtonLink: ctaData.primaryButtonLink || (currentData?.primaryButtonLink || ''),
        secondaryButtonText: ctaData.secondaryButtonText || (currentData?.secondaryButtonText || { vi: '', en: '', ja: '' }),
        secondaryButtonLink: ctaData.secondaryButtonLink || (currentData?.secondaryButtonLink || ''),
        backgroundColor: ctaData.backgroundColor || (currentData?.backgroundColor || '#29A3DD'),
        isActive: ctaData.isActive !== undefined ? ctaData.isActive : (currentData?.isActive !== undefined ? currentData.isActive : true),
      };

      await adminApiCall(AdminEndpoints.productCta.update, {
        method: "PUT",
        body: JSON.stringify(dataToSave),
      });
      toast.success("Đã lưu CTA thành công");
      void fetchCta();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi khi lưu CTA");
    } finally {
      setLoadingCta(false);
    }
  };

  // Render icon component
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Package;
    return <IconComponent className="w-5 h-5" />;
  };

  // Product Row Component (memoized for performance)
  const ProductRow = memo(({ 
    product, 
    onEdit, 
    onDelete, 
    onToggleActive, 
    onToggleFeatured,
    globalLocale
  }: { 
    product: ProductItem;
    onEdit: (item: ProductItem) => void;
    onDelete: (id: number) => void;
    onToggleActive: (id: number, currentActive: boolean) => void;
    onToggleFeatured: (id: number, currentFeatured: boolean) => void;
    globalLocale: Locale;
  }) => (
    <tr className="border-b hover:bg-muted/50 transition-colors duration-150">
      <td className="p-2 align-middle">
        {product.image ? (
          <img
            src={product.image}
            alt={typeof product.name === 'string' ? product.name : getLocalizedText(product.name, globalLocale)}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center" aria-label="Không có ảnh">
            <Package className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </td>
      <td className="p-2 align-middle">
        <div className="font-medium">{typeof product.name === 'string' ? product.name : getLocalizedText(product.name, globalLocale)}</div>
        {product.badge && (
          <Badge variant="secondary" className="mt-1">
            {typeof product.badge === 'string' ? product.badge : getLocalizedText(product.badge, globalLocale)}
          </Badge>
        )}
      </td>
      <td className="p-2 align-middle">
        <Badge variant="outline">
          {getLocalizedText(product.category, globalLocale) || "Chưa phân loại"}
        </Badge>
      </td>
      <td className="p-2 text-sm text-muted-foreground align-middle">
        {typeof product.tagline === 'string' ? product.tagline : getLocalizedText(product.tagline, globalLocale) || "-"}
      </td>
      <td className="p-2 align-middle">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleActive(product.id, product.isActive !== false)}
            title={product.isActive !== false ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
            aria-label={product.isActive !== false ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
          >
            {product.isActive !== false ? (
              <Eye className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFeatured(product.id, !!product.isFeatured)}
            title={product.isFeatured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
            aria-label={product.isFeatured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
          >
            <Star
              className={`h-4 w-4 ${
                product.isFeatured
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
              aria-hidden="true"
            />
          </Button>
        </div>
      </td>
      <td className="p-2">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            aria-label={`Chỉnh sửa ${typeof product.name === 'string' ? product.name : getLocalizedText(product.name, globalLocale)}`}
          >
            <Edit className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="text-destructive hover:text-destructive"
            aria-label={`Xóa ${typeof product.name === 'string' ? product.name : getLocalizedText(product.name, globalLocale)}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </td>
    </tr>
  ));
  ProductRow.displayName = "ProductRow";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý đầy đủ các phần của trang sản phẩm
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* AI Provider Selector */}
          <AIProviderSelector
            value={aiProvider}
            onChange={setAiProvider}
          />
        </div>
      </div>

      {/* Progress Stepper */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {tabsConfig.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeMainTab === tab.value;
              const isCompleted = tabsConfig.findIndex(t => t.value === activeMainTab) > index;
              
              return (
                <div key={tab.value} className="flex items-center flex-1">
                  <button
                    onClick={() => handleTabChange(tab.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-2 border-blue-500"
                        : isCompleted
                        ? "bg-green-50 text-green-700 border-2 border-green-300"
                        : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </button>
                  {index < tabsConfig.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeMainTab} onValueChange={handleTabChange} className="w-full">

        {/* Tab: Hero Banner */}
        <TabsContent value="hero" className="space-y-0">
          <Tabs
            value={activeSubTabs.hero || "config"}
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, hero: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {/* Tab Controls - Locale Selector và Translate Button */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* Locale Selector */}
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Hiển thị:</Label>
                        <Select value={globalLocale} onValueChange={(value: 'vi' | 'en' | 'ja') => setGlobalLocale(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Translate Controls */}
                    <div className="flex items-center gap-2">
                      {/* Source Language Selector */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Dịch từ:</Label>
                        <Select value={translateSourceLang} onValueChange={(value: 'vi' | 'en' | 'ja') => setTranslateSourceLang(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Translate Button */}
                      <Button
                        onClick={() => handleTranslateSection('hero')}
                        disabled={translatingAll}
                        variant="outline"
                        className="gap-2"
                      >
                        {translatingAll ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang dịch...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Dịch khối này
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("heroSection")}
                  >
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-1">
                        {collapsedBlocks.heroSection ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )}
                        Hero Section
                      </CardTitle>
                      <p className="text-sm text-gray-600 ml-8">Cấu hình hero section cho trang sản phẩm</p>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); handleSaveHero(); }} disabled={loadingHero} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {loadingHero ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.heroSection && (
                  <CardContent className="space-y-4 px-6 py-4">
                  <div>
                    <LocaleInput
                      label="Tiêu đề chính *"
                      value={getLocaleValue(heroData, 'title')}
                      onChange={(value) => {
                        const updated = setLocaleValue(heroData, 'title', value);
                        setHeroData(updated as HeroFormData);
                      }}
                      placeholder="Bộ giải pháp phần mềm"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>

                  <div>
                    <LocaleInput
                      label="Tiêu đề phụ"
                      value={getLocaleValue(heroData, 'subtitle')}
                      onChange={(value) => {
                        const updated = setLocaleValue(heroData, 'subtitle', value);
                        setHeroData(updated as HeroFormData);
                      }}
                      placeholder="Phục vụ Giáo dục, Công chứng & Doanh nghiệp"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>

                  <div>
                    <LocaleInput
                      label="Mô tả"
                      value={getLocaleValue(heroData, 'description')}
                      onChange={(value) => {
                        const updated = setLocaleValue(heroData, 'description', value);
                        setHeroData(updated as HeroFormData);
                      }}
                      placeholder="Mô tả về các sản phẩm..."
                      multiline={true}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Text CTA chính"
                        value={getLocaleValue(heroData, 'primaryCtaText')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'primaryCtaText', value);
                          setHeroData(updated as HeroFormData);
                        }}
                        placeholder="Xem danh sách sản phẩm"
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div>
                      <Label>Link CTA chính</Label>
                      <Input
                        value={heroData.primaryCtaLink}
                        onChange={(e) => setHeroData({ ...heroData, primaryCtaLink: e.target.value })}
                        placeholder="#products"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Text CTA phụ"
                        value={getLocaleValue(heroData, 'secondaryCtaText')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'secondaryCtaText', value);
                          setHeroData(updated as HeroFormData);
                        }}
                        placeholder="Tư vấn giải pháp"
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div>
                      <Label>Link CTA phụ</Label>
                      <Input
                        value={heroData.secondaryCtaLink}
                        onChange={(e) => setHeroData({ ...heroData, secondaryCtaLink: e.target.value })}
                        placeholder="/contact"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Label Stat 1"
                        value={getLocaleValue(heroData, 'stat1Label')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'stat1Label', value);
                          setHeroData(updated as HeroFormData);
                        }}
                        placeholder="Giải pháp phần mềm"
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Value Stat 1"
                        value={getLocaleValue(heroData, 'stat1Value')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'stat1Value', value);
                          setHeroData(updated as HeroFormData);
                        }}
                        placeholder="+32.000"
                        defaultLocale={globalLocale}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Label Stat 2"
                        value={getLocaleValue(heroData, 'stat2Label')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'stat2Label', value);
                          setHeroData(updated as HeroFormData);
                        }}
                        placeholder="Đơn vị triển khai thực tế"
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Value Stat 2"
                        value={getLocaleValue(heroData, 'stat2Value')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'stat2Value', value);
                          setHeroData(updated as HeroFormData);
                        }}
                        placeholder="+6.000"
                        defaultLocale={globalLocale}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Label Stat 3"
                        value={getLocaleValue(heroData, 'stat3Label')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'stat3Label', value);
                          setHeroData(updated as HeroFormData);
                        }}
                        placeholder="Mức độ hài lòng trung bình"
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Value Stat 3"
                        value={getLocaleValue(heroData, 'stat3Value')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'stat3Value', value);
                          setHeroData(updated as HeroFormData);
                        }}
                        placeholder="4.9★"
                        defaultLocale={globalLocale}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="pb-2">Background Gradient</Label>
                    <select
                      value={heroData.backgroundGradient}
                      onChange={(e) => setHeroData({ ...heroData, backgroundGradient: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      {GRADIENT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Kích hoạt</Label>
                    <Switch
                      checked={heroData.isActive}
                      onCheckedChange={async (checked) => {
                        // If heroData is null or missing title (indicates no data loaded), fetch from backend first
                        const titleValue = typeof heroData.title === 'string' ? heroData.title : (heroData.title as any)?.vi || '';
                        if (!heroData || !titleValue) {
                          try {
                            const response = await adminApiCall<{ success: boolean; data?: HeroFormData }>(
                              AdminEndpoints.productHero.get,
                            );
                            if (response?.data) {
                              const normalizedHero = migrateObjectToLocale(response.data);
                              // Đảm bảo backgroundGradient là string
                              if (normalizedHero.backgroundGradient && typeof normalizedHero.backgroundGradient === 'object' && !Array.isArray(normalizedHero.backgroundGradient)) {
                                if ('vi' in normalizedHero.backgroundGradient || 'en' in normalizedHero.backgroundGradient || 'ja' in normalizedHero.backgroundGradient) {
                                  normalizedHero.backgroundGradient = (normalizedHero.backgroundGradient as any).vi || (normalizedHero.backgroundGradient as any).en || GRADIENT_OPTIONS[0].value;
                                }
                              }
                              // Đảm bảo các link là string
                              if (normalizedHero.primaryCtaLink && typeof normalizedHero.primaryCtaLink === 'object' && !Array.isArray(normalizedHero.primaryCtaLink)) {
                                if ('vi' in normalizedHero.primaryCtaLink || 'en' in normalizedHero.primaryCtaLink || 'ja' in normalizedHero.primaryCtaLink) {
                                  normalizedHero.primaryCtaLink = (normalizedHero.primaryCtaLink as any).vi || (normalizedHero.primaryCtaLink as any).en || '';
                                }
                              }
                              if (normalizedHero.secondaryCtaLink && typeof normalizedHero.secondaryCtaLink === 'object' && !Array.isArray(normalizedHero.secondaryCtaLink)) {
                                if ('vi' in normalizedHero.secondaryCtaLink || 'en' in normalizedHero.secondaryCtaLink || 'ja' in normalizedHero.secondaryCtaLink) {
                                  normalizedHero.secondaryCtaLink = (normalizedHero.secondaryCtaLink as any).vi || (normalizedHero.secondaryCtaLink as any).en || '';
                                }
                              }
                              setHeroData({ ...normalizedHero, isActive: checked } as HeroFormData);
                            } else {
                              // Initialize with empty data if not found
                              setHeroData({
                                title: { vi: '', en: '', ja: '' },
                                subtitle: { vi: '', en: '', ja: '' },
                                description: { vi: '', en: '', ja: '' },
                                primaryCtaText: { vi: '', en: '', ja: '' },
                                primaryCtaLink: "",
                                secondaryCtaText: { vi: '', en: '', ja: '' },
                                secondaryCtaLink: "",
                                stat1Label: { vi: '', en: '', ja: '' },
                                stat1Value: { vi: '', en: '', ja: '' },
                                stat2Label: { vi: '', en: '', ja: '' },
                                stat2Value: { vi: '', en: '', ja: '' },
                                stat3Label: { vi: '', en: '', ja: '' },
                                stat3Value: { vi: '', en: '', ja: '' },
                                backgroundGradient: GRADIENT_OPTIONS[0].value,
                                isActive: checked,
                              });
                            }
                          } catch (error) {
                            // Silently fail
                            setHeroData({ ...heroData, isActive: checked });
                          }
                        } else {
                          setHeroData({ ...heroData, isActive: checked });
                        }
                      }}
                    />
                  </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Hero Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="rounded-lg p-8 text-white min-h-[400px] flex items-center"
                    style={{ background: heroData.backgroundGradient }}
                  >
                    <div className="max-w-4xl mx-auto w-full space-y-6 text-center">
                      {getLocalizedText(heroData.title, globalLocale) && (
                        <h1 className="text-4xl md:text-5xl font-bold">{getLocalizedText(heroData.title, globalLocale)}</h1>
                      )}
                      {getLocalizedText(heroData.subtitle, globalLocale) && (
                        <p className="text-xl md:text-2xl opacity-90">{getLocalizedText(heroData.subtitle, globalLocale)}</p>
                      )}
                      {getLocalizedText(heroData.description, globalLocale) && (
                        <p className="text-base md:text-lg opacity-80 max-w-3xl mx-auto">
                          {getLocalizedText(heroData.description, globalLocale)}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                        {getLocalizedText(heroData.primaryCtaText, globalLocale) && (
                          <a
                            href={heroData.primaryCtaLink || "#"}
                            className="px-10 py-5 bg-white text-[#006FB3] rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 font-semibold"
                          >
                            {getLocalizedText(heroData.primaryCtaText, globalLocale)}
                            <ArrowRight className="h-5 w-5" />
                          </a>
                        )}
                        {getLocalizedText(heroData.secondaryCtaText, globalLocale) && (
                          <a
                            href={heroData.secondaryCtaLink || "#"}
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all inline-flex items-center justify-center gap-3 font-semibold"
                          >
                            {getLocalizedText(heroData.secondaryCtaText, globalLocale)}
                            <ArrowRight className="h-5 w-5" />
                          </a>
                        )}
                      </div>

                      {(getLocalizedText(heroData.stat1Value, globalLocale) || getLocalizedText(heroData.stat2Value, globalLocale) || getLocalizedText(heroData.stat3Value, globalLocale)) && (
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                          {getLocalizedText(heroData.stat1Value, globalLocale) && (
                            <div className="text-center">
                              <div className="text-4xl font-bold text-white mb-2">
                                {getLocalizedText(heroData.stat1Value, globalLocale)}
                              </div>
                              <div className="text-blue-200">{getLocalizedText(heroData.stat1Label, globalLocale)}</div>
                            </div>
                          )}
                          {getLocalizedText(heroData.stat2Value, globalLocale) && (
                            <div className="text-center">
                              <div className="text-4xl font-bold text-white mb-2">
                                {getLocalizedText(heroData.stat2Value, globalLocale)}
                              </div>
                              <div className="text-blue-200">{getLocalizedText(heroData.stat2Label, globalLocale)}</div>
                            </div>
                          )}
                          {getLocalizedText(heroData.stat3Value, globalLocale) && (
                            <div className="text-center">
                              <div className="text-4xl font-bold text-white mb-2">
                                {getLocalizedText(heroData.stat3Value, globalLocale)}
                              </div>
                              <div className="text-blue-200">{getLocalizedText(heroData.stat3Label, globalLocale)}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Tab: Benefits */}
        <TabsContent value="benefits" className="space-y-0">
          <Tabs
            value={activeSubTabs.benefits || "config"}
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, benefits: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {/* Tab Controls - Locale Selector và Translate Button */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* Locale Selector */}
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Hiển thị:</Label>
                        <Select value={globalLocale} onValueChange={(value: 'vi' | 'en' | 'ja') => setGlobalLocale(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Quản lý Lợi ích Sản phẩm</h2>
                  <p className="text-gray-600 mt-1">Quản lý 4 thẻ lợi ích hiển thị trên trang products</p>
                </div>
                <Button onClick={handleCreateBenefit} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tạo lợi ích mới
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedBenefits.map((benefit, index) => (
                  <Card key={benefit.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground font-normal">#{index + 1}</span>
                          <span>{getLocalizedText(benefit.title, globalLocale)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveBenefitUp(index)}
                            disabled={index === 0}
                            title="Di chuyển lên"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveBenefitDown(index)}
                            disabled={index === sortedBenefits.length - 1}
                            title="Di chuyển xuống"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditBenefit(benefit)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteBenefit(benefit.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {benefit.icon && (
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                            <img src={benefit.icon} alt={getLocalizedText(benefit.title, globalLocale)} className="w-12 h-12" />
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">{getLocalizedText(benefit.description, globalLocale)}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          Gradient: {benefit.gradient}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sort: {benefit.sortOrder} |{" "}
                          {benefit.isActive ? (
                            <span className="text-green-600">Active</span>
                          ) : (
                            <span className="text-gray-400">Inactive</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Benefits Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-20 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {sortedBenefits.filter(b => b.isActive).map((benefit, index) => (
                        <div
                          key={benefit.id}
                          className="bg-white rounded-2xl p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] transition-all duration-300"
                        >
                          {benefit.icon && (
                            <div className="flex justify-center mb-5">
                              <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-md`}
                              >
                                <img
                                  src={benefit.icon}
                                  alt={getLocalizedText(benefit.title, globalLocale)}
                                  className="w-8 h-8"
                                />
                              </div>
                            </div>
                          )}
                          <h4 className="text-gray-900 font-bold text-base mb-2">
                            {getLocalizedText(benefit.title, globalLocale)}
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {getLocalizedText(benefit.description, globalLocale)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Tab: Categories */}
        <TabsContent value="categories" className="space-y-0">
          <Tabs
            value={activeSubTabs.categories || "config"}
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, categories: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {/* Tab Controls - Locale Selector và Translate Button */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* Locale Selector */}
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Hiển thị:</Label>
                        <Select value={globalLocale} onValueChange={(value: 'vi' | 'en' | 'ja') => setGlobalLocale(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Quản lý Danh mục Sản phẩm</h2>
                  <p className="text-gray-600 mt-1">Quản lý các danh mục sản phẩm (edu, justice, gov, kpi)</p>
                </div>
                <Button onClick={handleCreateCategory} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tạo danh mục mới
                </Button>
              </div>

              <Card>
                <CardHeader
                  onClick={() => toggleBlock("categoriesList")}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-1">
                        {collapsedBlocks.categoriesList ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )}
                        Danh sách danh mục
                      </CardTitle>
                      <p className="text-sm text-gray-600 ml-8">Cấu hình danh sách danh mục</p>
                    </div>
                </CardHeader>
                {!collapsedBlocks.categoriesList && (
                  <CardContent>
                  {loadingCategoriesForManagement ? (
                    <div className="text-center py-8">Đang tải...</div>
                  ) : sortedCategories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có danh mục nào
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedCategories.map((category) => (
                        <Card key={category.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                                <div className="font-mono text-sm">{category.slug}</div>
                                <div className="font-medium">{getLocalizedText(category.name, globalLocale)}</div>
                                <div className="flex items-center gap-2">
                                  {renderIcon(category.iconName)}
                                  <span className="text-sm text-muted-foreground">
                                    {category.iconName || "-"}
                                  </span>
                                </div>
                                <div className="text-sm">{category.sortOrder}</div>
                                <div>
                                  {category.isActive ? (
                                    <Badge variant="default" className="bg-green-600">Active</Badge>
                                  ) : (
                                    <Badge variant="secondary">Inactive</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Categories Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Pills filter */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                      {sortedCategories
                        .filter((c) => c.isActive)
                        .map((category) => {
                          const IconComponent = (LucideIcons as any)[category.iconName] || LucideIcons.Package;
                          return (
                            <button
                              key={category.id}
                              className="px-5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2 bg-[#EAF5FF] text-[#0870B4] hover:bg-[#DCEFFF]"
                            >
                              <IconComponent size={16} />
                              {getLocalizedText(category.name, globalLocale)}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Tab: Testimonials */}
        <TabsContent value="testimonials" className="space-y-0">
          <Tabs
            value={activeSubTabs.testimonials || "config"}
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, testimonials: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {/* Tab Controls - Locale Selector và Translate Button */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* Locale Selector */}
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Hiển thị:</Label>
                        <Select value={globalLocale} onValueChange={(value: 'vi' | 'en' | 'ja') => setGlobalLocale(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer hover:bg-gray-50 -mx-6 px-6 py-2 rounded transition-colors"
                      onClick={() => toggleBlock("testimonialsList")}
                    >
                      <CardTitle className="flex items-center gap-2">
                        {collapsedBlocks.testimonialsList ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                        Quản lý đánh giá khách hàng
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Quản lý các đánh giá/testimonials của khách hàng về SFB</p>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); handleCreateTestimonial(); }} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Thêm đánh giá
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.testimonialsList && (
                  <CardContent>
                  {/* Form Create/Edit Modal */}
                  <Dialog open={testimonialModalOpen} onOpenChange={(open) => !open && handleCancelTestimonial()}>
                    <DialogContent
                      style={{
                        maxWidth: "96vw",
                        width: "60vw",
                        maxHeight: "95vh",
                        overflowY: "auto",
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>
                          {editingTestimonialId === -1 ? "Thêm đánh giá mới" : "Chỉnh sửa đánh giá"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingTestimonialId === -1
                            ? "Thêm đánh giá mới từ khách hàng"
                            : "Chỉnh sửa thông tin đánh giá"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <LocaleInput
                              label="Nội dung đánh giá *"
                              value={getLocaleValue(testimonialFormData, 'quote')}
                              onChange={(value) => {
                                const updated = setLocaleValue(testimonialFormData, 'quote', value);
                                setTestimonialFormData(updated as Partial<Testimonial>);
                              }}
                              placeholder="Nhập nội dung đánh giá..."
                              multiline={true}
                              defaultLocale={globalLocale}
                            aiProvider={aiProvider}
                            />
                          </div>
                          <div>
                            <LocaleInput
                              label="Tên khách hàng *"
                              value={getLocaleValue(testimonialFormData, 'author')}
                              onChange={(value) => {
                                const updated = setLocaleValue(testimonialFormData, 'author', value);
                                setTestimonialFormData(updated as Partial<Testimonial>);
                              }}
                              placeholder="Ví dụ: Ông Nguyễn Khánh Tùng"
                              defaultLocale={globalLocale}
                            aiProvider={aiProvider}
                            />
                          </div>
                          <div>
                            <LocaleInput
                              label="Công ty/Đơn vị (tùy chọn)"
                              value={getLocaleValue(testimonialFormData, 'company')}
                              onChange={(value) => {
                                const updated = setLocaleValue(testimonialFormData, 'company', value);
                                setTestimonialFormData(updated as Partial<Testimonial>);
                              }}
                              placeholder="Ví dụ: Công ty ABC"
                              defaultLocale={globalLocale}
                            aiProvider={aiProvider}
                            />
                          </div>
                          <div>
                            <Label htmlFor="rating">Đánh giá sao</Label>
                            <Input
                              id="rating"
                              type="number"
                              min="1"
                              max="5"
                              value={testimonialFormData.rating || 5}
                              onChange={(e) =>
                                setTestimonialFormData({ ...testimonialFormData, rating: parseInt(e.target.value) || 5 })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="sortOrder">Thứ tự sắp xếp</Label>
                            <Input
                              id="sortOrder"
                              type="number"
                              value={testimonialFormData.sortOrder || 0}
                              onChange={(e) =>
                                setTestimonialFormData({ ...testimonialFormData, sortOrder: parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="isActive">Hiển thị</Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="isActive"
                                checked={testimonialFormData.isActive === true || testimonialFormData.isActive === undefined}
                                onCheckedChange={(checked) => {
                                  setTestimonialFormData({ ...testimonialFormData, isActive: checked });
                                }}
                              />
                              <span className="text-sm text-gray-600 min-w-[40px]">
                                {testimonialFormData.isActive === true || testimonialFormData.isActive === undefined ? "Hiện" : "Ẩn"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleCancelTestimonial} className="gap-2">
                          <X className="w-4 h-4" />
                          Hủy
                        </Button>
                        <Button onClick={handleSaveTestimonial} className="gap-2">
                          <Save className="w-4 h-4" />
                          Lưu
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* List */}
                  {loadingTestimonials ? (
                    <div className="text-center py-8">Đang tải...</div>
                  ) : testimonials.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-gray-500">
                        Chưa có đánh giá nào. Nhấn "Thêm đánh giá" để tạo mới.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {[...testimonials]
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((testimonial, index) => (
                          <Card key={testimonial.id}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {renderStars(testimonial.rating)}
                                  </div>
                                  <p className="text-gray-700 mb-2 italic">"{getLocalizedText(testimonial.quote, globalLocale)}"</p>
                                  <div className="text-sm text-gray-600">
                                    <p className="font-semibold">{getLocalizedText(testimonial.author, globalLocale)}</p>
                                    {getLocalizedText(testimonial.company, globalLocale) && (
                                      <p className="text-gray-500">{getLocalizedText(testimonial.company, globalLocale)}</p>
                                    )}
                                  </div>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                    <span>Thứ tự: #{testimonial.sortOrder}</span>
                                    <span
                                      className={`${
                                        testimonial.isActive ? "text-green-600" : "text-gray-400"
                                      }`}
                                    >
                                      {testimonial.isActive ? "Đang hiển thị" : "Ẩn"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveTestimonialUp(index)}
                                    disabled={index === 0}
                                    title="Di chuyển lên"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveTestimonialDown(index)}
                                    disabled={index === testimonials.length - 1}
                                    title="Di chuyển xuống"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditTestimonial(testimonial)}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Khách hàng nói về SFB?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 py-12 px-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                      {testimonialsTitle}
                    </h2>
                    {testimonials.filter((t) => t.isActive).length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Chưa có đánh giá nào đang hiển thị
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials
                          .filter((t) => t.isActive)
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((testimonial) => (
                            <Card key={testimonial.id} className="bg-white">
                              <CardContent className="p-6">
                                <div className="flex items-center gap-1 mb-4">
                                  {renderStars(testimonial.rating)}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{getLocalizedText(testimonial.quote, globalLocale)}"</p>
                                <div className="text-sm">
                                  <p className="font-semibold text-gray-900">{getLocalizedText(testimonial.author, globalLocale)}</p>
                                  {getLocalizedText(testimonial.company, globalLocale) && (
                                    <p className="text-gray-600">{getLocalizedText(testimonial.company, globalLocale)}</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Tab: CTA */}
        <TabsContent value="cta" className="space-y-0">
          <Tabs
            value={activeSubTabs.cta || "config"}
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, cta: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {/* Tab Controls - Locale Selector và Translate Button */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* Locale Selector */}
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Hiển thị:</Label>
                        <Select value={globalLocale} onValueChange={(value: 'vi' | 'en' | 'ja') => setGlobalLocale(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Translate Controls */}
                    <div className="flex items-center gap-2">
                      {/* Source Language Selector */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Dịch từ:</Label>
                        <Select value={translateSourceLang} onValueChange={(value: 'vi' | 'en' | 'ja') => setTranslateSourceLang(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Translate Button */}
                      <Button
                        onClick={() => handleTranslateSection('cta')}
                        disabled={translatingAll}
                        variant="outline"
                        className="gap-2"
                      >
                        {translatingAll ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Đang dịch...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Dịch khối này</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("ctaConfig")}
                  >
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-1">
                        {collapsedBlocks.ctaConfig ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )}
                        Cấu hình CTA
                      </CardTitle>
                      <p className="text-sm text-gray-600 ml-8">Quản lý phần CTA (Call to Action) cho trang sản phẩm</p>
                    </div>
                  </div>
                </CardHeader>
                {!collapsedBlocks.ctaConfig && (
                  <CardContent className="space-y-4 px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <LocaleInput
                        label="Tiêu đề *"
                        value={getLocaleValue(ctaData, 'title')}
                        onChange={(value) => {
                          const updated = setLocaleValue(ctaData, 'title', value);
                          setCtaData(updated as CtaFormData);
                        }}
                        placeholder="Ví dụ: Miễn phí tư vấn"
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <LocaleInput
                        label="Mô tả *"
                        value={getLocaleValue(ctaData, 'description')}
                        onChange={(value) => {
                          const updated = setLocaleValue(ctaData, 'description', value);
                          setCtaData(updated as CtaFormData);
                        }}
                        placeholder="Nhập mô tả..."
                        multiline={true}
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Nút chính - Text *"
                        value={getLocaleValue(ctaData, 'primaryButtonText')}
                        onChange={(value) => {
                          const updated = setLocaleValue(ctaData, 'primaryButtonText', value);
                          setCtaData(updated as CtaFormData);
                        }}
                        placeholder="Ví dụ: Tư vấn miễn phí ngay"
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cta-primary-link">Nút chính - Link *</Label>
                      <Input
                        id="cta-primary-link"
                        value={ctaData.primaryButtonLink}
                        onChange={(e) => setCtaData({ ...ctaData, primaryButtonLink: e.target.value })}
                        placeholder="Ví dụ: /contact"
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Nút phụ - Text *"
                        value={getLocaleValue(ctaData, 'secondaryButtonText')}
                        onChange={(value) => {
                          const updated = setLocaleValue(ctaData, 'secondaryButtonText', value);
                          setCtaData(updated as CtaFormData);
                        }}
                        placeholder="Ví dụ: Xem case studies"
                        defaultLocale={globalLocale}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cta-secondary-link">Nút phụ - Link *</Label>
                      <Input
                        id="cta-secondary-link"
                        value={ctaData.secondaryButtonLink}
                        onChange={(e) => setCtaData({ ...ctaData, secondaryButtonLink: e.target.value })}
                        placeholder="Ví dụ: /solutions"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cta-bg-color">Màu nền</Label>
                      <Input
                        id="cta-bg-color"
                        type="color"
                        value={ctaData.backgroundColor}
                        onChange={(e) => setCtaData({ ...ctaData, backgroundColor: e.target.value })}
                        className="h-10"
                      />
                      <Input
                        value={ctaData.backgroundColor}
                        onChange={(e) => setCtaData({ ...ctaData, backgroundColor: e.target.value })}
                        placeholder="#29A3DD"
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="cta-isActive">Hiển thị</Label>
                      <Switch
                        id="cta-isActive"
                        checked={ctaData.isActive}
                        onCheckedChange={async (checked) => {
                          // If ctaData is null or missing title (indicates no data loaded), fetch from backend first
                          const titleValue = typeof ctaData.title === 'string' ? ctaData.title : (ctaData.title as any)?.vi || '';
                          if (!ctaData || !titleValue) {
                            try {
                              const response = await adminApiCall<{ success: boolean; data?: CtaFormData }>(
                                AdminEndpoints.productCta.get,
                              );
                              if (response?.data) {
                                const normalizedCta = migrateObjectToLocale(response.data);
                                // Đảm bảo primaryButtonLink, secondaryButtonLink, backgroundColor là string
                                if (normalizedCta.primaryButtonLink && typeof normalizedCta.primaryButtonLink === 'object' && !Array.isArray(normalizedCta.primaryButtonLink)) {
                                  if ('vi' in normalizedCta.primaryButtonLink || 'en' in normalizedCta.primaryButtonLink || 'ja' in normalizedCta.primaryButtonLink) {
                                    normalizedCta.primaryButtonLink = (normalizedCta.primaryButtonLink as any).vi || (normalizedCta.primaryButtonLink as any).en || '';
                                  }
                                }
                                if (normalizedCta.secondaryButtonLink && typeof normalizedCta.secondaryButtonLink === 'object' && !Array.isArray(normalizedCta.secondaryButtonLink)) {
                                  if ('vi' in normalizedCta.secondaryButtonLink || 'en' in normalizedCta.secondaryButtonLink || 'ja' in normalizedCta.secondaryButtonLink) {
                                    normalizedCta.secondaryButtonLink = (normalizedCta.secondaryButtonLink as any).vi || (normalizedCta.secondaryButtonLink as any).en || '';
                                  }
                                }
                                if (normalizedCta.backgroundColor && typeof normalizedCta.backgroundColor === 'object' && !Array.isArray(normalizedCta.backgroundColor)) {
                                  if ('vi' in normalizedCta.backgroundColor || 'en' in normalizedCta.backgroundColor || 'ja' in normalizedCta.backgroundColor) {
                                    normalizedCta.backgroundColor = (normalizedCta.backgroundColor as any).vi || (normalizedCta.backgroundColor as any).en || '#29A3DD';
                                  }
                                }
                                setCtaData({ ...normalizedCta, isActive: checked } as CtaFormData);
                              } else {
                                // Initialize with empty data if not found
                                setCtaData({
                                  title: { vi: '', en: '', ja: '' },
                                  description: { vi: '', en: '', ja: '' },
                                  primaryButtonText: { vi: '', en: '', ja: '' },
                                  primaryButtonLink: "",
                                  secondaryButtonText: { vi: '', en: '', ja: '' },
                                  secondaryButtonLink: "",
                                  backgroundColor: "#29A3DD",
                                  isActive: checked,
                                });
                              }
                            } catch (error) {
                              // Silently fail
                              setCtaData({ ...ctaData, isActive: checked });
                            }
                          } else {
                            setCtaData({ ...ctaData, isActive: checked });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveCta} disabled={loadingCta} className="gap-2">
                      <Save className="w-4 h-4" />
                      {loadingCta ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - CTA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-10 px-4 flex justify-center">
                    <div className="container mx-auto flex justify-center">
                      <div
                        className="
                          flex flex-col justify-center items-center
                          w-full max-w-[1298px]
                          py-[120px] px-[20px]
                          rounded-[16px]
                          text-center
                          shadow-lg
                        "
                        style={{ backgroundColor: ctaData.backgroundColor || "#29A3DD" }}
                      >
                        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                          <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">
                            {getLocalizedText(ctaData.title, globalLocale) || "Tiêu đề"}
                          </h2>
                          <p className="text-white/95 text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-medium">
                            {getLocalizedText(ctaData.description, globalLocale) || "Mô tả"}
                          </p>
                          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                            <a
                              href={ctaData.secondaryButtonLink || "#"}
                              className="flex h-[48px] px-[29px] py-[7px] justify-center items-center gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:opacity-90 transition-colors duration-300 w-full sm:w-auto min-w-[180px]"
                            >
                              {getLocalizedText(ctaData.secondaryButtonText, globalLocale) || "Nút phụ"}
                            </a>
                            <a
                              href={ctaData.primaryButtonLink || "#"}
                              className="group flex h-[48px] px-[29px] py-[7px] justify-center items-center gap-[12px] rounded-[12px] border border-white text-white font-medium hover:bg-white hover:opacity-90 transition-colors duration-300 w-full sm:w-auto min-w-[200px]"
                            >
                              <span>{getLocalizedText(ctaData.primaryButtonText, globalLocale) || "Nút chính"}</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Tab: Products List */}
        <TabsContent value="products" className="space-y-0">
          <Tabs
            value={activeSubTabs.products || "config"}
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, products: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {/* Tab Controls - Locale Selector và Translate Button */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* Locale Selector */}
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Hiển thị:</Label>
                        <Select value={globalLocale} onValueChange={(value: 'vi' | 'en' | 'ja') => setGlobalLocale(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Translate Controls */}
                    <div className="flex items-center gap-2">
                      {/* Source Language Selector */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Dịch từ:</Label>
                        <Select value={translateSourceLang} onValueChange={(value: 'vi' | 'en' | 'ja') => setTranslateSourceLang(value)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Translate Button */}
                      <Button
                        onClick={() => handleTranslateSection('listHeader')}
                        disabled={translatingAll}
                        variant="outline"
                        className="gap-2"
                      >
                        {translatingAll ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Đang dịch...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Dịch khối này</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* List Header Config */}
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("productsListHeader")}
                  >
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-1">
                        {collapsedBlocks.productsListHeader ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )}
                        Header Danh sách Sản phẩm
                      </CardTitle>
                      <p className="text-sm text-gray-600 ml-8">Cấu hình header cho phần danh sách sản phẩm</p>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); handleSaveListHeader(); }} disabled={loadingListHeader} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {loadingListHeader ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.productsListHeader && (
                  <CardContent className="space-y-4 px-6 py-4">
                  <div>
                    <LocaleInput
                      label="Subtitle (Label trên cùng)"
                      value={getLocaleValue(listHeaderData, 'subtitle')}
                      onChange={(value) => {
                        const updated = setLocaleValue(listHeaderData, 'subtitle', value);
                        setListHeaderData(updated as ListHeaderFormData);
                      }}
                      placeholder="GIẢI PHÁP CHUYÊN NGHIỆP"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Tiêu đề chính *"
                      value={getLocaleValue(listHeaderData, 'title')}
                      onChange={(value) => {
                        const updated = setLocaleValue(listHeaderData, 'title', value);
                        setListHeaderData(updated as ListHeaderFormData);
                      }}
                      placeholder="Sản phẩm & giải pháp nổi bật"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Mô tả"
                      value={getLocaleValue(listHeaderData, 'description')}
                      onChange={(value) => {
                        const updated = setLocaleValue(listHeaderData, 'description', value);
                        setListHeaderData(updated as ListHeaderFormData);
                      }}
                      placeholder="Danh sách các hệ thống phần mềm đang được SFB triển khai..."
                      multiline={true}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Kích hoạt</Label>
                    <Switch
                      checked={listHeaderData.isActive}
                      onCheckedChange={async (checked) => {
                        // If listHeaderData is null or missing title (indicates no data loaded), fetch from backend first
                        const titleValue = typeof listHeaderData.title === 'string' ? listHeaderData.title : (listHeaderData.title as any)?.vi || '';
                        if (!listHeaderData || !titleValue) {
                          try {
                            const response = await adminApiCall<{ success: boolean; data?: ListHeaderFormData }>(
                              AdminEndpoints.productListHeader.get,
                            );
                            if (response?.data) {
                              const normalizedHeader = migrateObjectToLocale(response.data);
                              setListHeaderData({ ...normalizedHeader, isActive: checked } as ListHeaderFormData);
                            } else {
                              // Initialize with empty data if not found
                              setListHeaderData({
                                subtitle: { vi: '', en: '', ja: '' },
                                title: { vi: '', en: '', ja: '' },
                                description: { vi: '', en: '', ja: '' },
                                isActive: checked,
                              });
                            }
                          } catch (error) {
                            // Silently fail
                            setListHeaderData({ ...listHeaderData, isActive: checked });
                          }
                        } else {
                          setListHeaderData({ ...listHeaderData, isActive: checked });
                        }
                      }}
                    />
                  </div>
                  </CardContent>
                )}
              </Card>

              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("productsList")}
                  >
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3 mb-1">
                        {collapsedBlocks.productsList ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )}
                        Danh sách Sản phẩm
                      </h2>
                      <p className="text-sm text-gray-600 ml-8">Quản lý danh sách sản phẩm và giải pháp</p>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); handleCreateNew(); }} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Tạo sản phẩm mới
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.productsList && (
                  <CardContent className="space-y-4 px-6 py-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-700 mb-1">Tổng sản phẩm</p>
                        <div className="text-3xl font-bold text-blue-900">{totalProducts}</div>
                      </div>
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-700 mb-1">Sản phẩm nổi bật</p>
                        <div className="text-3xl font-bold text-yellow-900">{totalFeatured}</div>
                      </div>
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md">
                        <Star className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-green-50 to-green-100/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-700 mb-1">Đang hoạt động</p>
                        <div className="text-3xl font-bold text-green-900">{totalActive}</div>
                      </div>
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-row flex-nowrap gap-3 items-center overflow-x-auto">
                    {/* Ô tìm kiếm - chiếm phần còn lại */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10"
                      />
                    </div>

                    {/* Filter danh mục */}
                    <div className="flex-shrink-0 w-[180px]">
                      <Select
                        value={categoryFilter === "all" ? "all" : String(categoryFilter)}
                        onValueChange={(value) =>
                          setCategoryFilter(value === "all" ? "all" : Number(value))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả danh mục</SelectItem>
                          {categories
                            .filter((c) => c.isActive)
                            .map((category) => (
                              <SelectItem key={category.id} value={String(category.id)}>
                                {typeof category.name === 'string'
                                  ? category.name
                                  : getLocalizedText(category.name, globalLocale)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filter nổi bật */}
                    <div className="flex-shrink-0 w-[140px]">
                      <Select
                        value={featuredFilter}
                        onValueChange={(value) =>
                          setFeaturedFilter(value as "all" | "featured" | "normal")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Nổi bật" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="featured">Nổi bật</SelectItem>
                          <SelectItem value="normal">Bình thường</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filter trạng thái */}
                    <div className="flex-shrink-0 w-[160px]">
                      <Select
                        value={activeFilter}
                        onValueChange={(value) =>
                          setActiveFilter(value as "all" | "active" | "inactive")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="active">Đang hoạt động</SelectItem>
                          <SelectItem value="inactive">Đã ẩn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách sản phẩm ({filteredProducts.length})</CardTitle>
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
                      <table className="w-full border-collapse" role="table" aria-label="Danh sách sản phẩm">
                        <thead>
                          <tr className="border-b bg-muted/30">
                            <th scope="col" className="text-left p-2 font-semibold">Hình ảnh</th>
                            <th scope="col" className="text-left p-2 font-semibold">Tên sản phẩm</th>
                            <th scope="col" className="text-left p-2 font-semibold">Danh mục</th>
                            <th scope="col" className="text-left p-2 font-semibold">Tagline</th>
                            <th scope="col" className="text-center p-2 font-semibold">Trạng thái</th>
                            <th scope="col" className="text-center p-2 font-semibold">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((product) => (
                            <ProductRow
                              key={product.id}
                              product={product}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onToggleActive={handleToggleActive}
                              onToggleFeatured={handleToggleFeatured}
                              globalLocale={globalLocale}
                            />
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
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Products List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Preview Header */}
                    <div className="flex flex-col items-center justify-center gap-10 sm:gap-12 lg:gap-[60px] px-6 lg:px-10">
                      <div className="flex w-full max-w-[549px] flex-col items-start gap-6">
                        {getLocalizedText(listHeaderData.subtitle, globalLocale) && (
                          <div className="text-[15px] font-semibold tracking-widest text-[#2EABE2] uppercase">
                            {getLocalizedText(listHeaderData.subtitle, globalLocale)}
                          </div>
                        )}
                        {getLocalizedText(listHeaderData.title, globalLocale) && (
                          <h2 className="text-gray-900 text-4xl md:text-5xl font-extrabold">
                            {getLocalizedText(listHeaderData.title, globalLocale)}
                          </h2>
                        )}
                        {getLocalizedText(listHeaderData.description, globalLocale) && (
                          <p className="text-gray-600 leading-relaxed">
                            {getLocalizedText(listHeaderData.description, globalLocale)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Danh sách Sản phẩm</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedProducts
                          .filter((p) => p.isActive !== false)
                          .slice(0, 6)
                          .map((product) => (
                            <Card key={product.id} className="overflow-hidden">
                              {product.image && (
                                <div className="aspect-video w-full overflow-hidden bg-muted">
                                  <img
                                    src={product.image}
                                    alt={typeof product.name === 'string' ? product.name : getLocalizedText(product.name, globalLocale)}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <CardHeader>
                                <CardTitle className="text-lg">{typeof product.name === 'string' ? product.name : getLocalizedText(product.name, globalLocale)}</CardTitle>
                                {product.tagline && (
                                  <p className="text-sm text-muted-foreground">{typeof product.tagline === 'string' ? product.tagline : getLocalizedText(product.tagline, globalLocale)}</p>
                                )}
                              </CardHeader>
                              <CardContent>
                                {product.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {typeof product.description === 'string' ? product.description : getLocalizedText(product.description, globalLocale)}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Benefit Modal */}
      <Dialog open={benefitModalOpen} onOpenChange={setBenefitModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBenefitId === -1 ? "Tạo lợi ích mới" : "Chỉnh sửa lợi ích"}
            </DialogTitle>
            <DialogDescription>
              {editingBenefitId === -1
                ? "Thêm một lợi ích mới vào danh sách"
                : "Cập nhật thông tin lợi ích"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Icon/Image</Label>
              <ImageUpload
                currentImage={benefitFormData.icon || ""}
                onImageSelect={(url: string) => setBenefitFormData({ ...benefitFormData, icon: url })}
              />
            </div>
            <div className="space-y-2">
              <LocaleInput
                label="Title *"
                value={getLocaleValue(benefitFormData, 'title')}
                onChange={(value) => {
                  const updated = setLocaleValue(benefitFormData, 'title', value);
                  setBenefitFormData(updated as Partial<Benefit>);
                }}
                placeholder="Bảo mật cao"
                defaultLocale={globalLocale}
              />
            </div>
            <div className="space-y-2">
              <LocaleInput
                label="Description"
                value={getLocaleValue(benefitFormData, 'description')}
                onChange={(value) => {
                  const updated = setLocaleValue(benefitFormData, 'description', value);
                  setBenefitFormData(updated as Partial<Benefit>);
                }}
                placeholder="Mô tả lợi ích..."
                multiline={true}
                defaultLocale={globalLocale}
              />
            </div>
            <div className="space-y-2">
              <Label>Gradient</Label>
              <Input
                value={benefitFormData.gradient || ""}
                onChange={(e) =>
                  setBenefitFormData({ ...benefitFormData, gradient: e.target.value })
                }
                placeholder="from-[#006FB3] to-[#0088D9]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={benefitFormData.isActive !== false}
                onCheckedChange={(checked) =>
                  setBenefitFormData({ ...benefitFormData, isActive: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBenefitModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveBenefit}>
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategoryId === -1 ? "Tạo danh mục mới" : "Chỉnh sửa danh mục"}
            </DialogTitle>
            <DialogDescription>
              {editingCategoryId === -1
                ? "Thêm một danh mục mới vào danh sách"
                : "Cập nhật thông tin danh mục"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={categoryFormData.slug || ""}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, slug: e.target.value })
                }
                placeholder="edu, justice, gov, kpi"
              />
              <p className="text-xs text-muted-foreground">
                Slug phải là duy nhất và không có khoảng trắng
              </p>
            </div>
            <div className="space-y-2">
              <LocaleInput
                label="Name *"
                value={getLocaleValue(categoryFormData, 'name')}
                onChange={(value) => {
                  const updated = setLocaleValue(categoryFormData, 'name', value);
                  setCategoryFormData(updated as Partial<Category>);
                }}
                placeholder="Giải pháp Giáo dục"
                defaultLocale={globalLocale}
                aiProvider={aiProvider}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon Name</Label>
              <Select
                value={categoryFormData.iconName || "Package"}
                onValueChange={(value) =>
                  setCategoryFormData({ ...categoryFormData, iconName: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((iconName) => {
                    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Package;
                    return (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{iconName}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {categoryFormData.iconName && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Preview:</span>
                  {renderIcon(categoryFormData.iconName)}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={categoryFormData.sortOrder || 0}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    sortOrder: Number(e.target.value),
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={categoryFormData.isActive !== false}
                onCheckedChange={(checked) =>
                  setCategoryFormData({ ...categoryFormData, isActive: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveCategory}>
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
