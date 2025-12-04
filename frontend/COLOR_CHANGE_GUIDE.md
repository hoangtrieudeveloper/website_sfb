# Hướng dẫn thay đổi màu chủ đạo hệ thống

## Màu mới: rgb(0, 111, 179) = #006FB3

### Bảng màu áp dụng:
- **Main Color**: `#006FB3` - rgb(0, 111, 179)
- **Light Color**: `#0088D9` - rgb(0, 136, 217)  
- **Dark Color**: `#005589` - rgb(0, 85, 137)
- **Background**: `#E6F4FF` - rgb(230, 244, 255)
- **Light Background**: `#D6EEFF` - rgb(214, 238, 255)

### Quy tắc thay thế trong tất cả các file:

#### 1. Gradient classes:
```
from-blue-600 to-cyan-600  →  from-[#006FB3] to-[#0088D9]
from-blue-500 to-cyan-500  →  from-[#006FB3] to-[#0088D9]
from-cyan-600 to-blue-600  →  from-[#0088D9] to-[#006FB3]
via-blue-600               →  via-[#006FB3]
via-cyan-600               →  via-[#0088D9]
```

#### 2. Text colors:
```
text-blue-600  →  text-[#006FB3]
text-blue-500  →  text-[#006FB3]
text-blue-700  →  text-[#005589]
text-cyan-600  →  text-[#0088D9]
text-cyan-400  →  text-[#0088D9]
text-blue-100  →  text-blue-100 (giữ nguyên cho text nhạt trên dark background)
```

#### 3. Background colors:
```
bg-blue-600    →  bg-[#006FB3]
bg-blue-500    →  bg-[#006FB3]
bg-blue-50     →  bg-[#E6F4FF]
bg-cyan-600    →  bg-[#0088D9]
bg-cyan-50     →  bg-[#E6F4FF]
via-blue-50    →  via-[#E6F4FF]
to-cyan-50     →  to-[#D6EEFF]
```

#### 4. Border colors:
```
border-blue-600  →  border-[#006FB3]
border-blue-500  →  border-[#006FB3]
border-blue-200  →  border-[#006FB3]/30
border-cyan-600  →  border-[#0088D9]
```

#### 5. Shadow colors:
```
shadow-blue-500/50   →  shadow-[#006FB3]/50
shadow-cyan-500/50   →  shadow-[#0088D9]/50
hover:shadow-blue-   →  hover:shadow-[#006FB3]/
hover:shadow-cyan-   →  hover:shadow-[#0088D9]/
```

#### 6. Hover states:
```
hover:text-blue-600  →  hover:text-[#006FB3]
hover:bg-blue-50     →  hover:bg-[#E6F4FF]
hover:border-blue-   →  hover:border-[#006FB3]
```

### Các file cần cập nhật:

✅ **Đã cập nhật:**
- [x] /components/Header.tsx
- [x] /components/HeroBanner.tsx  
- [x] /components/Features.tsx (user tự edit)
- [x] /pages/AboutPage.tsx (user tự edit)
- [x] /pages/CareersPage.tsx (user tự edit)

⏳ **Cần cập nhật:**
- [ ] /components/Solutions.tsx
- [ ] /components/Industries.tsx
- [ ] /components/AboutCompany.tsx
- [ ] /components/Testimonials.tsx
- [ ] /components/Footer.tsx
- [ ] /pages/SolutionsPage.tsx
- [ ] /pages/IndustriesPage.tsx
- [ ] /pages/ContactPage.tsx
- [ ] /pages/NewsPage.tsx

### Lưu ý đặc biệt:

1. **Giữ nguyên** các màu khác không phải blue/cyan:
   - Purple, Pink → giữ nguyên
   - Orange, Red → giữ nguyên
   - Green, Emerald → giữ nguyên
   - Gray → giữ nguyên

2. **Background patterns** với blue:
   - `bg-blue-200` trong blob animations → `bg-[#006FB3]/20`
   - `bg-cyan-200` trong blob animations → `bg-[#0088D9]/20`

3. **Gradient backgrounds**:
   - `from-slate-50 via-blue-50 to-cyan-50` → `from-slate-50 via-[#E6F4FF] to-[#D6EEFF]`
   - `from-gray-900 via-blue-900 to-gray-900` → giữ nguyên (dark backgrounds)

4. **Text on dark backgrounds**:
   - `text-blue-100` → có thể giữ nguyên
   - `text-cyan-400` → thay thành `text-[#0088D9]`

### Ví dụ thực tế:

#### Trước:
```tsx
className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-blue-500/50"
```

#### Sau:
```tsx
className="bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white hover:shadow-[#006FB3]/50"
```

---

**Cập nhật:** Tất cả các màu blue/cyan trong hệ thống cần được thay thế bằng màu brand chính #006FB3
