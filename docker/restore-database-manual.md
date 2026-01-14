# Hướng dẫn Restore Database từ Backup SQL

## Cách 1: Sử dụng script tự động (Khuyến nghị)

```bash
cd /var/www/sfb-website

# Copy file backup vào thư mục project (nếu chưa có)
# cp /path/to/dump-sfb_db-202601140944.sql .

# Chạy script restore
chmod +x docker/restore-database.sh
./docker/restore-database.sh dump-sfb_db-202601140944.sql
```

---

## Cách 2: Restore thủ công với Docker

```bash
cd /var/www/sfb-website

# 1. Đảm bảo PostgreSQL container đang chạy
docker-compose up -d postgres
sleep 10

# 2. Kiểm tra PostgreSQL đã sẵn sàng
docker-compose exec postgres pg_isready -U postgres

# 3. Xóa database cũ (nếu cần)
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS sfb_db;"

# 4. Tạo database mới
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE sfb_db;"

# 5. Restore từ file backup
docker-compose exec -T postgres psql -U postgres -d sfb_db < dump-sfb_db-202601140944.sql

# 6. Kiểm tra dữ liệu
docker-compose exec postgres psql -U postgres -d sfb_db -c "\dt"
```

---

## Cách 3: Restore trực tiếp vào PostgreSQL (không dùng Docker)

Nếu PostgreSQL chạy trực tiếp trên server (không dùng Docker):

```bash
# 1. Copy file backup vào server
# scp dump-sfb_db-202601140944.sql user@server:/path/to/

# 2. Restore database
psql -U postgres -d sfb_db < dump-sfb_db-202601140944.sql

# Hoặc nếu cần tạo database mới trước:
createdb -U postgres sfb_db
psql -U postgres -d sfb_db < dump-sfb_db-202601140944.sql
```

---

## Cách 4: Restore với pg_restore (nếu file là custom format)

Nếu file backup là format `.dump` hoặc `.tar`:

```bash
# Với Docker
docker-compose exec -T postgres pg_restore -U postgres -d sfb_db < dump-sfb_db.dump

# Hoặc trực tiếp
pg_restore -U postgres -d sfb_db dump-sfb_db.dump
```

---

## Kiểm tra sau khi restore

```bash
# 1. Kiểm tra số lượng bảng
docker-compose exec postgres psql -U postgres -d sfb_db -c "\dt"

# 2. Kiểm tra số lượng records trong một số bảng
docker-compose exec postgres psql -U postgres -d sfb_db -c "
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'news', COUNT(*) FROM news
UNION ALL
SELECT 'products', COUNT(*) FROM products;
"

# 3. Kiểm tra dữ liệu mẫu
docker-compose exec postgres psql -U postgres -d sfb_db -c "SELECT * FROM users LIMIT 5;"
```

---

## Lưu ý quan trọng

1. **Backup trước khi restore**: Nếu database đã có dữ liệu, nên backup trước:
   ```bash
   docker-compose exec postgres pg_dump -U postgres sfb_db > backup-before-restore.sql
   ```

2. **File backup phải ở đúng định dạng**: File SQL dump phải là plain text SQL, không phải binary format

3. **Quyền truy cập**: Đảm bảo user `postgres` có quyền tạo và restore database

4. **Kích thước file**: Nếu file backup lớn, quá trình restore có thể mất vài phút

5. **Lỗi encoding**: Nếu gặp lỗi encoding, thử:
   ```bash
   export PGCLIENTENCODING=UTF8
   docker-compose exec -T postgres psql -U postgres -d sfb_db < dump-sfb_db-202601140944.sql
   ```

---

## Troubleshooting

### Lỗi: "database already exists"
```bash
# Xóa database cũ trước
docker-compose exec postgres psql -U postgres -c "DROP DATABASE sfb_db;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE sfb_db;"
```

### Lỗi: "permission denied"
```bash
# Đảm bảo chạy với quyền phù hợp
sudo docker-compose exec postgres psql -U postgres -d sfb_db < dump-sfb_db-202601140944.sql
```

### Lỗi: "connection refused"
```bash
# Kiểm tra PostgreSQL container đang chạy
docker-compose ps postgres
docker-compose up -d postgres
```
