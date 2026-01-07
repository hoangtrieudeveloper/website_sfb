# Hướng dẫn Setup SEO cho beta.sfb.vn

## 📋 Checklist SEO đã hoàn thành

### ✅ 1. Metadata & Meta Tags
- [x] Tất cả trang đã có `generateMetadata()` với `generateSeoMetadata()`
- [x] Meta title, description, keywords
- [x] Open Graph tags (og:title, og:description, og:image, og:type)
- [x] Twitter Card tags
- [x] Canonical URLs
- [x] Robots meta tags

### ✅ 2. Structured Data (JSON-LD)
- [x] Organization schema (trang chủ)
- [x] Product schema (trang sản phẩm)
- [x] Article schema (trang tin tức)
- [x] Breadcrumb schema (có thể thêm nếu cần)

### ✅ 3. Sitemap & Robots.txt
- [x] Sitemap tự động tại `/sitemap.xml`
- [x] Robots.txt tại `/robots.txt`
- [x] Sitemap bao gồm: static pages, products, news

### ✅ 4. Các trang đã có SEO
- [x] `/` - Trang chủ
- [x] `/products` - Danh sách sản phẩm
- [x] `/products/[slug]` - Chi tiết sản phẩm
- [x] `/news` - Danh sách tin tức
- [x] `/news/[slug]` - Chi tiết tin tức
- [x] `/about` - Giới thiệu
- [x] `/contact` - Liên hệ
- [x] `/industries` - Lĩnh vực
- [x] `/careers` - Tuyển dụng

## 🔧 Cấu hình Environment Variables

### Cần set trong `.env.production` hoặc trên VPS:

```bash
NEXT_PUBLIC_SITE_URL=https://beta.sfb.vn
GOOGLE_SITE_VERIFICATION=nskAzb2wgDby-HUyaAmxjuyMNgkQ1Z-GSbTs-Tx1RJw
```

**Lưu ý:** 
- `NEXT_PUBLIC_SITE_URL`: Domain phải có `https://` prefix, không có trailing slash `/`
- `GOOGLE_SITE_VERIFICATION`: Google Site Verification code (đã được hardcode trong code, có thể override qua env)
- Sau khi set, cần rebuild và restart Next.js app

## 📝 Hướng dẫn Google Search Console

### Bước 1: Xác thực Domain
1. Truy cập: https://search.google.com/search-console
2. Chọn "Add Property" → "Domain"
3. Nhập: `beta.sfb.vn`
4. Chọn phương thức xác thực:
   - **HTML tag (Recommended)**: Google Site Verification code đã được nhúng vào `<head>` của website
     - Code: `nskAzb2wgDby-HUyaAmxjuyMNgkQ1Z-GSbTs-Tx1RJw`
     - Meta tag: `<meta name="google-site-verification" content="nskAzb2wgDby-HUyaAmxjuyMNgkQ1Z-GSbTs-Tx1RJw" />`
     - Đã được tự động thêm vào tất cả các trang
   - **DNS record**: Nếu HTML tag không hoạt động, có thể dùng DNS TXT record
   - **HTML file**: Upload file HTML vào root directory (không khuyến nghị)

### Bước 2: Submit Sitemap
1. Vào **Sitemaps** trong menu bên trái
2. Nhập URL: `https://beta.sfb.vn/sitemap.xml`
3. Click **Submit**

### Bước 3: Kiểm tra Indexing
1. Vào **URL Inspection** tool
2. Test các URL quan trọng:
   - `https://beta.sfb.vn/`
   - `https://beta.sfb.vn/products`
   - `https://beta.sfb.vn/news`
3. Click **Request Indexing** cho các trang quan trọng

### Bước 4: Kiểm tra Coverage
1. Vào **Coverage** report
2. Kiểm tra các lỗi:
   - 404 errors
   - Redirect errors
   - Blocked by robots.txt
   - Excluded by noindex tag

### Bước 5: Kiểm tra Performance
1. Vào **Performance** report
2. Xem:
   - Impressions (lượt hiển thị)
   - Clicks (lượt click)
   - CTR (Click-through rate)
   - Average position

## 🔍 Kiểm tra SEO trên Production

### 1. Kiểm tra Meta Tags
Sử dụng tool: https://www.opengraph.xyz/
- Nhập URL: `https://beta.sfb.vn/`
- Kiểm tra: og:title, og:description, og:image

### 2. Kiểm tra Structured Data
Sử dụng: https://search.google.com/test/rich-results
- Nhập URL
- Kiểm tra Organization, Product, Article schemas

### 3. Kiểm tra Sitemap
Truy cập: `https://beta.sfb.vn/sitemap.xml`
- Kiểm tra tất cả URLs có đúng domain
- Kiểm tra lastModified dates
- Kiểm tra priorities

### 4. Kiểm tra Robots.txt
Truy cập: `https://beta.sfb.vn/robots.txt`
- Kiểm tra sitemap URL đúng domain
- Kiểm tra disallow rules

## 🛠️ Quản lý SEO qua Admin Panel

### Truy cập: `/admin/seo`

1. **Quản lý SEO cho từng trang:**
   - Chọn page path (ví dụ: `/`, `/products`, `/about`)
   - Nhập title, description, keywords
   - Upload OG image (1200x630px recommended)
   - Set canonical URL
   - Cấu hình robots (index/noindex, follow/nofollow)

2. **Các trường quan trọng:**
   - **Title**: 50-60 ký tự (hiển thị trên Google)
   - **Description**: 150-160 ký tự (hiển thị trên Google)
   - **OG Image**: 1200x630px (hiển thị khi share trên social)
   - **Canonical URL**: Tránh duplicate content

## 📊 Monitoring & Analytics

### 1. Google Search Console
- Kiểm tra hàng tuần
- Xem lỗi indexing
- Xem queries và performance

### 2. Google Analytics (nếu có)
- Track organic traffic
- Track page views
- Track conversions

### 3. Core Web Vitals
- Kiểm tra trong Google Search Console
- Đảm bảo: LCP < 2.5s, FID < 100ms, CLS < 0.1

## ⚠️ Lưu ý quan trọng

1. **Domain phải match:**
   - Tất cả URLs trong sitemap phải dùng `https://beta.sfb.vn`
   - Canonical URLs phải đúng domain
   - OG images phải là absolute URLs

2. **HTTPS required:**
   - Google ưu tiên HTTPS
   - Đảm bảo SSL certificate hợp lệ

3. **Mobile-friendly:**
   - Đảm bảo responsive design
   - Test bằng: https://search.google.com/test/mobile-friendly

4. **Page Speed:**
   - Optimize images
   - Minify CSS/JS
   - Enable caching

5. **Content Quality:**
   - Unique content cho mỗi trang
   - Regular updates
   - Internal linking

## 🔗 Resources

- [Google Search Console](https://search.google.com/search-console)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Open Graph Debugger](https://www.opengraph.xyz/)

## 📞 Support

Nếu có vấn đề về SEO, kiểm tra:
1. Console logs trong browser
2. Network tab để xem API calls
3. Backend logs cho SEO API
4. Database để xem SEO data

