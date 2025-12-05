# API & Auth Library Structure

## Overview

This library provides a clean separation between admin (authenticated) and public (unauthenticated) APIs, making it easier to maintain and scale the application.

## Structure

```
lib/
├── auth/
│   └── token.ts          # JWT token management
├── api/
│   ├── base.ts           # Base utilities (URL building, error parsing)
│   ├── admin/            # Admin APIs (requires JWT authentication)
│   │   ├── client.ts     # Authenticated API client
│   │   ├── endpoints.ts  # Admin endpoint definitions
│   │   └── index.ts      # Admin exports
│   ├── public/           # Public APIs (no authentication)
│   │   ├── client.ts     # Public API client
│   │   ├── endpoints.ts  # Public endpoint definitions
│   │   └── index.ts      # Public exports
│   └── index.ts          # Main API exports
└── api.ts                # Legacy file (backward compatibility)
```

## Usage

### Admin APIs (Authenticated)

```typescript
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

// Fetch news list
const news = await adminApiCall<{ data: NewsItem[] }>(
  AdminEndpoints.news.list
);

// Create news
await adminApiCall(AdminEndpoints.news.list, {
  method: "POST",
  body: JSON.stringify(newsData),
});

// Update news
await adminApiCall(AdminEndpoints.news.detail(id), {
  method: "PUT",
  body: JSON.stringify(updatedData),
});

// Delete news
await adminApiCall(AdminEndpoints.news.detail(id), {
  method: "DELETE",
});
```

### Public APIs (No Authentication)

```typescript
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

// Fetch public news
const news = await publicApiCall<{ data: NewsItem[] }>(
  PublicEndpoints.news.list
);

// Fetch featured news
const featured = await publicApiCall<{ data: NewsItem[] }>(
  PublicEndpoints.news.featured
);

// Fetch news by category
const categoryNews = await publicApiCall<{ data: NewsItem[] }>(
  PublicEndpoints.news.byCategory("tech")
);
```

### Auth Utilities

```typescript
import { 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken, 
  isAuthenticated 
} from "@/lib/auth/token";

// Check if user is authenticated
if (isAuthenticated()) {
  // User is logged in
}

// Get current token
const token = getAuthToken();

// Save token (usually after login)
setAuthToken(token);

// Remove token (usually on logout)
removeAuthToken();
```

## Features

### Admin API Client

- ✅ Automatically adds `Authorization: Bearer <token>` header
- ✅ Handles 401 Unauthorized by redirecting to login
- ✅ Centralized error handling
- ✅ Type-safe endpoints

### Public API Client

- ✅ No authentication headers
- ✅ Suitable for public-facing features
- ✅ Same error handling as admin client
- ✅ Type-safe endpoints

### Auth Utilities

- ✅ Safe localStorage access (handles SSR)
- ✅ Error handling for localStorage operations
- ✅ Simple authentication checks

## Migration from Old Structure

The old `@/lib/api` file still works for backward compatibility, but you should migrate to the new structure:

**Old:**
```typescript
import { apiCall, API_ENDPOINTS } from "@/lib/api";
```

**New:**
```typescript
// For admin APIs
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

// For public APIs
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";
```

See `API_MIGRATION.md` for detailed migration guide.

## Benefits

1. **Clear Separation**: Admin and public APIs are clearly separated
2. **Better Security**: Public APIs can't accidentally include auth headers
3. **Easier Maintenance**: Changes to one section don't affect the other
4. **Type Safety**: Endpoints are organized and typed
5. **Scalability**: Easy to add new endpoints for both sections

