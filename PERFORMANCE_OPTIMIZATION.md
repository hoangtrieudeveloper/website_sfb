# Tối ưu hóa Performance cho Frontend Public

## Vấn đề đã phát hiện

1. **Tất cả các page đang sử dụng `"use client"`** → Không có SSR/ISR, render hoàn toàn ở client
2. **Data hardcoded** → Không fetch từ API
3. **Không có prefetching** → Chuyển trang chậm
4. **Một số page có `force-static` nhưng render client components** → Không hợp lý

## Đã thực hiện

### 1. Backend - Public API Routes ✅
- Tạo `/api/public/news` - Lấy danh sách bài viết công khai (chỉ published)
- Tạo `/api/public/news/featured` - Lấy bài viết nổi bật
- Tạo `/api/public/news/:slug` - Lấy chi tiết bài viết theo slug
- **Không cần authentication** - Phù hợp cho public website

### 2. Frontend - ISR Configuration ✅
- **Homepage**: `revalidate = 60` (1 phút)
- **News page**: `revalidate = 30` (30 giây)
- **Products page**: `revalidate = 60` (1 phút)
- **About page**: `revalidate = 3600` (1 giờ)

### 3. Next.js Config Optimization ✅
- Bật `swcMinify` và `compress`
- Cấu hình image optimization với AVIF và WebP
- Tối ưu package imports cho `lucide-react`

## Cần làm tiếp

### 1. Cập nhật NewsPage để fetch data từ API
Hiện tại `NewsPage` đang sử dụng mock data hardcoded. Cần:
- Tách phần client-side logic (search, filter) ra component riêng
- Fetch data ở Server Component
- Sử dụng ISR để cache

### 2. Tạo dynamic route cho news-detail
- Chuyển từ `/news-detail` sang `/news/[slug]`
- Fetch data từ API theo slug
- Sử dụng SSR hoặc ISR

### 3. Tối ưu hóa Navigation
- Đảm bảo tất cả Link components có prefetching
- Sử dụng `next/link` thay vì `<a>` tags

## Cách test

1. **Kiểm tra SSR/ISR hoạt động**:
   ```bash
   # Build production
   npm run build
   
   # Start production server
   npm start
   ```

2. **Kiểm tra Network tab**:
   - Xem HTML được render từ server (không phải empty shell)
   - Kiểm tra API calls được cache đúng cách

3. **Test chuyển trang**:
   - Navigate giữa các pages
   - Kiểm tra tốc độ load (nên nhanh hơn nhiều)

## Lưu ý

- **ISR revalidate**: Thời gian cache, sau đó sẽ revalidate trong background
- **Server Components**: Không thể sử dụng hooks như `useState`, `useEffect`
- **Client Components**: Chỉ dùng khi cần interactivity (forms, buttons, etc.)

## Kết quả mong đợi

- ✅ Chuyển trang nhanh hơn (SSR/ISR)
- ✅ SEO tốt hơn (Server-rendered content)
- ✅ Tải trang lần đầu nhanh hơn
- ✅ Giảm tải cho client (ít JavaScript cần execute)

