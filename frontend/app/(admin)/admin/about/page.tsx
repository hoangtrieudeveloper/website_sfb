"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Edit, Trash2, ChevronUp, ChevronDown, Mail, Phone, CheckCircle2, Target, Briefcase, Users, Award, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { X, ArrowRight } from "lucide-react";
import "@/styles/admin-about-hero.css";
import "@/styles/admin-about-company.css";

// Icon options
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
  "Building2",
  "MapPin",
  "Mail",
  "Lightbulb",
  "Handshake",
  "Eye",
  "Globe2",
];

const GRADIENT_OPTIONS = [
  { value: "from-blue-500 to-cyan-500", label: "Xanh dương - Cyan" },
  { value: "from-purple-500 to-pink-500", label: "Tím - Hồng" },
  { value: "from-emerald-500 to-teal-500", label: "Xanh lá - Teal" },
  { value: "from-orange-500 to-amber-500", label: "Cam - Vàng" },
  { value: "from-yellow-500 to-orange-500", label: "Vàng - Cam" },
  { value: "from-rose-500 to-pink-500", label: "Rose - Pink" },
  { value: "from-indigo-500 to-purple-500", label: "Indigo - Purple" },
  { value: "from-green-500 to-emerald-500", label: "Green - Emerald" },
];

const HERO_GRADIENT_OPTIONS = [
  { value: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)", label: "Xanh dương SFB" },
  { value: "linear-gradient(to bottom right, #8B5CF6, #EC4899)", label: "Tím - Hồng" },
  { value: "linear-gradient(to bottom right, #10B981, #14B8A6)", label: "Xanh lá - Teal" },
  { value: "linear-gradient(to bottom right, #F59E0B, #FBBF24)", label: "Cam - Vàng" },
];

