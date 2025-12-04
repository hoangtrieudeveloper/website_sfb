## SFB Website – Next.js App Router

Dự án này là website giới thiệu công ty SFB, đã được chuyển sang **Next.js (App Router)** và tái sử dụng toàn bộ giao diện / component có sẵn.

Mục tiêu của README: giúp người mới vào chỉ cần đọc file này là **hiểu cấu trúc**, **setup môi trường**, **chạy dev**, **build** và **mở rộng code**.

---

## 1. Công nghệ chính

- **Next.js 14 – App Router** (`app/` directory) với **Server-Side Rendering (SSR)**
- **React 18**, **TypeScript**
- **Tailwind v4 (build sẵn)** + custom style trong `styles/style.css`, `styles/globals.css`, `styles/color-system.css`, `styles/animations.css`
- **lucide-react**: icon

---

## 2. Cấu trúc thư mục

Chỉ liệt kê các thư mục / file quan trọng cho việc phát triển:

- `app/`
  - `layout.tsx` – root layout:
    - import `app/globals.css` (kéo theo toàn bộ CSS trong `styles/`)
    - bọc `<html>` / `<body>` và render `children`

  - `(public)/` – **route group** cho website công ty (public site)
    - `layout.tsx` – layout public: render `Header` / `Footer` + `<main>`
    - `page.tsx` – trang **Home** (`/`)
    - `about/page.tsx` – trang **Giới thiệu** (`/about`)
    - `contact/page.tsx` – trang **Liên hệ** (`/contact`)
    - `solutions/page.tsx` – trang **Giải pháp** (`/solutions`)
    - `industries/page.tsx` – trang **Lĩnh vực** (`/industries`)
    - `products/page.tsx` – trang **Sản phẩm** (`/products`)
    - `news/page.tsx` – trang **Tin tức** (`/news`)
    - `news-detail/page.tsx` – trang **Chi tiết tin tức demo** (`/news-detail`)
    - `careers/page.tsx` – trang **Tuyển dụng** (`/careers`)

  - `admin/` – **khu vực admin** (`/admin`, `/admin/login`)
    - `layout.tsx` – layout riêng cho admin (header đơn giản, không dùng Header/Footer public)
    - `page.tsx` – `/admin` – dashboard admin (SSR/dynamic, sẵn sàng fetch data real-time)
    - `login/page.tsx` – `/admin/login` – trang đăng nhập admin (client component – form demo)

- `components/`
  - `Header.tsx` – header cố định, dùng `next/link` + `usePathname()` để highlight menu theo URL.
  - `Footer.tsx` – footer chung, có block contact, quick links, social, newsletter.
  - `HeroBanner.tsx`, `Features.tsx`, `Solutions.tsx`, `Industries.tsx`, `AboutCompany.tsx`, `Testimonials.tsx`
    - Các section chính của trang Home.
  - `figma/ImageWithFallback.tsx`
    - Wrapper cho `<img>` có fallback.
  - `ui/*`
    - Bộ component UI tái sử dụng (accordion, button, card, dialog, form, v.v.).

- `pages/`
  - Các file `*Page.tsx` chứa UI chi tiết cho từng trang (About, Products, Solutions, Industries, News, NewsDetail, Careers, Contact).
  - Trong App Router, **không dùng `pages/` để routing**, mà:
    - `app/[route]/page.tsx` import component từ đây rồi render.

- `styles/`
  - `style.css` – bundle CSS chính (Tailwind v4 + custom), đang được import trong `app/globals.css`.
  - `globals.css` – base style, font, animation, scroll-behavior.
  - `color-system.css` – biến màu brand SFB.
  - `animations.css` – các animations dùng chung (blob, fadeInUp, gradient, etc.).

- Cấu hình:
  - `package.json` – scripts, dependencies.
  - `next.config.mjs` – cấu hình Next.js (strict mode).
  - `tsconfig.json`, `next-env.d.ts` – cấu hình TypeScript / Next.

---

## 3. Cách cài đặt & chạy dự án

Yêu cầu:
- Node.js >= 18
- npm (hoặc pnpm/yarn, ví dụ bên dưới dùng npm)

### 3.1. Cài dependencies

Tại thư mục gốc dự án (chính là thư mục chứa `package.json`):

```bash
npm install
```

### 3.2. Chạy dev server

```bash
npm run dev
```

Mặc định Next.js chạy tại `http://localhost:3000`.

Các route chính:

- `/` – Trang chủ
- `/about` – Giới thiệu
- `/products` – Sản phẩm & giải pháp
- `/solutions` – Giải pháp công nghệ
- `/industries` – Lĩnh vực
- `/news` – Danh sách tin tức
- `/news-detail` – Trang chi tiết tin demo (mock data)
- `/careers` – Tuyển dụng
- `/contact` – Liên hệ

