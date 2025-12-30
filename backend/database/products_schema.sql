-- Database Schema cho Products Management System
-- Chạy file này để khởi tạo các bảng database cho Products

-- Bảng product_categories (Danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,        -- "edu", "justice", "gov", "kpi"
  name VARCHAR(255) NOT NULL,                -- "Giải pháp Giáo dục"
  icon_name VARCHAR(100),                    -- Tên icon từ lucide-react
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_active ON product_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_product_categories_sort ON product_categories(sort_order);

-- Trigger cập nhật updated_at cho product_categories
DROP TRIGGER IF EXISTS update_product_categories_updated_at ON product_categories;
CREATE TRIGGER update_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng products (Sản phẩm chính)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(500),
  meta VARCHAR(255),                         -- "Sản phẩm • Tin công nghệ • 07/08/2025"
  description TEXT,
  image TEXT,                                 -- URL hoặc media_id
  gradient VARCHAR(255),                      -- Tailwind gradient class
  pricing VARCHAR(255),                       -- "Liên hệ", "Theo gói triển khai"
  badge VARCHAR(255),                         -- "Giải pháp nổi bật" hoặc NULL
  stats_users VARCHAR(255),                    -- "Nhiều trường học áp dụng"
  stats_rating DECIMAL(3,1),                  -- 4.8
  stats_deploy VARCHAR(255),                   -- "Triển khai Cloud/On-premise"
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);

