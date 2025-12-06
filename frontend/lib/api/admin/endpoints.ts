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
  
  // Upload
  upload: {
    image: "/api/admin/upload/image",
    file: "/api/admin/upload/file",
    files: "/api/admin/upload/files",
    deleteImage: (filename: string) => `/api/admin/upload/image/${filename}`,
  },
  
  // Media
  media: {
    folders: {
      list: "/api/admin/media/folders",
      tree: "/api/admin/media/folders/tree",
      detail: (id: number) => `/api/admin/media/folders/${id}`,
    },
    files: {
      list: "/api/admin/media/files",
      detail: (id: number) => `/api/admin/media/files/${id}`,
    },
  },
} as const;

