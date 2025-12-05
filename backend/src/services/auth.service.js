const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * Xác thực user bằng database (bảng users / roles / role_permissions).
 * Password được hash bằng bcrypt và so sánh an toàn.
 */
exports.authenticateDemoUser = async ({ email, password }) => {
  if (!email || !password) return null;

  // Tìm user theo email
  const { rows } = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.name,
      u.password,
      u.status,
      u.role_id,
      r.code AS role_code,
      r.name AS role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
    LIMIT 1
  `,
    [email],
  );

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0];

  // Chỉ cho phép user đang active
  if (user.status !== 'active') {
    return null;
  }

  // So sánh password với bcrypt hash
  // Tất cả password trong DB đã được hash bằng bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password).catch(() => false);

  if (!isPasswordValid) {
    return null;
  }

  // Lấy danh sách quyền theo role
  const { rows: permRows } = await pool.query(
    `
    SELECT p.code
    FROM role_permissions rp
    JOIN permissions p ON p.id = rp.permission_id
    WHERE rp.role_id = $1
      AND p.is_active = TRUE
  `,
    [user.role_id],
  );

  const permissions = permRows.map((p) => p.code);

  return {
    token: 'demo-token-123',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.role_id,
      roleCode: user.role_code,
      roleName: user.role_name,
      status: user.status,
      permissions,
    },
    // thời gian sống token (giống phía Next dùng set cookie)
    expiresIn: 60 * 60 * 24 * 7,
  };
};

