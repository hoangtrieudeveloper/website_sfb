"use client";
import { useState, useEffect } from "react";
import { Save, MessageCircle, MapPin, Phone, Mail, Clock, Facebook, Linkedin, Twitter, Youtube, CheckCircle2, ChevronDown, ChevronUp, Languages, Loader2, Sparkles, Trash2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactHero } from "@/pages/Contact/ContactHero";
import { ContactInfoCards } from "@/pages/Contact/ContactInfoCards";
import { ContactForm } from "@/pages/Contact/ContactForm";
import { ContactSidebar } from "@/pages/Contact/ContactSidebar";
import { ContactMap } from "@/pages/Contact/ContactMap";
// Interfaces
interface HeroData {
  id?: number;
  badge: string | Record<Locale, string>;
  title: {
    prefix: string | Record<Locale, string>;
    highlight: string | Record<Locale, string>;
  };
  description: string | Record<Locale, string>;
  iconName: string;
  image: string;
  isActive: boolean;
}

interface InfoCardItem {
  id?: number;
  iconName: string;
  title: string | Record<Locale, string>;
  content: string | Record<Locale, string>;
  link: string | null;
  gradient: string;
  sortOrder: number;
  isActive: boolean;
}

interface InfoCardsData {
  id?: number;
  items: InfoCardItem[];
  isActive: boolean;
}

interface FormData {
  id?: number;
  header: string | Record<Locale, string>;
  description: string | Record<Locale, string>;
  fields: {
    name: { label: string | Record<Locale, string>; placeholder: string | Record<Locale, string> };
    email: { label: string | Record<Locale, string>; placeholder: string | Record<Locale, string> };
    phone: { label: string | Record<Locale, string>; placeholder: string | Record<Locale, string> };
    company: { label: string | Record<Locale, string>; placeholder: string | Record<Locale, string> };
    service: { label: string | Record<Locale, string>; placeholder: string | Record<Locale, string> };
    message: { label: string | Record<Locale, string>; placeholder: string | Record<Locale, string> };
  };
  button: {
    submit: string | Record<Locale, string>;
    success: string | Record<Locale, string>;
  };
  services: (string | Record<Locale, string>)[];
  isActive: boolean;
}

interface OfficeItem {
  id?: number;
  title?: string | Record<Locale, string>;
  city: string | Record<Locale, string>;
  address: string | Record<Locale, string>;
  phone: string;
  email: string;
  sortOrder: number;
  isActive: boolean;
}

interface SocialItem {
  id?: number;
  iconName: string;
  href: string;
  label: string | Record<Locale, string>;
  gradient: string;
  sortOrder: number;
  isActive: boolean;
}

interface SidebarData {
  id?: number;
  quickActions: {
    title: string | Record<Locale, string>;
    description: string | Record<Locale, string>;
    buttons: {
      hotline: { label: string | Record<Locale, string>; value: string; href: string };
      appointment: { label: string | Record<Locale, string>; value: string | Record<Locale, string>; href: string };
    };
  };
  offices: OfficeItem[];
  officesTitle?: string | Record<Locale, string>;
  socials: SocialItem[];
  isActive: boolean;
}

interface MapData {
  id?: number;
  address: string | Record<Locale, string>;
  iframeSrc: string;
  isActive: boolean;
}