-- Trigger cập nhật updated_at cho products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng product_features (Tính năng của sản phẩm)
CREATE TABLE IF NOT EXISTS product_features (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  feature_text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_features_product_id ON product_features(product_id);
CREATE INDEX IF NOT EXISTS idx_product_features_sort ON product_features(sort_order);

-- Bảng product_benefits (Lợi ích hiển thị trên trang products)
CREATE TABLE IF NOT EXISTS product_benefits (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(500),                         -- Path to icon SVG
  title VARCHAR(255) NOT NULL,
  description TEXT,
  gradient VARCHAR(255),                      -- Tailwind gradient class
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_benefits_active ON product_benefits(is_active);
CREATE INDEX IF NOT EXISTS idx_product_benefits_sort ON product_benefits(sort_order);

-- Trigger cập nhật updated_at cho product_benefits
DROP TRIGGER IF EXISTS update_product_benefits_updated_at ON product_benefits;
CREATE TRIGGER update_product_benefits_updated_at
    BEFORE UPDATE ON product_benefits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng product_page_hero (Hero section của trang products)
CREATE TABLE IF NOT EXISTS product_page_hero (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,                -- "Bộ giải pháp phần mềm"
  subtitle VARCHAR(255),                      -- "Phục vụ Giáo dục, Công chứng & Doanh nghiệp"
  description TEXT,
  primary_cta_text VARCHAR(255),               -- "Xem danh sách sản phẩm"
  primary_cta_link VARCHAR(255),               -- "#products"
  secondary_cta_text VARCHAR(255),            -- "Tư vấn giải pháp"
  secondary_cta_link VARCHAR(255),            -- "/contact"
  stat_1_label VARCHAR(255),                  -- "Giải pháp phần mềm"
  stat_1_value VARCHAR(255),                  -- "+32.000"
  stat_2_label VARCHAR(255),                  -- "Đơn vị triển khai thực tế"
  stat_2_value VARCHAR(255),                   -- "+6.000"
  stat_3_label VARCHAR(255),                   -- "Mức độ hài lòng trung bình"
  stat_3_value VARCHAR(255),                  -- "4.9★"
  background_gradient VARCHAR(255),            -- CSS gradient
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger cập nhật updated_at cho product_page_hero
DROP TRIGGER IF EXISTS update_product_page_hero_updated_at ON product_page_hero;
CREATE TRIGGER update_product_page_hero_updated_at
    BEFORE UPDATE ON product_page_hero
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng product_contact_banner (Banner CTA liên hệ - hiển thị trên trang products)
CREATE TABLE IF NOT EXISTS product_contact_banner (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,                -- "Miễn phí tư vấn"
  description TEXT,                            -- "Đặt lịch tư vấn miễn phí với chuyên gia của SFB..."
  primary_cta_text VARCHAR(255),               -- "Xem case studies"
  primary_cta_link VARCHAR(255),               -- "/case-studies" hoặc "#"
  secondary_cta_text VARCHAR(255),            -- "Tư vấn miễn phí ngay"
  secondary_cta_link VARCHAR(255),             -- "/contact" hoặc "#"
  background_gradient VARCHAR(255),            -- CSS gradient (màu xanh)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_contact_banner_active ON product_contact_banner(is_active);

-- Trigger cập nhật updated_at cho product_contact_banner
DROP TRIGGER IF EXISTS update_product_contact_banner_updated_at ON product_contact_banner;
CREATE TRIGGER update_product_contact_banner_updated_at
    BEFORE UPDATE ON product_contact_banner
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng product_details (Trang chi tiết sản phẩm - 1-1 với products)
CREATE TABLE IF NOT EXISTS product_details (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  
  -- HERO SECTION
  meta_top VARCHAR(255),                      -- "TÀI LIỆU GIỚI THIỆU PHẦN MỀM"
  hero_description TEXT,
  hero_image TEXT,
  cta_contact_text VARCHAR(255),             -- "LIÊN HỆ NGAY"
  cta_contact_href VARCHAR(255),              -- "/contact" hoặc "#"
  cta_demo_text VARCHAR(255),                 -- "DEMO HỆ THỐNG"
  cta_demo_href VARCHAR(255),                 -- "/demo" hoặc "#demo"
  
  -- OVERVIEW SECTION
  overview_kicker VARCHAR(255),               -- "SFB - HỒ SƠ HỌC SINH"
  overview_title VARCHAR(255),                 -- "Tổng quan hệ thống"
  
  -- SHOWCASE SECTION
  showcase_title VARCHAR(255),
  showcase_desc TEXT,
  showcase_cta_text VARCHAR(255),
  showcase_cta_href VARCHAR(255),
  showcase_image_back TEXT,
  showcase_image_front TEXT,
  
  -- EXPAND SECTION
  expand_title VARCHAR(255),
  expand_cta_text VARCHAR(255),
  expand_cta_href VARCHAR(255),
  expand_image TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_details_product_id ON product_details(product_id);
CREATE INDEX IF NOT EXISTS idx_product_details_slug ON product_details(slug);

-- Trigger cập nhật updated_at cho product_details
DROP TRIGGER IF EXISTS update_product_details_updated_at ON product_details;
CREATE TRIGGER update_product_details_updated_at
    BEFORE UPDATE ON product_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng product_overview_cards (Cards trong Overview section)
CREATE TABLE IF NOT EXISTS product_overview_cards (
  id SERIAL PRIMARY KEY,
  product_detail_id INTEGER NOT NULL REFERENCES product_details(id) ON DELETE CASCADE,
  step INTEGER NOT NULL,                       -- 1, 2, 3, 4, 5
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_overview_cards_detail_id ON product_overview_cards(product_detail_id);
CREATE INDEX IF NOT EXISTS idx_product_overview_cards_sort ON product_overview_cards(sort_order);

-- Bảng product_showcase_bullets (Bullets trong Showcase section)
CREATE TABLE IF NOT EXISTS product_showcase_bullets (
  id SERIAL PRIMARY KEY,
  product_detail_id INTEGER NOT NULL REFERENCES product_details(id) ON DELETE CASCADE,
  bullet_text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_showcase_bullets_detail_id ON product_showcase_bullets(product_detail_id);
CREATE INDEX IF NOT EXISTS idx_product_showcase_bullets_sort ON product_showcase_bullets(sort_order);

-- Bảng product_numbered_sections (Các section có số thứ tự)
CREATE TABLE IF NOT EXISTS product_numbered_sections (
  id SERIAL PRIMARY KEY,
  product_detail_id INTEGER NOT NULL REFERENCES product_details(id) ON DELETE CASCADE,
  section_no INTEGER NOT NULL,                 -- 1, 2, 3, 4, 5
  title VARCHAR(255) NOT NULL,
  image TEXT,                                    -- Kept for backward compatibility, can be removed later
  image_alt VARCHAR(255),                        -- Used in frontend for img alt attribute
  image_side VARCHAR(10) CHECK (image_side IN ('left', 'right')), -- Used in frontend for layout control
  overlay_back_image TEXT,                       -- Main image (replaces image)
  overlay_front_image TEXT,                      -- Overlay image on top
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_numbered_sections_detail_id ON product_numbered_sections(product_detail_id);
CREATE INDEX IF NOT EXISTS idx_product_numbered_sections_sort ON product_numbered_sections(sort_order);

-- Bảng product_section_paragraphs (Paragraphs trong numbered sections)
CREATE TABLE IF NOT EXISTS product_section_paragraphs (
  id SERIAL PRIMARY KEY,
  numbered_section_id INTEGER NOT NULL REFERENCES product_numbered_sections(id) ON DELETE CASCADE,
  paragraph_text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_section_paragraphs_section_id ON product_section_paragraphs(numbered_section_id);
CREATE INDEX IF NOT EXISTS idx_product_section_paragraphs_sort ON product_section_paragraphs(sort_order);

-- Bảng product_expand_bullets (Bullets trong Expand section)
CREATE TABLE IF NOT EXISTS product_expand_bullets (
  id SERIAL PRIMARY KEY,
  product_detail_id INTEGER NOT NULL REFERENCES product_details(id) ON DELETE CASCADE,
  bullet_text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_expand_bullets_detail_id ON product_expand_bullets(product_detail_id);
CREATE INDEX IF NOT EXISTS idx_product_expand_bullets_sort ON product_expand_bullets(sort_order);

-- Seed data cho product_categories
INSERT INTO product_categories (slug, name, icon_name, sort_order, is_active)
VALUES
  ('all', 'Tất cả sản phẩm', 'Package', 0, TRUE),
  ('edu', 'Giải pháp Giáo dục', 'Cloud', 1, TRUE),
  ('justice', 'Công chứng – Pháp lý', 'Shield', 2, TRUE),
  ('gov', 'Quản lý Nhà nước/Doanh nghiệp', 'TrendingUp', 3, TRUE),
  ('kpi', 'Quản lý KPI cá nhân', 'Cpu', 4, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Seed data cho product_benefits
INSERT INTO product_benefits (icon, title, description, gradient, sort_order, is_active)
VALUES
  ('/icons/custom/product1.svg', 'Bảo mật cao', 'Tuân thủ chuẩn bảo mật, mã hóa dữ liệu end-to-end.', 'from-[#006FB3] to-[#0088D9]', 1, TRUE),
  ('/icons/custom/product2.svg', 'Hiệu năng ổn định', 'Hệ thống tối ưu, uptime cao, đáp ứng nhu cầu vận hành.', 'from-[#FF81C2] to-[#667EEA]', 2, TRUE),
  ('/icons/custom/product3.svg', 'Dễ triển khai & sử dụng', 'Giao diện trực quan, đào tạo & hỗ trợ cho người dùng.', 'from-[#2AF598] to-[#009EFD]', 3, TRUE),
  ('/icons/custom/product4.svg', 'Sẵn sàng mở rộng', 'Kiến trúc linh hoạt, dễ tích hợp và mở rộng về sau.', 'from-[#FA709A] to-[#FEE140]', 4, TRUE)
ON CONFLICT DO NOTHING;

-- Seed data cho product_page_hero
INSERT INTO product_page_hero (
  title, subtitle, description,
  primary_cta_text, primary_cta_link,
  secondary_cta_text, secondary_cta_link,
  stat_1_label, stat_1_value,
  stat_2_label, stat_2_value,
  stat_3_label, stat_3_value,
  background_gradient, is_active
)
VALUES (
  'Bộ giải pháp phần mềm',
  'Phục vụ Giáo dục, Công chứng & Doanh nghiệp',
  'Các sản phẩm SFB được xây dựng từ bài toán thực tế của cơ quan Nhà nước, nhà trường và doanh nghiệp, giúp tối ưu quy trình và nâng cao hiệu quả quản lý.',
  'Xem danh sách sản phẩm',
  '#products',
  'Tư vấn giải pháp',
  '/contact',
  'Giải pháp phần mềm',
  '+32.000',
  'Đơn vị triển khai thực tế',
  '+6.000',
  'Mức độ hài lòng trung bình',
  '4.9★',
  'linear-gradient(to bottom right, #0870B4, #2EABE2)',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Thêm permissions cho products module
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('products.view', 'Xem danh sách sản phẩm', 'products', 'Xem danh sách sản phẩm và giải pháp', TRUE),
  ('products.manage', 'Quản lý sản phẩm', 'products', 'Thêm, sửa, xóa sản phẩm và giải pháp', TRUE),
  ('product_categories.view', 'Xem danh mục sản phẩm', 'products', 'Xem danh sách danh mục sản phẩm', TRUE),
  ('product_categories.manage', 'Quản lý danh mục sản phẩm', 'products', 'Thêm, sửa, xóa danh mục sản phẩm', TRUE),
  ('product_benefits.manage', 'Quản lý lợi ích sản phẩm', 'products', 'Quản lý các lợi ích hiển thị trên trang products', TRUE),
  ('product_hero.manage', 'Quản lý Hero Products', 'products', 'Quản lý hero section của trang products', TRUE),
  ('product_contact.manage', 'Quản lý Banner Liên hệ', 'products', 'Quản lý banner CTA liên hệ trên trang products', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền products cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'products.view',
  'products.manage',
  'product_categories.view',
  'product_categories.manage',
  'product_benefits.manage',
  'product_hero.manage',
  'product_contact.manage'
)
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Gán quyền products cho role editor
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'products.view',
  'products.manage',
  'product_categories.view',
  'product_categories.manage'
)
WHERE r.code = 'editor'
ON CONFLICT (role_id, permission_id) DO NOTHING;

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

