"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Edit, Trash2, ChevronUp, ChevronDown, ArrowRight, Briefcase, MapPin, DollarSign, Clock, Award, CheckCircle2, Target, Phone, Languages, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import ImageUpload from "@/components/admin/ImageUpload";
import * as LucideIcons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "@/styles/admin-about-hero.css";
// Icon options
const ICON_OPTIONS = [
  "DollarSign",
  "TrendingUp",
  "Coffee",
  "Heart",
  "Rocket",
  "Award",
  "Briefcase",
  "MapPin",
  "Clock",
  "Code2",
  "MonitorSmartphone",
  "Network",
  "Globe2",
  "ShieldCheck",
  "Users",
  "Target",
  "Sparkles",
  "Phone",
  "Package",
  "Settings",
  "Database",
  "Cloud",
  "Server",
  "Cpu",
  "HardDrive",
  "Building2",
  "Mail",
  "Lightbulb",
  "Handshake",
  "Eye",
];

const GRADIENT_OPTIONS = [
  { value: "from-emerald-500 to-teal-500", label: "Xanh lá - Teal" },
  { value: "from-[#006FB3] to-[#0088D9]", label: "Xanh dương SFB" },
  { value: "from-orange-500 to-amber-500", label: "Cam - Vàng" },
  { value: "from-rose-500 to-pink-500", label: "Rose - Pink" },
  { value: "from-purple-500 to-pink-500", label: "Tím - Hồng" },
  { value: "from-indigo-500 to-purple-500", label: "Indigo - Purple" },
  { value: "from-blue-500 to-cyan-500", label: "Xanh dương - Cyan" },
  { value: "from-green-500 to-emerald-500", label: "Green - Emerald" },
];

const HERO_GRADIENT_OPTIONS = [
  { value: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)", label: "Xanh dương SFB" },
  { value: "linear-gradient(to bottom right, #8B5CF6, #EC4899)", label: "Tím - Hồng" },
  { value: "linear-gradient(to bottom right, #10B981, #14B8A6)", label: "Xanh lá - Teal" },
  { value: "linear-gradient(to bottom right, #F59E0B, #FBBF24)", label: "Cam - Vàng" },
];

