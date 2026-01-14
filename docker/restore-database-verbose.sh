#!/bin/bash

# Script restore database với verbose output để debug

echo "📦 Restore Database với Verbose Output..."
echo "=========================================="

# Kiểm tra đang ở đúng thư mục
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Không tìm thấy docker-compose.yml"
    exit 1
fi

# Kiểm tra file backup
BACKUP_FILE="${1:-dump-sfb_db-202601140944.sql}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Không tìm thấy file backup: $BACKUP_FILE"
    exit 1
fi

echo ""
echo "File backup: $BACKUP_FILE"
echo ""

# Kiểm tra PostgreSQL container đang chạy
if ! docker-compose ps postgres | grep -q "Up"; then
    echo "⚠️  PostgreSQL container không chạy, đang start..."
    docker-compose up -d postgres
    sleep 10
fi

echo ""
echo "1. Kiểm tra PostgreSQL đã sẵn sàng..."
docker-compose exec -T postgres pg_isready -U postgres

echo ""
echo "2. Kiểm tra database hiện tại..."
DB_EXISTS=$(docker-compose exec -T postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='sfb_db'" 2>/dev/null)

if [ "$DB_EXISTS" = "1" ]; then
    echo "   ⚠️  Database 'sfb_db' đã tồn tại"
    read -p "   Bạn có muốn xóa database cũ và tạo mới? (yes/no): " -r
    echo
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "   Đang xóa database cũ..."
        docker-compose exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS sfb_db;" 2>/dev/null
        echo "   ✅ Đã xóa database cũ"
    fi
fi

echo ""
echo "3. Tạo database mới (nếu chưa có)..."
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE sfb_db;" 2>/dev/null || echo "   Database đã tồn tại"

echo ""
echo "4. Restore database từ file backup với verbose output..."
echo "   (Sẽ hiển thị tất cả lỗi nếu có...)"

# Restore với ON_ERROR_STOP để dừng ngay khi gặp lỗi
docker-compose exec -T postgres psql -U postgres -d sfb_db -v ON_ERROR_STOP=1 < "$BACKUP_FILE" 2>&1 | tee restore.log

RESTORE_EXIT_CODE=${PIPESTATUS[0]}

if [ $RESTORE_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "   ✅ Database đã được restore thành công"
else
    echo ""
    echo "   ⚠️  Có lỗi trong quá trình restore (exit code: $RESTORE_EXIT_CODE)"
    echo "   💡 Kiểm tra file restore.log để xem chi tiết lỗi"
fi

echo ""
echo "5. Kiểm tra số lượng records trong bảng news..."
NEWS_COUNT=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news;" 2>/dev/null)
echo "   Số bài viết trong bảng news: $NEWS_COUNT"

echo ""
echo "6. Kiểm tra các bài viết có ID từ 1-22 (theo file backup)..."
docker-compose exec -T postgres psql -U postgres -d sfb_db -c "
SELECT id, title, slug, status, published_date 
FROM news 
WHERE id BETWEEN 1 AND 22 
ORDER BY id;
" 2>/dev/null

echo ""
echo "7. Kiểm tra các bài viết bị thiếu..."
EXPECTED_IDS="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22"
EXISTING_IDS=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "
SELECT string_agg(id::text, ',') 
FROM (SELECT id FROM news WHERE id BETWEEN 1 AND 22 ORDER BY id) t;
" 2>/dev/null)

echo "   IDs mong đợi: $EXPECTED_IDS"
echo "   IDs hiện có: $EXISTING_IDS"

echo ""
echo "8. Kiểm tra lỗi trong file restore.log (nếu có)..."
if [ -f "restore.log" ]; then
    echo "   Các lỗi phổ biến:"
    grep -i "error\|violation\|duplicate\|constraint" restore.log | head -20 || echo "   Không tìm thấy lỗi trong log"
fi

echo ""
echo "=========================================="
echo "✅ Hoàn thành restore và kiểm tra"
echo ""
echo "💡 Nếu thiếu dữ liệu, kiểm tra:"
echo "   - File restore.log để xem lỗi chi tiết"
echo "   - Constraints trong database có thể block insert"
echo "   - Encoding của file backup"
