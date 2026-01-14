#!/bin/bash

# Script fix các bài viết bị thiếu (ID 12-22)

echo "🔧 Fix Các Bài Viết Bị Thiếu..."
echo "================================"

# Kiểm tra đang ở đúng thư mục
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Không tìm thấy docker-compose.yml"
    exit 1
fi

echo ""
echo "1. Kiểm tra news_categories hiện có..."
docker-compose exec -T postgres psql -U postgres -d sfb_db -c "
SELECT code, name, is_active 
FROM news_categories 
ORDER BY code;
" 2>/dev/null

echo ""
echo "2. Kiểm tra các bài viết bị thiếu trong file backup..."
echo "   (Đang đọc từ dump-sfb_db-202601140944.sql)"

# Extract các dòng news từ file backup (ID 12-22)
BACKUP_FILE="dump-sfb_db-202601140944.sql"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "   ❌ Không tìm thấy file backup: $BACKUP_FILE"
    exit 1
fi

echo ""
echo "3. Đang insert các bài viết bị thiếu (ID 12-22)..."

# Tạm thời disable foreign key constraint
docker-compose exec -T postgres psql -U postgres -d sfb_db <<'EOF'
-- Tạm thời disable foreign key constraint
ALTER TABLE news DISABLE TRIGGER ALL;
SET session_replication_role = 'replica';
EOF

# Extract và insert từng bài viết
# Dựa vào file backup, các dòng 1946-1957 chứa ID 12-22
# Format: id, title, slug, excerpt, content, category, category_id, status, image_url, author, read_time, gradient, seo_title, seo_description, seo_keywords, is_featured, gallery_title, gallery_images, gallery_position, show_table_of_contents, enable_share_buttons, show_author_box, highlight_first_paragraph, published_date, created_at, updated_at

# Đọc từ file backup và insert
# Lưu ý: Cần xử lý các ký tự đặc biệt và tab-separated values

# Tạo file SQL tạm từ backup
echo ""
echo "4. Tạo file SQL tạm từ backup..."

# Extract phần COPY news và chỉ lấy các dòng ID 12-22
sed -n '1935,1958p' "$BACKUP_FILE" | grep -E "^(12|13|14|15|16|17|18|19|20|21|22)\t" > /tmp/missing_news_data.txt

if [ ! -s /tmp/missing_news_data.txt ]; then
    echo "   ⚠️  Không tìm thấy dữ liệu các bài viết ID 12-22 trong file backup"
    echo "   💡 Có thể dữ liệu đã bị lỗi format hoặc không tồn tại"
    exit 1
fi

echo "   ✅ Đã extract dữ liệu từ backup"

echo ""
echo "5. Đang insert dữ liệu..."

