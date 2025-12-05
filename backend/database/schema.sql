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
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
  author, read_time, gradient, published_date,
  seo_title, seo_description, seo_keywords
)
VALUES
  ('SFB ra mắt nền tảng Cloud thế hệ mới', 'sfb-cloud-gen-2', 'Nâng cấp hiệu năng và bảo mật cho doanh nghiệp', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'published', NULL, 'SFB Technology', '5 phút đọc', 'from-blue-600 to-cyan-600', CURRENT_DATE - INTERVAL '1 day', 'SFB Cloud thế hệ mới', 'Hiệu năng và bảo mật vượt trội cho doanh nghiệp', 'sfb cloud, hiệu năng, bảo mật'),
  ('Ký kết hợp tác chuyển đổi số với đối tác A', 'chuyen-doi-so-doi-tac-a', 'Hợp tác chiến lược nâng cao năng lực số', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'approved', NULL, 'SFB Technology', '4 phút đọc', 'from-indigo-600 to-purple-600', CURRENT_DATE - INTERVAL '2 day', 'Hợp tác chuyển đổi số', 'Đối tác A cùng SFB chuyển đổi số', 'chuyển đổi số, hợp tác, đối tác A'),
  ('Hướng dẫn triển khai CRM hiệu quả', 'huong-dan-trien-khai-crm', 'Các bước triển khai hệ thống CRM cho SME', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'draft', NULL, 'SFB Technology', '6 phút đọc', 'from-emerald-600 to-teal-600', CURRENT_DATE, 'Triển khai CRM hiệu quả', 'Hướng dẫn các bước triển khai CRM cho SME', 'crm, hướng dẫn, sme'),
  ('Cập nhật bảo mật quý này', 'cap-nhat-bao-mat-q1', 'Tổng hợp bản vá và khuyến nghị bảo mật', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'pending', NULL, 'Security Team', '3 phút đọc', 'from-red-600 to-rose-600', CURRENT_DATE - INTERVAL '5 day', 'Cập nhật bảo mật', 'Bản vá và khuyến nghị bảo mật mới nhất', 'bảo mật, patch, khuyến nghị'),
  ('Case study: Thành công với SFB Cloud', 'case-study-sfb-cloud', 'Khách hàng tăng 40% hiệu suất vận hành', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'published', NULL, 'SFB Technology', '7 phút đọc', 'from-orange-600 to-amber-600', CURRENT_DATE - INTERVAL '7 day', 'Case study SFB Cloud', 'Tăng 40% hiệu suất vận hành với SFB Cloud', 'case study, sfb cloud, hiệu suất'),
  ('Checklist go-live hệ thống mới', 'checklist-go-live', 'Những việc cần làm trước khi go-live', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'draft', NULL, 'SFB Technology', '4 phút đọc', 'from-blue-600 to-cyan-600', CURRENT_DATE - INTERVAL '3 day', 'Checklist go-live', 'Chuẩn bị go-live hệ thống mới', 'go-live, checklist, triển khai'),
  ('Roadmap sản phẩm 2025', 'roadmap-san-pham-2025', 'Các mốc phát hành tính năng chính', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'approved', NULL, 'Product Team', '5 phút đọc', 'from-purple-600 to-pink-600', CURRENT_DATE - INTERVAL '10 day', 'Roadmap sản phẩm 2025', 'Các mốc phát hành chính năm 2025', 'roadmap, sản phẩm, 2025'),
  ('Tối ưu chi phí hạ tầng', 'toi-uu-chi-phi-ha-tang', 'Kinh nghiệm giảm 25% chi phí cloud', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'published', NULL, 'FinOps Team', '6 phút đọc', 'from-emerald-600 to-teal-600', CURRENT_DATE - INTERVAL '4 day', 'Tối ưu chi phí cloud', 'Giảm 25% chi phí hạ tầng cloud', 'finops, chi phí, cloud'),
  ('Best practices bảo mật API', 'best-practices-bao-mat-api', 'Hướng dẫn bảo vệ API an toàn', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'rejected', NULL, 'Security Team', '8 phút đọc', 'from-indigo-600 to-purple-600', CURRENT_DATE - INTERVAL '8 day', 'Best practices API security', 'Hướng dẫn bảo mật API an toàn', 'api security, best practices'),
  ('Template SEO cho bài viết', 'template-seo-bai-viet', 'Mẫu cấu trúc SEO hiệu quả cho content', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'published', NULL, 'Content Team', '5 phút đọc', 'from-cyan-600 to-blue-600', CURRENT_DATE - INTERVAL '6 day', 'Template SEO', 'Mẫu cấu trúc SEO hiệu quả', 'seo, template, content')
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
  ('settings.manage', 'Quản lý cấu hình hệ thống', 'settings', 'Thay đổi các cấu hình quản trị', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán toàn bộ quyền cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON 1 = 1
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Gán quyền mặc định cho các role khác (editor, user)
-- Biên tập viên: quản lý nội dung (tin tức, danh mục) + xem dashboard
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'dashboard.view',
  'news.view',
  'news.manage',
  'categories.view',
  'categories.manage'
)
WHERE r.code = 'editor'
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
