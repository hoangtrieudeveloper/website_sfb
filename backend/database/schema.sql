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
  ('Hệ thống tuyển sinh đầu cấp', 'he-thong-tuyen-sinh-dau-cap', 'Giải pháp phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.', '<p><strong>1. Phần mềm tuyển sinh đầu cấp đối với nhà trường</strong></p><p>Là phần mềm được phát triển để phục vụ công tác tuyển sinh của trường học, đồng thời là công cụ để kết nối phụ huynh và nhà trường một cách chặt chẽ hơn. Các tiện ích khi sử dụng phần mềm:</p><ul><li>Tổ chức tuyển sinh đúng quy chế, đảm bảo tính chính xác, công bằng, khách quan.</li><li>Đảm bảo tiến độ tuyển sinh, hướng dẫn tuyển sinh đầy đủ, rõ ràng, công khai tạo thuận lợi cho học sinh và cha mẹ học sinh.</li><li>Quản lý chính xác số trẻ theo từng độ tuổi trên địa bàn, phân tuyến và giao chỉ tiêu tránh tình trạng quá tải ở các trường.</li><li>Góp phần nâng cao chất lượng giáo dục toàn diện ở các cấp học</li></ul><p><strong>2. Phần mềm tuyển sinh đầu cấp đối với phụ huynh</strong></p><ul><li>Phụ huynh có thể thực hiện đăng ký cho con em trên các thiết bị thông minh có thể truy cập internet.</li><li>Có thể tra cứu các thông tin học sinh, thông tin kỳ tuyển sinh, kết quả khi đăng ký.</li><li>Hệ thống hỗ trợ hướng dẫn sử dụng cụ thể, rõ ràng theo từng bước thực hiện<ul><li>Dễ dàng thực hiện</li><li>Đăng ký mọi lúc mọi nơi không cần đến trực tiếp nhà trường</li></ul></li></ul><p><strong>I. CÁC CHỨC NĂNG CHÍNH</strong></p><p>01. Chức năng quản lý thông tin kỳ tuyển sinh cho phép cán bộ quản lý thêm mới các kỳ theo năm học, cập nhật thông tin cơ bản của kỳ tuyển sinh như: địa bàn, năm sinh, thời gian trực tuyến, trực tiếp, điều kiện phân tuyến chỉ tiêu.</p><div class="not-prose my-4"><img src="/images/news/news5.png" alt="Bảng quản lý thông tin kỳ tuyển sinh" class="w-full h-auto rounded-xl border border-gray-200" /></div><p>02. Chức năng quản lý thông tin đăng ký trái tuyến cho phép theo dõi, phê duyệt chỉ tiêu học sinh đăng ký trái tuyến, từ đó theo dõi được số lượng chỉ tiêu, tránh thừa thiếu trên địa bàn</p><div class="not-prose my-4"><img src="/images/news/news6.png" alt="Bảng quản lý đăng ký trái tuyến" class="w-full h-auto rounded-xl border border-gray-200" /></div>', 'Sản phẩm & giải pháp', 'product', 'published', '/uploads/news/news1.png', 'SFB Technology', '10 phút đọc', 'from-blue-600 to-cyan-600', '2025-08-07', true, 'Hệ thống tuyển sinh đầu cấp', 'Giải pháp phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh', 'tuyển sinh, giáo dục, phần mềm'),
  ('SFB ra mắt nền tảng Cloud thế hệ mới', 'sfb-cloud-gen-2', 'Nâng cấp hiệu năng và bảo mật cho doanh nghiệp', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'published', '/uploads/news/news2.png', 'SFB Technology', '5 phút đọc', 'from-blue-600 to-cyan-600', CURRENT_DATE - INTERVAL '1 day', false, 'SFB Cloud thế hệ mới', 'Hiệu năng và bảo mật vượt trội cho doanh nghiệp', 'sfb cloud, hiệu năng, bảo mật'),
  ('Ký kết hợp tác chuyển đổi số với đối tác A', 'chuyen-doi-so-doi-tac-a', 'Hợp tác chiến lược nâng cao năng lực số', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'approved', '/uploads/news/news3.png', 'SFB Technology', '4 phút đọc', 'from-indigo-600 to-purple-600', CURRENT_DATE - INTERVAL '2 day', false, 'Hợp tác chuyển đổi số', 'Đối tác A cùng SFB chuyển đổi số', 'chuyển đổi số, hợp tác, đối tác A'),
  ('Hướng dẫn triển khai CRM hiệu quả', 'huong-dan-trien-khai-crm', 'Các bước triển khai hệ thống CRM cho SME', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'draft', '/uploads/news/news1.png', 'SFB Technology', '6 phút đọc', 'from-emerald-600 to-teal-600', CURRENT_DATE, false, 'Triển khai CRM hiệu quả', 'Hướng dẫn các bước triển khai CRM cho SME', 'crm, hướng dẫn, sme'),
  ('Cập nhật bảo mật quý này', 'cap-nhat-bao-mat-q1', 'Tổng hợp bản vá và khuyến nghị bảo mật', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'pending', '/uploads/news/news2.png', 'Security Team', '3 phút đọc', 'from-red-600 to-rose-600', CURRENT_DATE - INTERVAL '5 day', false, 'Cập nhật bảo mật', 'Bản vá và khuyến nghị bảo mật mới nhất', 'bảo mật, patch, khuyến nghị'),
  ('Case study: Thành công với SFB Cloud', 'case-study-sfb-cloud', 'Khách hàng tăng 40% hiệu suất vận hành', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'published', '/uploads/news/news3.png', 'SFB Technology', '7 phút đọc', 'from-orange-600 to-amber-600', CURRENT_DATE - INTERVAL '7 day', false, 'Case study SFB Cloud', 'Tăng 40% hiệu suất vận hành với SFB Cloud', 'case study, sfb cloud, hiệu suất'),
  ('Checklist go-live hệ thống mới', 'checklist-go-live', 'Những việc cần làm trước khi go-live', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'draft', '/uploads/news/news1.png', 'SFB Technology', '4 phút đọc', 'from-blue-600 to-cyan-600', CURRENT_DATE - INTERVAL '3 day', false, 'Checklist go-live', 'Chuẩn bị go-live hệ thống mới', 'go-live, checklist, triển khai'),
  ('Roadmap sản phẩm 2025', 'roadmap-san-pham-2025', 'Các mốc phát hành tính năng chính', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'approved', '/uploads/news/news2.png', 'Product Team', '5 phút đọc', 'from-purple-600 to-pink-600', CURRENT_DATE - INTERVAL '10 day', false, 'Roadmap sản phẩm 2025', 'Các mốc phát hành chính năm 2025', 'roadmap, sản phẩm, 2025'),
  ('Tối ưu chi phí hạ tầng', 'toi-uu-chi-phi-ha-tang', 'Kinh nghiệm giảm 25% chi phí cloud', '<p>Nội dung demo...</p>', 'Kinh doanh', 'company', 'published', '/uploads/news/news3.png', 'FinOps Team', '6 phút đọc', 'from-emerald-600 to-teal-600', CURRENT_DATE - INTERVAL '4 day', false, 'Tối ưu chi phí cloud', 'Giảm 25% chi phí hạ tầng cloud', 'finops, chi phí, cloud'),
  ('Best practices bảo mật API', 'best-practices-bao-mat-api', 'Hướng dẫn bảo vệ API an toàn', '<p>Nội dung demo...</p>', 'Công nghệ', 'tech', 'rejected', '/uploads/news/news1.png', 'Security Team', '8 phút đọc', 'from-indigo-600 to-purple-600', CURRENT_DATE - INTERVAL '8 day', false, 'Best practices API security', 'Hướng dẫn bảo mật API an toàn', 'api security, best practices'),
  ('Template SEO cho bài viết', 'template-seo-bai-viet', 'Mẫu cấu trúc SEO hiệu quả cho content', '<p>Nội dung demo...</p>', 'Hướng dẫn', 'product', 'published', '/uploads/news/news2.png', 'Content Team', '5 phút đọc', 'from-cyan-600 to-blue-600', CURRENT_DATE - INTERVAL '6 day', false, 'Template SEO', 'Mẫu cấu trúc SEO hiệu quả', 'seo, template, content')
ON CONFLICT (slug) DO NOTHING;

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
  features JSONB DEFAULT '[]'::jsonb,          -- Mảng các tính năng (tối ưu từ product_features)
  demo_link VARCHAR(500),                      -- Link đến trang demo của sản phẩm
  seo_title VARCHAR(255),                      -- Tiêu đề SEO
  seo_description TEXT,                        -- Mô tả SEO
  seo_keywords TEXT,                           -- Từ khóa SEO
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
CREATE INDEX IF NOT EXISTS idx_products_features_gin ON products USING GIN (features);
CREATE INDEX IF NOT EXISTS idx_products_seo_title ON products(seo_title);

-- Trigger cập nhật updated_at cho products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DEPRECATED TABLES - Đã được gộp vào bảng optimized
-- Các bảng sau đã được gộp và không còn sử dụng:
-- - product_features -> products.features (JSONB)
-- - product_page_hero -> products_sections (section_type: 'hero')
-- - product_list_header -> products_sections (section_type: 'list-header')
-- - product_benefits -> products_section_items (section_type: 'benefits')
-- Các bảng này sẽ tự động được xóa khi chạy npm run setup
-- ============================================================================

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

-- ==================== PRODUCTS MODULE (OPTIMIZED) ====================

