const { pool } = require('../config/database');

// GET /api/public/categories - Chỉ lấy danh mục active
exports.getActiveCategories = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT code, name, description, parent_code, is_active
       FROM news_categories
       WHERE is_active = TRUE
       ORDER BY name ASC`,
    );

    return res.json({
      success: true,
      data: rows.map((row) => ({
        code: row.code,
        name: row.name,
        description: row.description || '',
        parentCode: row.parent_code || null,
        isActive: row.is_active,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/categories/:code
exports.getCategoryByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { rows } = await pool.query(
      `SELECT code, name, description, parent_code, is_active
       FROM news_categories
       WHERE code = $1
       LIMIT 1`,
      [code],
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }

    const row = rows[0];

    return res.json({
      success: true,
      data: {
        code: row.code,
        name: row.name,
        description: row.description || '',
        parentCode: row.parent_code || null,
        isActive: row.is_active,
      },
    });
  } catch (error) {
    return next(error);
  }
};
