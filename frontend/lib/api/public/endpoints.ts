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
  
  // Public Homepage
  homepage: {
    list: "/api/public/homepage",
    block: (sectionType: string) => `/api/public/homepage/${sectionType}`,
  },
  
  // Public Industries
  industries: {
    hero: "/api/public/industries/hero",
    listHeader: "/api/public/industries/list-header",
    list: "/api/public/industries/list",
    process: "/api/public/industries/process",
    cta: "/api/public/industries/cta",
  },
  
  // Public About
  about: {
    hero: "/api/public/about/hero",
    company: "/api/public/about/company",
    visionMission: "/api/public/about/vision-mission",
    coreValues: "/api/public/about/core-values",
    milestones: "/api/public/about/milestones",
    leadership: "/api/public/about/leadership",
  },
  
  // Public Careers
  careers: {
    hero: "/api/public/careers/hero",
    benefits: "/api/public/careers/benefits",
    positions: "/api/public/careers/positions",
    cta: "/api/public/careers/cta",
  },
  
  // Public Products
  products: {
    hero: "/api/public/products/hero",
    benefits: "/api/public/products/benefits",
    listHeader: "/api/public/products/list-header",
    cta: "/api/public/products/cta",
    testimonials: "/api/public/products/testimonials",
    list: "/api/public/products/list",
    categories: "/api/public/products/categories",
  },
  
  // Other public endpoints can be added here
} as const;

