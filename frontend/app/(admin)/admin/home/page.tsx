"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Home, Sparkles, Users, Briefcase, ShieldCheck, MessageSquare, CheckCircle2, ArrowRight, Play, CheckCircle, LineChart, Code, Database, Cloud, BarChart3, FileCheck, Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
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

const BLOCK_TYPES = ['hero', 'aboutCompany', 'features', 'solutions', 'trusts', 'consult'] as const;
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
    consult: { sectionType: 'consult', data: {}, isActive: true },
  });
  const [loading, setLoading] = useState<Record<BlockType, boolean>>({
    hero: false,
    aboutCompany: false,
    features: false,
    solutions: false,
    trusts: false,
    consult: false,
  });
  const [activeTab, setActiveTab] = useState<BlockType>('hero');
  
  // State for editing array items
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [editingSolutionIndex, setEditingSolutionIndex] = useState<number | null>(null);
  const [editingTrustFeatureIndex, setEditingTrustFeatureIndex] = useState<number | null>(null);
  const [editingFeatureItemIndex, setEditingFeatureItemIndex] = useState<{ block: 'block2' | 'block3', index: number } | null>(null);
  const [editingFeatureBlockIndex, setEditingFeatureBlockIndex] = useState<number | null>(null);

  const tabsConfig = [
    { value: 'hero' as BlockType, label: 'Hero Banner', icon: Home, description: 'Banner đầu trang, tiêu đề..' },
    { value: 'aboutCompany' as BlockType, label: 'Giới thiệu công ty', icon: Users, description: 'Phần giới thiệu về công ty' },
    { value: 'features' as BlockType, label: 'Tính năng', icon: Sparkles, description: 'Các tính năng nổi bật' },
    { value: 'solutions' as BlockType, label: 'Giải pháp', icon: Briefcase, description: 'Các giải pháp chuyên nghiệp' },
    { value: 'trusts' as BlockType, label: 'Độ tin cậy', icon: ShieldCheck, description: 'Phần thể hiện độ tin cậy' },
    { value: 'consult' as BlockType, label: 'Tư vấn', icon: MessageSquare, description: 'Phần kêu gọi tư vấn' },
  ];

  useEffect(() => {
    void fetchAllBlocks();
  }, []);

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
          console.log(`Block ${blockType} not found, will use defaults`);
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
    let current: any = blocks[blockType].data;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    return current ?? defaultValue;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Trang chủ</h1>
          <p className="text-gray-600 mt-1">Quản lý đầy đủ các khối trên trang chủ</p>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all flex-1 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-2 border-blue-500"
                        : isCompleted
                        ? "bg-green-50 text-green-700 border-2 border-green-300"
                        : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                      isActive
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
                    <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
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
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{tabConfig?.label}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{tabConfig?.description}</p>
                        </div>
                        <Button 
                          onClick={() => handleSaveBlock(blockType)} 
                          disabled={loading[blockType]} 
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading[blockType] ? "Đang lưu..." : "Lưu"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Render form based on block type */}
                      {blockType === 'hero' && (
                        <>
                          <div>
                            <Label className="mb-2">Tiêu đề dòng 1</Label>
                            <Input
                              value={getBlockData('hero', 'title.line1')}
                              onChange={(e) => updateBlockData('hero', 'title.line1', e.target.value)}
                              placeholder="Chuyển đổi số "
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Tiêu đề dòng 2</Label>
                            <Input
                              value={getBlockData('hero', 'title.line2')}
                              onChange={(e) => updateBlockData('hero', 'title.line2', e.target.value)}
                              placeholder="Thông minh "
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Tiêu đề dòng 3</Label>
                            <Input
                              value={getBlockData('hero', 'title.line3')}
                              onChange={(e) => updateBlockData('hero', 'title.line3', e.target.value)}
                              placeholder="Cho doanh nghiệp"
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Mô tả</Label>
                            <Textarea
                              value={getBlockData('hero', 'description')}
                              onChange={(e) => updateBlockData('hero', 'description', e.target.value)}
                              placeholder="Mô tả..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Nút chính - Text</Label>
                            <Input
                              value={getBlockData('hero', 'primaryButton.text')}
                              onChange={(e) => updateBlockData('hero', 'primaryButton.text', e.target.value)}
                              placeholder="Khám phá giải pháp"
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Nút chính - Link</Label>
                            <Input
                              value={getBlockData('hero', 'primaryButton.link')}
                              onChange={(e) => updateBlockData('hero', 'primaryButton.link', e.target.value)}
                              placeholder="/solutions"
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Nút phụ - Text</Label>
                            <Input
                              value={getBlockData('hero', 'secondaryButton.text')}
                              onChange={(e) => updateBlockData('hero', 'secondaryButton.text', e.target.value)}
                              placeholder="Xem video"
                            />
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
                            <div className="grid grid-cols-3 gap-4">
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
                          <div>
                            <Label className="mb-2">Tiêu đề</Label>
                            <Input
                              value={getBlockData('consult', 'title')}
                              onChange={(e) => updateBlockData('consult', 'title', e.target.value)}
                              placeholder="Miễn phí tư vấn"
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Mô tả</Label>
                            <Textarea
                              value={getBlockData('consult', 'description')}
                              onChange={(e) => updateBlockData('consult', 'description', e.target.value)}
                              placeholder="Mô tả..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Nút chính - Text</Label>
                            <Input
                              value={getBlockData('consult', 'buttons.primary.text')}
                              onChange={(e) => updateBlockData('consult', 'buttons.primary.text', e.target.value)}
                              placeholder="Tư vấn miễn phí ngay"
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Nút chính - Link</Label>
                            <Input
                              value={getBlockData('consult', 'buttons.primary.link')}
                              onChange={(e) => updateBlockData('consult', 'buttons.primary.link', e.target.value)}
                              placeholder="/contact"
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Nút phụ - Text</Label>
                            <Input
                              value={getBlockData('consult', 'buttons.secondary.text')}
                              onChange={(e) => updateBlockData('consult', 'buttons.secondary.text', e.target.value)}
                              placeholder="Xem case studies"
                            />
                          </div>
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
                                <Label className="mb-2">Phần 1</Label>
                                <Input
                                  value={getBlockData('aboutCompany', 'title.part1')}
                                  onChange={(e) => updateBlockData('aboutCompany', 'title.part1', e.target.value)}
                                  placeholder="Chuyển đổi số "
                                />
                              </div>
                              <div>
                                <Label className="mb-2">Highlight 1</Label>
                                <Input
                                  value={getBlockData('aboutCompany', 'title.highlight1')}
                                  onChange={(e) => updateBlockData('aboutCompany', 'title.highlight1', e.target.value)}
                                  placeholder="không bắt đầu từ phần mềm"
                                />
                              </div>
                              <div>
                                <Label className="mb-2">Phần 2</Label>
                                <Input
                                  value={getBlockData('aboutCompany', 'title.part2')}
                                  onChange={(e) => updateBlockData('aboutCompany', 'title.part2', e.target.value)}
                                  placeholder=" mà "
                                />
                              </div>
                              <div>
                                <Label className="mb-2">Highlight 2</Label>
                                <Input
                                  value={getBlockData('aboutCompany', 'title.highlight2')}
                                  onChange={(e) => updateBlockData('aboutCompany', 'title.highlight2', e.target.value)}
                                  placeholder="từ hiệu quả thực tế"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label className="mb-2">Phần 3</Label>
                                <Input
                                  value={getBlockData('aboutCompany', 'title.part3')}
                                  onChange={(e) => updateBlockData('aboutCompany', 'title.part3', e.target.value)}
                                  placeholder=" của doanh nghiệp."
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="mb-2">Mô tả</Label>
                            <Textarea
                              value={getBlockData('aboutCompany', 'description')}
                              onChange={(e) => updateBlockData('aboutCompany', 'description', e.target.value)}
                              placeholder="Mô tả..."
                              rows={3}
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
                              {(getBlockData('aboutCompany', 'slides', []) as any[]).map((slide: any, idx: number) => (
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
                                          disabled={idx === (getBlockData('aboutCompany', 'slides', []) as any[]).length - 1}
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
                                      <p className="font-medium text-sm">{slide.title || 'Chưa có tiêu đề'}</p>
                                      <p className="text-xs text-gray-600 line-clamp-2">{slide.description || 'Chưa có mô tả'}</p>
                                      {slide.image && (
                                        <img src={slide.image} alt={slide.title} className="w-full h-24 object-cover rounded" />
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

                      {blockType === 'features' && (
                        <>
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Header</h3>
                            <div>
                              <Label className="mb-2">Sub Title</Label>
                              <Input
                                value={getBlockData('features', 'header.sub')}
                                onChange={(e) => updateBlockData('features', 'header.sub', e.target.value)}
                                placeholder="GIỚI THIỆU SFB"
                              />
                            </div>
                            <div>
                              <Label className="mb-2">Tiêu đề</Label>
                              <Input
                                value={getBlockData('features', 'header.title')}
                                onChange={(e) => updateBlockData('features', 'header.title', e.target.value)}
                                placeholder="Chúng tôi là ai?"
                              />
                            </div>
                            <div>
                              <Label className="mb-2">Mô tả</Label>
                              <Textarea
                                value={getBlockData('features', 'header.description')}
                                onChange={(e) => updateBlockData('features', 'header.description', e.target.value)}
                                placeholder="Mô tả..."
                                rows={3}
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
                                        <p className="text-xs text-gray-600 line-clamp-2">{featureBlock.text}</p>
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
                              <Label className="mb-2">Sub Header</Label>
                              <Input
                                value={getBlockData('solutions', 'subHeader')}
                                onChange={(e) => updateBlockData('solutions', 'subHeader', e.target.value)}
                                placeholder="GIẢI PHÁP CHUYÊN NGHIỆP"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="mb-2">Tiêu đề phần 1</Label>
                                <Input
                                  value={getBlockData('solutions', 'title.part1')}
                                  onChange={(e) => updateBlockData('solutions', 'title.part1', e.target.value)}
                                  placeholder="Giải pháp phần mềm"
                                />
                              </div>
                              <div>
                                <Label className="mb-2">Tiêu đề phần 2</Label>
                                <Input
                                  value={getBlockData('solutions', 'title.part2')}
                                  onChange={(e) => updateBlockData('solutions', 'title.part2', e.target.value)}
                                  placeholder="đóng gói cho nhiều lĩnh vực"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="mb-2">Domains (Lĩnh vực)</Label>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const domains = getBlockData('solutions', 'domains', []) as string[];
                                    updateBlockData('solutions', 'domains', [...domains, '']);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Thêm
                                </Button>
                              </div>
                              {(getBlockData('solutions', 'domains', []) as string[]).map((domain, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <Input
                                    value={domain}
                                    onChange={(e) => {
                                      const domains = getBlockData('solutions', 'domains', []) as string[];
                                      const newDomains = [...domains];
                                      newDomains[idx] = e.target.value;
                                      updateBlockData('solutions', 'domains', newDomains);
                                    }}
                                    placeholder="Lĩnh vực..."
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const domains = getBlockData('solutions', 'domains', []) as string[];
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
                                    <p className="font-medium">{item.title || 'Chưa có tiêu đề'}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{item.description || 'Chưa có mô tả'}</p>
                                    <div className="flex flex-wrap gap-1">
                                      {(item.benefits || []).slice(0, 3).map((b: string, bidx: number) => (
                                        <Badge key={bidx} variant="secondary">{b}</Badge>
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
                              <Label className="mb-2">Sub Header</Label>
                              <Input
                                value={getBlockData('trusts', 'subHeader')}
                                onChange={(e) => updateBlockData('trusts', 'subHeader', e.target.value)}
                                placeholder="SFB TECHNOLOGY"
                              />
                            </div>
                            <div>
                              <Label className="mb-2">Tiêu đề</Label>
                              <Input
                                value={getBlockData('trusts', 'title')}
                                onChange={(e) => updateBlockData('trusts', 'title', e.target.value)}
                                placeholder="Độ tin cậy của SFB Technology"
                              />
                            </div>
                            <div>
                              <Label className="mb-2">Mô tả</Label>
                              <Textarea
                                value={getBlockData('trusts', 'description')}
                                onChange={(e) => updateBlockData('trusts', 'description', e.target.value)}
                                placeholder="Mô tả..."
                                rows={3}
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
                                <Label className="mb-2">Nút - Text</Label>
                                <Input
                                  value={getBlockData('trusts', 'button.text')}
                                  onChange={(e) => updateBlockData('trusts', 'button.text', e.target.value)}
                                  placeholder="Tìm hiểu thêm"
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
                                    <p className="font-medium">{feature.title || 'Chưa có tiêu đề'}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{feature.description || 'Chưa có mô tả'}</p>
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
                    </CardContent>
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
                                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1D8FCF] text-[#1D8FCF] font-semibold">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center">
                                    <Play size={14} className="text-white ml-0.5" />
                                  </div>
                                  {getBlockData('hero', 'secondaryButton.text', 'Xem video')}
                                </button>
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
                            {(getBlockData('aboutCompany', 'slides', []) as any[]).slice(0, 3).map((slide: any, idx: number) => (
                              <div key={idx} className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                                {slide.image && (
                                  <div className="mb-4 rounded-lg overflow-hidden" style={{ height: '200px' }}>
                                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <h3 className="font-semibold text-lg mb-2">{slide.title || 'Tiêu đề'}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{slide.description || 'Mô tả...'}</p>
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
                            ))}
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
                                          {((featureBlock.list || []) as string[]).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                              <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0" />
                                              <span className="font-medium">{item}</span>
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
                                                <h3 className="font-semibold text-base mb-1">{item.title || 'Tiêu đề'}</h3>
                                                <p className="text-slate-600 text-sm">{item.text || 'Nội dung...'}</p>
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
                                        {(getBlockData('features', 'block1.list', []) as string[]).map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-sky-500" />
                                            <span className="font-medium">{item}</span>
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
                              {(getBlockData('solutions', 'domains', []) as string[]).map((domain, idx) => (
                                <span
                                  key={idx}
                                  className="px-4 py-2 rounded-full text-sm text-white/90 border border-white/35 bg-white/10"
                                >
                                  {domain}
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
                                    <h3 className="text-gray-900 font-extrabold text-lg">{item.title || 'Tiêu đề'}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.description || 'Mô tả...'}</p>
                                    <ul className="space-y-1.5">
                                      {(item.benefits || []).map((benefit: string, bidx: number) => (
                                        <li key={bidx} className="flex items-start gap-2">
                                          <span className="text-[#1D8FCF] mt-1 text-xs">•</span>
                                          <span className="text-gray-600 text-xs">{benefit}</span>
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
                                    <h3 className="font-semibold text-lg mb-2">{feature.title || 'Tiêu đề'}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description || 'Mô tả...'}</p>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlideIndex !== null && editingSlideIndex >= (getBlockData('aboutCompany', 'slides', []) as any[]).length
                ? "Thêm slide mới"
                : "Chỉnh sửa slide"}
            </DialogTitle>
          </DialogHeader>
          {editingSlideIndex !== null && (() => {
            const slides = getBlockData('aboutCompany', 'slides', []) as any[];
            const slide = slides[editingSlideIndex] || { title: '', description: '', buttonText: '', buttonLink: '', image: '' };
            return (
              <div className="space-y-4 py-4">
                          <div>
                            <Label className="mb-2">Tiêu đề</Label>
                  <Input
                    value={slide.title || ''}
                    onChange={(e) => {
                      const newSlides = [...slides];
                      if (!newSlides[editingSlideIndex]) newSlides[editingSlideIndex] = {};
                      newSlides[editingSlideIndex].title = e.target.value;
                      updateBlockData('aboutCompany', 'slides', newSlides);
                    }}
                    placeholder="Tiêu đề slide"
                  />
                </div>
                          <div>
                            <Label className="mb-2">Mô tả</Label>
                  <Textarea
                    value={slide.description || ''}
                    onChange={(e) => {
                      const newSlides = [...slides];
                      if (!newSlides[editingSlideIndex]) newSlides[editingSlideIndex] = {};
                      newSlides[editingSlideIndex].description = e.target.value;
                      updateBlockData('aboutCompany', 'slides', newSlides);
                    }}
                    placeholder="Mô tả..."
                    rows={4}
                  />
                </div>
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
                            <Label className="mb-2">Nút - Text</Label>
                    <Input
                      value={slide.buttonText || ''}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        if (!newSlides[editingSlideIndex]) newSlides[editingSlideIndex] = {};
                        newSlides[editingSlideIndex].buttonText = e.target.value;
                        updateBlockData('aboutCompany', 'slides', newSlides);
                      }}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                          <div>
                            <Label className="mb-2">Tiêu đề</Label>
                  <Input
                    value={item.title || ''}
                    onChange={(e) => {
                      const newItems = [...items];
                      if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                      newItems[editingSolutionIndex].title = e.target.value;
                      updateBlockData('solutions', 'items', newItems);
                    }}
                    placeholder="Quy trình được chuẩn hóa"
                  />
                </div>
                          <div>
                            <Label className="mb-2">Mô tả</Label>
                  <Textarea
                    value={item.description || ''}
                    onChange={(e) => {
                      const newItems = [...items];
                      if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                      newItems[editingSolutionIndex].description = e.target.value;
                      updateBlockData('solutions', 'items', newItems);
                    }}
                    placeholder="Mô tả..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="mb-2">Benefits</Label>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newItems = [...items];
                        if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                        if (!newItems[editingSolutionIndex].benefits) newItems[editingSolutionIndex].benefits = [];
                        newItems[editingSolutionIndex].benefits.push('');
                        updateBlockData('solutions', 'items', newItems);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  </div>
                  {((item.benefits || []) as string[]).map((benefit, bidx) => (
                    <div key={bidx} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => {
                          const newItems = [...items];
                          if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                          if (!newItems[editingSolutionIndex].benefits) newItems[editingSolutionIndex].benefits = [];
                          newItems[editingSolutionIndex].benefits[bidx] = e.target.value;
                          updateBlockData('solutions', 'items', newItems);
                        }}
                        placeholder="Benefit..."
                      />
                      <Button
                        variant="outline"
                        size="icon"
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
                            <Label className="mb-2">Nút - Text</Label>
                    <Input
                      value={item.buttonText || ''}
                      onChange={(e) => {
                        const newItems = [...items];
                        if (!newItems[editingSolutionIndex]) newItems[editingSolutionIndex] = {};
                        newItems[editingSolutionIndex].buttonText = e.target.value;
                        updateBlockData('solutions', 'items', newItems);
                      }}
                      placeholder="Tìm hiểu cách SFB triển khai"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                          <div>
                            <Label className="mb-2">Tiêu đề</Label>
                  <Input
                    value={feature.title || ''}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      if (!newFeatures[editingTrustFeatureIndex]) newFeatures[editingTrustFeatureIndex] = {};
                      newFeatures[editingTrustFeatureIndex].title = e.target.value;
                      updateBlockData('trusts', 'features', newFeatures);
                    }}
                    placeholder="Năng lực được chứng minh"
                  />
                </div>
                          <div>
                            <Label className="mb-2">Mô tả</Label>
                  <Textarea
                    value={feature.description || ''}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      if (!newFeatures[editingTrustFeatureIndex]) newFeatures[editingTrustFeatureIndex] = {};
                      newFeatures[editingTrustFeatureIndex].description = e.target.value;
                      updateBlockData('trusts', 'features', newFeatures);
                    }}
                    placeholder="Mô tả..."
                    rows={4}
                  />
                </div>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <div>
                      <Label className="mb-2">Nội dung</Label>
                      <Textarea
                        value={featureBlock.text || ''}
                        onChange={(e) => {
                          const newBlocks = [...blocks];
                          if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                          newBlocks[editingFeatureBlockIndex].text = e.target.value;
                          updateBlockData('features', 'blocks', newBlocks);
                        }}
                        placeholder="Nội dung..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="mb-2">Danh sách điểm nổi bật</Label>
                        <Button
                          size="sm"
                          onClick={() => {
                            const newBlocks = [...blocks];
                            if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                            if (!newBlocks[editingFeatureBlockIndex].list) newBlocks[editingFeatureBlockIndex].list = [];
                            newBlocks[editingFeatureBlockIndex].list.push('');
                            updateBlockData('features', 'blocks', newBlocks);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm
                        </Button>
                      </div>
                      {((featureBlock.list || []) as string[]).map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => {
                              const newBlocks = [...blocks];
                              if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                              if (!newBlocks[editingFeatureBlockIndex].list) newBlocks[editingFeatureBlockIndex].list = [];
                              newBlocks[editingFeatureBlockIndex].list[idx] = e.target.value;
                              updateBlockData('features', 'blocks', newBlocks);
                            }}
                            placeholder="Điểm nổi bật..."
                          />
                          <Button
                            variant="outline"
                            size="icon"
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
                              <Input
                                value={item.title || ''}
                                onChange={(e) => {
                                  const newBlocks = [...blocks];
                                  if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                                  if (!newBlocks[editingFeatureBlockIndex].items) newBlocks[editingFeatureBlockIndex].items = [];
                                  newBlocks[editingFeatureBlockIndex].items[idx].title = e.target.value;
                                  updateBlockData('features', 'blocks', newBlocks);
                                }}
                                placeholder="Tiêu đề..."
                                className="text-sm"
                              />
                              <Textarea
                                value={item.text || ''}
                                onChange={(e) => {
                                  const newBlocks = [...blocks];
                                  if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                                  if (!newBlocks[editingFeatureBlockIndex].items) newBlocks[editingFeatureBlockIndex].items = [];
                                  newBlocks[editingFeatureBlockIndex].items[idx].text = e.target.value;
                                  updateBlockData('features', 'blocks', newBlocks);
                                }}
                                placeholder="Nội dung..."
                                rows={2}
                                className="text-sm"
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
                    <Label className="mb-2">Nút - Text</Label>
                    <Input
                      value={featureBlock.button?.text || ''}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        if (!newBlocks[editingFeatureBlockIndex]) newBlocks[editingFeatureBlockIndex] = {};
                        if (!newBlocks[editingFeatureBlockIndex].button) newBlocks[editingFeatureBlockIndex].button = {};
                        newBlocks[editingFeatureBlockIndex].button.text = e.target.value;
                        updateBlockData('features', 'blocks', newBlocks);
                      }}
                      placeholder="Nút text..."
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

      {/* Dialog for Features Block2/Block3 Items */}
      <Dialog open={editingFeatureItemIndex !== null} onOpenChange={(open) => {
        if (!open) setEditingFeatureItemIndex(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
    </div>
  );
}