### 3.3. Build production

```bash
npm run build
npm run start   # chạy server production
```

---

## 4. Cách routing & navigation

- **Routing dùng App Router**:
  - Mỗi thư mục con trong `app/` có file `page.tsx` tương ứng với 1 route.
  - Ví dụ:
    - `app/about/page.tsx` → `/about`
    - `app/solutions/page.tsx` → `/solutions`

- **Header navigation**:
  - `components/Header.tsx`:
    - Dùng `next/link` cho link:
      - `/`, `/about`, `/products`, `/solutions`, `/industries`, `/news`, `/careers`, `/contact`
    - `usePathname()` để đánh dấu menu đang active.

- **Anchor trong 1 trang (scroll nội bộ)**:
  - Một số trang dùng `id` và `href="#id"` để cuộn trong chính trang đó, ví dụ:
    - `ProductsPage`:
      - `href="#products"` → section list sản phẩm (filter).
    - `CareersPage`:
      - `href="#benefits"`, `href="#positions"` → section phúc lợi / vị trí tuyển.
    - `SolutionsPage`:
      - `href="#solutions-list"` → section danh sách giải pháp.
    - `NewsDetailPage`:
      - `href="#overview"`, `#challenge`, `#solution`, `#implementation`, `#results`, `#conclusion` → trong mục lục (Table of Contents).

---

## 5. CSS & Tailwind

- Toàn bộ CSS được load thông qua:
  - `app/globals.css`:
    - `@import "../styles/style.css";`
    - `@import "../styles/globals.css";`
    - `@import "../styles/color-system.css";`
    - `@import "../styles/animations.css";`

- `styles/style.css` là file build Tailwind v4 (rất dài), **không nên chỉnh trực tiếp** nếu không cần:
  - Nếu bạn dùng Tailwind CLI riêng để build, hãy cập nhật file này tương ứng.

- `styles/globals.css`:
  - Thiết lập font, root variables, animation (`animate-float`, `animate-pulse-glow`), scrollbar, v.v.

- `styles/animations.css`:
  - Các animations dùng chung: `blob`, `fadeInUp`, `gradient`, `partner-marquee`, `pulse`.
  - Đã được chuyển từ `styled-jsx` sang CSS thuần để hỗ trợ SSR tốt hơn.

- `styles/color-system.css`:
  - Định nghĩa biến màu brand SFB: `--color-primary`, `--color-primary-light`, ...

---

## 6. Coding Guidelines

> **Lưu ý cho AI Assistants**: File `.cursorrules` chứa guidelines chi tiết cho Cursor AI. README này cung cấp overview cho developers.

### 6.1. General Guidelines

* **Server Components First**: Luôn ưu tiên Server Components, chỉ dùng `"use client"` khi thực sự cần (useState, useEffect, event handlers, browser APIs)
* **CSS over styled-jsx**: Sử dụng Tailwind CSS và global CSS files, không dùng `styled-jsx`
* **Component Structure**: Giữ file sizes nhỏ, tách helper functions và components riêng
* **Responsive Design**: Ưu tiên flexbox và grid, chỉ dùng absolute positioning khi cần thiết
* **Image Handling**: Luôn sử dụng `ImageWithFallback` component thay vì `<img>` tag thông thường
* **Import Paths**: Luôn dùng relative imports (`../components/`, `../../pages/`), không dùng absolute paths như `@/components`

### 6.2. Design System Guidelines

* **Primary Color**: `#006FB3` (rgb(0, 111, 179))
* **Secondary Color**: `#0088D9` (rgb(0, 136, 217))
* **Background Colors**: 
  - Light: `#E6F4FF` (rgb(230, 244, 255))
  - Lighter: `#D6EEFF` (rgb(214, 238, 255))
* **Typography**: Font Inter, base size 16px
* **Animations**: Sử dụng classes từ `styles/animations.css` (animate-blob, fade-in-up, etc.)

### 6.3. Component Usage Rules

* **Buttons**: 
  - Primary: Gradient từ `#006FB3` đến `#0088D9`
  - Secondary: Outlined với border `#006FB3`
  - Luôn có hover states và transitions
* **Links**: Sử dụng Next.js `Link` component thay vì `<a>` tag cho internal navigation
* **Forms**: Sử dụng HTML form elements với Tailwind styling, có thể nâng cấp lên components từ `components/ui/` sau này

### 6.4. File Naming Conventions

