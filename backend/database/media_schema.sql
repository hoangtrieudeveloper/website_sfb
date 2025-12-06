-- Database Schema cho Media Library
-- Chạy file này để khởi tạo các bảng cho quản lý thư viện media

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

-- Tạo index cho media_folders
CREATE INDEX IF NOT EXISTS idx_media_folders_parent_id ON media_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_media_folders_slug ON media_folders(slug);

-- Trigger cập nhật updated_at cho media_folders
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
  file_type VARCHAR(50) NOT NULL, -- image, document, video, audio, etc.
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL, -- bytes
  width INTEGER, -- cho ảnh
  height INTEGER, -- cho ảnh
  alt_text TEXT,
  description TEXT,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho media_files
CREATE INDEX IF NOT EXISTS idx_media_files_folder_id ON media_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_files_file_type ON media_files(file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at);

-- Trigger cập nhật updated_at cho media_files
DROP TRIGGER IF EXISTS update_media_files_updated_at ON media_files;
CREATE TRIGGER update_media_files_updated_at
    BEFORE UPDATE ON media_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert một số thư mục mặc định
INSERT INTO media_folders (name, slug, parent_id, description)
VALUES
  ('Root', 'root', NULL, 'Thư mục gốc'),
  ('Images', 'images', NULL, 'Thư mục chứa hình ảnh'),
  ('Documents', 'documents', NULL, 'Thư mục chứa tài liệu'),
  ('Icons', 'icons', NULL, 'Thư mục chứa icons'),
  ('Projects', 'projects', NULL, 'Thư mục dự án')
ON CONFLICT (slug) DO NOTHING;
