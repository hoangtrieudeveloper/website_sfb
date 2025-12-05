"use client";

import "../../../styles/styles_admin.css";

import type { ComponentType, ReactNode } from "react";
import {
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  User,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { removeAuthToken } from "@/lib/auth/token";

type AdminNavItem = {
  id: "dashboard" | "news" | "category" | "system" | "users" | "roles" | "permissions" | "settings" | "news-group";
  label: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
  requiredPermissions?: string[]; // Array of permission codes (user needs at least one)
  children?: AdminNavItem[]; // Submenu items
};

const menuItems: AdminNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    requiredPermissions: ["dashboard.view", "admin"],
  },
  {
    id: "news-group",
    label: "Tin tức",
    icon: Newspaper,
    requiredPermissions: ["news.view", "news.manage", "categories.view", "categories.manage", "admin"],
    children: [
      {
        id: "news",
        label: "Bài viết",
        href: "/admin/news",
        icon: Newspaper,
        requiredPermissions: ["news.view", "news.manage", "admin"],
      },
      {
        id: "category",
        label: "Danh mục",
        href: "/admin/categories",
        icon: FolderTree,
        requiredPermissions: ["categories.view", "categories.manage", "admin"],
      },
    ],
  },
  {
    id: "system",
    label: "Hệ thống",
    icon: Settings2,
    requiredPermissions: [
      "users.view",
      "users.manage",
      "roles.view",
      "roles.manage",
      "permissions.manage",
      "admin",
    ],
    children: [
      {
        id: "users",
        label: "Người dùng",
        href: "/admin/users",
        icon: Users,
        requiredPermissions: ["users.view", "users.manage", "admin"],
      },
      {
        id: "roles",
        label: "Phân quyền",
        href: "/admin/roles",
        icon: ShieldCheck,
        requiredPermissions: ["roles.view", "roles.manage", "admin"],
      },
      {
        id: "permissions",
        label: "Quyền chi tiết",
        href: "/admin/permissions",
        icon: ShieldCheck,
        requiredPermissions: ["roles.manage", "permissions.manage", "admin"],
      },
    ],
  },
  {
    id: "settings",
    label: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    requiredPermissions: ["settings.view", "settings.manage", "admin"],
  },
];

type CmsUser = {
  name?: string;
  email?: string;
  permissions?: string[];
};

function getUserPermissionsFromCookie(): Set<string> {
  if (typeof document === "undefined") return new Set();
  try {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("cms_sfb_user="));
    if (!cookie) return new Set();
    const value = decodeURIComponent(cookie.split("=")[1] || "");
    const parsed = JSON.parse(value) as CmsUser;
    return new Set(parsed.permissions ?? []);
  } catch {
    return new Set();
  }
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("Admin SFB");
  const [userEmail, setUserEmail] = useState("admin@sfb.local");

  const pathname = usePathname() || "/admin";
  const router = useRouter();

  // Đọc permissions từ cookie
  const userPermissions = useMemo(getUserPermissionsFromCookie, []);

  // State để quản lý submenu mở/đóng
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  // Filter menu items based on permissions (bao gồm cả submenu)
  const visibleMenuItems = useMemo(() => {
    return menuItems
      .map((item) => {
        // Kiểm tra permission cho item chính
        const hasPermission =
          !item.requiredPermissions ||
          item.requiredPermissions.length === 0 ||
          item.requiredPermissions.some((perm) => userPermissions.has(perm));

        if (!hasPermission) return null;

        // Nếu có submenu, filter submenu items
        if (item.children && item.children.length > 0) {
          const visibleChildren = item.children.filter((child) => {
            return (
              !child.requiredPermissions ||
              child.requiredPermissions.length === 0 ||
              child.requiredPermissions.some((perm) => userPermissions.has(perm))
            );
          });

          // Chỉ hiển thị menu cha nếu có ít nhất 1 submenu item visible
          if (visibleChildren.length === 0) return null;

          return {
            ...item,
            children: visibleChildren,
          };
        }

        return item;
      })
      .filter((item): item is AdminNavItem => item !== null);
  }, [userPermissions]);

  // Auto-expand submenu nếu đang ở trang con
  useEffect(() => {
    const currentSubmenu = visibleMenuItems.find((item) =>
      item.children?.some((child) => pathname === child.href || (child.href && pathname.startsWith(child.href)))
    );
    if (currentSubmenu) {
      setOpenSubmenus((prev) => new Set(prev).add(currentSubmenu.id));
    }
  }, [pathname, visibleMenuItems]);

  // Đọc thông tin user từ cookie (được set khi login) ở client
  useEffect(() => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("cms_sfb_user="));
      if (cookie) {
        const value = decodeURIComponent(cookie.split("=")[1] || "");
        const parsed = JSON.parse(value) as CmsUser;
        if (parsed.name) setUserName(parsed.name);
        if (parsed.email) setUserEmail(parsed.email);
      }
    } catch {
      // ignore parse error
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore network errors, vẫn redirect
    }
    // Xóa token khỏi localStorage
    removeAuthToken();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 text-slate-100 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800/60 backdrop-blur">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white drop-shadow" />
            </div>
            <span className="ml-3 text-xl text-slate-100 font-semibold">SFB Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = item.children && item.children.length > 0;
              const isSubmenuOpen = openSubmenus.has(item.id);
              const isActive =
                pathname === item.href ||
                (item.href && item.href !== "/admin" && pathname.startsWith(item.href)) ||
                (hasSubmenu &&
                  item.children?.some(
                    (child) =>
                      pathname === child.href ||
                      (child.href && pathname.startsWith(child.href))
                  ));

              if (hasSubmenu) {
                return (
                  <Collapsible
                    key={item.id}
                    open={isSubmenuOpen}
                    onOpenChange={(open) => {
                      setOpenSubmenus((prev) => {
                        const next = new Set(prev);
                        if (open) {
                          next.add(item.id);
                        } else {
                          next.delete(item.id);
                        }
                        return next;
                      });
                    }}
                  >
                    <CollapsibleTrigger
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-sm ${
                        isActive
                          ? "bg-white/10 text-white shadow-lg shadow-blue-500/20 border border-white/10"
                          : "text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5" />
                        <span className="ml-3">{item.label}</span>
                      </div>
                      {isSubmenuOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 space-y-1">
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive =
                          pathname === child.href ||
                          (child.href && pathname.startsWith(child.href));

                        return (
                          <Link
                            key={child.id}
                            href={child.href || "#"}
                            className={`w-full flex items-center pl-10 pr-4 py-2.5 rounded-lg transition-all text-sm ${
                              isChildActive
                                ? "bg-white/10 text-white font-medium border-l-2 border-cyan-400"
                                : "text-slate-200 hover:bg-white/5"
                            }`}
                          >
                            <ChildIcon className="w-4 h-4" />
                            <span className="ml-3">{child.label}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href || "#"}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all text-sm ${
                    isActive
                      ? "bg-white/10 text-white shadow-lg shadow-blue-500/20 border border-white/10"
                      : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Header */}
        <header
          className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30"
          style={{ marginLeft: sidebarOpen ? "16rem" : "0" }}
        >
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen((open) => !open)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                        {userName
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <div className="text-sm text-gray-800">{userName}</div>
                      <div className="text-xs text-gray-500">{userEmail}</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 w-4 h-4" />
                    Hồ sơ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/admin/settings");
                    }}
                  >
                    <Settings className="mr-2 w-4 h-4" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 w-4 h-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}


