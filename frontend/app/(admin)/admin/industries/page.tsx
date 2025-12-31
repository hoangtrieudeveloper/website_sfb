"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown, Save, ArrowRight, Target, Users, Award, Sparkles, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IndustryItem {
  id: number;
  iconName: string;
  title: string;
  short: string;
  points: string[];
  gradient: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface HeroStat {
  id?: number;
  iconName: string;
  value: string;
  label: string;
  gradient: string;
  sortOrder: number;
}

interface HeroData {
  id?: number;
  titlePrefix: string;
  titleSuffix: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  backgroundGradient: string;
  stats: HeroStat[];
  isActive: boolean;
}

interface ListHeaderData {
  id?: number;
  title: string;
  description: string;
  isActive: boolean;
}

interface ProcessStep {
  id?: number;
  stepId: string;
  iconName: string;
  title: string;
  description: string;
  points: string[];
  image: string;
  colors: {
    gradient: string;
    strip: string;
    border: string;
    shadowBase: string;
    shadowHover: string;
    check: string;
  };
  button: {
    text: string;
    link: string;
    iconName: string;
    iconSize: number;
  };
  sortOrder: number;
  isActive: boolean;
}

interface ProcessData {
  header: {
    id?: number;
    subtitle: string;
    titlePart1: string;
    titleHighlight: string;
    titlePart2: string;
    isActive: boolean;
  } | null;
  steps: ProcessStep[];
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
  { value: "from-blue-500 to-cyan-500", label: "Xanh dương - Cyan" },
  { value: "from-purple-500 to-pink-500", label: "Tím - Hồng" },
  { value: "from-emerald-500 to-teal-500", label: "Xanh lá - Teal" },
  { value: "from-orange-500 to-amber-500", label: "Cam - Vàng" },
  { value: "from-sky-500 to-blue-600", label: "Sky - Blue" },
  { value: "from-rose-500 to-pink-500", label: "Rose - Pink" },
  { value: "from-indigo-500 to-purple-500", label: "Indigo - Purple" },
  { value: "from-green-500 to-emerald-500", label: "Green - Emerald" },
];

const HERO_GRADIENT_OPTIONS = [
  { value: "linear-gradient(31deg, #0870B4 51.21%, #2EABE2 97.73%)", label: "Xanh dương SFB" },
  { value: "linear-gradient(to bottom right, #8B5CF6, #EC4899)", label: "Tím - Hồng" },
  { value: "linear-gradient(to bottom right, #10B981, #14B8A6)", label: "Xanh lá - Teal" },
  { value: "linear-gradient(to bottom right, #F59E0B, #FBBF24)", label: "Cam - Vàng" },
];

