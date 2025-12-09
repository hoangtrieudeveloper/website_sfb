# SFB CMS - Content Management System

Hệ thống quản lý nội dung (CMS) được xây dựng với Next.js và Express.js, hỗ trợ quản lý tin tức, danh mục, media library và phân quyền người dùng.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Setup Database](#setup-database)
- [Chạy Project](#chạy-project)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Scripts](#scripts)
- [Tài khoản mặc định](#tài-khoản-mặc-định)
- [Troubleshooting](#troubleshooting)

## 🖥️ Yêu cầu hệ thống

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **PostgreSQL** ≥ 12.0
- **Git** (để clone project)

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd ws-sfb
```

### 2. Cài đặt dependencies

```bash
npm install
```

Lệnh này sẽ tự động cài đặt dependencies cho cả `backend` và `frontend` nhờ npm workspaces.

## ⚙️ Cấu hình

### Backend Environment Variables

Tạo file `backend/.env` (có thể copy từ `backend/.env.example`):

  ```env
# Database
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASSWORD=your_password
  DB_NAME=sfb_db

# JWT Authentication
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=development
  ```

### Frontend Environment Variables

Tạo file `frontend/.env.local`:

  ```env
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```

## 🗄️ Setup Database

### Quick Start (Khuyến nghị)

**Chỉ cần chạy một lệnh duy nhất:**

```bash
npm run setup
```

Lệnh này sẽ tự động:
- ✅ Tạo database `sfb_db` nếu chưa tồn tại
- ✅ Tạo tất cả bảng (users, roles, permissions, news, categories, media_folders, media_files, ...)
- ✅ Thêm permissions cho media library
- ✅ Tạo các thư mục mặc định cho media
- ✅ Gán permissions cho các roles (admin, editor, user)
- ✅ Tạo user admin mặc định

### Lưu ý

- Đảm bảo PostgreSQL đang chạy trước khi chạy lệnh setup
- Media tables sẽ tự động được tạo khi backend server khởi động nếu chưa tồn tại (không cần chạy script riêng)

## ▶️ Chạy Project

### Development Mode

Chạy cả backend và frontend đồng thời:

```bash
npm run dev
```

Hoặc chạy riêng từng phần:

```bash
# Chỉ backend
npm run dev:backend

# Chỉ frontend
npm run dev:frontend
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Admin Panel: http://localhost:3000/admin

### Production Mode

```bash
# Build cả hai
npm run build

# Start backend
npm run start:backend

# Start frontend (terminal khác)
npm run start:frontend
```

## 📁 Cấu trúc thư mục

```
ws-sfb/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── controllers/    # Controllers xử lý logic
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Middleware (auth, upload, ...)
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utilities (ensureMediaTables, ...)
│   │   └── config/         # Configuration (database, swagger, ...)
│   ├── database/           # SQL scripts
│   │   ├── schema.sql      # Schema tổng hợp (đã bao gồm media)
│   │   └── README.md       # Database documentation
│   ├── scripts/            # Setup scripts
│   │   ├── setup-all.js    # Script setup tổng hợp
│   │   └── generate-password-hash.js
│   ├── uploads/           # Thư mục lưu file upload
│   └── .env               # Backend environment variables
│
├── frontend/              # Next.js Website
│   ├── app/              # Next.js App Router
│   │   ├── (admin)/      # Admin pages
│   │   └── (public)/     # Public pages
│   ├── components/       # React components
│   ├── lib/             # Utilities, API clients
│   └── .env.local       # Frontend environment variables
│
├── package.json         # Root package.json (workspaces)
└── README.md           # File này
```

## 📜 Scripts

### Root Level Scripts

| Script | Mô tả |
|--------|-------|
| `npm install` | Cài đặt dependencies cho cả backend và frontend |
| `npm run setup` | **Setup database (chỉ cần chạy 1 lần)** |
| `npm run dev` | Chạy cả backend và frontend ở development mode |
| `npm run dev:backend` | Chỉ chạy backend |
| `npm run dev:frontend` | Chỉ chạy frontend |
| `npm run build` | Build cả backend và frontend cho production |
| `npm run start:backend` | Start backend ở production mode |
| `npm run start:frontend` | Start frontend ở production mode |
| `npm run lint:frontend` | Chạy linter cho frontend |

### Backend Scripts (chạy trong `backend/`)

| Script | Mô tả |
|--------|-------|
| `npm run setup` | Setup toàn bộ database (tạo DB, chạy `schema.sql`, seed permissions, media, ...) |
| `npm start` | Start backend server |
| `npm run generate-password-hash` | Generate password hash cho user |

## 👤 Tài khoản mặc định

Sau khi chạy `npm run setup`, bạn sẽ có tài khoản admin mặc định:

- **Email**: `admin@sfb.local`
- **Password**: `admin123`

⚠️ **Lưu ý**: Đổi mật khẩu ngay sau lần đăng nhập đầu tiên trong môi trường production!

## 🔧 Troubleshooting

### Lỗi kết nối database

**Lỗi**: `ECONNREFUSED` hoặc `relation does not exist`

**Giải pháp**:
1. Kiểm tra PostgreSQL đang chạy:
   ```bash
   # Windows
   net start postgresql-x64-XX
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Kiểm tra file `backend/.env` có đúng thông tin:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

3. Chạy lại setup:
   ```bash
   npm run setup
   ```

### Lỗi port đã được sử dụng

**Lỗi**: `Port 3000 is already in use` hoặc `Port 4000 is already in use`

**Giải pháp**:
1. Tìm process đang dùng port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

2. Kill process hoặc đổi port trong `.env`

### Lỗi module not found

**Lỗi**: `Cannot find module 'xxx'`

**Giải pháp**:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
```

### Media tables không tồn tại

**Lỗi**: `relation "media_folders" does not exist`

**Giải pháp**:
1. Chạy setup lại:
   ```bash
   npm run setup
   ```

2. Hoặc backend sẽ tự động tạo khi khởi động (thông qua `ensureMediaTables.js`)

### Frontend không kết nối được với backend

**Lỗi**: `fetch failed` hoặc `ECONNREFUSED`

**Giải pháp**:
1. Kiểm tra backend đang chạy tại `http://localhost:4000`
2. Kiểm tra `frontend/.env.local` có `NEXT_PUBLIC_API_URL=http://localhost:4000`
3. Restart frontend server

## 📚 Tài liệu thêm

- [Backend Setup Guide](./backend/README_SETUP.md)
- [Database Documentation](./backend/database/README.md)
- [Architecture](./ARCHITECTURE.md)

## 📝 Ghi chú

- Media Library sẽ tự động tạo bảng khi backend khởi động nếu chưa tồn tại
- Tất cả file upload được lưu trong `backend/uploads/`
- Admin panel có đầy đủ tính năng: quản lý tin tức, danh mục, media, users, roles, permissions

## 🤝 Đóng góp

Nếu bạn muốn đóng góp cho project, vui lòng tạo issue hoặc pull request.

---

**Happy Coding! 🚀**