# Đọc từng dòng và insert
while IFS=$'\t' read -r id title slug excerpt content category category_id status image_url author read_time gradient seo_title seo_description seo_keywords is_featured gallery_title gallery_images gallery_position show_table_of_contents enable_share_buttons show_author_box highlight_first_paragraph published_date created_at updated_at; do
    # Skip dòng trống hoặc dòng không phải data
    if [ -z "$id" ] || [ "$id" = "\\." ]; then
        continue
    fi
    
    # Escape single quotes trong các trường text
    title=$(echo "$title" | sed "s/'/''/g")
    excerpt=$(echo "$excerpt" | sed "s/'/''/g")
    content=$(echo "$content" | sed "s/'/''/g")
    author=$(echo "$author" | sed "s/'/''/g")
    read_time=$(echo "$read_time" | sed "s/'/''/g")
    seo_title=$(echo "$seo_title" | sed "s/'/''/g")
    seo_description=$(echo "$seo_description" | sed "s/'/''/g")
    seo_keywords=$(echo "$seo_keywords" | sed "s/'/''/g")
    gallery_title=$(echo "$gallery_title" | sed "s/'/''/g")
    
    # Xử lý NULL values
    [ "$image_url" = "\\N" ] && image_url="NULL" || image_url="'$image_url'"
    [ "$gallery_title" = "\\N" ] && gallery_title="NULL" || gallery_title="'$gallery_title'"
    [ "$gallery_images" = "\\N" ] && gallery_images="NULL" || gallery_images="'$gallery_images'"
    [ "$gallery_position" = "\\N" ] && gallery_position="NULL" || gallery_position="'$gallery_position'"
    [ "$seo_title" = "\\N" ] && seo_title="NULL" || seo_title="'$seo_title'"
    [ "$seo_description" = "\\N" ] && seo_description="NULL" || seo_description="'$seo_description'"
    [ "$seo_keywords" = "\\N" ] && seo_keywords="NULL" || seo_keywords="'$seo_keywords'"
    
    # Convert boolean
    [ "$is_featured" = "t" ] && is_featured="TRUE" || is_featured="FALSE"
    [ "$show_table_of_contents" = "t" ] && show_table_of_contents="TRUE" || show_table_of_contents="FALSE"
    [ "$enable_share_buttons" = "t" ] && enable_share_buttons="TRUE" || enable_share_buttons="FALSE"
    [ "$show_author_box" = "t" ] && show_author_box="TRUE" || show_author_box="FALSE"
    [ "$highlight_first_paragraph" = "t" ] && highlight_first_paragraph="TRUE" || highlight_first_paragraph="FALSE"
    
    # Insert với ON CONFLICT để skip nếu đã tồn tại
    docker-compose exec -T postgres psql -U postgres -d sfb_db <<EOF
INSERT INTO news (
    id, title, slug, excerpt, content, category, category_id, status, 
    image_url, author, read_time, gradient, seo_title, seo_description, seo_keywords,
    is_featured, gallery_title, gallery_images, gallery_position,
    show_table_of_contents, enable_share_buttons, show_author_box, highlight_first_paragraph,
    published_date, created_at, updated_at
) VALUES (
    $id, '$title', '$slug', '$excerpt', '$content', '$category', '$category_id', '$status',
    $image_url, '$author', '$read_time', '$gradient', $seo_title, $seo_description, $seo_keywords,
    $is_featured, $gallery_title, $gallery_images::jsonb, $gallery_position,
    $show_table_of_contents, $enable_share_buttons, $show_author_box, $highlight_first_paragraph,
    '$published_date', '$created_at', '$updated_at'
) ON CONFLICT (id) DO NOTHING;
EOF

    if [ $? -eq 0 ]; then
        echo "   ✅ Đã insert bài viết ID: $id"
    else
        echo "   ❌ Lỗi khi insert bài viết ID: $id"
    fi
done < /tmp/missing_news_data.txt

# Enable lại foreign key constraint
docker-compose exec -T postgres psql -U postgres -d sfb_db <<'EOF'
SET session_replication_role = 'origin';
ALTER TABLE news ENABLE TRIGGER ALL;
EOF

echo ""
echo "6. Kiểm tra lại số lượng bài viết..."
NEWS_COUNT=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news;" 2>/dev/null)
echo "   Số bài viết hiện tại: $NEWS_COUNT"

echo ""
echo "7. Kiểm tra các ID còn thiếu..."
MISSING_COUNT=0
for id in {12..22}; do
    EXISTS=$(docker-compose exec -T postgres psql -U postgres -d sfb_db -tAc "SELECT COUNT(*) FROM news WHERE id = $id;" 2>/dev/null)
    if [ "$EXISTS" = "0" ]; then
        echo "   ❌ Vẫn thiếu bài viết ID: $id"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    fi
done

if [ $MISSING_COUNT -eq 0 ]; then
    echo "   ✅ Tất cả bài viết ID 12-22 đã được insert"
else
    echo "   ⚠️  Vẫn còn $MISSING_COUNT bài viết bị thiếu"
    echo "   💡 Có thể do lỗi format dữ liệu hoặc foreign key constraint"
fi

echo ""
echo "================================"
echo "✅ Hoàn thành fix missing news"
