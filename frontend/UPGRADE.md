# Hướng dẫn nâng cấp Next.js 14 → 16

## Tổng quan

Project đã được nâng cấp từ **Next.js 14.2.33** lên **Next.js 16.0.7** (phiên bản mới nhất).

### Các thay đổi chính:

- ✅ **Next.js**: `14.2.33` → `16.0.7`
- ✅ **React**: `18.3.1` → `18.3.1` (giữ nguyên để tương thích với các packages)
- ✅ **React DOM**: `18.3.1` → `18.3.1` (giữ nguyên)
- ✅ **TypeScript**: `5.6.3` → `5.7.2`
- ✅ **ESLint Config Next**: `16.0.6` → `16.0.7`
- ✅ **@types/node**: `24.10.1` → `22.10.2`
- ✅ **@types/react**: `18.3.10` → `18.3.12`
- ✅ **@types/react-dom**: `18.3.2` → `18.3.1`
- ✅ **ESLint**: `8.57.0` → `9.17.0`

### ⚠️ Lưu ý quan trọng:

- **Node.js version**: Next.js 16 yêu cầu **Node.js >= 20.9.0**
  - Hiện tại bạn đang dùng Node.js v18.20.8
  - **Cần nâng cấp Node.js lên version 20.x hoặc 22.x** trước khi chạy Next.js 16
  - Kiểm tra: `node --version`
  - Download: https://nodejs.org/
  
- **React version**: Giữ React 18 để tương thích với các packages như `react-day-picker`, Radix UI, etc.
  - Next.js 16 hỗ trợ cả React 18 và React 19
  - Có thể nâng cấp lên React 19 sau khi các packages đã hỗ trợ đầy đủ

---

## Các bước nâng cấp

### 1. Cài đặt dependencies mới

```bash
cd frontend
npm install
```

### 2. Xóa cache và build lại

```bash
# Xóa .next folder
rm -rf .next
# hoặc trên Windows PowerShell
Remove-Item -Recurse -Force .next

# Build lại project
npm run build
```

### 3. Kiểm tra và chạy dev server

```bash
npm run dev
```

---

## Breaking Changes cần lưu ý

### Next.js 16

1. **Node.js version**: Yêu cầu Node.js 20.9+ hoặc 22.x
   - Kiểm tra: `node --version`
   - Nâng cấp nếu cần: https://nodejs.org/

2. **Middleware**: Mặc định sử dụng Edge Runtime
   - File `middleware.ts` hiện tại đã tương thích, không cần thay đổi

3. **App Router**: Không có breaking changes lớn cho App Router
   - Tất cả routes hiện tại (`app/(public)/`, `app/(admin)/admin/`) vẫn hoạt động bình thường

4. **API Routes**: Không có thay đổi lớn
   - Routes trong `app/api/` vẫn hoạt động như cũ

### React 19

1. **TypeScript types**: Đã cập nhật `@types/react` và `@types/react-dom` lên version 19
   - Một số type definitions có thể thay đổi, nhưng code hiện tại đã tương thích

2. **Hooks**: Không có breaking changes lớn
   - `useState`, `useEffect`, `useRouter`, etc. vẫn hoạt động như cũ

3. **Server Components**: Cải thiện hiệu năng và stability
   - Không cần thay đổi code

---

## Kiểm tra sau khi nâng cấp

### 1. Test các trang chính

- ✅ `/` - Trang chủ
- ✅ `/about` - Giới thiệu
- ✅ `/solutions` - Giải pháp
- ✅ `/products` - Sản phẩm
- ✅ `/news` - Tin tức
- ✅ `/contact` - Liên hệ

### 2. Test phần Admin

- ✅ `/admin/login` - Đăng nhập
- ✅ `/admin` - Dashboard
- ✅ `/admin/news` - Quản lý tin tức
- ✅ `/admin/users` - Quản lý người dùng
- ✅ `/admin/categories` - Quản lý danh mục
- ✅ `/admin/settings` - Cài đặt

### 3. Test API Routes

- ✅ `/api/admin/login` - Login API
- ✅ `/api/admin/logout` - Logout API

### 4. Test Authentication Flow

- ✅ Chưa login → redirect về `/admin/login`
- ✅ Login thành công → redirect về `/admin`
- ✅ Đã login → truy cập `/admin/login` → redirect về `/admin`
- ✅ Logout → redirect về `/admin/login`

---

## Troubleshooting

### Lỗi: "Module not found" hoặc "Cannot find module"

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: TypeScript errors

```bash
# Xóa .next và build lại
rm -rf .next
npm run build
```

### Lỗi: ESLint errors

```bash
# Cập nhật ESLint config
npm install --save-dev eslint-config-next@latest
```

### Lỗi: React version mismatch

```bash
# Đảm bảo React và React DOM cùng version
npm install react@latest react-dom@latest
```

---

## Tính năng mới trong Next.js 16

1. **Improved Performance**: 
   - Tối ưu hóa rendering và caching tốt hơn
   - Faster page loads

2. **Better Developer Experience**:
   - Improved error messages
   - Better TypeScript support

3. **Enhanced Security**:
   - Improved middleware security
   - Better cookie handling

4. **React 19 Features**:
   - Improved Server Components
   - Better hydration
   - Enhanced form handling

---

## Rollback (nếu cần)

Nếu gặp vấn đề nghiêm trọng, có thể rollback về Next.js 14:

```bash
npm install next@^14.2.33 react@^18.3.1 react-dom@^18.3.1
npm install --save-dev @types/react@^18.3.10 @types/react-dom@^18.3.2 eslint-config-next@^14.2.33
```

---

## Tài liệu tham khảo

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Next.js Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

---

## Ghi chú

- ✅ Project không sử dụng `next/image`, nên không bị ảnh hưởng bởi breaking changes của Image component
- ✅ Middleware hiện tại đã tương thích với Next.js 16
- ✅ Tất cả API routes vẫn hoạt động bình thường
- ✅ Authentication flow không bị ảnh hưởng

