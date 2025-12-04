# SFB Monorepo

Monorepo quản lý cả hai ứng dụng:

- `backend/`: API Express phục vụ CMS/Website (Node.js + PostgreSQL)
- `frontend/`: Website Next.js cho cả phần public và trang quản trị

## Yêu cầu

- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL ≥ 12 (dùng cho backend)

## Cài đặt

```bash
# Tại thư mục gốc ws-sfb
npm install
```

Lệnh trên sẽ cài dependencies cho cả hai workspace nhờ npm workspaces.

## Scripts chính

```bash
npm run dev            # Chạy đồng thời backend + frontend
npm run dev:backend    # Chỉ backend
npm run dev:frontend   # Chỉ frontend
npm run build          # Build cả hai
npm run setup-db       # Tạo database PostgreSQL cho backend
npm run start:backend  # Start backend production
npm run start:frontend # Start frontend production
```

## Cấu hình môi trường

- Backend: `backend/.env`
  ```env
  PORT=4000
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASSWORD=your_password
  DB_NAME=sfb_db
  ```

- Frontend: `frontend/.env.local`
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```

## Cấu trúc thư mục

```
ws-sfb/
├── backend/      # API Express
├── frontend/     # Website Next.js
├── package.json  # Workspaces + scripts chung
├── README.md
└── .gitignore
```

## Quy trình gợi ý

1. `npm install`
2. `npm run setup-db` (postgres phải đang chạy)
3. `npm run dev` (frontend chạy tại http://localhost:3000, backend tại http://localhost:4000)