export default function AdminCareersPage() {
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

  // Tab State - Main tab
  const [activeMainTab, setActiveMainTab] = useState<string>('hero');
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careers-main-tab');
      if (saved) {
        setActiveMainTab(saved);
      }
    }
  }, []);

  // Tab State - Sub tabs (config/preview) for each section
  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>({
    hero: 'config',
    benefits: 'config',
    positions: 'config',
    cta: 'config',
  });

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careers-sub-tabs');
      if (saved) {
        try {
          setActiveSubTabs(JSON.parse(saved));
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  // Save main tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('careers-main-tab', activeMainTab);
    }
  }, [activeMainTab]);

  // Save sub tabs to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('careers-sub-tabs', JSON.stringify(activeSubTabs));
    }
  }, [activeSubTabs]);

  // Collapse state for config blocks (default: all hidden)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({
    heroMainInfo: true,
    benefitsList: true,
    positionsHeader: true,
    positionsItems: true,
    ctaConfig: true,
  });

  const toggleBlock = (blockKey: string) => {
    setCollapsedBlocks(prev => ({
      ...prev,
      [blockKey]: !prev[blockKey]
    }));
  };

  // Tab configuration with descriptions
  const tabsConfig = [
    {
      value: "hero",
      label: "Hero",
      description: "Banner đầu trang với tiêu đề..",
      icon: Target,
    },
    {
      value: "benefits",
      label: "Phúc lợi & Đãi ngộ",
      description: "Quản lý các phúc lợi..",
      icon: Award,
    },
    {
      value: "positions",
      label: "Vị trí đang tuyển",
      description: "Quản lý các vị trí..",
      icon: Briefcase,
    },
    {
      value: "cta",
      label: "CTA",
      description: "Phần kêu gọi hành động..",
      icon: Phone,
    },
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveMainTab(value);
  };

  // Hero State
  const [heroData, setHeroData] = useState<{
    titleLine1: string | Record<Locale, string>;
    titleLine2: string | Record<Locale, string>;
    description: string | Record<Locale, string>;
    buttonText: string | Record<Locale, string>;
    buttonLink: string;
    image: string;
    backgroundGradient: string;
    isActive: boolean;
  }>({
    titleLine1: "",
    titleLine2: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: "",
    backgroundGradient: HERO_GRADIENT_OPTIONS[0].value,
    isActive: true,
  });
  const [loadingHero, setLoadingHero] = useState(false);

  // Benefits State
  const [benefitsData, setBenefitsData] = useState<{
    headerTitle: string | Record<Locale, string>;
    headerDescription: string | Record<Locale, string>;
    items: Array<{
      id?: number;
      iconName: string;
      title: string | Record<Locale, string>;
      description: string | Record<Locale, string>;
      gradient: string;
      sortOrder: number;
      isActive: boolean;
    }>;
    isActive: boolean;
  }>({
    headerTitle: "",
    headerDescription: "",
    items: [],
    isActive: true,
  });
  const [loadingBenefits, setLoadingBenefits] = useState(false);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState<number | null>(null);
  const [benefitFormData, setBenefitFormData] = useState<any>(null);

  // Positions State
  const [positionsData, setPositionsData] = useState<{
    headerTitle: string | Record<Locale, string>;
    headerDescription: string | Record<Locale, string>;
    items: Array<{
      id?: number;
      title: string | Record<Locale, string>;
      department: string | Record<Locale, string>;
      type: string;
      location: string | Record<Locale, string>;
      salary: string | Record<Locale, string>;
      experience: string | Record<Locale, string>;
      description: string | Record<Locale, string>;
      skills: string[];
      gradient: string;
      sortOrder: number;
      isActive: boolean;
    }>;
    isActive: boolean;
  }>({
    headerTitle: "",
    headerDescription: "",
    items: [],
    isActive: true,
  });
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [editingPositionIndex, setEditingPositionIndex] = useState<number | null>(null);
  const [positionFormData, setPositionFormData] = useState<any>(null);

  // CTA State
  const [ctaData, setCtaData] = useState<{
    title: string | Record<Locale, string>;
    description: string | Record<Locale, string>;
    primaryButtonText: string | Record<Locale, string>;
    primaryButtonLink: string;
    secondaryButtonText: string | Record<Locale, string>;
    secondaryButtonLink: string;
    backgroundGradient: string;
    isActive: boolean;
  }>({
    title: "",
    description: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    backgroundGradient: HERO_GRADIENT_OPTIONS[0].value,
    isActive: true,
  });
  const [loadingCTA, setLoadingCTA] = useState(false);

  // Fetch functions
  const fetchHero = async () => {
    try {
      setLoadingHero(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.careers.hero.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedHero = migrateObjectToLocale(data.data);
        // Đảm bảo backgroundGradient là string, không phải locale object
        if (normalizedHero.backgroundGradient && typeof normalizedHero.backgroundGradient === 'object' && !Array.isArray(normalizedHero.backgroundGradient)) {
          if ('vi' in normalizedHero.backgroundGradient || 'en' in normalizedHero.backgroundGradient || 'ja' in normalizedHero.backgroundGradient) {
            normalizedHero.backgroundGradient = (normalizedHero.backgroundGradient as any).vi || (normalizedHero.backgroundGradient as any).en || HERO_GRADIENT_OPTIONS[0].value;
          }
        }
        setHeroData(normalizedHero);
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
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.careers.benefits.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedBenefits = migrateObjectToLocale(data.data);
        // Normalize items
        if (normalizedBenefits.items && Array.isArray(normalizedBenefits.items)) {
          normalizedBenefits.items = normalizedBenefits.items.map((item: any) => migrateObjectToLocale(item));
        }
        setBenefitsData(normalizedBenefits);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải benefits");
    } finally {
      setLoadingBenefits(false);
    }
  };

  const fetchPositions = async () => {
    try {
      setLoadingPositions(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.careers.positions.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedPositions = migrateObjectToLocale(data.data);
        // Normalize items
        if (normalizedPositions.items && Array.isArray(normalizedPositions.items)) {
          const getStringValue = (value: any): string => {
            if (typeof value === 'string') return value;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              if ('vi' in value || 'en' in value || 'ja' in value) {
                return (value as any).vi || (value as any).en || (value as any).ja || '';
              }
            }
            return '';
          };
          normalizedPositions.items = normalizedPositions.items.map((item: any) => {
            const normalizedItem = migrateObjectToLocale(item);
            // Đảm bảo type, gradient là string, không phải locale object
            return {
              ...normalizedItem,
              type: getStringValue(item.type || normalizedItem.type || 'Full-time'),
              gradient: getStringValue(item.gradient || normalizedItem.gradient || GRADIENT_OPTIONS[0].value),
              skills: Array.isArray(item.skills) ? item.skills : [],
              sortOrder: item.sortOrder ?? normalizedItem.sortOrder ?? 0,
              isActive: item.isActive ?? normalizedItem.isActive ?? true
            };
          });
        }
        setPositionsData(normalizedPositions);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải positions");
    } finally {
      setLoadingPositions(false);
    }
  };

  const fetchCTA = async () => {
    try {
      setLoadingCTA(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.careers.cta.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedCta = migrateObjectToLocale(data.data);
        // Xử lý các field link: nếu là locale object, lấy giá trị vi
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
        // Đảm bảo backgroundGradient là string, không phải locale object
        if (normalizedCta.backgroundGradient && typeof normalizedCta.backgroundGradient === 'object' && !Array.isArray(normalizedCta.backgroundGradient)) {
          if ('vi' in normalizedCta.backgroundGradient || 'en' in normalizedCta.backgroundGradient || 'ja' in normalizedCta.backgroundGradient) {
            normalizedCta.backgroundGradient = (normalizedCta.backgroundGradient as any).vi || (normalizedCta.backgroundGradient as any).en || HERO_GRADIENT_OPTIONS[0].value;
          }
        }
        setCtaData(normalizedCta);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải CTA");
    } finally {
      setLoadingCTA(false);
    }
  };

  useEffect(() => {
    void fetchHero();
    void fetchBenefits();
    void fetchPositions();
    void fetchCTA();
  }, []);

  // Save functions
  const handleSaveHero = async () => {
    try {
      setLoadingHero(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.careers.hero.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        titleLine1: heroData.titleLine1 !== '' ? heroData.titleLine1 : (existingData.titleLine1 || ''),
        titleLine2: heroData.titleLine2 !== '' ? heroData.titleLine2 : (existingData.titleLine2 || ''),
        description: heroData.description !== '' ? heroData.description : (existingData.description || ''),
        buttonText: heroData.buttonText !== '' ? heroData.buttonText : (existingData.buttonText || ''),
        buttonLink: heroData.buttonLink !== '' ? heroData.buttonLink : (existingData.buttonLink || ''),
        image: heroData.image !== '' ? heroData.image : (existingData.image || ''),
        backgroundGradient: heroData.backgroundGradient !== '' ? heroData.backgroundGradient : (existingData.backgroundGradient || ''),
        isActive: heroData.isActive,
      };

      await adminApiCall(AdminEndpoints.careers.hero.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu hero");
      void fetchHero();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu hero");
    } finally {
      setLoadingHero(false);
    }
  };

  const handleSaveBenefits = async () => {
    try {
      setLoadingBenefits(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.careers.benefits.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        headerTitle: benefitsData.headerTitle !== '' ? benefitsData.headerTitle : (existingData.headerTitle || ''),
        headerDescription: benefitsData.headerDescription !== '' ? benefitsData.headerDescription : (existingData.headerDescription || ''),
        items: benefitsData.items,
        isActive: benefitsData.isActive,
      };

      await adminApiCall(AdminEndpoints.careers.benefits.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu benefits");
      void fetchBenefits();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu benefits");
    } finally {
      setLoadingBenefits(false);
    }
  };

  const handleSavePositions = async () => {
    try {
      setLoadingPositions(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.careers.positions.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        headerTitle: positionsData.headerTitle !== '' ? positionsData.headerTitle : (existingData.headerTitle || ''),
        headerDescription: positionsData.headerDescription !== '' ? positionsData.headerDescription : (existingData.headerDescription || ''),
        items: positionsData.items,
        isActive: positionsData.isActive,
      };

      await adminApiCall(AdminEndpoints.careers.positions.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu positions");
      void fetchPositions();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu positions");
    } finally {
      setLoadingPositions(false);
    }
  };

  const handleSaveCTA = async () => {
    try {
      setLoadingCTA(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.careers.cta.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        title: ctaData.title !== '' ? ctaData.title : (existingData.title || ''),
        description: ctaData.description !== '' ? ctaData.description : (existingData.description || ''),
        primaryButtonText: ctaData.primaryButtonText !== '' ? ctaData.primaryButtonText : (existingData.primaryButtonText || ''),
        primaryButtonLink: ctaData.primaryButtonLink !== '' ? ctaData.primaryButtonLink : (existingData.primaryButtonLink || ''),
        secondaryButtonText: ctaData.secondaryButtonText !== '' ? ctaData.secondaryButtonText : (existingData.secondaryButtonText || ''),
        secondaryButtonLink: ctaData.secondaryButtonLink !== '' ? ctaData.secondaryButtonLink : (existingData.secondaryButtonLink || ''),
        backgroundGradient: ctaData.backgroundGradient !== '' ? ctaData.backgroundGradient : (existingData.backgroundGradient || ''),
        isActive: ctaData.isActive,
      };

      await adminApiCall(AdminEndpoints.careers.cta.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu CTA");
      void fetchCTA();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu CTA");
    } finally {
      setLoadingCTA(false);
    }
  };

  // Translation handlers for sections
  const handleTranslateSection = async (section: 'hero' | 'benefits' | 'positions' | 'cta') => {
    let dataToTranslate: any;
    let updateCallback: (translatedData: any) => void;
    let sectionName: string;

    // Prepare data and update callback based on section
    if (section === 'hero') {
      // Loại bỏ các trường không cần dịch: image, buttonLink, backgroundGradient
      const { image, buttonLink, backgroundGradient, isActive, ...dataToTranslateFields } = heroData;
      dataToTranslate = dataToTranslateFields;
      updateCallback = (translated: any) => {
        setHeroData({
          ...translated,
          image,
          buttonLink,
          backgroundGradient,
          isActive
        });
      };
      sectionName = 'Hero Banner';
    } else if (section === 'benefits') {
      // Loại bỏ các trường không cần dịch: isActive, và iconName, gradient trong items
      const { isActive, items, ...headerData } = benefitsData;
      const translatedItems = items.map((item: any) => {
        const { iconName, gradient, sortOrder, isActive: itemActive, ...itemFields } = item;
        return itemFields;
      });
      dataToTranslate = {
        ...headerData,
        items: translatedItems
      };
      updateCallback = (translated: any) => {
        // Giữ nguyên iconName, gradient, sortOrder, isActive của items
        const updatedItems = translated.items.map((item: any, index: number) => ({
          ...item,
          iconName: items[index]?.iconName || 'DollarSign',
          gradient: items[index]?.gradient || GRADIENT_OPTIONS[0].value,
          sortOrder: items[index]?.sortOrder ?? index,
          isActive: items[index]?.isActive ?? true
        }));
        setBenefitsData({
          ...translated,
          items: updatedItems,
          isActive
        });
      };
      sectionName = 'Phúc lợi & Đãi ngộ';
    } else if (section === 'positions') {
      // Loại bỏ các trường không cần dịch: isActive, type, gradient, skills trong items
      const { isActive, items, ...headerData } = positionsData;
      const translatedItems = items.map((item: any) => {
        const { type, gradient, skills, sortOrder, isActive: itemActive, ...itemFields } = item;
        return itemFields;
      });
      dataToTranslate = {
        ...headerData,
        items: translatedItems
      };
      updateCallback = (translated: any) => {
        // Giữ nguyên type, gradient, skills, sortOrder, isActive của items
        const updatedItems = translated.items.map((item: any, index: number) => ({
          ...item,
          type: items[index]?.type || 'Full-time',
          gradient: items[index]?.gradient || GRADIENT_OPTIONS[0].value,
          skills: items[index]?.skills || [],
          sortOrder: items[index]?.sortOrder ?? index,
          isActive: items[index]?.isActive ?? true
        }));
        setPositionsData({
          ...translated,
          items: updatedItems,
          isActive
        });
      };
      sectionName = 'Vị trí đang tuyển';
    } else if (section === 'cta') {
      // Loại bỏ các trường không cần dịch: primaryButtonLink, secondaryButtonLink, backgroundGradient, isActive
      const { primaryButtonLink, secondaryButtonLink, backgroundGradient, isActive, ...dataWithoutLinks } = ctaData;
      dataToTranslate = dataWithoutLinks;
      updateCallback = (translated: any) => {
        // Giữ nguyên các giá trị link, gradient, isActive khi cập nhật dữ liệu đã dịch
        setCtaData({
          ...translated,
          primaryButtonLink,
          secondaryButtonLink,
          backgroundGradient,
          isActive
        });
      };
      sectionName = 'CTA';
    } else {
      return;
    }

    // Use translateData from hook
    await translateData(dataToTranslate, updateCallback, sectionName);
  };

  // Render icon
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code2;
    return <IconComponent className="w-6 h-6" />;
  };

  // Benefits Handlers
  const handleAddBenefit = () => {
    setBenefitFormData({
      iconName: "DollarSign",
      title: { vi: '', en: '', ja: '' },
      description: { vi: '', en: '', ja: '' },
      gradient: GRADIENT_OPTIONS[0].value,
      sortOrder: benefitsData.items.length,
      isActive: true,
    });
    setEditingBenefitIndex(-1);
  };

  const handleEditBenefit = (index: number) => {
    setBenefitFormData({ ...benefitsData.items[index] });
    setEditingBenefitIndex(index);
  };

  const handleCancelBenefit = () => {
    setEditingBenefitIndex(null);
    setBenefitFormData(null);
  };

  const handleSaveBenefit = () => {
    if (editingBenefitIndex === -1) {
      setBenefitsData({
        ...benefitsData,
        items: [...benefitsData.items, { ...benefitFormData, sortOrder: benefitsData.items.length }],
      });
      toast.success("Đã thêm benefit");
    } else if (editingBenefitIndex !== null) {
      const newItems = [...benefitsData.items];
      newItems[editingBenefitIndex] = benefitFormData;
      setBenefitsData({ ...benefitsData, items: newItems });
      toast.success("Đã cập nhật benefit");
    }
    handleCancelBenefit();
  };

  const handleRemoveBenefit = (index: number) => {
    const newItems = [...benefitsData.items];
    newItems.splice(index, 1);
    setBenefitsData({ ...benefitsData, items: newItems });
    toast.success("Đã xóa benefit");
  };

  const handleMoveBenefitUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...benefitsData.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setBenefitsData({ ...benefitsData, items: newItems });
  };

  const handleMoveBenefitDown = (index: number) => {
    if (index === benefitsData.items.length - 1) return;
    const newItems = [...benefitsData.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setBenefitsData({ ...benefitsData, items: newItems });
  };

  // Positions Handlers
  const handleAddPosition = () => {
    setPositionFormData({
      title: { vi: '', en: '', ja: '' },
      department: { vi: '', en: '', ja: '' },
      type: "Full-time",
      location: { vi: '', en: '', ja: '' },
      salary: { vi: '', en: '', ja: '' },
      experience: { vi: '', en: '', ja: '' },
      description: { vi: '', en: '', ja: '' },
      skills: [] as string[],
      gradient: GRADIENT_OPTIONS[0].value,
      sortOrder: positionsData.items.length,
      isActive: true,
    });
    setEditingPositionIndex(-1);
  };

  const handleEditPosition = (index: number) => {
    setPositionFormData({ ...positionsData.items[index] });
    setEditingPositionIndex(index);
  };

  const handleCancelPosition = () => {
    setEditingPositionIndex(null);
    setPositionFormData(null);
  };

  const handleSavePosition = () => {
    if (editingPositionIndex === -1) {
      setPositionsData({
        ...positionsData,
        items: [...positionsData.items, { ...positionFormData, sortOrder: positionsData.items.length }],
      });
      toast.success("Đã thêm position");
    } else if (editingPositionIndex !== null) {
      const newItems = [...positionsData.items];
      newItems[editingPositionIndex] = positionFormData;
      setPositionsData({ ...positionsData, items: newItems });
      toast.success("Đã cập nhật position");
    }
    handleCancelPosition();
  };

  const handleRemovePosition = (index: number) => {
    const newItems = [...positionsData.items];
    newItems.splice(index, 1);
    setPositionsData({ ...positionsData, items: newItems });
    toast.success("Đã xóa position");
  };

  const handleMovePositionUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...positionsData.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setPositionsData({ ...positionsData, items: newItems });
  };

  const handleMovePositionDown = (index: number) => {
    if (index === positionsData.items.length - 1) return;
    const newItems = [...positionsData.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setPositionsData({ ...positionsData, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý trang Tuyển dụng</h1>
          <p className="text-gray-600 mt-1">Quản lý đầy đủ các phần của trang Tuyển dụng</p>
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
              // Only calculate isCompleted after mount to avoid hydration mismatch
              const isActive = isMounted && activeMainTab === tab.value;
              const isCompleted = isMounted && tabsConfig.findIndex(t => t.value === activeMainTab) > index;

              return (
                <div key={tab.value} className="flex items-center flex-1" suppressHydrationWarning>
                  <button
                    onClick={() => handleTabChange(tab.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                      ? "bg-blue-50 text-blue-700 border-2 border-blue-500"
                      : isCompleted
                        ? "bg-green-50 text-green-700 border-2 border-green-300"
                        : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
                      }`}
                    suppressHydrationWarning
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive
                      ? "bg-blue-500 text-white"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                      }`} suppressHydrationWarning>
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
                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`} suppressHydrationWarning />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeMainTab} onValueChange={handleTabChange} className="w-full">

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-0">
          <Tabs
            value={activeSubTabs.hero}
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

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Phần Hero</h2>
                  <p className="text-gray-600 mt-1">Cấu hình phần hero cho trang Tuyển dụng</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Tiêu đề dòng 1 *"
                        value={getLocaleValue(heroData, 'titleLine1')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'titleLine1', value);
                          setHeroData(updated);
                        }}
                        placeholder="Cùng xây dựng"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Tiêu đề dòng 2 *"
                        value={getLocaleValue(heroData, 'titleLine2')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'titleLine2', value);
                          setHeroData(updated);
                        }}
                        placeholder="tương lai công nghệ"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                  </div>
                  <div>
                    <LocaleInput
                      label="Mô tả"
                      value={getLocaleValue(heroData, 'description')}
                      onChange={(value) => {
                        const updated = setLocaleValue(heroData, 'description', value);
                        setHeroData(updated);
                      }}
                      placeholder="Mô tả..."
                      multiline={true}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Văn bản nút"
                        value={getLocaleValue(heroData, 'buttonText')}
                        onChange={(value) => {
                          const updated = setLocaleValue(heroData, 'buttonText', value);
                          setHeroData(updated);
                        }}
                        placeholder="Xem vị trí tuyển dụng"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Liên kết nút</Label>
                      <Input
                        value={heroData.buttonLink}
                        onChange={(e) => setHeroData({ ...heroData, buttonLink: e.target.value })}
                        placeholder="#positions"
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
                    <Label className="pb-2">Màu nền gradient</Label>
                    <Select
                      value={heroData.backgroundGradient || HERO_GRADIENT_OPTIONS[0].value}
                      onValueChange={(value) => setHeroData({ ...heroData, backgroundGradient: value })}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {HERO_GRADIENT_OPTIONS.find(opt => opt.value === (heroData.backgroundGradient || HERO_GRADIENT_OPTIONS[0].value))?.label || "Chọn màu nền"}
                        </SelectValue>
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
                      onCheckedChange={async (checked) => {
                        // If heroData is empty, fetch existing data first to preserve it
                        if (!heroData.titleLine1 && !heroData.titleLine2 && !heroData.description) {
                          try {
                            const data = await adminApiCall<{ success: boolean; data?: any }>(
                              AdminEndpoints.careers.hero.get,
                            );
                            if (data?.data) {
                              setHeroData({
                                ...data.data,
                                isActive: checked,
                              });
                            } else {
                              setHeroData({ ...heroData, isActive: checked });
                            }
                          } catch (error) {
                            toast.error("Không thể tải hero để cập nhật trạng thái.");
                            setHeroData({ ...heroData, isActive: checked });
                          }
                        } else {
                          setHeroData({ ...heroData, isActive: checked });
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Hero Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{
                      minHeight: '847px',
                      paddingTop: '87px',
                      background: heroData.backgroundGradient || 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
                    }}
                  >
                    <div className="container mx-auto px-6 relative z-10">
                      <div className="about-hero-container">
                        <div className="text-white about-hero-text">
                          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                            {getLocalizedText(heroData.titleLine1, globalLocale)}
                            <span className="block mt-2">
                              {getLocalizedText(heroData.titleLine2, globalLocale)}
                            </span>
                          </h1>
                          {getLocalizedText(heroData.description, globalLocale) && (
                            <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed">
                              {getLocalizedText(heroData.description, globalLocale)}
                            </p>
                          )}
                          {getLocalizedText(heroData.buttonText, globalLocale) && (
                            <a
                              href={heroData.buttonLink || '#'}
                              className="inline-flex items-center gap-3 px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm"
                            >
                              {getLocalizedText(heroData.buttonText, globalLocale)}
                              <ArrowRight size={18} />
                            </a>
                          )}
                        </div>
                        {heroData.image && (
                          <div className="flex justify-center items-center bg-white border-[10px] border-white rounded-[24px] shadow-lg about-hero-image">
                            <img
                              src={heroData.image}
                              alt="Hero"
                              className="w-full h-full object-cover rounded-[14px]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-0">
          <Tabs
            value={activeSubTabs.benefits}
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
                        onClick={() => handleTranslateSection('benefits')}
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

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Phúc lợi & Đãi ngộ</h2>
                  <p className="text-gray-600 mt-1">Cấu hình Phúc lợi & Đãi ngộ</p>
                </div>
                <Button onClick={handleSaveBenefits} disabled={loadingBenefits}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingBenefits ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Tiêu đề</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <LocaleInput
                      label="Tiêu đề"
                      value={getLocaleValue(benefitsData, 'headerTitle')}
                      onChange={(value) => {
                        const updated = setLocaleValue(benefitsData, 'headerTitle', value);
                        setBenefitsData(updated);
                      }}
                      placeholder="Phúc lợi & Đãi ngộ"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Mô tả"
                      value={getLocaleValue(benefitsData, 'headerDescription')}
                      onChange={(value) => {
                        const updated = setLocaleValue(benefitsData, 'headerDescription', value);
                        setBenefitsData(updated);
                      }}
                      placeholder="Mô tả..."
                      multiline={true}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="pb-2">Kích hoạt</Label>
                    <Switch
                      checked={benefitsData.isActive}
                      onCheckedChange={async (checked) => {
                        // If benefitsData is empty, fetch existing data first to preserve it
                        if (!benefitsData.headerTitle && !benefitsData.headerDescription && benefitsData.items.length === 0) {
                          try {
                            const data = await adminApiCall<{ success: boolean; data?: any }>(
                              AdminEndpoints.careers.benefits.get,
                            );
                            if (data?.data) {
                              setBenefitsData({
                                ...data.data,
                                isActive: checked,
                              });
                            } else {
                              setBenefitsData({ ...benefitsData, isActive: checked });
                            }
                          } catch (error) {
                            toast.error("Không thể tải benefits để cập nhật trạng thái.");
                            setBenefitsData({ ...benefitsData, isActive: checked });
                          }
                        } else {
                          setBenefitsData({ ...benefitsData, isActive: checked });
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Benefits Items ({benefitsData.items.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleAddBenefit}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Benefit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefitsData.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có benefit nào. Nhấn "Thêm Benefit" để thêm.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {benefitsData.items
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((item, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      {renderIcon(item.iconName)}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">{getLocalizedText(item.title, globalLocale) || "Chưa có tiêu đề"}</h4>
                                      <p className="text-sm text-gray-600 line-clamp-1">
                                        {getLocalizedText(item.description, globalLocale) || "Chưa có mô tả"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveBenefitUp(index)}
                                    disabled={index === 0}
                                    title="Di chuyển lên"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveBenefitDown(index)}
                                    disabled={index === benefitsData.items.length - 1}
                                    title="Di chuyển xuống"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditBenefit(index)}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveBenefit(index)}
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

              {/* Dialog Benefit Form */}
              <Dialog open={editingBenefitIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancelBenefit();
                }
              }}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBenefitIndex === -1 ? "Thêm Benefit mới" : "Chỉnh sửa Benefit"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingBenefitIndex === -1
                        ? "Điền thông tin để tạo benefit mới"
                        : "Cập nhật thông tin benefit"}
                    </DialogDescription>
                  </DialogHeader>
                  {benefitFormData && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="pb-2">Tên icon</Label>
                          <Select
                            value={benefitFormData.iconName || "DollarSign"}
                            onValueChange={(value) => setBenefitFormData({ ...benefitFormData, iconName: value })}
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
                          <Label className="pb-2">Màu gradient</Label>
                          <Select
                            value={benefitFormData.gradient || GRADIENT_OPTIONS[0].value}
                            onValueChange={(value) => setBenefitFormData({ ...benefitFormData, gradient: value })}
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
                          <LocaleInput
                            label="Tiêu đề"
                            value={getLocaleValue(benefitFormData, 'title')}
                            onChange={(value) => {
                              const updated = setLocaleValue(benefitFormData, 'title', value);
                              setBenefitFormData(updated);
                            }}
                            placeholder="Lương thưởng hấp dẫn"
                            defaultLocale={globalLocale}
                            aiProvider={aiProvider}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <LocaleInput
                            label="Mô tả"
                            value={getLocaleValue(benefitFormData, 'description')}
                            onChange={(value) => {
                              const updated = setLocaleValue(benefitFormData, 'description', value);
                              setBenefitFormData(updated);
                            }}
                            placeholder="Mô tả..."
                            multiline={true}
                            defaultLocale={globalLocale}
                            aiProvider={aiProvider}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={benefitFormData.isActive !== undefined ? benefitFormData.isActive : true}
                            onChange={(e) => setBenefitFormData({ ...benefitFormData, isActive: e.target.checked })}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Hiển thị</label>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelBenefit}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveBenefit}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Phúc lợi & Đãi ngộ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-20 bg-[#F8FBFE] rounded-lg">
                    <div className="max-w-[1340px] mx-auto px-6">
                      {/* Header */}
                      <div className="text-center mb-16">
                        {getLocalizedText(benefitsData.headerTitle, globalLocale) && (
                          <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                            {getLocalizedText(benefitsData.headerTitle, globalLocale)}
                          </h2>
                        )}
                        {getLocalizedText(benefitsData.headerDescription, globalLocale) && (
                          <p className="text-gray-600 md:text-lg max-w-2xl mx-auto leading-relaxed">
                            {getLocalizedText(benefitsData.headerDescription, globalLocale)}
                          </p>
                        )}
                      </div>

                      {/* Grid */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefitsData.items
                          .filter(item => item.isActive)
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((item, idx) => {
                            const Icon = (LucideIcons as any)[item.iconName] || LucideIcons.DollarSign;
                            return (
                              <div
                                key={idx}
                                className="bg-white rounded-[24px] p-8 flex flex-col items-start shadow-[0_18px_36px_0_rgba(0,0,0,0.05)] transition-all duration-300 h-full border border-transparent hover:border-blue-100"
                              >
                                <div className="mb-6 text-[#2CA4E0] p-4 bg-blue-50/50 rounded-2xl">
                                  <Icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[#0F172A] text-xl font-bold mb-3">{getLocalizedText(item.title, globalLocale)}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{getLocalizedText(item.description, globalLocale)}</p>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-0">
          <Tabs
            value={activeSubTabs.positions}
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, positions: value })}
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
                        onClick={() => handleTranslateSection('positions')}
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

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Vị trí đang tuyển</h2>
                  <p className="text-gray-600 mt-1">Cấu hình Vị trí đang tuyển</p>
                </div>
                <Button onClick={handleSavePositions} disabled={loadingPositions}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingPositions ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Header */}
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("positionsHeader")}
                  >
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                      {collapsedBlocks.positionsHeader ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                      Tiêu đề
                    </CardTitle>
                  </div>
                </CardHeader>
                {!collapsedBlocks.positionsHeader && (
                  <CardContent className="space-y-4 px-6 py-4">
                    <div>
                      <LocaleInput
                        label="Tiêu đề"
                        value={getLocaleValue(positionsData, 'headerTitle')}
                        onChange={(value) => {
                          const updated = setLocaleValue(positionsData, 'headerTitle', value);
                          setPositionsData(updated);
                        }}
                        placeholder="Vị trí đang tuyển"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Mô tả"
                        value={getLocaleValue(positionsData, 'headerDescription')}
                        onChange={(value) => {
                          const updated = setLocaleValue(positionsData, 'headerDescription', value);
                          setPositionsData(updated);
                        }}
                        placeholder="Mô tả..."
                        multiline={true}
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="pb-2">Kích hoạt</Label>
                      <Switch
                        checked={positionsData.isActive}
                        onCheckedChange={async (checked) => {
                          // If positionsData is empty, fetch existing data first to preserve it
                          const hasHeaderTitle = positionsData.headerTitle && (
                            typeof positionsData.headerTitle === 'string'
                              ? positionsData.headerTitle.trim() !== ''
                              : Object.values(positionsData.headerTitle as Record<Locale, string>).some(v => v && v.trim() !== '')
                          );
                          const hasHeaderDescription = positionsData.headerDescription && (
                            typeof positionsData.headerDescription === 'string'
                              ? positionsData.headerDescription.trim() !== ''
                              : Object.values(positionsData.headerDescription as Record<Locale, string>).some(v => v && v.trim() !== '')
                          );
                          if (!hasHeaderTitle && !hasHeaderDescription && positionsData.items.length === 0) {
                            try {
                              const data = await adminApiCall<{ success: boolean; data?: any }>(
                                AdminEndpoints.careers.positions.get,
                              );
                              if (data?.data) {
                                // Normalize dữ liệu để đảm bảo các field luôn là locale object
                                const normalizedPositions = migrateObjectToLocale(data.data);
                                // Normalize items
                                if (normalizedPositions.items && Array.isArray(normalizedPositions.items)) {
                                  const getStringValue = (value: any): string => {
                                    if (typeof value === 'string') return value;
                                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                                      if ('vi' in value || 'en' in value || 'ja' in value) {
                                        return (value as any).vi || (value as any).en || (value as any).ja || '';
                                      }
                                    }
                                    return '';
                                  };
                                  normalizedPositions.items = normalizedPositions.items.map((item: any) => {
                                    const normalizedItem = migrateObjectToLocale(item);
                                    return {
                                      ...normalizedItem,
                                      type: getStringValue(item.type || normalizedItem.type || 'Full-time'),
                                      gradient: getStringValue(item.gradient || normalizedItem.gradient || GRADIENT_OPTIONS[0].value),
                                      skills: Array.isArray(item.skills) ? item.skills : [],
                                      sortOrder: item.sortOrder ?? normalizedItem.sortOrder ?? 0,
                                      isActive: item.isActive ?? normalizedItem.isActive ?? true
                                    };
                                  });
                                }
                                setPositionsData({
                                  ...normalizedPositions,
                                  isActive: checked,
                                });
                              } else {
                                setPositionsData({ ...positionsData, isActive: checked });
                              }
                            } catch (error) {
                              toast.error("Không thể tải positions để cập nhật trạng thái.");
                              setPositionsData({ ...positionsData, isActive: checked });
                            }
                          } else {
                            setPositionsData({ ...positionsData, isActive: checked });
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Items */}
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("positionsItems")}
                  >
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                      {collapsedBlocks.positionsItems ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                      Positions Items ({positionsData.items.length})
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleAddPosition(); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Position
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.positionsItems && (
                  <CardContent className="space-y-4 px-6 py-4">
                    {positionsData.items.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Chưa có position nào. Nhấn "Thêm Position" để thêm.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {positionsData.items
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((item, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{getLocalizedText(item.title, globalLocale) || "Chưa có tiêu đề"}</h4>
                                    <p className="text-sm text-gray-600">{getLocalizedText(item.department, globalLocale)} • {item.type} • {getLocalizedText(item.location, globalLocale)}</p>
                                    <p className="text-xs text-gray-500 mt-1">{getLocalizedText(item.salary, globalLocale)} • {getLocalizedText(item.experience, globalLocale)}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleMovePositionUp(index)}
                                      disabled={index === 0}
                                      title="Di chuyển lên"
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleMovePositionDown(index)}
                                      disabled={index === positionsData.items.length - 1}
                                      title="Di chuyển xuống"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleEditPosition(index)}
                                      title="Chỉnh sửa"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleRemovePosition(index)}
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
                )}
              </Card>

              {/* Dialog Position Form */}
              <Dialog open={editingPositionIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancelPosition();
                }
              }}>
                <DialogContent style={{ maxWidth: '1100px', maxHeight: '99vh', overflowY: 'auto' }}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingPositionIndex === -1 ? "Thêm Position mới" : "Chỉnh sửa Position"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPositionIndex === -1
                        ? "Điền thông tin để tạo position mới"
                        : "Cập nhật thông tin position"}
                    </DialogDescription>
                  </DialogHeader>
                  {positionFormData && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <LocaleInput
                            label="Tiêu đề *"
                            value={getLocaleValue(positionFormData, 'title')}
                            onChange={(value) => {
                              const updated = setLocaleValue(positionFormData, 'title', value);
                              setPositionFormData(updated);
                            }}
                            placeholder="Senior Full-stack Developer"
                            defaultLocale={globalLocale}
                            aiProvider={aiProvider}
                          />
                        </div>
                        <div>
                          <LocaleInput
                            label="Phòng ban"
                            value={getLocaleValue(positionFormData, 'department')}
                            onChange={(value) => {
                              const updated = setLocaleValue(positionFormData, 'department', value);
                              setPositionFormData(updated);
                            }}
                            placeholder="Engineering"
                            defaultLocale={globalLocale}
                            aiProvider={aiProvider}
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Loại hình</Label>
                          <Select
                            value={positionFormData.type || "Full-time"}
                            onValueChange={(value) => setPositionFormData({ ...positionFormData, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Remote">Remote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="pb-2">Địa điểm</Label>
                          <Input
                            value={positionFormData.location || ""}
                            onChange={(e) => setPositionFormData({ ...positionFormData, location: e.target.value })}
                            placeholder="TP. HCM"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Mức lương</Label>
                          <Input
                            value={positionFormData.salary || ""}
                            onChange={(e) => setPositionFormData({ ...positionFormData, salary: e.target.value })}
                            placeholder="2000 - 3500 USD"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Kinh nghiệm</Label>
                          <Input
                            value={positionFormData.experience || ""}
                            onChange={(e) => setPositionFormData({ ...positionFormData, experience: e.target.value })}
                            placeholder="4+ years"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Màu gradient</Label>
                          <Select
                            value={positionFormData.gradient || GRADIENT_OPTIONS[0].value}
                            onValueChange={(value) => setPositionFormData({ ...positionFormData, gradient: value })}
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
                          <LocaleInput
                            label="Mô tả"
                            value={getLocaleValue(positionFormData, 'description')}
                            onChange={(value) => {
                              const updated = setLocaleValue(positionFormData, 'description', value);
                              setPositionFormData(updated);
                            }}
                            placeholder="Mô tả..."
                            multiline={true}
                            defaultLocale={globalLocale}
                            aiProvider={aiProvider}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Kỹ năng (mỗi kỹ năng một dòng)</Label>
                          <Textarea
                            value={Array.isArray(positionFormData.skills) ? positionFormData.skills.join('\n') : ''}
                            onChange={(e) => {
                              const skills = e.target.value.split('\n').filter(s => s.trim());
                              setPositionFormData({ ...positionFormData, skills });
                            }}
                            placeholder="React&#10;Node.js&#10;AWS&#10;MongoDB"
                            rows={4}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={positionFormData.isActive !== undefined ? positionFormData.isActive : true}
                            onChange={(e) => setPositionFormData({ ...positionFormData, isActive: e.target.checked })}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Hiển thị</label>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelPosition}>
                      Hủy
                    </Button>
                    <Button onClick={handleSavePosition}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Vị trí đang tuyển</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-20 bg-white rounded-lg">
                    <div className="max-w-[1340px] mx-auto px-6">
                      {/* Header */}
                      <div className="text-center mb-16 max-w-3xl mx-auto">
                        {getLocalizedText(positionsData.headerTitle, globalLocale) && (
                          <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-6">
                            {getLocalizedText(positionsData.headerTitle, globalLocale)}
                          </h2>
                        )}
                        {getLocalizedText(positionsData.headerDescription, globalLocale) && (
                          <p className="text-gray-600 md:text-lg leading-relaxed">
                            {getLocalizedText(positionsData.headerDescription, globalLocale)}
                          </p>
                        )}
                      </div>

                      {/* Grid */}
                      <div className="grid lg:grid-cols-2 gap-8">
                        {positionsData.items
                          .filter(item => item.isActive)
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((position, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-[24px] p-8 border border-gray-100 hover:border-[#0870B4]/30 transition-all duration-300 h-full flex flex-col shadow-sm"
                            >
                              {/* Header */}
                              <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                  <h4 className="text-[#0F172A] text-2xl font-bold mb-2">
                                    {getLocalizedText(position.title, globalLocale)}
                                  </h4>
                                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                    <Briefcase size={16} className="text-[#0870B4]" />
                                    <span>{getLocalizedText(position.department, globalLocale)}</span>
                                  </div>
                                </div>
                                <span className="px-4 py-1.5 bg-blue-50 text-[#0870B4] rounded-full text-sm font-semibold whitespace-nowrap">
                                  {position.type}
                                </span>
                              </div>

                              {/* Info Grid */}
                              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 p-6 bg-gray-50/80 rounded-2xl border border-gray-100">
                                <div className="flex items-start gap-3">
                                  <MapPin className="text-gray-400 mt-0.5" size={18} />
                                  <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Địa điểm</div>
                                    <div className="text-gray-900 font-medium text-sm">{getLocalizedText(position.location, globalLocale)}</div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <DollarSign className="text-gray-400 mt-0.5" size={18} />
                                  <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mức lương</div>
                                    <div className="text-gray-900 font-medium text-sm">{getLocalizedText(position.salary, globalLocale)}</div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Clock className="text-gray-400 mt-0.5" size={18} />
                                  <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kinh nghiệm</div>
                                    <div className="text-gray-900 font-medium text-sm">{getLocalizedText(position.experience, globalLocale)}</div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Award className="text-gray-400 mt-0.5" size={18} />
                                  <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Loại hình</div>
                                    <div className="text-gray-900 font-medium text-sm">{position.type}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              {getLocalizedText(position.description, globalLocale) && (
                                <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                                  {getLocalizedText(position.description, globalLocale)}
                                </p>
                              )}

                              {/* Skills */}
                              {position.skills && position.skills.length > 0 && (
                                <div className="mb-8">
                                  <div className="text-sm font-semibold text-gray-900 mb-3">
                                    Kỹ năng yêu cầu:
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {position.skills.map((skill, skillIdx) => (
                                      <span
                                        key={skillIdx}
                                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* CTA */}
                              <a
                                href="/contact"
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#0870B4] text-white rounded-xl hover:bg-[#065A93] transition-all transform hover:-translate-y-0.5 font-semibold shadow-md hover:shadow-lg"
                              >
                                Ứng tuyển ngay
                                <ArrowRight size={18} />
                              </a>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* CTA Tab */}
        <TabsContent value="cta" className="space-y-0">
          <Tabs
            value={activeSubTabs.cta}
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

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">CTA Section</h2>
                  <p className="text-gray-600 mt-1">Cấu hình CTA section</p>
                </div>
                <Button onClick={handleSaveCTA} disabled={loadingCTA}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingCTA ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chính</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <LocaleInput
                      label="Tiêu đề"
                      value={getLocaleValue(ctaData, 'title')}
                      onChange={(value) => {
                        const updated = setLocaleValue(ctaData, 'title', value);
                        setCtaData(updated);
                      }}
                      placeholder="Không tìm thấy vị trí phù hợp?"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Mô tả"
                      value={getLocaleValue(ctaData, 'description')}
                      onChange={(value) => {
                        const updated = setLocaleValue(ctaData, 'description', value);
                        setCtaData(updated);
                      }}
                      placeholder="Mô tả..."
                      multiline={true}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Nút chính - Văn bản"
                        value={getLocaleValue(ctaData, 'primaryButtonText')}
                        onChange={(value) => {
                          const updated = setLocaleValue(ctaData, 'primaryButtonText', value);
                          setCtaData(updated);
                        }}
                        placeholder="Gửi CV qua email"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Nút chính - Liên kết</Label>
                      <Input
                        value={ctaData.primaryButtonLink}
                        onChange={(e) => setCtaData({ ...ctaData, primaryButtonLink: e.target.value })}
                        placeholder="mailto:careers@sfb.vn"
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Nút phụ - Văn bản"
                        value={getLocaleValue(ctaData, 'secondaryButtonText')}
                        onChange={(value) => {
                          const updated = setLocaleValue(ctaData, 'secondaryButtonText', value);
                          setCtaData(updated);
                        }}
                        placeholder="Liên hệ HR"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Nút phụ - Liên kết</Label>
                      <Input
                        value={ctaData.secondaryButtonLink}
                        onChange={(e) => setCtaData({ ...ctaData, secondaryButtonLink: e.target.value })}
                        placeholder="/contact"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="pb-2">Màu nền gradient</Label>
                    <Select
                      value={ctaData.backgroundGradient || HERO_GRADIENT_OPTIONS[0].value}
                      onValueChange={(value) => setCtaData({ ...ctaData, backgroundGradient: value })}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {HERO_GRADIENT_OPTIONS.find(opt => opt.value === (ctaData.backgroundGradient || HERO_GRADIENT_OPTIONS[0].value))?.label || "Chọn màu nền"}
                        </SelectValue>
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
                      checked={ctaData.isActive}
                      onCheckedChange={async (checked) => {
                        // If ctaData is empty, fetch existing data first to preserve it
                        if (!ctaData.title && !ctaData.description && !ctaData.primaryButtonText) {
                          try {
                            const data = await adminApiCall<{ success: boolean; data?: any }>(
                              AdminEndpoints.careers.cta.get,
                            );
                            if (data?.data) {
                              setCtaData({
                                ...data.data,
                                isActive: checked,
                              });
                            } else {
                              setCtaData({ ...ctaData, isActive: checked });
                            }
                          } catch (error) {
                            toast.error("Không thể tải CTA để cập nhật trạng thái.");
                            setCtaData({ ...ctaData, isActive: checked });
                          }
                        } else {
                          setCtaData({ ...ctaData, isActive: checked });
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - CTA Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="py-28 relative overflow-hidden flex items-center justify-center rounded-lg"
                    style={{
                      background: ctaData.backgroundGradient || 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
                    }}
                  >
                    <div className="container mx-auto px-6 relative z-10">
                      <div className="max-w-4xl mx-auto text-center">
                        {getLocalizedText(ctaData.title, globalLocale) && (
                          <h2 className="text-white text-3xl md:text-5xl font-bold mb-6">
                            {getLocalizedText(ctaData.title, globalLocale)}
                          </h2>
                        )}
                        {getLocalizedText(ctaData.description, globalLocale) && (
                          <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
                            {getLocalizedText(ctaData.description, globalLocale)}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          {getLocalizedText(ctaData.primaryButtonText, globalLocale) && (
                            <a
                              href={ctaData.primaryButtonLink || '#'}
                              className="group px-8 py-4 bg-white text-[#0870B4] rounded-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 inline-flex items-center justify-center gap-2 font-bold shadow-lg"
                            >
                              {getLocalizedText(ctaData.primaryButtonText, globalLocale)}
                              <ArrowRight
                                className="group-hover:translate-x-1 transition-transform"
                                size={20}
                              />
                            </a>
                          )}
                          {getLocalizedText(ctaData.secondaryButtonText, globalLocale) && (
                            <a
                              href={ctaData.secondaryButtonLink || '#'}
                              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/40 hover:bg-white hover:text-[#0870B4] hover:border-white transition-all inline-flex items-center justify-center gap-2 font-semibold"
                            >
                              {getLocalizedText(ctaData.secondaryButtonText, globalLocale)}
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
      </Tabs>
    </div>
  );
}

