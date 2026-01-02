# Cách kiểm tra lỗi build trước khi build Docker

## 1. Kiểm tra TypeScript errors

Chạy lệnh này trong thư mục `frontend` để kiểm tra tất cả lỗi TypeScript:

```bash
cd frontend
npm run build
```

Lệnh này sẽ hiển thị **TẤT CẢ** lỗi TypeScript một lúc, không cần build Docker nhiều lần.

## 2. Kiểm tra lỗi import với version number

Tìm tất cả các import có version number (sai cú pháp):

```bash
# Windows PowerShell
Get-ChildItem -Path frontend -Recurse -Include *.ts,*.tsx | Select-String -Pattern '@\d+\.\d+' | Select-Object Path, LineNumber, Line

# Linux/Mac
grep -r "@[0-9]\+\.[0-9]\+" frontend --include="*.ts" --include="*.tsx"
```

## 3. Kiểm tra missing dependencies

Sau khi sửa import, chạy:

```bash
cd frontend
npm install
npm run build
```

## 4. Kiểm tra lỗi Next.js Pages Router

Tìm tất cả file `.tsx` trong `pages` không có default export:

```bash
# Windows PowerShell
Get-ChildItem -Path frontend\pages -Recurse -Filter *.tsx -Exclude index.tsx,data.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -notmatch 'export default') {
        Write-Host $_.FullName
    }
}
```

## 5. Workflow đề xuất

1. **Sửa tất cả import có version number** → Chạy `npm run build` để kiểm tra
2. **Thêm missing dependencies** vào `package.json` → Chạy `npm install`
3. **Thêm default export cho tất cả component files** trong `pages` → Chạy `npm run build` lại
4. **Chỉ khi build thành công** → Mới build Docker image

## Lưu ý

- Luôn chạy `npm run build` ở local trước khi build Docker
- Docker build sẽ mất nhiều thời gian hơn, nên fix hết lỗi ở local trước
- Nếu có nhiều lỗi, sửa từng loại một (import errors → missing deps → default exports)

