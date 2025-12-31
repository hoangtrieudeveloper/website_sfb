-- Database Schema cho SFB API (PostgreSQL)
-- Chạy file này để khởi tạo các bảng database

-- Bảng roles (vai trò người dùng)
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,        -- admin, editor, user...
  name VARCHAR(255) NOT NULL,              -- Tên hiển thị
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,        -- dùng để gán mặc định cho user mới
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho roles
CREATE INDEX IF NOT EXISTS idx_roles_code ON roles(code);
CREATE INDEX IF NOT EXISTS idx_roles_active ON roles(is_active);

-- Bảng users (người dùng)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động cập nhật updated_at cho users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng permissions (quyền chi tiết)
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,       -- ví dụ: user.view, user.manage
  name VARCHAR(255) NOT NULL,              -- Tên hiển thị
  module VARCHAR(100),                     -- Nhóm chức năng: users, roles, news...
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_permissions_code ON permissions(code);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);
CREATE INDEX IF NOT EXISTS idx_permissions_active ON permissions(is_active);

-- Bảng role_permissions (gán quyền cho vai trò)
CREATE TABLE IF NOT EXISTS role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Bảng news (bài viết tin tức)
CREATE TABLE IF NOT EXISTS news_categories (
  code VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_code VARCHAR(100) REFERENCES news_categories(code) ON UPDATE CASCADE ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_news_categories_parent_code ON news_categories(parent_code);

INSERT INTO news_categories (code, name, description, is_active)
VALUES
  ('product', 'Sản phẩm & giải pháp', 'Bài viết về sản phẩm/giải pháp', TRUE),
  ('company', 'Tin công ty', 'Tin tức nội bộ, hoạt động công ty', TRUE),
  ('tech', 'Tin công nghệ', 'Xu hướng, cập nhật công nghệ', TRUE)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(255),
  category_id VARCHAR(100) REFERENCES news_categories(code) ON UPDATE CASCADE ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'published')),
  image_url TEXT,
  author VARCHAR(255),
  read_time VARCHAR(100),
  gradient VARCHAR(255),
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  published_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date);