export default function AdminAboutPage() {
  // Tab State - Main tab
  const [activeMainTab, setActiveMainTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('about-main-tab') || 'hero';
    }
    return 'hero';
  });

  // Tab State - Sub tabs (config/preview) for each section
  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('about-sub-tabs');
      return saved ? JSON.parse(saved) : {
        hero: 'config',
        company: 'config',
        'vision-mission': 'config',
        'core-values': 'config',
        milestones: 'config',
        leadership: 'config',
      };
    }
    return {
      hero: 'config',
      company: 'config',
      'vision-mission': 'config',
      'core-values': 'config',
      milestones: 'config',
      leadership: 'config',
    };
  });

  // Save main tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('about-main-tab', activeMainTab);
    }
  }, [activeMainTab]);

  // Save sub tabs to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('about-sub-tabs', JSON.stringify(activeSubTabs));
    }
  }, [activeSubTabs]);

  // Collapse state for config blocks (default: all hidden)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({
    heroMainInfo: true,
    companyHeader: true,
    companyContent: true,
    companyContact: true,
    visionMissionHeader: true,
    visionMissionItems: true,
    coreValuesHeader: true,
    coreValuesItems: true,
    milestonesHeader: true,
    milestonesItems: true,
    leadershipHeader: true,
    leadershipItems: true,
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
      value: "company",
      label: "Giới thiệu công ty",
      description: "Thông tin về công ty..",
      icon: Briefcase,
    },
    {
      value: "vision-mission",
      label: "Tầm nhìn & sứ mệnh",
      description: "Tầm nhìn và sứ mệnh..",
      icon: Sparkles,
    },
    {
      value: "core-values",
      label: "Giá trị cốt lõi",
      description: "Các giá trị cốt lõi..",
      icon: Award,
    },
    {
      value: "milestones",
      label: "Hành trình & phát triển",
      description: "Các mốc phát triển..",
      icon: Briefcase,
    },
    {
      value: "leadership",
      label: "Ban lãnh đạo",
      description: "Thông tin ban lãnh đạo..",
      icon: Users,
    },
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveMainTab(value);
  };

  // Hero State
  const [heroData, setHeroData] = useState({
    titleLine1: "",
    titleLine2: "",
    titleLine3: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: "",
    backgroundGradient: HERO_GRADIENT_OPTIONS[0].value,
    isActive: true,
  });
  const [loadingHero, setLoadingHero] = useState(false);

  // Company State
  const [companyData, setCompanyData] = useState({
    headerSub: "",
    headerTitleLine1: "",
    headerTitleLine2: "",
    contentImage1: "",
    contentTitle: "",
    contentDescription: "",
    contentButtonText: "",
    contentButtonLink: "",
    contactImage2: "",
    contactButtonText: "",
    contactButtonLink: "",
    contacts: [] as Array<{
      id?: number;
      iconName: string;
      title: string;
      text: string;
      isHighlight: boolean;
      sortOrder: number;
    }>,
    isActive: true,
  });
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);
  const [contactFormData, setContactFormData] = useState<any>(null);

  // Vision & Mission State
  const [visionMissionData, setVisionMissionData] = useState({
    headerTitle: "",
    headerDescription: "",
    items: [] as Array<{ id?: number; text: string; sortOrder: number }>,
    isActive: true,
  });
  const [loadingVisionMission, setLoadingVisionMission] = useState(false);

  // Core Values State
  const [coreValuesData, setCoreValuesData] = useState({
    headerTitle: "",
    headerDescription: "",
    items: [] as Array<{
      id?: number;
      iconName: string;
      title: string;
      description: string;
      gradient: string;
      sortOrder: number;
      isActive: boolean;
    }>,
    isActive: true,
  });
  const [loadingCoreValues, setLoadingCoreValues] = useState(false);
  const [editingCoreValueIndex, setEditingCoreValueIndex] = useState<number | null>(null);
  const [coreValueFormData, setCoreValueFormData] = useState<any>(null);

  // Milestones State
  const [milestonesData, setMilestonesData] = useState({
    headerTitle: "",
    headerDescription: "",
    items: [] as Array<{
      id?: number;
      year: string;
      title: string;
      description: string;
      icon: string;
      sortOrder: number;
      isActive: boolean;
    }>,
    isActive: true,
  });
  const [loadingMilestones, setLoadingMilestones] = useState(false);
  const [editingMilestoneIndex, setEditingMilestoneIndex] = useState<number | null>(null);
  const [milestoneFormData, setMilestoneFormData] = useState<any>(null);

  // Leadership State
  const [leadershipData, setLeadershipData] = useState({
    headerTitle: "",
    headerDescription: "",
    items: [] as Array<{
      id?: number;
      name: string;
      position: string;
      email: string;
      phone: string;
      description: string;
      image: string;
      sortOrder: number;
      isActive: boolean;
    }>,
    isActive: true,
  });
  const [loadingLeadership, setLoadingLeadership] = useState(false);
  const [editingLeaderIndex, setEditingLeaderIndex] = useState<number | null>(null);
  const [leaderFormData, setLeaderFormData] = useState<any>(null);

  // Fetch functions
  const fetchHero = async () => {
    try {
      setLoadingHero(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.hero.get,
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

  const fetchCompany = async () => {
    try {
      setLoadingCompany(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.company.get,
      );
      if (data?.data) {
        setCompanyData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải company");
    } finally {
      setLoadingCompany(false);
    }
  };

  const fetchVisionMission = async () => {
    try {
      setLoadingVisionMission(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.visionMission.get,
      );
      if (data?.data) {
        setVisionMissionData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải vision & mission");
    } finally {
      setLoadingVisionMission(false);
    }
  };

  const fetchCoreValues = async () => {
    try {
      setLoadingCoreValues(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.coreValues.get,
      );
      if (data?.data) {
        setCoreValuesData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải core values");
    } finally {
      setLoadingCoreValues(false);
    }
  };

  const fetchMilestones = async () => {
    try {
      setLoadingMilestones(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.milestones.get,
      );
      if (data?.data) {
        setMilestonesData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải milestones");
    } finally {
      setLoadingMilestones(false);
    }
  };

  const fetchLeadership = async () => {
    try {
      setLoadingLeadership(true);
      const data = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.leadership.get,
      );
      if (data?.data) {
        setLeadershipData(data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải leadership");
    } finally {
      setLoadingLeadership(false);
    }
  };

  useEffect(() => {
    void fetchHero();
    void fetchCompany();
    void fetchVisionMission();
    void fetchCoreValues();
    void fetchMilestones();
    void fetchLeadership();
  }, []);

  // Save functions
  const handleSaveHero = async () => {
    try {
      setLoadingHero(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.hero.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        titleLine1: heroData.titleLine1 !== '' ? heroData.titleLine1 : (existingData.titleLine1 || ''),
        titleLine2: heroData.titleLine2 !== '' ? heroData.titleLine2 : (existingData.titleLine2 || ''),
        titleLine3: heroData.titleLine3 !== '' ? heroData.titleLine3 : (existingData.titleLine3 || ''),
        description: heroData.description !== '' ? heroData.description : (existingData.description || ''),
        buttonText: heroData.buttonText !== '' ? heroData.buttonText : (existingData.buttonText || ''),
        buttonLink: heroData.buttonLink !== '' ? heroData.buttonLink : (existingData.buttonLink || ''),
        image: heroData.image !== '' ? heroData.image : (existingData.image || ''),
        backgroundGradient: heroData.backgroundGradient !== '' ? heroData.backgroundGradient : (existingData.backgroundGradient || ''),
        isActive: heroData.isActive,
      };

      await adminApiCall(AdminEndpoints.about.hero.update, {
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

  const handleSaveCompany = async () => {
    try {
      setLoadingCompany(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.company.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        headerSub: companyData.headerSub !== '' ? companyData.headerSub : (existingData.headerSub || ''),
        headerTitleLine1: companyData.headerTitleLine1 !== '' ? companyData.headerTitleLine1 : (existingData.headerTitleLine1 || ''),
        headerTitleLine2: companyData.headerTitleLine2 !== '' ? companyData.headerTitleLine2 : (existingData.headerTitleLine2 || ''),
        contentImage1: companyData.contentImage1 !== '' ? companyData.contentImage1 : (existingData.contentImage1 || ''),
        contentTitle: companyData.contentTitle !== '' ? companyData.contentTitle : (existingData.contentTitle || ''),
        contentDescription: companyData.contentDescription !== '' ? companyData.contentDescription : (existingData.contentDescription || ''),
        contentButtonText: companyData.contentButtonText !== '' ? companyData.contentButtonText : (existingData.contentButtonText || ''),
        contentButtonLink: companyData.contentButtonLink !== '' ? companyData.contentButtonLink : (existingData.contentButtonLink || ''),
        contactImage2: companyData.contactImage2 !== '' ? companyData.contactImage2 : (existingData.contactImage2 || ''),
        contactButtonText: companyData.contactButtonText !== '' ? companyData.contactButtonText : (existingData.contactButtonText || ''),
        contactButtonLink: companyData.contactButtonLink !== '' ? companyData.contactButtonLink : (existingData.contactButtonLink || ''),
        contacts: companyData.contacts,
        isActive: companyData.isActive,
      };

      await adminApiCall(AdminEndpoints.about.company.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu company");
      void fetchCompany();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu company");
    } finally {
      setLoadingCompany(false);
    }
  };

  const handleSaveVisionMission = async () => {
    try {
      setLoadingVisionMission(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.visionMission.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        headerTitle: visionMissionData.headerTitle !== '' ? visionMissionData.headerTitle : (existingData.headerTitle || ''),
        headerDescription: visionMissionData.headerDescription !== '' ? visionMissionData.headerDescription : (existingData.headerDescription || ''),
        items: visionMissionData.items,
        isActive: visionMissionData.isActive,
      };

      await adminApiCall(AdminEndpoints.about.visionMission.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu vision & mission");
      void fetchVisionMission();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu vision & mission");
    } finally {
      setLoadingVisionMission(false);
    }
  };

  const handleSaveCoreValues = async () => {
    try {
      setLoadingCoreValues(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.coreValues.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        headerTitle: coreValuesData.headerTitle !== '' ? coreValuesData.headerTitle : (existingData.headerTitle || ''),
        headerDescription: coreValuesData.headerDescription !== '' ? coreValuesData.headerDescription : (existingData.headerDescription || ''),
        items: coreValuesData.items,
        isActive: coreValuesData.isActive,
      };

      await adminApiCall(AdminEndpoints.about.coreValues.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu core values");
      void fetchCoreValues();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu core values");
    } finally {
      setLoadingCoreValues(false);
    }
  };

  const handleSaveMilestones = async () => {
    try {
      setLoadingMilestones(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.milestones.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        headerTitle: milestonesData.headerTitle !== '' ? milestonesData.headerTitle : (existingData.headerTitle || ''),
        headerDescription: milestonesData.headerDescription !== '' ? milestonesData.headerDescription : (existingData.headerDescription || ''),
        items: milestonesData.items,
        isActive: milestonesData.isActive,
      };

      await adminApiCall(AdminEndpoints.about.milestones.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu milestones");
      void fetchMilestones();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu milestones");
    } finally {
      setLoadingMilestones(false);
    }
  };

  const handleSaveLeadership = async () => {
    try {
      setLoadingLeadership(true);

      // Fetch current data from DB to ensure we don't overwrite with empty fields
      const currentDbData = await adminApiCall<{ success: boolean; data?: any }>(
        AdminEndpoints.about.leadership.get,
      );
      const existingData = currentDbData?.data || {};

      // Merge current frontend state with existing DB data, prioritizing frontend values if not empty
      const mergedData = {
        headerTitle: leadershipData.headerTitle !== '' ? leadershipData.headerTitle : (existingData.headerTitle || ''),
        headerDescription: leadershipData.headerDescription !== '' ? leadershipData.headerDescription : (existingData.headerDescription || ''),
        items: leadershipData.items,
        isActive: leadershipData.isActive,
      };

      await adminApiCall(AdminEndpoints.about.leadership.update, {
        method: "PUT",
        body: JSON.stringify(mergedData),
      });
      toast.success("Đã lưu leadership");
      void fetchLeadership();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu leadership");
    } finally {
      setLoadingLeadership(false);
    }
  };

  // Render icon
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code2;
    return <IconComponent className="w-6 h-6" />;
  };

  // Company Contact Handlers
  const handleAddContact = () => {
    setContactFormData({
      iconName: "Building2",
      title: "",
      text: "",
      isHighlight: false,
      sortOrder: companyData.contacts.length,
    });
    setEditingContactIndex(-1);
  };

  const handleEditContact = (index: number) => {
    setContactFormData({ ...companyData.contacts[index] });
    setEditingContactIndex(index);
  };

  const handleCancelContact = () => {
    setEditingContactIndex(null);
    setContactFormData(null);
  };

  const handleSaveContact = () => {
    if (editingContactIndex === -1) {
      setCompanyData({
        ...companyData,
        contacts: [...companyData.contacts, { ...contactFormData, sortOrder: companyData.contacts.length }],
      });
      toast.success("Đã thêm contact");
    } else if (editingContactIndex !== null) {
      const newContacts = [...companyData.contacts];
      newContacts[editingContactIndex] = contactFormData;
      setCompanyData({ ...companyData, contacts: newContacts });
      toast.success("Đã cập nhật contact");
    }
    handleCancelContact();
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = [...companyData.contacts];
    newContacts.splice(index, 1);
    setCompanyData({ ...companyData, contacts: newContacts });
    toast.success("Đã xóa contact");
  };

  const handleMoveContactUp = (index: number) => {
    if (index === 0) return;
    const newContacts = [...companyData.contacts];
    [newContacts[index - 1], newContacts[index]] = [newContacts[index], newContacts[index - 1]];
    newContacts.forEach((c, i) => (c.sortOrder = i));
    setCompanyData({ ...companyData, contacts: newContacts });
  };

  const handleMoveContactDown = (index: number) => {
    if (index === companyData.contacts.length - 1) return;
    const newContacts = [...companyData.contacts];
    [newContacts[index], newContacts[index + 1]] = [newContacts[index + 1], newContacts[index]];
    newContacts.forEach((c, i) => (c.sortOrder = i));
    setCompanyData({ ...companyData, contacts: newContacts });
  };

  // Vision & Mission Handlers
  const handleAddVisionMissionItem = () => {
    setVisionMissionData({
      ...visionMissionData,
      items: [...visionMissionData.items, { text: "", sortOrder: visionMissionData.items.length }],
    });
  };

  const handleRemoveVisionMissionItem = (index: number) => {
    const newItems = [...visionMissionData.items];
    newItems.splice(index, 1);
    newItems.forEach((item, i) => (item.sortOrder = i));
    setVisionMissionData({ ...visionMissionData, items: newItems });
    toast.success("Đã xóa item");
  };

  const handleMoveVisionMissionItemUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...visionMissionData.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setVisionMissionData({ ...visionMissionData, items: newItems });
  };

  const handleMoveVisionMissionItemDown = (index: number) => {
    if (index === visionMissionData.items.length - 1) return;
    const newItems = [...visionMissionData.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setVisionMissionData({ ...visionMissionData, items: newItems });
  };

  // Core Values Handlers
  const handleAddCoreValue = () => {
    setCoreValueFormData({
      iconName: "Lightbulb",
      title: "",
      description: "",
      gradient: GRADIENT_OPTIONS[0].value,
      sortOrder: coreValuesData.items.length,
      isActive: true,
    });
    setEditingCoreValueIndex(-1);
  };

  const handleEditCoreValue = (index: number) => {
    setCoreValueFormData({ ...coreValuesData.items[index] });
    setEditingCoreValueIndex(index);
  };

  const handleCancelCoreValue = () => {
    setEditingCoreValueIndex(null);
    setCoreValueFormData(null);
  };

  const handleSaveCoreValue = () => {
    if (editingCoreValueIndex === -1) {
      setCoreValuesData({
        ...coreValuesData,
        items: [...coreValuesData.items, { ...coreValueFormData, sortOrder: coreValuesData.items.length }],
      });
      toast.success("Đã thêm core value");
    } else if (editingCoreValueIndex !== null) {
      const newItems = [...coreValuesData.items];
      newItems[editingCoreValueIndex] = coreValueFormData;
      setCoreValuesData({ ...coreValuesData, items: newItems });
      toast.success("Đã cập nhật core value");
    }
    handleCancelCoreValue();
  };

  const handleRemoveCoreValue = (index: number) => {
    const newItems = [...coreValuesData.items];
    newItems.splice(index, 1);
    setCoreValuesData({ ...coreValuesData, items: newItems });
    toast.success("Đã xóa core value");
  };

  const handleMoveCoreValueUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...coreValuesData.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setCoreValuesData({ ...coreValuesData, items: newItems });
  };

  const handleMoveCoreValueDown = (index: number) => {
    if (index === coreValuesData.items.length - 1) return;
    const newItems = [...coreValuesData.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setCoreValuesData({ ...coreValuesData, items: newItems });
  };

  // Milestones Handlers
  const handleAddMilestone = () => {
    setMilestoneFormData({
      year: "",
      title: "",
      description: "",
      icon: "🚀",
      sortOrder: milestonesData.items.length,
      isActive: true,
    });
    setEditingMilestoneIndex(-1);
  };

  const handleEditMilestone = (index: number) => {
    setMilestoneFormData({ ...milestonesData.items[index] });
    setEditingMilestoneIndex(index);
  };

  const handleCancelMilestone = () => {
    setEditingMilestoneIndex(null);
    setMilestoneFormData(null);
  };

  const handleSaveMilestone = () => {
    if (editingMilestoneIndex === -1) {
      setMilestonesData({
        ...milestonesData,
        items: [...milestonesData.items, { ...milestoneFormData, sortOrder: milestonesData.items.length }],
      });
      toast.success("Đã thêm milestone");
    } else if (editingMilestoneIndex !== null) {
      const newItems = [...milestonesData.items];
      newItems[editingMilestoneIndex] = milestoneFormData;
      setMilestonesData({ ...milestonesData, items: newItems });
      toast.success("Đã cập nhật milestone");
    }
    handleCancelMilestone();
  };

  const handleRemoveMilestone = (index: number) => {
    const newItems = [...milestonesData.items];
    newItems.splice(index, 1);
    setMilestonesData({ ...milestonesData, items: newItems });
    toast.success("Đã xóa milestone");
  };

  const handleMoveMilestoneUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...milestonesData.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setMilestonesData({ ...milestonesData, items: newItems });
  };

  const handleMoveMilestoneDown = (index: number) => {
    if (index === milestonesData.items.length - 1) return;
    const newItems = [...milestonesData.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setMilestonesData({ ...milestonesData, items: newItems });
  };

  // Leadership Handlers
  const handleAddLeader = () => {
    setLeaderFormData({
      name: "",
      position: "",
      email: "",
      phone: "",
      description: "",
      image: "",
      sortOrder: leadershipData.items.length,
      isActive: true,
    });
    setEditingLeaderIndex(-1);
  };

  const handleEditLeader = (index: number) => {
    setLeaderFormData({ ...leadershipData.items[index] });
    setEditingLeaderIndex(index);
  };

  const handleCancelLeader = () => {
    setEditingLeaderIndex(null);
    setLeaderFormData(null);
  };

  const handleSaveLeader = () => {
    if (editingLeaderIndex === -1) {
      setLeadershipData({
        ...leadershipData,
        items: [...leadershipData.items, { ...leaderFormData, sortOrder: leadershipData.items.length }],
      });
      toast.success("Đã thêm leader");
    } else if (editingLeaderIndex !== null) {
      const newItems = [...leadershipData.items];
      newItems[editingLeaderIndex] = leaderFormData;
      setLeadershipData({ ...leadershipData, items: newItems });
      toast.success("Đã cập nhật leader");
    }
    handleCancelLeader();
  };

  const handleRemoveLeader = (index: number) => {
    const newItems = [...leadershipData.items];
    newItems.splice(index, 1);
    setLeadershipData({ ...leadershipData, items: newItems });
    toast.success("Đã xóa leader");
  };

  const handleMoveLeaderUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...leadershipData.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setLeadershipData({ ...leadershipData, items: newItems });
  };

  const handleMoveLeaderDown = (index: number) => {
    if (index === leadershipData.items.length - 1) return;
    const newItems = [...leadershipData.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    newItems.forEach((item, i) => (item.sortOrder = i));
    setLeadershipData({ ...leadershipData, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý trang Giới thiệu</h1>
          <p className="text-gray-600 mt-1">Quản lý đầy đủ các phần của trang Giới thiệu</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Phần Hero</h2>
                  <p className="text-gray-600 mt-1">Cấu hình phần hero cho trang Giới thiệu</p>
                </div>
                <Button onClick={handleSaveHero} disabled={loadingHero}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingHero ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("heroMainInfo")}
                  >
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                      {collapsedBlocks.heroMainInfo ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                      Thông tin chính
                    </CardTitle>
                  </div>
                </CardHeader>
                {!collapsedBlocks.heroMainInfo && (
                  <CardContent className="space-y-4 px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="pb-2">Tiêu đề dòng 1 *</Label>
                      <Input
                        value={heroData.titleLine1}
                        onChange={(e) => setHeroData({ ...heroData, titleLine1: e.target.value })}
                        placeholder="SFB Technology"
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Tiêu đề dòng 2 *</Label>
                      <Input
                        value={heroData.titleLine2}
                        onChange={(e) => setHeroData({ ...heroData, titleLine2: e.target.value })}
                        placeholder="Công ty cổ phần"
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Tiêu đề dòng 3 *</Label>
                      <Input
                        value={heroData.titleLine3}
                        onChange={(e) => setHeroData({ ...heroData, titleLine3: e.target.value })}
                        placeholder="công nghệ SFB"
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
                      <Label className="pb-2">Văn bản nút</Label>
                      <Input
                        value={heroData.buttonText}
                        onChange={(e) => setHeroData({ ...heroData, buttonText: e.target.value })}
                        placeholder="KHÁM PHÁ GIẢI PHÁP"
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Liên kết nút</Label>
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
                    <Label className="pb-2">Màu nền gradient</Label>
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
                      onCheckedChange={async (checked) => {
                        // If heroData is empty, fetch existing data first to preserve it
                        if (!heroData.titleLine1 && !heroData.titleLine2 && !heroData.titleLine3 && !heroData.description) {
                          try {
                            const data = await adminApiCall<{ success: boolean; data?: any }>(
                              AdminEndpoints.about.hero.get,
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
                )}
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
                            {heroData.titleLine1}
                            <span className="block mt-2">
                              {heroData.titleLine2}
                              <br />
                              {heroData.titleLine3}
                            </span>
                          </h1>
                          {heroData.description && (
                            <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed">
                              {heroData.description}
                            </p>
                          )}
                          {heroData.buttonText && (
                            <a
                              href={heroData.buttonLink || '#'}
                              className="inline-flex items-center gap-3 px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm"
                            >
                              {heroData.buttonText}
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

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-0">
          <Tabs 
            value={activeSubTabs.company} 
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, company: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Giới thiệu công ty</h2>
                  <p className="text-gray-600 mt-1">Cấu hình Giới thiệu công ty cho trang Giới thiệu</p>
                </div>
                <Button onClick={handleSaveCompany} disabled={loadingCompany}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingCompany ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Header */}
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("companyHeader")}
                  >
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                      {collapsedBlocks.companyHeader ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                      Header
                    </CardTitle>
                  </div>
                </CardHeader>
                {!collapsedBlocks.companyHeader && (
                  <CardContent className="space-y-4 px-6 py-4">
                    <div>
                      <Label className="pb-2">Sub Tiêu đề</Label>
                      <Input
                        value={companyData.headerSub}
                        onChange={(e) => setCompanyData({ ...companyData, headerSub: e.target.value })}
                        placeholder="GIỚI THIỆU SFB"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="pb-2">Tiêu đề dòng 1</Label>
                        <Input
                          value={companyData.headerTitleLine1}
                          onChange={(e) => setCompanyData({ ...companyData, headerTitleLine1: e.target.value })}
                          placeholder="Đối tác công nghệ chiến lược"
                        />
                      </div>
                      <div>
                        <Label className="pb-2">Tiêu đề dòng 2</Label>
                        <Input
                          value={companyData.headerTitleLine2}
                          onChange={(e) => setCompanyData({ ...companyData, headerTitleLine2: e.target.value })}
                          placeholder="cho doanh nghiệp Việt"
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Content */}
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("companyContent")}
                  >
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                      {collapsedBlocks.companyContent ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                      Nội dung
                    </CardTitle>
                  </div>
                </CardHeader>
                {!collapsedBlocks.companyContent && (
                  <CardContent className="space-y-4 px-6 py-4">
                    <div>
                      <Label className="pb-2">Ảnh 1</Label>
                      <ImageUpload
                        currentImage={companyData.contentImage1}
                        onImageSelect={(url) => setCompanyData({ ...companyData, contentImage1: url })}
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Tiêu đề</Label>
                      <Input
                        value={companyData.contentTitle}
                        onChange={(e) => setCompanyData({ ...companyData, contentTitle: e.target.value })}
                        placeholder="CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB..."
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Mô tả</Label>
                      <Textarea
                        value={companyData.contentDescription}
                        onChange={(e) => setCompanyData({ ...companyData, contentDescription: e.target.value })}
                        placeholder="Mô tả..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="pb-2">Văn bản nút</Label>
                        <Input
                          value={companyData.contentButtonText}
                          onChange={(e) => setCompanyData({ ...companyData, contentButtonText: e.target.value })}
                          placeholder="Liên hệ với chúng tôi"
                        />
                      </div>
                      <div>
                        <Label className="pb-2">Liên kết nút</Label>
                        <Input
                          value={companyData.contentButtonLink}
                          onChange={(e) => setCompanyData({ ...companyData, contentButtonLink: e.target.value })}
                          placeholder="/contact"
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("companyContact")}
                  >
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                      {collapsedBlocks.companyContact ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                      Thông tin liên hệ
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleAddContact(); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Contact
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.companyContact && (
                  <CardContent className="space-y-6 px-6 py-4">
                  {/* Contact Items */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Danh sách Contact ({companyData.contacts.length})
                    </h3>
                    {companyData.contacts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        Chưa có contact nào. Nhấn "Thêm Contact" để thêm.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {companyData.contacts
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((contact, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        {renderIcon(contact.iconName)}
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">{contact.title}</h4>
                                        <p className="text-sm text-gray-600">{contact.text}</p>
                                        {contact.isHighlight && (
                                          <span className="text-xs text-blue-600">Nổi bật</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleMoveContactUp(index)}
                                      disabled={index === 0}
                                      title="Di chuyển lên"
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleMoveContactDown(index)}
                                      disabled={index === companyData.contacts.length - 1}
                                      title="Di chuyển xuống"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleEditContact(index)}
                                      title="Chỉnh sửa"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleRemoveContact(index)}
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
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Contact Section Settings */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Cấu hình phần liên hệ</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="pb-2">Ảnh 2</Label>
                        <ImageUpload
                          currentImage={companyData.contactImage2}
                          onImageSelect={(url) => setCompanyData({ ...companyData, contactImage2: url })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="pb-2">Văn bản nút</Label>
                          <Input
                            value={companyData.contactButtonText}
                            onChange={(e) => setCompanyData({ ...companyData, contactButtonText: e.target.value })}
                            placeholder="Liên hệ ngay"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Liên kết nút</Label>
                          <Input
                            value={companyData.contactButtonLink}
                            onChange={(e) => setCompanyData({ ...companyData, contactButtonLink: e.target.value })}
                            placeholder="/contact"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="pb-2">Kích hoạt</Label>
                        <Switch
                          checked={companyData.isActive}
                          onCheckedChange={async (checked) => {
                            // If companyData is empty, fetch existing data first to preserve it
                            if (!companyData.headerSub && !companyData.headerTitleLine1 && !companyData.headerTitleLine2 && companyData.contacts.length === 0) {
                              try {
                                const data = await adminApiCall<{ success: boolean; data?: any }>(
                                  AdminEndpoints.about.company.get,
                                );
                                if (data?.data) {
                                  setCompanyData({
                                    ...data.data,
                                    isActive: checked,
                                  });
                                } else {
                                  setCompanyData({ ...companyData, isActive: checked });
                                }
                              } catch (error) {
                                toast.error("Không thể tải company để cập nhật trạng thái.");
                                setCompanyData({ ...companyData, isActive: checked });
                              }
                            } else {
                              setCompanyData({ ...companyData, isActive: checked });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  </CardContent>
                )}
              </Card>

              {/* Dialog Contact Form */}
              <Dialog open={editingContactIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancelContact();
                }
              }}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingContactIndex === -1 ? "Thêm Contact mới" : "Chỉnh sửa Contact"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingContactIndex === -1
                        ? "Điền thông tin để tạo contact mới"
                        : "Cập nhật thông tin contact"}
                    </DialogDescription>
                  </DialogHeader>
                  {contactFormData && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="pb-2">Tên icon</Label>
                          <Select
                            value={contactFormData.iconName || "Building2"}
                            onValueChange={(value) => setContactFormData({ ...contactFormData, iconName: value })}
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
                          <Label className="pb-2">Tiêu đề</Label>
                          <Input
                            value={contactFormData.title || ""}
                            onChange={(e) => setContactFormData({ ...contactFormData, title: e.target.value })}
                            placeholder="Trụ sở"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Nội dung</Label>
                          <Textarea
                            value={contactFormData.text || ""}
                            onChange={(e) => setContactFormData({ ...contactFormData, text: e.target.value })}
                            placeholder="Địa chỉ..."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={contactFormData.isHighlight || false}
                            onChange={(e) => setContactFormData({ ...contactFormData, isHighlight: e.target.checked })}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Nổi bật</label>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelContact}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveContact}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Giới thiệu công ty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="py-20 rounded-lg relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(to bottom, #F0F9FF 0%, #E0F2FE 50%, #D1E7FF 100%)',
                    }}
                  >
                    <div className="max-w-[1340px] mx-auto px-6 relative z-10">
                      {/* Header */}
                      <div className="text-center mb-16">
                        {companyData.headerSub && (
                          <span className="text-[#2CA4E0] font-semibold text-sm tracking-wider uppercase mb-3 block">
                            {companyData.headerSub}
                          </span>
                        )}
                        {(companyData.headerTitleLine1 || companyData.headerTitleLine2) && (
                          <h2 className="text-[#1A202C] text-3xl md:text-4xl font-bold leading-tight">
                            {companyData.headerTitleLine1}
                            <br />
                            {companyData.headerTitleLine2}
                          </h2>
                        )}
                      </div>

                      {/* Section 1 */}
                      <div className="about-company-section1 mb-32">
                        {companyData.contentImage1 && (
                          <div className="about-company-image-wrapper">
                            <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-lg overflow-hidden bg-gray-200">
                              <img
                                src={companyData.contentImage1}
                                alt="Content"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div className="space-y-6 about-company-content-wrapper">
                          {companyData.contentTitle && (
                            <h3 className="text-[#1A202C] text-lg font-bold leading-relaxed">
                              {companyData.contentTitle}
                            </h3>
                          )}
                          {companyData.contentDescription && (
                            <p className="text-gray-600 leading-relaxed">
                              {companyData.contentDescription}
                            </p>
                          )}
                          {companyData.contentButtonText && (
                            <a
                              href={companyData.contentButtonLink || '#'}
                              className="inline-flex items-center gap-2 px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
                            >
                              {companyData.contentButtonText}
                              <ArrowRight size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Section 2 */}
                      <div className="about-company-section2">
                        <div className="about-company-contact-wrapper space-y-8">
                          <div className="space-y-6">
                            {companyData.contacts
                              .sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((contact, idx) => {
                                const Icon = (LucideIcons as any)[contact.iconName] || LucideIcons.Building2;
                                return (
                                  <div key={idx} className="flex items-start gap-4">
                                    <div className="mt-1 p-2 rounded-full bg-blue-50 flex-shrink-0">
                                      <Icon className="text-[#2CA4E0]" size={20} />
                                    </div>
                                    <div className="flex-1">
                                      {contact.isHighlight ? (
                                        <h4 className="font-bold text-gray-900 mb-1">
                                          {contact.title}: <span className="font-normal text-gray-600">{contact.text}</span>
                                        </h4>
                                      ) : (
                                        <>
                                          <h4 className="font-bold text-gray-900 mb-1">{contact.title}</h4>
                                          <p className="text-gray-600 text-sm leading-relaxed">{contact.text}</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          {companyData.contactButtonText && (
                            <a
                              href={companyData.contactButtonLink || '#'}
                              className="inline-flex items-center gap-2 px-[30px] py-[7px] h-[56px] rounded-[12px] border border-white bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
                            >
                              {companyData.contactButtonText}
                              <ArrowRight size={16} />
                            </a>
                          )}
                        </div>
                        {companyData.contactImage2 && (
                          <div className="about-company-contact-image-wrapper">
                            <div className="w-full aspect-[701/511] rounded-[24px] border-[10px] border-white shadow-lg overflow-hidden bg-gray-200">
                              <img
                                src={companyData.contactImage2}
                                alt="Contact"
                                className="w-full h-full object-cover"
                              />
                            </div>
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

        {/* Vision & Mission Tab */}
        <TabsContent value="vision-mission" className="space-y-0">
          <Tabs 
            value={activeSubTabs['vision-mission']} 
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, 'vision-mission': value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tầm nhìn & sứ mệnh</h2>
                  <p className="text-gray-600 mt-1">Cấu hình Tầm nhìn & sứ mệnh</p>
                </div>
                <Button onClick={handleSaveVisionMission} disabled={loadingVisionMission}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingVisionMission ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Header */}
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("visionMissionHeader")}
                  >
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                      {collapsedBlocks.visionMissionHeader ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                      Header
                    </CardTitle>
                  </div>
                </CardHeader>
                {!collapsedBlocks.visionMissionHeader && (
                  <CardContent className="space-y-4 px-6 py-4">
                    <div>
                      <Label className="pb-2">Tiêu đề</Label>
                      <Input
                        value={visionMissionData.headerTitle}
                        onChange={(e) => setVisionMissionData({ ...visionMissionData, headerTitle: e.target.value })}
                        placeholder="Tầm nhìn & Sứ mệnh"
                      />
                    </div>
                    <div>
                      <Label className="pb-2">Mô tả</Label>
                      <Textarea
                        value={visionMissionData.headerDescription}
                        onChange={(e) => setVisionMissionData({ ...visionMissionData, headerDescription: e.target.value })}
                        placeholder="Mô tả..."
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="pb-2">Kích hoạt</Label>
                      <Switch
                        checked={visionMissionData.isActive}
                        onCheckedChange={async (checked) => {
                          // If visionMissionData is empty, fetch existing data first to preserve it
                          if (!visionMissionData.headerTitle && !visionMissionData.headerDescription && visionMissionData.items.length === 0) {
                            try {
                              const data = await adminApiCall<{ success: boolean; data?: any }>(
                                AdminEndpoints.about.visionMission.get,
                              );
                              if (data?.data) {
                                setVisionMissionData({
                                  ...data.data,
                                  isActive: checked,
                                });
                              } else {
                                setVisionMissionData({ ...visionMissionData, isActive: checked });
                              }
                            } catch (error) {
                              toast.error("Không thể tải vision & mission để cập nhật trạng thái.");
                              setVisionMissionData({ ...visionMissionData, isActive: checked });
                            }
                          } else {
                            setVisionMissionData({ ...visionMissionData, isActive: checked });
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
                    onClick={() => toggleBlock("visionMissionItems")}
                  >
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                      {collapsedBlocks.visionMissionItems ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                      Items ({visionMissionData.items.length})
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleAddVisionMissionItem(); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Item
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.visionMissionItems && (
                  <CardContent className="space-y-4 px-6 py-4">
                  {visionMissionData.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có item nào. Nhấn "Thêm Item" để thêm.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {visionMissionData.items
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((item, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#2CA4E0] flex items-center justify-center bg-white">
                                      <span className="text-[#2CA4E0] font-bold">{index + 1}</span>
                                    </div>
                                    <p className="text-gray-700">{item.text || "Chưa có nội dung"}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveVisionMissionItemUp(index)}
                                    disabled={index === 0}
                                    title="Di chuyển lên"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveVisionMissionItemDown(index)}
                                    disabled={index === visionMissionData.items.length - 1}
                                    title="Di chuyển xuống"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const newText = prompt("Nhập nội dung:", item.text);
                                      if (newText !== null) {
                                        const newItems = [...visionMissionData.items];
                                        newItems[index] = { ...item, text: newText };
                                        setVisionMissionData({ ...visionMissionData, items: newItems });
                                      }
                                    }}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveVisionMissionItem(index)}
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
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Tầm nhìn & sứ mệnh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-20 bg-white rounded-lg relative">
                    <div className="max-w-[1340px] mx-auto px-6 relative z-10">
                      {/* Header */}
                      <div className="max-w-4xl mx-auto text-center mb-16">
                        {visionMissionData.headerTitle && (
                          <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-6">
                            {visionMissionData.headerTitle}
                          </h2>
                        )}
                        {visionMissionData.headerDescription && (
                          <p className="text-gray-600 md:text-lg leading-relaxed max-w-3xl mx-auto">
                            {visionMissionData.headerDescription}
                          </p>
                        )}
                      </div>

                      {/* Items Grid */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visionMissionData.items
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-[#EFF8FC] rounded-[16px] p-6 flex items-start gap-4 h-full border border-transparent"
                            >
                              <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#2CA4E0] flex items-center justify-center bg-white/50">
                                <span className="text-[#2CA4E0] font-bold text-lg">{idx + 1}</span>
                              </div>
                              <p className="text-[#334155] font-medium leading-relaxed">{item.text}</p>
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

        {/* Core Values Tab */}
        <TabsContent value="core-values" className="space-y-0">
          <Tabs 
            value={activeSubTabs['core-values']} 
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, 'core-values': value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Giá trị cốt lõi</h2>
                  <p className="text-gray-600 mt-1">Cấu hình Giá trị cốt lõi</p>
                </div>
                <Button onClick={handleSaveCoreValues} disabled={loadingCoreValues}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingCoreValues ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Header</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="pb-2">Tiêu đề</Label>
                    <Input
                      value={coreValuesData.headerTitle}
                      onChange={(e) => setCoreValuesData({ ...coreValuesData, headerTitle: e.target.value })}
                      placeholder="Giá trị cốt lõi"
                    />
                  </div>
                  <div>
                    <Label className="pb-2">Mô tả</Label>
                    <Textarea
                      value={coreValuesData.headerDescription}
                      onChange={(e) => setCoreValuesData({ ...coreValuesData, headerDescription: e.target.value })}
                      placeholder="Mô tả..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="pb-2">Kích hoạt</Label>
                    <Switch
                      checked={coreValuesData.isActive}
                      onCheckedChange={async (checked) => {
                        // If coreValuesData is empty, fetch existing data first to preserve it
                        if (!coreValuesData.headerTitle && !coreValuesData.headerDescription && coreValuesData.items.length === 0) {
                          try {
                            const data = await adminApiCall<{ success: boolean; data?: any }>(
                              AdminEndpoints.about.coreValues.get,
                            );
                            if (data?.data) {
                              setCoreValuesData({
                                ...data.data,
                                isActive: checked,
                              });
                            } else {
                              setCoreValuesData({ ...coreValuesData, isActive: checked });
                            }
                          } catch (error) {
                            toast.error("Không thể tải core values để cập nhật trạng thái.");
                            setCoreValuesData({ ...coreValuesData, isActive: checked });
                          }
                        } else {
                          setCoreValuesData({ ...coreValuesData, isActive: checked });
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
                    <CardTitle>Core Values Items ({coreValuesData.items.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleAddCoreValue}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Core Value
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coreValuesData.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có core value nào. Nhấn "Thêm Core Value" để thêm.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {coreValuesData.items
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
                                      <h4 className="font-semibold">{item.title || "Chưa có tiêu đề"}</h4>
                                      <p className="text-sm text-gray-600 line-clamp-1">
                                        {item.description || "Chưa có mô tả"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveCoreValueUp(index)}
                                    disabled={index === 0}
                                    title="Di chuyển lên"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveCoreValueDown(index)}
                                    disabled={index === coreValuesData.items.length - 1}
                                    title="Di chuyển xuống"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditCoreValue(index)}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveCoreValue(index)}
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

              {/* Dialog Core Value Form */}
              <Dialog open={editingCoreValueIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancelCoreValue();
                }
              }}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCoreValueIndex === -1 ? "Thêm Core Value mới" : "Chỉnh sửa Core Value"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCoreValueIndex === -1
                        ? "Điền thông tin để tạo core value mới"
                        : "Cập nhật thông tin core value"}
                    </DialogDescription>
                  </DialogHeader>
                  {coreValueFormData && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="pb-2">Tên icon</Label>
                          <Select
                            value={coreValueFormData.iconName || "Lightbulb"}
                            onValueChange={(value) => setCoreValueFormData({ ...coreValueFormData, iconName: value })}
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
                            value={coreValueFormData.gradient || GRADIENT_OPTIONS[0].value}
                            onValueChange={(value) => setCoreValueFormData({ ...coreValueFormData, gradient: value })}
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
                          <Label className="pb-2">Tiêu đề</Label>
                          <Input
                            value={coreValueFormData.title || ""}
                            onChange={(e) => setCoreValueFormData({ ...coreValueFormData, title: e.target.value })}
                            placeholder="Đổi mới sáng tạo"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Mô tả</Label>
                          <Textarea
                            value={coreValueFormData.description || ""}
                            onChange={(e) => setCoreValueFormData({ ...coreValueFormData, description: e.target.value })}
                            placeholder="Mô tả..."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={coreValueFormData.isActive !== undefined ? coreValueFormData.isActive : true}
                            onChange={(e) => setCoreValueFormData({ ...coreValueFormData, isActive: e.target.checked })}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Hiển thị</label>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelCoreValue}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveCoreValue}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Giá trị cốt lõi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-20 bg-[#F8FBFE] rounded-lg">
                    <div className="max-w-[1340px] mx-auto px-6">
                      {/* Header */}
                      <div className="text-center mb-16">
                        {coreValuesData.headerTitle && (
                          <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                            {coreValuesData.headerTitle}
                          </h2>
                        )}
                        {coreValuesData.headerDescription && (
                          <p className="text-gray-600 md:text-lg max-w-2xl mx-auto leading-relaxed">
                            {coreValuesData.headerDescription}
                          </p>
                        )}
                      </div>

                      {/* Grid */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coreValuesData.items
                          .filter(item => item.isActive)
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((item, idx) => {
                            const Icon = (LucideIcons as any)[item.iconName] || LucideIcons.Lightbulb;
                            return (
                              <div
                                key={idx}
                                className="bg-white rounded-[24px] p-8 flex flex-col items-center text-center shadow-lg h-full border border-transparent hover:border-blue-100"
                              >
                                <div className="mb-6 text-[#2CA4E0] p-4 bg-blue-50/50 rounded-full">
                                  <Icon size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[#0F172A] text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{item.description}</p>
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

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-0">
          <Tabs 
            value={activeSubTabs.milestones} 
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, milestones: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Hành trình & phát triển</h2>
                  <p className="text-gray-600 mt-1">Cấu hình Hành trình & phát triển</p>
                </div>
                <Button onClick={handleSaveMilestones} disabled={loadingMilestones}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingMilestones ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Header</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="pb-2">Tiêu đề</Label>
                    <Input
                      value={milestonesData.headerTitle}
                      onChange={(e) => setMilestonesData({ ...milestonesData, headerTitle: e.target.value })}
                      placeholder="Hành trình phát triển"
                    />
                  </div>
                  <div>
                    <Label className="pb-2">Mô tả</Label>
                    <Textarea
                      value={milestonesData.headerDescription}
                      onChange={(e) => setMilestonesData({ ...milestonesData, headerDescription: e.target.value })}
                      placeholder="Mô tả..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="pb-2">Kích hoạt</Label>
                    <Switch
                      checked={milestonesData.isActive}
                      onCheckedChange={async (checked) => {
                        // If milestonesData is empty, fetch existing data first to preserve it
                        if (!milestonesData.headerTitle && !milestonesData.headerDescription && milestonesData.items.length === 0) {
                          try {
                            const data = await adminApiCall<{ success: boolean; data?: any }>(
                              AdminEndpoints.about.milestones.get,
                            );
                            if (data?.data) {
                              setMilestonesData({
                                ...data.data,
                                isActive: checked,
                              });
                            } else {
                              setMilestonesData({ ...milestonesData, isActive: checked });
                            }
                          } catch (error) {
                            toast.error("Không thể tải milestones để cập nhật trạng thái.");
                            setMilestonesData({ ...milestonesData, isActive: checked });
                          }
                        } else {
                          setMilestonesData({ ...milestonesData, isActive: checked });
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
                    <CardTitle>Milestones Items ({milestonesData.items.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleAddMilestone}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Milestone
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestonesData.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có milestone nào. Nhấn "Thêm Milestone" để thêm.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {milestonesData.items
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((item, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#2CA4E0] rounded-full flex items-center justify-center text-white text-xl font-bold">
                                      {item.icon || "🚀"}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#2CA4E0]">{item.year}</span>
                                        <h4 className="font-semibold">{item.title || "Chưa có tiêu đề"}</h4>
                                      </div>
                                      <p className="text-sm text-gray-600 line-clamp-1">
                                        {item.description || "Chưa có mô tả"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveMilestoneUp(index)}
                                    disabled={index === 0}
                                    title="Di chuyển lên"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveMilestoneDown(index)}
                                    disabled={index === milestonesData.items.length - 1}
                                    title="Di chuyển xuống"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditMilestone(index)}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveMilestone(index)}
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

              {/* Dialog Milestone Form */}
              <Dialog open={editingMilestoneIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancelMilestone();
                }
              }}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMilestoneIndex === -1 ? "Thêm Milestone mới" : "Chỉnh sửa Milestone"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingMilestoneIndex === -1
                        ? "Điền thông tin để tạo milestone mới"
                        : "Cập nhật thông tin milestone"}
                    </DialogDescription>
                  </DialogHeader>
                  {milestoneFormData && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="pb-2">Năm</Label>
                          <Input
                            value={milestoneFormData.year || ""}
                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, year: e.target.value })}
                            placeholder="2017"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Biểu tượng (Emoji)</Label>
                          <Input
                            value={milestoneFormData.icon || "🚀"}
                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, icon: e.target.value })}
                            placeholder="🚀"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Tiêu đề</Label>
                          <Input
                            value={milestoneFormData.title || ""}
                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, title: e.target.value })}
                            placeholder="Thành lập SFBTECH.,JSC"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Mô tả</Label>
                          <Textarea
                            value={milestoneFormData.description || ""}
                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, description: e.target.value })}
                            placeholder="Mô tả..."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={milestoneFormData.isActive !== undefined ? milestoneFormData.isActive : true}
                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, isActive: e.target.checked })}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Hiển thị</label>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelMilestone}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveMilestone}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Hành trình & phát triển</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-20 bg-[#F8FBFE] rounded-lg overflow-hidden">
                    <div className="max-w-[1340px] mx-auto px-6">
                      {/* Header */}
                      <div className="text-center mb-24 max-w-4xl mx-auto">
                        {milestonesData.headerTitle && (
                          <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                            {milestonesData.headerTitle}
                          </h2>
                        )}
                        {milestonesData.headerDescription && (
                          <p className="text-gray-600 md:text-lg leading-relaxed max-w-2xl mx-auto">
                            {milestonesData.headerDescription}
                          </p>
                        )}
                      </div>

                      {/* Timeline */}
                      <div className="max-w-5xl mx-auto relative">
                        <div className="space-y-12">
                          {milestonesData.items
                            .filter(item => item.isActive)
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((item, index) => {
                              const isLeft = index % 2 === 0;
                              return (
                                <div key={index} className="relative flex flex-col lg:flex-row items-center justify-center">
                                  {/* Mobile Year Badge */}
                                  <div className="lg:hidden mb-6 bg-[#2CA4E0] text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg">
                                    {item.year}
                                  </div>

                                  {/* Content Card */}
                                  <div className={`flex-1 w-full lg:w-auto flex ${isLeft ? 'justify-end lg:pr-40' : 'justify-start lg:pl-40 order-last'}`}>
                                    <div className="bg-white rounded-[24px] p-8 shadow-sm max-w-lg w-full border border-transparent hover:border-blue-100">
                                      <div className="w-10 h-10 mb-4 text-[#2CA4E0] text-2xl">
                                        {item.icon}
                                      </div>
                                      {item.year && (
                                        <div className="mb-2">
                                          <span className="text-[#2CA4E0] font-bold text-lg">{item.year}</span>
                                        </div>
                                      )}
                                      <h3 className="text-[#0F172A] font-bold text-lg mb-3">{item.title}</h3>
                                      <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                  </div>

                                  {/* Center Year Badge (Desktop) */}
                                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20 flex-col">
                                    <div className="bg-[#2CA4E0] text-white px-8 py-3 rounded-full text-2xl font-normal shadow-md whitespace-nowrap border-[4px] border-[#F8FBFE]">
                                      {item.year}
                                    </div>
                                    {index < milestonesData.items.filter(i => i.isActive).length - 1 && (
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-[220px] z-10 bg-[#E2E8F0]" />
                                    )}
                                  </div>

                                  {/* Spacer */}
                                  <div className={`flex-1 hidden lg:block ${isLeft ? 'pl-40' : 'pr-40'}`}></div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Leadership Tab */}
        <TabsContent value="leadership" className="space-y-0">
          <Tabs 
            value={activeSubTabs.leadership} 
            onValueChange={(value) => setActiveSubTabs({ ...activeSubTabs, leadership: value })}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ban lãnh đạo</h2>
                  <p className="text-gray-600 mt-1">Cấu hình ban lãnh đạo</p>
                </div>
                <Button onClick={handleSaveLeadership} disabled={loadingLeadership}>
                  <Save className="h-4 w-4 mr-2" />
                  {loadingLeadership ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Header</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="pb-2">Tiêu đề</Label>
                    <Input
                      value={leadershipData.headerTitle}
                      onChange={(e) => setLeadershipData({ ...leadershipData, headerTitle: e.target.value })}
                      placeholder="Ban lãnh đạo"
                    />
                  </div>
                  <div>
                    <Label className="pb-2">Mô tả</Label>
                    <Textarea
                      value={leadershipData.headerDescription}
                      onChange={(e) => setLeadershipData({ ...leadershipData, headerDescription: e.target.value })}
                      placeholder="Mô tả..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="pb-2">Kích hoạt</Label>
                    <Switch
                      checked={leadershipData.isActive}
                      onCheckedChange={async (checked) => {
                        // If leadershipData is empty, fetch existing data first to preserve it
                        if (!leadershipData.headerTitle && !leadershipData.headerDescription && leadershipData.items.length === 0) {
                          try {
                            const data = await adminApiCall<{ success: boolean; data?: any }>(
                              AdminEndpoints.about.leadership.get,
                            );
                            if (data?.data) {
                              setLeadershipData({
                                ...data.data,
                                isActive: checked,
                              });
                            } else {
                              setLeadershipData({ ...leadershipData, isActive: checked });
                            }
                          } catch (error) {
                            toast.error("Không thể tải leadership để cập nhật trạng thái.");
                            setLeadershipData({ ...leadershipData, isActive: checked });
                          }
                        } else {
                          setLeadershipData({ ...leadershipData, isActive: checked });
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
                    <CardTitle>Leadership Items ({leadershipData.items.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleAddLeader}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Leader
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leadershipData.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có leader nào. Nhấn "Thêm Leader" để thêm.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {leadershipData.items
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((item, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    {item.image && (
                                      <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <h4 className="font-semibold">{item.name || "Chưa có tên"}</h4>
                                      <p className="text-sm text-gray-600">{item.position || "Chưa có chức vụ"}</p>
                                      <p className="text-xs text-gray-500">{item.email || ""}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveLeaderUp(index)}
                                    disabled={index === 0}
                                    title="Di chuyển lên"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveLeaderDown(index)}
                                    disabled={index === leadershipData.items.length - 1}
                                    title="Di chuyển xuống"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditLeader(index)}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveLeader(index)}
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

              {/* Dialog Leader Form */}
              <Dialog open={editingLeaderIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  handleCancelLeader();
                }
              }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLeaderIndex === -1 ? "Thêm Leader mới" : "Chỉnh sửa Leader"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingLeaderIndex === -1
                        ? "Điền thông tin để tạo leader mới"
                        : "Cập nhật thông tin leader"}
                    </DialogDescription>
                  </DialogHeader>
                  {leaderFormData && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="pb-2">Tên *</Label>
                          <Input
                            value={leaderFormData.name || ""}
                            onChange={(e) => setLeaderFormData({ ...leaderFormData, name: e.target.value })}
                            placeholder="Nguyễn Văn A"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Chức vụ *</Label>
                          <Input
                            value={leaderFormData.position || ""}
                            onChange={(e) => setLeaderFormData({ ...leaderFormData, position: e.target.value })}
                            placeholder="GIÁM ĐỐC CÔNG NGHỆ"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Thư điện tử</Label>
                          <Input
                            value={leaderFormData.email || ""}
                            onChange={(e) => setLeaderFormData({ ...leaderFormData, email: e.target.value })}
                            placeholder="email@sfb.vn"
                          />
                        </div>
                        <div>
                          <Label className="pb-2">Số điện thoại</Label>
                          <Input
                            value={leaderFormData.phone || ""}
                            onChange={(e) => setLeaderFormData({ ...leaderFormData, phone: e.target.value })}
                            placeholder="0888 917 999"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Mô tả</Label>
                          <Textarea
                            value={leaderFormData.description || ""}
                            onChange={(e) => setLeaderFormData({ ...leaderFormData, description: e.target.value })}
                            placeholder="Mô tả..."
                            rows={3}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="pb-2">Ảnh</Label>
                          <ImageUpload
                            currentImage={leaderFormData.image || ""}
                            onImageSelect={(url) => setLeaderFormData({ ...leaderFormData, image: url })}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={leaderFormData.isActive !== undefined ? leaderFormData.isActive : true}
                            onChange={(e) => setLeaderFormData({ ...leaderFormData, isActive: e.target.checked })}
                            className="rounded"
                          />
                          <label className="text-sm font-medium">Hiển thị</label>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelLeader}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveLeader}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview - Ban lãnh đạo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-20 bg-white rounded-lg">
                    <div className="max-w-[1340px] mx-auto px-6">
                      {/* Header */}
                      <div className="text-center mb-16 max-w-4xl mx-auto">
                        {leadershipData.headerTitle && (
                          <h2 className="text-[#0F172A] text-3xl md:text-5xl font-bold mb-4">
                            {leadershipData.headerTitle}
                          </h2>
                        )}
                        {leadershipData.headerDescription && (
                          <p className="text-gray-600 md:text-lg leading-relaxed max-w-3xl mx-auto">
                            {leadershipData.headerDescription}
                          </p>
                        )}
                      </div>

                      {/* Grid */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leadershipData.items
                          .filter(item => item.isActive)
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((leader, idx) => (
                            <div
                              key={idx}
                              className="group h-full bg-[#f9fafb] rounded-[16px] overflow-hidden hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 flex flex-col items-center p-8 text-center border border-transparent hover:border-blue-200"
                            >
                              {leader.image && (
                                <div className="mb-6 relative w-48 h-48 flex-shrink-0">
                                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-blue-100 transition-colors">
                                    <img
                                      src={leader.image}
                                      alt={leader.name}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                  </div>
                                </div>
                              )}
                              <h3 className="text-[#0F172A] text-xl font-bold mb-1">{leader.name}</h3>
                              <div className="text-[#2CA4E0] font-semibold text-sm uppercase mb-4 tracking-wider">
                                {leader.position}
                              </div>
                              {leader.description && (
                                <p className="text-gray-500 text-xs leading-relaxed mb-6 max-w-xs mx-auto flex-grow">
                                  {leader.description}
                                </p>
                              )}
                              <div className="mt-auto flex items-center justify-center gap-6 w-full pt-4 border-t border-gray-100 group-hover:border-blue-100">
                                {leader.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-[#2CA4E0]" />
                                    <span className="text-[#334155] text-xs font-medium">{leader.phone}</span>
                                  </div>
                                )}
                                {leader.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-[#2CA4E0]" />
                                    <span className="text-[#334155] text-xs font-medium">{leader.email}</span>
                                  </div>
                                )}
                              </div>
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
      </Tabs>
    </div>
  );
}

