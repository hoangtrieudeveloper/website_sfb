-- Thêm permissions cho Media Library
INSERT INTO permissions (code, name, module, description, is_active)
VALUES
  ('media.view', 'Xem thư viện Media', 'media', 'Truy cập và xem thư viện media', TRUE),
  ('media.manage', 'Quản lý thư viện Media', 'media', 'Upload, xóa, quản lý file và thư mục media', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Gán quyền media cho role admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('media.view', 'media.manage')
WHERE r.code = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Gán quyền media cho role editor (chỉ view)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code = 'media.view'
WHERE r.code = 'editor'
ON CONFLICT (role_id, permission_id) DO NOTHING;
