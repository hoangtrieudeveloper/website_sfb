#!/bin/bash

# Script insert trực tiếp các bài viết bị thiếu từ file backup
# Sử dụng COPY command trực tiếp từ file backup

echo "🔧 Insert Trực Tiếp Các Bài Viết Bị Thiếu..."
echo "=============================================="

# Kiểm tra đang ở đúng thư mục
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Không tìm thấy docker-compose.yml"
    exit 1
fi

BACKUP_FILE="dump-sfb_db-202601140944.sql"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Không tìm thấy file backup: $BACKUP_FILE"
    exit 1
fi

echo ""
echo "1. Kiểm tra news_categories..."
docker-compose exec -T postgres psql -U postgres -d sfb_db -c "
SELECT code, name 
FROM news_categories 
ORDER BY code;
" 2>/dev/null

echo ""
echo "2. Tạo file COPY command từ backup..."

# Tạo file SQL với COPY command và dữ liệu
cat > /tmp/copy_missing_news.sql <<'EOFSQL'
-- Tạm thời disable foreign key constraint
SET session_replication_role = 'replica';

-- COPY command với dữ liệu
COPY public.news (id, title, slug, excerpt, content, category, category_id, status, image_url, author, read_time, gradient, seo_title, seo_description, seo_keywords, is_featured, gallery_title, gallery_images, gallery_position, show_table_of_contents, enable_share_buttons, show_author_box, highlight_first_paragraph, published_date, created_at, updated_at) FROM stdin;
EOFSQL

# Append dữ liệu từ file backup (dòng 1946-1957)
sed -n '1946,1957p' "$BACKUP_FILE" >> /tmp/copy_missing_news.sql

# Thêm dòng kết thúc
echo '\\.' >> /tmp/copy_missing_news.sql

cat >> /tmp/copy_missing_news.sql <<'EOFSQL'

-- Enable lại foreign key constraint
SET session_replication_role = 'origin';
EOFSQL

echo "   ✅ Đã tạo file: /tmp/copy_missing_news.sql"

echo ""
echo "3. Copy file vào container và chạy..."

# Copy file vào container
docker cp /tmp/copy_missing_news.sql sfb_postgres:/tmp/copy_missing_news.sql

if [ $? -eq 0 ]; then
    echo "   ✅ Đã copy file vào container"
    
    # Chạy SQL
    echo ""
    echo "4. Đang chạy COPY command..."
    docker-compose exec -T postgres psql -U postgres -d sfb_db -f /tmp/copy_missing_news.sql 2>&1 | grep -v "COPY\|\\." || echo "   ✅ Đã chạy COPY command"
else
    echo "   ❌ Không thể copy file vào container"
    echo ""
    echo "   Thử cách khác: chạy trực tiếp từ host..."
    
    # Chạy trực tiếp từ host
    docker-compose exec -T postgres psql -U postgres -d sfb_db < /tmp/copy_missing_news.sql 2>&1 | grep -v "COPY\|\\." || echo "   ✅ Đã chạy SQL"
fi

echo ""
echo "5. Kiểm tra lại số lượng bài viết..."
NEWS_COUNT=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news;" 2>/dev/null)
echo "   Số bài viết hiện tại: $NEWS_COUNT"

echo ""
echo "6. Kiểm tra các ID cụ thể..."
MISSING_IDS=""
for id in {12..22}; do
    EXISTS=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news WHERE id = $id;" 2>/dev/null)
    if [ "$EXISTS" = "0" ]; then
        MISSING_IDS="$MISSING_IDS $id"
    fi
done

if [ -z "$MISSING_IDS" ]; then
    echo "   ✅ Tất cả bài viết ID 12-22 đã có trong database!"
else
    echo "   ⚠️  Vẫn thiếu các ID:$MISSING_IDS"
    echo ""
    echo "   💡 Có thể do:"
    echo "   1. Foreign key constraint (category_id không tồn tại)"
    echo "   2. Lỗi format dữ liệu trong file backup"
    echo "   3. Duplicate key (ID đã tồn tại nhưng bị xóa)"
fi

echo ""
echo "=============================================="
echo "✅ Hoàn thành"
