/**
 * Public API Endpoints
 * Centralized endpoint definitions for public section
 * These endpoints don't require authentication
 */

export const PublicEndpoints = {
  // Public News
  news: {
    list: "/api/public/news",
    detail: (id: number | string) => `/api/public/news/${id}`,
    featured: "/api/public/news/featured",
    byCategory: (category: string) => `/api/public/news/category/${category}`,
  },
  
  // Public Categories
  categories: {
    list: "/api/public/categories",
    detail: (code: string) => `/api/public/categories/${code}`,
  },
  
  // Contact Form
  contact: {
    submit: "/api/public/contact",
  },
  
  // Other public endpoints can be added here
} as const;