* Components: PascalCase (ví dụ: `HeroBanner.tsx`)
* Pages: PascalCase với suffix `Page` (ví dụ: `AboutPage.tsx`)
* Routes: lowercase với kebab-case (ví dụ: `app/about/page.tsx`)
* CSS files: kebab-case (ví dụ: `animations.css`)

### 6.5. Code Organization

* **Server Components**: Đặt trong `app/` và `components/` (không có "use client")
* **Client Components**: Chỉ khi cần interactivity, đánh dấu rõ ràng với `"use client"`
* **Page Components**: Đặt trong `pages/` folder, được import bởi routes trong `app/`
* **Reusable Components**: Đặt trong `components/` folder

### 6.6. Component Export Pattern

* **Named Exports**: Luôn dùng `export function ComponentName()` thay vì `export default`
* **Route Files**: Dùng `export default function RouteNameRoute()` trong `app/[route]/page.tsx`
* **Example**:
  ```tsx
  // components/NewComponent.tsx
  export function NewComponent() {
    return <div>Content</div>;
  }
  
  // app/new/page.tsx
  import { NewComponent } from "../../components/NewComponent";
  
  export default function NewRoute() {
    return <NewComponent />;
  }
  ```

### 6.7. Current Client Components Reference

Các component sau đây là Client Components (có "use client"):
- `components/Header.tsx` - navigation với state
- `components/figma/ImageWithFallback.tsx` - error handling
- `pages/ProductsPage.tsx` - filtering
- `pages/NewsPage.tsx` - filtering và search
- `pages/ContactPage.tsx` - form state
- `pages/NewsDetailPage.tsx` - interactive elements

**Tất cả các component khác đều là Server Components.**

---

## 7. Làm việc với các trang / component

### 7.1. Thêm trang mới

Ví dụ thêm trang `/partners`:

1. Tạo file `pages/PartnersPage.tsx` (nếu muốn tách UI ra riêng).
2. Tạo route Next.js:

```tsx
// app/partners/page.tsx
import { PartnersPage } from "../../pages/PartnersPage";

export default function PartnersRoute() {
  return <PartnersPage />;
}
```

**Lưu ý:** Chỉ thêm `"use client"` nếu component có interactivity (useState, useEffect, event handlers). Hầu hết các trang nên là Server Components để tận dụng SSR.

3. Thêm link trong `components/Header.tsx` nếu cần hiển thị ở menu.

### 7.2. Sửa UI một trang

- Vào file tương ứng trong `pages/`:
  - Ví dụ `/products` → `pages/ProductsPage.tsx`
  - `/contact` → `pages/ContactPage.tsx`
- Chỉnh JSX / Tailwind class tại đó.
- Không cần sửa thêm router nếu bạn chỉ thay đổi layout / nội dung.

### 7.3. Sử dụng `ImageWithFallback`

Component này nằm trong `components/figma/ImageWithFallback.tsx`:

```tsx
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

<ImageWithFallback
  src="https://link-to-image"
  alt="Mô tả"
  className="w-full h-auto object-cover"
/>
```

---

## 8. API / Backend

- Dự án này hiện **không có API / backend riêng** (thuần UI).
- Mọi dữ liệu đang ở dạng **mock / static** trong các file `*Page.tsx`:
  - Ví dụ `NewsDetailPage` chứa object `article`, `relatedArticles`, `tags` hard-code.
  - Khi cần tích hợp **API thật**, bạn có thể:
    - Dùng **Server Component** (khuyến nghị) để fetch data trên server với `async/await`.
    - Hoặc dùng **Client Component** với `useEffect` và `fetch` nếu cần interactivity phía client.

---

## 9. Lệnh npm quan trọng

- `npm run dev` – chạy chế độ phát triển.
- `npm run build` – build production.
- `npm run start` – chạy server production sau khi build.
- `npm run lint` – (nếu cần) chạy ESLint theo config Next.

---

## 10. Gợi ý workflow cho dev mới

1. **Đọc nhanh** `README.md` (file này) để hiểu routing + cấu trúc.
2. Chạy:
   ```bash
   npm install
   npm run dev
   ```
3. Mở `http://localhost:3000`, click qua các menu để quen UI.
4. Khi cần sửa trang nào:
   - Tìm file `pages/<TênTrang>Page.tsx`.
   - Nếu cần chỉnh navigation / header → `components/Header.tsx`.
   - Nếu cần chỉnh footer / contact → `components/Footer.tsx` hoặc `pages/ContactPage.tsx`.
5. Commit kèm mô tả rõ ràng (VD: `feat: add partners page`, `fix: update contact info`).

Nếu bạn thêm công nghệ / bước build mới (ESLint rules, testing, CI/CD, v.v.) hãy cập nhật lại README để người mới không bị lạc. 


