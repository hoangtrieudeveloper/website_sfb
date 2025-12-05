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

-- Insert user admin mặc định (password: admin123 - cần hash thật sau)
-- Lưu ý: Đây là password hash mẫu, nên thay bằng hash thật từ bcrypt
INSERT INTO users (email, password, name, role_id, status)
VALUES (
  'admin@sfb.local',
  -- Mật khẩu demo dạng plain-text để khớp với logic auth hiện tại (so sánh trực tiếp).
  -- Khi triển khai thật: hãy đổi sang password hash và cập nhật lại hàm xác thực.
  'admin123',
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
