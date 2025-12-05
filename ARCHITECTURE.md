# Architecture Overview

## Project Structure

This project follows a clear separation between **admin** (authenticated) and **public** (unauthenticated) sections for better maintainability and security.

## Frontend Structure

```
frontend/
├── app/
│   ├── (admin)/          # Admin section (requires authentication)
│   │   └── admin/        # Admin pages
│   ├── (public)/         # Public section (no authentication)
│   │   └── ...           # Public pages
│   └── admin/
│       └── login/        # Admin login page
├── lib/
│   ├── auth/             # Authentication utilities
│   │   └── token.ts      # JWT token management
│   └── api/              # API clients
│       ├── admin/        # Admin API (authenticated)
│       ├── public/       # Public API (no auth)
│       └── base.ts       # Base utilities
└── components/           # Shared components
```

## Backend Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   │   ├── admin/        # Admin services (authenticated)
│   │   └── public/       # Public services (no auth)
│   └── app.js            # Express app setup
└── database/
    └── schema.sql        # Database schema
```

## API Structure

### Admin APIs (`/api/admin/*`)

- **Requires**: JWT Bearer token in `Authorization` header
- **Middleware**: `requireAuth` middleware validates token
- **Client**: `adminApiCall` from `@/lib/api/admin`
- **Endpoints**: Defined in `AdminEndpoints`

**Example:**
```typescript
import { adminApiCall, AdminEndpoints } from "@/lib/api/admin";

const news = await adminApiCall(AdminEndpoints.news.list);
```

### Public APIs (`/api/public/*`)

- **Requires**: No authentication
- **Client**: `publicApiCall` from `@/lib/api/public`
- **Endpoints**: Defined in `PublicEndpoints`

**Example:**
```typescript
import { publicApiCall, PublicEndpoints } from "@/lib/api/public";

const news = await publicApiCall(PublicEndpoints.news.list);
```

## Authentication Flow

1. **Login**: User submits credentials → Backend validates → Returns JWT token
2. **Token Storage**: Frontend stores token in localStorage
3. **API Calls**: Frontend includes token in `Authorization: Bearer <token>` header
4. **Validation**: Backend middleware verifies token on each request
5. **Expiration**: On 401, frontend redirects to login and clears token

## Service Layer

### Admin Services

Located in `backend/src/services/admin/`:

- **auth.service.js**: Admin authentication
  - `authenticateAdmin()`: Validate credentials and generate JWT
  - `verifyAdminToken()`: Verify JWT token (optional, for extra validation)

### Public Services

Located in `backend/src/services/public/`:

- Reserved for future public-facing services
- No authentication required

## Benefits of This Structure

1. **Clear Separation**: Admin and public code are clearly separated
2. **Security**: Public APIs can't accidentally include auth headers
3. **Maintainability**: Changes to one section don't affect the other
4. **Scalability**: Easy to add new features to both sections
5. **Type Safety**: Endpoints are organized and typed
6. **Code Organization**: Related code is grouped together

## Migration Guide

See:
- `frontend/lib/API_MIGRATION.md` - Frontend API migration guide
- `frontend/lib/README.md` - Frontend API library documentation
- `backend/src/services/README.md` - Backend services documentation

## Best Practices

1. **Always use the correct API client**:
   - Admin APIs → `adminApiCall`
   - Public APIs → `publicApiCall`

2. **Use endpoint constants**:
   - Don't hardcode URLs
   - Use `AdminEndpoints` or `PublicEndpoints`

3. **Handle errors properly**:
   - Both clients throw errors that should be caught
   - Admin client automatically handles 401 redirects

4. **Token management**:
   - Use `setAuthToken()` after login
   - Use `removeAuthToken()` on logout
   - Use `isAuthenticated()` to check auth status

