#!/bin/bash

# Script fix các bài viết bị thiếu (ID 12-22) - Phiên bản đơn giản

echo "🔧 Fix Các Bài Viết Bị Thiếu (ID 12-22)..."
echo "============================================"

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
SELECT code, name, is_active 
FROM news_categories 
ORDER BY code;
" 2>/dev/null

echo ""
echo "2. Tạo file SQL tạm chứa dữ liệu các bài viết bị thiếu..."

# Extract phần COPY news và chỉ lấy các dòng ID 12-22
# Tạo file SQL với COPY command
cat > /tmp/insert_missing_news.sql <<'EOFSQL'
-- Tạm thời disable foreign key constraint
SET session_replication_role = 'replica';

-- Insert các bài viết bị thiếu
EOFSQL

# Extract các dòng từ file backup (dòng 1946-1957 là ID 12-22)
sed -n '1946,1957p' "$BACKUP_FILE" >> /tmp/insert_missing_news.sql

# Thêm dòng kết thúc COPY
echo '\\.' >> /tmp/insert_missing_news.sql

cat >> /tmp/insert_missing_news.sql <<'EOFSQL'

-- Enable lại foreign key constraint
SET session_replication_role = 'origin';
EOFSQL

echo "   ✅ Đã tạo file SQL tạm: /tmp/insert_missing_news.sql"

echo ""
echo "3. Đang insert dữ liệu với COPY command..."

# Copy file vào container và chạy
docker cp /tmp/insert_missing_news.sql sfb_postgres:/tmp/insert_missing_news.sql 2>/dev/null || {
    echo "   ⚠️  Không thể copy file vào container, thử cách khác..."
    
    # Cách 2: Extract và insert trực tiếp
    echo ""
    echo "   Đang extract dữ liệu và insert trực tiếp..."
    
    # Tạm thời disable constraint
    docker-compose exec -T postgres psql -U postgres -d sfb_db <<'EOF'
SET session_replication_role = 'replica';
EOF

    # Extract và insert từng dòng
    sed -n '1946,1957p' "$BACKUP_FILE" | while IFS=$'\t' read -r line; do
        # Skip dòng trống
        [ -z "$line" ] && continue
        
        # Parse dòng (format tab-separated)
        # Sử dụng Python hoặc awk để parse chính xác hơn
        echo "$line" | docker-compose exec -T postgres psql -U postgres -d sfb_db -c "
        COPY news (id, title, slug, excerpt, content, category, category_id, status, image_url, author, read_time, gradient, seo_title, seo_description, seo_keywords, is_featured, gallery_title, gallery_images, gallery_position, show_table_of_contents, enable_share_buttons, show_author_box, highlight_first_paragraph, published_date, created_at, updated_at) 
        FROM STDIN WITH (FORMAT text, DELIMITER E'\\t');
        " 2>&1 || echo "   ⚠️  Lỗi khi insert dòng"
    done
    
    # Enable lại constraint
    docker-compose exec -T postgres psql -U postgres -d sfb_db <<'EOF'
SET session_replication_role = 'origin';
EOF
}

# Nếu copy thành công, chạy SQL
if docker exec sfb_postgres test -f /tmp/insert_missing_news.sql 2>/dev/null; then
    docker-compose exec -T postgres psql -U postgres -d sfb_db < /tmp/insert_missing_news.sql 2>&1 | grep -v "COPY\|\\." || echo "   ✅ Đã chạy SQL"
fi

echo ""
echo "4. Kiểm tra lại số lượng bài viết..."
NEWS_COUNT=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news;" 2>/dev/null)
echo "   Số bài viết hiện tại: $NEWS_COUNT"

echo ""
echo "5. Kiểm tra các ID còn thiếu..."
MISSING_COUNT=0
for id in {12..22}; do
    EXISTS=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news WHERE id = $id;" 2>/dev/null)
    if [ "$EXISTS" = "0" ]; then
        echo "   ❌ Vẫn thiếu bài viết ID: $id"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    else
        echo "   ✅ Đã có bài viết ID: $id"
    fi
done

if [ $MISSING_COUNT -eq 0 ]; then
    echo ""
    echo "   ✅ Tất cả bài viết ID 12-22 đã được insert thành công!"
else
    echo ""
    echo "   ⚠️  Vẫn còn $MISSING_COUNT bài viết bị thiếu"
    echo "   💡 Có thể do lỗi format dữ liệu hoặc foreign key constraint"
    echo ""
    echo "   Thử cách thủ công:"
    echo "   1. Kiểm tra file restore.log để xem lỗi chi tiết"
    echo "   2. Thử restore lại với script restore-database-verbose.sh"
fi

echo ""
echo "============================================"
echo "✅ Hoàn thành fix missing news"
