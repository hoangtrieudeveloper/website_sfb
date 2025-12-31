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
  
  // Menus
  menus: {
    list: "/api/admin/menus",
    detail: (id: number) => `/api/admin/menus/${id}`,
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
  
  // Products
  products: {
    list: "/api/admin/products",
    detail: (id: number) => `/api/admin/products/${id}`,
    toggle: (id: number) => `/api/admin/products/${id}/toggle`,
    detailPage: (productId: number) => `/api/admin/products/${productId}/detail`,
  },
  
  // Product Categories
  productCategories: {
    list: "/api/admin/products/categories",
    detail: (id: number) => `/api/admin/products/categories/${id}`,
  },
  
  // Product Benefits
  productBenefits: {
    list: "/api/admin/products/benefits",
    detail: (id: number) => `/api/admin/products/benefits/${id}`,
  },
  
  // Product Hero
  productHero: {
    get: "/api/admin/products/hero",
    update: "/api/admin/products/hero",
  },
  
  // Product Contact Banner
  productContact: {
    get: "/api/admin/products/contact",
    update: "/api/admin/products/contact",
  },
  
  // Testimonials
  testimonials: {
    list: "/api/admin/testimonials",
    detail: (id: number) => `/api/admin/testimonials/${id}`,
  },
  
  // Industries
  industries: {
    list: "/api/admin/industries",
    detail: (id: number) => `/api/admin/industries/${id}`,
    hero: {
      get: "/api/admin/industries/hero",
      update: "/api/admin/industries/hero",
    },
    listHeader: {
      get: "/api/admin/industries/list-header",
      update: "/api/admin/industries/list-header",
    },
    process: {
      get: "/api/admin/industries/process",
      update: "/api/admin/industries/process",
    },
  },
  
  // About
  about: {
    hero: {
      get: "/api/admin/about/hero",
      update: "/api/admin/about/hero",
    },
    company: {
      get: "/api/admin/about/company",
      update: "/api/admin/about/company",
    },
    visionMission: {
      get: "/api/admin/about/vision-mission",
      update: "/api/admin/about/vision-mission",
    },
    coreValues: {
      get: "/api/admin/about/core-values",
      update: "/api/admin/about/core-values",
    },
    milestones: {
      get: "/api/admin/about/milestones",
      update: "/api/admin/about/milestones",
    },
    leadership: {
      get: "/api/admin/about/leadership",
      update: "/api/admin/about/leadership",
    },
  },
} as const;

