"use client";

import { useState, useEffect } from "react";
import { Save, Settings2, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getSeoPageByPath, updateSeoPage, SeoPageData } from "@/lib/api/seo";
import ImageUpload from "@/components/admin/ImageUpload";
import { LocaleInput } from "@/components/admin/LocaleInput";
import { getLocaleValue, setLocaleValue, migrateObjectToLocale } from "@/lib/utils/locale-admin";
import { useTranslationControls } from "@/lib/hooks/useTranslationControls";
import { AIProviderSelector } from "@/components/admin/AIProviderSelector";

type Locale = 'vi' | 'en' | 'ja';

const PAGE_OPTIONS = [
  { path: '/', label: 'Trang chủ', type: 'home' },
  { path: '/products', label: 'Danh sách sản phẩm', type: 'products' },
  { path: '/about', label: 'Về chúng tôi', type: 'about' },
  { path: '/contact', label: 'Liên hệ', type: 'contact' },
  { path: '/news', label: 'Tin tức', type: 'news' },
  { path: '/industries', label: 'Lĩnh vực', type: 'industries' },
  { path: '/careers', label: 'Tuyển dụng', type: 'careers' },
];

export default function AdminSeoPage() {
  // Use translation controls hook
  const {
    globalLocale,
    setGlobalLocale,
    aiProvider,
    setAiProvider,
  } = useTranslationControls();

  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [seoData, setSeoData] = useState<Partial<SeoPageData>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadSeoData();
  }, [selectedPath]);

  const loadSeoData = async () => {
    try {
      setLoading(true);
      const data = await getSeoPageByPath(selectedPath);
      if (data) {
        // Normalize dữ liệu để đảm bảo các field luôn là locale object
        const normalizedData = migrateObjectToLocale(data);
        setSeoData(normalizedData);
      } else {
        // Reset to defaults if not found
        const pageOption = PAGE_OPTIONS.find(p => p.path === selectedPath);
        setSeoData({
          page_path: selectedPath,
          page_type: pageOption?.type || 'website',
        });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Không thể tải dữ liệu SEO');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSeoPage(selectedPath, seoData);
      toast.success('Đã lưu cấu hình SEO thành công');
      void loadSeoData();
    } catch (error: any) {
      toast.error(error?.message || 'Không thể lưu cấu hình SEO');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Quản lý SEO</h1>
          <p className="text-gray-500 mt-1">
            Cấu hình SEO cho các trang của website
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

      {/* Translation Controls */}
      <Card className="mb-4">
        <CardContent className="p-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chọn trang cần cấu hình</CardTitle>
          <CardDescription>
            Chọn trang bạn muốn cấu hình SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPath} onValueChange={setSelectedPath}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn trang" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_OPTIONS.map((page) => (
                <SelectItem key={page.path} value={page.path}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">SEO Cơ bản</TabsTrigger>
            <TabsTrigger value="social">Mạng xã hội</TabsTrigger>
            <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin SEO cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LocaleInput
                    label="Tiêu đề (Title)"
                    value={getLocaleValue(seoData, 'title')}
                    onChange={(value) => {
                      const updated = setLocaleValue(seoData, 'title', value);
                      setSeoData(updated as Partial<SeoPageData>);
                    }}
                    placeholder="Tiêu đề trang (50-60 ký tự)"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const titleValue = typeof seoData.title === 'string' ? seoData.title : (getLocaleValue(seoData, 'title') || '');
                      return typeof titleValue === 'string' ? titleValue.length : 0;
                    })()}/60 ký tự
                  </p>
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Mô tả (Description)"
                    value={getLocaleValue(seoData, 'description')}
                    onChange={(value) => {
                      const updated = setLocaleValue(seoData, 'description', value);
                      setSeoData(updated as Partial<SeoPageData>);
                    }}
                    placeholder="Mô tả trang (150-160 ký tự)"
                    multiline={true}
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const descValue = typeof seoData.description === 'string' ? seoData.description : (getLocaleValue(seoData, 'description') || '');
                      return typeof descValue === 'string' ? descValue.length : 0;
                    })()}/160 ký tự
                  </p>
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Từ khóa (Keywords)"
                    value={getLocaleValue(seoData, 'keywords')}
                    onChange={(value) => {
                      const updated = setLocaleValue(seoData, 'keywords', value);
                      setSeoData(updated as Partial<SeoPageData>);
                    }}
                    placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                  <p className="text-xs text-gray-500">
                    Phân cách bằng dấu phẩy
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical">Canonical URL</Label>
                  <Input
                    id="canonical"
                    value={seoData.canonical_url || ''}
                    onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
                    placeholder="https://sfb.vn/..."
                  />
                  <p className="text-xs text-gray-500">
                    URL chính thức của trang này. Dùng để tránh duplicate content khi có nhiều URL trỏ đến cùng nội dung.
                    <br />
                    Ví dụ: Nếu trang có thể truy cập qua cả <code className="text-xs bg-gray-100 px-1 rounded">/products</code> và <code className="text-xs bg-gray-100 px-1 rounded">/products/</code>, 
                    hãy đặt canonical là <code className="text-xs bg-gray-100 px-1 rounded">https://sfb.vn/products</code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Open Graph (Facebook, LinkedIn)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LocaleInput
                    label="OG Title"
                    value={getLocaleValue(seoData, 'og_title')}
                    onChange={(value) => {
                      const updated = setLocaleValue(seoData, 'og_title', value);
                      setSeoData(updated as Partial<SeoPageData>);
                    }}
                    placeholder="Tiêu đề khi chia sẻ"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="OG Description"
                    value={getLocaleValue(seoData, 'og_description')}
                    onChange={(value) => {
                      const updated = setLocaleValue(seoData, 'og_description', value);
                      setSeoData(updated as Partial<SeoPageData>);
                    }}
                    placeholder="Mô tả khi chia sẻ"
                    multiline={true}
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <Label>OG Image (Open Graph)</Label>
                  <ImageUpload
                    currentImage={seoData.og_image}
                    onImageSelect={(imageUrl) => setSeoData({ ...seoData, og_image: imageUrl })}
                  />
                  <p className="text-xs text-gray-500">
                    Kích thước khuyến nghị: 1200x630px
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Twitter Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LocaleInput
                    label="Twitter Title"
                    value={getLocaleValue(seoData, 'twitter_title')}
                    onChange={(value) => {
                      const updated = setLocaleValue(seoData, 'twitter_title', value);
                      setSeoData(updated as Partial<SeoPageData>);
                    }}
                    placeholder="Tiêu đề cho Twitter"
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <LocaleInput
                    label="Twitter Description"
                    value={getLocaleValue(seoData, 'twitter_description')}
                    onChange={(value) => {
                      const updated = setLocaleValue(seoData, 'twitter_description', value);
                      setSeoData(updated as Partial<SeoPageData>);
                    }}
                    placeholder="Mô tả cho Twitter"
                    multiline={true}
                    defaultLocale={globalLocale}
                    aiProvider={aiProvider}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Twitter Image</Label>
                  <ImageUpload
                    currentImage={seoData.twitter_image}
                    onImageSelect={(imageUrl) => setSeoData({ ...seoData, twitter_image: imageUrl })}
                  />
                  <p className="text-xs text-gray-500">
                    Kích thước khuyến nghị: 1200x630px
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình Robots</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Index (Cho phép lập chỉ mục)</Label>
                    <p className="text-sm text-gray-500">
                      Cho phép search engine lập chỉ mục trang này
                    </p>
                  </div>
                  <Switch
                    checked={seoData.robots_index !== false}
                    onCheckedChange={(checked) => setSeoData({ ...seoData, robots_index: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Follow (Cho phép theo dõi links)</Label>
                    <p className="text-sm text-gray-500">
                      Cho phép search engine theo dõi các links trong trang
                    </p>
                  </div>
                  <Switch
                    checked={seoData.robots_follow !== false}
                    onCheckedChange={(checked) => setSeoData({ ...seoData, robots_follow: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Đang lưu...' : 'Lưu cấu hình SEO'}
            </Button>
          </div>
        </Tabs>
      )}
    </div>
  );
}


