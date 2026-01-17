"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Home, Sparkles, Users, Briefcase, ShieldCheck, MessageSquare, CheckCircle2, ArrowRight, Play, CheckCircle, LineChart, Code, Database, Cloud, BarChart3, FileCheck, Plus, Edit, Trash2, ChevronUp, ChevronDown, Star, Link as LinkIcon, Image as ImageIcon, Languages, Bot, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/admin/ImageUpload";
import MediaLibraryPicker from "@/app/(admin)/admin/news/MediaLibraryPicker";
import * as LucideIcons from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LocaleInput } from "@/components/admin/LocaleInput";
import { getLocaleValue, setLocaleValue } from "@/lib/utils/locale-admin";
import { getLocalizedText } from "@/lib/utils/i18n";

const BLOCK_TYPES = ['hero', 'aboutCompany', 'features', 'solutions', 'trusts', 'testimonials', 'consult'] as const;
type BlockType = typeof BLOCK_TYPES[number];

const ICON_OPTIONS = [
  "Code2", "MonitorSmartphone", "Network", "Globe2", "ShieldCheck", "Users", "Award", "Target",
  "Sparkles", "ArrowRight", "Phone", "Package", "Settings", "Database", "Cloud", "Server",
  "Cpu", "HardDrive", "LineChart", "Code", "BarChart3", "FileCheck", "CheckCircle", "CheckCircle2"
];

const GRADIENT_OPTIONS = [
  { value: "from-cyan-400 to-blue-600", label: "Cyan - Blue" },
  { value: "from-fuchsia-400 to-indigo-600", label: "Fuchsia - Indigo" },
  { value: "from-emerald-400 to-green-600", label: "Emerald - Green" },
  { value: "from-orange-400 to-pink-600", label: "Orange - Pink" },
  { value: "from-blue-500 to-cyan-500", label: "Blue - Cyan" },
  { value: "from-purple-500 to-pink-500", label: "Purple - Pink" },
  { value: "from-emerald-500 to-teal-500", label: "Emerald - Teal" },
  { value: "from-orange-500 to-amber-500", label: "Orange - Amber" },
];

interface HomepageBlock {
  id?: number;
  sectionType: BlockType;
  data: any;
  isActive: boolean;
}

