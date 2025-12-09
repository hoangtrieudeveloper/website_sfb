# Database Setup

## 🚀 Quick Start

**Chỉ cần chạy một lệnh duy nhất:**

```bash
cd backend
npm run setup
```

Lệnh này sẽ tự động:
1. ✅ Tạo database nếu chưa tồn tại
2. ✅ Chạy schema.sql (bao gồm tất cả: bảng cơ bản + media tables + permissions)
3. ✅ Tạo các thư mục mặc định cho media
4. ✅ Gán permissions cho các roles

## 📁 Files Structure

### Files chính:
- **`schema.sql`** - Schema tổng hợp (đã bao gồm tất cả: users, roles, news, media, permissions)
- **`update_featured_news.sql`** - Script update dữ liệu (tùy chọn)

### Files đã loại bỏ:
- `media_schema.sql` - ĐÃ XOÁ, nội dung đã gộp vào `schema.sql`
- `add_media_permissions.sql` - ĐÃ XOÁ, nội dung đã gộp vào `schema.sql`

## 🔄 Auto-Create

Media tables sẽ được **tự động tạo** khi backend server khởi động nếu chưa tồn tại (thông qua `ensureMediaTables.js`).

Điều này có nghĩa là:
- ✅ Không cần chạy script thủ công nữa
- ✅ Server tự động tạo bảng khi cần
- ✅ An toàn, không gây lỗi nếu bảng đã tồn tại

## 📝 Manual Setup (nếu cần)

Nếu muốn chạy SQL trực tiếp:

```bash
# Chạy SQL trực tiếp bằng psql
psql -U postgres -d sfb_db -f backend/database/schema.sql
```

## 🔧 Scripts Available

- `npm run setup` - Setup toàn bộ database (khuyến nghị)
- `npm run generate-password-hash` - Generate password hash

## ⚠️ Troubleshooting

Nếu gặp lỗi, kiểm tra:
1. ✅ PostgreSQL đang chạy
2. ✅ File `.env` có đúng thông tin database
3. ✅ User có quyền tạo database và tables
4. ✅ Port PostgreSQL đúng (mặc định: 5432)

## 📊 Sau khi setup

Sau khi chạy `npm run setup`, bạn sẽ có:
- ✅ Database `sfb_db` được tạo
- ✅ Tất cả bảng được tạo (users, roles, news, media_folders, media_files, ...)
- ✅ Permissions được thiết lập
- ✅ User admin mặc định: `admin@sfb.local` / `admin123`
- ✅ Thư mục media mặc định được tạo

Bạn có thể start backend server ngay: `npm start`