// Icon options
const ICON_OPTIONS = [
  "MessageCircle", "MapPin", "Phone", "Mail", "Clock",
  "Facebook", "Linkedin", "Twitter", "Youtube",
  "Code2", "MonitorSmartphone", "Network", "Globe2",
  "ShieldCheck", "Users", "Award", "Target", "Sparkles",
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

export default function AdminContactPage() {
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

  // Hero State
  const [heroData, setHeroData] = useState<HeroData>({
    badge: "",
    title: { prefix: "", highlight: "" },
    description: "",
    iconName: "MessageCircle",
    image: "",
    isActive: true,
  });
  const [loadingHero, setLoadingHero] = useState(false);

  // Info Cards State
  const [infoCardsData, setInfoCardsData] = useState<InfoCardsData>({
    items: [],
    isActive: true,
  });
  const [loadingInfoCards, setLoadingInfoCards] = useState(false);
  const [editingInfoCardIndex, setEditingInfoCardIndex] = useState<number | null>(null);
  const [infoCardFormData, setInfoCardFormData] = useState<InfoCardItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<FormData>({
    header: "",
    description: "",
    fields: {
      name: { label: "", placeholder: "" },
      email: { label: "", placeholder: "" },
      phone: { label: "", placeholder: "" },
      company: { label: "", placeholder: "" },
      service: { label: "", placeholder: "" },
      message: { label: "", placeholder: "" },
    },
    button: { submit: "", success: "" },
    services: [],
    isActive: true,
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [newService, setNewService] = useState<Record<Locale, string>>({ vi: "", en: "", ja: "" });

  // Sidebar State
  const [sidebarData, setSidebarData] = useState<SidebarData>({
    quickActions: {
      title: "",
      description: "",
      buttons: {
        hotline: { label: "", value: "", href: "" },
        appointment: { label: "", value: "", href: "" },
      },
    },
    offices: [],
    officesTitle: "",
    socials: [],
    isActive: true,
  });
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [editingOfficeIndex, setEditingOfficeIndex] = useState<number | null>(null);
  const [officeFormData, setOfficeFormData] = useState<OfficeItem | null>(null);
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);
  const [socialFormData, setSocialFormData] = useState<SocialItem | null>(null);

  // Map State
  const [mapData, setMapData] = useState<MapData>({
    address: { vi: "", en: "", ja: "" },
    iframeSrc: "",
    isActive: true,
  });
  const [loadingMap, setLoadingMap] = useState(false);

  // Fetch functions
  const fetchHero = async () => {
    try {
      setLoadingHero(true);
      const data = await adminApiCall<{ success: boolean; data?: HeroData }>(
        AdminEndpoints.contact.hero.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedHero = migrateObjectToLocale(data.data);
        // Normalize nested title object
        if (normalizedHero.title && typeof normalizedHero.title === 'object' && !Array.isArray(normalizedHero.title)) {
          normalizedHero.title = {
            prefix: migrateObjectToLocale(normalizedHero.title.prefix || ''),
            highlight: migrateObjectToLocale(normalizedHero.title.highlight || '')
          };
        }
        setHeroData(normalizedHero);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải hero");
    } finally {
      setLoadingHero(false);
    }
  };

  const fetchInfoCards = async () => {
    try {
      setLoadingInfoCards(true);
      const data = await adminApiCall<{ success: boolean; data?: InfoCardsData }>(
        AdminEndpoints.contact.infoCards.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedInfoCards = migrateObjectToLocale(data.data);
        // Normalize items
        if (normalizedInfoCards.items && Array.isArray(normalizedInfoCards.items)) {
          normalizedInfoCards.items = normalizedInfoCards.items.map((item: any) => {
            const normalizedItem = migrateObjectToLocale(item);
            // Giữ nguyên iconName, link, gradient, sortOrder, isActive
            return {
              ...normalizedItem,
              iconName: item.iconName || 'MessageCircle',
              link: item.link || null,
              gradient: item.gradient || GRADIENT_OPTIONS[0].value,
              sortOrder: item.sortOrder ?? 0,
              isActive: item.isActive ?? true
            };
          });
        }
        setInfoCardsData(normalizedInfoCards);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải info cards");
    } finally {
      setLoadingInfoCards(false);
    }
  };

  const fetchForm = async () => {
    try {
      setLoadingForm(true);
      const data = await adminApiCall<{ success: boolean; data?: FormData }>(
        AdminEndpoints.contact.form.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedForm = migrateObjectToLocale(data.data);
        // Normalize nested fields object
        if (normalizedForm.fields && typeof normalizedForm.fields === 'object') {
          Object.keys(normalizedForm.fields).forEach((key) => {
            const field = (normalizedForm.fields as any)[key];
            if (field && typeof field === 'object') {
              (normalizedForm.fields as any)[key] = {
                label: migrateObjectToLocale(field.label || ''),
                placeholder: migrateObjectToLocale(field.placeholder || '')
              };
            }
          });
        }
        // Normalize button object
        if (normalizedForm.button && typeof normalizedForm.button === 'object') {
          normalizedForm.button = {
            submit: migrateObjectToLocale(normalizedForm.button.submit || ''),
            success: migrateObjectToLocale(normalizedForm.button.success || '')
          };
        }
        // Normalize services array
        if (normalizedForm.services && Array.isArray(normalizedForm.services)) {
          normalizedForm.services = normalizedForm.services.map((service: any) => migrateObjectToLocale(service));
        }
        setFormData(normalizedForm);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải form");
    } finally {
      setLoadingForm(false);
    }
  };

  const fetchSidebar = async () => {
    try {
      setLoadingSidebar(true);
      const data = await adminApiCall<{ success: boolean; data?: SidebarData }>(
        AdminEndpoints.contact.sidebar.get,
      );
      if (data?.data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedSidebar = migrateObjectToLocale(data.data);
        // Normalize nested quickActions object
        if (normalizedSidebar.quickActions && typeof normalizedSidebar.quickActions === 'object') {
          normalizedSidebar.quickActions = {
            title: migrateObjectToLocale(normalizedSidebar.quickActions.title || ''),
            description: migrateObjectToLocale(normalizedSidebar.quickActions.description || ''),
            buttons: {
              hotline: {
                label: migrateObjectToLocale((normalizedSidebar.quickActions.buttons?.hotline?.label || '')),
                value: (normalizedSidebar.quickActions.buttons?.hotline?.value || ''),
                href: (normalizedSidebar.quickActions.buttons?.hotline?.href || '')
              },
              appointment: {
                label: migrateObjectToLocale((normalizedSidebar.quickActions.buttons?.appointment?.label || '')),
                value: migrateObjectToLocale((normalizedSidebar.quickActions.buttons?.appointment?.value || '')),
                href: (normalizedSidebar.quickActions.buttons?.appointment?.href || '')
              }
            }
          };
        }
        // Normalize offices và socials - city và address hỗ trợ locale, phone và email giữ nguyên string
        if (normalizedSidebar.offices && Array.isArray(normalizedSidebar.offices)) {
          normalizedSidebar.offices = normalizedSidebar.offices.map((office: any) => {
            // Đảm bảo phone và email là string
            const getStringValue = (value: any): string => {
              if (typeof value === 'string') return value;
              if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                if ('vi' in value || 'en' in value || 'ja' in value) {
                  return (value as any).vi || (value as any).en || (value as any).ja || '';
                }
              }
              return '';
            };
            return {
              ...office,
              title: office.title ? migrateObjectToLocale(office.title) : undefined,
              city: migrateObjectToLocale(office.city || ''),
              address: migrateObjectToLocale(office.address || ''),
              phone: getStringValue(office.phone),
              email: getStringValue(office.email),
              sortOrder: office.sortOrder ?? 0,
              isActive: office.isActive ?? true
            };
          });
        }
        if (normalizedSidebar.socials && Array.isArray(normalizedSidebar.socials)) {
          normalizedSidebar.socials = normalizedSidebar.socials.map((social: any) => {
            // Đảm bảo label là locale object (có thể dịch), nhưng iconName, href, gradient là string
            const normalizedSocial = migrateObjectToLocale(social);
            // Đảm bảo label là locale object nếu chưa phải
            const label = typeof normalizedSocial.label === 'object' && !Array.isArray(normalizedSocial.label) && ('vi' in normalizedSocial.label || 'en' in normalizedSocial.label || 'ja' in normalizedSocial.label)
              ? normalizedSocial.label
              : migrateObjectToLocale(normalizedSocial.label || '');
            return {
              ...normalizedSocial,
              label,
              iconName: typeof social.iconName === 'string' ? social.iconName : (social.iconName || 'Facebook'),
              href: typeof social.href === 'string' ? social.href : (social.href || ''),
              gradient: typeof social.gradient === 'string' ? social.gradient : (social.gradient || GRADIENT_OPTIONS[0].value),
              sortOrder: social.sortOrder ?? 0,
              isActive: social.isActive ?? true
            };
          });
        }
        setSidebarData(normalizedSidebar);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải sidebar");
    } finally {
      setLoadingSidebar(false);
    }
  };

  const fetchMap = async () => {
    try {
      setLoadingMap(true);
      const data = await adminApiCall<{ success: boolean; data?: MapData }>(
        AdminEndpoints.contact.map.get,
      );
      if (data?.data) {
        // Normalize address để đảm bảo luôn là locale object
        const normalizedMap = {
          ...data.data,
          address: migrateObjectToLocale(data.data.address || '')
        };
        setMapData(normalizedMap);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải map");
    } finally {
      setLoadingMap(false);
    }
  };

  useEffect(() => {
    void fetchHero();
    void fetchInfoCards();
    void fetchForm();
    void fetchSidebar();
    void fetchMap();
  }, []);

  // Collapse state for config blocks (default: all hidden)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({
    heroSection: true,
    infoCards: true,
    contactForm: true,
    sidebar: true,
    mapSection: true,
  });

  const toggleBlock = (blockKey: string) => {
    setCollapsedBlocks(prev => ({
      ...prev,
      [blockKey]: !prev[blockKey]
    }));
  };

  // Save handlers
  const handleSaveHero = async () => {
    try {
      setLoadingHero(true);
      await adminApiCall(AdminEndpoints.contact.hero.update, {
        method: "PUT",
        body: JSON.stringify(heroData),
      });
      toast.success("Đã lưu hero thành công");
      void fetchHero();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu hero");
    } finally {
      setLoadingHero(false);
    }
  };

  const handleSaveInfoCards = async () => {
    try {
      setLoadingInfoCards(true);
      await adminApiCall(AdminEndpoints.contact.infoCards.update, {
        method: "PUT",
        body: JSON.stringify(infoCardsData),
      });
      toast.success("Đã lưu info cards thành công");
      void fetchInfoCards();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu info cards");
    } finally {
      setLoadingInfoCards(false);
    }
  };

  const handleSaveForm = async () => {
    try {
      setLoadingForm(true);
      await adminApiCall(AdminEndpoints.contact.form.update, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      toast.success("Đã lưu form thành công");
      void fetchForm();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu form");
    } finally {
      setLoadingForm(false);
    }
  };

  const handleSaveSidebar = async () => {
    try {
      setLoadingSidebar(true);
      await adminApiCall(AdminEndpoints.contact.sidebar.update, {
        method: "PUT",
        body: JSON.stringify(sidebarData),
      });
      toast.success("Đã lưu sidebar thành công");
      void fetchSidebar();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu sidebar");
    } finally {
      setLoadingSidebar(false);
    }
  };

  const handleSaveMap = async () => {
    try {
      setLoadingMap(true);
      await adminApiCall(AdminEndpoints.contact.map.update, {
        method: "PUT",
        body: JSON.stringify(mapData),
      });
      toast.success("Đã lưu map thành công");
      void fetchMap();
    } catch (error: any) {
      toast.error(error?.message || "Không thể lưu map");
    } finally {
      setLoadingMap(false);
    }
  };

  // Info Card handlers
  const handleAddInfoCard = () => {
    const newItem: InfoCardItem = {
      iconName: "MapPin",
      title: "",
      content: "",
      link: null,
      gradient: GRADIENT_OPTIONS[0].value,
      sortOrder: infoCardsData.items.length,
      isActive: true,
    };
    setInfoCardsData({
      ...infoCardsData,
      items: [...infoCardsData.items, newItem],
    });
    setEditingInfoCardIndex(infoCardsData.items.length);
    setInfoCardFormData(newItem);
  };

  const handleEditInfoCard = (index: number) => {
    setEditingInfoCardIndex(index);
    setInfoCardFormData(infoCardsData.items[index]);
  };

  const handleSaveInfoCard = () => {
    if (!infoCardFormData || editingInfoCardIndex === null) return;
    const newItems = [...infoCardsData.items];
    newItems[editingInfoCardIndex] = infoCardFormData;
    setInfoCardsData({ ...infoCardsData, items: newItems });
    setEditingInfoCardIndex(null);
    setInfoCardFormData(null);
  };

  const handleDeleteInfoCard = (index: number) => {
    const newItems = infoCardsData.items.filter((_, i) => i !== index);
    setInfoCardsData({ ...infoCardsData, items: newItems });
  };

  // Office handlers
  const handleAddOffice = () => {
    const newItem: OfficeItem = {
      title: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      sortOrder: sidebarData.offices.length,
      isActive: true,
    };
    setSidebarData({
      ...sidebarData,
      offices: [...sidebarData.offices, newItem],
    });
    setEditingOfficeIndex(sidebarData.offices.length);
    setOfficeFormData(newItem);
  };

  const handleEditOffice = (index: number) => {
    setEditingOfficeIndex(index);
    setOfficeFormData(sidebarData.offices[index]);
  };

  const handleSaveOffice = () => {
    if (!officeFormData || editingOfficeIndex === null) return;
    const newOffices = [...sidebarData.offices];
    newOffices[editingOfficeIndex] = officeFormData;
    setSidebarData({ ...sidebarData, offices: newOffices });
    setEditingOfficeIndex(null);
    setOfficeFormData(null);
  };

  const handleDeleteOffice = (index: number) => {
    const newOffices = sidebarData.offices.filter((_, i) => i !== index);
    setSidebarData({ ...sidebarData, offices: newOffices });
  };

  // Social handlers
  const handleAddSocial = () => {
    const newItem: SocialItem = {
      iconName: "Facebook",
      href: "",
      label: "",
      gradient: GRADIENT_OPTIONS[0].value,
      sortOrder: sidebarData.socials.length,
      isActive: true,
    };
    setSidebarData({
      ...sidebarData,
      socials: [...sidebarData.socials, newItem],
    });
    setEditingSocialIndex(sidebarData.socials.length);
    setSocialFormData(newItem);
  };

  const handleEditSocial = (index: number) => {
    setEditingSocialIndex(index);
    setSocialFormData(sidebarData.socials[index]);
  };

  const handleSaveSocial = () => {
    if (!socialFormData || editingSocialIndex === null) return;
    const newSocials = [...sidebarData.socials];
    newSocials[editingSocialIndex] = socialFormData;
    setSidebarData({ ...sidebarData, socials: newSocials });
    setEditingSocialIndex(null);
    setSocialFormData(null);
  };

  const handleDeleteSocial = (index: number) => {
    const newSocials = sidebarData.socials.filter((_, i) => i !== index);
    setSidebarData({ ...sidebarData, socials: newSocials });
  };

  // Form service handlers
  const handleAddService = () => {
    // Kiểm tra xem có giá trị ở locale hiện tại hoặc bất kỳ locale nào không
    let serviceText = '';
    if (typeof newService === 'string') {
      serviceText = newService;
    } else if (newService && typeof newService === 'object' && !Array.isArray(newService)) {
      // Nếu là locale object
      if ('vi' in newService || 'en' in newService || 'ja' in newService) {
        const text = getLocalizedText(newService, globalLocale);
        serviceText = typeof text === 'string' ? text : String(text || '');
      } else {
        serviceText = String(newService || '');
      }
    } else {
      serviceText = String(newService || '');
    }

    // Đảm bảo serviceText là string trước khi gọi trim
    serviceText = String(serviceText || '');

    if (serviceText && serviceText.trim()) {
      setFormData({
        ...formData,
        services: [...formData.services, { ...newService }],
      });
      setNewService({ vi: "", en: "", ja: "" });
    } else {
      toast.error("Vui lòng nhập tên dịch vụ");
    }
  };

  const handleDeleteService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };

  // Translation handlers for sections
  const handleTranslateSection = async (section: 'hero' | 'info-cards' | 'form' | 'sidebar') => {
    let dataToTranslate: any;
    let updateCallback: (translatedData: any) => void;
    let sectionName: string;

    // Prepare data and update callback based on section
    if (section === 'hero') {
      // Loại bỏ các trường không cần dịch: iconName, image, isActive
      const { iconName, image, isActive, ...dataToTranslateFields } = heroData;
      // Normalize title object
      const titleToTranslate = {
        prefix: dataToTranslateFields.title?.prefix || '',
        highlight: dataToTranslateFields.title?.highlight || ''
      };
      dataToTranslate = {
        ...dataToTranslateFields,
        title: titleToTranslate
      };
      updateCallback = (translated: any) => {
        setHeroData({
          ...translated,
          iconName,
          image,
          isActive,
        });
      };
      sectionName = 'Hero Banner';
    } else if (section === 'info-cards') {
      // Loại bỏ các trường không cần dịch: iconName, link, gradient, sortOrder, isActive từ items
      const { items, ...dataToTranslateFields } = infoCardsData;
      const translatedItems = items.map((item: any) => {
        const { iconName, link, gradient, sortOrder, isActive, ...itemFields } = item;
        return itemFields;
      });
      dataToTranslate = {
        ...dataToTranslateFields,
        items: translatedItems
      };
      updateCallback = (translated: any) => {
        // Giữ nguyên iconName, link, gradient, sortOrder, isActive của items
        const updatedItems = translated.items.map((item: any, index: number) => ({
          ...item,
          iconName: items[index]?.iconName || 'MessageCircle',
          link: items[index]?.link || null,
          gradient: items[index]?.gradient || GRADIENT_OPTIONS[0].value,
          sortOrder: items[index]?.sortOrder ?? index,
          isActive: items[index]?.isActive ?? true
        }));
        setInfoCardsData({
          ...translated,
          items: updatedItems
        });
      };
      sectionName = 'Info Cards';
    } else if (section === 'form') {
      // Loại bỏ các trường không cần dịch: services (services là array of strings), isActive
      const { services, isActive, ...dataToTranslateFields } = formData;
      dataToTranslate = dataToTranslateFields;
      updateCallback = (translated: any) => {
        setFormData({
          ...translated,
          services,
          isActive
        });
      };
      sectionName = 'Contact Form';
    } else if (section === 'sidebar') {
      // Loại bỏ các trường không cần dịch: offices (offices không có field cần dịch), socials (socials có iconName, href, gradient), isActive
      // Loại bỏ value và href từ quickActions.buttons
      const { offices, socials, isActive, quickActions, ...dataToTranslateFields } = sidebarData;
      const translatedQuickActions = {
        title: quickActions?.title || '',
        description: quickActions?.description || '',
        buttons: {
          hotline: {
            label: quickActions?.buttons?.hotline?.label || ''
            // value và href không được dịch, sẽ được giữ nguyên
          },
          appointment: {
            label: quickActions?.buttons?.appointment?.label || '',
            value: quickActions?.buttons?.appointment?.value || ''
            // href không được dịch, sẽ được giữ nguyên
          }
        }
      };
      const translatedSocials = socials.map((social: any) => {
        const { iconName, href, gradient, sortOrder, isActive: socialIsActive, ...socialFields } = social;
        return socialFields;
      });
      dataToTranslate = {
        ...dataToTranslateFields,
        quickActions: translatedQuickActions,
        socials: translatedSocials
      };
      updateCallback = (translated: any) => {
        // Giữ nguyên value và href của quickActions.buttons
        const updatedQuickActions = {
          ...translated.quickActions,
          buttons: {
            hotline: {
              ...translated.quickActions.buttons.hotline,
              value: quickActions?.buttons?.hotline?.value || '',
              href: quickActions?.buttons?.hotline?.href || ''
            },
            appointment: {
              ...translated.quickActions.buttons.appointment,
              href: quickActions?.buttons?.appointment?.href || ''
            }
          }
        };
        // Giữ nguyên iconName, href, gradient, sortOrder, isActive của socials
        const updatedSocials = translated.socials.map((social: any, index: number) => ({
          ...social,
          iconName: socials[index]?.iconName || 'Facebook',
          href: socials[index]?.href || '',
          gradient: socials[index]?.gradient || GRADIENT_OPTIONS[0].value,
          sortOrder: socials[index]?.sortOrder ?? index,
          isActive: socials[index]?.isActive ?? true
        }));
        setSidebarData({
          ...translated,
          quickActions: updatedQuickActions,
          offices,
          socials: updatedSocials,
          isActive
        });
      };
      sectionName = 'Sidebar';
    } else {
      return;
    }

    // Use translateData from hook
    await translateData(dataToTranslate, updateCallback, sectionName);
  };

  // Active main tab state
  const [activeMainTab, setActiveMainTab] = useState<string>("hero");

  // Tab configuration with descriptions
  const tabsConfig = [
    {
      value: "hero",
      label: "Hero",
      description: "Banner đầu trang với tiêu đề..",
      icon: MessageCircle,
    },
    {
      value: "info-cards",
      label: "Info Cards",
      description: "Thẻ thông tin liên hệ",
      icon: MapPin,
    },
    {
      value: "form",
      label: "Form",
      description: "Biểu mẫu liên hệ",
      icon: Mail,
    },
    {
      value: "sidebar",
      label: "Sidebar",
      description: "Thanh bên với văn phòng..",
      icon: Phone,
    },
    {
      value: "map",
      label: "Map",
      description: "Bản đồ và địa chỉ",
      icon: MapPin,
    },
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveMainTab(value);
  };

  // Transform data for preview
  const getPreviewData = () => {
    const Icon = (LucideIcons as any)[heroData.iconName] || MessageCircle;
    return {
      hero: {
        ...heroData,
        badge: getLocalizedText(heroData.badge, globalLocale),
        title: {
          prefix: getLocalizedText(heroData.title.prefix, globalLocale),
          highlight: getLocalizedText(heroData.title.highlight, globalLocale),
        },
        description: getLocalizedText(heroData.description, globalLocale),
        icon: Icon,
      },
      infoCards: infoCardsData.items
        .filter(item => item.isActive)
        .map(item => ({
          ...item,
          title: getLocalizedText(item.title, globalLocale),
          content: getLocalizedText(item.content, globalLocale),
          icon: (LucideIcons as any)[item.iconName] || MapPin,
        })),
      form: {
        ...formData,
        header: getLocalizedText(formData.header, globalLocale),
        description: getLocalizedText(formData.description, globalLocale),
        fields: {
          name: {
            label: getLocalizedText(formData.fields.name.label, globalLocale),
            placeholder: getLocalizedText(formData.fields.name.placeholder, globalLocale),
          },
          email: {
            label: getLocalizedText(formData.fields.email.label, globalLocale),
            placeholder: getLocalizedText(formData.fields.email.placeholder, globalLocale),
          },
          phone: {
            label: getLocalizedText(formData.fields.phone.label, globalLocale),
            placeholder: getLocalizedText(formData.fields.phone.placeholder, globalLocale),
          },
          company: {
            label: getLocalizedText(formData.fields.company.label, globalLocale),
            placeholder: getLocalizedText(formData.fields.company.placeholder, globalLocale),
          },
          service: {
            label: getLocalizedText(formData.fields.service.label, globalLocale),
            placeholder: getLocalizedText(formData.fields.service.placeholder, globalLocale),
          },
          message: {
            label: getLocalizedText(formData.fields.message.label, globalLocale),
            placeholder: getLocalizedText(formData.fields.message.placeholder, globalLocale),
          },
        },
        button: {
          submit: getLocalizedText(formData.button.submit, globalLocale),
          success: getLocalizedText(formData.button.success, globalLocale),
        },
        services: formData.services.map(service => getLocalizedText(service, globalLocale)),
      },
      sidebar: {
        ...sidebarData,
        quickActions: {
          title: getLocalizedText(sidebarData.quickActions.title, globalLocale),
          description: getLocalizedText(sidebarData.quickActions.description, globalLocale),
          buttons: {
            hotline: {
              label: getLocalizedText(sidebarData.quickActions.buttons.hotline.label, globalLocale),
              value: sidebarData.quickActions.buttons.hotline.value,
              href: sidebarData.quickActions.buttons.hotline.href,
            },
            appointment: {
              label: getLocalizedText(sidebarData.quickActions.buttons.appointment.label, globalLocale),
              value: typeof sidebarData.quickActions.buttons.appointment.value === 'string'
                ? sidebarData.quickActions.buttons.appointment.value
                : getLocalizedText(sidebarData.quickActions.buttons.appointment.value, globalLocale),
              href: sidebarData.quickActions.buttons.appointment.href,
            },
          },
        },
        offices: sidebarData.offices
          .filter((item: OfficeItem) => item.isActive)
          .map((item: OfficeItem) => ({
            ...item,
            title: item.title ? getLocalizedText(item.title, globalLocale) : undefined,
            city: getLocalizedText(item.city, globalLocale),
            address: getLocalizedText(item.address, globalLocale),
          })),
        socials: sidebarData.socials
          .filter(item => item.isActive)
          .map(item => ({
            ...item,
            label: getLocalizedText(item.label, globalLocale),
            icon: (LucideIcons as any)[item.iconName] || Facebook,
          })),
      },
      map: {
        ...mapData,
        address: getLocalizedText(mapData.address, globalLocale),
      },
    };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý trang Liên hệ</h1>
          <p className="text-gray-600 mt-1">Cấu hình và quản lý nội dung trang liên hệ</p>
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

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-4 mt-4">
          <Tabs defaultValue="config" className="w-full">
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
                          <SelectTrigger className="w-[150px]" suppressHydrationWarning>
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
                          <SelectTrigger className="w-[150px]" suppressHydrationWarning>
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
                      <p className="text-sm text-gray-600 ml-8">Cấu hình phần hero của trang liên hệ</p>
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
                      label="Badge"
                      value={getLocaleValue(heroData, 'badge')}
                      onChange={(value) => {
                        const updated = setLocaleValue(heroData, 'badge', value);
                        setHeroData(updated);
                      }}
                      placeholder="LIÊN HỆ VỚI CHÚNG TÔI"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Title Prefix"
                      value={getLocaleValue(heroData.title, 'prefix')}
                      onChange={(value) => {
                        const updatedTitle = setLocaleValue(heroData.title, 'prefix', value);
                        setHeroData({ ...heroData, title: updatedTitle });
                      }}
                      placeholder="Hãy để chúng tôi"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Title Highlight"
                      value={getLocaleValue(heroData.title, 'highlight')}
                      onChange={(value) => {
                        const updatedTitle = setLocaleValue(heroData.title, 'highlight', value);
                        setHeroData({ ...heroData, title: updatedTitle });
                      }}
                      placeholder="hỗ trợ bạn"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Description"
                      value={getLocaleValue(heroData, 'description')}
                      onChange={(value) => {
                        const updated = setLocaleValue(heroData, 'description', value);
                        setHeroData(updated);
                      }}
                      placeholder="Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7"
                      multiline={true}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <Label>Icon Name</Label>
                    <Select
                      value={heroData.iconName}
                      onValueChange={(value) => setHeroData({ ...heroData, iconName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((icon) => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Image</Label>
                    <ImageUpload
                      currentImage={heroData.image}
                      onImageSelect={(url) => setHeroData({ ...heroData, image: url })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Kích hoạt</Label>
                    <Switch
                      checked={heroData.isActive}
                      onCheckedChange={(checked) => setHeroData({ ...heroData, isActive: checked })}
                    />
                  </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Hero Section</CardTitle>
                </CardHeader>
                <CardContent>
                  {heroData.isActive && (
                    <div className="border rounded-lg p-4">
                      <ContactHero data={getPreviewData().hero} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Info Cards Tab - Continue in next part due to length */}
        <TabsContent value="info-cards" className="space-y-4 mt-4">
          <Tabs defaultValue="config" className="w-full">
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("infoCards")}
                  >
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-1">
                        {collapsedBlocks.infoCards ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )}
                        Info Cards
                      </CardTitle>
                      <p className="text-sm text-gray-600 ml-8">Quản lý các thẻ thông tin liên hệ</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={(e) => { e.stopPropagation(); handleAddInfoCard(); }} size="sm" variant="outline">
                        Thêm Card
                      </Button>
                      <Button onClick={(e) => { e.stopPropagation(); handleSaveInfoCards(); }} disabled={loadingInfoCards} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        {loadingInfoCards ? "Đang lưu..." : "Lưu"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {!collapsedBlocks.infoCards && (
                  <CardContent className="space-y-4 px-6 py-4">
                  {infoCardsData.items.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Card {index + 1}</h4>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditInfoCard(index)}
                              size="sm"
                              variant="outline"
                            >
                              Sửa
                            </Button>
                            <Button
                              onClick={() => handleDeleteInfoCard(index)}
                              size="sm"
                              variant="destructive"
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p><strong>Icon:</strong> {item.iconName}</p>
                          <p><strong>Title:</strong> {getLocalizedText(item.title, globalLocale)}</p>
                          <p><strong>Content:</strong> {getLocalizedText(item.content, globalLocale)}</p>
                          <p><strong>Link:</strong> {item.link || "N/A"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  </CardContent>
                )}
              </Card>

              {/* Edit Dialog */}
              <Dialog open={editingInfoCardIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  setEditingInfoCardIndex(null);
                  setInfoCardFormData(null);
                }
              }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa Info Card</DialogTitle>
                  </DialogHeader>
                  {infoCardFormData && (
                    <div className="space-y-4">
                      <div>
                        <Label>Icon Name</Label>
                        <Select
                          value={infoCardFormData.iconName}
                          onValueChange={(value) => setInfoCardFormData({ ...infoCardFormData, iconName: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <LocaleInput
                          label="Title"
                          value={getLocaleValue(infoCardFormData, 'title')}
                          onChange={(value) => {
                            const updated = setLocaleValue(infoCardFormData, 'title', value);
                            setInfoCardFormData(updated);
                          }}
                          placeholder="Tiêu đề"
                          defaultLocale={globalLocale}
                          aiProvider={aiProvider}
                        />
                      </div>
                      <div>
                        <LocaleInput
                          label="Content"
                          value={getLocaleValue(infoCardFormData, 'content')}
                          onChange={(value) => {
                            const updated = setLocaleValue(infoCardFormData, 'content', value);
                            setInfoCardFormData(updated);
                          }}
                          placeholder="Nội dung"
                          multiline={true}
                          defaultLocale={globalLocale}
                          aiProvider={aiProvider}
                        />
                      </div>
                      <div>
                        <Label>Link (optional)</Label>
                        <Input
                          value={infoCardFormData.link || ""}
                          onChange={(e) => setInfoCardFormData({ ...infoCardFormData, link: e.target.value || null })}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label>Gradient</Label>
                        <Select
                          value={infoCardFormData.gradient}
                          onValueChange={(value) => setInfoCardFormData({ ...infoCardFormData, gradient: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADIENT_OPTIONS.map((grad) => (
                              <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Kích hoạt</Label>
                        <Switch
                          checked={infoCardFormData.isActive}
                          onCheckedChange={(checked) => setInfoCardFormData({ ...infoCardFormData, isActive: checked })}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingInfoCardIndex(null);
                        setInfoCardFormData(null);
                      }}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleSaveInfoCard}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Info Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  {infoCardsData.isActive && (
                    <div className="border rounded-lg p-4">
                      <ContactInfoCards data={getPreviewData().infoCards} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Form Tab */}
        <TabsContent value="form" className="space-y-4 mt-4">
          <Tabs defaultValue="config" className="w-full">
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
                          <SelectTrigger className="w-[150px]" suppressHydrationWarning>
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
                          <SelectTrigger className="w-[150px]" suppressHydrationWarning>
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
                        onClick={() => handleTranslateSection('form')}
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
                    onClick={() => toggleBlock("contactForm")}
                  >
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-1">
                        {collapsedBlocks.contactForm ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )}
                        Contact Form
                      </CardTitle>
                      <p className="text-sm text-gray-600 ml-8">Cấu hình form liên hệ</p>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); handleSaveForm(); }} disabled={loadingForm} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {loadingForm ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.contactForm && (
                  <CardContent className="space-y-4 px-6 py-4">
                  <div>
                    <LocaleInput
                      label="Header"
                      value={getLocaleValue(formData, 'header')}
                      onChange={(value) => {
                        const updated = setLocaleValue(formData, 'header', value);
                        setFormData(updated);
                      }}
                      placeholder="Gửi yêu cầu tư vấn"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Description"
                      value={getLocaleValue(formData, 'description')}
                      onChange={(value) => {
                        const updated = setLocaleValue(formData, 'description', value);
                        setFormData(updated);
                      }}
                      placeholder="Điền thông tin bên dưới..."
                      multiline={true}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Name Label"
                        value={getLocaleValue(formData.fields.name, 'label')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.name, 'label', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, name: { ...formData.fields.name, label: updatedField.label } },
                          });
                        }}
                        placeholder="Họ và tên"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Name Placeholder"
                        value={getLocaleValue(formData.fields.name, 'placeholder')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.name, 'placeholder', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, name: { ...formData.fields.name, placeholder: updatedField.placeholder } },
                          });
                        }}
                        placeholder="Nhập họ và tên"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Email Label"
                        value={getLocaleValue(formData.fields.email, 'label')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.email, 'label', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, email: { ...formData.fields.email, label: updatedField.label } },
                          });
                        }}
                        placeholder="Email"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Email Placeholder"
                        value={getLocaleValue(formData.fields.email, 'placeholder')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.email, 'placeholder', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, email: { ...formData.fields.email, placeholder: updatedField.placeholder } },
                          });
                        }}
                        placeholder="Nhập email"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Phone Label"
                        value={getLocaleValue(formData.fields.phone, 'label')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.phone, 'label', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, phone: { ...formData.fields.phone, label: updatedField.label } },
                          });
                        }}
                        placeholder="Số điện thoại"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Phone Placeholder"
                        value={getLocaleValue(formData.fields.phone, 'placeholder')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.phone, 'placeholder', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, phone: { ...formData.fields.phone, placeholder: updatedField.placeholder } },
                          });
                        }}
                        placeholder="Nhập số điện thoại"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Company Label"
                        value={getLocaleValue(formData.fields.company, 'label')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.company, 'label', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, company: { ...formData.fields.company, label: updatedField.label } },
                          });
                        }}
                        placeholder="Công ty"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Company Placeholder"
                        value={getLocaleValue(formData.fields.company, 'placeholder')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.company, 'placeholder', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, company: { ...formData.fields.company, placeholder: updatedField.placeholder } },
                          });
                        }}
                        placeholder="Nhập tên công ty"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Service Label"
                        value={getLocaleValue(formData.fields.service, 'label')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.service, 'label', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, service: { ...formData.fields.service, label: updatedField.label } },
                          });
                        }}
                        placeholder="Dịch vụ"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Service Placeholder"
                        value={getLocaleValue(formData.fields.service, 'placeholder')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.service, 'placeholder', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, service: { ...formData.fields.service, placeholder: updatedField.placeholder } },
                          });
                        }}
                        placeholder="Chọn dịch vụ"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Message Label"
                        value={getLocaleValue(formData.fields.message, 'label')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.message, 'label', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, message: { ...formData.fields.message, label: updatedField.label } },
                          });
                        }}
                        placeholder="Tin nhắn"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Message Placeholder"
                        value={getLocaleValue(formData.fields.message, 'placeholder')}
                        onChange={(value) => {
                          const updatedField = setLocaleValue(formData.fields.message, 'placeholder', value);
                          setFormData({
                            ...formData,
                            fields: { ...formData.fields, message: { ...formData.fields.message, placeholder: updatedField.placeholder } },
                          });
                        }}
                        placeholder="Nhập tin nhắn"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Button Submit"
                        value={getLocaleValue(formData.button, 'submit')}
                        onChange={(value) => {
                          const updatedButton = setLocaleValue(formData.button, 'submit', value);
                          setFormData({
                            ...formData,
                            button: { ...formData.button, submit: updatedButton.submit },
                          });
                        }}
                        placeholder="Gửi"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Button Success"
                        value={getLocaleValue(formData.button, 'success')}
                        onChange={(value) => {
                          const updatedButton = setLocaleValue(formData.button, 'success', value);
                          setFormData({
                            ...formData,
                            button: { ...formData.button, success: updatedButton.success },
                          });
                        }}
                        placeholder="Gửi thành công"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Services</Label>
                    <div className="flex gap-2 mb-2">
                      <div className="flex-1">
                        <LocaleInput
                          label="Tên dịch vụ"
                          value={newService}
                          onChange={(value) => {
                            // value là locale object đầy đủ từ LocaleInput
                            // Đảm bảo tất cả các locale đều có giá trị
                            setNewService({
                              vi: value.vi || '',
                              en: value.en || '',
                              ja: value.ja || ''
                            });
                          }}
                          placeholder="Thêm dịch vụ mới"
                          defaultLocale={globalLocale}
                          aiProvider={aiProvider}
                        />
                      </div>
                      <Button onClick={handleAddService} type="button" className="mt-6">Thêm</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {formData.services.map((service, index) => {
                        // Lấy giá trị cho từng ngôn ngữ
                        let viText = '';
                        let enText = '';
                        let jaText = '';

                        if (typeof service === 'string') {
                          // Nếu là string, hiển thị cho tất cả ngôn ngữ
                          viText = service;
                          enText = service;
                          jaText = service;
                        } else if (service && typeof service === 'object' && !Array.isArray(service)) {
                          // Nếu là locale object
                          if ('vi' in service || 'en' in service || 'ja' in service) {
                            // Lấy giá trị, xử lý cả trường hợp null, undefined, hoặc empty string
                            viText = (service.vi && typeof service.vi === 'string') ? service.vi.trim() : '';
                            enText = (service.en && typeof service.en === 'string') ? service.en.trim() : '';
                            jaText = (service.ja && typeof service.ja === 'string') ? service.ja.trim() : '';
                          } else {
                            // Không phải locale object, thử lấy giá trị đầu tiên
                            const firstValue = Object.values(service).find(v => typeof v === 'string' && v);
                            if (firstValue) {
                              viText = String(firstValue);
                              enText = String(firstValue);
                              jaText = String(firstValue);
                            }
                          }
                        }

                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors relative">
                            <Button
                              onClick={() => handleDeleteService(index)}
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <div className="flex flex-col gap-2 pr-8">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 w-6">🇻🇳</span>
                                <span className="text-sm text-gray-900 flex-1 truncate" title={viText}>
                                  {viText ? viText : <span className="text-gray-400 italic">(Chưa có)</span>}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 w-6">🇬🇧</span>
                                <span className="text-sm text-gray-900 flex-1 truncate" title={enText}>
                                  {enText ? enText : <span className="text-gray-400 italic">(Chưa có)</span>}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 w-6">🇯🇵</span>
                                <span className="text-sm text-gray-900 flex-1 truncate" title={jaText}>
                                  {jaText ? jaText : <span className="text-gray-400 italic">(Chưa có)</span>}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Kích hoạt</Label>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Form</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.isActive && (
                    <div className="border rounded-lg p-4">
                      <ContactForm data={getPreviewData().form} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Sidebar Tab */}
        <TabsContent value="sidebar" className="space-y-4 mt-4">
          <Tabs defaultValue="config" className="w-full">
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
                          <SelectTrigger className="w-[150px]" suppressHydrationWarning>
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
                          <SelectTrigger className="w-[150px]" suppressHydrationWarning>
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
                        onClick={() => handleTranslateSection('sidebar')}
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
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer hover:bg-gray-50 -mx-6 px-6 py-2 rounded transition-colors"
                      onClick={() => toggleBlock("sidebar")}
                    >
                      <CardTitle className="flex items-center gap-2">
                        {collapsedBlocks.sidebar ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                        Sidebar
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Cấu hình sidebar liên hệ</p>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); handleSaveSidebar(); }} disabled={loadingSidebar} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {loadingSidebar ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.sidebar && (
                  <CardContent className="space-y-6">
                  <div>
                    <LocaleInput
                      label="Quick Actions Title"
                      value={getLocaleValue(sidebarData.quickActions, 'title')}
                      onChange={(value) => {
                        const updatedQuickActions = setLocaleValue(sidebarData.quickActions, 'title', value);
                        setSidebarData({
                          ...sidebarData,
                          quickActions: { ...sidebarData.quickActions, title: updatedQuickActions.title },
                        });
                      }}
                      placeholder="Tiêu đề"
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <LocaleInput
                      label="Quick Actions Description"
                      value={getLocaleValue(sidebarData.quickActions, 'description')}
                      onChange={(value) => {
                        const updatedQuickActions = setLocaleValue(sidebarData.quickActions, 'description', value);
                        setSidebarData({
                          ...sidebarData,
                          quickActions: { ...sidebarData.quickActions, description: updatedQuickActions.description },
                        });
                      }}
                      placeholder="Mô tả"
                      multiline={true}
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Hotline Label"
                        value={getLocaleValue(sidebarData.quickActions.buttons.hotline, 'label')}
                        onChange={(value) => {
                          const updatedHotline = setLocaleValue(sidebarData.quickActions.buttons.hotline, 'label', value);
                          setSidebarData({
                            ...sidebarData,
                            quickActions: {
                              ...sidebarData.quickActions,
                              buttons: {
                                ...sidebarData.quickActions.buttons,
                                hotline: { ...sidebarData.quickActions.buttons.hotline, label: updatedHotline.label },
                              },
                            },
                          });
                        }}
                        placeholder="Hotline"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <Label>Hotline Value</Label>
                      <Input
                        value={sidebarData.quickActions.buttons.hotline.value}
                        onChange={(e) => setSidebarData({
                          ...sidebarData,
                          quickActions: {
                            ...sidebarData.quickActions,
                            buttons: {
                              ...sidebarData.quickActions.buttons,
                              hotline: { ...sidebarData.quickActions.buttons.hotline, value: e.target.value },
                            },
                          },
                        })}
                      />
                    </div>
                    <div>
                      <Label>Hotline Href</Label>
                      <Input
                        value={sidebarData.quickActions.buttons.hotline.href}
                        onChange={(e) => setSidebarData({
                          ...sidebarData,
                          quickActions: {
                            ...sidebarData.quickActions,
                            buttons: {
                              ...sidebarData.quickActions.buttons,
                              hotline: { ...sidebarData.quickActions.buttons.hotline, href: e.target.value },
                            },
                          },
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <LocaleInput
                        label="Appointment Label"
                        value={getLocaleValue(sidebarData.quickActions.buttons.appointment, 'label')}
                        onChange={(value) => {
                          const updatedAppointment = setLocaleValue(sidebarData.quickActions.buttons.appointment, 'label', value);
                          setSidebarData({
                            ...sidebarData,
                            quickActions: {
                              ...sidebarData.quickActions,
                              buttons: {
                                ...sidebarData.quickActions.buttons,
                                appointment: { ...sidebarData.quickActions.buttons.appointment, label: updatedAppointment.label },
                              },
                            },
                          });
                        }}
                        placeholder="Đặt lịch"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <LocaleInput
                        label="Appointment Value"
                        value={getLocaleValue(sidebarData.quickActions.buttons.appointment, 'value')}
                        onChange={(value) => {
                          const updatedAppointment = setLocaleValue(sidebarData.quickActions.buttons.appointment, 'value', value);
                          setSidebarData({
                            ...sidebarData,
                            quickActions: {
                              ...sidebarData.quickActions,
                              buttons: {
                                ...sidebarData.quickActions.buttons,
                                appointment: { ...sidebarData.quickActions.buttons.appointment, value: updatedAppointment.value },
                              },
                            },
                          });
                        }}
                        placeholder="Giá trị đặt lịch"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                    </div>
                    <div>
                      <Label>Appointment Href</Label>
                      <Input
                        value={sidebarData.quickActions.buttons.appointment.href}
                        onChange={(e) => setSidebarData({
                          ...sidebarData,
                          quickActions: {
                            ...sidebarData.quickActions,
                            buttons: {
                              ...sidebarData.quickActions.buttons,
                              appointment: { ...sidebarData.quickActions.buttons.appointment, href: e.target.value },
                            },
                          },
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Offices</Label>
                      <Button onClick={handleAddOffice} size="sm" variant="outline">
                        Thêm Office
                      </Button>
                    </div>
                    {sidebarData.offices.map((office, index) => (
                      <Card key={index} className="mb-2">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              {office.title && (
                                <p className="text-xs text-blue-600 mb-1">{getLocalizedText(office.title, globalLocale)}</p>
                              )}
                              <p><strong>{getLocalizedText(office.city, globalLocale)}</strong></p>
                              <p className="text-sm text-gray-600">{getLocalizedText(office.address, globalLocale)}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleEditOffice(index)} size="sm" variant="outline">
                                Sửa
                              </Button>
                              <Button onClick={() => handleDeleteOffice(index)} size="sm" variant="destructive">
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Social Links</Label>
                      <Button onClick={handleAddSocial} size="sm" variant="outline">
                        Thêm Social
                      </Button>
                    </div>
                    {sidebarData.socials.map((social, index) => (
                      <Card key={index} className="mb-2">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p><strong>{getLocalizedText(social.label, globalLocale)}</strong></p>
                              <p className="text-sm text-gray-600">{social.href}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleEditSocial(index)} size="sm" variant="outline">
                                Sửa
                              </Button>
                              <Button onClick={() => handleDeleteSocial(index)} size="sm" variant="destructive">
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Kích hoạt</Label>
                    <Switch
                      checked={sidebarData.isActive}
                      onCheckedChange={(checked) => setSidebarData({ ...sidebarData, isActive: checked })}
                    />
                  </div>
                  </CardContent>
                )}
              </Card>

              {/* Office Edit Dialog */}
              <Dialog open={editingOfficeIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  setEditingOfficeIndex(null);
                  setOfficeFormData(null);
                }
              }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa Office</DialogTitle>
                  </DialogHeader>
                  {officeFormData && (
                    <div className="space-y-4">
                      <LocaleInput
                        value={getLocaleValue(officeFormData, 'title')}
                        onChange={(value) => {
                          const updated = setLocaleValue(officeFormData, 'title', value);
                          setOfficeFormData(updated);
                        }}
                        label="Tiêu đề"
                        placeholder="Văn phòng chi nhánh"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                      <LocaleInput
                        value={getLocaleValue(officeFormData, 'city')}
                        onChange={(value) => {
                          const updated = setLocaleValue(officeFormData, 'city', value);
                          setOfficeFormData(updated);
                        }}
                        label="City"
                        placeholder="Hà Nội"
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                      <LocaleInput
                        value={getLocaleValue(officeFormData, 'address')}
                        onChange={(value) => {
                          const updated = setLocaleValue(officeFormData, 'address', value);
                          setOfficeFormData(updated);
                        }}
                        label="Address"
                        placeholder="Địa chỉ..."
                        multiline={true}
                        defaultLocale={globalLocale}
                        aiProvider={aiProvider}
                      />
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={officeFormData.phone}
                          onChange={(e) => setOfficeFormData({ ...officeFormData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={officeFormData.email}
                          onChange={(e) => setOfficeFormData({ ...officeFormData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setEditingOfficeIndex(null);
                      setOfficeFormData(null);
                    }}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveOffice}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Social Edit Dialog */}
              <Dialog open={editingSocialIndex !== null} onOpenChange={(open) => {
                if (!open) {
                  setEditingSocialIndex(null);
                  setSocialFormData(null);
                }
              }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa Social Link</DialogTitle>
                  </DialogHeader>
                  {socialFormData && (
                    <div className="space-y-4">
                      <div>
                        <Label>Icon Name</Label>
                        <Select
                          value={socialFormData.iconName}
                          onValueChange={(value) => setSocialFormData({ ...socialFormData, iconName: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={typeof socialFormData.label === 'string'
                            ? socialFormData.label
                            : (socialFormData.label?.vi || socialFormData.label?.en || socialFormData.label?.ja || '')}
                          onChange={(e) => setSocialFormData({ ...socialFormData, label: e.target.value })}
                          placeholder="Label"
                        />
                      </div>
                      <div>
                        <Label>Href</Label>
                        <Input
                          value={socialFormData.href}
                          onChange={(e) => setSocialFormData({ ...socialFormData, href: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Gradient</Label>
                        <Select
                          value={socialFormData.gradient}
                          onValueChange={(value) => setSocialFormData({ ...socialFormData, gradient: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADIENT_OPTIONS.map((grad) => (
                              <SelectItem key={grad.value} value={grad.value}>{grad.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setEditingSocialIndex(null);
                      setSocialFormData(null);
                    }}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveSocial}>Lưu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Sidebar</CardTitle>
                </CardHeader>
                <CardContent>
                  {sidebarData.isActive && (
                    <div className="border rounded-lg p-4">
                      <ContactSidebar data={getPreviewData().sidebar} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="space-y-4 mt-4">
          <Tabs defaultValue="config" className="w-full">
            <TabsList>
              <TabsTrigger value="config">Cấu hình</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="p-0">
                  <div
                    className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                    onClick={() => toggleBlock("mapSection")}
                  >
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-1">
                        {collapsedBlocks.mapSection ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )}
                        Map Section
                      </CardTitle>
                      <p className="text-sm text-gray-600 ml-8">Cấu hình bản đồ</p>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); handleSaveMap(); }} disabled={loadingMap} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {loadingMap ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedBlocks.mapSection && (
                  <CardContent className="space-y-4 px-6 py-4">
                  <div>
                    <LocaleInput
                      label="Address"
                      value={typeof mapData.address === 'string'
                        ? { vi: mapData.address, en: '', ja: '' }
                        : mapData.address}
                      onChange={(value) => {
                        setMapData({ ...mapData, address: value });
                      }}
                      placeholder="Địa chỉ..."
                      defaultLocale={globalLocale}
                      aiProvider={aiProvider}
                    />
                  </div>
                  <div>
                    <Label>Iframe Src (Google Maps Embed URL)</Label>
                    <Textarea
                      value={mapData.iframeSrc}
                      onChange={(e) => setMapData({ ...mapData, iframeSrc: e.target.value })}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Kích hoạt</Label>
                    <Switch
                      checked={mapData.isActive}
                      onCheckedChange={(checked) => setMapData({ ...mapData, isActive: checked })}
                    />
                  </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Map</CardTitle>
                </CardHeader>
                <CardContent>
                  {mapData.isActive && (
                    <div className="border rounded-lg p-4">
                      <ContactMap data={mapData} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