export default function AdminHomepagePage() {
  const [blocks, setBlocks] = useState<Record<BlockType, HomepageBlock>>({
    hero: { sectionType: 'hero', data: {}, isActive: true },
    aboutCompany: { sectionType: 'aboutCompany', data: {}, isActive: true },
    features: { sectionType: 'features', data: {}, isActive: true },
    solutions: { sectionType: 'solutions', data: {}, isActive: true },
    trusts: { sectionType: 'trusts', data: {}, isActive: true },
    testimonials: { sectionType: 'testimonials', data: {}, isActive: true },
    consult: { sectionType: 'consult', data: {}, isActive: true },
  });
  const [loading, setLoading] = useState<Record<BlockType, boolean>>({
    hero: false,
    aboutCompany: false,
    features: false,
    solutions: false,
    trusts: false,
    testimonials: false,
    consult: false,
  });
  const [activeTab, setActiveTab] = useState<BlockType>('hero');
  const [globalLocale, setGlobalLocale] = useState<'vi' | 'en' | 'ja'>('vi');
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('openai');
  const [translatingAll, setTranslatingAll] = useState(false);
  const [translateSourceLang, setTranslateSourceLang] = useState<'vi' | 'en' | 'ja'>('vi'); // Ngôn ngữ nguồn để dịch

  // State for editing array items
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [editingSolutionIndex, setEditingSolutionIndex] = useState<number | null>(null);
  const [editingTrustFeatureIndex, setEditingTrustFeatureIndex] = useState<number | null>(null);
  const [editingFeatureItemIndex, setEditingFeatureItemIndex] = useState<{ block: 'block2' | 'block3', index: number } | null>(null);
  const [editingFeatureBlockIndex, setEditingFeatureBlockIndex] = useState<number | null>(null);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);

  // State for secondary button link dialog
  const [showSecondaryLinkDialog, setShowSecondaryLinkDialog] = useState(false);
  const [secondaryLinkTab, setSecondaryLinkTab] = useState<"url" | "media">("url");

  const tabsConfig = [
    { value: 'hero' as BlockType, label: 'Hero Banner', icon: Home, description: 'Banner đầu trang..' },
    { value: 'aboutCompany' as BlockType, label: 'Giới thiệu', icon: Users, description: 'Giới thiệu..' },
    { value: 'features' as BlockType, label: 'Tính năng', icon: Sparkles, description: 'Tính năng nổi bật' },
    { value: 'solutions' as BlockType, label: 'Giải pháp', icon: Briefcase, description: 'Chuyên nghiệp' },
    { value: 'trusts' as BlockType, label: 'Độ tin cậy', icon: ShieldCheck, description: 'Thể hiện độ tin cậy' },
    { value: 'testimonials' as BlockType, label: 'Khách hàng', icon: Star, description: 'Đánh giá từ khách hàng' },
    { value: 'consult' as BlockType, label: 'Tư vấn', icon: MessageSquare, description: 'Kêu gọi tư vấn' },
  ];

  useEffect(() => {
    void fetchAllBlocks();
  }, []);

  // Collapse state for config blocks (default: all hidden)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({
    hero: true,
    aboutCompany: true,
    features: true,
    solutions: true,
    trusts: true,
    testimonials: true,
    consult: true,
  });

  const toggleBlock = (blockKey: string) => {
    setCollapsedBlocks(prev => ({
      ...prev,
      [blockKey]: !prev[blockKey]
    }));
  };

  const fetchAllBlocks = async () => {
    try {
      for (const blockType of BLOCK_TYPES) {
        try {
          const data = await adminApiCall<{ success: boolean; data?: HomepageBlock }>(
            AdminEndpoints.homepage.block(blockType),
          );
          if (data?.data) {
            // Migration: Convert old block1/2/3 structure to blocks array for features
            if (blockType === 'features' && data.data.data) {
              const featuresData = data.data.data as any;
              // Check if we have old structure (block1, block2, block3) but no blocks array
              if ((featuresData.block1 || featuresData.block2 || featuresData.block3) && !featuresData.blocks) {
                const blocks: any[] = [];
                if (featuresData.block1) {
                  blocks.push({
                    type: 'type1',
                    image: featuresData.block1.image || '',
                    text: featuresData.block1.text || '',
                    list: featuresData.block1.list || [],
                    button: featuresData.block1.button || { text: '', link: '' },
                    items: [],
                  });
                }
                if (featuresData.block2) {
                  blocks.push({
                    type: 'type2',
                    image: featuresData.block2.image || '',
                    text: '',
                    list: [],
                    button: featuresData.block2.button || { text: '', link: '' },
                    items: featuresData.block2.items || [],
                  });
                }
                if (featuresData.block3) {
                  blocks.push({
                    type: 'type2',
                    image: featuresData.block3.image || '',
                    text: '',
                    list: [],
                    button: featuresData.block3.button || { text: '', link: '' },
                    items: featuresData.block3.items || [],
                  });
                }
                featuresData.blocks = blocks;
                // Save migrated data
                await adminApiCall(AdminEndpoints.homepage.block(blockType), {
                  method: "PUT",
                  body: JSON.stringify({
                    data: featuresData,
                    isActive: data.data.isActive,
                  }),
                });
              }
            }
            setBlocks(prev => ({
              ...prev,
              [blockType]: data.data!,
            }));
          }
        } catch (error) {
          // Block might not exist yet, that's okay
          // Block not found - use defaults
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải dữ liệu");
    }
  };

  const handleSaveBlock = async (blockType: BlockType) => {
    try {
      setLoading(prev => ({ ...prev, [blockType]: true }));
      const block = blocks[blockType];
      await adminApiCall(AdminEndpoints.homepage.block(blockType), {
        method: "PUT",
        body: JSON.stringify({
          data: block.data,
          isActive: block.isActive,
        }),
      });
      toast.success(`Đã lưu khối ${tabsConfig.find(t => t.value === blockType)?.label} thành công`);
      void fetchAllBlocks();
    } catch (error: any) {
      toast.error(error?.message || `Không thể lưu khối ${blockType}`);
    } finally {
      setLoading(prev => ({ ...prev, [blockType]: false }));
    }
  };

  const updateBlockData = (blockType: BlockType, path: string, value: any) => {
    setBlocks(prev => {
      const newData = { ...prev[blockType].data };
      const keys = path.split('.');
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return {
        ...prev,
        [blockType]: {
          ...prev[blockType],
          data: newData,
        },
      };
    });
  };

  const getBlockData = (blockType: BlockType, path: string, defaultValue: any = '') => {
    const keys = path.split('.');
    let current: any = blocks[blockType]?.data;
    if (!current) return defaultValue;
    for (const key of keys) {
      if (current && typeof current === 'object') {
        if (Array.isArray(current)) {
          // Nếu current là array nhưng key là string (không phải index), return default
          if (isNaN(Number(key))) {
            return defaultValue;
          }
          const index = Number(key);
          if (index >= 0 && index < current.length) {
            current = current[index];
          } else {
            return defaultValue;
          }
        } else if (key in current) {
          current = current[key];
        } else {
          return defaultValue;
        }
      } else {
        return defaultValue;
      }
    }
    
    // Đảm bảo type matching với default value
    if (Array.isArray(defaultValue) && !Array.isArray(current)) {
      return defaultValue;
    }
    if (!Array.isArray(defaultValue) && Array.isArray(current)) {
      return defaultValue;
    }
    
    return current ?? defaultValue;
  };
  
  // Helper để update locale value
  const updateLocaleValue = (blockType: BlockType, path: string, value: Record<'vi' | 'en' | 'ja', string>) => {
    setBlocks(prev => {
      const currentData = prev[blockType]?.data || {};
      const newData = setLocaleValue(currentData, path, value);
      return {
        ...prev,
        [blockType]: {
          ...prev[blockType],
          data: newData
        }
      };
    });
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code2;
    return <IconComponent className="w-6 h-6" />;
  };

  // Helper functions for array management
  const addArrayItem = (blockType: BlockType, arrayPath: string, defaultItem: any) => {
    const currentArray = getBlockData(blockType, arrayPath, []) as any[];
    updateBlockData(blockType, arrayPath, [...currentArray, defaultItem]);
  };

  const updateArrayItem = (blockType: BlockType, arrayPath: string, index: number, item: any) => {
    const currentArray = getBlockData(blockType, arrayPath, []) as any[];
    const newArray = [...currentArray];
    newArray[index] = item;
    updateBlockData(blockType, arrayPath, newArray);
  };

  const removeArrayItem = (blockType: BlockType, arrayPath: string, index: number) => {
    const currentArray = getBlockData(blockType, arrayPath, []) as any[];
    const newArray = currentArray.filter((_, i) => i !== index);
    updateBlockData(blockType, arrayPath, newArray);
  };

  const moveArrayItem = (blockType: BlockType, arrayPath: string, index: number, direction: 'up' | 'down') => {
    const currentArray = getBlockData(blockType, arrayPath, []) as any[];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentArray.length - 1) return;

    const newArray = [...currentArray];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
    updateBlockData(blockType, arrayPath, newArray);
  };

  // Hàm dịch toàn bộ các trường locale trong TẤT CẢ các blocks
  // Gom tất cả thành 1 request duy nhất để dịch chuẩn theo từng khối
  const handleTranslateAll = async () => {
    setTranslatingAll(true);
    try {
      // Tạo object chứa các fields cần dịch, giữ nguyên cấu trúc
      // Chỉ lấy các fields có locale object và còn thiếu ngôn ngữ
      const fieldMap: Map<string, { blockType: BlockType; path: string; originalValue: Record<'vi' | 'en' | 'ja', string> }> = new Map();

      // Hàm tạo object chỉ chứa các fields cần dịch, giữ nguyên cấu trúc
      // Hàm này sẽ tìm tất cả locale objects và cả string values (để convert thành locale objects)
      const buildTranslationObject = (obj: any, blockType: BlockType, path: string = '', targetObj: any = {}): any => {
        if (!obj || typeof obj !== 'object') return targetObj;
        
        // Skip các fields không cần dịch
        const skipFields = [
          'image', 'link', 'href', 'url', 'icon', 'gradient', 'color',
          'partners', 'heroImage', 'backgroundImage', 'imageUrl', 'slug',
          'id', 'sortOrder', 'isActive', 'iconName', 'rating', 'type', 'imageSide',
          'buttonLink', 'imageSide',
          // Các field không nên dịch
          'author' // tên khách hàng trong testimonials
        ];
        
        for (const [key, value] of Object.entries(obj)) {
          // Skip các fields không cần dịch
          if (skipFields.includes(key)) continue;
          
          const currentPath = path ? `${path}.${key}` : key;
          
          // Nếu là string - tự động convert thành locale object
          if (typeof value === 'string' && value.trim()) {
            // Convert string thành locale object với source language = string hiện tại, các ngôn ngữ khác = rỗng
            const localeValue: Record<'vi' | 'en' | 'ja', string> = {
              vi: '',
              en: '',
              ja: ''
            };
            localeValue[translateSourceLang] = value.trim();
            
            // Tạo nested structure trong targetObj
            const keys = currentPath.split('.');
            let current: any = targetObj;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!current[keys[i]]) current[keys[i]] = {};
              current = current[keys[i]];
            }
            
            // Lưu source text (chỉ lấy text từ source language đã chọn)
            current[keys[keys.length - 1]] = localeValue[translateSourceLang];
            
            // Lưu mapping để sau này cập nhật
            fieldMap.set(`${blockType}.${currentPath}`, {
              blockType,
              path: currentPath,
              originalValue: localeValue
            });
            
            continue;
          }
          
          // Kiểm tra nếu là locale object (có vi, en, ja)
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const hasVi = 'vi' in value;
            const hasEn = 'en' in value;
            const hasJa = 'ja' in value;
            
            if (hasVi || hasEn || hasJa) {
              const localeValue = value as Record<'vi' | 'en' | 'ja', string>;
              const viText = (localeValue.vi || '').trim();
              const enText = (localeValue.en || '').trim();
              const jaText = (localeValue.ja || '').trim();
              
              // Chỉ xử lý nếu ngôn ngữ nguồn đã chọn có nội dung
              const sourceText = (localeValue[translateSourceLang] || '').trim();
              if (!sourceText) {
                // Bỏ qua field này nếu không có nội dung ở ngôn ngữ nguồn
                continue;
              }
              
              // Sử dụng source language đã chọn
              const sourceLang = translateSourceLang;
              
              // Kiểm tra xem có ngôn ngữ nào còn thiếu không (dựa trên source language đã chọn)
              const needsTranslation = (
                (sourceLang === 'vi' && (!enText || !jaText)) ||
                (sourceLang === 'en' && (!viText || !jaText)) ||
                (sourceLang === 'ja' && (!viText || !enText))
              );
              
              if (needsTranslation) {
                // Tạo nested structure trong targetObj
                const keys = currentPath.split('.');
                let current: any = targetObj;
                for (let i = 0; i < keys.length - 1; i++) {
                  if (!current[keys[i]]) current[keys[i]] = {};
                  current = current[keys[i]];
                }
                
                // Lưu source text (chỉ lấy text từ source language)
                current[keys[keys.length - 1]] = localeValue[sourceLang];
                
                // Lưu mapping để sau này cập nhật
                fieldMap.set(`${blockType}.${currentPath}`, {
                  blockType,
                  path: currentPath,
                  originalValue: localeValue
                });
              }
            } else {
              // Đệ quy tìm trong nested objects (không phải locale object)
              buildTranslationObject(value, blockType, currentPath, targetObj);
            }
          } else if (Array.isArray(value)) {
            // Xử lý arrays
            value.forEach((item, index) => {
              if (item && typeof item === 'object') {
                buildTranslationObject(item, blockType, `${currentPath}.${index}`, targetObj);
              } else if (typeof item === 'string' && item.trim()) {
                // Xử lý string trong array (như title, description trong slides)
                // Chỉ xử lý nếu string có giá trị (đã được kiểm tra ở trên)
                const localeValue: Record<'vi' | 'en' | 'ja', string> = {
                  vi: '',
                  en: '',
                  ja: ''
                };
                localeValue[translateSourceLang] = item.trim();
                
                // Tạo nested structure trong targetObj
                const keys = `${currentPath}.${index}`.split('.');
                let current: any = targetObj;
                for (let i = 0; i < keys.length - 1; i++) {
                  if (!current[keys[i]]) {
                    // Nếu là index số, tạo array
                    if (!isNaN(Number(keys[i]))) {
                      if (!Array.isArray(current)) current = [];
                      while (current.length <= Number(keys[i])) current.push(null);
                      current[Number(keys[i])] = {};
                    } else {
                      current[keys[i]] = {};
                    }
                  }
                  current = current[keys[i]];
                }
                
                const lastKey = keys[keys.length - 1];
                if (!isNaN(Number(lastKey))) {
                  if (!Array.isArray(current)) current = [];
                  while (current.length <= Number(lastKey)) current.push(null);
                  current[Number(lastKey)] = localeValue[translateSourceLang];
                } else {
                  current[lastKey] = localeValue[translateSourceLang];
                }
                
                fieldMap.set(`${blockType}.${currentPath}.${index}`, {
                  blockType,
                  path: `${currentPath}.${index}`,
                  originalValue: localeValue
                });
              }
            });
          }
        }
        
        return targetObj;
      };

      // Chỉ dịch block hiện tại (activeTab) thay vì tất cả blocks
      const block = blocks[activeTab];
      if (!block || !block.data) {
        toast.info('Không có dữ liệu để dịch');
        setTranslatingAll(false);
        return;
      }

      // Kiểm tra xem ngôn ngữ nguồn đã chọn có nội dung trong block không
      const hasSourceLanguageContent = (data: any, sourceLang: 'vi' | 'en' | 'ja'): boolean => {
        if (!data || typeof data !== 'object') return false;
        
        for (const [key, value] of Object.entries(data)) {
          // Skip các fields không cần dịch
          const skipFields = ['image', 'link', 'href', 'url', 'icon', 'gradient', 'color', 
                             'partners', 'heroImage', 'backgroundImage', 'imageUrl', 'slug',
                             'id', 'sortOrder', 'isActive', 'iconName', 'rating', 'type', 'imageSide',
                             'buttonLink'];
          if (skipFields.includes(key)) continue;
          
          if (typeof value === 'string' && value.trim()) {
            return true; // Có string value
          }
          
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            // Kiểm tra nếu là locale object
            if (sourceLang in value && (value as any)[sourceLang]?.trim()) {
              return true;
            }
            // Đệ quy kiểm tra nested objects
            if (hasSourceLanguageContent(value, sourceLang)) {
              return true;
            }
          } else if (Array.isArray(value)) {
            // Kiểm tra trong arrays
            for (const item of value) {
              if (hasSourceLanguageContent(item, sourceLang)) {
                return true;
              }
            }
          }
        }
        
        return false;
      };
      
      if (!hasSourceLanguageContent(block.data, translateSourceLang)) {
        const sourceLangName = translateSourceLang === 'vi' ? 'Tiếng Việt' : translateSourceLang === 'en' ? 'English' : '日本語';
        toast.warning(`Không tìm thấy nội dung ${sourceLangName} trong khối "${tabsConfig.find(t => t.value === activeTab)?.label}". Vui lòng nhập nội dung ${sourceLangName} trước khi dịch.`);
        setTranslatingAll(false);
        return;
      }


      // Build translation object cho block hiện tại
      const blockTranslationData = buildTranslationObject(block.data, activeTab);
      
      
      if (Object.keys(blockTranslationData).length === 0 || fieldMap.size === 0) {
        // Kiểm tra xem block có dữ liệu không
        const hasData = block.data && Object.keys(block.data).length > 0;
        
        // Thông báo chi tiết hơn để debug
        let message = '';
        if (!hasData) {
          message = `Khối "${tabsConfig.find(t => t.value === activeTab)?.label}" chưa có dữ liệu. Vui lòng nhập dữ liệu trước khi dịch.`;
        } else if (fieldMap.size === 0) {
          const sourceLangName = translateSourceLang === 'vi' ? 'Tiếng Việt' : translateSourceLang === 'en' ? 'English' : '日本語';
          message = `Không tìm thấy trường nào có nội dung ${sourceLangName} để dịch trong khối "${tabsConfig.find(t => t.value === activeTab)?.label}".\n- Vui lòng nhập nội dung ${sourceLangName} trước khi dịch\n- Hoặc chọn ngôn ngữ nguồn khác có nội dung`;
        } else {
          message = 'Không có trường nào cần dịch (tất cả đã có đầy đủ nội dung)';
        }
        
        toast.info(message, {
          duration: 5000,
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Translate ${activeTab}] No translatable fields found. Block data:`, block.data);
        }
        
        setTranslatingAll(false);
        return;
      }


      toast.info(`Đang dịch ${fieldMap.size} trường trong khối "${tabsConfig.find(t => t.value === activeTab)?.label}" (1 request duy nhất)...`);

      // Thu thập tất cả target languages cần dịch (tất cả ngôn ngữ khác source)
      const allTargetLangs = new Set<'vi' | 'en' | 'ja'>();
      fieldMap.forEach((field) => {
        const viText = (field.originalValue.vi || '').trim();
        const enText = (field.originalValue.en || '').trim();
        const jaText = (field.originalValue.ja || '').trim();
        
        // Sử dụng source language đã chọn
        const sourceLang = translateSourceLang;
        
        // Thêm tất cả ngôn ngữ khác source vào target languages nếu chúng còn thiếu
        if (sourceLang !== 'vi' && !viText) allTargetLangs.add('vi');
        if (sourceLang !== 'en' && !enText) allTargetLangs.add('en');
        if (sourceLang !== 'ja' && !jaText) allTargetLangs.add('ja');
      });

      const targetLangsArray = Array.from(allTargetLangs);
      if (targetLangsArray.length === 0) {
        toast.info('Không có ngôn ngữ nào cần dịch');
        setTranslatingAll(false);
        return;
      }

      // Sử dụng source language đã chọn
      const mainSourceLang = translateSourceLang;

      try {
        // Gửi 1 request duy nhất với translation data của block hiện tại
        // Gửi trực tiếp blockTranslationData (không wrap trong activeTab key)
        // Vì backend sẽ trả về cùng cấu trúc
        const response = await adminApiCall<{ success: boolean; data: any }>(
          AdminEndpoints.translate,
          {
            method: 'POST',
            body: JSON.stringify({
              text: blockTranslationData,
              sourceLang: mainSourceLang,
              targetLangs: targetLangsArray,
              provider: aiProvider
            })
          }
        );

        if (response.success && response.data) {

          // Hàm để extract và cập nhật translations từ response
          // Response.data có cấu trúc giống như translationData đã gửi (không wrap trong blockType key)
          const extractAndUpdate = (translatedObj: any, blockType: BlockType, path: string = '', parentIsArray: boolean = false, arrayIndex: number = -1): number => {
            let updatedCount = 0;
            
            if (!translatedObj || typeof translatedObj !== 'object') return updatedCount;
            
            if (Array.isArray(translatedObj)) {
              translatedObj.forEach((item, index) => {
                if (item && typeof item === 'object' && !Array.isArray(item)) {
                  // Kiểm tra nếu item là locale object
                  const hasVi = 'vi' in item;
                  const hasEn = 'en' in item;
                  const hasJa = 'ja' in item;
                  
                  if (hasVi || hasEn || hasJa) {
                    // Đây là locale object trong array
                    const currentPath = path ? `${path}.${index}` : `${index}`;
                    const fieldKey = `${blockType}.${currentPath}`;
                    const fieldInfo = fieldMap.get(fieldKey);
                    
                    if (fieldInfo) {
                      const originalValue = fieldInfo.originalValue;
                      const translatedValue = item as Record<'vi' | 'en' | 'ja', string>;
                      
                      const newLocaleValue: Record<'vi' | 'en' | 'ja', string> = {
                        vi: (originalValue.vi || '').trim() || '',
                        en: (originalValue.en || '').trim() || '',
                        ja: (originalValue.ja || '').trim() || ''
                      };
                      
                      if (translatedValue.vi && typeof translatedValue.vi === 'string' && !newLocaleValue.vi) {
                        newLocaleValue.vi = translatedValue.vi.trim();
                      }
                      if (translatedValue.en && typeof translatedValue.en === 'string' && !newLocaleValue.en) {
                        newLocaleValue.en = translatedValue.en.trim();
                      }
                      if (translatedValue.ja && typeof translatedValue.ja === 'string' && !newLocaleValue.ja) {
                        newLocaleValue.ja = translatedValue.ja.trim();
                      }
                      
                      if (newLocaleValue.vi !== originalValue.vi || 
                          newLocaleValue.en !== originalValue.en || 
                          newLocaleValue.ja !== originalValue.ja) {
                        updateLocaleValue(blockType, currentPath, newLocaleValue);
                        updatedCount++;
                        
                      }
                    }
                  } else {
                    // Đệ quy tìm trong nested objects
                    updatedCount += extractAndUpdate(item, blockType, path ? `${path}.${index}` : `${index}`, true, index);
                  }
                }
              });
              return updatedCount;
            }
            
            for (const [key, value] of Object.entries(translatedObj)) {
              const currentPath = path ? `${path}.${key}` : key;
              
              // Kiểm tra nếu value là locale object (có vi, en, ja)
              if (value && typeof value === 'object' && !Array.isArray(value)) {
                const hasVi = 'vi' in value;
                const hasEn = 'en' in value;
                const hasJa = 'ja' in value;
                
                if (hasVi || hasEn || hasJa) {
                  // Đây là locale object - cần cập nhật
                  const fieldKey = `${blockType}.${currentPath}`;
                  const fieldInfo = fieldMap.get(fieldKey);
                  
                  if (fieldInfo) {
                    // Tìm thấy field cần cập nhật
                    const originalValue = fieldInfo.originalValue;
                    const translatedValue = value as Record<'vi' | 'en' | 'ja', string>;
                    
                    // Tạo locale object mới, giữ nguyên các giá trị đã có
                    const newLocaleValue: Record<'vi' | 'en' | 'ja', string> = {
                      vi: (originalValue.vi || '').trim() || '',
                      en: (originalValue.en || '').trim() || '',
                      ja: (originalValue.ja || '').trim() || ''
                    };
                    
                    // Cập nhật các ngôn ngữ còn thiếu từ translated value
                    if (translatedValue.vi && typeof translatedValue.vi === 'string' && !newLocaleValue.vi) {
                      newLocaleValue.vi = translatedValue.vi.trim();
                    }
                    if (translatedValue.en && typeof translatedValue.en === 'string' && !newLocaleValue.en) {
                      newLocaleValue.en = translatedValue.en.trim();
                    }
                    if (translatedValue.ja && typeof translatedValue.ja === 'string' && !newLocaleValue.ja) {
                      newLocaleValue.ja = translatedValue.ja.trim();
                    }
                    
                    // Chỉ cập nhật nếu có thay đổi
                    if (newLocaleValue.vi !== originalValue.vi || 
                        newLocaleValue.en !== originalValue.en || 
                        newLocaleValue.ja !== originalValue.ja) {
                      updateLocaleValue(blockType, currentPath, newLocaleValue);
                      updatedCount++;
                    }
                  } else {
                    // Không tìm thấy trong fieldMap - có thể là nested locale object
                    if (process.env.NODE_ENV === 'development') {
                      console.warn(`[Translate ${activeTab}] Field not found in map: ${fieldKey}`);
                    }
                  }
                } else {
                  // Không phải locale object - đệ quy tìm tiếp
                  updatedCount += extractAndUpdate(value, blockType, currentPath, false, -1);
                }
              } else if (value && typeof value === 'object' && Array.isArray(value)) {
                // Array - đệ quy
                updatedCount += extractAndUpdate(value, blockType, currentPath, false, -1);
              }
            }
            
            return updatedCount;
          };

          // Áp dụng translations cho block hiện tại
          // Response.data có cùng cấu trúc như translationData đã gửi (không wrap trong blockType key)
          let totalUpdated = 0;
          if (response.data && typeof response.data === 'object') {
            totalUpdated = extractAndUpdate(response.data, activeTab);
          }

          if (totalUpdated > 0) {
            toast.success(`Đã dịch thành công ${totalUpdated} trường trong khối "${tabsConfig.find(t => t.value === activeTab)?.label}" (1 request duy nhất)`);
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[Translate ${activeTab}] No fields updated. Response:`, response.data);
            }
            toast.warning('Không có trường nào được cập nhật. Có thể tất cả đã có đầy đủ hoặc cấu trúc không khớp.');
          }
        } else {
          toast.error('Không thể dịch: ' + (response as any)?.message || 'Unknown error');
        }
      } catch (error: any) {
        toast.error('Lỗi khi dịch: ' + (error?.message || 'Unknown error'));
        if (process.env.NODE_ENV === 'development') {
          console.error('Translation error:', error);
        }
      }
    } catch (error: any) {
      toast.error('Lỗi khi xử lý: ' + (error?.message || 'Unknown error'));
    } finally {
      setTranslatingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Trang chủ</h1>
          <p className="text-gray-600 mt-1">Quản lý đầy đủ các khối trên trang chủ</p>
        </div>
        <div className="flex items-center gap-4">
          {/* AI Provider Selector - Giữ ở header vì dùng chung cho tất cả tabs */}
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-gray-500" />
            <Select value={aiProvider} onValueChange={(value: 'openai' | 'gemini') => setAiProvider(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4o-mini)</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {tabsConfig.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              const isCompleted = tabsConfig.findIndex(t => t.value === activeTab) > index;

              return (
                <div key={tab.value} className="flex items-center flex-1 min-w-[150px]">
                  <button
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all flex-1 ${isActive
                        ? "bg-blue-50 text-blue-700 border-2 border-blue-500"
                        : isCompleted
                          ? "bg-green-50 text-green-700 border-2 border-green-300"
                          : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${isActive
                        ? "bg-blue-500 text-white"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-semibold text-sm truncate">{tab.label}</div>
                      <div className="text-xs opacity-75 truncate">{tab.description}</div>
                    </div>
                  </button>
                  {index < tabsConfig.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BlockType)} className="w-full">
        {BLOCK_TYPES.map((blockType) => {
          const tabConfig = tabsConfig.find(t => t.value === blockType);
          const block = blocks[blockType];

          return (
            <TabsContent key={blockType} value={blockType} className="space-y-0">
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
                          {/* Locale Selector cho tab này */}
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
                        
                        {/* Translate Controls - Source Language Selector và Button */}
                        <div className="flex items-center gap-2">
                          {/* Source Language Selector cho dịch */}
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
                          
                          {/* Translate Button cho tab này */}
                          <Button
                            onClick={handleTranslateAll}
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
                        onClick={() => toggleBlock(blockType)}
                      >
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-1">
                            {collapsedBlocks[blockType] ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            )}
                            {tabConfig?.label}
                          </CardTitle>
                          <p className="text-sm text-gray-600 ml-8">{tabConfig?.description}</p>
                        </div>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleSaveBlock(blockType); }}
                          disabled={loading[blockType]}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading[blockType] ? "Đang lưu..." : "Lưu"}
                        </Button>
                      </div>
                    </CardHeader>
                    {!collapsedBlocks[blockType] && (
                      <CardContent className="space-y-4 px-6 py-4">
                        {/* Render form based on block type */}
                        {blockType === 'hero' && (
                          <>
                            <LocaleInput
                              value={getLocaleValue(blocks['hero']?.data, 'title.line1')}
                              onChange={(value) => updateLocaleValue('hero', 'title.line1', value)}
                              label="Tiêu đề dòng 1"
                              placeholder="Chuyển đổi số "
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <LocaleInput
                              value={getLocaleValue(blocks['hero']?.data, 'title.line2')}
                              onChange={(value) => updateLocaleValue('hero', 'title.line2', value)}
                              label="Tiêu đề dòng 2"
                              placeholder="Thông minh "
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <LocaleInput
                              value={getLocaleValue(blocks['hero']?.data, 'title.line3')}
                              onChange={(value) => updateLocaleValue('hero', 'title.line3', value)}
                              label="Tiêu đề dòng 3"
                              placeholder="Cho doanh nghiệp"
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <LocaleInput
                              value={getLocaleValue(blocks['hero']?.data, 'description')}
                              onChange={(value) => updateLocaleValue('hero', 'description', value)}
                              label="Mô tả"
                              placeholder="SFB Technology đồng hành..."
                              multiline={true}
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <LocaleInput
                              value={getLocaleValue(blocks['hero']?.data, 'primaryButton.text')}
                              onChange={(value) => updateLocaleValue('hero', 'primaryButton.text', value)}
                              label="Nút chính - Text"
                              placeholder="Khám phá giải pháp"
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <div>
                              <Label className="mb-2">Nút chính - Link</Label>
                              <Input
                                value={getBlockData('hero', 'primaryButton.link')}
                                onChange={(e) => updateBlockData('hero', 'primaryButton.link', e.target.value)}
                                placeholder="/solutions"
                              />
                            </div>
                            <LocaleInput
                              value={getLocaleValue(blocks['hero']?.data, 'secondaryButton.text')}
                              onChange={(value) => updateLocaleValue('hero', 'secondaryButton.text', value)}
                              label="Nút phụ - Text"
                              placeholder="Xem video"
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <div>
                              <Label className="mb-2">Nút phụ - Link</Label>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                  <div className="flex flex-col">
                                    <Label className="text-sm font-medium">
                                      {getBlockData('hero', 'secondaryButton.type', 'link') === 'video'
                                        ? 'Video/Media (Mở popup)'
                                        : 'Nhập link (Redirect)'}
                                    </Label>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {getBlockData('hero', 'secondaryButton.type', 'link') === 'video'
                                        ? 'Video sẽ mở trong popup khi click'
                                        : 'Link sẽ redirect đến trang đích khi click'}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm ${getBlockData('hero', 'secondaryButton.type', 'link') === 'link' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                      Link
                                    </span>
                                    <Switch
                                      checked={getBlockData('hero', 'secondaryButton.type', 'link') === 'video'}
                                      onCheckedChange={(checked) => {
                                        updateBlockData('hero', 'secondaryButton.type', checked ? 'video' : 'link');
                                      }}
                                    />
                                    <span className={`text-sm ${getBlockData('hero', 'secondaryButton.type', 'link') === 'video' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                      Video
                                    </span>
                                  </div>
                                </div>
                                {getBlockData('hero', 'secondaryButton.type', 'link') === 'link' && (
                                  <Input
                                    value={getBlockData('hero', 'secondaryButton.link')}
                                    onChange={(e) => updateBlockData('hero', 'secondaryButton.link', e.target.value)}
                                    placeholder="/page hoặc https://example.com/..."
                                  />
                                )}

                                {getBlockData('hero', 'secondaryButton.type', 'link') === 'video' && (
                                  <div className="flex gap-2">
                                    <Input
                                      value={getBlockData('hero', 'secondaryButton.link')}
                                      onChange={(e) => updateBlockData('hero', 'secondaryButton.link', e.target.value)}
                                      placeholder="/video hoặc https://youtube.com/..."
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        setSecondaryLinkTab("media");
                                        setShowSecondaryLinkDialog(true);
                                      }}
                                      title="Chọn video từ Media Library"
                                    >
                                      <ImageIcon className="w-4 h-4 mr-2" />
                                      Chọn Media
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <Label className="mb-2">Hình ảnh Hero</Label>
                              <ImageUpload
                                currentImage={getBlockData('hero', 'heroImage')}
                                onImageSelect={(url: string) => updateBlockData('hero', 'heroImage', url)}
                              />
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="mb-2">Partners (Logo đối tác)</Label>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const partners = getBlockData('hero', 'partners', []) as string[];
                                    updateBlockData('hero', 'partners', [...partners, '']);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Thêm partner
                                </Button>
                              </div>
                              <div className="grid grid-cols-6 gap-4">
                                {(getBlockData('hero', 'partners', []) as string[]).map((partner, idx) => (
                                  <div key={idx} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="mb-2 text-sm">Partner {idx + 1}</Label>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const partners = getBlockData('hero', 'partners', []) as string[];
                                          updateBlockData('hero', 'partners', partners.filter((_, i) => i !== idx));
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <ImageUpload
                                      currentImage={partner}
                                      onImageSelect={(url: string) => {
                                        const partners = getBlockData('hero', 'partners', []) as string[];
                                        const newPartners = [...partners];
                                        newPartners[idx] = url;
                                        updateBlockData('hero', 'partners', newPartners);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="mb-2">Kích hoạt</Label>
                              <Switch
                                checked={block.isActive}
                                onCheckedChange={(checked) => setBlocks(prev => ({
                                  ...prev,
                                  [blockType]: { ...prev[blockType], isActive: checked }
                                }))}
                              />
                            </div>
                          </>
                        )}

                        {blockType === 'consult' && (
                          <>
                            <LocaleInput
                              value={getLocaleValue(blocks['consult']?.data, 'title')}
                              onChange={(value) => updateLocaleValue('consult', 'title', value)}
                              label="Tiêu đề"
                              placeholder="Miễn phí tư vấn"
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <LocaleInput
                              value={getLocaleValue(blocks['consult']?.data, 'description')}
                              onChange={(value) => updateLocaleValue('consult', 'description', value)}
                              label="Mô tả"
                              placeholder="Mô tả..."
                              multiline={true}
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <LocaleInput
                              value={getLocaleValue(blocks['consult']?.data, 'buttons.primary.text')}
                              onChange={(value) => updateLocaleValue('consult', 'buttons.primary.text', value)}
                              label="Nút chính - Text"
                              placeholder="Tư vấn miễn phí ngay"
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <div>
                              <Label className="mb-2">Nút chính - Link</Label>
                              <Input
                                value={getBlockData('consult', 'buttons.primary.link')}
                                onChange={(e) => updateBlockData('consult', 'buttons.primary.link', e.target.value)}
                                placeholder="/contact"
                              />
                            </div>
                            <LocaleInput
                              value={getLocaleValue(blocks['consult']?.data, 'buttons.secondary.text')}
                              onChange={(value) => updateLocaleValue('consult', 'buttons.secondary.text', value)}
                              label="Nút phụ - Text"
                              placeholder="Xem case studies"
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                            <div>
                              <Label className="mb-2">Nút phụ - Link</Label>
                              <Input
                                value={getBlockData('consult', 'buttons.secondary.link')}
                                onChange={(e) => updateBlockData('consult', 'buttons.secondary.link', e.target.value)}
                                placeholder="/solutions"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="mb-2">Kích hoạt</Label>
                              <Switch
                                checked={block.isActive}
                                onCheckedChange={(checked) => setBlocks(prev => ({
                                  ...prev,
                                  [blockType]: { ...prev[blockType], isActive: checked }
                                }))}
                              />
                            </div>
                          </>
                        )}

                        {blockType === 'aboutCompany' && (
                          <>
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg">Tiêu đề</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <LocaleInput
                                    value={getLocaleValue(blocks['aboutCompany']?.data, 'title.part1')}
                                    onChange={(value) => updateLocaleValue('aboutCompany', 'title.part1', value)}
                                    label="Phần 1"
                                    placeholder="Chuyển đổi số "
                                    defaultLocale={globalLocale}
                                    aiProvider={aiProvider}
                                  />
                                </div>
                                <div>
                                  <LocaleInput
                                    value={getLocaleValue(blocks['aboutCompany']?.data, 'title.highlight1')}
                                    onChange={(value) => updateLocaleValue('aboutCompany', 'title.highlight1', value)}
                                    label="Highlight 1"
                                    placeholder="không bắt đầu từ phần mềm"
                                    defaultLocale={globalLocale}
                                    aiProvider={aiProvider}
                                  />
                                </div>
                                <div>
                                  <LocaleInput
                                    value={getLocaleValue(blocks['aboutCompany']?.data, 'title.part2')}
                                    onChange={(value) => updateLocaleValue('aboutCompany', 'title.part2', value)}
                                    label="Phần 2"
                                    placeholder=" mà "
                                    defaultLocale={globalLocale}
                                    aiProvider={aiProvider}
                                  />
                                </div>
                                <div>
                                  <LocaleInput
                                    value={getLocaleValue(blocks['aboutCompany']?.data, 'title.highlight2')}
                                    onChange={(value) => updateLocaleValue('aboutCompany', 'title.highlight2', value)}
                                    label="Highlight 2"
                                    placeholder="từ hiệu quả thực tế"
                                    defaultLocale={globalLocale}
                                    aiProvider={aiProvider}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <LocaleInput
                                    value={getLocaleValue(blocks['aboutCompany']?.data, 'title.part3')}
                                    onChange={(value) => updateLocaleValue('aboutCompany', 'title.part3', value)}
                                    label="Phần 3"
                                    placeholder=" của doanh nghiệp."
                                    defaultLocale={globalLocale}
                                    aiProvider={aiProvider}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <LocaleInput
                                value={getLocaleValue(blocks['aboutCompany']?.data, 'description')}
                                onChange={(value) => updateLocaleValue('aboutCompany', 'description', value)}
                                label="Mô tả"
                                placeholder="Mô tả..."
                                multiline={true}
                                defaultLocale={globalLocale}
                                aiProvider={aiProvider}
                              />
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Slides</h3>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const slides = getBlockData('aboutCompany', 'slides', []) as any[];
                                    addArrayItem('aboutCompany', 'slides', {
                                      title: '',
                                      description: '',
                                      buttonText: '',
                                      buttonLink: '',
                                      image: '',
                                    });
                                    setEditingSlideIndex(slides.length);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Thêm slide
                                </Button>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                {(() => {
                                  const slides = getBlockData('aboutCompany', 'slides', []);
                                  return Array.isArray(slides) ? slides.map((slide: any, idx: number) => (
                                  <Card key={idx}>
                                    <CardHeader>
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Slide {idx + 1}</CardTitle>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => moveArrayItem('aboutCompany', 'slides', idx, 'up')}
                                            disabled={idx === 0}
                                          >
                                            <ChevronUp className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => moveArrayItem('aboutCompany', 'slides', idx, 'down')}
                                            disabled={(() => {
                                              const slides = getBlockData('aboutCompany', 'slides', []);
                                              return !Array.isArray(slides) || idx === slides.length - 1;
                                            })()}
                                          >
                                            <ChevronDown className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setEditingSlideIndex(idx)}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeArrayItem('aboutCompany', 'slides', idx)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <p className="font-medium text-sm">{getLocalizedText(slide.title, globalLocale) || 'Chưa có tiêu đề'}</p>
                                        <p className="text-xs text-gray-600 line-clamp-2">{getLocalizedText(slide.description, globalLocale) || 'Chưa có mô tả'}</p>
                                        {slide.image && (
                                          <img src={slide.image} alt={getLocalizedText(slide.title, globalLocale) || 'Slide'} className="w-full h-24 object-cover rounded" />
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )) : null;
                                })()}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="mb-2">Kích hoạt</Label>
                              <Switch
                                checked={block.isActive}
                                onCheckedChange={(checked) => setBlocks(prev => ({
                                  ...prev,
                                  [blockType]: { ...prev[blockType], isActive: checked }
                                }))}
                              />
                            </div>
                          </>
                        )}

                        {blockType === 'features' && (
                          <>
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg">Header</h3>
                              <div>
                                <LocaleInput
                                  value={getLocaleValue(blocks['features']?.data, 'header.sub')}
                                  onChange={(value) => updateLocaleValue('features', 'header.sub', value)}
                                  label="Sub Title"
                                  placeholder="GIỚI THIỆU SFB"
                                  defaultLocale={globalLocale}
                                  aiProvider={aiProvider}
                                />
                              </div>
                              <div>
                                <LocaleInput
                                  value={getLocaleValue(blocks['features']?.data, 'header.title')}
                                  onChange={(value) => updateLocaleValue('features', 'header.title', value)}
                                  label="Tiêu đề"
                                  placeholder="Chúng tôi là ai?"
                                  defaultLocale={globalLocale}
                                  aiProvider={aiProvider}
                                />
                              </div>
                              <div>
                                <LocaleInput
                                  value={getLocaleValue(blocks['features']?.data, 'header.description')}
                                  onChange={(value) => updateLocaleValue('features', 'header.description', value)}
                                  label="Mô tả"
                                  placeholder="Mô tả..."
                                  multiline={true}
                                  defaultLocale={globalLocale}
                                  aiProvider={aiProvider}
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Blocks</h3>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const blocks = getBlockData('features', 'blocks', []) as any[];
                                    addArrayItem('features', 'blocks', {
                                      type: 'type1', // type1: có text + list, type2: có items
                                      image: '',
                                      imageSide: 'left', // 'left' hoặc 'right'
                                      text: '',
                                      list: [],
                                      button: { text: '', link: '' },
                                      items: [],
                                    });
                                    setEditingFeatureBlockIndex(blocks.length);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Thêm block
                                </Button>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                {(getBlockData('features', 'blocks', []) as any[]).map((featureBlock: any, idx: number) => (
                                  <Card key={idx}>
                                    <CardHeader>
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base text-sm">Block {idx + 1}</CardTitle>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => moveArrayItem('features', 'blocks', idx, 'up')}
                                            disabled={idx === 0}
                                          >
                                            <ChevronUp className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => moveArrayItem('features', 'blocks', idx, 'down')}
                                            disabled={idx === (getBlockData('features', 'blocks', []) as any[]).length - 1}
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setEditingFeatureBlockIndex(idx)}
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => removeArrayItem('features', 'blocks', idx)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <p className="font-medium text-xs">{featureBlock.type === 'type1' ? 'Type 1' : 'Type 2'}</p>
                                        {featureBlock.image && (
                                          <div className="w-full aspect-video overflow-hidden rounded border border-gray-200">
                                            <img src={featureBlock.image} alt="Block" className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        {featureBlock.text && (
                                          <p className="text-xs text-gray-600 line-clamp-2">
                                            {getLocalizedText(featureBlock.text, globalLocale) || 'Chưa có nội dung'}
                                          </p>
                                        )}
                                        {featureBlock.items && featureBlock.items.length > 0 && (
                                          <p className="text-xs text-gray-600">{featureBlock.items.length} items</p>
                                        )}
                                        {featureBlock.list && featureBlock.list.length > 0 && (
                                          <p className="text-xs text-gray-600">{featureBlock.list.length} list items</p>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="mb-2">Kích hoạt</Label>
                              <Switch
                                checked={block.isActive}
                                onCheckedChange={(checked) => setBlocks(prev => ({
                                  ...prev,
                                  [blockType]: { ...prev[blockType], isActive: checked }
                                }))}
                              />
                            </div>
                          </>
                        )}

                        {blockType === 'solutions' && (
                          <>
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg">Header</h3>
                              <div>
                                <LocaleInput
                                  value={getLocaleValue(blocks['solutions']?.data, 'subHeader')}
                                  onChange={(value) => updateLocaleValue('solutions', 'subHeader', value)}
                                  label="Sub Header"
                                  placeholder="GIẢI PHÁP CHUYÊN NGHIỆP"
                                  defaultLocale={globalLocale}
                                  aiProvider={aiProvider}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <LocaleInput
                                    value={getLocaleValue(blocks['solutions']?.data, 'title.part1')}
                                    onChange={(value) => updateLocaleValue('solutions', 'title.part1', value)}
                                    label="Tiêu đề phần 1"
                                    placeholder="Giải pháp phần mềm"
                                    defaultLocale={globalLocale}
                                    aiProvider={aiProvider}
                                  />
                                </div>
                                <div>
                                  <LocaleInput
                                    value={getLocaleValue(blocks['solutions']?.data, 'title.part2')}
                                    onChange={(value) => updateLocaleValue('solutions', 'title.part2', value)}
                                    label="Tiêu đề phần 2"
                                    placeholder="đóng gói cho nhiều lĩnh vực"
                                    defaultLocale={globalLocale}
                                    aiProvider={aiProvider}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="mb-2">Domains (Lĩnh vực)</Label>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const domains = getBlockData('solutions', 'domains', []) as any[];
                                      updateBlockData('solutions', 'domains', [...domains, { vi: '', en: '', ja: '' }]);
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm
                                  </Button>
                                </div>
                                {(getBlockData('solutions', 'domains', []) as any[]).map((domain, idx) => (
                                  <div key={idx} className="flex gap-2">
                                    <div className="flex-1">
                                      <LocaleInput
                                        value={getLocaleValue(domain, '')}
                                        onChange={(value) => {
                                          const domains = getBlockData('solutions', 'domains', []) as any[];
                                          const newDomains = [...domains];
                                          newDomains[idx] = value;
                                          updateBlockData('solutions', 'domains', newDomains);
                                        }}
                                        label={`Lĩnh vực ${idx + 1}`}
                                        placeholder="Lĩnh vực..."
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="mt-6"
                                      onClick={() => {
                                        const domains = getBlockData('solutions', 'domains', []) as any[];
                                        updateBlockData('solutions', 'domains', domains.filter((_, i) => i !== idx));
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Solution Items</h3>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const items = getBlockData('solutions', 'items', []) as any[];
                                    addArrayItem('solutions', 'items', {
                                      id: items.length + 1,
                                      iconName: 'Code',
                                      title: '',
                                      description: '',
                                      benefits: [],
                                      buttonText: '',
                                      buttonLink: '',
                                      iconGradient: 'from-cyan-400 to-blue-600',
                                    });
                                    setEditingSolutionIndex(items.length);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Thêm solution
                                </Button>
                              </div>
                              {(getBlockData('solutions', 'items', []) as any[]).map((item: any, idx: number) => (
                                <Card key={idx}>
                                  <CardHeader>
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-base">Solution {idx + 1}</CardTitle>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => moveArrayItem('solutions', 'items', idx, 'up')}
                                          disabled={idx === 0}
                                        >
                                          <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => moveArrayItem('solutions', 'items', idx, 'down')}
                                          disabled={idx === (getBlockData('solutions', 'items', []) as any[]).length - 1}
                                        >
                                          <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => setEditingSolutionIndex(idx)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => removeArrayItem('solutions', 'items', idx)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <p className="font-medium">{getLocalizedText(item.title, globalLocale) || 'Chưa có tiêu đề'}</p>
                                      <p className="text-sm text-gray-600 line-clamp-2">{getLocalizedText(item.description, globalLocale) || 'Chưa có mô tả'}</p>
                                      <div className="flex flex-wrap gap-1">
                                        {(item.benefits || []).slice(0, 3).map((b: any, bidx: number) => (
                                          <Badge key={bidx} variant="secondary">
                                            {getLocalizedText(b, globalLocale)}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="mb-2">Kích hoạt</Label>
                              <Switch
                                checked={block.isActive}
                                onCheckedChange={(checked) => setBlocks(prev => ({
                                  ...prev,
                                  [blockType]: { ...prev[blockType], isActive: checked }
                                }))}
                              />
                            </div>
                          </>
                        )}

                        {blockType === 'trusts' && (
                          <>
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg">Header</h3>
                              <div>
                                <LocaleInput
                                  value={getLocaleValue(blocks['trusts']?.data, 'subHeader')}
                                  onChange={(value) => updateLocaleValue('trusts', 'subHeader', value)}
                                  label="Sub Header"
                                  placeholder="SFB TECHNOLOGY"
                                  defaultLocale={globalLocale}
                                  aiProvider={aiProvider}
                                />
                              </div>
                              <div>
                                <LocaleInput
                                  value={getLocaleValue(blocks['trusts']?.data, 'title')}
                                  onChange={(value) => updateLocaleValue('trusts', 'title', value)}
                                  label="Tiêu đề"
                                  placeholder="Độ tin cậy của SFB Technology"
                                  defaultLocale={globalLocale}
                                  aiProvider={aiProvider}
                                />
                              </div>
                              <div>
                                <LocaleInput
                                  value={getLocaleValue(blocks['trusts']?.data, 'description')}
                                  onChange={(value) => updateLocaleValue('trusts', 'description', value)}
                                  label="Mô tả"
                                  placeholder="Mô tả..."
                                  multiline={true}
                                  defaultLocale={globalLocale}
                                  aiProvider={aiProvider}
                                />
                              </div>
                              <div>
                                <Label className="mb-2">Hình ảnh</Label>
                                <ImageUpload
                                  currentImage={getBlockData('trusts', 'image')}
                                  onImageSelect={(url: string) => updateBlockData('trusts', 'image', url)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <LocaleInput
                                    value={getLocaleValue(blocks['trusts']?.data, 'button.text')}
                                    onChange={(value) => updateLocaleValue('trusts', 'button.text', value)}
                                    label="Nút - Text"
                                    placeholder="Tìm hiểu thêm"
                                    defaultLocale={globalLocale}
                                    aiProvider={aiProvider}
                                  />
                                </div>
                                <div>
                                  <Label className="mb-2">Nút - Link</Label>
                                  <Input
                                    value={getBlockData('trusts', 'button.link')}
                                    onChange={(e) => updateBlockData('trusts', 'button.link', e.target.value)}
                                    placeholder="/about"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Features</h3>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const features = getBlockData('trusts', 'features', []) as any[];
                                    addArrayItem('trusts', 'features', {
                                      iconName: 'BarChart3',
                                      title: '',
                                      description: '',
                                    });
                                    setEditingTrustFeatureIndex(features.length);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Thêm feature
                                </Button>
                              </div>
                              {(getBlockData('trusts', 'features', []) as any[]).map((feature: any, idx: number) => (
                                <Card key={idx}>
                                  <CardHeader>
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-base">Feature {idx + 1}</CardTitle>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => moveArrayItem('trusts', 'features', idx, 'up')}
                                          disabled={idx === 0}
                                        >
                                          <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => moveArrayItem('trusts', 'features', idx, 'down')}
                                          disabled={idx === (getBlockData('trusts', 'features', []) as any[]).length - 1}
                                        >
                                          <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => setEditingTrustFeatureIndex(idx)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => removeArrayItem('trusts', 'features', idx)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <p className="font-medium">{getLocalizedText(feature.title, globalLocale) || 'Chưa có tiêu đề'}</p>
                                      <p className="text-sm text-gray-600 line-clamp-2">{getLocalizedText(feature.description, globalLocale) || 'Chưa có mô tả'}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="mb-2">Kích hoạt</Label>
                              <Switch
                                checked={block.isActive}
                                onCheckedChange={(checked) => setBlocks(prev => ({
                                  ...prev,
                                  [blockType]: { ...prev[blockType], isActive: checked }
                                }))}
                              />
                            </div>
                          </>
                        )}

                        {blockType === 'testimonials' && (
                          <>
                            <div>
                              <LocaleInput
                                value={getLocaleValue(blocks['testimonials']?.data, 'title')}
                                onChange={(value) => updateLocaleValue('testimonials', 'title', value)}
                                label="Tiêu đề"
                                placeholder="Khách hàng nói về SFB?"
                                defaultLocale={globalLocale}
                                aiProvider={aiProvider}
                              />
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Reviews (Đánh giá)</h3>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const reviews = getBlockData('testimonials', 'reviews', []) as any[];
                                    addArrayItem('testimonials', 'reviews', {
                                      id: reviews.length + 1,
                                      quote: '',
                                      author: '',
                                      rating: 5,
                                    });
                                    setEditingTestimonialIndex(reviews.length);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Thêm review
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {(getBlockData('testimonials', 'reviews', []) as any[]).map((review: any, idx: number) => (
                                  <Card key={idx}>
                                    <CardHeader>
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Review {idx + 1}</CardTitle>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => moveArrayItem('testimonials', 'reviews', idx, 'up')}
                                            disabled={idx === 0}
                                          >
                                            <ChevronUp className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => moveArrayItem('testimonials', 'reviews', idx, 'down')}
                                            disabled={idx === (getBlockData('testimonials', 'reviews', []) as any[]).length - 1}
                                          >
                                            <ChevronDown className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setEditingTestimonialIndex(idx)}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeArrayItem('testimonials', 'reviews', idx)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <p className="font-medium text-sm">
                                          {getLocalizedText(review.author as any, globalLocale) || 'Chưa có tác giả'}
                                        </p>
                                        <p className="text-xs text-gray-600 line-clamp-2">
                                          {getLocalizedText(review.quote as any, globalLocale) || 'Chưa có nội dung'}
                                        </p>
                                        <div className="flex gap-1">
                                          {[...Array(review.rating || 5)].map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                          ))}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="mb-2">Kích hoạt</Label>
                              <Switch
                                checked={block.isActive}
                                onCheckedChange={(checked) => setBlocks(prev => ({
                                  ...prev,
                                  [blockType]: { ...prev[blockType], isActive: checked }
                                }))}
                              />
                            </div>
                          </>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview - {tabConfig?.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {blockType === 'hero' && (
                        <div className="relative overflow-hidden rounded-lg bg-[#F4FAFE] min-h-[600px] p-8">
                          {/* Background blobs */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-[#006FB3]/20 rounded-full blur-3xl opacity-30" />
                            <div className="absolute top-40 right-10 w-72 h-72 bg-[#0088D9]/20 rounded-full blur-3xl opacity-30" />
                          </div>

                          <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
                            <div className="space-y-6">
                              <h1 className="text-[#0F172A] font-bold text-4xl md:text-5xl lg:text-[56px] leading-tight">
                                {getBlockData('hero', 'title.line1', 'Chuyển đổi số ')}
                                <br />
                                {getBlockData('hero', 'title.line2', 'Thông minh ')}
                                <br />
                                {getBlockData('hero', 'title.line3', 'Cho doanh nghiệp')}
                              </h1>
                              <p className="text-[#0F172A] text-base md:text-lg max-w-[486px]">
                                {getBlockData('hero', 'description', 'Mô tả...')}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                  href={getBlockData('hero', 'primaryButton.link', '#')}
                                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
                                  style={{
                                    background: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                                  }}
                                >
                                  {getBlockData('hero', 'primaryButton.text', 'Khám phá giải pháp')}
                                  <ArrowRight size={20} />
                                </a>
                                <a
                                  href={getBlockData('hero', 'secondaryButton.link', '#')}
                                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1D8FCF] text-[#1D8FCF] font-semibold hover:bg-[#1D8FCF] hover:text-white transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center">
                                    <Play size={14} className="text-white ml-0.5" />
                                  </div>
                                  {getBlockData('hero', 'secondaryButton.text', 'Xem video')}
                                </a>
                              </div>
                            </div>
                            <div className="relative">
                              {getBlockData('hero', 'heroImage') && (
                                <div className="relative rounded-3xl border-8 border-white shadow-2xl overflow-hidden">
                                  <img
                                    src={getBlockData('hero', 'heroImage')}
                                    alt="Hero"
                                    className="w-full h-auto"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          {(getBlockData('hero', 'partners', []) as string[]).length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-200">
                              <p className="text-sm text-gray-600 mb-4 text-center">Đối tác</p>
                              <div className="flex flex-wrap gap-4 justify-center">
                                {(getBlockData('hero', 'partners', []) as string[]).map((partner, idx) => (
                                  <div key={idx} className="h-16 w-auto">
                                    <img
                                      src={partner}
                                      alt={`Partner ${idx + 1}`}
                                      className="h-full w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {blockType === 'aboutCompany' && (
                        <div className="bg-white py-12 rounded-lg">
                          <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] leading-tight mb-6">
                              {getBlockData('aboutCompany', 'title.part1', 'Chuyển đổi số ')}
                              <span className="text-[#1D8FCF]">{getBlockData('aboutCompany', 'title.highlight1', 'không bắt đầu từ phần mềm')}</span>
                              {getBlockData('aboutCompany', 'title.part2', ' mà ')}
                              <span className="text-[#1D8FCF]">{getBlockData('aboutCompany', 'title.highlight2', 'từ hiệu quả thực tế')}</span>
                              {getBlockData('aboutCompany', 'title.part3', ' của doanh nghiệp.')}
                            </h2>
                            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                              {getBlockData('aboutCompany', 'description', 'Mô tả...')}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {(() => {
                              const slides = getBlockData('aboutCompany', 'slides', []);
                              return Array.isArray(slides) ? slides.slice(0, 3).map((slide: any, idx: number) => (
                              <div key={idx} className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                                {slide.image && (
                                  <div className="mb-4 rounded-lg overflow-hidden" style={{ height: '200px' }}>
                                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <h3 className="font-semibold text-lg mb-2">{getLocalizedText(slide.title, globalLocale) || 'Tiêu đề'}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{getLocalizedText(slide.description, globalLocale) || 'Mô tả...'}</p>
                                <a
                                  href={slide.buttonLink || '#'}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
                                  style={{
                                    background: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                                  }}
                                >
                                  {slide.buttonText || 'Xem thêm'}
                                </a>
                              </div>
                            )) : null;
                            })()}
                          </div>
                        </div>
                      )}

                      {blockType === 'features' && (
                        <div className="bg-gradient-to-b from-white to-[#F1F9FD] py-12 rounded-lg">
                          <div className="text-center mb-12">
                            <p className="text-[15px] font-medium uppercase text-[#1D8FCF] mb-4">
                              {getBlockData('features', 'header.sub', 'GIỚI THIỆU SFB')}
                            </p>
                            <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] font-bold text-[#0F172A] mb-4">
                              {getBlockData('features', 'header.title', 'Chúng tôi là ai?')}
                            </h2>
                            <p className="mx-auto max-w-3xl text-[16px] text-[#0F172A]">
                              {getBlockData('features', 'header.description', 'Mô tả...')}
                            </p>
                          </div>
                          <div className="space-y-8">
                            {/* Render blocks from array */}
                            {(getBlockData('features', 'blocks', []) as any[]).map((featureBlock: any, blockIdx: number) => {
                              const imageSide = featureBlock.imageSide || 'left';
                              const imageElement = featureBlock.image ? (
                                <div>
                                  <img
                                    src={featureBlock.image}
                                    alt="Feature"
                                    className="w-full rounded-2xl border-4 border-white shadow-lg"
                                  />
                                </div>
                              ) : null;

                              if (featureBlock.type === 'type1') {
                                return (
                                  <div key={blockIdx} className="grid lg:grid-cols-2 gap-8 items-center">
                                    {imageSide === 'left' && imageElement}
                                    <div className={imageSide === 'right' ? 'order-1' : ''}>
                                      <div className="bg-white rounded-2xl p-6 shadow-lg">
                                        {featureBlock.text && (
                                          <p className="text-slate-700 mb-4">{featureBlock.text}</p>
                                        )}
                                        <div className="space-y-2 mb-4">
                                          {((featureBlock.list || []) as any[]).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                              <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0" />
                                              <span className="font-medium">{getLocalizedText(item, globalLocale)}</span>
                                            </div>
                                          ))}
                                        </div>
                                        {featureBlock.button?.text && (
                                          <a
                                            href={featureBlock.button.link || '#'}
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold"
                                            style={{
                                              background: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                                            }}
                                          >
                                            {featureBlock.button.text}
                                            <ArrowRight className="h-4 w-4" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                    {imageSide === 'right' && <div className="order-2">{imageElement}</div>}
                                  </div>
                                );
                              } else if (featureBlock.type === 'type2') {
                                return (
                                  <div key={blockIdx} className="grid lg:grid-cols-2 gap-8 items-center">
                                    {imageSide === 'left' && imageElement}
                                    <div className={imageSide === 'right' ? 'order-1' : ''}>
                                      <div className="bg-white rounded-2xl p-6 shadow-lg">
                                        <div className="space-y-4 mb-4">
                                          {((featureBlock.items || []) as any[]).map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-3">
                                              <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                              <div>
                                                <h3 className="font-semibold text-base mb-1">{getLocalizedText(item.title, globalLocale) || 'Tiêu đề'}</h3>
                                                <p className="text-slate-600 text-sm">{getLocalizedText(item.text, globalLocale) || 'Nội dung...'}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        {featureBlock.button?.text && (
                                          <a
                                            href={featureBlock.button.link || '#'}
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold"
                                            style={{
                                              background: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                                            }}
                                          >
                                            {featureBlock.button.text}
                                            <ArrowRight className="h-4 w-4" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                    {imageSide === 'right' && <div className="order-2">{imageElement}</div>}
                                  </div>
                                );
                              }
                              return null;
                            })}
                            {/* Fallback: Show old block1/2/3 if blocks array is empty */}
                            {(!getBlockData('features', 'blocks', []) || (getBlockData('features', 'blocks', []) as any[]).length === 0) && (
                              <>
                                {getBlockData('features', 'block1.image') && (
                                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                                    <div>
                                      <img
                                        src={getBlockData('features', 'block1.image')}
                                        alt="Feature"
                                        className="w-full rounded-2xl border-4 border-white shadow-lg"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-slate-700 mb-4">{getBlockData('features', 'block1.text', 'Nội dung...')}</p>
                                      <div className="space-y-2 mb-4">
                                        {(getBlockData('features', 'block1.list', []) as any[]).map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-sky-500" />
                                            <span className="font-medium">{getLocalizedText(item, globalLocale)}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <a
                                        href={getBlockData('features', 'block1.button.link', '#')}
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold"
                                        style={{
                                          background: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                                        }}
                                      >
                                        {getBlockData('features', 'block1.button.text', 'Tìm hiểu thêm')}
                                        <ArrowRight className="h-4 w-4" />
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {blockType === 'solutions' && (
                        <div
                          className="py-12 rounded-lg"
                          style={{
                            background: "linear-gradient(236.99deg, #80C0E4 7%, #1D8FCF 71.94%)",
                          }}
                        >
                          <div className="text-center mb-12">
                            <div className="text-white/85 text-xs font-semibold tracking-widest uppercase mb-4">
                              {getBlockData('solutions', 'subHeader', 'GIẢI PHÁP CHUYÊN NGHIỆP')}
                            </div>
                            <h2 className="text-white font-extrabold text-3xl md:text-5xl mb-4">
                              {getBlockData('solutions', 'title.part1', 'Giải pháp phần mềm')}
                              <br />
                              <span className="font-medium">{getBlockData('solutions', 'title.part2', 'đóng gói cho nhiều lĩnh vực')}</span>
                            </h2>
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                              {(getBlockData('solutions', 'domains', []) as any[]).map((domain, idx) => (
                                <span
                                  key={idx}
                                  className="px-4 py-2 rounded-full text-sm text-white/90 border border-white/35 bg-white/10"
                                >
                                  {getLocalizedText(domain, globalLocale)}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-6 px-4">
                            {(getBlockData('solutions', 'items', []) as any[]).slice(0, 4).map((item: any, idx: number) => {
                              const IconComponent = (LucideIcons as any)[item.iconName || 'Code'] || LucideIcons.Code;
                              return (
                                <div
                                  key={idx}
                                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200"
                                >
                                  <div className="flex flex-col gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.iconGradient || 'from-blue-500 to-cyan-500'}`}>
                                      <IconComponent className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-gray-900 font-extrabold text-lg">{getLocalizedText(item.title, globalLocale) || 'Tiêu đề'}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{getLocalizedText(item.description, globalLocale) || 'Mô tả...'}</p>
                                    <ul className="space-y-1.5">
                                      {(item.benefits || []).map((benefit: any, bidx: number) => (
                                        <li key={bidx} className="flex items-start gap-2">
                                          <span className="text-[#1D8FCF] mt-1 text-xs">•</span>
                                          <span className="text-gray-600 text-xs">{getLocalizedText(benefit, globalLocale)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <a
                                      href={item.buttonLink || '#'}
                                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs w-fit mt-2"
                                      style={{
                                        background: "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                                      }}
                                    >
                                      {item.buttonText || 'Xem thêm'}
                                      <ArrowRight size={16} />
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {blockType === 'trusts' && (
                        <div className="bg-white py-12 rounded-lg">
                          <div className="text-center mb-12">
                            <span className="text-[#0088D9] font-bold text-sm tracking-widest uppercase mb-3 block">
                              {getBlockData('trusts', 'subHeader', 'SFB TECHNOLOGY')}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4">
                              {getBlockData('trusts', 'title', 'Độ tin cậy của SFB Technology')}
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                              {getBlockData('trusts', 'description', 'Mô tả...')}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-12 items-center">
                            <div className="relative">
                              {getBlockData('trusts', 'image') && (
                                <div
                                  className="rounded-3xl shadow-2xl"
                                  style={{
                                    width: '100%',
                                    aspectRatio: '5/4',
                                    background: `url(${getBlockData('trusts', 'image')}) center/cover`,
                                  }}
                                />
                              )}
                            </div>
                            <div className="space-y-6">
                              {(getBlockData('trusts', 'features', []) as any[]).map((feature: any, idx: number) => (
                                <div key={idx} className="flex gap-4">
                                  <div className="flex-shrink-0 pt-1">
                                    {renderIcon(feature.iconName || 'BarChart3')}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg mb-2">{getLocalizedText(feature.title, globalLocale) || 'Tiêu đề'}</h3>
                                    <p className="text-gray-600 text-sm">{getLocalizedText(feature.description, globalLocale) || 'Mô tả...'}</p>
                                  </div>
                                </div>
                              ))}
                              <a
                                href={getBlockData('trusts', 'button.link', '#')}
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white font-semibold"
                              >
                                {getBlockData('trusts', 'button.text', 'Tìm hiểu thêm')}
                                <ArrowRight className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {blockType === 'testimonials' && (
                        <div className="bg-[#eff8ff] py-12 rounded-lg">
                          <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
                              {getBlockData('testimonials', 'title', 'Khách hàng nói về SFB?')}
                            </h2>
                          </div>
                          <div className="flex flex-wrap gap-4 justify-center px-4">
                            {(getBlockData('testimonials', 'reviews', []) as any[]).slice(0, 4).map((review: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 w-full max-w-[300px]"
                              >
                                <div className="flex gap-1">
                                  {[...Array(review.rating || 5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                                  ))}
                                </div>
                                <p className="text-[#334155] text-sm leading-relaxed line-clamp-4">
                                  "{getLocalizedText(review.quote, globalLocale) || 'Nội dung đánh giá...'}"
                                </p>
                                <div className="font-bold text-[#0F172A] text-sm mt-auto">
                                  {review.author || 'Tác giả'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {blockType === 'consult' && (
                        <div className="py-10 px-4 flex justify-center">
                          <div
                            className="flex flex-col justify-center items-center w-full max-w-[1298px] py-[80px] px-[20px] rounded-2xl text-center shadow-lg"
                            style={{ backgroundColor: '#29A3DD' }}
                          >
                            <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">
                              {getBlockData('consult', 'title', 'Miễn phí tư vấn')}
                            </h2>
                            <p className="text-white/95 text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-medium">
                              {getBlockData('consult', 'description', 'Mô tả...')}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              <a
                                href={getBlockData('consult', 'buttons.secondary.link', '#')}
                                className="flex h-[48px] px-[29px] py-[7px] justify-center items-center gap-[12px] rounded-xl border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors"
                              >
                                {getBlockData('consult', 'buttons.secondary.text', 'Xem case studies')}
                              </a>
                              <a
                                href={getBlockData('consult', 'buttons.primary.link', '#')}
                                className="group flex h-[48px] px-[29px] py-[7px] justify-center items-center gap-[12px] rounded-xl border border-white text-white font-medium hover:bg-white hover:text-[#29A3DD] transition-colors"
                              >
                                <span>{getBlockData('consult', 'buttons.primary.text', 'Tư vấn miễn phí ngay')}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Dialog for AboutCompany Slides */}
      <Dialog open={editingSlideIndex !== null} onOpenChange={(open) => {
        if (!open) setEditingSlideIndex(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ maxWidth: '60rem' }}>
          <DialogHeader>
            <DialogTitle>
              {editingSlideIndex !== null && (() => {
                const slides = getBlockData('aboutCompany', 'slides', []);
                return Array.isArray(slides) && editingSlideIndex >= slides.length;
              })()
                ? "Thêm slide mới"
                : "Chỉnh sửa slide"}
            </DialogTitle>
          </DialogHeader>
          {editingSlideIndex !== null && (() => {
            const slides = getBlockData('aboutCompany', 'slides', []) as any[];
            const slide = slides[editingSlideIndex] || { title: '', description: '', buttonText: '', buttonLink: '', image: '' };
            return (
              <div className="space-y-4 py-4">
                <LocaleInput
                  value={getLocaleValue(slide, 'title')}
                  onChange={(value) => {
                    const newSlides = [...slides];
                    if (!newSlides[editingSlideIndex]) newSlides[editingSlideIndex] = {};
                    const updatedSlide = setLocaleValue(newSlides[editingSlideIndex], 'title', value);
                    newSlides[editingSlideIndex] = updatedSlide;
                    updateBlockData('aboutCompany', 'slides', newSlides);
                  }}
                  label="Tiêu đề"
                  placeholder="Tiêu đề slide"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                <LocaleInput
                  value={getLocaleValue(slide, 'description')}
                  onChange={(value) => {
                    const newSlides = [...slides];
                    if (!newSlides[editingSlideIndex]) newSlides[editingSlideIndex] = {};
                    const updatedSlide = setLocaleValue(newSlides[editingSlideIndex], 'description', value);
                    newSlides[editingSlideIndex] = updatedSlide;
                    updateBlockData('aboutCompany', 'slides', newSlides);
                  }}
                  label="Mô tả"
                  placeholder="Mô tả..."
                  multiline={true}
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                <div>
                  <Label className="mb-2">Hình ảnh</Label>
                  <ImageUpload
                    currentImage={slide.image || ''}
                    onImageSelect={(url: string) => {
                      const newSlides = [...slides];
                      if (!newSlides[editingSlideIndex]) newSlides[editingSlideIndex] = {};
                      newSlides[editingSlideIndex].image = url;
                      updateBlockData('aboutCompany', 'slides', newSlides);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <LocaleInput
                      value={getLocaleValue(slide, 'buttonText')}
                      onChange={(value) => {
                        const newSlides = [...slides];
                        if (!newSlides[editingSlideIndex]) newSlides[editingSlideIndex] = {};
                        const updatedSlide = setLocaleValue(newSlides[editingSlideIndex], 'buttonText', value);
                        newSlides[editingSlideIndex] = updatedSlide;
                        updateBlockData('aboutCompany', 'slides', newSlides);
                      }}
                      label="Nút - Text"
                      placeholder="Nhận tư vấn ngay"
                    />
                  </div>
                  <div>
                    <Label className="mb-2">Nút - Link</Label>
                    <Input
                      value={slide.buttonLink || ''}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        if (!newSlides[editingSlideIndex]) newSlides[editingSlideIndex] = {};
                        newSlides[editingSlideIndex].buttonLink = e.target.value;
                        updateBlockData('aboutCompany', 'slides', newSlides);
                      }}
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSlideIndex(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Solutions Items */}
      <Dialog open={editingSolutionIndex !== null} onOpenChange={(open) => {
        if (!open) setEditingSolutionIndex(null);
      }}>
        <DialogContent style={{ maxWidth: '80rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle>
              {editingSolutionIndex !== null && editingSolutionIndex >= (getBlockData('solutions', 'items', []) as any[]).length
                ? "Thêm solution mới"
                : "Chỉnh sửa solution"}
            </DialogTitle>
          </DialogHeader>
          {editingSolutionIndex !== null && (() => {
            const items = getBlockData('solutions', 'items', []) as any[];
            const item = items[editingSolutionIndex] || {
              id: items.length + 1,
              iconName: 'Code',
              title: '',
              description: '',
              benefits: [],
              buttonText: '',
              buttonLink: '',
              iconGradient: 'from-cyan-400 to-blue-600',
            };
            return (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2">Icon</Label>
                    <Select
                      value={item.iconName || 'Code'}
                      onValueChange={(value) => {
                        const newItems = [...items];
                        if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                        newItems[editingSolutionIndex].iconName = value;
                        updateBlockData('solutions', 'items', newItems);
                      }}
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
                    <Label className="mb-2">Icon Gradient</Label>
                    <Select
                      value={item.iconGradient || 'from-cyan-400 to-blue-600'}
                      onValueChange={(value) => {
                        const newItems = [...items];
                        if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                        newItems[editingSolutionIndex].iconGradient = value;
                        updateBlockData('solutions', 'items', newItems);
                      }}
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
                </div>
                <LocaleInput
                  value={getLocaleValue(item, 'title')}
                  onChange={(value) => {
                    const newItems = [...items];
                    if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                    const updatedItem = setLocaleValue(newItems[editingSolutionIndex], 'title', value);
                    newItems[editingSolutionIndex] = updatedItem;
                    updateBlockData('solutions', 'items', newItems);
                  }}
                  label="Tiêu đề"
                  placeholder="Quy trình được chuẩn hóa"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                <LocaleInput
                  value={getLocaleValue(item, 'description')}
                  onChange={(value) => {
                    const newItems = [...items];
                    if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                    const updatedItem = setLocaleValue(newItems[editingSolutionIndex], 'description', value);
                    newItems[editingSolutionIndex] = updatedItem;
                    updateBlockData('solutions', 'items', newItems);
                  }}
                  label="Mô tả"
                  placeholder="Mô tả..."
                  multiline={true}
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="mb-2">Benefits</Label>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newItems = [...items];
                        if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                        if (!newItems[editingSolutionIndex].benefits) newItems[editingSolutionIndex].benefits = [];
                        newItems[editingSolutionIndex].benefits.push({ vi: '', en: '', ja: '' });
                        updateBlockData('solutions', 'items', newItems);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  </div>
                  {((item.benefits || []) as any[]).map((benefit, bidx) => (
                    <div key={bidx} className="flex gap-2">
                      <div className="flex-1">
                        <LocaleInput
                          value={getLocaleValue(benefit, '')}
                          onChange={(value) => {
                            const newItems = [...items];
                            if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                            if (!newItems[editingSolutionIndex].benefits) newItems[editingSolutionIndex].benefits = [];
                            newItems[editingSolutionIndex].benefits[bidx] = value;
                            updateBlockData('solutions', 'items', newItems);
                          }}
                          label={`Benefit ${bidx + 1}`}
                          placeholder="Benefit..."
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="mt-6"
                        onClick={() => {
                          const newItems = [...items];
                          if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                          if (!newItems[editingSolutionIndex].benefits) newItems[editingSolutionIndex].benefits = [];
                          newItems[editingSolutionIndex].benefits = newItems[editingSolutionIndex].benefits.filter((_: any, i: number) => i !== bidx);
                          updateBlockData('solutions', 'items', newItems);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <LocaleInput
                      value={getLocaleValue(item, 'buttonText')}
                      onChange={(value) => {
                        const newItems = [...items];
                        if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                        const updatedItem = setLocaleValue(newItems[editingSolutionIndex], 'buttonText', value);
                        newItems[editingSolutionIndex] = updatedItem;
                        updateBlockData('solutions', 'items', newItems);
                      }}
                      label="Nút - Text"
                      placeholder="Tìm hiểu cách SFB triển khai"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                  </div>
                  <div>
                    <Label className="mb-2">Nút - Link</Label>
                    <Input
                      value={item.buttonLink || ''}
                      onChange={(e) => {
                        const newItems = [...items];
                        if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                        newItems[editingSolutionIndex].buttonLink = e.target.value;
                        updateBlockData('solutions', 'items', newItems);
                      }}
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSolutionIndex(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Trusts Features */}
      <Dialog open={editingTrustFeatureIndex !== null} onOpenChange={(open) => {
        if (!open) setEditingTrustFeatureIndex(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ maxWidth: '42rem' }}>
          <DialogHeader>
            <DialogTitle>
              {editingTrustFeatureIndex !== null && editingTrustFeatureIndex >= (getBlockData('trusts', 'features', []) as any[]).length
                ? "Thêm feature mới"
                : "Chỉnh sửa feature"}
            </DialogTitle>
          </DialogHeader>
          {editingTrustFeatureIndex !== null && (() => {
            const features = getBlockData('trusts', 'features', []) as any[];
            const feature = features[editingTrustFeatureIndex] || { iconName: 'BarChart3', title: '', description: '' };
            return (
              <div className="space-y-4 py-4">
                <div>
                  <Label className="mb-2">Icon</Label>
                  <Select
                    value={feature.iconName || 'BarChart3'}
                    onValueChange={(value) => {
                      const newFeatures = [...features];
                      if (!newFeatures[editingTrustFeatureIndex]) newFeatures[editingTrustFeatureIndex] = {};
                      newFeatures[editingTrustFeatureIndex].iconName = value;
                      updateBlockData('trusts', 'features', newFeatures);
                    }}
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
                <LocaleInput
                  value={getLocaleValue(feature, 'title')}
                  onChange={(value) => {
                    const newFeatures = [...features];
                    if (!newFeatures[editingTrustFeatureIndex]) newFeatures[editingTrustFeatureIndex] = {};
                    const updatedFeature = setLocaleValue(newFeatures[editingTrustFeatureIndex], 'title', value);
                    newFeatures[editingTrustFeatureIndex] = updatedFeature;
                    updateBlockData('trusts', 'features', newFeatures);
                  }}
                  label="Tiêu đề"
                  placeholder="Năng lực được chứng minh"
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                <LocaleInput
                  value={getLocaleValue(feature, 'description')}
                  onChange={(value) => {
                    const newFeatures = [...features];
                    if (!newFeatures[editingTrustFeatureIndex]) newFeatures[editingTrustFeatureIndex] = {};
                    const updatedFeature = setLocaleValue(newFeatures[editingTrustFeatureIndex], 'description', value);
                    newFeatures[editingTrustFeatureIndex] = updatedFeature;
                    updateBlockData('trusts', 'features', newFeatures);
                  }}
                  label="Mô tả"
                  placeholder="Mô tả..."
                  multiline={true}
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTrustFeatureIndex(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Features Blocks */}
      <Dialog open={editingFeatureBlockIndex !== null} onOpenChange={(open) => {
        if (!open) setEditingFeatureBlockIndex(null);
      }}>
        <DialogContent style={{ maxWidth: '80rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle>
              {editingFeatureBlockIndex !== null && editingFeatureBlockIndex >= (getBlockData('features', 'blocks', []) as any[]).length
                ? "Thêm block mới"
                : "Chỉnh sửa block"}
            </DialogTitle>
          </DialogHeader>
          {editingFeatureBlockIndex !== null && (() => {
            const blocks = getBlockData('features', 'blocks', []) as any[];
            const featureBlock = blocks[editingFeatureBlockIndex] || {
              type: 'type1',
              image: '',
              imageSide: 'left',
              text: '',
              list: [],
              button: { text: '', link: '' },
              items: [],
            };
            return (
              <div className="space-y-4 py-4">
                <div>
                  <Label className="mb-2">Loại Block</Label>
                  <Select
                    value={featureBlock.type || 'type1'}
                    onValueChange={(value) => {
                      const newBlocks = [...blocks];
                      if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                      newBlocks[editingFeatureBlockIndex].type = value;
                      updateBlockData('features', 'blocks', newBlocks);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">Type 1: Text + List + Button</SelectItem>
                      <SelectItem value="type2">Type 2: Items + Button</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2">Hình ảnh</Label>
                  <ImageUpload
                    currentImage={featureBlock.image || ''}
                    onImageSelect={(url: string) => {
                      const newBlocks = [...blocks];
                      if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                      newBlocks[editingFeatureBlockIndex].image = url;
                      updateBlockData('features', 'blocks', newBlocks);
                    }}
                  />
                </div>
                <div>
                  <Label className="mb-2">Vị trí ảnh</Label>
                  <Select
                    value={featureBlock.imageSide || 'left'}
                    onValueChange={(value) => {
                      const newBlocks = [...blocks];
                      if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                      newBlocks[editingFeatureBlockIndex].imageSide = value;
                      updateBlockData('features', 'blocks', newBlocks);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Trái</SelectItem>
                      <SelectItem value="right">Phải</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {featureBlock.type === 'type1' && (
                  <>
                    <LocaleInput
                      value={getLocaleValue(featureBlock, 'text')}
                      onChange={(value) => {
                        const newBlocks = [...blocks];
                        if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                        const updatedBlock = setLocaleValue(newBlocks[editingFeatureBlockIndex], 'text', value);
                        newBlocks[editingFeatureBlockIndex] = updatedBlock;
                        updateBlockData('features', 'blocks', newBlocks);
                      }}
                      label="Nội dung"
                      placeholder="Nội dung..."
                      multiline={true}
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="mb-2">Danh sách điểm nổi bật</Label>
                        <Button
                          size="sm"
                          onClick={() => {
                            const newBlocks = [...blocks];
                            if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                            if (!newBlocks[editingFeatureBlockIndex].list) newBlocks[editingFeatureBlockIndex].list = [];
                            newBlocks[editingFeatureBlockIndex].list.push({ vi: '', en: '', ja: '' });
                            updateBlockData('features', 'blocks', newBlocks);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm
                        </Button>
                      </div>
                      {((featureBlock.list || []) as any[]).map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="flex-1">
                            <LocaleInput
                              value={getLocaleValue(item, '')}
                              onChange={(value) => {
                                const newBlocks = [...blocks];
                                if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                                if (!newBlocks[editingFeatureBlockIndex].list) newBlocks[editingFeatureBlockIndex].list = [];
                                newBlocks[editingFeatureBlockIndex].list[idx] = value;
                                updateBlockData('features', 'blocks', newBlocks);
                              }}
                              label={`Điểm ${idx + 1}`}
                              placeholder="Điểm nổi bật..."
                              defaultLocale={globalLocale}
                              aiProvider={aiProvider}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="mt-6"
                            onClick={() => {
                              const newBlocks = [...blocks];
                              if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                              if (!newBlocks[editingFeatureBlockIndex].list) newBlocks[editingFeatureBlockIndex].list = [];
                              newBlocks[editingFeatureBlockIndex].list = newBlocks[editingFeatureBlockIndex].list.filter((_: any, i: number) => i !== idx);
                              updateBlockData('features', 'blocks', newBlocks);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {featureBlock.type === 'type2' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="mb-2">Items</Label>
                      <Button
                        size="sm"
                        onClick={() => {
                          const newBlocks = [...blocks];
                          if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                          if (!newBlocks[editingFeatureBlockIndex].items) newBlocks[editingFeatureBlockIndex].items = [];
                          newBlocks[editingFeatureBlockIndex].items.push({ title: '', text: '' });
                          updateBlockData('features', 'blocks', newBlocks);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm item
                      </Button>
                    </div>
                    {((featureBlock.items || []) as any[]).map((item: any, idx: number) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="space-y-2 flex-1">
                              <LocaleInput
                                value={getLocaleValue(item, 'title')}
                                onChange={(value) => {
                                  const newBlocks = [...blocks];
                                  if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                                  if (!newBlocks[editingFeatureBlockIndex].items) newBlocks[editingFeatureBlockIndex].items = [];
                                  const updatedItem = setLocaleValue(newBlocks[editingFeatureBlockIndex].items[idx], 'title', value);
                                  newBlocks[editingFeatureBlockIndex].items[idx] = updatedItem;
                                  updateBlockData('features', 'blocks', newBlocks);
                                }}
                                label="Tiêu đề"
                                placeholder="Tiêu đề..."
                                className="text-sm"
                                defaultLocale={globalLocale}
                                aiProvider={aiProvider}
                              />
                              <LocaleInput
                                value={getLocaleValue(item, 'text')}
                                onChange={(value) => {
                                  const newBlocks = [...blocks];
                                  if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                                  if (!newBlocks[editingFeatureBlockIndex].items) newBlocks[editingFeatureBlockIndex].items = [];
                                  const updatedItem = setLocaleValue(newBlocks[editingFeatureBlockIndex].items[idx], 'text', value);
                                  newBlocks[editingFeatureBlockIndex].items[idx] = updatedItem;
                                  updateBlockData('features', 'blocks', newBlocks);
                                }}
                                label="Nội dung"
                                placeholder="Nội dung..."
                                multiline={true}
                                className="text-sm"
                                defaultLocale={globalLocale}
                                aiProvider={aiProvider}
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newBlocks = [...blocks];
                                if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                                if (!newBlocks[editingFeatureBlockIndex].items) newBlocks[editingFeatureBlockIndex].items = [];
                                newBlocks[editingFeatureBlockIndex].items = newBlocks[editingFeatureBlockIndex].items.filter((_: any, i: number) => i !== idx);
                                updateBlockData('features', 'blocks', newBlocks);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <LocaleInput
                      value={getLocaleValue(featureBlock.button, 'text')}
                      onChange={(value) => {
                        const newBlocks = [...blocks];
                        if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                        if (!newBlocks[editingFeatureBlockIndex].button) newBlocks[editingFeatureBlockIndex].button = {};
                        const updatedButton = setLocaleValue(newBlocks[editingFeatureBlockIndex].button, 'text', value);
                        newBlocks[editingFeatureBlockIndex].button = updatedButton;
                        updateBlockData('features', 'blocks', newBlocks);
                      }}
                      label="Nút - Text"
                      placeholder="Nút text..."
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                  </div>
                  <div>
                    <Label className="mb-2">Nút - Link</Label>
                    <Input
                      value={featureBlock.button?.link || ''}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                        if (!newBlocks[editingFeatureBlockIndex].button) newBlocks[editingFeatureBlockIndex].button = {};
                        newBlocks[editingFeatureBlockIndex].button.link = e.target.value;
                        updateBlockData('features', 'blocks', newBlocks);
                      }}
                      placeholder="/link"
                    />
                  </div>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFeatureBlockIndex(null)}>
              Đóng
            </Button>
            <Button onClick={() => {
              setEditingFeatureBlockIndex(null);
              toast.success('Đã lưu block thành công');
            }}>
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Testimonials Reviews */}
      <Dialog open={editingTestimonialIndex !== null} onOpenChange={(open) => {
        if (!open) setEditingTestimonialIndex(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ maxWidth: '42rem' }}>
          <DialogHeader>
            <DialogTitle>
              {editingTestimonialIndex !== null && editingTestimonialIndex >= (getBlockData('testimonials', 'reviews', []) as any[]).length
                ? "Thêm review mới"
                : "Chỉnh sửa review"}
            </DialogTitle>
          </DialogHeader>
          {editingTestimonialIndex !== null && (() => {
            const reviews = getBlockData('testimonials', 'reviews', []) as any[];
            const review = reviews[editingTestimonialIndex] || { id: reviews.length + 1, quote: '', author: '', rating: 5 };
            return (
              <div className="space-y-4 py-4">
                <LocaleInput
                  value={getLocaleValue(review, 'author')}
                  onChange={(value) => {
                    const newReviews = [...reviews];
                    if (!newReviews[editingTestimonialIndex]) newReviews[editingTestimonialIndex] = {};
                    const updatedReview = setLocaleValue(newReviews[editingTestimonialIndex], 'author', value);
                    newReviews[editingTestimonialIndex] = updatedReview;
                    updateBlockData('testimonials', 'reviews', newReviews);
                  }}
                  label="Tác giả"
                  placeholder="Ông Nguyễn Văn A"
                  defaultLocale={globalLocale}
                  aiProvider={aiProvider}
                />
                <LocaleInput
                  value={getLocaleValue(review, 'quote')}
                  onChange={(value) => {
                    const newReviews = [...reviews];
                    if (!newReviews[editingTestimonialIndex]) newReviews[editingTestimonialIndex] = {};
                    const updatedReview = setLocaleValue(newReviews[editingTestimonialIndex], 'quote', value);
                    newReviews[editingTestimonialIndex] = updatedReview;
                    updateBlockData('testimonials', 'reviews', newReviews);
                  }}
                  label="Nội dung đánh giá"
                  placeholder="Nội dung đánh giá..."
                  multiline={true}
                                      defaultLocale={globalLocale}
                                      aiProvider={aiProvider}
                                    />
                <div>
                  <Label className="mb-2">Đánh giá (1-5 sao)</Label>
                  <Select
                    value={String(review.rating || 5)}
                    onValueChange={(value) => {
                      const newReviews = [...reviews];
                      if (!newReviews[editingTestimonialIndex]) newReviews[editingTestimonialIndex] = {};
                      newReviews[editingTestimonialIndex].rating = parseInt(value);
                      updateBlockData('testimonials', 'reviews', newReviews);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 sao</SelectItem>
                      <SelectItem value="2">2 sao</SelectItem>
                      <SelectItem value="3">3 sao</SelectItem>
                      <SelectItem value="4">4 sao</SelectItem>
                      <SelectItem value="5">5 sao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTestimonialIndex(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Features Block2/Block3 Items */}
      <Dialog open={editingFeatureItemIndex !== null} onOpenChange={(open) => {
        if (!open) setEditingFeatureItemIndex(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ maxWidth: '42rem' }}>
          <DialogHeader>
            <DialogTitle>
              {editingFeatureItemIndex && editingFeatureItemIndex.index >= (getBlockData('features', `block${editingFeatureItemIndex.block === 'block2' ? '2' : '3'}.items`, []) as any[]).length
                ? "Thêm item mới"
                : "Chỉnh sửa item"}
            </DialogTitle>
          </DialogHeader>
          {editingFeatureItemIndex && (() => {
            const block = editingFeatureItemIndex.block;
            const items = getBlockData('features', `${block}.items`, []) as any[];
            const item = items[editingFeatureItemIndex.index] || { title: '', text: '' };
            return (
              <div className="space-y-4 py-4">
                <div>
                  <Label className="mb-2">Tiêu đề</Label>
                  <Input
                    value={item.title || ''}
                    onChange={(e) => {
                      const newItems = [...items];
                      if (!newItems[editingFeatureItemIndex.index]) newItems[editingFeatureItemIndex.index] = {};
                      newItems[editingFeatureItemIndex.index].title = e.target.value;
                      updateBlockData('features', `${block}.items`, newItems);
                    }}
                    placeholder="Tiêu đề..."
                  />
                </div>
                <div>
                  <Label className="mb-2">Nội dung</Label>
                  <Textarea
                    value={item.text || ''}
                    onChange={(e) => {
                      const newItems = [...items];
                      if (!newItems[editingFeatureItemIndex.index]) newItems[editingFeatureItemIndex.index] = {};
                      newItems[editingFeatureItemIndex.index].text = e.target.value;
                      updateBlockData('features', `${block}.items`, newItems);
                    }}
                    placeholder="Nội dung..."
                    rows={4}
                  />
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFeatureItemIndex(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Secondary Button Link Dialog */}
      <Dialog open={showSecondaryLinkDialog} onOpenChange={setShowSecondaryLinkDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chọn link cho nút phụ</DialogTitle>
            <DialogDescription>
              Bạn có thể nhập link thủ công hoặc chọn file từ thư viện Media
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex rounded-xl border bg-gray-100 p-1 gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={secondaryLinkTab === "url" ? "default" : "ghost"}
                  className="px-4"
                  onClick={() => setSecondaryLinkTab("url")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Nhập link
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={secondaryLinkTab === "media" ? "default" : "ghost"}
                  className="px-4"
                  onClick={() => setSecondaryLinkTab("media")}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Chọn từ Media Library
                </Button>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
              {secondaryLinkTab === "url" ? (
                <div className="space-y-4">
                  <div>
                    <Label>Nhập URL hoặc đường dẫn</Label>
                    <Input
                      value={getBlockData('hero', 'secondaryButton.link')}
                      onChange={(e) => updateBlockData('hero', 'secondaryButton.link', e.target.value)}
                      placeholder="/video hoặc https://youtube.com/..."
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Ví dụ: /video, https://youtube.com/watch?v=..., /uploads/media/file.mp4
                    </p>
                  </div>
                </div>
              ) : (
                <MediaLibraryPicker
                  fileTypeFilter="video,audio"
                  onSelectImage={(url) => {
                    updateBlockData('hero', 'secondaryButton.link', url);
                    setShowSecondaryLinkDialog(false);
                    toast.success("Đã chọn file từ Media Library");
                  }}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSecondaryLinkDialog(false)}>
              Đóng
            </Button>
            {secondaryLinkTab === "url" && (
              <Button onClick={() => setShowSecondaryLinkDialog(false)}>
                Xác nhận
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

