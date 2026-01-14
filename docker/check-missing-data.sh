#!/bin/bash

# Script kiểm tra dữ liệu bị thiếu sau khi restore

echo "🔍 Kiểm tra Dữ liệu Bị Thiếu..."
echo "================================"

# Kiểm tra đang ở đúng thư mục
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Không tìm thấy docker-compose.yml"
    exit 1
fi

echo ""
echo "1. Kiểm tra số lượng records trong các bảng chính..."

# Kiểm tra news
NEWS_COUNT=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news;" 2>/dev/null)
echo "   📰 Bảng news: $NEWS_COUNT records"

# Kiểm tra các ID cụ thể từ file backup (1-22)
echo ""
echo "2. Kiểm tra các bài viết có ID từ 1-22..."
MISSING_COUNT=0
for id in {1..22}; do
    EXISTS=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news WHERE id = $id;" 2>/dev/null)
    if [ "$EXISTS" = "0" ]; then
        echo "   ❌ Thiếu bài viết ID: $id"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    fi
done

if [ $MISSING_COUNT -eq 0 ]; then
    echo "   ✅ Tất cả bài viết ID 1-22 đều có trong database"
else
    echo "   ⚠️  Thiếu $MISSING_COUNT bài viết"
fi

echo ""
echo "3. Liệt kê tất cả bài viết hiện có..."
docker-compose exec -T postgres psql -U postgres -d sfb_db -c "
SELECT id, title, slug, status, published_date 
FROM news 
ORDER BY id;
" 2>/dev/null

echo ""
echo "4. Kiểm tra constraints có thể block insert..."
docker-compose exec -T postgres psql -U postgres -d sfb_db -c "
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.news'::regclass
ORDER BY contype, conname;
" 2>/dev/null

echo ""
echo "5. Kiểm tra foreign keys liên quan đến bảng news..."
docker-compose exec -T postgres psql -U postgres -d sfb_db -c "
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND (tc.table_name = 'news' OR ccu.table_name = 'news');
" 2>/dev/null

echo ""
echo "6. Thử insert một record test để xem có lỗi gì..."
docker-compose exec -T postgres psql -U postgres -d sfb_db <<EOF 2>&1
INSERT INTO news (
    id, title, slug, excerpt, content, category, category_id, 
    status, author, read_time, published_date, created_at, updated_at
) VALUES (
    999, 'Test Article', 'test-article', 'Test excerpt', '<p>Test content</p>',
    'test', 'test', 'draft', 'Test Author', '1 phút đọc',
    NOW(), NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;
SELECT 'Insert test thành công' as result;
EOF

echo ""
echo "================================"
echo "✅ Hoàn thành kiểm tra"
