## API SFB – Backend cho CMS & Website SFB

API đơn giản phục vụ cho **CMS SFB** (trang quản trị) và có thể mở rộng cho website SFB.
Hiện tại API cung cấp:

- Endpoint đăng nhập demo cho CMS
- Endpoint dashboard summary (số liệu tổng quan)

Tất cả được triển khai bằng **Node.js + Express**.

---

## 1. Công nghệ sử dụng

- **Node.js**
- **Express 5**
- **CORS** (cho phép frontend khác origin gọi API)
- **dotenv** (đọc biến môi trường `.env` – nếu bạn thêm)
- **swagger-jsdoc + swagger-ui-express** (tự động sinh tài liệu RESTful API)

---

## 2. Cấu trúc thư mục

```text
backend/
├─ index.js                 # Entry giữ backward-compat, forward sang server.js
├─ server.js                # Khởi động server Express trên PORT (default 4000)
├─ package.json             # Scripts & dependencies
├─ src/
│  ├─ app.js                # Khởi tạo Express app, cấu hình middleware & routes
│  ├─ config/
│  │  └─ env.js             # Đọc PORT từ biến môi trường (hiện chưa dùng trong server.js)
│  ├─ controllers/
│  │  ├─ auth.controller.js       # Xử lý login
│  │  └─ dashboard.controller.js  # Trả dữ liệu summary dashboard
│  ├─ middlewares/
│  │  ├─ logger.middleware.js     # Log request
│  │  ├─ notFound.middleware.js   # Xử lý 404 cho route không tồn tại
│  │  └─ error.middleware.js      # Xử lý lỗi chung
│  ├─ models/
│  │  └─ README.md                # Ghi chú (có thể thêm model thật sau)
│  ├─ routes/
│  │  ├─ auth.routes.js           # Định nghĩa route /api/auth/*
│  │  └─ dashboard.routes.js      # Định nghĩa route /api/dashboard/*
│  └─ services/
│     └─ auth.service.js          # Logic auth demo (user/password cứng)
└─ package-lock.json
```

---

## 3. Cài đặt & chạy API

### 3.1. Yêu cầu

- **Node.js** ≥ 18
- **npm**

### 3.2. Cài dependencies

```
# Từ thư mục gốc ws-sfb
npm install
```

### 3.3. Chạy server (dev / simple)

```bash
npm run dev --workspace backend
```

Hoặc:

```bash
npm run start --workspace backend
```

Mặc định server sẽ chạy ở:

```text
http://localhost:4000
```

Khi chạy thành công, log sẽ hiển thị:

```text
API SFB listening on http://localhost:4000
```

Bạn có thể test nhanh:

```bash
curl http://localhost:4000/
```

Kết quả mẫu:

```json
{ "status": "API SFB is running" }
```

### 3.6. Swagger UI (Tài liệu RESTful API)

- Sau khi server chạy, mở:

```text
http://localhost:4000/api-docs
```

- Đây là giao diện Swagger UI cho phép:
  - Xem tài liệu RESTful endpoints (`/api/auth/login`, `/api/dashboard/summary`)
  - Thử gọi API trực tiếp từ trình duyệt (Try it out)

---

## 4. Cấu hình môi trường

Hiện tại:

- `server.js` đang dùng trực tiếp `process.env.PORT || 4000`:

  ```js
  const app = require('./src/app');

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`API SFB listening on http://localhost:${PORT}`);
  });
  ```

- File `src/config/env.js`:

  ```js
  require('dotenv').config();

  const PORT = process.env.PORT || 4000;

  module.exports = {
    port: PORT,
  };
  ```

Bạn có thể cấu hình PORT bằng cách tạo file `.env` trong `backend/`:

```env
PORT=4000
```

> Lưu ý: Frontend CMS (`cms_sfb`) đang mặc định gọi API tại `http://localhost:4000` thông qua `VITE_API_URL` hoặc giá trị mặc định. Nếu bạn đổi PORT, hãy cập nhật cả `VITE_API_URL` bên CMS.

---

## 5. API Endpoints

### 5.1. Root health check

- **Method**: `GET /`
- **Mục đích**: Kiểm tra API đang chạy
- **Response**:

```json
{ "status": "API SFB is running" }
```

---

### 5.2. Đăng nhập (Login)

- **URL**: `POST /api/auth/login`
- **Body (JSON)**:

```json
{
  "email": "admin@sfb.local",
  "password": "admin123"
}
```

- **Logic**: Dùng user demo cứng trong `src/services/auth.service.js`:

  ```js
  const DEMO_USER = {
    email: 'admin@sfb.local',
    password: 'admin123',
    name: 'Admin SFB',
  };
  ```

- **Response thành công (200)**:

```json
{
  "success": true,
  "token": "demo-token-123",
  "user": {
    "name": "Admin SFB",
    "email": "admin@sfb.local"
  }
}
```

- **Response thất bại (401)**:

```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng"
}
```

> Frontend CMS (`cms_sfb`) đang dùng endpoint này trong `src/services/api.js`:
> ```js
> export async function login(payload) {
>   const res = await client.post('/api/auth/login', payload);
>   return res.data;
> }
> ```

---

### 5.3. Dashboard Summary

- **URL**: `GET /api/dashboard/summary`
- **Mục đích**: Trả về số liệu tổng quan hiển thị trên dashboard CMS
- **Response mẫu**:

```json
{
  "totalUsers": 1280,
  "activeUsers": 934,
  "newOrdersToday": 37,
  "revenueToday": 12500000
}
```

> Frontend CMS (`cms_sfb`) dùng endpoint này trong `src/services/api.js`:
>
> ```js
> export async function getDashboardSummary() {
>   const res = await client.get('/api/dashboard/summary');
>   return res.data;
> }
> ```

---

## 6. Tích hợp với CMS SFB

- **Frontend**: thư mục `cms_sfb`
- **Backend**: thư mục `backend` (project hiện tại)

Luồng cơ bản:

1. Chạy API:
   ```bash
   cd backend
   npm install
   npm run dev    # hoặc npm start
   ```

2. Chạy CMS frontend:
   ```bash
   cd cms_sfb
   npm install
   npm run dev
   ```

3. Mở CMS tại `http://localhost:5173`:
   - Trang `/login`: nhập
     - Email: `admin@sfb.local`
     - Mật khẩu: `admin123`
   - Sau khi login thành công, CMS sẽ gọi:
     - `POST http://localhost:4000/api/auth/login`
     - `GET  http://localhost:4000/api/dashboard/summary`

> Nếu không chạy `backend`, CMS sẽ báo `Network Error` khi đăng nhập vì không gọi được API.

---

## 7. Mở rộng (gợi ý)

- Thêm model thực (MongoDB, PostgreSQL, v.v.) thay vì dữ liệu mock
- Thêm middleware auth (JWT, session) để bảo vệ các endpoint `/api/dashboard/*`
- Đưa PORT và các config khác vào `.env` + dùng trong `server.js` qua `src/config/env.js`
