"use client";

import { useState } from "react";
import { Save, Globe2, Bell, Shield, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = (section: string) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(`Đã lưu cấu hình ${section}`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Cấu hình hệ thống</h1>
        <p className="text-gray-500 mt-1">
          Thiết lập các thông số cho website và hệ thống admin
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Tổng quan</TabsTrigger>
          <TabsTrigger value="seo">SEO & Domain</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="integrations">Tích hợp</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Tên website</Label>
                  <Input
                    id="siteName"
                    defaultValue="SFB Technology"
                    placeholder="Nhập tên website"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteEmail">Email hệ thống</Label>
                  <Input
                    id="siteEmail"
                    type="email"
                    defaultValue="contact@sfb.com"
                    placeholder="contact@sfb.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">
                  Mô tả ngắn (hiển thị dưới logo)
                </Label>
                <Textarea
                  id="siteDescription"
                  rows={3}
                  defaultValue="Giải pháp công nghệ hàng đầu Việt Nam"
                />
              </div>

              <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">
                    Bảo trì hệ thống (Maintenance Mode)
                  </p>
                  <p className="text-sm text-gray-500">
                    Bật chế độ bảo trì sẽ hiển thị thông báo tạm dừng với người
                    dùng.
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("thông tin chung")}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="w-5 h-5" />
                SEO & Domain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain chính</Label>
                <Input
                  id="domain"
                  defaultValue="https://www.sfb.com"
                  placeholder="https://"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta title mặc định</Label>
                <Input
                  id="metaTitle"
                  defaultValue="SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta description</Label>
                <Textarea
                  id="metaDescription"
                  rows={3}
                  defaultValue="SFB đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                  <Input
                    id="googleAnalytics"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                  <Input id="facebookPixel" placeholder="XXXXXXXXXXXXXXX" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("SEO & Domain")}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Thông báo & Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">
                      Email thông báo hệ thống
                    </p>
                    <p className="text-sm text-gray-500">
                      Gửi email khi có lỗi hệ thống hoặc đăng nhập bất thường.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">
                      Thông báo cho bài viết mới
                    </p>
                    <p className="text-sm text-gray-500">
                      Gửi email thông báo cho admin khi có bài viết mới.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpServer">SMTP Server</Label>
                <Input
                  id="smtpServer"
                  placeholder="smtp.gmail.com"
                  defaultValue="smtp.gmail.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP User</Label>
                  <Input id="smtpUser" placeholder="username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" defaultValue="587" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("thông báo & email")}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">
                      Bật xác thực hai lớp (2FA)
                    </p>
                    <p className="text-sm text-gray-500">
                      Tăng cường bảo mật cho tài khoản admin.
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">
                      Giới hạn IP đăng nhập
                    </p>
                    <p className="text-sm text-gray-500">
                      Chỉ cho phép đăng nhập từ một số IP nhất định.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedIps">Danh sách IP cho phép</Label>
                <Textarea
                  id="allowedIps"
                  rows={3}
                  placeholder="192.168.1.1&#10;10.0.0.1"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("bảo mật")}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Tích hợp hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiBaseUrl">API base URL</Label>
                <Input
                  id="apiBaseUrl"
                  defaultValue="http://localhost:4000"
                  placeholder="http://localhost:4000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cmsUrl">CMS URL (cms_sfb)</Label>
                <Input
                  id="cmsUrl"
                  defaultValue="http://localhost:5173"
                  placeholder="http://localhost:5173"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook khi có bài viết mới</Label>
                <Input
                  id="webhook"
                  placeholder="https://example.com/webhook"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("tích hợp")}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
