const { pool } = require('../config/database');

const mapCategory = (row) => ({
  code: row.code,
  name: row.name,
  description: row.description,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// GET /api/public/categories - Chỉ lấy danh mục active
exports.getPublicCategories = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT code, name, description, is_active, created_at, updated_at
       FROM news_categories
       WHERE is_active = true
       ORDER BY name ASC`,
    );
    return res.json({ success: true, data: rows.map(mapCategory) });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/categories/:code
exports.getPublicCategoryByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { rows } = await pool.query(
      `SELECT code, name, description, is_active, created_at, updated_at
       FROM news_categories
       WHERE code = $1 AND is_active = true
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

