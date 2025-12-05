# API Migration Guide

## Overview

The API structure has been refactored to separate admin and public APIs for better organization and maintainability.

## New Structure

```
frontend/lib/
├── auth/
│   └── token.ts          # Token management utilities
├── api/
│   ├── base.ts           # Base API utilities
│   ├── admin/
│   │   ├── client.ts     # Admin API client (authenticated)
│   │   ├── endpoints.ts  # Admin endpoints
│   │   └── index.ts      # Admin exports
│   ├── public/
│   │   ├── client.ts     # Public API client (no auth)
│   │   ├── endpoints.ts  # Public endpoints
│   │   └── index.ts      # Public exports
│   └── index.ts          # Main API exports
└── api.ts                # Legacy file (backward compatibility)
```

## Migration Steps

### 1. Admin APIs (Requires Authentication)

**Old way:**
```typescript
import { apiCall, API_ENDPOINTS } from "@/lib/api";

const data = await apiCall(API_ENDPOINTS.news);
```

**New way:**
```typescript
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

const data = await adminApiCall(AdminEndpoints.news.list);
```

### 2. Public APIs (No Authentication)

**New way:**
```typescript
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

const data = await publicApiCall(PublicEndpoints.news.list);
```

### 3. Auth Utilities

**Old way:**
```typescript
import { getAuthToken, setAuthToken } from "@/lib/api";
```

**New way:**
```typescript
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated } from "@/lib/auth/token";
```

## Benefits

1. **Clear Separation**: Admin and public APIs are clearly separated
2. **Better Type Safety**: Endpoints are organized and typed
3. **Easier Maintenance**: Changes to admin APIs don't affect public APIs
4. **Scalability**: Easy to add new endpoints for both sections
5. **Security**: Public APIs don't accidentally include auth headers

## Backward Compatibility

The old `@/lib/api` file still works but is deprecated. All existing code will continue to work, but you should migrate to the new structure gradually.

## Examples

### Admin: Fetch News List
```typescript
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

const fetchNews = async () => {
  const data = await adminApiCall<{ data: NewsItem[] }>(AdminEndpoints.news.list);
  return data.data;
};
```

### Public: Fetch Public News
```typescript
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

const fetchPublicNews = async () => {
  const data = await publicApiCall<{ data: NewsItem[] }>(PublicEndpoints.news.list);
  return data.data;
};
```

### Auth: Check Authentication
```typescript
import { isAuthenticated, getAuthToken } from "@/lib/auth/token";

if (isAuthenticated()) {
  const token = getAuthToken();
  // Use token...
}
```