-- Trigger cập nhật updated_at cho news
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed mẫu cho news (10 bản ghi)
INSERT INTO news (
  title, slug, excerpt, content, category, category_id, status, image_url,
  author, read_time, gradient, published_date, is_featured,
  seo_title, seo_description, seo_keywords
)
VALUES
  ('Hệ thống tuyển sinh đầu cấp', 'he-thong-tuyen-sinh-dau-cap', 'Giải pháp phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.', '<p>Nội dung bài viết về hệ thống tuyển sinh đầu cấp...</p>', 'Sản phẩm & giải pháp', 'product', 'published', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', 'SFB Technology', '10 phút đọc', 'from-blue-600 to-cyan-600', '2025-08-07', true, 'Hệ thống tuyển sinh đầu cấp', 'Giải pháp phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh', 'tuyển sinh, giáo dục, phần mềm'),
  ('SFB ra mắt nền tảng Cloud thế hệ mới', 'sfb-cloud-gen-2', 'Nâng cấp hiệu năng và bảo mật cho doanh nghiệp', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'published', NULL, 'SFB Technology', '5 phút đọc', 'from-blue-600 to-cyan-600', CURRENT_DATE - INTERVAL '1 day', false, 'SFB Cloud thế hệ mới', 'Hiệu năng và bảo mật vượt trội cho doanh nghiệp', 'sfb cloud, hiệu năng, bảo mật'),
  ('Ký kết hợp tác chuyển đổi số với đối tác A', 'chuyen-doi-so-doi-tac-a', 'Hợp tác chiến lược nâng cao năng lực số', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'approved', NULL, 'SFB Technology', '4 phút đọc', 'from-indigo-600 to-purple-600', CURRENT_DATE - INTERVAL '2 day', false, 'Hợp tác chuyển đổi số', 'Đối tác A cùng SFB chuyển đổi số', 'chuyển đổi số, hợp tác, đối tác A'),
  ('Hướng dẫn triển khai CRM hiệu quả', 'huong-dan-trien-khai-crm', 'Các bước triển khai hệ thống CRM cho SME', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'draft', NULL, 'SFB Technology', '6 phút đọc', 'from-emerald-600 to-teal-600', CURRENT_DATE, false, 'Triển khai CRM hiệu quả', 'Hướng dẫn các bước triển khai CRM cho SME', 'crm, hướng dẫn, sme'),
  ('Cập nhật bảo mật quý này', 'cap-nhat-bao-mat-q1', 'Tổng hợp bản vá và khuyến nghị bảo mật', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'pending', NULL, 'Security Team', '3 phút đọc', 'from-red-600 to-rose-600', CURRENT_DATE - INTERVAL '5 day', false, 'Cập nhật bảo mật', 'Bản vá và khuyến nghị bảo mật mới nhất', 'bảo mật, patch, khuyến nghị'),
  ('Case study: Thành công với SFB Cloud', 'case-study-sfb-cloud', 'Khách hàng tăng 40% hiệu suất vận hành', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'published', NULL, 'SFB Technology', '7 phút đọc', 'from-orange-600 to-amber-600', CURRENT_DATE - INTERVAL '7 day', false, 'Case study SFB Cloud', 'Tăng 40% hiệu suất vận hành với SFB Cloud', 'case study, sfb cloud, hiệu suất'),
  ('Checklist go-live hệ thống mới', 'checklist-go-live', 'Những việc cần làm trước khi go-live', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'draft', NULL, 'SFB Technology', '4 phút đọc', 'from-blue-600 to-cyan-600', CURRENT_DATE - INTERVAL '3 day', false, 'Checklist go-live', 'Chuẩn bị go-live hệ thống mới', 'go-live, checklist, triển khai'),
  ('Roadmap sản phẩm 2025', 'roadmap-san-pham-2025', 'Các mốc phát hành tính năng chính', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'approved', NULL, 'Product Team', '5 phút đọc', 'from-purple-600 to-pink-600', CURRENT_DATE - INTERVAL '10 day', false, 'Roadmap sản phẩm 2025', 'Các mốc phát hành chính năm 2025', 'roadmap, sản phẩm, 2025'),
  ('Tối ưu chi phí hạ tầng', 'toi-uu-chi-phi-ha-tang', 'Kinh nghiệm giảm 25% chi phí cloud', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'published', NULL, 'FinOps Team', '6 phút đọc', 'from-emerald-600 to-teal-600', CURRENT_DATE - INTERVAL '4 day', false, 'Tối ưu chi phí cloud', 'Giảm 25% chi phí hạ tầng cloud', 'finops, chi phí, cloud'),
  ('Best practices bảo mật API', 'best-practices-bao-mat-api', 'Hướng dẫn bảo vệ API an toàn', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'rejected', NULL, 'Security Team', '8 phút đọc', 'from-indigo-600 to-purple-600', CURRENT_DATE - INTERVAL '8 day', false, 'Best practices API security', 'Hướng dẫn bảo mật API an toàn', 'api security, best practices'),
  ('Template SEO cho bài viết', 'template-seo-bai-viet', 'Mẫu cấu trúc SEO hiệu quả cho content', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'published', NULL, 'Content Team', '5 phút đọc', 'from-cyan-600 to-blue-600', CURRENT_DATE - INTERVAL '6 day', false, 'Template SEO', 'Mẫu cấu trúc SEO hiệu quả', 'seo, template, content')
ON CONFLICT (slug) DO NOTHING;

-- Bảng sessions (phiên đăng nhập - nếu cần)
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho sessions
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Insert roles mặc định
INSERT INTO roles (code, name, description, is_active, is_default)
VALUES
  ('admin', 'Quản trị viên', 'Toàn quyền hệ thống', TRUE, FALSE),
  ('editor', 'Biên tập viên', 'Quản lý nội dung', TRUE, FALSE),
  ('user', 'Người dùng', 'Quyền mặc định', TRUE, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Insert permissions mặc định (demo) cho tất cả module admin hiện tại
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  -- Dashboard
  ('dashboard.view', 'Xem trang tổng quan', 'dashboard', 'Truy cập trang dashboard admin', TRUE),
  -- Người dùng
  ('users.view', 'Xem danh sách người dùng', 'users', 'Cho phép xem danh sách tài khoản', TRUE),
  ('users.manage', 'Quản lý người dùng', 'users', 'Thêm, sửa, xóa tài khoản', TRUE),
  -- Roles & phân quyền
  ('roles.view', 'Xem phân quyền (roles)', 'roles', 'Xem danh sách roles', TRUE),
  ('roles.manage', 'Quản lý phân quyền (roles)', 'roles', 'Thêm, sửa, xóa roles và gán quyền', TRUE),
  ('permissions.view', 'Xem quyền chi tiết', 'permissions', 'Xem danh sách permissions', TRUE),
  ('permissions.manage', 'Quản lý quyền chi tiết', 'permissions', 'Thêm, sửa, xóa permissions', TRUE),
  -- Tin tức
  ('news.view', 'Xem danh sách tin tức', 'news', 'Xem danh sách bài viết tin tức', TRUE),
  ('news.manage', 'Quản lý tin tức', 'news', 'Thêm, sửa, xóa bài viết tin tức', TRUE),
  -- Danh mục
  ('categories.view', 'Xem danh sách danh mục', 'categories', 'Xem các danh mục nội dung', TRUE),
  ('categories.manage', 'Quản lý danh mục', 'categories', 'Thêm, sửa, xóa danh mục nội dung', TRUE),
  -- Cài đặt hệ thống
  ('settings.view', 'Xem cấu hình hệ thống', 'settings', 'Truy cập trang cấu hình / cài đặt', TRUE),
  ('settings.manage', 'Quản lý cấu hình hệ thống', 'settings', 'Thay đổi các cấu hình quản trị', TRUE),
  -- Media Library
  ('media.view', 'Xem thư viện Media', 'media', 'Truy cập và xem thư viện media', TRUE),
  ('media.manage', 'Quản lý thư viện Media', 'media', 'Upload, xóa, quản lý file và thư mục media', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Menu management
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('menus.view', 'Xem danh sách menu', 'menus', 'Xem danh sách menu điều hướng', TRUE),
  ('menus.manage', 'Quản lý menu', 'menus', 'Thêm, sửa, xóa menu điều hướng', TRUE)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  position VARCHAR(50) NOT NULL DEFAULT 'header', -- header, footer, sidebar...
  parent_id INTEGER REFERENCES menus(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_menus_position ON menus(position);
CREATE INDEX IF NOT EXISTS idx_menus_parent_id ON menus(parent_id);
CREATE INDEX IF NOT EXISTS idx_menus_is_active ON menus(is_active);

DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
CREATE TRIGGER update_menus_updated_at
    BEFORE UPDATE ON menus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed sample menus
INSERT INTO menus (title, url, position, parent_id, sort_order, is_active)
VALUES
  ('Trang chủ', '/', 'header', NULL, 1, TRUE),
  ('Giải pháp', '/#solutions', 'header', NULL, 2, TRUE),
  ('Tin tức', '/news', 'header', NULL, 3, TRUE),
  ('Liên hệ', '/#contact', 'header', NULL, 4, TRUE),
  ('Footer - Giới thiệu', '/#about', 'footer', NULL, 1, TRUE)
ON CONFLICT DO NOTHING;

-- Media Library Tables
-- Bảng media_folders (thư mục media)
CREATE TABLE IF NOT EXISTS media_folders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  parent_id INTEGER REFERENCES media_folders(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_folders_parent_id ON media_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_media_folders_slug ON media_folders(slug);

DROP TRIGGER IF EXISTS update_media_folders_updated_at ON media_folders;
CREATE TRIGGER update_media_folders_updated_at
    BEFORE UPDATE ON media_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng media_files (file media)
CREATE TABLE IF NOT EXISTS media_files (
  id SERIAL PRIMARY KEY,
  folder_id INTEGER REFERENCES media_folders(id) ON DELETE SET NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  description TEXT,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_files_folder_id ON media_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_files_file_type ON media_files(file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at);

DROP TRIGGER IF EXISTS update_media_files_updated_at ON media_files;
CREATE TRIGGER update_media_files_updated_at
    BEFORE UPDATE ON media_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert thư mục mặc định cho media
INSERT INTO media_folders (name, slug, parent_id, description)
VALUES
  ('Root', 'root', NULL, 'Thư mục gốc'),
  ('Images', 'images', NULL, 'Thư mục chứa hình ảnh'),
  ('Documents', 'documents', NULL, 'Thư mục chứa tài liệu'),
  ('Icons', 'icons', NULL, 'Thư mục chứa icons'),
  ('Projects', 'projects', NULL, 'Thư mục dự án')
ON CONFLICT (slug) DO NOTHING;

-- Gán toàn bộ quyền cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON 1 = 1
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Gán quyền mặc định cho các role khác (editor, user)
-- Biên tập viên: quản lý nội dung (tin tức, danh mục) + xem dashboard + xem media
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'dashboard.view',
  'menus.view',
  'menus.manage',
  'news.view',
  'news.manage',
  'categories.view',
  'categories.manage',
  'media.view'
)
WHERE r.code = 'editor'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Gán quyền media cho role admin (nếu chưa có)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('media.view', 'media.manage')
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Người dùng thường: chỉ xem dashboard (có thể mở rộng thêm sau)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'dashboard.view'
)
WHERE r.code = 'user'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Insert user admin mặc định (password: admin123 - đã được hash bằng bcrypt)
-- Hash được tạo bằng: node scripts/generate-password-hash.js admin123
-- Password gốc: admin123
-- Hash: $2b$10$J6ePXVfM.f99Lhtpm0vT6.fsGrznheZFzklihxadYerXLAYRIqZh2
INSERT INTO users (email, password, name, role_id, status)
VALUES (
  'admin@sfb.local',
  '$2b$10$J6ePXVfM.f99Lhtpm0vT6.fsGrznheZFzklihxadYerXLAYRIqZh2',
  'Admin SFB',
  (SELECT id FROM roles WHERE code = 'admin' LIMIT 1),
  'active'
)
ON CONFLICT (email) DO NOTHING;

-- Bảng dashboard_stats (thống kê dashboard - ví dụ)
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id SERIAL PRIMARY KEY,
  stat_key VARCHAR(100) NOT NULL UNIQUE,
  stat_value INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho dashboard_stats
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_key ON dashboard_stats(stat_key);

-- Tạo trigger để tự động cập nhật updated_at cho dashboard_stats
DROP TRIGGER IF EXISTS update_dashboard_stats_updated_at ON dashboard_stats;
CREATE TRIGGER update_dashboard_stats_updated_at
    BEFORE UPDATE ON dashboard_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert dữ liệu mẫu cho dashboard
INSERT INTO dashboard_stats (stat_key, stat_value) VALUES
('total_users', 0),
('total_orders', 0),
('total_revenue', 0),
('total_products', 0)
ON CONFLICT (stat_key) DO NOTHING;

-- ============================================================================
-- PRODUCTS MANAGEMENT SYSTEM SCHEMA
-- ============================================================================

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
  
  -- CONTENT MODE
  content_mode VARCHAR(20) DEFAULT 'config', -- 'config' | 'content'
  content_html TEXT,                         -- Nội dung CKEditor
  
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

-- ============================================================================
-- INDUSTRIES MANAGEMENT SYSTEM SCHEMA
-- ============================================================================

-- Bảng industries (Lĩnh vực hoạt động)
CREATE TABLE IF NOT EXISTS industries (
  id SERIAL PRIMARY KEY,
  icon_name VARCHAR(100),                    -- Tên icon từ lucide-react (ví dụ: "Code2", "MonitorSmartphone")
  title VARCHAR(255) NOT NULL,              -- Tiêu đề lĩnh vực
  short TEXT,                                -- Mô tả ngắn
  points JSONB DEFAULT '[]'::jsonb,          -- Mảng các điểm nổi bật (ví dụ: ["Điểm 1", "Điểm 2"])
  gradient VARCHAR(255),                     -- Tailwind gradient class (ví dụ: "from-blue-500 to-cyan-500")
  sort_order INTEGER DEFAULT 0,              -- Thứ tự sắp xếp
  is_active BOOLEAN DEFAULT TRUE,            -- Bật/tắt hiển thị
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_industries_active ON industries(is_active);
CREATE INDEX IF NOT EXISTS idx_industries_sort ON industries(sort_order);

-- Trigger cập nhật updated_at cho industries
DROP TRIGGER IF EXISTS update_industries_updated_at ON industries;
CREATE TRIGGER update_industries_updated_at
    BEFORE UPDATE ON industries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed dữ liệu mẫu cho industries
INSERT INTO industries (icon_name, title, short, points, gradient, sort_order, is_active)
VALUES
  (
    'Code2',
    'Phát triển phần mềm',
    'Thiết kế & xây dựng các hệ thống phần mềm nghiệp vụ, web, mobile và sản phẩm đóng gói.',
    '["Ứng dụng quản lý nghiệp vụ cho cơ quan, doanh nghiệp", "Web / portal nội bộ & bên ngoài", "Sản phẩm phần mềm đóng gói, triển khai nhanh"]'::jsonb,
    'from-blue-500 to-cyan-500',
    1,
    TRUE
  ),
  (
    'MonitorSmartphone',
    'Tư vấn xây dựng & phát triển hệ thống CNTT',
    'Đồng hành từ khảo sát, tư vấn kiến trúc đến lộ trình triển khai tổng thể hệ thống CNTT.',
    '["Khảo sát hiện trạng & nhu cầu nghiệp vụ", "Đề xuất kiến trúc hệ thống & lộ trình chuyển đổi số", "Tư vấn lựa chọn nền tảng công nghệ phù hợp"]'::jsonb,
    'from-purple-500 to-pink-500',
    2,
    TRUE
  ),
  (
    'Network',
    'Tích hợp hệ thống & quản trị vận hành',
    'Kết nối các hệ thống hiện hữu, quản lý vận hành tập trung, an toàn và ổn định.',
    '["Xây dựng nền tảng tích hợp dữ liệu & dịch vụ", "Kết nối các hệ thống lõi, ứng dụng vệ tinh", "Giám sát, vận hành hệ thống 24/7"]'::jsonb,
    'from-emerald-500 to-teal-500',
    3,
    TRUE
  ),
  (
    'Globe2',
    'Giải pháp cổng thông tin điện tử',
    'Cổng thông tin cho tổ chức, doanh nghiệp với trải nghiệm người dùng hiện đại.',
    '["Cổng thông tin nội bộ & đối ngoại", "Quản lý nội dung, tin tức, dịch vụ trực tuyến", "Tối ưu tra cứu, tìm kiếm & tra cứu hồ sơ"]'::jsonb,
    'from-orange-500 to-amber-500',
    4,
    TRUE
  ),
  (
    'ShieldCheck',
    'Cổng thông tin Chính phủ điện tử trên nền tảng SharePoint',
    'Giải pháp chuyên sâu cho khối nhà nước dựa trên Microsoft SharePoint.',
    '["Kiến trúc tuân thủ quy định Chính phủ điện tử", "Quy trình phê duyệt, luân chuyển hồ sơ điện tử", "Bảo mật cao, phân quyền chi tiết"]'::jsonb,
    'from-sky-500 to-blue-600',
    5,
    TRUE
  ),
  (
    'Users',
    'Outsourcing',
    'Cung cấp đội ngũ phát triển phần mềm chuyên nghiệp, linh hoạt theo mô hình dự án.',
    '["Team dev, BA, QA, DevOps theo yêu cầu", "Linh hoạt thời gian & hình thức hợp tác", "Đảm bảo quy trình & chất lượng theo tiêu chuẩn SFB"]'::jsonb,
    'from-rose-500 to-pink-500',
    6,
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Bảng industries_hero (Hero banner cho trang industries)
CREATE TABLE IF NOT EXISTS industries_hero (
  id SERIAL PRIMARY KEY,
  title_prefix VARCHAR(255) NOT NULL,              -- "Giải pháp công nghệ tối ưu"
  title_suffix VARCHAR(255) NOT NULL,              -- "vận hành doanh nghiệp"
  description TEXT,                                -- Mô tả dài
  button_text VARCHAR(255),                        -- "KHÁM PHÁ GIẢI PHÁP"
  button_link VARCHAR(255),                       -- "/solutions"
  image TEXT,                                      -- URL ảnh hero
  background_gradient VARCHAR(255),               -- Gradient background
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng industries_hero_stats (Stats trong hero banner)
CREATE TABLE IF NOT EXISTS industries_hero_stats (
  id SERIAL PRIMARY KEY,
  hero_id INTEGER REFERENCES industries_hero(id) ON DELETE CASCADE,
  icon_name VARCHAR(100),                          -- Tên icon từ lucide-react
  value VARCHAR(255) NOT NULL,                    -- "8+ năm"
  label VARCHAR(255) NOT NULL,                     -- "Kinh nghiệm triển khai"
  gradient VARCHAR(255),                          -- Tailwind gradient
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_industries_hero_stats_hero_id ON industries_hero_stats(hero_id);
CREATE INDEX IF NOT EXISTS idx_industries_hero_stats_sort ON industries_hero_stats(sort_order);

-- Bảng industries_list_header (Header cho danh sách lĩnh vực)
CREATE TABLE IF NOT EXISTS industries_list_header (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,                    -- "Các lĩnh vực hoạt động & dịch vụ"
  description TEXT,                                -- Mô tả
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng industries_process_header (Header cho process section)
CREATE TABLE IF NOT EXISTS industries_process_header (
  id SERIAL PRIMARY KEY,
  subtitle VARCHAR(255) NOT NULL,                 -- "LỘ TRÌNH ĐỒNG HÀNH CÙNG SFB"
  title_part1 VARCHAR(255) NOT NULL,              -- "Vì sao SFB phù hợp cho"
  title_highlight VARCHAR(255) NOT NULL,          -- "nhiều"
  title_part2 VARCHAR(255) NOT NULL,              -- "lĩnh vực khác nhau"
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng industries_process_steps (Các bước trong process section)
CREATE TABLE IF NOT EXISTS industries_process_steps (
  id SERIAL PRIMARY KEY,
  step_id VARCHAR(10) NOT NULL,                   -- "01", "02", "03"
  icon_name VARCHAR(100),                         -- Tên icon từ lucide-react
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points JSONB DEFAULT '[]'::jsonb,               -- Mảng các điểm
  image TEXT,                                      -- URL ảnh minh họa
  colors_gradient VARCHAR(255),                   -- "from-blue-500 to-cyan-500"
  colors_strip VARCHAR(255),                      -- "from-blue-500 via-cyan-500 to-sky-400"
  colors_border VARCHAR(255),                     -- "border-blue-100"
  colors_shadow_base VARCHAR(255),                -- "rgba(15,23,42,0.06)"
  colors_shadow_hover VARCHAR(255),              -- "rgba(37,99,235,0.18)"
  colors_check VARCHAR(255),                      -- "text-blue-600"
  button_text VARCHAR(255),
  button_link VARCHAR(255),
  button_icon_name VARCHAR(100),                  -- Tên icon cho button
  button_icon_size INTEGER DEFAULT 18,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_industries_process_steps_sort ON industries_process_steps(sort_order);
CREATE INDEX IF NOT EXISTS idx_industries_process_steps_active ON industries_process_steps(is_active);

-- Trigger cập nhật updated_at
DROP TRIGGER IF EXISTS update_industries_hero_updated_at ON industries_hero;
CREATE TRIGGER update_industries_hero_updated_at
    BEFORE UPDATE ON industries_hero
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_industries_list_header_updated_at ON industries_list_header;
CREATE TRIGGER update_industries_list_header_updated_at
    BEFORE UPDATE ON industries_list_header
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_industries_process_header_updated_at ON industries_process_header;
CREATE TRIGGER update_industries_process_header_updated_at
    BEFORE UPDATE ON industries_process_header
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_industries_process_steps_updated_at ON industries_process_steps;
CREATE TRIGGER update_industries_process_steps_updated_at
    BEFORE UPDATE ON industries_process_steps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed dữ liệu mẫu cho industries_hero
INSERT INTO industries_hero (title_prefix, title_suffix, description, button_text, button_link, image, background_gradient, is_active)
VALUES
  (
    'Giải pháp công nghệ tối ưu',
    'vận hành doanh nghiệp',
    'Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với hàng trăm dự án triển khai thực tế.',
    'KHÁM PHÁ GIẢI PHÁP',
    '/solutions',
    '/images/fieldhero.png',
    'linear-gradient(31deg, #0870B4 51.21%, #2EABE2 97.73%)',
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Seed dữ liệu mẫu cho industries_list_header
INSERT INTO industries_list_header (title, description, is_active)
VALUES
  (
    'Các lĩnh vực hoạt động & dịch vụ',
    'Những mảng chuyên môn chính mà SFB đang cung cấp giải pháp và dịch vụ công nghệ thông tin cho cơ quan Nhà nước & doanh nghiệp',
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Seed dữ liệu mẫu cho industries_process_header
INSERT INTO industries_process_header (subtitle, title_part1, title_highlight, title_part2, is_active)
VALUES
  (
    'LỘ TRÌNH ĐỒNG HÀNH CÙNG SFB',
    'Vì sao SFB phù hợp cho',
    'nhiều',
    'lĩnh vực khác nhau',
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Seed dữ liệu mẫu cho industries_process_steps
INSERT INTO industries_process_steps (
  step_id, icon_name, title, description, points, image,
  colors_gradient, colors_strip, colors_border, colors_shadow_base, colors_shadow_hover, colors_check,
  button_text, button_link, button_icon_name, button_icon_size, sort_order, is_active
)
VALUES
  (
    '01',
    'Target',
    'Hiểu rõ đặc thù từng ngành',
    'Kinh nghiệm triển khai cho khối Nhà nước, giáo dục, y tế, doanh nghiệp giúp SFB nắm rõ quy định, quy trình và nhu cầu thực tế của từng đơn vị.',
    '["Nắm bắt nhanh yêu cầu nghiệp vụ", "Giải pháp \"fit\" quy trình, không one-size-fits-all"]'::jsonb,
    '/images/industries/industries1.png',
    'from-blue-500 to-cyan-500',
    'from-blue-500 via-cyan-500 to-sky-400',
    'border-blue-100',
    'rgba(15,23,42,0.06)',
    'rgba(37,99,235,0.18)',
    'text-blue-600',
    'Liên hệ với chúng tôi',
    '/contact',
    'ArrowRight',
    18,
    1,
    TRUE
  ),
  (
    '02',
    'Users',
    'Đội ngũ chuyên gia đồng hành',
    'Kết hợp BA, dev, QA, DevOps và chuyên gia nghiệp vụ theo từng lĩnh vực, hỗ trợ khách hàng từ giai đoạn ý tưởng đến vận hành.',
    '["Trao đổi trực tiếp với team tư vấn & triển khai", "Đào tạo & hỗ trợ sau khi go-live"]'::jsonb,
    '/images/industries/industries2.png',
    'from-emerald-500 to-teal-500',
    'from-emerald-500 via-teal-500 to-cyan-400',
    'border-emerald-100',
    'rgba(15,23,42,0.06)',
    'rgba(16,185,129,0.22)',
    'text-emerald-600',
    'Kết nối với chuyên gia',
    '/experts',
    'Phone',
    18,
    2,
    TRUE
  ),
  (
    '03',
    'Award',
    'Quy trình & chất lượng nhất quán',
    'Áp dụng quy trình chuẩn trong phân tích, phát triển, kiểm thử và triển khai, đảm bảo mỗi dự án đều đạt chất lượng như cam kết.',
    '["Quy trình rõ ràng, minh bạch tiến độ", "Dễ dàng mở rộng & bảo trì về sau"]'::jsonb,
    '/images/industries/industries3.png',
    'from-purple-500 to-pink-500',
    'from-purple-500 via-violet-500 to-pink-400',
    'border-purple-100',
    'rgba(15,23,42,0.06)',
    'rgba(168,85,247,0.22)',
    'text-purple-600',
    'Tìm hiểu quy trình, nghiệp vụ',
    '/process',
    'Sparkles',
    18,
    3,
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Seed stats cho hero (sau khi có hero_id)
DO $$
DECLARE
  hero_id_val INTEGER;
BEGIN
  SELECT id INTO hero_id_val FROM industries_hero LIMIT 1;
  
  IF hero_id_val IS NOT NULL THEN
    INSERT INTO industries_hero_stats (hero_id, icon_name, value, label, gradient, sort_order)
    VALUES
      (hero_id_val, 'Award', '8+ năm', 'Kinh nghiệm triển khai', 'from-blue-500 to-cyan-500', 1),
      (hero_id_val, 'Target', 'Hàng trăm', 'Dự án & triển khai thực tế', 'from-purple-500 to-pink-500', 2),
      (hero_id_val, 'Users', 'Nhiều đơn vị', 'Cơ quan Nhà nước & doanh nghiệp', 'from-emerald-500 to-teal-500', 3),
      (hero_id_val, 'Sparkles', 'Đội ngũ', 'Chuyên gia CNTT tận tâm', 'from-orange-500 to-red-500', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Thêm permissions cho industries module
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('industries.view', 'Xem danh sách lĩnh vực', 'industries', 'Xem danh sách các lĩnh vực hoạt động', TRUE),
  ('industries.manage', 'Quản lý lĩnh vực', 'industries', 'Thêm, sửa, xóa lĩnh vực hoạt động', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền industries cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'industries.view',
  'industries.manage'
)
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================================================
-- ABOUT PAGE MANAGEMENT SCHEMA
-- ============================================================================

-- Hero Section
CREATE TABLE IF NOT EXISTS about_hero (
  id SERIAL PRIMARY KEY,
  title_line1 VARCHAR(255) NOT NULL,
  title_line2 VARCHAR(255) NOT NULL,
  title_line3 VARCHAR(255) NOT NULL,
  description TEXT,
  button_text VARCHAR(255),
  button_link VARCHAR(255),
  image VARCHAR(500),
  background_gradient VARCHAR(255) DEFAULT 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Section
CREATE TABLE IF NOT EXISTS about_company (
  id SERIAL PRIMARY KEY,
  header_sub VARCHAR(255),
  header_title_line1 VARCHAR(255),
  header_title_line2 VARCHAR(255),
  content_image1 VARCHAR(500),
  content_title TEXT,
  content_description TEXT,
  content_button_text VARCHAR(255),
  content_button_link VARCHAR(255),
  contact_image2 VARCHAR(500),
  contact_button_text VARCHAR(255),
  contact_button_link VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Contact Items
CREATE TABLE IF NOT EXISTS about_company_contacts (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES about_company(id) ON DELETE CASCADE,
  icon_name VARCHAR(100) NOT NULL DEFAULT 'Building2',
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  is_highlight BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vision & Mission Section
CREATE TABLE IF NOT EXISTS about_vision_mission (
  id SERIAL PRIMARY KEY,
  header_title VARCHAR(255),
  header_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vision & Mission Items
CREATE TABLE IF NOT EXISTS about_vision_mission_items (
  id SERIAL PRIMARY KEY,
  vision_mission_id INTEGER REFERENCES about_vision_mission(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core Values Section
CREATE TABLE IF NOT EXISTS about_core_values (
  id SERIAL PRIMARY KEY,
  header_title VARCHAR(255),
  header_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core Values Items
CREATE TABLE IF NOT EXISTS about_core_values_items (
  id SERIAL PRIMARY KEY,
  core_values_id INTEGER REFERENCES about_core_values(id) ON DELETE CASCADE,
  icon_name VARCHAR(100) NOT NULL DEFAULT 'Lightbulb',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  gradient VARCHAR(255) DEFAULT 'from-yellow-500 to-orange-500',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones Section
CREATE TABLE IF NOT EXISTS about_milestones (
  id SERIAL PRIMARY KEY,
  header_title VARCHAR(255),
  header_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones Items
CREATE TABLE IF NOT EXISTS about_milestones_items (
  id SERIAL PRIMARY KEY,
  milestones_id INTEGER REFERENCES about_milestones(id) ON DELETE CASCADE,
  year VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🚀',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leadership Section
CREATE TABLE IF NOT EXISTS about_leadership (
  id SERIAL PRIMARY KEY,
  header_title VARCHAR(255),
  header_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leadership Items
CREATE TABLE IF NOT EXISTS about_leadership_items (
  id SERIAL PRIMARY KEY,
  leadership_id INTEGER REFERENCES about_leadership(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  description TEXT,
  image VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers for updated_at
CREATE TRIGGER update_about_hero_updated_at BEFORE UPDATE ON about_hero FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_company_updated_at BEFORE UPDATE ON about_company FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_company_contacts_updated_at BEFORE UPDATE ON about_company_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_vision_mission_updated_at BEFORE UPDATE ON about_vision_mission FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_vision_mission_items_updated_at BEFORE UPDATE ON about_vision_mission_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_core_values_updated_at BEFORE UPDATE ON about_core_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_core_values_items_updated_at BEFORE UPDATE ON about_core_values_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_milestones_updated_at BEFORE UPDATE ON about_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_milestones_items_updated_at BEFORE UPDATE ON about_milestones_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_leadership_updated_at BEFORE UPDATE ON about_leadership FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_leadership_items_updated_at BEFORE UPDATE ON about_leadership_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert permissions
INSERT INTO permissions (code, name, module, description, is_active)
VALUES 
  ('about.manage', 'Quản lý trang Giới thiệu', 'about', 'Quản lý toàn bộ nội dung trang Giới thiệu', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Assign permission to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r 
JOIN permissions p ON p.code = 'about.manage' 
WHERE r.code = 'admin' 
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Seed data cho About Page
-- Hero Section
INSERT INTO about_hero (title_line1, title_line2, title_line3, description, button_text, button_link, image, background_gradient, is_active)
VALUES (
  'SFB Technology',
  'Công ty cổ phần',
  'công nghệ SFB',
  'Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với hàng trăm dự án triển khai thực tế.',
  'KHÁM PHÁ GIẢI PHÁP',
  '/solutions',
  '/images/abouthero.png',
  'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Company Section
INSERT INTO about_company (
  header_sub, header_title_line1, header_title_line2,
  content_image1, content_title, content_description, content_button_text, content_button_link,
  contact_image2, contact_button_text, contact_button_link,
  is_active
)
VALUES (
  'GIỚI THIỆU SFB',
  'Đối tác công nghệ chiến lược',
  'cho doanh nghiệp Việt',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  'CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB (SFB TECHNOLOGY JOINT STOCK COMPANY – viết tắt SFBTECH.,JSC)',
  'Công ty hoạt động theo mô hình cổ phần với giấy chứng nhận đăng ký kinh doanh số 0107857710 do Sở Kế hoạch và Đầu tư Hà Nội cấp ngày 24/05/2017.',
  'Liên hệ với chúng tôi',
  '/contact',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'Liên hệ ngay',
  '/contact',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Company Contact Items
DO $$
DECLARE
  company_id_val INTEGER;
BEGIN
  SELECT id INTO company_id_val FROM about_company LIMIT 1;
  
  IF company_id_val IS NOT NULL THEN
    INSERT INTO about_company_contacts (company_id, icon_name, title, text, is_highlight, sort_order)
    VALUES
      (company_id_val, 'Building2', 'Trụ sở', '41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc Thuỵ, quận Long Biên, Hà Nội.', FALSE, 1),
      (company_id_val, 'MapPin', 'Văn phòng', 'P303, Tầng 3, Khách sạn Thể Thao, 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.', FALSE, 2),
      (company_id_val, 'Phone', 'Hotline', '0888 917 999', TRUE, 3),
      (company_id_val, 'Mail', 'Email', 'info@sfb.vn', TRUE, 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Vision & Mission Section
INSERT INTO about_vision_mission (header_title, header_description, is_active)
VALUES (
  'Tầm nhìn & Sứ mệnh',
  'Trở thành một trong những công ty công nghệ hàng đầu về phát triển bền vững, xây dựng trên nền tảng tri thức và trí tuệ sáng tạo của đội ngũ nhân sự SFB.',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Vision & Mission Items
DO $$
DECLARE
  vision_mission_id_val INTEGER;
BEGIN
  SELECT id INTO vision_mission_id_val FROM about_vision_mission LIMIT 1;
  
  IF vision_mission_id_val IS NOT NULL THEN
    INSERT INTO about_vision_mission_items (vision_mission_id, text, sort_order)
    VALUES
      (vision_mission_id_val, 'Phát triển bền vững trên nền tảng tri thức', 1),
      (vision_mission_id_val, 'Kết hợp trí tuệ tập thể & sự nhiệt huyết của đội ngũ', 2),
      (vision_mission_id_val, 'Xây dựng hệ thống, sản phẩm có giá trị lâu dài', 3),
      (vision_mission_id_val, 'Cung cấp sản phẩm, dịch vụ tốt nhất dựa trên công nghệ mới', 4),
      (vision_mission_id_val, 'Tạo dựng niềm tin vững chắc với khách hàng & nhà đầu tư', 5),
      (vision_mission_id_val, 'Chung tay cùng xã hội hướng tới nền công nghiệp 4.0', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Core Values Section
INSERT INTO about_core_values (header_title, header_description, is_active)
VALUES (
  'Giá trị cốt lõi',
  'Những nguyên tắc định hình văn hoá và cách SFB hợp tác với khách hàng, đối tác và đội ngũ nội bộ',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Core Values Items
DO $$
DECLARE
  core_values_id_val INTEGER;
BEGIN
  SELECT id INTO core_values_id_val FROM about_core_values LIMIT 1;
  
  IF core_values_id_val IS NOT NULL THEN
    INSERT INTO about_core_values_items (core_values_id, icon_name, title, description, gradient, sort_order, is_active)
    VALUES
      (core_values_id_val, 'Lightbulb', 'Đổi mới sáng tạo', 'Luôn tìm kiếm giải pháp mới, áp dụng công nghệ tiên tiến vào sản phẩm & dịch vụ.', 'from-yellow-500 to-orange-500', 1, TRUE),
      (core_values_id_val, 'Handshake', 'Tận tâm với khách hàng', 'Đặt lợi ích khách hàng lên hàng đầu, cam kết đồng hành dài lâu.', 'from-rose-500 to-pink-500', 2, TRUE),
      (core_values_id_val, 'Users', 'Hợp tác & đồng hành', 'Làm việc nhóm chặt chẽ, cùng khách hàng xây dựng giải pháp phù hợp nhất.', 'from-blue-500 to-cyan-500', 3, TRUE),
      (core_values_id_val, 'ShieldCheck', 'Trách nhiệm & minh bạch', 'Tuân thủ cam kết, quy trình rõ ràng, không phát sinh chi phí thiếu minh bạch.', 'from-emerald-500 to-teal-500', 4, TRUE),
      (core_values_id_val, 'Database', 'Học hỏi không ngừng', 'Liên tục cập nhật xu hướng mới: Cloud, AI, Big Data, DevOps..', 'from-purple-500 to-indigo-500', 5, TRUE),
      (core_values_id_val, 'Globe2', 'Tư duy toàn cầu', 'Tiếp cận theo chuẩn quốc tế, sẵn sàng mở rộng sang các thị trường mới.', 'from-indigo-500 to-blue-500', 6, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Milestones Section
INSERT INTO about_milestones (header_title, header_description, is_active)
VALUES (
  'Hành trình phát triển',
  'Từ năm 2017 đến nay, SFB liên tục mở rộng đội ngũ, nâng cấp sản phẩm và chuẩn hóa dịch vụ để đồng hành cùng khách hàng lâu dài',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Milestones Items
DO $$
DECLARE
  milestones_id_val INTEGER;
BEGIN
  SELECT id INTO milestones_id_val FROM about_milestones LIMIT 1;
  
  IF milestones_id_val IS NOT NULL THEN
    INSERT INTO about_milestones_items (milestones_id, year, title, description, icon, sort_order, is_active)
    VALUES
      (milestones_id_val, '2017', 'Thành lập SFBTECH.,JSC', 'Được cấp giấy chứng nhận đăng ký kinh doanh số 0107857710 bởi Sở KH&ĐT Hà Nội, bắt đầu hoạt động theo mô hình công ty cổ phần.', '🚀', 1, TRUE),
      (milestones_id_val, '2018-2019', 'Xây dựng đội ngũ & sản phẩm lõi', 'Hình thành các giải pháp về cổng thông tin điện tử, văn bản điều hành, thư viện số và các hệ thống nghiệp vụ cho cơ quan Nhà nước.', '📘', 2, TRUE),
      (milestones_id_val, '2020-2022', 'Mở rộng lĩnh vực & quy mô triển khai', 'Triển khai nhiều dự án cho khối Tài chính, Bảo hiểm, Ngân hàng, Viễn thông, Chính phủ điện tử và Doanh nghiệp.', '📈', 3, TRUE),
      (milestones_id_val, '2023 - nay', 'Tiếp tục tăng trưởng & chuyển đổi số', 'Đẩy mạnh các giải pháp theo nhu cầu riêng của từng đơn vị, chú trọng mở rộng, an toàn, bảo mật và tích hợp hệ thống.', '🎯', 4, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Leadership Section
INSERT INTO about_leadership (header_title, header_description, is_active)
VALUES (
  'Ban lãnh đạo',
  'Đội ngũ lãnh đạo chủ chốt của SFB Technology, định hướng chiến lược và đồng hành cùng khách hàng trong mọi dự án',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Leadership Items
DO $$
DECLARE
  leadership_id_val INTEGER;
BEGIN
  SELECT id INTO leadership_id_val FROM about_leadership LIMIT 1;
  
  IF leadership_id_val IS NOT NULL THEN
    INSERT INTO about_leadership_items (leadership_id, name, position, email, phone, description, image, sort_order, is_active)
    VALUES
      (leadership_id_val, 'Nguyễn Văn Điền', 'KẾ TOÁN TRƯỞNG', 'diennv@sfb.vn', '0888 917 999', 'Thành viên ban lãnh đạo phụ trách kế toán trưởng, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.', 'https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg', 1, TRUE),
      (leadership_id_val, 'Nguyễn Đức Duy', 'GIÁM ĐỐC CÔNG NGHỆ', 'duynd@sfb.vn', '0705 146 789', 'Thành viên ban lãnh đạo phụ trách giám đốc công nghệ, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.', 'https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg', 2, TRUE),
      (leadership_id_val, 'Nguyễn Văn C', 'GIÁM ĐỐC KINH DOANH', 'nvc@sfb.vn', '0705 146 789', 'Thành viên ban lãnh đạo phụ trách giám đốc kinh doanh, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.', 'https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg', 3, TRUE),
      (leadership_id_val, 'Lê Văn D', 'GIÁM ĐỐC VẬN HÀNH', 'lvd@sfb.vn', '0987 654 321', 'Thành viên ban lãnh đạo phụ trách vận hành và quy trình nội bộ, đảm bảo hiệu suất hoạt động tối ưu.', 'https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg', 4, TRUE),
      (leadership_id_val, 'Phạm Thị E', 'GIÁM ĐỐC NHÂN SỰ', 'pte@sfb.vn', '0123 456 789', 'Thành viên ban lãnh đạo phụ trách phát triển nguồn nhân lực và văn hóa doanh nghiệp.', 'https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg', 5, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ==================== CAREERS MODULE ====================

-- Bảng career_hero (Hero section cho trang Careers)
CREATE TABLE IF NOT EXISTS career_hero (
  id SERIAL PRIMARY KEY,
  title_line1 VARCHAR(255),
  title_line2 VARCHAR(255),
  description TEXT,
  button_text VARCHAR(255),
  button_link VARCHAR(255),
  image TEXT,
  background_gradient TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_hero_active ON career_hero(is_active);

-- Trigger cập nhật updated_at cho career_hero
DROP TRIGGER IF EXISTS update_career_hero_updated_at ON career_hero;
CREATE TRIGGER update_career_hero_updated_at
    BEFORE UPDATE ON career_hero
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng career_benefits (Phúc lợi & Đãi ngộ)
CREATE TABLE IF NOT EXISTS career_benefits (
  id SERIAL PRIMARY KEY,
  header_title VARCHAR(255),
  header_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_benefits_active ON career_benefits(is_active);

-- Trigger cập nhật updated_at cho career_benefits
DROP TRIGGER IF EXISTS update_career_benefits_updated_at ON career_benefits;
CREATE TRIGGER update_career_benefits_updated_at
    BEFORE UPDATE ON career_benefits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng career_benefits_items (Items trong phần Benefits)
CREATE TABLE IF NOT EXISTS career_benefits_items (
  id SERIAL PRIMARY KEY,
  benefits_id INTEGER NOT NULL REFERENCES career_benefits(id) ON DELETE CASCADE,
  icon_name VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  gradient VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_benefits_items_benefits ON career_benefits_items(benefits_id);
CREATE INDEX IF NOT EXISTS idx_career_benefits_items_sort ON career_benefits_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_career_benefits_items_active ON career_benefits_items(is_active);

-- Trigger cập nhật updated_at cho career_benefits_items
DROP TRIGGER IF EXISTS update_career_benefits_items_updated_at ON career_benefits_items;
CREATE TRIGGER update_career_benefits_items_updated_at
    BEFORE UPDATE ON career_benefits_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng career_positions (Vị trí đang tuyển)
CREATE TABLE IF NOT EXISTS career_positions (
  id SERIAL PRIMARY KEY,
  header_title VARCHAR(255),
  header_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_positions_active ON career_positions(is_active);

-- Trigger cập nhật updated_at cho career_positions
DROP TRIGGER IF EXISTS update_career_positions_updated_at ON career_positions;
CREATE TRIGGER update_career_positions_updated_at
    BEFORE UPDATE ON career_positions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng career_positions_items (Items trong phần Positions)
CREATE TABLE IF NOT EXISTS career_positions_items (
  id SERIAL PRIMARY KEY,
  positions_id INTEGER NOT NULL REFERENCES career_positions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  type VARCHAR(100),
  location VARCHAR(255),
  salary VARCHAR(255),
  experience VARCHAR(255),
  description TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  gradient VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_positions_items_positions ON career_positions_items(positions_id);
CREATE INDEX IF NOT EXISTS idx_career_positions_items_sort ON career_positions_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_career_positions_items_active ON career_positions_items(is_active);

-- Trigger cập nhật updated_at cho career_positions_items
DROP TRIGGER IF EXISTS update_career_positions_items_updated_at ON career_positions_items;
CREATE TRIGGER update_career_positions_items_updated_at
    BEFORE UPDATE ON career_positions_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng career_cta (CTA section)
CREATE TABLE IF NOT EXISTS career_cta (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  primary_button_text VARCHAR(255),
  primary_button_link VARCHAR(255),
  secondary_button_text VARCHAR(255),
  secondary_button_link VARCHAR(255),
  background_gradient TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_cta_active ON career_cta(is_active);

-- Trigger cập nhật updated_at cho career_cta
DROP TRIGGER IF EXISTS update_career_cta_updated_at ON career_cta;
CREATE TRIGGER update_career_cta_updated_at
    BEFORE UPDATE ON career_cta
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed data cho Careers
DO $$
DECLARE
  hero_id_val INTEGER;
  benefits_id_val INTEGER;
  positions_id_val INTEGER;
  cta_id_val INTEGER;
BEGIN
  -- Career Hero
  INSERT INTO career_hero (title_line1, title_line2, description, button_text, button_link, image, background_gradient, is_active)
  VALUES (
    'Cùng xây dựng',
    'tương lai công nghệ',
    'Gia nhập đội ngũ 50+ chuyên gia công nghệ, làm việc với tech stack hiện đại nhất và triển khai dự án cho các khách hàng lớn',
    'Xem vị trí tuyển dụng',
    '#positions',
    '/images/hero.png',
    'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
    TRUE
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO hero_id_val;

  -- Career Benefits
  INSERT INTO career_benefits (header_title, header_description, is_active)
  VALUES (
    'Phúc lợi & Đãi ngộ',
    'Chúng tôi tin rằng nhân viên hạnh phúc sẽ làm việc hiệu quả hơn',
    TRUE
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO benefits_id_val;

  IF benefits_id_val IS NOT NULL THEN
    INSERT INTO career_benefits_items (benefits_id, icon_name, title, description, gradient, sort_order, is_active)
    VALUES
      (benefits_id_val, 'DollarSign', 'Lương thưởng hấp dẫn', 'Mức lương cạnh tranh top đầu thị trường, thưởng theo hiệu quả công việc', 'from-emerald-500 to-teal-500', 1, TRUE),
      (benefits_id_val, 'TrendingUp', 'Thăng tiến rõ ràng', 'Lộ trình phát triển sự nghiệp minh bạch, đánh giá định kỳ 6 tháng', 'from-[#006FB3] to-[#0088D9]', 2, TRUE),
      (benefits_id_val, 'Coffee', 'Môi trường năng động', 'Văn hóa startup, không gian làm việc hiện đại, team building định kỳ', 'from-orange-500 to-amber-500', 3, TRUE),
      (benefits_id_val, 'Heart', 'Chăm sóc sức khỏe', 'Bảo hiểm sức khỏe toàn diện, khám sức khỏe định kỳ, gym membership', 'from-rose-500 to-pink-500', 4, TRUE),
      (benefits_id_val, 'Rocket', 'Công nghệ tiên tiến', 'Làm việc với tech stack mới nhất, tham gia dự án quốc tế', 'from-purple-500 to-pink-500', 5, TRUE),
      (benefits_id_val, 'Award', 'Đào tạo & phát triển', 'Ngân sách training unlimited, hỗ trợ certification & conference', 'from-indigo-500 to-purple-500', 6, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Career Positions
  INSERT INTO career_positions (header_title, header_description, is_active)
  VALUES (
    'Vị trí đang tuyển',
    'Tìm vị trí phù hợp với bạn và ứng tuyển ngay hôm nay',
    TRUE
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO positions_id_val;

  IF positions_id_val IS NOT NULL THEN
    INSERT INTO career_positions_items (positions_id, title, department, type, location, salary, experience, description, skills, gradient, sort_order, is_active)
    VALUES
      (positions_id_val, 'Senior Full-stack Developer', 'Engineering', 'Full-time', 'TP. HCM', '2000 - 3500 USD', '4+ years', 'Phát triển và maintain các hệ thống enterprise cho khách hàng lớn. Lead team 3-5 developers.', '["React", "Node.js", "AWS", "MongoDB"]'::jsonb, 'from-[#006FB3] to-[#0088D9]', 1, TRUE),
      (positions_id_val, 'Mobile Developer (Flutter)', 'Engineering', 'Full-time', 'TP. HCM / Remote', '1500 - 2500 USD', '2+ years', 'Xây dựng mobile app cho các lĩnh vực fintech, e-commerce, healthcare.', '["Flutter", "Dart", "Firebase", "RESTful API"]'::jsonb, 'from-purple-500 to-pink-500', 2, TRUE),
      (positions_id_val, 'DevOps Engineer', 'Infrastructure', 'Full-time', 'TP. HCM', '1800 - 3000 USD', '3+ years', 'Quản lý infrastructure, CI/CD pipeline, monitoring và scaling hệ thống.', '["AWS", "Kubernetes", "Docker", "Terraform"]'::jsonb, 'from-emerald-500 to-teal-500', 3, TRUE),
      (positions_id_val, 'UI/UX Designer', 'Design', 'Full-time', 'TP. HCM', '1200 - 2000 USD', '2+ years', 'Thiết kế giao diện và trải nghiệm người dùng cho web/mobile app.', '["Figma", "Adobe XD", "Prototyping", "User Research"]'::jsonb, 'from-orange-500 to-amber-500', 4, TRUE),
      (positions_id_val, 'Data Engineer', 'Data', 'Full-time', 'TP. HCM', '2000 - 3200 USD', '3+ years', 'Xây dựng data pipeline, ETL và data warehouse cho dự án Big Data.', '["Python", "Spark", "Airflow", "SQL"]'::jsonb, 'from-indigo-500 to-purple-500', 5, TRUE),
      (positions_id_val, 'QA Automation Engineer', 'Quality Assurance', 'Full-time', 'TP. HCM / Remote', '1000 - 1800 USD', '2+ years', 'Phát triển automation test, đảm bảo chất lượng sản phẩm.', '["Selenium", "Jest", "Cypress", "CI/CD"]'::jsonb, 'from-rose-500 to-pink-500', 6, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Career CTA
  INSERT INTO career_cta (title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_gradient, is_active)
  VALUES (
    'Không tìm thấy vị trí phù hợp?',
    'Gửi CV cho chúng tôi! Chúng tôi luôn tìm kiếm những tài năng xuất sắc',
    'Gửi CV qua email',
    'mailto:careers@sfb.vn',
    'Liên hệ HR',
    '/contact',
    'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
    TRUE
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO cta_id_val;
END $$;

-- Thêm permission cho careers
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('careers.manage', 'Quản lý trang Tuyển dụng', 'careers', 'Quản lý toàn bộ nội dung trang Tuyển dụng', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền careers cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code = 'careers.manage'
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;