-- Bảng products_sections (Gộp product_page_hero, product_list_header, product_benefits)
-- section_type: 'hero', 'list-header', 'benefits'
-- data: JSONB chứa tất cả các field riêng của từng section
CREATE TABLE IF NOT EXISTS products_sections (
  id SERIAL PRIMARY KEY,
  section_type VARCHAR(50) NOT NULL UNIQUE,
  data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sections_type ON products_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_products_sections_active ON products_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sections_data_gin ON products_sections USING GIN (data);

DROP TRIGGER IF EXISTS update_products_sections_updated_at ON products_sections;
CREATE TRIGGER update_products_sections_updated_at
    BEFORE UPDATE ON products_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng products_section_items (Gộp product_overview_cards, product_showcase_bullets, product_numbered_sections, product_section_paragraphs, product_expand_bullets)
-- section_id: FK đến products_sections (cho benefits) hoặc product_details (cho detail items)
-- section_type: 'benefits', 'overview-cards', 'showcase-bullets', 'numbered-sections', 'expand-bullets', 'section-paragraphs'
-- parent_id: ID của parent (product_detail_id cho detail items, hoặc section_id cho benefits)
-- data: JSONB chứa tất cả các field riêng của từng item type
CREATE TABLE IF NOT EXISTS products_section_items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES products_sections(id) ON DELETE CASCADE,
  product_detail_id INTEGER REFERENCES product_details(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT products_section_items_parent_check CHECK (
    (section_id IS NOT NULL AND product_detail_id IS NULL) OR
    (section_id IS NULL AND product_detail_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_products_section_items_section ON products_section_items(section_id);
CREATE INDEX IF NOT EXISTS idx_products_section_items_detail ON products_section_items(product_detail_id);
CREATE INDEX IF NOT EXISTS idx_products_section_items_type ON products_section_items(section_type);
CREATE INDEX IF NOT EXISTS idx_products_section_items_sort ON products_section_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_section_items_active ON products_section_items(is_active);
CREATE INDEX IF NOT EXISTS idx_products_section_items_data_gin ON products_section_items USING GIN (data);

DROP TRIGGER IF EXISTS update_products_section_items_updated_at ON products_section_items;
CREATE TRIGGER update_products_section_items_updated_at
    BEFORE UPDATE ON products_section_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed data cho product_categories
INSERT INTO product_categories (slug, name, icon_name, sort_order, is_active)
VALUES
  ('all', 'Tất cả sản phẩm', 'Package', 0, TRUE),
  ('edu', 'Giải pháp Giáo dục', 'Cloud', 1, TRUE),
  ('justice', 'Công chứng – Pháp lý', 'Shield', 2, TRUE),
  ('gov', 'Quản lý Nhà nước/Doanh nghiệp', 'TrendingUp', 3, TRUE),
  ('kpi', 'Quản lý KPI cá nhân', 'Cpu', 4, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Seed dữ liệu mẫu cho Products (Optimized)
DO $$
DECLARE
  hero_id_val INTEGER;
  list_header_id_val INTEGER;
  benefits_id_val INTEGER;
BEGIN
  -- Products Hero
  INSERT INTO products_sections (section_type, data, is_active)
  VALUES (
    'hero',
    '{
      "title": "Bộ giải pháp phần mềm",
      "subtitle": "Phục vụ Giáo dục, Công chứng & Doanh nghiệp",
      "description": "Các sản phẩm SFB được xây dựng từ bài toán thực tế của cơ quan Nhà nước, nhà trường và doanh nghiệp, giúp tối ưu quy trình và nâng cao hiệu quả quản lý.",
      "primaryCtaText": "Xem danh sách sản phẩm",
      "primaryCtaLink": "#products",
      "secondaryCtaText": "Tư vấn giải pháp",
      "secondaryCtaLink": "/contact",
      "stat1Label": "Giải pháp phần mềm",
      "stat1Value": "+32.000",
      "stat2Label": "Đơn vị triển khai thực tế",
      "stat2Value": "+6.000",
      "stat3Label": "Mức độ hài lòng trung bình",
      "stat3Value": "4.9★",
      "backgroundGradient": "linear-gradient(to bottom right, #0870B4, #2EABE2)"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO hero_id_val;

  -- Products List Header
  INSERT INTO products_sections (section_type, data, is_active)
  VALUES (
    'list-header',
    '{
      "subtitle": "GIẢI PHÁP CHUYÊN NGHIỆP",
      "title": "Sản phẩm & giải pháp nổi bật",
      "description": "Danh sách các hệ thống phần mềm đang được SFB triển khai cho nhà trường, cơ quan Nhà nước và doanh nghiệp."
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO list_header_id_val;

  -- Products Benefits Section
  INSERT INTO products_sections (section_type, data, is_active)
  VALUES (
    'benefits',
    '{}'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO benefits_id_val;

  -- Benefits Items
  IF benefits_id_val IS NOT NULL THEN
    INSERT INTO products_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (benefits_id_val, 'benefits', '{"icon": "/icons/custom/product1.svg", "title": "Bảo mật cao", "description": "Tuân thủ chuẩn bảo mật, mã hóa dữ liệu end-to-end.", "gradient": "from-[#006FB3] to-[#0088D9]"}'::jsonb, 0, TRUE),
      (benefits_id_val, 'benefits', '{"icon": "/icons/custom/product2.svg", "title": "Hiệu năng ổn định", "description": "Hệ thống tối ưu, uptime cao, đáp ứng nhu cầu vận hành.", "gradient": "from-[#FF81C2] to-[#667EEA]"}'::jsonb, 1, TRUE),
      (benefits_id_val, 'benefits', '{"icon": "/icons/custom/product3.svg", "title": "Dễ triển khai & sử dụng", "description": "Giao diện trực quan, đào tạo & hỗ trợ cho người dùng.", "gradient": "from-[#2AF598] to-[#009EFD]"}'::jsonb, 2, TRUE),
      (benefits_id_val, 'benefits', '{"icon": "/icons/custom/product4.svg", "title": "Sẵn sàng mở rộng", "description": "Kiến trúc linh hoạt, dễ tích hợp và mở rộng về sau.", "gradient": "from-[#FA709A] to-[#FEE140]"}'::jsonb, 3, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Products CTA Section
  INSERT INTO products_sections (section_type, data, is_active)
  VALUES (
    'cta',
    '{
      "title": "Miễn phí tư vấn",
      "description": "Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số.",
      "primaryButtonText": "Tư vấn miễn phí ngay",
      "primaryButtonLink": "/contact",
      "secondaryButtonText": "Xem case studies",
      "secondaryButtonLink": "/solutions",
      "backgroundColor": "#29A3DD"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING;
END $$;

-- Seed dữ liệu mẫu cho Products (danh sách sản phẩm)
DO $$
DECLARE
  edu_cat_id INTEGER;
  justice_cat_id INTEGER;
  gov_cat_id INTEGER;
  kpi_cat_id INTEGER;
  product1_id INTEGER;
BEGIN
  -- Lấy category IDs
  SELECT id INTO edu_cat_id FROM product_categories WHERE slug = 'edu' LIMIT 1;
  SELECT id INTO justice_cat_id FROM product_categories WHERE slug = 'justice' LIMIT 1;
  SELECT id INTO gov_cat_id FROM product_categories WHERE slug = 'gov' LIMIT 1;
  SELECT id INTO kpi_cat_id FROM product_categories WHERE slug = 'kpi' LIMIT 1;

  -- Product 1: Hệ thống tuyển sinh đầu cấp
  INSERT INTO products (
    category_id, slug, name, tagline, meta, description, image, gradient,
    pricing, badge, stats_users, stats_rating, stats_deploy, features,
    demo_link, sort_order, is_featured, is_active
  )
  VALUES (
    edu_cat_id,
    'he-thong-tuyen-sinh-dau-cap',
    'Hệ thống tuyển sinh đầu cấp',
    'Tuyển sinh trực tuyến minh bạch, đúng quy chế',
    'Sản phẩm • Tin công nghệ • 07/08/2025',
    'Phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.',
    'https://sfb.vn/wp-content/uploads/2025/08/HDD-404x269.png',
    'from-[#006FB3] to-[#0088D9]',
    'Liên hệ',
    'Giải pháp nổi bật',
    'Nhiều trường học áp dụng',
    4.8,
    'Triển khai Cloud/On-premise',
    '["Đăng ký tuyển sinh trực tuyến cho phụ huynh", "Tích hợp quy chế tuyển sinh của Bộ/Ngành", "Tự động lọc, duyệt hồ sơ theo tiêu chí", "Tra cứu kết quả tuyển sinh online", "Báo cáo thống kê theo lớp, khối, khu vực", "Kết nối chặt chẽ giữa phụ huynh và nhà trường"]'::jsonb,
    '/demo',
    1,
    TRUE,
    TRUE
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product1_id;

  -- Product 2: Báo giá sản phẩm – hệ thống Giáo dục thông minh
  INSERT INTO products (
    category_id, slug, name, tagline, meta, description, image, gradient,
    pricing, badge, stats_users, stats_rating, stats_deploy, features,
    sort_order, is_featured, is_active
  )
  VALUES (
    edu_cat_id,
    'bao-gia-san-pham-he-thong-giao-duc-thong-minh',
    'Báo giá sản phẩm – hệ thống Giáo dục thông minh',
    'Hệ sinh thái giáo dục số cho nhà trường',
    'Sản phẩm • Tin công nghệ • 08/12/2023',
    'Gói sản phẩm và dịch vụ cho hệ thống Giáo dục thông minh của SFB, giúp nhà trường số hóa toàn bộ hoạt động quản lý, giảng dạy và tương tác với phụ huynh, học sinh.',
    'https://sfb.vn/wp-content/uploads/2023/12/Daiien-512x341.png',
    'from-purple-600 to-pink-600',
    'Theo gói triển khai',
    'Giải pháp giáo dục',
    'Nhiều cơ sở giáo dục triển khai',
    4.9,
    'Mô hình Cloud',
    '["Quản lý hồ sơ học sinh – giáo viên", "Quản lý học tập, điểm số, thời khóa biểu", "Cổng thông tin điện tử cho phụ huynh & học sinh", "Học bạ điện tử và sổ liên lạc điện tử", "Tích hợp học trực tuyến, bài tập online", "Báo cáo, thống kê theo năm học/kỳ học"]'::jsonb,
    2,
    TRUE,
    TRUE
  )
  ON CONFLICT (slug) DO NOTHING;

  -- Product 3: Hệ thống CSDL quản lý công chứng, chứng thực
  INSERT INTO products (
    category_id, slug, name, tagline, meta, description, image, gradient,
    pricing, badge, stats_users, stats_rating, stats_deploy, features,
    sort_order, is_featured, is_active
  )
  VALUES (
    justice_cat_id,
    'he-thong-csdl-quan-ly-cong-chung-chung-thuc',
    'Hệ thống CSDL quản lý công chứng, chứng thực',
    'Cơ sở dữ liệu công chứng tập trung, an toàn',
    'Sản phẩm • Tin công nghệ • 16/09/2023',
    'Giải pháp quản lý cơ sở dữ liệu công chứng, chứng thực tập trung, giúp giảm rủi ro trong các giao dịch, hỗ trợ nghiệp vụ cho các tổ chức hành nghề công chứng.',
    'https://sfb.vn/wp-content/uploads/2023/09/C3T-318x212.png',
    'from-orange-600 to-amber-600',
    'Liên hệ',
    'Cho lĩnh vực công chứng',
    'Phòng công chứng, VP công chứng',
    4.8,
    'Triển khai toàn tỉnh/thành',
    '["Lưu trữ tập trung hợp đồng công chứng, chứng thực", "Tra cứu nhanh lịch sử giao dịch theo nhiều tiêu chí", "Cảnh báo trùng lặp, rủi ro trong giao dịch", "Phân quyền chi tiết theo vai trò nghiệp vụ", "Tích hợp chữ ký số và chứng thư số", "Báo cáo thống kê, hỗ trợ thanh tra, kiểm tra"]'::jsonb,
    3,
    TRUE,
    TRUE
  )
  ON CONFLICT (slug) DO NOTHING;

  -- Product 4: Phần mềm quản lý Đại học – Học viện – Cao đẳng
  INSERT INTO products (
    category_id, slug, name, tagline, meta, description, image, gradient,
    pricing, badge, stats_users, stats_rating, stats_deploy, features,
    sort_order, is_featured, is_active
  )
  VALUES (
    edu_cat_id,
    'phan-mem-quan-ly-dai-hoc-hoc-vien-cao-dang',
    'Phần mềm quản lý Đại học – Học viện – Cao đẳng',
    'Giải pháp quản lý tổng thể cơ sở đào tạo',
    'Sản phẩm • 01/11/2022',
    'Giải pháp quản lý tổng thể dành cho các trường Đại học, Học viện, Cao đẳng, hỗ trợ quản lý đào tạo, sinh viên, chương trình học và chất lượng đào tạo.',
    'https://sfb.vn/wp-content/uploads/2022/11/BG-768x512.png',
    'from-emerald-600 to-teal-600',
    'Theo quy mô trường',
    'Giải pháp tổng thể',
    'Phù hợp ĐH, HV, CĐ',
    4.7,
    'Cloud/On-premise',
    '["Quản lý tuyển sinh, hồ sơ sinh viên", "Quản lý chương trình đào tạo, tín chỉ, lớp học", "Quản lý giảng viên, phân công giảng dạy", "Cổng thông tin cho sinh viên & giảng viên", "Quản lý học phí, công nợ, học bổng", "Báo cáo theo chuẩn Bộ/Ngành"]'::jsonb,
    4,
    TRUE,
    TRUE
  )
  ON CONFLICT (slug) DO NOTHING;

  -- Product 5: Hệ thống thông tin quản lý, giám sát doanh nghiệp
  INSERT INTO products (
    category_id, slug, name, tagline, meta, description, image, gradient,
    pricing, badge, stats_users, stats_rating, stats_deploy, features,
    sort_order, is_featured, is_active
  )
  VALUES (
    gov_cat_id,
    'he-thong-thong-tin-quan-ly-giam-sat-doanh-nghiep',
    'Hệ thống thông tin quản lý, giám sát doanh nghiệp',
    'Giám sát doanh nghiệp Nhà nước hiệu quả',
    'Sản phẩm • 16/01/2021',
    'Hệ thống thông tin quản lý, giám sát Nhà nước tại doanh nghiệp, hỗ trợ cơ quan quản lý nắm bắt tình hình hoạt động và chỉ tiêu của doanh nghiệp một cách chi tiết.',
    'https://sfb.vn/wp-content/uploads/2021/01/btc-255x170.png',
    'from-indigo-600 to-purple-600',
    'Thiết kế theo bài toán',
    NULL,
    'Cơ quan quản lý Nhà nước',
    4.8,
    'Triển khai tập trung',
    '["Quản lý hồ sơ, thông tin doanh nghiệp", "Theo dõi tình hình tài chính và sản xuất kinh doanh", "Bộ chỉ tiêu báo cáo chuẩn hóa", "Cảnh báo sớm các rủi ro, vi phạm", "Dashboard giám sát trực quan theo ngành/lĩnh vực", "Kết nối, chia sẻ dữ liệu với hệ thống khác"]'::jsonb,
    5,
    FALSE,
    TRUE
  )
  ON CONFLICT (slug) DO NOTHING;

  -- Product 6: Hệ thống quản lý KPI cá nhân (BSC/KPIs)
  INSERT INTO products (
    category_id, slug, name, tagline, meta, description, image, gradient,
    pricing, badge, stats_users, stats_rating, stats_deploy, features,
    sort_order, is_featured, is_active
  )
  VALUES (
    kpi_cat_id,
    'he-thong-quan-ly-kpi-ca-nhan-bsc-kpis',
    'Hệ thống quản lý KPI cá nhân (BSC/KPIs)',
    'Quản trị hiệu suất cá nhân & tổ chức',
    'Sản phẩm • 16/01/2021',
    'Hệ thống quản lý BSC/KPIs cá nhân giúp thiết kế bảng điểm cân bằng và hệ thống chỉ tiêu KPI, hỗ trợ đo lường và đánh giá hiệu quả công việc.',
    'https://sfb.vn/wp-content/uploads/2021/02/Skpi-red-768x512.png',
    'from-red-600 to-rose-600',
    'Tùy theo số lượng user',
    'Tập trung KPI',
    'Doanh nghiệp mọi quy mô',
    4.7,
    'Cloud/On-premise',
    '["Thiết kế BSC và hệ thống chỉ tiêu KPI", "Giao KPI theo cá nhân, phòng ban, đơn vị", "Theo dõi tiến độ, kết quả thực hiện theo kỳ", "Tự động tính điểm và xếp loại", "Kết nối với hệ thống lương thưởng, đánh giá", "Báo cáo phân tích hiệu suất đa chiều"]'::jsonb,
    6,
    TRUE,
    TRUE
  )
  ON CONFLICT (slug) DO NOTHING;

  -- Seed Product Detail cho Product 1 (Hệ thống tuyển sinh đầu cấp)
  IF product1_id IS NOT NULL THEN
    INSERT INTO product_details (
      product_id, slug,
      meta_top, hero_description, hero_image,
      cta_contact_text, cta_contact_href, cta_demo_text, cta_demo_href,
      overview_kicker, overview_title,
      showcase_title, showcase_desc, showcase_cta_text, showcase_cta_href,
      showcase_image_back, showcase_image_front,
      expand_title, expand_cta_text, expand_cta_href, expand_image
    )
    VALUES (
      product1_id,
      'he-thong-tuyen-sinh-dau-cap',
      'TÀI LIỆU GIỚI THIỆU PHẦN MỀM',
      'Phần mềm tuyển sinh đầu cấp là giải pháp giúp nhà trường quản lý tập trung thông tin học sinh và hoạt động lớp học. Phần mềm hỗ trợ các chức năng chính như quản lý hồ sơ học sinh, quản lý nhân sự, quản lý sổ sách, điểm danh và theo dõi đánh giá trẻ. Qua đó, giáo viên dễ dàng cập nhật tình hình học tập, rèn luyện của học sinh, nhà trường nâng cao hiệu quả quản lý, giảm sổ sách thủ công và đảm bảo thông tin chính xác.',
      '/images/product_detail/heroproductdetail.png',
      'LIÊN HỆ NGAY',
      '/contact',
      'DEMO HỆ THỐNG',
      '#demo',
      'SFB - HỒ SƠ HỌC SINH',
      'Tổng quan hệ thống',
      'Trang chủ hệ thống',
      'Trang chủ hệ thống hiển thị trực quan các biểu đồ thống kê theo kết quả học tập của lớp, khối để người dùng theo dõi tiến độ đánh giá, kết quả một cách nhanh và dễ dàng nhất.',
      'Liên hệ với chúng tôi',
      '/contact',
      '/images/product_detail/bieudocot.png',
      '/images/product_detail/bieudotron1.png',
      'Khả năng phát triển mở rộng',
      'Demo hệ thống',
      '#demo',
      '/images/products/tuyen-sinh-dau-cap/expand.png'
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO product1_id;

    -- Overview Cards
    IF product1_id IS NOT NULL THEN
      INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
      VALUES
        (product1_id, 'overview-cards', '{"step": 1, "title": "Quản lý thông tin", "description": "Người dùng có thể quản lý các thông tin như nhân sự, lớp học, học sinh."}'::jsonb, 0, TRUE),
        (product1_id, 'overview-cards', '{"step": 2, "title": "Nhập liệu", "description": "Chức năng cho phép giáo viên thực hiện nhập điểm và theo dõi học sinh."}'::jsonb, 1, TRUE),
        (product1_id, 'overview-cards', '{"step": 3, "title": "Tổng kết", "description": "Là chức năng tổng hợp kết quả học tập theo năm của toàn trường."}'::jsonb, 2, TRUE),
        (product1_id, 'overview-cards', '{"step": 4, "title": "Báo cáo", "description": "Cấp các chức năng báo cáo thống kê trên tất cả dữ liệu quản lý trong nhà trường."}'::jsonb, 3, TRUE),
        (product1_id, 'overview-cards', '{"step": 5, "title": "Sổ sách", "description": "Quản lý các loại sổ sách của giáo viên, học sinh theo các mẫu đang sử dụng hiện hành trong trường."}'::jsonb, 4, TRUE)
      ON CONFLICT DO NOTHING;

      -- Showcase Bullets
      INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
      VALUES
        (product1_id, 'showcase-bullets', '{"bullet_text": "Nắm bắt nhanh yêu cầu nghiệp vụ"}'::jsonb, 0, TRUE),
        (product1_id, 'showcase-bullets', '{"bullet_text": "Giải pháp \"fit\" quy trình, không one-size-fits-all"}'::jsonb, 1, TRUE)
      ON CONFLICT DO NOTHING;

      -- Numbered Sections
      INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
      VALUES
        (product1_id, 'numbered-sections', '{"section_no": 1, "title": "Quản lý thông tin nhân sự, học sinh, lớp học", "image": "/images/products/tuyen-sinh-dau-cap/section-1.png", "image_alt": "Section 1", "image_side": "right", "overlay_back_image": "/images/products/tuyen-sinh-dau-cap/section-1.png", "overlay_front_image": "/images/products/tuyen-sinh-dau-cap/section-1.png"}'::jsonb, 0, TRUE),
        (product1_id, 'numbered-sections', '{"section_no": 2, "title": "Chức năng nhập liệu", "image": "/images/products/tuyen-sinh-dau-cap/section-2.png", "image_alt": "Section 2", "image_side": "left"}'::jsonb, 1, TRUE),
        (product1_id, 'numbered-sections', '{"section_no": 4, "title": "Thống kê báo cáo", "image": "/images/products/tuyen-sinh-dau-cap/section-4.png", "image_alt": "Section 4", "image_side": "right", "overlay_back_image": "/images/products/tuyen-sinh-dau-cap/section-4.png", "overlay_front_image": "/images/products/tuyen-sinh-dau-cap/section-4.png"}'::jsonb, 2, TRUE),
        (product1_id, 'numbered-sections', '{"section_no": 5, "title": "Sổ sách", "image": "/images/products/tuyen-sinh-dau-cap/section-5.png", "image_alt": "Section 5", "image_side": "left", "overlay_back_image": "/images/products/tuyen-sinh-dau-cap/section-5.png", "overlay_front_image": "/images/products/tuyen-sinh-dau-cap/section-5.png"}'::jsonb, 3, TRUE)
      ON CONFLICT DO NOTHING;

      -- Section Paragraphs (cho numbered sections)
      -- Lấy ID của numbered sections vừa tạo và insert paragraphs
      -- Note: Paragraphs được lưu trong data JSONB với numbered_section_id reference
      -- Vì products_section_items không có parent_id cho paragraphs, ta lưu trực tiếp trong data
      -- Paragraphs cho section 1
      INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
      SELECT 
        product1_id,
        'section-paragraphs',
        jsonb_build_object('paragraph_text', paragraph_text, 'section_no', 1),
        sort_order,
        TRUE
      FROM (VALUES
        ('Người dùng có thể quản lý học sinh theo khối, lớp, khu vực, giới tính nhằm phục vụ công tác quản lý, tuyển sinh sau này hoặc công tác phân bổ học sinh, giáo viên trên địa bàn.', 0),
        ('Hệ thống cung cấp các tính năng trong việc phân chia lớp, xếp môn cho lớp. Việc phân môn chính xác giúp tính toán điểm và tổng kết đơn giản và dễ dàng hơn.', 1),
        ('Hệ thống quản lý tất cả thông tin của nhân sự theo từng trường, từng nhóm bộ môn. Dữ liệu quản lý có thể phục vụ cho việc thống kê, in báo cáo cho Ban giám hiệu nhà trường.', 2)
      ) AS t(paragraph_text, sort_order)
      WHERE product1_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Paragraphs cho section 2
      INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
      SELECT 
        product1_id,
        'section-paragraphs',
        jsonb_build_object('paragraph_text', paragraph_text, 'section_no', 2),
        sort_order,
        TRUE
      FROM (VALUES
        ('Hệ thống căn cứ trên các thông tư được ban hành để xây dựng nên sổ dữ liệu tính điểm cho trường.', 0),
        ('Thiết kế giao diện đơn giản cùng các tiện ích tìm kiếm phục vụ cho công tác tính điểm của giáo viên và công tác quản lý của ban giám hiệu nhà trường.', 1)
      ) AS t(paragraph_text, sort_order)
      WHERE product1_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Paragraphs cho section 4
      INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
      SELECT 
        product1_id,
        'section-paragraphs',
        jsonb_build_object('paragraph_text', paragraph_text, 'section_no', 4),
        sort_order,
        TRUE
      FROM (VALUES
        ('Phần mềm cung cấp các chức năng báo cáo thống kê trên tất cả dữ liệu quản lý trong nhà trường.', 0)
      ) AS t(paragraph_text, sort_order)
      WHERE product1_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Paragraphs cho section 5
      INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
      SELECT 
        product1_id,
        'section-paragraphs',
        jsonb_build_object('paragraph_text', paragraph_text, 'section_no', 5),
        sort_order,
        TRUE
      FROM (VALUES
        ('Ngoài việc quản lý thông tin, kết quả học tập, phần mềm phát triển các tính năng phục vụ cho việc lưu trữ/nhắc các sổ sách trong việc quản lý nhà trường.', 0),
        ('Thông tin các sổ sách được dựa theo thông tư đã ban hành và ý kiến trao đổi với phía nhà trường.', 1)
      ) AS t(paragraph_text, sort_order)
      WHERE product1_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Expand Bullets
      INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
      VALUES
        (product1_id, 'expand-bullets', '{"bullet_text": "Tích hợp các hệ thống dùng chung"}'::jsonb, 0, TRUE),
        (product1_id, 'expand-bullets', '{"bullet_text": "Cập nhật liên tục các tiện ích, tính năng"}'::jsonb, 1, TRUE),
        (product1_id, 'expand-bullets', '{"bullet_text": "Hỗ trợ tận tình trong quá trình sử dụng"}'::jsonb, 2, TRUE)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;

-- Thêm permissions cho products module
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('products.view', 'Xem danh sách sản phẩm', 'products', 'Xem danh sách sản phẩm và giải pháp', TRUE),
  ('products.manage', 'Quản lý sản phẩm', 'products', 'Thêm, sửa, xóa sản phẩm và giải pháp', TRUE),
  ('product_categories.view', 'Xem danh mục sản phẩm', 'products', 'Xem danh sách danh mục sản phẩm', TRUE),
  ('product_categories.manage', 'Quản lý danh mục sản phẩm', 'products', 'Thêm, sửa, xóa danh mục sản phẩm', TRUE),
  ('product_benefits.manage', 'Quản lý lợi ích sản phẩm', 'products', 'Quản lý các lợi ích hiển thị trên trang products', TRUE),
  ('product_hero.manage', 'Quản lý Hero Products', 'products', 'Quản lý hero section của trang products', TRUE)
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
  'product_hero.manage'
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
    'Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.',
    'Ông Nguyễn Hoàng Chinh',
    NULL,
    5,
    1,
    TRUE
  ),
  (
    'Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.',
    'Ông Vũ Kim Trung',
    NULL,
    5,
    2,
    TRUE
  ),
  (
    'Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.',
    'Ông Nguyễn Khánh Tùng',
    NULL,
    5,
    3,
    TRUE
  ),
  (
    'SFB không chỉ cung cấp giải pháp phần mềm mà còn là người bạn đồng hành tin cậy. Sự hỗ trợ nhiệt tình và chuyên môn cao của đội ngũ kỹ thuật giúp chúng tôi yên tâm vận hành hệ thống 24/7.',
    'Ông Nguyễn Khanh',
    NULL,
    5,
    4,
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

-- ==================== INDUSTRIES MODULE (OPTIMIZED) ====================

-- Bảng industries_sections (Gộp hero, list-header, process-header)
-- section_type: 'hero', 'list-header', 'process-header'
-- data: JSONB chứa tất cả các field riêng của từng section
CREATE TABLE IF NOT EXISTS industries_sections (
  id SERIAL PRIMARY KEY,
  section_type VARCHAR(50) NOT NULL UNIQUE,
  data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_industries_sections_type ON industries_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_industries_sections_active ON industries_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_industries_sections_data_gin ON industries_sections USING GIN (data);

DROP TRIGGER IF EXISTS update_industries_sections_updated_at ON industries_sections;
CREATE TRIGGER update_industries_sections_updated_at
    BEFORE UPDATE ON industries_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng industries_section_items (Gộp hero-stats và process-steps)
-- section_id: FK đến industries_sections
-- section_type: 'hero' (stats), 'process' (steps)
-- data: JSONB chứa tất cả các field riêng của từng item type
CREATE TABLE IF NOT EXISTS industries_section_items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES industries_sections(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_industries_section_items_section ON industries_section_items(section_id);
CREATE INDEX IF NOT EXISTS idx_industries_section_items_type ON industries_section_items(section_type);
CREATE INDEX IF NOT EXISTS idx_industries_section_items_sort ON industries_section_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_industries_section_items_active ON industries_section_items(is_active);
CREATE INDEX IF NOT EXISTS idx_industries_section_items_data_gin ON industries_section_items USING GIN (data);

DROP TRIGGER IF EXISTS update_industries_section_items_updated_at ON industries_section_items;
CREATE TRIGGER update_industries_section_items_updated_at
    BEFORE UPDATE ON industries_section_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed dữ liệu mẫu cho Industries (Optimized)
DO $$
DECLARE
  hero_id_val INTEGER;
  process_header_id_val INTEGER;
BEGIN
  -- Industries Hero
  INSERT INTO industries_sections (section_type, data, is_active)
  VALUES (
    'hero',
    '{
      "titlePrefix": "Giải pháp công nghệ tối ưu",
      "titleSuffix": "vận hành doanh nghiệp",
      "description": "Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với hàng trăm dự án triển khai thực tế.",
      "buttonText": "KHÁM PHÁ GIẢI PHÁP",
      "buttonLink": "/solutions",
      "image": "/images/fieldhero.png",
      "backgroundGradient": "linear-gradient(31deg, #0870B4 51.21%, #2EABE2 97.73%)"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO hero_id_val;

  -- Hero Stats
  IF hero_id_val IS NOT NULL THEN
    INSERT INTO industries_section_items (section_id, section_type, data, sort_order)
    VALUES
      (hero_id_val, 'hero', '{"iconName": "Award", "value": "8+ năm", "label": "Kinh nghiệm triển khai", "gradient": "from-blue-500 to-cyan-500"}'::jsonb, 0),
      (hero_id_val, 'hero', '{"iconName": "Target", "value": "Hàng trăm", "label": "Dự án & triển khai thực tế", "gradient": "from-purple-500 to-pink-500"}'::jsonb, 1),
      (hero_id_val, 'hero', '{"iconName": "Users", "value": "Nhiều đơn vị", "label": "Cơ quan Nhà nước & doanh nghiệp", "gradient": "from-emerald-500 to-teal-500"}'::jsonb, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Industries List Header
  INSERT INTO industries_sections (section_type, data, is_active)
  VALUES (
    'list-header',
    '{
      "title": "Các lĩnh vực hoạt động & dịch vụ",
      "description": "Những mảng chuyên môn chính mà SFB đang cung cấp giải pháp và dịch vụ công nghệ thông tin cho cơ quan Nhà nước & doanh nghiệp"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING;

  -- Industries Process Header
  INSERT INTO industries_sections (section_type, data, is_active)
  VALUES (
    'process-header',
    '{
      "subtitle": "LỘ TRÌNH ĐỒNG HÀNH CÙNG SFB",
      "titlePart1": "Vì sao SFB phù hợp cho",
      "titleHighlight": "nhiều",
      "titlePart2": "lĩnh vực khác nhau"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO process_header_id_val;

  -- Industries CTA Section
  INSERT INTO industries_sections (section_type, data, is_active)
  VALUES (
    'cta',
    '{
      "title": "Miễn phí tư vấn",
      "description": "Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số.",
      "primaryButtonText": "Tư vấn miễn phí ngay",
      "primaryButtonLink": "/contact",
      "secondaryButtonText": "Xem case studies",
      "secondaryButtonLink": "/solutions",
      "backgroundColor": "#29A3DD"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING;

  -- Process Steps
  IF process_header_id_val IS NOT NULL THEN
    INSERT INTO industries_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (process_header_id_val, 'process', '{
        "stepId": "01",
        "iconName": "Target",
        "title": "Hiểu rõ đặc thù từng ngành",
        "description": "Kinh nghiệm triển khai cho khối Nhà nước, giáo dục, y tế, doanh nghiệp giúp SFB nắm rõ quy định, quy trình và nhu cầu thực tế của từng đơn vị.",
        "points": ["Nắm bắt nhanh yêu cầu nghiệp vụ", "Giải pháp \"fit\" quy trình, không one-size-fits-all"],
        "image": "/images/industries/industries1.png",
        "colors": {
          "gradient": "from-blue-500 to-cyan-500",
          "strip": "from-blue-500 via-cyan-500 to-sky-400",
          "border": "border-blue-100",
          "shadowBase": "rgba(15,23,42,0.06)",
          "shadowHover": "rgba(37,99,235,0.18)",
          "check": "text-blue-600"
        },
        "button": {
          "text": "Liên hệ với chúng tôi",
          "link": "/contact",
          "iconName": "ArrowRight",
          "iconSize": 18
        }
      }'::jsonb, 0, TRUE),
      (process_header_id_val, 'process', '{
        "stepId": "02",
        "iconName": "Users",
        "title": "Đội ngũ chuyên gia đồng hành",
        "description": "Kết hợp BA, dev, QA, DevOps và chuyên gia nghiệp vụ theo từng lĩnh vực, hỗ trợ khách hàng từ giai đoạn ý tưởng đến vận hành.",
        "points": ["Trao đổi trực tiếp với team tư vấn & triển khai", "Đào tạo & hỗ trợ sau khi go-live"],
        "image": "/images/industries/industries2.png",
        "colors": {
          "gradient": "from-emerald-500 to-teal-500",
          "strip": "from-emerald-500 via-teal-500 to-cyan-400",
          "border": "border-emerald-100",
          "shadowBase": "rgba(15,23,42,0.06)",
          "shadowHover": "rgba(16,185,129,0.22)",
          "check": "text-emerald-600"
        },
        "button": {
          "text": "Kết nối với chuyên gia",
          "link": "/experts",
          "iconName": "Phone",
          "iconSize": 18
        }
      }'::jsonb, 1, TRUE),
      (process_header_id_val, 'process', '{
        "stepId": "03",
        "iconName": "Award",
        "title": "Quy trình & chất lượng nhất quán",
        "description": "Áp dụng quy trình chuẩn trong phân tích, phát triển, kiểm thử và triển khai, đảm bảo mỗi dự án đều đạt chất lượng như cam kết.",
        "points": ["Quy trình rõ ràng, minh bạch tiến độ", "Dễ dàng mở rộng & bảo trì về sau"],
        "image": "/images/industries/industries3.png",
        "colors": {
          "gradient": "from-purple-500 to-pink-500",
          "strip": "from-purple-500 via-violet-500 to-pink-400",
          "border": "border-purple-100",
          "shadowBase": "rgba(15,23,42,0.06)",
          "shadowHover": "rgba(168,85,247,0.22)",
          "check": "text-purple-600"
        },
        "button": {
          "text": "Tìm hiểu quy trình, nghiệp vụ",
          "link": "/process",
          "iconName": "Sparkles",
          "iconSize": 18
        }
      }'::jsonb, 2, TRUE)
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
-- ==================== ABOUT MODULE (OPTIMIZED) ====================

-- Bảng about_sections (Gộp hero, company, vision-mission, core-values, milestones, leadership)
-- section_type: 'hero', 'company', 'vision-mission', 'core-values', 'milestones', 'leadership'
-- data: JSONB chứa tất cả các field riêng của từng section
CREATE TABLE IF NOT EXISTS about_sections (
  id SERIAL PRIMARY KEY,
  section_type VARCHAR(50) NOT NULL UNIQUE,
  data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_about_sections_type ON about_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_about_sections_active ON about_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_about_sections_data_gin ON about_sections USING GIN (data);

DROP TRIGGER IF EXISTS update_about_sections_updated_at ON about_sections;
CREATE TRIGGER update_about_sections_updated_at
    BEFORE UPDATE ON about_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng about_section_items (Gộp tất cả items của các sections)
-- section_id: FK đến about_sections
-- section_type: 'company' (contacts), 'vision-mission' (items), 'core-values' (items), 'milestones' (items), 'leadership' (items)
-- data: JSONB chứa tất cả các field riêng của từng item type
CREATE TABLE IF NOT EXISTS about_section_items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES about_sections(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_about_section_items_section ON about_section_items(section_id);
CREATE INDEX IF NOT EXISTS idx_about_section_items_type ON about_section_items(section_type);
CREATE INDEX IF NOT EXISTS idx_about_section_items_sort ON about_section_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_about_section_items_active ON about_section_items(is_active);
CREATE INDEX IF NOT EXISTS idx_about_section_items_data_gin ON about_section_items USING GIN (data);

DROP TRIGGER IF EXISTS update_about_section_items_updated_at ON about_section_items;
CREATE TRIGGER update_about_section_items_updated_at
    BEFORE UPDATE ON about_section_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

-- Seed data cho About Page (Optimized)
DO $$
DECLARE
  hero_id_val INTEGER;
  company_id_val INTEGER;
  vision_mission_id_val INTEGER;
  core_values_id_val INTEGER;
  milestones_id_val INTEGER;
  leadership_id_val INTEGER;
BEGIN
  -- About Hero
  INSERT INTO about_sections (section_type, data, is_active)
  VALUES (
    'hero',
    '{
      "titleLine1": "SFB Technology",
      "titleLine2": "Công ty cổ phần",
      "titleLine3": "công nghệ SFB",
      "description": "Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với hàng trăm dự án triển khai thực tế.",
      "buttonText": "KHÁM PHÁ GIẢI PHÁP",
      "buttonLink": "/solutions",
      "image": "/images/abouthero.png",
      "backgroundGradient": "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO hero_id_val;

  -- About Company
  INSERT INTO about_sections (section_type, data, is_active)
  VALUES (
    'company',
    '{
      "headerSub": "GIỚI THIỆU SFB",
      "headerTitleLine1": "Đối tác công nghệ chiến lược",
      "headerTitleLine2": "cho doanh nghiệp Việt",
      "contentImage1": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      "contentTitle": "CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB (SFB TECHNOLOGY JOINT STOCK COMPANY – viết tắt SFBTECH.,JSC)",
      "contentDescription": "Công ty hoạt động theo mô hình cổ phần với giấy chứng nhận đăng ký kinh doanh số 0107857710 do Sở Kế hoạch và Đầu tư Hà Nội cấp ngày 24/05/2017.",
      "contentButtonText": "Liên hệ với chúng tôi",
      "contentButtonLink": "/contact",
      "contactImage2": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      "contactButtonText": "Liên hệ ngay",
      "contactButtonLink": "/contact"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO company_id_val;

  -- Company Contacts
  IF company_id_val IS NOT NULL THEN
    INSERT INTO about_section_items (section_id, section_type, data, sort_order)
    VALUES
      (company_id_val, 'company', '{"iconName": "Building2", "title": "Trụ sở", "text": "41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc Thuỵ, quận Long Biên, Hà Nội.", "isHighlight": false}'::jsonb, 0),
      (company_id_val, 'company', '{"iconName": "MapPin", "title": "Văn phòng", "text": "P303, Tầng 3, Khách sạn Thể Thao, 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.", "isHighlight": false}'::jsonb, 1),
      (company_id_val, 'company', '{"iconName": "Phone", "title": "Hotline", "text": "0888 917 999", "isHighlight": true}'::jsonb, 2),
      (company_id_val, 'company', '{"iconName": "Mail", "title": "Email", "text": "info@sfb.vn", "isHighlight": true}'::jsonb, 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Vision & Mission
  INSERT INTO about_sections (section_type, data, is_active)
  VALUES (
    'vision-mission',
    '{
      "headerTitle": "Tầm nhìn & Sứ mệnh",
      "headerDescription": "Trở thành một trong những công ty công nghệ hàng đầu về phát triển bền vững, xây dựng trên nền tảng tri thức và trí tuệ sáng tạo của đội ngũ nhân sự SFB."
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO vision_mission_id_val;

  -- Vision & Mission Items
  IF vision_mission_id_val IS NOT NULL THEN
    INSERT INTO about_section_items (section_id, section_type, data, sort_order)
    VALUES
      (vision_mission_id_val, 'vision-mission', '{"text": "Phát triển bền vững trên nền tảng tri thức"}'::jsonb, 0),
      (vision_mission_id_val, 'vision-mission', '{"text": "Kết hợp trí tuệ tập thể & sự nhiệt huyết của đội ngũ"}'::jsonb, 1),
      (vision_mission_id_val, 'vision-mission', '{"text": "Xây dựng hệ thống, sản phẩm có giá trị lâu dài"}'::jsonb, 2),
      (vision_mission_id_val, 'vision-mission', '{"text": "Cung cấp sản phẩm, dịch vụ tốt nhất dựa trên công nghệ mới"}'::jsonb, 3),
      (vision_mission_id_val, 'vision-mission', '{"text": "Tạo dựng niềm tin vững chắc với khách hàng & nhà đầu tư"}'::jsonb, 4),
      (vision_mission_id_val, 'vision-mission', '{"text": "Chung tay cùng xã hội hướng tới nền công nghiệp 4.0"}'::jsonb, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Core Values
  INSERT INTO about_sections (section_type, data, is_active)
  VALUES (
    'core-values',
    '{
      "headerTitle": "Giá trị cốt lõi",
      "headerDescription": "Những nguyên tắc định hình văn hoá và cách SFB hợp tác với khách hàng, đối tác và đội ngũ nội bộ"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO core_values_id_val;

  -- Core Values Items
  IF core_values_id_val IS NOT NULL THEN
    INSERT INTO about_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (core_values_id_val, 'core-values', '{"iconName": "Lightbulb", "title": "Đổi mới sáng tạo", "description": "Luôn tìm kiếm giải pháp mới, áp dụng công nghệ tiên tiến vào sản phẩm & dịch vụ.", "gradient": "from-yellow-500 to-orange-500"}'::jsonb, 0, TRUE),
      (core_values_id_val, 'core-values', '{"iconName": "Handshake", "title": "Tận tâm với khách hàng", "description": "Đặt lợi ích khách hàng lên hàng đầu, cam kết đồng hành dài lâu.", "gradient": "from-rose-500 to-pink-500"}'::jsonb, 1, TRUE),
      (core_values_id_val, 'core-values', '{"iconName": "Users", "title": "Hợp tác & đồng hành", "description": "Làm việc nhóm chặt chẽ, cùng khách hàng xây dựng giải pháp phù hợp nhất.", "gradient": "from-blue-500 to-cyan-500"}'::jsonb, 2, TRUE),
      (core_values_id_val, 'core-values', '{"iconName": "ShieldCheck", "title": "Trách nhiệm & minh bạch", "description": "Tuân thủ cam kết, quy trình rõ ràng, không phát sinh chi phí thiếu minh bạch.", "gradient": "from-emerald-500 to-teal-500"}'::jsonb, 3, TRUE),
      (core_values_id_val, 'core-values', '{"iconName": "Database", "title": "Học hỏi không ngừng", "description": "Liên tục cập nhật xu hướng mới: Cloud, AI, Big Data, DevOps..", "gradient": "from-purple-500 to-indigo-500"}'::jsonb, 4, TRUE),
      (core_values_id_val, 'core-values', '{"iconName": "Globe2", "title": "Tư duy toàn cầu", "description": "Tiếp cận theo chuẩn quốc tế, sẵn sàng mở rộng sang các thị trường mới.", "gradient": "from-indigo-500 to-blue-500"}'::jsonb, 5, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Milestones
  INSERT INTO about_sections (section_type, data, is_active)
  VALUES (
    'milestones',
    '{
      "headerTitle": "Hành trình phát triển",
      "headerDescription": "Từ năm 2017 đến nay, SFB liên tục mở rộng đội ngũ, nâng cấp sản phẩm và chuẩn hóa dịch vụ để đồng hành cùng khách hàng lâu dài"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO milestones_id_val;

  -- Milestones Items
  IF milestones_id_val IS NOT NULL THEN
    INSERT INTO about_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (milestones_id_val, 'milestones', '{"year": "2017", "title": "Thành lập SFBTECH.,JSC", "description": "Được cấp giấy chứng nhận đăng ký kinh doanh số 0107857710 bởi Sở KH&ĐT Hà Nội, bắt đầu hoạt động theo mô hình công ty cổ phần.", "icon": "🚀"}'::jsonb, 0, TRUE),
      (milestones_id_val, 'milestones', '{"year": "2018-2019", "title": "Xây dựng đội ngũ & sản phẩm lõi", "description": "Hình thành các giải pháp về cổng thông tin điện tử, văn bản điều hành, thư viện số và các hệ thống nghiệp vụ cho cơ quan Nhà nước.", "icon": "📘"}'::jsonb, 1, TRUE),
      (milestones_id_val, 'milestones', '{"year": "2020-2022", "title": "Mở rộng lĩnh vực & quy mô triển khai", "description": "Triển khai nhiều dự án cho khối Tài chính, Bảo hiểm, Ngân hàng, Viễn thông, Chính phủ điện tử và Doanh nghiệp.", "icon": "📈"}'::jsonb, 2, TRUE),
      (milestones_id_val, 'milestones', '{"year": "2023 - nay", "title": "Tiếp tục tăng trưởng & chuyển đổi số", "description": "Đẩy mạnh các giải pháp theo nhu cầu riêng của từng đơn vị, chú trọng mở rộng, an toàn, bảo mật và tích hợp hệ thống.", "icon": "🎯"}'::jsonb, 3, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Leadership
  INSERT INTO about_sections (section_type, data, is_active)
  VALUES (
    'leadership',
    '{
      "headerTitle": "Ban lãnh đạo",
      "headerDescription": "Đội ngũ lãnh đạo chủ chốt của SFB Technology, định hướng chiến lược và đồng hành cùng khách hàng trong mọi dự án"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO leadership_id_val;

  -- Leadership Items
  IF leadership_id_val IS NOT NULL THEN
    INSERT INTO about_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (leadership_id_val, 'leadership', '{"name": "Nguyễn Văn Điền", "position": "KẾ TOÁN TRƯỞNG", "email": "diennv@sfb.vn", "phone": "0888 917 999", "description": "Thành viên ban lãnh đạo phụ trách kế toán trưởng, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.", "image": "https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg"}'::jsonb, 0, TRUE),
      (leadership_id_val, 'leadership', '{"name": "Nguyễn Đức Duy", "position": "GIÁM ĐỐC CÔNG NGHỆ", "email": "duynd@sfb.vn", "phone": "0705 146 789", "description": "Thành viên ban lãnh đạo phụ trách giám đốc công nghệ, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.", "image": "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg"}'::jsonb, 1, TRUE),
      (leadership_id_val, 'leadership', '{"name": "Nguyễn Văn C", "position": "GIÁM ĐỐC KINH DOANH", "email": "nvc@sfb.vn", "phone": "0705 146 789", "description": "Thành viên ban lãnh đạo phụ trách giám đốc kinh doanh, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành.", "image": "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg"}'::jsonb, 2, TRUE),
      (leadership_id_val, 'leadership', '{"name": "Lê Văn D", "position": "GIÁM ĐỐC VẬN HÀNH", "email": "lvd@sfb.vn", "phone": "0987 654 321", "description": "Thành viên ban lãnh đạo phụ trách vận hành và quy trình nội bộ, đảm bảo hiệu suất hoạt động tối ưu.", "image": "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg"}'::jsonb, 3, TRUE),
      (leadership_id_val, 'leadership', '{"name": "Phạm Thị E", "position": "GIÁM ĐỐC NHÂN SỰ", "email": "pte@sfb.vn", "phone": "0123 456 789", "description": "Thành viên ban lãnh đạo phụ trách phát triển nguồn nhân lực và văn hóa doanh nghiệp.", "image": "https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg"}'::jsonb, 4, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ==================== CAREERS MODULE ====================

-- Bảng career_sections (Gộp hero, benefits, positions, cta)
-- section_type: 'hero', 'benefits', 'positions', 'cta'
-- data: JSONB chứa tất cả các field riêng của từng section
CREATE TABLE IF NOT EXISTS career_sections (
  id SERIAL PRIMARY KEY,
  section_type VARCHAR(50) NOT NULL UNIQUE,
  data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_sections_type ON career_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_career_sections_active ON career_sections(is_active);
-- Index cho JSONB queries
CREATE INDEX IF NOT EXISTS idx_career_sections_data ON career_sections USING GIN (data);

-- Trigger cập nhật updated_at cho career_sections
DROP TRIGGER IF EXISTS update_career_sections_updated_at ON career_sections;
CREATE TRIGGER update_career_sections_updated_at
    BEFORE UPDATE ON career_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng career_section_items (Gộp benefits_items và positions_items)
-- section_type: 'benefits', 'positions'
-- data: JSONB chứa tất cả các field riêng của từng item type
CREATE TABLE IF NOT EXISTS career_section_items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES career_sections(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_section_items_section ON career_section_items(section_id);
CREATE INDEX IF NOT EXISTS idx_career_section_items_type ON career_section_items(section_type);
CREATE INDEX IF NOT EXISTS idx_career_section_items_sort ON career_section_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_career_section_items_active ON career_section_items(is_active);
-- Index cho JSONB queries
CREATE INDEX IF NOT EXISTS idx_career_section_items_data ON career_section_items USING GIN (data);

-- Trigger cập nhật updated_at cho career_section_items
DROP TRIGGER IF EXISTS update_career_section_items_updated_at ON career_section_items;
CREATE TRIGGER update_career_section_items_updated_at
    BEFORE UPDATE ON career_section_items
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
  INSERT INTO career_sections (section_type, data, is_active)
  VALUES (
    'hero',
    '{
      "titleLine1": "Cùng xây dựng",
      "titleLine2": "tương lai công nghệ",
      "description": "Gia nhập đội ngũ 50+ chuyên gia công nghệ, làm việc với tech stack hiện đại nhất và triển khai dự án cho các khách hàng lớn",
      "buttonText": "Xem vị trí tuyển dụng",
      "buttonLink": "#positions",
      "image": "/images/hero.png",
      "backgroundGradient": "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO hero_id_val;

  -- Career Benefits
  INSERT INTO career_sections (section_type, data, is_active)
  VALUES (
    'benefits',
    '{
      "headerTitle": "Phúc lợi & Đãi ngộ",
      "headerDescription": "Chúng tôi tin rằng nhân viên hạnh phúc sẽ làm việc hiệu quả hơn"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO benefits_id_val;

  IF benefits_id_val IS NOT NULL THEN
    INSERT INTO career_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (benefits_id_val, 'benefits', '{"iconName": "DollarSign", "title": "Lương thưởng hấp dẫn", "description": "Mức lương cạnh tranh top đầu thị trường, thưởng theo hiệu quả công việc", "gradient": "from-emerald-500 to-teal-500"}'::jsonb, 1, TRUE),
      (benefits_id_val, 'benefits', '{"iconName": "TrendingUp", "title": "Thăng tiến rõ ràng", "description": "Lộ trình phát triển sự nghiệp minh bạch, đánh giá định kỳ 6 tháng", "gradient": "from-[#006FB3] to-[#0088D9]"}'::jsonb, 2, TRUE),
      (benefits_id_val, 'benefits', '{"iconName": "Coffee", "title": "Môi trường năng động", "description": "Văn hóa startup, không gian làm việc hiện đại, team building định kỳ", "gradient": "from-orange-500 to-amber-500"}'::jsonb, 3, TRUE),
      (benefits_id_val, 'benefits', '{"iconName": "Heart", "title": "Chăm sóc sức khỏe", "description": "Bảo hiểm sức khỏe toàn diện, khám sức khỏe định kỳ, gym membership", "gradient": "from-rose-500 to-pink-500"}'::jsonb, 4, TRUE),
      (benefits_id_val, 'benefits', '{"iconName": "Rocket", "title": "Công nghệ tiên tiến", "description": "Làm việc với tech stack mới nhất, tham gia dự án quốc tế", "gradient": "from-purple-500 to-pink-500"}'::jsonb, 5, TRUE),
      (benefits_id_val, 'benefits', '{"iconName": "Award", "title": "Đào tạo & phát triển", "description": "Ngân sách training unlimited, hỗ trợ certification & conference", "gradient": "from-indigo-500 to-purple-500"}'::jsonb, 6, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Career Positions
  INSERT INTO career_sections (section_type, data, is_active)
  VALUES (
    'positions',
    '{
      "headerTitle": "Vị trí đang tuyển",
      "headerDescription": "Tìm vị trí phù hợp với bạn và ứng tuyển ngay hôm nay"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO positions_id_val;

  IF positions_id_val IS NOT NULL THEN
    INSERT INTO career_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (positions_id_val, 'positions', '{"title": "Senior Full-stack Developer", "department": "Engineering", "type": "Full-time", "location": "TP. HCM", "salary": "2000 - 3500 USD", "experience": "4+ years", "description": "Phát triển và maintain các hệ thống enterprise cho khách hàng lớn. Lead team 3-5 developers.", "skills": ["React", "Node.js", "AWS", "MongoDB"], "gradient": "from-[#006FB3] to-[#0088D9]"}'::jsonb, 1, TRUE),
      (positions_id_val, 'positions', '{"title": "Mobile Developer (Flutter)", "department": "Engineering", "type": "Full-time", "location": "TP. HCM / Remote", "salary": "1500 - 2500 USD", "experience": "2+ years", "description": "Xây dựng mobile app cho các lĩnh vực fintech, e-commerce, healthcare.", "skills": ["Flutter", "Dart", "Firebase", "RESTful API"], "gradient": "from-purple-500 to-pink-500"}'::jsonb, 2, TRUE),
      (positions_id_val, 'positions', '{"title": "DevOps Engineer", "department": "Infrastructure", "type": "Full-time", "location": "TP. HCM", "salary": "1800 - 3000 USD", "experience": "3+ years", "description": "Quản lý infrastructure, CI/CD pipeline, monitoring và scaling hệ thống.", "skills": ["AWS", "Kubernetes", "Docker", "Terraform"], "gradient": "from-emerald-500 to-teal-500"}'::jsonb, 3, TRUE),
      (positions_id_val, 'positions', '{"title": "UI/UX Designer", "department": "Design", "type": "Full-time", "location": "TP. HCM", "salary": "1200 - 2000 USD", "experience": "2+ years", "description": "Thiết kế giao diện và trải nghiệm người dùng cho web/mobile app.", "skills": ["Figma", "Adobe XD", "Prototyping", "User Research"], "gradient": "from-orange-500 to-amber-500"}'::jsonb, 4, TRUE),
      (positions_id_val, 'positions', '{"title": "Data Engineer", "department": "Data", "type": "Full-time", "location": "TP. HCM", "salary": "2000 - 3200 USD", "experience": "3+ years", "description": "Xây dựng data pipeline, ETL và data warehouse cho dự án Big Data.", "skills": ["Python", "Spark", "Airflow", "SQL"], "gradient": "from-indigo-500 to-purple-500"}'::jsonb, 5, TRUE),
      (positions_id_val, 'positions', '{"title": "QA Automation Engineer", "department": "Quality Assurance", "type": "Full-time", "location": "TP. HCM / Remote", "salary": "1000 - 1800 USD", "experience": "2+ years", "description": "Phát triển automation test, đảm bảo chất lượng sản phẩm.", "skills": ["Selenium", "Jest", "Cypress", "CI/CD"], "gradient": "from-rose-500 to-pink-500"}'::jsonb, 6, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Career CTA
  INSERT INTO career_sections (section_type, data, is_active)
  VALUES (
    'cta',
    '{
      "title": "Không tìm thấy vị trí phù hợp?",
      "description": "Gửi CV cho chúng tôi! Chúng tôi luôn tìm kiếm những tài năng xuất sắc",
      "primaryButtonText": "Gửi CV qua email",
      "primaryButtonLink": "mailto:careers@sfb.vn",
      "secondaryButtonText": "Liên hệ HR",
      "secondaryButtonLink": "/contact",
      "backgroundGradient": "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
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

-- ============================================================================
-- HOMEPAGE BLOCKS MANAGEMENT SYSTEM SCHEMA
-- ============================================================================

-- Bảng homepage_blocks (Quản lý các khối trên trang chủ)
-- section_type: 'hero', 'aboutCompany', 'features', 'solutions', 'trusts', 'consult'
-- data: JSONB chứa tất cả các field riêng của từng section
CREATE TABLE IF NOT EXISTS homepage_blocks (
  id SERIAL PRIMARY KEY,
  section_type VARCHAR(50) NOT NULL UNIQUE,
  data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_homepage_blocks_type ON homepage_blocks(section_type);
CREATE INDEX IF NOT EXISTS idx_homepage_blocks_active ON homepage_blocks(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_blocks_data_gin ON homepage_blocks USING GIN (data);

DROP TRIGGER IF EXISTS update_homepage_blocks_updated_at ON homepage_blocks;
CREATE TRIGGER update_homepage_blocks_updated_at
    BEFORE UPDATE ON homepage_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed dữ liệu mẫu cho Homepage Blocks
INSERT INTO homepage_blocks (section_type, data, is_active)
VALUES
  (
    'hero',
    '{
      "title": {
        "line1": "Chuyển đổi số ",
        "line2": "Thông minh ",
        "line3": "Cho doanh nghiệp"
      },
      "description": "SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến, tối ưu hóa quy trình và tăng trưởng bền vững.",
      "primaryButton": {
        "text": "Khám phá giải pháp",
        "link": "/solutions"
      },
      "secondaryButton": {
        "text": "Xem video"
      },
      "heroImage": "/images/hero.png",
      "partners": [
        "/images/partners/baohiem.png",
        "/images/partners/botaichinh.png",
        "/images/partners/hvcsnd.png",
        "/images/partners/hưng-yên.png",
        "/images/partners/logo3.png",
        "/images/partners/namviet.png",
        "/images/partners/sotttt-removebg-preview.png",
        "/images/partners/usaid.png"
      ]
    }'::jsonb,
    TRUE
  ),
  (
    'aboutCompany',
    '{
      "title": {
        "part1": "Chuyển đổi số ",
        "highlight1": "không bắt đầu từ phần mềm",
        "part2": " mà ",
        "highlight2": "từ hiệu quả thực tế",
        "part3": " của doanh nghiệp."
      },
      "description": "SFB giúp doanh nghiệp vận hành thông minh, giảm chi phí hạ tầng, tăng năng suất và bảo mật dữ liệu an toàn tuyệt đối.",
      "slides": [
        {
          "title": "Tư vấn & Đánh giá hiện trạng",
          "description": "Chúng tôi phân tích toàn diện hiện trạng vận hành, dữ liệu và quy trình của doanh nghiệp. Xác định điểm mạnh – điểm nghẽn – rủi ro tiềm ẩn để đưa ra bức tranh tổng thể.",
          "buttonText": "Nhận tư vấn ngay",
          "buttonLink": "/contact",
          "image": "/images/card-consulting.jpg"
        },
        {
          "title": "Thiết kế giải pháp phù hợp",
          "description": "Xây dựng giải pháp tối ưu dựa trên nhu cầu thực tế và đặc thù ngành. Đảm bảo tính linh hoạt, khả năng mở rộng và hiệu quả vận hành lâu dài.",
          "buttonText": "Xem case studies",
          "buttonLink": "/products",
          "image": "/images/card-solution.png"
        },
        {
          "title": "Triển khai & Tích hợp hệ thống",
          "description": "Thực hiện triển khai chuyên nghiệp, đảm bảo tiến độ và chất lượng. Kết nối liền mạch với các hệ thống hiện có để tối ưu vận hành tổng thể.",
          "buttonText": "Tìm hiểu thêm",
          "buttonLink": "/solutions",
          "image": "/images/card-implementation.png"
        }
      ]
    }'::jsonb,
    TRUE
  ),
  (
    'features',
    '{
      "header": {
        "sub": "GIỚI THIỆU SFB",
        "title": "Chúng tôi là ai?",
        "description": "Đơn vị phát triển phần mềm với kinh nghiệm thực chiến, chuyên sâu công nghệ và định hướng xây dựng hệ thống bền vững."
      },
      "block1": {
        "image": "/images/feature1.png",
        "text": "SFB với kinh nghiệm qua nhiều dự án lớn nhỏ, tự tin xử lý các bài toán phần mềm phức tạp, yêu cầu chuyên môn sâu. Đội ngũ trẻ – đam mê – trách nhiệm giúp xây dựng hệ thống ổn định, hiệu quả và tối ưu chi phí.",
        "list": [
          "Tự tin trong các dự án phức tạp",
          "Tối ưu quy trình và chi phí",
          "Đồng hành trọn vòng đời sản phẩm"
        ],
        "button": {
          "text": "Tìm hiểu thêm",
          "link": "/about"
        }
      },
      "block2": {
        "image": "/images/feature2.png",
        "button": {
          "text": "Tìm hiểu cách SFB triển khai",
          "link": "/solutions"
        },
        "items": [
          {
            "title": "Nhiều năm kinh nghiệm",
            "text": "Thực hiện hàng trăm dự án từ nhỏ tới lớn, phức tạp."
          },
          {
            "title": "Nhân viên nhiệt huyết",
            "text": "Đội ngũ trẻ, chuyên sâu, giàu tinh thần trách nhiệm."
          },
          {
            "title": "Dự án lớn liên tục hoàn thành",
            "text": "Đáp ứng yêu cầu khó, nghiệp vụ đa ngành."
          },
          {
            "title": "Làm chủ công nghệ",
            "text": "Hạ tầng server riêng, khả năng mở rộng tức thời."
          }
        ]
      },
      "block3": {
        "image": "/images/feature3.png",
        "button": {
          "text": "Liên hệ với chúng tôi",
          "link": "/contact"
        },
        "items": [
          {
            "title": "Chúng tôi hiện diện để",
            "text": "Cung cấp hệ thống hoạt động hiệu quả 24/7, đáp ứng mọi nghiệp vụ công nghệ thông tin."
          },
          {
            "title": "Xây dựng niềm tin",
            "text": "Lấy niềm tin khách hàng và uy tín thương hiệu làm triết lý kinh doanh."
          },
          {
            "title": "Giá trị của nhân viên",
            "text": "Đề cao trung thực – kinh nghiệm – sáng tạo – trách nhiệm."
          }
        ]
      }
    }'::jsonb,
    TRUE
  ),
  (
    'solutions',
    '{
      "subHeader": "GIẢI PHÁP CHUYÊN NGHIỆP",
      "title": {
        "part1": "Giải pháp phần mềm",
        "part2": "đóng gói cho nhiều lĩnh vực"
      },
      "domains": [
        "Chính phủ & cơ quan nhà nước",
        "Doanh nghiệp",
        "Ngân hàng & bảo hiểm",
        "Giáo dục & đào tạo",
        "Viễn thông & hạ tầng số"
      ],
      "items": [
        {
          "id": 1,
          "iconName": "LineChart",
          "title": "Quy trình được chuẩn hóa",
          "description": "Tất cả công việc tại SFB đều được chuẩn hóa theo quy trình rõ ràng – từ tác vụ đơn giản đến các hạng mục phức tạp. Giúp kiểm soát chất lượng, tiến độ và rủi ro một cách nhất quán.",
          "benefits": [
            "Minh bạch & dễ kiểm soát",
            "Giảm rủi ro dự án",
            "Chất lượng đồng nhất"
          ],
          "buttonText": "Tìm hiểu cách SFB triển khai",
          "buttonLink": "/contact",
          "iconGradient": "from-cyan-400 to-blue-600"
        },
        {
          "id": 2,
          "iconName": "Code",
          "title": "Công nghệ .Net của Microsoft",
          "description": "Nền tảng phát triển mạnh mẽ, đa ngôn ngữ và đa hệ điều hành, hỗ trợ xây dựng ứng dụng từ web, mobile đến enterprise. .NET mang lại hiệu suất cao, bảo mật và tốc độ triển khai tối ưu.",
          "benefits": [
            "Bảo mật cao",
            "Dễ bảo trì",
            "Hệ sinh thái mạnh"
          ],
          "buttonText": "Xem case studies",
          "buttonLink": "/industries",
          "iconGradient": "from-fuchsia-400 to-indigo-600"
        },
        {
          "id": 3,
          "iconName": "Database",
          "title": "Giải pháp lưu trữ hiện đại & Big Data",
          "description": "Hạ tầng lưu trữ tiên tiến giúp xử lý và quản lý dữ liệu khổng lồ theo thời gian thực. Big Data cho phép phân tích sâu, phát hiện xu hướng và đưa ra quyết định dựa trên dữ liệu chính xác.",
          "benefits": [
            "Big Data-ready",
            "Hiệu năng cao",
            "An toàn dữ liệu"
          ],
          "buttonText": "Tư vấn miễn phí",
          "buttonLink": "/contact",
          "iconGradient": "from-emerald-400 to-green-600"
        },
        {
          "id": 4,
          "iconName": "Cloud",
          "title": "Khả năng mở rộng linh hoạt",
          "description": "Hệ thống được thiết kế để dễ dàng mở rộng theo nhu cầu: từ tăng tải người dùng đến mở rộng dịch vụ. Kiến trúc linh hoạt giúp tối ưu hiệu năng và đảm bảo hoạt động ổn định ngay cả khi quy mô tăng nhanh.",
          "benefits": [
            "n-Tier / n-Layer",
            "Dễ mở rộng",
            "Sẵn sàng quy mô lớn"
          ],
          "buttonText": "Tìm hiểu cách SFB triển khai",
          "buttonLink": "/contact",
          "iconGradient": "from-orange-400 to-pink-600"
        }
      ]
    }'::jsonb,
    TRUE
  ),
  (
    'trusts',
    '{
      "subHeader": "SFB TECHNOLOGY",
      "title": "Độ tin cậy của SFB Technology",
      "description": "Năng lực thực chiến, đội ngũ chuyên gia và quy trình minh bạch giúp SFB trở thành đối tác công nghệ tin cậy của hàng trăm tổ chức, doanh nghiệp.",
      "image": "/images/card-consulting.jpg",
      "button": {
        "text": "Tìm hiểu thêm",
        "link": "/about"
      },
      "features": [
        {
          "iconName": "BarChart3",
          "title": "Năng lực được chứng minh",
          "description": "Triển khai nhiều dự án quy mô lớn cho cơ quan Nhà nước, doanh nghiệp và tổ chức trong các lĩnh vực Tài chính, Ngân hàng, Giáo dục, Viễn thông, Công nghiệp."
        },
        {
          "iconName": "ShieldCheck",
          "title": "Đội ngũ chuyên gia giàu kinh nghiệm",
          "description": "Chuyên gia nhiều năm trong phát triển phần mềm, bảo mật, hạ tầng số và thiết kế hệ thống."
        },
        {
          "iconName": "FileCheck",
          "title": "Quy trình & cam kết minh bạch",
          "description": "Quy trình quản lý dự án rõ ràng, từ khảo sát đến vận hành, luôn minh bạch với khách hàng."
        }
      ]
    }'::jsonb,
    TRUE
  ),
  (
    'testimonials',
    '{
      "title": "Khách hàng nói về SFB?",
      "reviews": [
        {
          "id": 1,
          "quote": "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.",
          "author": "Ông Nguyễn Hoàng Chinh",
          "rating": 5
        },
        {
          "id": 2,
          "quote": "Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.",
          "author": "Ông Vũ Kim Trung",
          "rating": 5
        },
        {
          "id": 3,
          "quote": "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.",
          "author": "Ông Nguyễn Khánh Tùng",
          "rating": 5
        },
        {
          "id": 4,
          "quote": "SFB không chỉ cung cấp giải pháp phần mềm mà còn là người bạn đồng hành tin cậy. Sự hỗ trợ nhiệt tình và chuyên môn cao của đội ngũ kỹ thuật giúp chúng tôi yên tâm vận hành hệ thống 24/7.",
          "author": "Ông Nguyễn Khanh",
          "rating": 5
        }
      ]
    }'::jsonb,
    TRUE
  ),
  (
    'consult',
    '{
      "title": "Miễn phí tư vấn",
      "description": "Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số.",
      "buttons": {
        "primary": {
          "text": "Tư vấn miễn phí ngay",
          "link": "/contact"
        },
        "secondary": {
          "text": "Xem case studies",
          "link": "/solutions"
        }
      }
    }'::jsonb,
    TRUE
  )
ON CONFLICT (section_type) DO NOTHING;

-- Thêm permission cho homepage
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('homepage.manage', 'Quản lý trang chủ', 'homepage', 'Quản lý toàn bộ nội dung các khối trên trang chủ', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền homepage cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code = 'homepage.manage'
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================================================
-- CONTACT PAGE MANAGEMENT SCHEMA
-- ============================================================================

-- Bảng contact_sections (Gộp hero, info-cards, form, sidebar, map)
-- section_type: 'hero', 'info-cards', 'form', 'sidebar', 'map'
-- data: JSONB chứa tất cả các field riêng của từng section
CREATE TABLE IF NOT EXISTS contact_sections (
  id SERIAL PRIMARY KEY,
  section_type VARCHAR(50) NOT NULL UNIQUE,
  data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_sections_type ON contact_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_contact_sections_active ON contact_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_sections_data_gin ON contact_sections USING GIN (data);

DROP TRIGGER IF EXISTS update_contact_sections_updated_at ON contact_sections;
CREATE TRIGGER update_contact_sections_updated_at
    BEFORE UPDATE ON contact_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng contact_section_items (Gộp info-cards items, offices items, social links)
-- section_id: FK đến contact_sections
-- section_type: 'info-cards' (items), 'offices' (items), 'socials' (items)
-- data: JSONB chứa tất cả các field riêng của từng item type
CREATE TABLE IF NOT EXISTS contact_section_items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES contact_sections(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_section_items_section ON contact_section_items(section_id);
CREATE INDEX IF NOT EXISTS idx_contact_section_items_type ON contact_section_items(section_type);
CREATE INDEX IF NOT EXISTS idx_contact_section_items_sort ON contact_section_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_section_items_active ON contact_section_items(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_section_items_data_gin ON contact_section_items USING GIN (data);

DROP TRIGGER IF EXISTS update_contact_section_items_updated_at ON contact_section_items;
CREATE TRIGGER update_contact_section_items_updated_at
    BEFORE UPDATE ON contact_section_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed dữ liệu mẫu cho Contact Page
DO $$
DECLARE
  info_cards_id_val INTEGER;
BEGIN
  -- Contact Hero
  INSERT INTO contact_sections (section_type, data, is_active)
  VALUES (
    'hero',
    '{
      "badge": "LIÊN HỆ VỚI CHÚNG TÔI",
      "title": {
        "prefix": "Hãy để chúng tôi",
        "highlight": "hỗ trợ bạn"
      },
      "description": "Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7",
      "iconName": "MessageCircle",
      "image": "/images/contact_hero.png"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING;

  -- Contact Info Cards
  INSERT INTO contact_sections (section_type, data, is_active)
  VALUES (
    'info-cards',
    '{}'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO info_cards_id_val;

  -- Contact Info Cards Items
  IF info_cards_id_val IS NOT NULL THEN
    INSERT INTO contact_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (info_cards_id_val, 'info-cards', '{
        "iconName": "MapPin",
        "title": "Địa chỉ văn phòng",
        "content": "P303, Tầng 3, Khách sạn Thể Thao, Số 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.",
        "link": "https://maps.google.com",
        "gradient": "from-blue-500 to-cyan-500"
      }'::jsonb, 0, TRUE),
      (info_cards_id_val, 'info-cards', '{
        "iconName": "Phone",
        "title": "Điện thoại",
        "content": "(+84) 888 917 999",
        "link": "tel:+84888917999",
        "gradient": "from-emerald-500 to-teal-500"
      }'::jsonb, 1, TRUE),
      (info_cards_id_val, 'info-cards', '{
        "iconName": "Mail",
        "title": "Email",
        "content": "info@sfb.vn",
        "link": "mailto:info@sfb.vn",
        "gradient": "from-purple-500 to-pink-500"
      }'::jsonb, 2, TRUE),
      (info_cards_id_val, 'info-cards', '{
        "iconName": "Clock",
        "title": "Giờ làm việc",
        "content": "T2 - T6: 8:00 - 17:30, T7: 8:00 - 12:00",
        "link": null,
        "gradient": "from-orange-500 to-amber-500"
      }'::jsonb, 3, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Contact Form
  INSERT INTO contact_sections (section_type, data, is_active)
  VALUES (
    'form',
    '{
      "header": "Gửi yêu cầu tư vấn",
      "description": "Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24h",
      "fields": {
        "name": { "label": "Họ và tên", "placeholder": "Nguyễn Văn A" },
        "email": { "label": "Email", "placeholder": "email@example.com" },
        "phone": { "label": "Số điện thoại", "placeholder": "0901234567" },
        "company": { "label": "Công ty", "placeholder": "Tên công ty" },
        "service": { "label": "Dịch vụ quan tâm", "placeholder": "Chọn dịch vụ" },
        "message": { "label": "Nội dung", "placeholder": "Mô tả chi tiết nhu cầu của bạn..." }
      },
      "button": {
        "submit": "Gửi yêu cầu",
        "success": "Đã gửi thành công!"
      },
      "services": [
        "Cloud Computing",
        "Phát triển phần mềm",
        "Quản trị dữ liệu",
        "Business Intelligence",
        "AI & Machine Learning",
        "Cybersecurity",
        "Khác"
      ]
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING;

  -- Contact Sidebar
  INSERT INTO contact_sections (section_type, data, is_active)
  VALUES (
    'sidebar',
    '{
      "quickActions": {
        "title": "Cần tư vấn ngay?",
        "description": "Liên hệ trực tiếp với chúng tôi qua hotline hoặc đặt lịch hẹn tư vấn",
        "buttons": {
          "hotline": { "label": "Hotline", "value": "(+84) 888 917 999", "href": "tel:+84888917999" },
          "appointment": { "label": "Đặt lịch hẹn", "value": "Tư vấn 1-1 với chuyên gia", "href": "#" }
        }
      }
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING
  RETURNING id INTO info_cards_id_val;

  -- Contact Offices
  IF info_cards_id_val IS NOT NULL THEN
    INSERT INTO contact_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (info_cards_id_val, 'offices', '{
        "city": "Hà Nội",
        "address": "Số 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.",
        "phone": "(+84) 888 917 999",
        "email": "info@sfb.vn"
      }'::jsonb, 0, TRUE)
    ON CONFLICT DO NOTHING;

    -- Contact Social Links
    INSERT INTO contact_section_items (section_id, section_type, data, sort_order, is_active)
    VALUES
      (info_cards_id_val, 'socials', '{
        "iconName": "Facebook",
        "href": "#",
        "label": "Facebook",
        "gradient": "from-blue-600 to-blue-700"
      }'::jsonb, 0, TRUE),
      (info_cards_id_val, 'socials', '{
        "iconName": "Linkedin",
        "href": "#",
        "label": "LinkedIn",
        "gradient": "from-blue-700 to-blue-800"
      }'::jsonb, 1, TRUE),
      (info_cards_id_val, 'socials', '{
        "iconName": "Twitter",
        "href": "#",
        "label": "Twitter",
        "gradient": "from-sky-500 to-sky-600"
      }'::jsonb, 2, TRUE),
      (info_cards_id_val, 'socials', '{
        "iconName": "Youtube",
        "href": "#",
        "label": "YouTube",
        "gradient": "from-red-600 to-red-700"
      }'::jsonb, 3, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Contact Map
  INSERT INTO contact_sections (section_type, data, is_active)
  VALUES (
    'map',
    '{
      "address": "Khách sạn Thể Thao, P306, Tầng 3, Số 15 P. Lê Văn Thiêm, Thanh Xuân, Hà Nội",
      "iframeSrc": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7819253605126!2d105.8003122759699!3d21.001376980641176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acc9f0d65555%3A0x6a092258a61f4c4a!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gQ8O0bmcgTmdo4buHIFNmYg!5e0!3m2!1svi!2s!4v1766463463476!5m2!1svi!2s"
    }'::jsonb,
    TRUE
  )
  ON CONFLICT (section_type) DO NOTHING;
END $$;

-- Thêm permissions cho contact module
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('contact.view', 'Xem trang liên hệ', 'contact', 'Xem nội dung trang liên hệ', TRUE),
  ('contact.manage', 'Quản lý trang liên hệ', 'contact', 'Thêm, sửa, xóa nội dung trang liên hệ', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền contact cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'contact.view',
  'contact.manage'
)
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================================================
-- Bảng contact_requests: Lưu các yêu cầu tư vấn từ form liên hệ
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255),
  service VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_email ON contact_requests(email);

DROP TRIGGER IF EXISTS update_contact_requests_updated_at ON contact_requests;
CREATE TRIGGER update_contact_requests_updated_at
    BEFORE UPDATE ON contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Thêm permissions cho contact requests
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('contact_requests.view', 'Xem yêu cầu tư vấn', 'contact', 'Xem danh sách yêu cầu tư vấn', TRUE),
  ('contact_requests.manage', 'Quản lý yêu cầu tư vấn', 'contact', 'Cập nhật, xóa yêu cầu tư vấn', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền contact_requests cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'contact_requests.view',
  'contact_requests.manage'
)
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================================================
-- SEO MANAGEMENT SCHEMA
-- ============================================================================

-- Bảng seo_pages (Quản lý SEO cho tất cả các trang)
CREATE TABLE IF NOT EXISTS seo_pages (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL UNIQUE,  -- '/', '/products', '/about', '/news/[slug]', etc.
  page_type VARCHAR(50),                    -- 'home', 'products', 'about', 'contact', 'news', 'product-detail', 'news-detail'
  
  -- Basic SEO
  title VARCHAR(255),
  description TEXT,
  keywords TEXT,
  
  -- Open Graph
  og_title VARCHAR(255),
  og_description TEXT,
  og_image TEXT,
  og_type VARCHAR(50) DEFAULT 'website',
  
  -- Twitter Card
  twitter_card VARCHAR(20) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image TEXT,
  
  -- Advanced
  canonical_url TEXT,
  robots_index BOOLEAN DEFAULT TRUE,
  robots_follow BOOLEAN DEFAULT TRUE,
  robots_noarchive BOOLEAN DEFAULT FALSE,
  robots_nosnippet BOOLEAN DEFAULT FALSE,
  
  -- Structured Data (JSON-LD)
  structured_data JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seo_pages_path ON seo_pages(page_path);
CREATE INDEX IF NOT EXISTS idx_seo_pages_type ON seo_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_seo_pages_structured_data_gin ON seo_pages USING GIN (structured_data);

-- Trigger cập nhật updated_at cho seo_pages
DROP TRIGGER IF EXISTS update_seo_pages_updated_at ON seo_pages;
CREATE TRIGGER update_seo_pages_updated_at
    BEFORE UPDATE ON seo_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed dữ liệu mẫu cho SEO pages
INSERT INTO seo_pages (page_path, page_type, title, description, keywords, og_title, og_description, canonical_url)
VALUES
  ('/', 'home', 'SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam', 
   'SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến', 
   'SFB Technology, giải pháp công nghệ, chuyển đổi số, phần mềm Việt Nam',
   'SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam',
   'SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số',
   'https://sfb.vn/'),
  ('/products', 'products', 'Sản phẩm & Giải pháp - SFB Technology',
   'Khám phá các sản phẩm và giải pháp công nghệ của SFB Technology',
   'sản phẩm, giải pháp, phần mềm, công nghệ',
   'Sản phẩm & Giải pháp - SFB Technology',
   'Khám phá các sản phẩm và giải pháp công nghệ của SFB Technology',
   'https://sfb.vn/products'),
  ('/about', 'about', 'Về chúng tôi - SFB Technology',
   'Tìm hiểu về SFB Technology - Công ty công nghệ hàng đầu Việt Nam',
   'về chúng tôi, SFB Technology, công ty công nghệ',
   'Về chúng tôi - SFB Technology',
   'Tìm hiểu về SFB Technology - Công ty công nghệ hàng đầu Việt Nam',
   'https://sfb.vn/about'),
  ('/contact', 'contact', 'Liên hệ - SFB Technology',
   'Liên hệ với SFB Technology để được tư vấn về các giải pháp công nghệ',
   'liên hệ, tư vấn, SFB Technology',
   'Liên hệ - SFB Technology',
   'Liên hệ với SFB Technology để được tư vấn về các giải pháp công nghệ',
   'https://sfb.vn/contact'),
  ('/news', 'news', 'Tin tức - SFB Technology',
   'Cập nhật tin tức mới nhất về công nghệ, sản phẩm và hoạt động của SFB Technology',
   'tin tức, công nghệ, SFB Technology',
   'Tin tức - SFB Technology',
   'Cập nhật tin tức mới nhất về công nghệ, sản phẩm và hoạt động của SFB Technology',
   'https://sfb.vn/news'),
  ('/industries', 'industries', 'Lĩnh vực - SFB Technology',
   'Khám phá các lĩnh vực ứng dụng của SFB Technology',
   'lĩnh vực, ứng dụng, SFB Technology',
   'Lĩnh vực - SFB Technology',
   'Khám phá các lĩnh vực ứng dụng của SFB Technology',
   'https://sfb.vn/industries'),
  ('/careers', 'careers', 'Tuyển dụng - SFB Technology',
   'Cơ hội nghề nghiệp tại SFB Technology',
   'tuyển dụng, nghề nghiệp, SFB Technology',
   'Tuyển dụng - SFB Technology',
   'Cơ hội nghề nghiệp tại SFB Technology',
   'https://sfb.vn/careers')
ON CONFLICT (page_path) DO NOTHING;

-- Thêm permissions cho SEO module
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('seo.view', 'Xem cấu hình SEO', 'seo', 'Xem cấu hình SEO của các trang', TRUE),
  ('seo.manage', 'Quản lý SEO', 'seo', 'Thêm, sửa, xóa cấu hình SEO', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền SEO cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'seo.view',
  'seo.manage'
)
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================================================
-- SITE SETTINGS MANAGEMENT SCHEMA
-- ============================================================================

-- Bảng site_settings (Cấu hình chung của website)
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,  -- 'favicon', 'logo', 'slogan', 'phone', 'address', 'email', 'social_facebook', etc.
  setting_value TEXT,                          -- Giá trị của setting
  setting_type VARCHAR(50) DEFAULT 'text',     -- 'text', 'url', 'image', 'json'
  description TEXT,                             -- Mô tả setting
  category VARCHAR(50) DEFAULT 'general',       -- 'general', 'contact', 'social', 'seo'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);

-- Trigger cập nhật updated_at cho site_settings
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed dữ liệu mẫu cho site_settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, category)
VALUES
  ('favicon', '', 'image', 'Favicon của website', 'general'),
  ('logo', '', 'image', 'Logo chính của website', 'general'),
  ('slogan', 'Smart Solutions Business', 'text', 'Slogan của công ty', 'general'),
  ('site_name', 'SFB', 'text', 'Tên website', 'general'),
  ('site_description', 'SFB có một đội ngũ chuyên gia CNTT trẻ, có kiến thức chuyên sâu về Công nghệ Thông tin, Phát triển Web và phát triển phần mềm ứng dụng.', 'text', 'Mô tả website (hiển thị trong footer)', 'general'),
  ('phone', '0888 917 999', 'text', 'Số điện thoại liên hệ', 'contact'),
  ('email', 'info@sfb.vn', 'text', 'Email liên hệ', 'contact'),
  ('address', 'P303, Tầng 3, Khách sạn Thể thao, Số 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.', 'text', 'Địa chỉ văn phòng', 'contact'),
  ('social_facebook', 'https://www.facebook.com', 'url', 'Link Facebook', 'social'),
  ('social_twitter', 'https://twitter.com', 'url', 'Link Twitter', 'social'),
  ('social_linkedin', 'https://www.linkedin.com', 'url', 'Link LinkedIn', 'social'),
  ('social_instagram', 'https://www.instagram.com', 'url', 'Link Instagram', 'social'),
  ('footer_quick_links', '[{"name":"Trang chủ","href":"/"},{"name":"Giới thiệu SFB","href":"/about"},{"name":"Sản phẩm – Dịch vụ","href":"/solutions"},{"name":"Tuyển dụng","href":"/careers"},{"name":"Tin tức","href":"/news"},{"name":"Liên hệ","href":"/contact"}]', 'json', 'Danh sách liên kết nhanh trong footer (JSON array)', 'footer'),
  ('footer_solutions', '[{"name":"Tư vấn xây dựng và phát triển hệ thống","href":"/solutions"},{"name":"Cung cấp dịch vụ quản trị hệ thống","href":"/solutions"},{"name":"Thiết kế & xây dựng giải pháp cổng TTĐT","href":"/solutions"},{"name":"Cổng thông tin Chính phủ điện tử SharePoint","href":"/solutions"},{"name":"Outsourcing","href":"/solutions"},{"name":"Data Universal Numbering System","href":"/solutions"}]', 'json', 'Danh sách dịch vụ trong footer (JSON array)', 'footer')
ON CONFLICT (setting_key) DO NOTHING;