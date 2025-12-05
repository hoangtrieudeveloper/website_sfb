const { pool } = require('../config/database');

const mapCategory = (row) => ({
  code: row.code,
  name: row.name,
  description: row.description || '',
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// GET /api/admin/categories
exports.getCategories = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT code, name, description, is_active, created_at, updated_at
       FROM news_categories
       ORDER BY name ASC`,
    );
    return res.json({ success: true, data: rows.map(mapCategory) });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/categories/:code
exports.getCategoryByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { rows } = await pool.query(
      `SELECT code, name, description, is_active, created_at, updated_at
       FROM news_categories
       WHERE code = $1
       LIMIT 1`,
      [code],
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }
    return res.json({ success: true, data: mapCategory(rows[0]) });
  } catch (error) {
    return next(error);
  }
};

// POST /api/admin/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { code, name, description = '', isActive = true } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'code và name là bắt buộc' });
    }

    const { rows } = await pool.query(
      `INSERT INTO news_categories (code, name, description, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING code, name, description, is_active, created_at, updated_at`,
      [code, name, description, isActive],
    );

    return res.status(201).json({ success: true, data: mapCategory(rows[0]) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Mã code đã tồn tại' });
    }
    return next(error);
  }
};

// PUT /api/admin/categories/:code
exports.updateCategory = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description, isActive } = req.body;

    const fields = [];
    const params = [];

    const addField = (column, value) => {
      params.push(value);
      fields.push(`${column} = $${params.length}`);
    };

    if (name !== undefined) addField('name', name);
    if (description !== undefined) addField('description', description);
    if (isActive !== undefined) addField('is_active', isActive);

    if (!fields.length) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu để cập nhật' });
    }

    params.push(code);

    const { rows } = await pool.query(
      `UPDATE news_categories
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE code = $${params.length}
       RETURNING code, name, description, is_active, created_at, updated_at`,
      params,
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }

    return res.json({ success: true, data: mapCategory(rows[0]) });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/admin/categories/:code
exports.deleteCategory = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { rowCount } = await pool.query(
      `DELETE FROM news_categories WHERE code = $1`,
      [code],
    );

    if (!rowCount) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }

    return res.json({ success: true, message: 'Đã xóa danh mục' });
  } catch (error) {
    return next(error);
  }
};

