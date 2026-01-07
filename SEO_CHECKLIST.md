# ✅ SEO Checklist cho beta.sfb.vn

## 🎯 Tổng quan

Project đã được setup đầy đủ SEO với các tính năng:
- ✅ Metadata & Meta Tags (Title, Description, OG, Twitter)
- ✅ Structured Data (JSON-LD) cho Organization, Product, Article
- ✅ Sitemap tự động (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ Admin panel quản lý SEO (`/admin/seo`)

## 📝 Các bước cần thực hiện trên VPS

### 1. Set Environment Variables

**File:** `.env.production` trong thư mục `frontend/`

```bash
NEXT_PUBLIC_SITE_URL=https://beta.sfb.vn
GOOGLE_SITE_VERIFICATION=nskAzb2wgDby-HUyaAmxjuyMNgkQ1Z-GSbTs-Tx1RJw
```

**Lưu ý:**
- `NEXT_PUBLIC_SITE_URL`: Phải có `https://` prefix, không có trailing slash `/`
- `GOOGLE_SITE_VERIFICATION`: Google Site Verification code (đã được nhúng vào code, có thể set qua env để dễ quản lý)
- Sau khi set, cần rebuild Next.js app:
  ```bash
  cd frontend
  npm run build
  pm2 restart all  # hoặc restart service tương ứng
  ```

### 2. Verify trên Production

Sau khi deploy, kiểm tra các URLs sau:

#### ✅ Sitemap
```
https://beta.sfb.vn/sitemap.xml
```
- Kiểm tra tất cả URLs có đúng domain `https://beta.sfb.vn`
- Kiểm tra không có URLs localhost

#### ✅ Robots.txt
```
https://beta.sfb.vn/robots.txt
```
- Kiểm tra sitemap URL: `Sitemap: https://beta.sfb.vn/sitemap.xml`

#### ✅ Meta Tags
Truy cập: `https://beta.sfb.vn/`
- View page source
- Kiểm tra có `<title>`, `<meta name="description">`
- Kiểm tra có Open Graph tags (`og:title`, `og:description`, `og:image`)
- Kiểm tra có Twitter Card tags
- **Kiểm tra Google Site Verification:**
  - Tìm: `<meta name="google-site-verification" content="nskAzb2wgDby-HUyaAmxjuyMNgkQ1Z-GSbTs-Tx1RJw" />`
  - Phải có trong `<head>` section

#### ✅ Structured Data
Truy cập: `https://beta.sfb.vn/`
- View page source
- Tìm `<script type="application/ld+json">`
- Kiểm tra có Organization schema

### 3. Google Search Console Setup

#### Bước 1: Xác thực Domain
1. Truy cập: https://search.google.com/search-console
2. Add Property → Domain
3. Nhập: `beta.sfb.vn`
4. Chọn phương thức xác thực (DNS hoặc HTML file)

#### Bước 2: Submit Sitemap
1. Vào **Sitemaps** trong menu
2. Nhập: `https://beta.sfb.vn/sitemap.xml`
3. Click **Submit**

#### Bước 3: Request Indexing
1. Vào **URL Inspection** tool
2. Test các URLs quan trọng:
   - `https://beta.sfb.vn/`
   - `https://beta.sfb.vn/products`
   - `https://beta.sfb.vn/news`
3. Click **Request Indexing** cho mỗi URL

#### Bước 4: Kiểm tra Coverage
1. Vào **Coverage** report
2. Kiểm tra và fix các lỗi:
   - 404 errors
   - Redirect errors
   - Blocked by robots.txt
   - Excluded by noindex

### 4. Testing Tools

Sử dụng các tools sau để verify SEO:

#### Open Graph Debugger
- URL: https://www.opengraph.xyz/
- Test: `https://beta.sfb.vn/`
- Kiểm tra: og:title, og:description, og:image

#### Rich Results Test
- URL: https://search.google.com/test/rich-results
- Test: `https://beta.sfb.vn/`
- Kiểm tra: Organization schema

#### Mobile-Friendly Test
- URL: https://search.google.com/test/mobile-friendly
- Test: `https://beta.sfb.vn/`
- Đảm bảo: Mobile-friendly

#### PageSpeed Insights
- URL: https://pagespeed.web.dev/
- Test: `https://beta.sfb.vn/`
- Đảm bảo: Core Web Vitals tốt

## 🔧 Quản lý SEO qua Admin Panel

### Truy cập: `https://beta.sfb.vn/admin/seo`

1. **Cấu hình SEO cho từng trang:**
   - Chọn page path (ví dụ: `/`, `/products`, `/about`)
   - Nhập title (50-60 ký tự)
   - Nhập description (150-160 ký tự)
   - Nhập keywords (phân cách bằng dấu phẩy)
   - Upload OG image (1200x630px recommended)
   - Set canonical URL
   - Cấu hình robots (index/noindex, follow/nofollow)

2. **Các trang quan trọng cần cấu hình:**
   - `/` - Trang chủ
   - `/products` - Danh sách sản phẩm
   - `/news` - Danh sách tin tức
   - `/about` - Giới thiệu
   - `/contact` - Liên hệ

## 📊 Monitoring

### Hàng tuần:
- [ ] Kiểm tra Google Search Console
- [ ] Xem lỗi indexing
- [ ] Xem queries và performance
- [ ] Kiểm tra Core Web Vitals

### Hàng tháng:
- [ ] Review SEO data trong admin panel
- [ ] Update content nếu cần
- [ ] Check broken links
- [ ] Optimize images

## ⚠️ Lưu ý quan trọng

1. **Domain consistency:**
   - Tất cả URLs phải dùng `https://beta.sfb.vn`
   - Không mix với localhost hoặc domain khác
   - Canonical URLs phải đúng domain

2. **HTTPS:**
   - Google ưu tiên HTTPS
   - Đảm bảo SSL certificate hợp lệ

3. **Images:**
   - OG images phải là absolute URLs
   - Recommended size: 1200x630px
   - Format: JPG hoặc PNG

4. **Content:**
   - Unique content cho mỗi trang
   - Regular updates
   - Internal linking

## 🐛 Troubleshooting

### Sitemap không hiển thị đúng domain
- Kiểm tra `NEXT_PUBLIC_SITE_URL` trong `.env.production`
- Rebuild Next.js app

### Meta tags không hiển thị
- Kiểm tra SEO data trong database
- Kiểm tra API `/api/public/seo/:path` hoạt động
- Kiểm tra console logs

### Structured data không valid
- Test bằng Rich Results Test
- Kiểm tra JSON-LD syntax
- Kiểm tra required fields

### Google không index
- Submit sitemap trong Search Console
- Request indexing cho từng URL
- Kiểm tra robots.txt không block
- Kiểm tra không có noindex tag

## 📚 Tài liệu tham khảo

- [SEO_SETUP.md](./frontend/SEO_SETUP.md) - Hướng dẫn chi tiết
- [Google Search Console](https://search.google.com/search-console)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)

