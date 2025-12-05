# Backend Services Structure

## Overview

Services are organized into `admin` and `public` directories to clearly separate authenticated admin functionality from public-facing features.

## Structure

```
services/
├── admin/
│   ├── auth.service.js    # Admin authentication service
│   └── index.js           # Admin services exports
├── public/
│   └── index.js           # Public services exports (for future use)
└── README.md             # This file
```

## Admin Services

### Auth Service (`admin/auth.service.js`)

Handles authentication for admin users only.

**Functions:**

- `authenticateAdmin({ email, password })`: Authenticate admin user and return JWT token
- `verifyAdminToken(token)`: Verify JWT token and return decoded payload

**Usage:**

```javascript
const { auth } = require('../services/admin');

// Authenticate user
const result = await auth.authenticateAdmin({ 
  email: 'admin@sfb.local', 
  password: 'admin123' 
});

if (result) {
  // result contains: { token, user, expiresIn }
  console.log(result.token);
  console.log(result.user);
}

// Verify token
const decoded = await auth.verifyAdminToken(token);
if (decoded) {
  // Token is valid
  console.log(decoded.email, decoded.permissions);
}
```

**Features:**

- ✅ Email normalization (lowercase, trim)
- ✅ Password verification with bcrypt
- ✅ Active user and role checking
- ✅ Permission loading from database
- ✅ JWT token generation
- ✅ Token verification with user validation

## Public Services

Public services will be added here as needed for public-facing features that don't require authentication.

## Migration from Old Structure

**Old:**
```javascript
const { authenticateDemoUser } = require('../services/auth.service');
```

**New:**
```javascript
const { auth } = require('../services/admin');
const result = await auth.authenticateAdmin({ email, password });
```

## Benefits

1. **Clear Separation**: Admin and public services are clearly separated
2. **Better Organization**: Related services are grouped together
3. **Easier Maintenance**: Changes to admin services don't affect public services
4. **Scalability**: Easy to add new services for both sections
5. **Security**: Public services can't accidentally access admin-only features