export default function AdminIndustriesPage() {
  // Industries List State
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<IndustryItem>>({});

  // Hero State
  const [heroData, setHeroData] = useState<HeroData>({
    titlePrefix: "",
    titleSuffix: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: "",
    backgroundGradient: HERO_GRADIENT_OPTIONS[0].value,
    stats: [],
    isActive: true,
  });
  const [loadingHero, setLoadingHero] = useState(false);
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
  const [statFormData, setStatFormData] = useState<HeroStat | null>(null);

  // List Header State
  const [listHeaderData, setListHeaderData] = useState<ListHeaderData>({
    title: "",
    description: "",
    isActive: true,
  });
  const [loadingListHeader, setLoadingListHeader] = useState(false);

  // Process State
  const [processData, setProcessData] = useState<ProcessData>({
    header: null,
    steps: [],
  });
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepFormData, setStepFormData] = useState<any>(null);

  // Fetch Industries
  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const data = await adminApiCall<{ success: boolean; data?: IndustryItem[] }>(
        AdminEndpoints.industries.list,
      );
      setIndustries(data?.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách lĩnh vực");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Hero
  const fetchHero = async () => {
    try {
      setLoadingHero(true);
      const data = await adminApiCall<{ success: boolean; data?: HeroData }>(
        AdminEndpoints.industries.hero.get,
      );
      if (data?.data) {
        setHeroData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải hero");
    } finally {
      setLoadingHero(false);
    }
  };

  // Fetch List Header
  const fetchListHeader = async () => {
    try {
      setLoadingListHeader(true);
      const data = await adminApiCall<{ success: boolean; data?: ListHeaderData }>(
        AdminEndpoints.industries.listHeader.get,
      );
      if (data?.data) {
        setListHeaderData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải list header");
    } finally {
      setLoadingListHeader(false);
    }
  };

  // Fetch Process
  const fetchProcess = async () => {
    try {
      setLoadingProcess(true);
      const data = await adminApiCall<{ success: boolean; data?: ProcessData }>(
        AdminEndpoints.industries.process.get,
      );
      if (data?.data) {
        setProcessData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải process");
    } finally {
      setLoadingProcess(false);
    }
  };

  useEffect(() => {
    void fetchIndustries();
    void fetchHero();
    void fetchListHeader();
    void fetchProcess();
  }, []);

  // Industries handlers (giữ nguyên từ code cũ)
  const filteredIndustries = useMemo(() => {
    let filtered = industries;

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.short.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (activeFilter === "active") {
      filtered = filtered.filter((item) => item.isActive);
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter((item) => !item.isActive);
    }

    return filtered;
  }, [industries, search, activeFilter]);

  const paginatedIndustries = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredIndustries.slice(start, start + PAGE_SIZE);
  }, [filteredIndustries, page]);

  const totalPages = Math.ceil(filteredIndustries.length / PAGE_SIZE);

  const handleCreate = () => {
    setEditingId(-1);
    setFormData({
      iconName: "Code2",
      title: "",
      short: "",
      points: [""],
      gradient: GRADIENT_OPTIONS[0].value,
      sortOrder: industries.length,
      isActive: true,
    });
  };

  const handleEdit = (industry: IndustryItem) => {
    setEditingId(industry.id);
    setFormData(industry);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (!formData.title) {
        toast.error("Title không được để trống");
        return;
      }

      const cleanPoints = (formData.points || []).filter((p) => p.trim() !== "");

      const dataToSave = {
        ...formData,
        points: cleanPoints,
      };

      if (editingId === -1) {
        await adminApiCall(AdminEndpoints.industries.list, {
          method: "POST",
          body: JSON.stringify(dataToSave),
        });
        toast.success("Đã tạo lĩnh vực");
      } else if (editingId) {
        await adminApiCall(AdminEndpoints.industries.detail(editingId), {
          method: "PUT",
          body: JSON.stringify(dataToSave),
        });
        toast.success("Đã cập nhật lĩnh vực");
      }

      handleCancel();
      void fetchIndustries();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu lĩnh vực");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lĩnh vực này?")) return;
    try {
      await adminApiCall(AdminEndpoints.industries.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa lĩnh vực");
      void fetchIndustries();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa lĩnh vực");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    try {
      const newIndustries = [...filteredIndustries];
      [newIndustries[index - 1], newIndustries[index]] = [
        newIndustries[index],
        newIndustries[index - 1],
      ];

      await Promise.all(
        newIndustries.map((industry, i) =>
          adminApiCall(AdminEndpoints.industries.detail(industry.id), {
            method: "PUT",
            body: JSON.stringify({
              ...industry,
              sortOrder: i,
            }),
          }),
        ),
      );

      toast.success("Đã cập nhật vị trí");
      void fetchIndustries();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật vị trí");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === filteredIndustries.length - 1) return;
    try {
      const newIndustries = [...filteredIndustries];
      [newIndustries[index], newIndustries[index + 1]] = [
        newIndustries[index + 1],
        newIndustries[index],
      ];

      await Promise.all(
        newIndustries.map((industry, i) =>
          adminApiCall(AdminEndpoints.industries.detail(industry.id), {
            method: "PUT",
            body: JSON.stringify({
              ...industry,
              sortOrder: i,
            }),
          }),
        ),
      );

      toast.success("Đã cập nhật vị trí");
      void fetchIndustries();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật vị trí");
    }
  };

  const handleAddPoint = () => {
    setFormData({
      ...formData,
      points: [...(formData.points || []), ""],
    });
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = [...(formData.points || [])];
    newPoints.splice(index, 1);
    setFormData({ ...formData, points: newPoints });
  };

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...(formData.points || [])];
    newPoints[index] = value;
    setFormData({ ...formData, points: newPoints });
  };

  // Hero handlers
  const handleSaveHero = async () => {
    try {
      setLoadingHero(true);
      await adminApiCall(AdminEndpoints.industries.hero.update, {
        method: "PUT",
        body: JSON.stringify(heroData),
      });
      toast.success("Đã lưu hero banner");
      void fetchHero();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu hero banner");
    } finally {
      setLoadingHero(false);
    }
  };

  const handleAddStat = () => {
    setStatFormData({
      iconName: "Award",
      value: "",
      label: "",
      gradient: GRADIENT_OPTIONS[0].value,
      sortOrder: heroData.stats.length,
    });
    setEditingStatIndex(-1);
  };

  const handleEditStat = (index: number) => {
    setStatFormData({ ...heroData.stats[index] });
    setEditingStatIndex(index);
  };

  const handleCancelStat = () => {
    setEditingStatIndex(null);
    setStatFormData(null);
  };

  const handleSaveStat = () => {
    if (editingStatIndex === -1) {
      // Add new stat
      setHeroData({
        ...heroData,
        stats: [...heroData.stats, statFormData!],
      });
      toast.success("Đã thêm stat mới");
    } else if (editingStatIndex !== null) {
      // Update existing stat
      const newStats = [...heroData.stats];
      newStats[editingStatIndex] = statFormData!;
      setHeroData({ ...heroData, stats: newStats });
      toast.success("Đã cập nhật stat");
    }
    handleCancelStat();
  };

  const handleStatFormChange = (field: keyof HeroStat, value: string | number) => {
    setStatFormData({ ...statFormData!, [field]: value });
  };

  const handleRemoveStat = (index: number) => {
    const newStats = [...heroData.stats];
    newStats.splice(index, 1);
    setHeroData({ ...heroData, stats: newStats });
    toast.success("Đã xóa stat");
  };

  // List Header handlers
  const handleSaveListHeader = async () => {
    try {
      setLoadingListHeader(true);
      await adminApiCall(AdminEndpoints.industries.listHeader.update, {
        method: "PUT",
        body: JSON.stringify(listHeaderData),
      });
      toast.success("Đã lưu list header");
      void fetchListHeader();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu list header");
    } finally {
      setLoadingListHeader(false);
    }
  };

  // Process handlers
  const handleSaveProcess = async () => {
    try {
      setLoadingProcess(true);
      await adminApiCall(AdminEndpoints.industries.process.update, {
        method: "PUT",
        body: JSON.stringify(processData),
      });
      toast.success("Đã lưu process");
      void fetchProcess();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu process");
    } finally {
      setLoadingProcess(false);
    }
  };

  const handleAddStep = () => {
    setStepFormData({
      stepId: String(processData.steps.length + 1).padStart(2, "0"),
      iconName: "Target",
      title: "",
      description: "",
      points: [],
      image: "",
      colors: {
        gradient: "from-blue-500 to-cyan-500",
        strip: "from-blue-500 via-cyan-500 to-sky-400",
        border: "border-blue-100",
        shadowBase: "rgba(15,23,42,0.06)",
        shadowHover: "rgba(37,99,235,0.18)",
        check: "text-blue-600",
      },
      button: {
        text: "",
        link: "",
        iconName: "ArrowRight",
        iconSize: 18,
      },
      sortOrder: processData.steps.length,
      isActive: true,
    });
    setEditingStepIndex(-1);
  };

  const handleEditStep = (index: number) => {
    setStepFormData({ ...processData.steps[index] });
    setEditingStepIndex(index);
  };

  const handleCancelStep = () => {
    setEditingStepIndex(null);
    setStepFormData(null);
  };

  const handleSaveStep = async () => {
    try {
      let updatedSteps;
      if (editingStepIndex === -1) {
        // Add new step
        updatedSteps = [...processData.steps, stepFormData];
      } else if (editingStepIndex !== null) {
        // Update existing step
        updatedSteps = [...processData.steps];
        updatedSteps[editingStepIndex] = stepFormData;
      } else {
        return;
      }

      // Update local state
      const updatedProcessData = {
        ...processData,
        steps: updatedSteps,
      };
      setProcessData(updatedProcessData);

      // Save to DB
      setLoadingProcess(true);
      await adminApiCall(AdminEndpoints.industries.process.update, {
        method: "PUT",
        body: JSON.stringify(updatedProcessData),
      });
      toast.success("Đã lưu step thành công");
      handleCancelStep();
      void fetchProcess();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu step");
    } finally {
      setLoadingProcess(false);
    }
  };

  const handleStepFormChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setStepFormData({
        ...stepFormData,
        [parent]: {
          ...(stepFormData as any)[parent],
          [child]: value,
        },
      });
    } else {
      setStepFormData({ ...stepFormData, [field]: value });
    }
  };

  const handleAddStepPoint = () => {
    setStepFormData({
      ...stepFormData,
      points: [...(stepFormData.points || []), ""],
    });
  };

  const handleRemoveStepPoint = (pointIndex: number) => {
    const newPoints = [...(stepFormData.points || [])];
    newPoints.splice(pointIndex, 1);
    setStepFormData({ ...stepFormData, points: newPoints });
  };

  const handleStepPointChange = (pointIndex: number, value: string) => {
    const newPoints = [...(stepFormData.points || [])];
    newPoints[pointIndex] = value;
    setStepFormData({ ...stepFormData, points: newPoints });
  };

  const handleRemoveStep = (index: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa step này?")) return;
    const newSteps = [...processData.steps];
    newSteps.splice(index, 1);
    setProcessData({ ...processData, steps: newSteps });
    toast.success("Đã xóa step");
  };

  const handleMoveStepUp = async (index: number) => {
    if (index === 0) return;
    try {
      const newSteps = [...processData.steps];
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];

      const updatedProcessData = {
        ...processData,
        steps: newSteps,
      };
      setProcessData(updatedProcessData);

      setLoadingProcess(true);
      await adminApiCall(AdminEndpoints.industries.process.update, {
        method: "PUT",
        body: JSON.stringify(updatedProcessData),
      });
      toast.success("Đã cập nhật thứ tự step");
      void fetchProcess();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật thứ tự step");
    } finally {
      setLoadingProcess(false);
    }
  };

  const handleMoveStepDown = async (index: number) => {
    if (index === processData.steps.length - 1) return;
    try {
      const newSteps = [...processData.steps];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];

      const updatedProcessData = {
        ...processData,
        steps: newSteps,
      };
      setProcessData(updatedProcessData);

      setLoadingProcess(true);
      await adminApiCall(AdminEndpoints.industries.process.update, {
        method: "PUT",
        body: JSON.stringify(updatedProcessData),
      });
      toast.success("Đã cập nhật thứ tự step");
      void fetchProcess();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật thứ tự step");
    } finally {
      setLoadingProcess(false);
    }
  };

  const activeIndustries = industries.filter((i) => i.isActive);

  // Render icon component
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code2;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lĩnh vực</h1>
          <p className="text-gray-600 mt-1">Quản lý đầy đủ các phần của trang lĩnh vực</p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero Banner</TabsTrigger>
          <TabsTrigger value="list">Danh sách lĩnh vực</TabsTrigger>
          <TabsTrigger value="process">Lộ trình đồng hành</TabsTrigger>
        </TabsList>

        {/* Tab: Danh sách lĩnh vực */}
        <TabsContent value="list" className="space-y-0">
          <Tabs defaultValue="config" className="w-full">
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {/* List Header Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Header cho danh sách lĩnh vực</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Cấu hình tiêu đề và mô tả cho phần danh sách</p>
                    </div>
                    <Button onClick={handleSaveListHeader} disabled={loadingListHeader} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {loadingListHeader ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="pb-2">Tiêu đề *</Label>
                    <Input
                      value={listHeaderData.title}
                      onChange={(e) => setListHeaderData({ ...listHeaderData, title: e.target.value })}
                      placeholder="Các lĩnh vực hoạt động & dịch vụ"
                    />
                  </div>
                  <div>
                    <Label className="pb-2">Mô tả</Label>
                    <Textarea
                      value={listHeaderData.description}
                      onChange={(e) => setListHeaderData({ ...listHeaderData, description: e.target.value })}
                      placeholder="Mô tả..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="pb-2">Kích hoạt</Label>
                    <Switch
                      checked={listHeaderData.isActive}
                      onCheckedChange={(checked) => setListHeaderData({ ...listHeaderData, isActive: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Industries List Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Danh sách lĩnh vực</h2>
                  <p className="text-gray-600 mt-1">Quản lý các lĩnh vực hoạt động & dịch vụ</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tạo lĩnh vực mới
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-700 mb-1">
                          Tổng lĩnh vực
                        </p>
                        <div className="text-3xl font-bold text-blue-900">
                          {industries.length}
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        <Target className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-green-50 to-green-100/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-700 mb-1">
                          Đang hoạt động
                        </p>
                        <div className="text-3xl font-bold text-green-900">
                          {activeIndustries.length}
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Search Input - Larger */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Tìm kiếm
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="Tìm kiếm theo tên, mô tả lĩnh vực..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-12 h-12 text-base"
                        />
                      </div>
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                      <div className="flex-1 w-full sm:w-auto">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Trạng thái
                        </Label>
                        <Select
                          value={activeFilter}
                          onValueChange={(value) => setActiveFilter(value as "all" | "active" | "inactive")}
                        >
                          <SelectTrigger className="w-full sm:w-[200px] h-11">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="active">Đang hoạt động</SelectItem>
                            <SelectItem value="inactive">Đã ẩn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dialog Create/Edit */}
              <Dialog open={editingId !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancel();
                }
              }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId === -1 ? "Thêm lĩnh vực mới" : "Chỉnh sửa lĩnh vực"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingId === -1
                        ? "Điền thông tin để tạo lĩnh vực mới"
                        : "Cập nhật thông tin lĩnh vực"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="pb-2">Icon</Label>
                        <Select
                          value={formData.iconName || "Code2"}
                          onValueChange={(value) => setFormData({ ...formData, iconName: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {icon}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="pb-2">Gradient</Label>
                        <Select
                          value={formData.gradient || GRADIENT_OPTIONS[0].value}
                          onValueChange={(value) => setFormData({ ...formData, gradient: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADIENT_OPTIONS.map((grad) => (
                              <SelectItem key={grad.value} value={grad.value}>
                                {grad.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="pb-2">Tiêu đề *</Label>
                        <Input
                          value={formData.title || ""}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Nhập tiêu đề lĩnh vực..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="pb-2">Mô tả ngắn</Label>
                        <Input
                          value={formData.short || ""}
                          onChange={(e) => setFormData({ ...formData, short: e.target.value })}
                          placeholder="Nhập mô tả ngắn..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="pb-2">Các điểm nổi bật</Label>
                        <div className="space-y-2">
                          {(formData.points || []).map((point, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={point}
                                onChange={(e) => handlePointChange(index, e.target.value)}
                                placeholder={`Điểm ${index + 1}...`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemovePoint(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button type="button" variant="outline" onClick={handleAddPoint}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm điểm
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="pb-2">Thứ tự sắp xếp</Label>
                        <Input
                          type="number"
                          value={formData.sortOrder || 0}
                          onChange={(e) =>
                            setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive !== undefined ? formData.isActive : true}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="rounded"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium">
                          Hiển thị
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                      Hủy
                    </Button>
                    <Button onClick={handleSave}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Industries Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách lĩnh vực ({filteredIndustries.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Đang tải...</div>
                  ) : paginatedIndustries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Không có lĩnh vực nào
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paginatedIndustries.map((industry, index) => {
                        const globalIndex = filteredIndustries.findIndex((i) => i.id === industry.id);
                        return (
                          <Card key={industry.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[#008CCB] rounded-lg flex items-center justify-center text-white">
                                      {renderIcon(industry.iconName)}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg">{industry.title}</h3>
                                      <p className="text-sm text-gray-600">{industry.short}</p>
                                    </div>
                                  </div>
                                  <ul className="ml-13 space-y-1 mt-2">
                                    {industry.points.map((point, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-[#008CCB] mt-0.5 flex-shrink-0" />
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                    <span>Thứ tự: #{industry.sortOrder}</span>
                                    <Badge
                                      variant={industry.isActive ? "default" : "secondary"}
                                    >
                                      {industry.isActive ? "Đang hiển thị" : "Ẩn"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveUp(globalIndex)}
                                    disabled={globalIndex === 0}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveDown(globalIndex)}
                                    disabled={globalIndex === filteredIndustries.length - 1}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEdit(industry)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDelete(industry.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <span className="flex items-center px-4">
                    Trang {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Danh sách lĩnh vực</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-12 bg-white">
                    <div className="text-center mb-16 mx-auto max-w-[1244px]">
                      {listHeaderData.title && (
                        <h2
                          className="mb-6 mx-auto w-full text-center font-['Plus_Jakarta_Sans'] text-[56px] font-bold"
                          style={{
                            color: "var(--Color-2, #0F172A)",
                            fontFeatureSettings: "'liga' off, 'clig' off",
                            lineHeight: "normal",
                          }}
                        >
                          {listHeaderData.title}
                        </h2>
                      )}
                      {listHeaderData.description && (
                        <p
                          className="mx-auto w-[704px] max-w-full text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-[30px]"
                          style={{
                            color: "var(--Color-2, #0F172A)",
                            fontFeatureSettings: "'liga' off, 'clig' off",
                          }}
                        >
                          {listHeaderData.description}
                        </p>
                      )}
                    </div>
                    {activeIndustries.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Chưa có lĩnh vực nào đang hiển thị
                      </div>
                    ) : (
                      <div className="px-6 lg:px-[290px]">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {activeIndustries.map((industry, index) => (
                            <div
                              key={industry.id}
                              className="flex h-[405px] w-full flex-col items-start gap-6 rounded-[24px] px-[30px] py-[45px] bg-white shadow-lg"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#008CCB] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                  {index + 1}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 pt-1 leading-snug">
                                  {industry.title}
                                </h3>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed min-h-[40px]">
                                {industry.short}
                              </p>
                              <ul className="space-y-3">
                                {industry.points.map((point, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <div className="w-5 h-5 rounded-full bg-[#008CCB] flex items-center justify-center">
                                        <CheckCircle2 size={12} className="text-white" />
                                      </div>
                                    </div>
                                    <span className="text-sm text-gray-600 leading-snug">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Tab: Hero Banner */}
        <TabsContent value="hero" className="space-y-0">
          <Tabs defaultValue="config" className="w-full">
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Hero Banner</h2>
                  <p className="text-gray-600 mt-1">Cấu hình hero banner cho trang lĩnh vực</p>
                </div>
                <Button onClick={handleSaveHero} disabled={loadingHero}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingHero ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chính</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="pb-2">Tiêu đề Prefix *</Label>
                      <Input
                        value={heroData.titlePrefix}
                        onChange={(e) => setHeroData({ ...heroData, titlePrefix: e.target.value })}
                        placeholder="Giải pháp công nghệ tối ưu"
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Tiêu đề Suffix *</Label>
                      <Input
                        value={heroData.titleSuffix}
                        onChange={(e) => setHeroData({ ...heroData, titleSuffix: e.target.value })}
                        placeholder="vận hành doanh nghiệp"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="pb-2">Mô tả</Label>
                    <Textarea
                      value={heroData.description}
                      onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                      placeholder="Mô tả..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="pb-2">Button Text</Label>
                      <Input
                        value={heroData.buttonText}
                        onChange={(e) => setHeroData({ ...heroData, buttonText: e.target.value })}
                        placeholder="KHÁM PHÁ GIẢI PHÁP"
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Button Link</Label>
                      <Input
                        value={heroData.buttonLink}
                        onChange={(e) => setHeroData({ ...heroData, buttonLink: e.target.value })}
                        placeholder="/solutions"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="pb-2">Ảnh Hero</Label>
                    <ImageUpload
                      currentImage={heroData.image}
                      onImageSelect={(url) => setHeroData({ ...heroData, image: url })}
                    />
                  </div>
                  <div>
                    <Label className="pb-2">Background Gradient</Label>
                    <Select
                      value={heroData.backgroundGradient}
                      onValueChange={(value) => setHeroData({ ...heroData, backgroundGradient: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HERO_GRADIENT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="pb-2">Kích hoạt</Label>
                    <Switch
                      checked={heroData.isActive}
                      onCheckedChange={(checked) => setHeroData({ ...heroData, isActive: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Stats ({heroData.stats.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleAddStat}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Stat
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {heroData.stats.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có stat nào. Nhấn "Thêm Stat" để thêm.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {heroData.stats.map((stat, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {renderIcon(stat.iconName)}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">
                                      {stat.value || "Chưa có giá trị"}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {stat.label || "Chưa có label"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditStat(index)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Chỉnh sửa
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveStat(index)}
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
              </Card>

              {/* Dialog Stat Form */}
              <Dialog open={editingStatIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancelStat();
                }
              }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingStatIndex === -1 ? "Thêm Stat mới" : `Chỉnh sửa Stat`}
                    </DialogTitle>
                    <DialogDescription>
                      {editingStatIndex === -1
                        ? "Điền thông tin để tạo stat mới"
                        : "Cập nhật thông tin stat"}
                    </DialogDescription>
                  </DialogHeader>
                  {statFormData && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="pb-2">Icon Name</Label>
                          <Select
                            value={statFormData.iconName || "Award"}
                            onValueChange={(value) => handleStatFormChange("iconName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="pb-2">Gradient</Label>
                          <Select
                            value={statFormData.gradient || GRADIENT_OPTIONS[0].value}
                            onValueChange={(value) => handleStatFormChange("gradient", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {GRADIENT_OPTIONS.map((grad) => (
                                <SelectItem key={grad.value} value={grad.value}>
                                  {grad.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="pb-2">Value</Label>
                          <Input
                            value={statFormData.value || ""}
                            onChange={(e) => handleStatFormChange("value", e.target.value)}
                            placeholder="8+ năm"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Label</Label>
                          <Input
                            value={statFormData.label || ""}
                            onChange={(e) => handleStatFormChange("label", e.target.value)}
                            placeholder="Kinh nghiệm triển khai"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Sort Order</Label>
                          <Input
                            type="number"
                            value={statFormData.sortOrder || 0}
                            onChange={(e) =>
                              handleStatFormChange("sortOrder", parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelStat}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveStat}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Hero Banner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{
                      minHeight: '847px',
                      background: heroData.backgroundGradient || 'linear-gradient(31deg, #0870B4 51.21%, #2EABE2 97.73%)',
                      paddingTop: '87px'
                    }}
                  >
                    {/* Background grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

                    {/* Glow effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px]" />
                      <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-cyan-400/20 rounded-full blur-[100px]" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 h-full flex items-center justify-center">
                      <div className="flex flex-row items-center justify-center w-full overflow-hidden" style={{ gap: '0' }}>
                        {/* Left Column: Image with decorative elements */}
                        <div className="relative flex justify-start mr-[-55px] z-10 flex-shrink-0">
                          <div className="relative" style={{ width: '991px', height: '782px', flexShrink: 0 }}>
                            {/* Decorative background glow */}
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full filter blur-3xl opacity-30 transform scale-75" />

                            {/* Main Image */}
                            {heroData.image && (
                              <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <img
                                  src={heroData.image}
                                  alt="Hero"
                                  className="w-full h-full object-cover drop-shadow-2xl"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('bg-white/5', 'border-2', 'border-dashed', 'border-white/20', 'rounded-xl');
                                  }}
                                />
                              </div>
                            )}

                            {/* Decorative tech icons floating around */}
                            <div className="absolute inset-0 pointer-events-none z-20">
                              {/* PHP Badge */}
                              <div className="absolute top-[10%] left-[5%] bg-red-500 text-white px-3 py-1 rounded text-sm font-bold" style={{ fontSize: '12px' }}>
                                PHP
                              </div>
                              {/* JAVA Badge */}
                              <div className="absolute top-[20%] right-[10%] bg-blue-400 text-white px-3 py-1 rounded text-sm font-bold" style={{ fontSize: '12px' }}>
                                JAVA
                              </div>
                              {/* HTML Badge */}
                              <div className="absolute bottom-[30%] left-[8%] bg-yellow-500 text-white px-3 py-1 rounded text-sm font-bold" style={{ fontSize: '12px' }}>
                                HTML
                              </div>
                              {/* JS Badge */}
                              <div className="absolute bottom-[20%] right-[15%] bg-green-400 text-white px-3 py-1 rounded text-sm font-bold" style={{ fontSize: '12px' }}>
                                JS
                              </div>
                              {/* CSS Badge */}
                              <div className="absolute top-[50%] left-[2%] bg-orange-600 text-white px-3 py-1 rounded text-sm font-bold" style={{ fontSize: '12px' }}>
                                CSS
                              </div>
                              {/* Code tags */}
                              <div className="absolute top-[40%] right-[5%] bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono">
                                &lt;/&gt;
                              </div>
                              {/* Curly braces */}
                              <div className="absolute bottom-[40%] left-[12%] bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono">
                                {'{}'}
                              </div>
                              {/* Binary code snippets */}
                              <div className="absolute top-[15%] left-[50%] text-white/30 text-xs font-mono" style={{ fontSize: '10px' }}>
                                0101010
                              </div>
                              <div className="absolute bottom-[15%] right-[25%] text-purple-300/40 text-xs font-mono" style={{ fontSize: '10px' }}>
                                0101010
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Content */}
                        <div className="text-white flex-shrink-0" style={{ minWidth: '543px' }}>
                          {/* Title - 3 lines */}
                          {(heroData.titlePrefix || heroData.titleSuffix) && (
                            <h1
                              className="text-white mb-6"
                              style={{
                                width: '543px',
                                maxWidth: '100%',
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: '56px',
                                lineHeight: 'normal',
                                fontFeatureSettings: "'liga' off, 'clig' off"
                              }}
                            >
                              <span className="font-bold">{heroData.titlePrefix} </span>
                              <span className="font-normal">{heroData.titleSuffix}</span>
                            </h1>
                          )}

                          {/* Description */}
                          {heroData.description && (
                            <p
                              className="mb-10"
                              style={{
                                width: '486px',
                                maxWidth: '100%',
                                color: '#FFF',
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: '16px',
                                fontWeight: 400,
                                lineHeight: '26px'
                              }}
                            >
                              {heroData.description}
                            </p>
                          )}

                          {/* Stats Row */}
                          {heroData.stats.length > 0 && (
                            <div className="grid grid-cols-3 gap-8 mb-12 border-t border-white/10 pt-8">
                              {heroData.stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                  <div
                                    className="mb-2"
                                    style={{
                                      color: '#FFF',
                                      textAlign: 'center',
                                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                                      fontSize: '26px',
                                      fontStyle: 'normal',
                                      fontWeight: 700,
                                      lineHeight: '38px',
                                      fontFeatureSettings: "'liga' off, 'clig' off"
                                    }}
                                  >
                                    {stat.value}
                                  </div>
                                  <div
                                    style={{
                                      color: '#FFF',
                                      textAlign: 'center',
                                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                                      fontSize: '14px',
                                      fontStyle: 'normal',
                                      fontWeight: 400,
                                      lineHeight: '35px'
                                    }}
                                  >
                                    {stat.label === "Cơ quan Nhà nước & doanh nghiệp"
                                      ? "Cơ quan Nhà nước & DN"
                                      : stat.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* CTA Button */}
                          {heroData.buttonText && (
                            <a
                              href={heroData.buttonLink || '#'}
                              className="inline-flex items-center gap-3 transition-all hover:scale-105"
                              style={{
                                display: 'inline-flex',
                                height: '56px',
                                padding: '7px 30px',
                                alignItems: 'center',
                                gap: '12px',
                                borderRadius: '12px',
                                border: '1px solid #FFF',
                                background: 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
                                color: '#FFF',
                                fontWeight: 700,
                              }}
                            >
                              {heroData.buttonText}
                              <ArrowRight size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Tab: Process */}
        <TabsContent value="process" className="space-y-0">
          <Tabs defaultValue="config" className="w-full">
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Lộ trình đồng hành</h2>
                  <p className="text-gray-600 mt-1">Cấu hình header và các bước trong process section</p>
                </div>
                <Button onClick={handleSaveProcess} disabled={loadingProcess}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingProcess ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Process Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Header</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="pb-2">Subtitle</Label>
                    <Input
                      value={processData.header?.subtitle || ""}
                      onChange={(e) =>
                        setProcessData({
                          ...processData,
                          header: {
                            ...(processData.header || {
                              subtitle: "",
                              titlePart1: "",
                              titleHighlight: "",
                              titlePart2: "",
                              isActive: true,
                            }),
                            subtitle: e.target.value,
                          },
                        })
                      }
                      placeholder="LỘ TRÌNH ĐỒNG HÀNH CÙNG SFB"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="pb-2">Tiêu đề Part 1</Label>
                      <Input
                        value={processData.header?.titlePart1 || ""}
                        onChange={(e) =>
                          setProcessData({
                            ...processData,
                            header: {
                              ...(processData.header || {
                                subtitle: "",
                                titlePart1: "",
                                titleHighlight: "",
                                titlePart2: "",
                                isActive: true,
                              }),
                              titlePart1: e.target.value,
                            },
                          })
                        }
                        placeholder="Vì sao SFB phù hợp cho"
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Tiêu đề Highlight</Label>
                      <Input
                        value={processData.header?.titleHighlight || ""}
                        onChange={(e) =>
                          setProcessData({
                            ...processData,
                            header: {
                              ...(processData.header || {
                                subtitle: "",
                                titlePart1: "",
                                titleHighlight: "",
                                titlePart2: "",
                                isActive: true,
                              }),
                              titleHighlight: e.target.value,
                            },
                          })
                        }
                        placeholder="nhiều"
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Tiêu đề Part 2</Label>
                      <Input
                        value={processData.header?.titlePart2 || ""}
                        onChange={(e) =>
                          setProcessData({
                            ...processData,
                            header: {
                              ...(processData.header || {
                                subtitle: "",
                                titlePart1: "",
                                titleHighlight: "",
                                titlePart2: "",
                                isActive: true,
                              }),
                              titlePart2: e.target.value,
                            },
                          })
                        }
                        placeholder="lĩnh vực khác nhau"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="pb-2">Kích hoạt</Label>
                    <Switch
                      checked={processData.header?.isActive ?? true}
                      onCheckedChange={(checked) =>
                        setProcessData({
                          ...processData,
                          header: {
                            ...(processData.header || {
                              subtitle: "",
                              titlePart1: "",
                              titleHighlight: "",
                              titlePart2: "",
                              isActive: true,
                            }),
                            isActive: checked,
                          },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Process Steps */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Process Steps ({processData.steps.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleAddStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Step
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {processData.steps.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có step nào. Nhấn "Thêm Step" để thêm.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {processData.steps.map((step, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {renderIcon(step.iconName)}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">
                                      Step {step.stepId}: {step.title || "Chưa có tiêu đề"}
                                    </h4>
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                      {step.description || "Chưa có mô tả"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleMoveStepUp(index)}
                                  disabled={index === 0}
                                  title="Di chuyển lên"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleMoveStepDown(index)}
                                  disabled={index === processData.steps.length - 1}
                                  title="Di chuyển xuống"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditStep(index)}
                                  title="Chỉnh sửa"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Chỉnh sửa
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveStep(index)}
                                  title="Xóa"
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
              </Card>

              {/* Dialog Step Form */}
              <Dialog open={editingStepIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancelStep();
                }
              }}>
                <DialogContent style={{ maxWidth: "50rem" }} className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingStepIndex === -1 ? "Thêm Step mới" : `Chỉnh sửa Step ${stepFormData?.stepId}`}
                    </DialogTitle>
                    <DialogDescription>
                      {editingStepIndex === -1
                        ? "Điền thông tin để tạo step mới"
                        : "Cập nhật thông tin step"}
                    </DialogDescription>
                  </DialogHeader>
                  {stepFormData && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="pb-2">Step ID</Label>
                          <Input
                            value={stepFormData.stepId || ""}
                            onChange={(e) => handleStepFormChange("stepId", e.target.value)}
                            placeholder="01"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Icon Tên</Label>
                          <Select
                            value={stepFormData.iconName || "Target"}
                            onValueChange={(value) => handleStepFormChange("iconName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Tiêu đề</Label>
                          <Input
                            value={stepFormData.title || ""}
                            onChange={(e) => handleStepFormChange("title", e.target.value)}
                            placeholder="Hiểu rõ đặc thù từng ngành"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Mô tả</Label>
                          <Textarea
                            value={stepFormData.description || ""}
                            onChange={(e) => handleStepFormChange("description", e.target.value)}
                            placeholder="Mô tả..."
                            rows={3}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Ảnh</Label>
                          <ImageUpload
                            currentImage={stepFormData.image || ""}
                            onImageSelect={(url) => handleStepFormChange("image", url)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Points</Label>
                          <div className="space-y-2">
                            {(stepFormData.points || []).map((point: string, pointIndex: number) => (
                              <div key={pointIndex} className="flex gap-2">
                                <Input
                                  value={point}
                                  onChange={(e) => handleStepPointChange(pointIndex, e.target.value)}
                                  placeholder={`Điểm ${pointIndex + 1}...`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveStepPoint(pointIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddStepPoint}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm điểm
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="pb-2">Colors - Gradient</Label>
                          <Input
                            value={stepFormData.colors?.gradient || ""}
                            onChange={(e) => handleStepFormChange("colors.gradient", e.target.value)}
                            placeholder="from-blue-500 to-cyan-500"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Colors - Strip</Label>
                          <Input
                            value={stepFormData.colors?.strip || ""}
                            onChange={(e) => handleStepFormChange("colors.strip", e.target.value)}
                            placeholder="from-blue-500 via-cyan-500 to-sky-400"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Colors - Border</Label>
                          <Input
                            value={stepFormData.colors?.border || ""}
                            onChange={(e) => handleStepFormChange("colors.border", e.target.value)}
                            placeholder="border-blue-100"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Colors - Shadow Base</Label>
                          <Input
                            value={stepFormData.colors?.shadowBase || ""}
                            onChange={(e) => handleStepFormChange("colors.shadowBase", e.target.value)}
                            placeholder="rgba(15,23,42,0.06)"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Colors - Shadow Hover</Label>
                          <Input
                            value={stepFormData.colors?.shadowHover || ""}
                            onChange={(e) => handleStepFormChange("colors.shadowHover", e.target.value)}
                            placeholder="rgba(37,99,235,0.18)"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Colors - Check</Label>
                          <Input
                            value={stepFormData.colors?.check || ""}
                            onChange={(e) => handleStepFormChange("colors.check", e.target.value)}
                            placeholder="text-blue-600"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Button - Text</Label>
                          <Input
                            value={stepFormData.button?.text || ""}
                            onChange={(e) => handleStepFormChange("button.text", e.target.value)}
                            placeholder="Liên hệ với chúng tôi"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Button - Link</Label>
                          <Input
                            value={stepFormData.button?.link || ""}
                            onChange={(e) => handleStepFormChange("button.link", e.target.value)}
                            placeholder="/contact"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Button - Icon Name</Label>
                          <Select
                            value={stepFormData.button?.iconName || "ArrowRight"}
                            onValueChange={(value) => handleStepFormChange("button.iconName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="pb-2">Button - Icon Size</Label>
                          <Input
                            type="number"
                            value={stepFormData.button?.iconSize || 18}
                            onChange={(e) =>
                              handleStepFormChange("button.iconSize", parseInt(e.target.value) || 18)
                            }
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Sort Order</Label>
                          <Input
                            type="number"
                            value={stepFormData.sortOrder || 0}
                            onChange={(e) =>
                              handleStepFormChange("sortOrder", parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={stepFormData.isActive !== undefined ? stepFormData.isActive : true}
                            onChange={(e) => handleStepFormChange("isActive", e.target.checked)}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Hiển thị</label>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelStep}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveStep}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Lộ trình đồng hành</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-[90px] bg-[linear-gradient(203deg,#F1F9FD_26.63%,#FFF_87.3%)] relative overflow-hidden rounded-lg">
                    <div className="relative z-10 w-full px-6 lg:px-[290px]">
                      {/* Header */}
                      {processData.header && (
                        <div className="text-center mb-[46px] max-w-3xl mx-auto">
                          {processData.header.subtitle && (
                            <div className="inline-block mb-4">
                              <span
                                className="text-center font-['Plus_Jakarta_Sans'] text-[15px] font-medium uppercase"
                                style={{
                                  color: "var(--Color, #1D8FCF)",
                                  fontFeatureSettings: "'liga' off, 'clig' off",
                                  lineHeight: "normal",
                                }}
                              >
                                {processData.header.subtitle}
                              </span>
                            </div>
                          )}
                          {(processData.header.titlePart1 || processData.header.titleHighlight || processData.header.titlePart2) && (
                            <h2
                              className="mb-6 text-center font-['Plus_Jakarta_Sans'] text-[56px] font-normal"
                              style={{
                                color: "var(--Color-2, #0F172A)",
                                fontFeatureSettings: "'liga' off, 'clig' off",
                                lineHeight: "normal",
                              }}
                            >
                              {processData.header.titlePart1}{" "}
                              <span
                                className="font-bold"
                                style={{
                                  color: "var(--Color-2, #0F172A)",
                                  fontFeatureSettings: "'liga' off, 'clig' off",
                                  lineHeight: "normal",
                                }}
                              >
                                {processData.header.titleHighlight}
                                <br />
                                {processData.header.titlePart2}
                              </span>
                            </h2>
                          )}
                        </div>
                      )}

                      {/* Steps */}
                      {processData.steps.length > 0 && (
                        <div className="mx-auto flex w-full max-w-[1340px] flex-col items-start gap-[90px]">
                          {processData.steps.filter(s => s.isActive).map((step, index) => {
                            const isEven = index % 2 !== 0;
                            const ButtonIcon = (LucideIcons as any)[step.button.iconName] || ArrowRight;
                            const StepIcon = (LucideIcons as any)[step.iconName] || Target;
                            const isFirstStep = index === 0;
                            const isSecondStep = index === 1;

                            return (
                              <div
                                key={step.stepId || index}
                                className={`w-full`}
                              >
                                <div
                                  className={`flex flex-row flex-nowrap items-start gap-12 lg:gap-20 overflow-hidden ${isEven ? 'flex-row-reverse' : ''
                                    }  'w-full'`}
                                >
                                  {/* Image Column */}
                                  {step.image && (
                                    <div className={`flex-shrink-0 ${isFirstStep ? 'w-1/2' : isSecondStep ? 'w-[45%]' : 'w-1/2'}`}>
                                      <div className="relative group">
                                        <div className="absolute inset-0 bg-blue-500/5 rounded-2xl transform rotate-3 scale-105 transition-transform group-hover:rotate-6 duration-500" />
                                        <div className="relative rounded-2xl overflow-hidden bg-white p-3 shadow-xl border border-gray-100">
                                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                                            <img
                                              src={step.image}
                                              alt={step.title}
                                              className="w-full h-full object-cover transform group-hover:scale-105 transition-duration-700"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Content Column */}
                                  <div className={`flex-shrink-0 flex-1 min-w-0 ${isFirstStep ? 'w-1/2' : isSecondStep ? 'w-[55%]' : 'w-1/2'}`}>
                                    {step.title && (
                                      <h3
                                        className="text-3xl font-bold text-gray-900 mb-6"
                                        style={{
                                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                                        }}
                                      >
                                        {step.title}
                                      </h3>
                                    )}
                                    {step.description && (
                                      <p
                                        className="text-gray-600 text-base leading-relaxed mb-8"
                                        style={{
                                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                                          lineHeight: '1.75',
                                        }}
                                      >
                                        {step.description}
                                      </p>
                                    )}

                                    {step.points.length > 0 && (
                                      <ul className="space-y-4 mb-10">
                                        {step.points.map((point, idx) => (
                                          <li key={idx} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                              <div
                                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                                style={{
                                                  background: step.colors?.check?.includes('blue')
                                                    ? '#008CCB'
                                                    : step.colors?.check || '#008CCB',
                                                }}
                                              >
                                                <CheckCircle2 size={14} className="text-white" />
                                              </div>
                                            </div>
                                            <span
                                              className="text-gray-700 font-medium"
                                              style={{
                                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                              }}
                                            >
                                              {point}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}

                                    {/* Button */}
                                    {step.button.text && (
                                      <div>
                                        <a
                                          href={step.button.link || '#'}
                                          className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
                                          style={{
                                            background: 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
                                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                                          }}
                                        >
                                          {step.button.text === "Liên hệ với chúng tôi" ? (
                                            <>
                                              {step.button.text}
                                              <ButtonIcon size={step.button.iconSize || 18} />
                                            </>
                                          ) : (
                                            <>
                                              <ButtonIcon size={step.button.iconSize || 18} />
                                              {step.button.text}
                                            </>
                                          )}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {processData.steps.filter(s => s.isActive).length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          Chưa có step nào đang hiển thị
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
