-- Migration: Tạo bảng testimonials và permissions
-- Chạy file này để tạo bảng testimonials trong database

-- Bảng testimonials (Khách hàng nói về SFB)
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,                           -- Nội dung đánh giá
  author VARCHAR(255) NOT NULL,                  -- Tên khách hàng (ví dụ: "Ông Nguyễn Khánh Tùng")
  company VARCHAR(255),                          -- Công ty/Đơn vị (optional)
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),  -- Đánh giá sao (1-5)
  sort_order INTEGER DEFAULT 0,                 -- Thứ tự sắp xếp
  is_active BOOLEAN DEFAULT TRUE,               -- Bật/tắt hiển thị
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON testimonials(sort_order);

-- Trigger cập nhật updated_at cho testimonials
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed dữ liệu mẫu cho testimonials
INSERT INTO testimonials (quote, author, company, rating, sort_order, is_active)
VALUES
  (
    'Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.',
    'Ông Nguyễn Khánh Tùng',
    NULL,
    5,
    1,
    TRUE
  ),
  (
    'SFB không chỉ cung cấp giải pháp phần mềm mà còn là người bạn đồng hành tin cậy. Sự hỗ trợ nhiệt tình và chuyên môn cao của đội ngũ kỹ thuật giúp chúng tôi yên tâm vận hành hệ thống 24/7.',
    'Ông Nguyễn Khanh',
    NULL,
    5,
    2,
    TRUE
  ),
  (
    'Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.',
    'Ông Nguyễn Hoàng Chinh',
    NULL,
    5,
    3,
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Thêm permission cho testimonials
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('testimonials.manage', 'Quản lý đánh giá khách hàng', 'testimonials', 'Quản lý các đánh giá/testimonials của khách hàng về SFB', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền testimonials cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code = 'testimonials.manage'
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

