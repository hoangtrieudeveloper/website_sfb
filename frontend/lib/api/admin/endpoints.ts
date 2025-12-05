/**
 * Admin API Endpoints
 * Centralized endpoint definitions for admin section
 */

export const AdminEndpoints = {
  // Auth
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
  
  // Users
  users: {
    list: "/api/admin/users",
    detail: (id: number) => `/api/admin/users/${id}`,
  },
  
  // Roles
  roles: {
    list: "/api/admin/roles",
    detail: (id: number) => `/api/admin/roles/${id}`,
    permissions: (id: number) => `/api/admin/roles/${id}/permissions`,
  },
  
  // Permissions
  permissions: {
    list: "/api/admin/permissions",
    detail: (id: number) => `/api/admin/permissions/${id}`,
  },
  
  // News
  news: {
    list: "/api/admin/news",
    detail: (id: number) => `/api/admin/news/${id}`,
  },
  
  // Categories
  categories: {
    list: "/api/admin/categories",
    detail: (code: string) => `/api/admin/categories/${code}`,
  },
} as const;

