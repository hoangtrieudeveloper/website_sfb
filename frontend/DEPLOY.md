# Hướng dẫn Deploy cùng Domain

## Tổng quan

Bạn có thể deploy cả `frontend` (Next.js) và `backend` (Express) trên **cùng 1 domain** `sfb.vn`:

- `sfb.vn` → Website (public + admin)
- `sfb.vn/api/v1/*` → API Backend (`backend`)

---

## Cách 1: Dùng Nginx Reverse Proxy (Khuyến nghị)

### Kiến trúc

```
Internet → Nginx (Port 80/443) → {
  /api/v1/* → backend (localhost:4000)
  /* → frontend (localhost:3000)
}
```

### Cấu hình Nginx

File: `/etc/nginx/sites-available/sfb.vn`

```nginx
server {
    listen 80;
    server_name sfb.vn www.sfb.vn;

    # Redirect HTTP to HTTPS (nếu có SSL)
    # return 301 https://$server_name$request_uri;

    # Hoặc giữ HTTP nếu chưa có SSL
    # ...
}

server {
    listen 443 ssl http2;
    server_name sfb.vn www.sfb.vn;

    # SSL certificates (nếu có)
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;

    # Proxy API requests to backend
    location /api/v1/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers (nếu cần)
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Proxy Swagger docs (nếu muốn public)
    location /api-docs {
        proxy_pass http://localhost:4000/api-docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy tất cả requests khác đến Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files (Next.js build output)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

### Các bước deploy

1. **Build `frontend`**:
   ```bash
   cd frontend
   npm run build
   npm start  # Chạy trên port 3000
   ```

2. **Chạy `backend`**:
   ```bash
   cd backend
   npm start  # Chạy trên port 4000
   ```

3. **Cấu hình Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/sfb.vn
   # Paste config ở trên
   
   sudo ln -s /etc/nginx/sites-available/sfb.vn /etc/nginx/sites-enabled/
   sudo nginx -t  # Test config
   sudo systemctl reload nginx
   ```

4. **Cấu hình Environment Variables**:

   File `.env.production` trong `frontend/`:
   ```env
   # Dùng relative path vì cùng domain
   NEXT_PUBLIC_API_SFB_URL=https://sfb.vn/api/v1
   API_SFB_URL=https://sfb.vn/api/v1
   NODE_ENV=production
   ```

   **Lưu ý**: Nếu dùng `NEXT_PUBLIC_*`, giá trị sẽ được embed vào client-side code. Nếu muốn bảo mật hơn, chỉ dùng `API_SFB_URL` (server-side only) và gọi qua Next.js API routes.

---

## Cách 2: Dùng Next.js Rewrites (Đơn giản hơn, nhưng ít linh hoạt)

### Cấu hình Next.js

File: `frontend/next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Rewrite API requests to backend
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:4000/api/:path*', // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
```

### Environment Variables

File `.env.production` trong `frontend/`:
```env
# Không cần NEXT_PUBLIC_API_SFB_URL nữa, vì dùng rewrites
# Client sẽ gọi /api/v1/... và Next.js tự động proxy
NODE_ENV=production
```

### Cập nhật code gọi API

Thay vì:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_SFB_URL || "http://localhost:4000";
fetch(`${API_BASE_URL}/api/auth/login`, ...)
```

Dùng:
```typescript
// Client-side: gọi qua Next.js rewrites
fetch('/api/v1/auth/login', ...)

// Server-side (API routes): có thể gọi trực tiếp hoặc qua rewrites
fetch('http://localhost:4000/api/auth/login', ...)
// hoặc
fetch('/api/v1/auth/login', ...) // Next.js sẽ proxy
```

### Các bước deploy

1. **Build `frontend`**:
   ```bash
   cd frontend
   npm run build
   npm start  # Port 3000
   ```

2. **Chạy `backend`**:
   ```bash
   cd backend
   npm start  # Port 4000
   ```

3. **Cấu hình Nginx đơn giản** (chỉ proxy Next.js):
   ```nginx
   server {
       listen 80;
       server_name sfb.vn www.sfb.vn;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## So sánh 2 cách

| Tiêu chí | Cách 1: Nginx Reverse Proxy | Cách 2: Next.js Rewrites |
|----------|----------------------------|-------------------------|
| **Độ phức tạp** | Cao hơn (cần config Nginx) | Thấp hơn (chỉ config Next.js) |
| **Hiệu năng** | Tốt hơn (Nginx xử lý trực tiếp) | Tốt (Next.js proxy) |
| **Linh hoạt** | Rất linh hoạt (có thể thêm rate limiting, caching) | Ít linh hoạt hơn |
| **SSL/TLS** | Nginx xử lý SSL | Cần Nginx hoặc load balancer |
| **Khuyến nghị** | ✅ Production, nhiều service | ✅ Đơn giản, ít service |

---

## Lưu ý quan trọng

1. **CORS**: Nếu `backend` có CORS middleware, cần cấu hình cho phép origin `https://sfb.vn`.

2. **Cookies**: Đảm bảo cookies được set đúng domain và path khi dùng cùng domain.

3. **Environment Variables**:
   - **Development**: Dùng `http://localhost:4000`
   - **Production**: Dùng `https://sfb.vn/api/v1` (hoặc relative path `/api/v1`)

4. **API Path**: 
   - Nginx: `/api/v1/*` → `backend/api/*` (có thể map lại path)
   - Next.js Rewrites: `/api/v1/*` → `backend/api/*` (giữ nguyên path)

---

## Ví dụ cấu hình Production

### `frontend/.env.production`
```env
NODE_ENV=production
# Dùng relative path (khuyến nghị)
NEXT_PUBLIC_API_SFB_URL=/api/v1
# Hoặc full URL
# NEXT_PUBLIC_API_SFB_URL=https://sfb.vn/api/v1
```

### `backend/.env.production`
```env
NODE_ENV=production
PORT=4000
# CORS origin (nếu có middleware CORS)
ALLOWED_ORIGINS=https://sfb.vn,https://www.sfb.vn
```

---

## Test sau khi deploy

1. **Test Website**: `https://sfb.vn` → Hiển thị trang chủ
2. **Test Admin**: `https://sfb.vn/admin/login` → Login được
3. **Test API**: `https://sfb.vn/api/v1/auth/login` → Trả về JSON
4. **Test Swagger**: `https://sfb.vn/api-docs` → Hiển thị Swagger UI (nếu public)

