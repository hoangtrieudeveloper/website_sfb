#!/bin/bash

# Script restore database từ file backup SQL

echo "📦 Restore Database từ Backup..."
echo "================================="

# Kiểm tra đang ở đúng thư mục
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Không tìm thấy docker-compose.yml"
    echo "💡 Đảm bảo đang ở thư mục root của project"
    exit 1
fi

# Kiểm tra file backup
BACKUP_FILE="${1:-dump-sfb_db-202601140944.sql}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Không tìm thấy file backup: $BACKUP_FILE"
    echo ""
    echo "💡 Cách sử dụng:"
    echo "   ./docker/restore-database.sh <path-to-backup-file.sql>"
    echo ""
    echo "   Ví dụ:"
    echo "   ./docker/restore-database.sh dump-sfb_db-202601140944.sql"
    exit 1
fi

echo ""
echo "File backup: $BACKUP_FILE"
echo ""

# Kiểm tra PostgreSQL container đang chạy
if ! docker-compose ps postgres | grep -q "Up"; then
    echo "⚠️  PostgreSQL container không chạy, đang start..."
    docker-compose up -d postgres
    echo "   Đợi PostgreSQL khởi động (10 giây)..."
    sleep 10
fi

echo ""
echo "1. Kiểm tra PostgreSQL đã sẵn sàng..."
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "   ✅ PostgreSQL đã sẵn sàng"
else
    echo "   ❌ PostgreSQL chưa sẵn sàng"
    exit 1
fi

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
    else
        echo "   ❌ Đã hủy restore"
        exit 1
    fi
fi

echo ""
echo "3. Tạo database mới (nếu chưa có)..."
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE sfb_db;" 2>/dev/null || echo "   Database đã tồn tại"

echo ""
echo "4. Restore database từ file backup..."
echo "   (Sẽ mất vài phút tùy vào kích thước file...)"

# Restore database với ON_ERROR_STOP để dừng khi gặp lỗi và hiển thị lỗi
docker-compose exec -T postgres psql -U postgres -d sfb_db -v ON_ERROR_STOP=1 < "$BACKUP_FILE" 2>&1 | tee restore.log

RESTORE_EXIT_CODE=${PIPESTATUS[0]}

if [ $RESTORE_EXIT_CODE -eq 0 ]; then
    echo "   ✅ Database đã được restore thành công"
else
    echo "   ⚠️  Có lỗi trong quá trình restore (exit code: $RESTORE_EXIT_CODE)"
    echo "   💡 Kiểm tra file restore.log để xem chi tiết lỗi"
    echo ""
    echo "   Các lỗi phổ biến:"
    grep -i "error\|violation\|duplicate\|constraint\|foreign key" restore.log | head -20 || echo "   Không tìm thấy lỗi rõ ràng trong log"
    echo ""
    echo "   💡 Có thể do:"
    echo "   1. Foreign key constraint: news.category_id reference đến news_categories.code"
    echo "   2. Thứ tự restore: news được restore trước news_categories"
    echo "   3. Dữ liệu đã tồn tại (duplicate key)"
fi

echo ""
echo "5. Kiểm tra dữ liệu đã được restore..."
TABLE_COUNT=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null)
echo "   Số bảng: $TABLE_COUNT"

echo ""
echo "6. Kiểm tra news_categories (phải có trước news)..."
NEWS_CAT_COUNT=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news_categories;" 2>/dev/null)
echo "   Số categories: $NEWS_CAT_COUNT"
docker-compose exec -T postgres psql -U postgres -d sfb_db -c "SELECT code, name FROM news_categories;" 2>/dev/null || echo "   ⚠️  Không thể đọc news_categories"

echo ""
echo "7. Kiểm tra news (sau news_categories)..."
NEWS_COUNT=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news;" 2>/dev/null)
echo "   Số bài viết: $NEWS_COUNT"

# Kiểm tra các ID cụ thể từ file backup (1-22)
echo ""
echo "8. Kiểm tra các bài viết có ID từ 1-22..."
MISSING_IDS=""
for id in {1..22}; do
    EXISTS=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news WHERE id = $id;" 2>/dev/null)
    if [ "$EXISTS" = "0" ]; then
        MISSING_IDS="$MISSING_IDS $id"
    fi
done

if [ -z "$MISSING_IDS" ]; then
    echo "   ✅ Tất cả bài viết ID 1-22 đều có trong database"
else
    echo "   ⚠️  Thiếu các bài viết với ID:$MISSING_IDS"
    echo "   💡 Có thể do foreign key constraint hoặc lỗi trong quá trình restore"
fi

echo ""
echo "9. Kiểm tra một số bảng quan trọng khác..."
docker-compose exec -T postgres psql -U postgres -d sfb_db -c "
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'homepage_blocks', COUNT(*) FROM homepage_blocks
UNION ALL
SELECT 'site_settings', COUNT(*) FROM site_settings;
" 2>/dev/null || echo "   ⚠️  Không thể kiểm tra dữ liệu"

echo ""
echo "================================="
echo "✅ Hoàn thành restore database"
echo ""
echo "💡 Kiểm tra database:"
echo "   docker-compose exec postgres psql -U postgres -d sfb_db -c \"\\dt\""
