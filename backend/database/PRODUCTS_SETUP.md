# Hướng dẫn Setup Products Management System

## Bước 1: Chạy Database Schema

### Cách 1: Sử dụng Node.js Script (Khuyến nghị - Không cần psql)

Từ thư mục gốc project:

```bash
npm run setup:products
```

Hoặc từ thư mục backend:

```bash
cd backend
npm run setup:products
```

Script này sẽ tự động:
- ✅ Kết nối đến database
- ✅ Chạy products_schema.sql
- ✅ Tạo 11 bảng Products
- ✅ Seed data mặc định (5 categories, 4 benefits, 1 hero)
- ✅ Kiểm tra và hiển thị kết quả

### Cách 2: Sử dụng psql (Nếu đã cài đặt PostgreSQL CLI)

```bash
# Windows (nếu psql đã có trong PATH)
psql -U postgres -d sfb_db -f backend/database/products_schema.sql

# Hoặc với đường dẫn đầy đủ (thay đổi version nếu cần)
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d sfb_db -f backend/database/products_schema.sql
```

### Cách 3: Sử dụng pgAdmin hoặc tool khác

Mở file `backend/database/products_schema.sql` trong pgAdmin và chạy.

File này sẽ tạo:
- `product_categories` - Danh mục sản phẩm
- `products` - Sản phẩm chính
- `product_features` - Tính năng của sản phẩm
- `product_benefits` - Lợi ích hiển thị trên trang products
- `product_page_hero` - Hero section của trang products
- `product_details` - Trang chi tiết sản phẩm
- `product_overview_cards` - Cards trong Overview section
- `product_showcase_bullets` - Bullets trong Showcase section
- `product_numbered_sections` - Các section có số thứ tự
- `product_section_paragraphs` - Paragraphs trong numbered sections
- `product_expand_bullets` - Bullets trong Expand section

## Bước 2: Kiểm tra kết quả

Sau khi chạy script, bạn sẽ thấy output tương tự:

```
✅ Found 11 Products table(s):
   - product_benefits
   - product_categories
   - product_details
   ...
📦 Seed data:
   - Categories: 5
   - Benefits: 4
   - Hero settings: 1
```

## Bước 3: Kiểm tra Backend

Backend đã được tích hợp sẵn:
- Controllers: `backend/src/controllers/products.controller.js`
- Routes: `backend/src/routes/products.routes.js`
- API endpoints đã được thêm vào `backend/src/app.js`

## Bước 5: Kiểm tra Frontend

Frontend admin pages đã được tạo:
- `/admin/products` - Danh sách sản phẩm
- `/admin/products/create` - Tạo sản phẩm mới
- `/admin/products/edit/[id]` - Sửa sản phẩm
- `/admin/products/categories` - Quản lý danh mục
- `/admin/products/benefits` - Quản lý lợi ích

## API Endpoints

### Products
- `GET /api/admin/products` - Danh sách sản phẩm
- `GET /api/admin/products/:id` - Chi tiết sản phẩm
- `POST /api/admin/products` - Tạo sản phẩm mới
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm
- `PATCH /api/admin/products/:id/toggle` - Bật/tắt (active hoặc featured)
- `GET /api/admin/products/:productId/detail` - Lấy chi tiết trang detail
- `POST/PUT /api/admin/products/:productId/detail` - Lưu chi tiết trang detail

### Categories
- `GET /api/admin/products/categories` - Danh sách danh mục
- `GET /api/admin/products/categories/:id` - Chi tiết danh mục
- `POST /api/admin/products/categories` - Tạo danh mục mới
- `PUT /api/admin/products/categories/:id` - Cập nhật danh mục
- `DELETE /api/admin/products/categories/:id` - Xóa danh mục

### Benefits
- `GET /api/admin/products/benefits` - Danh sách lợi ích
- `GET /api/admin/products/benefits/:id` - Chi tiết lợi ích
- `POST /api/admin/products/benefits` - Tạo lợi ích mới
- `PUT /api/admin/products/benefits/:id` - Cập nhật lợi ích
- `DELETE /api/admin/products/benefits/:id` - Xóa lợi ích

### Hero
- `GET /api/admin/products/hero` - Lấy hero settings
- `PUT /api/admin/products/hero` - Cập nhật hero settings

## Permissions

Các permissions đã được tự động thêm vào database:
- `products.view` - Xem danh sách sản phẩm
- `products.manage` - Quản lý sản phẩm
- `product_categories.view` - Xem danh mục
- `product_categories.manage` - Quản lý danh mục
- `product_benefits.manage` - Quản lý lợi ích
- `product_hero.manage` - Quản lý Hero

Permissions đã được gán tự động cho role `admin` và `editor`.

## Seed Data

Schema đã bao gồm seed data mặc định:
- 5 categories: all, edu, justice, gov, kpi
- 4 benefits mẫu
- 1 hero settings mẫu

## Lưu ý

1. Đảm bảo đã chạy `backend/database/schema.sql` trước (nếu chưa có)
2. Chạy `products_schema.sql` sau khi đã có database cơ bản
3. Backend server sẽ tự động load routes mới khi restart
4. Frontend cần rebuild nếu có thay đổi TypeScript

