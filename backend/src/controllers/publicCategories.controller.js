const { pool } = require('../config/database');
const { getLocaleFromRequest, getLocalizedValue } = require('../utils/locale');

// Helper function để parse locale field từ database
const parseLocaleField = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    // Thử parse JSON
    if (value.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && (parsed.vi !== undefined || parsed.en !== undefined || parsed.ja !== undefined)) {
          return parsed;
        }
      } catch (e) {
        // Không phải JSON hợp lệ, trả về string gốc
      }
    }
    return value;
  }
  return value;
};

// GET /api/public/categories - Chỉ lấy danh mục active
exports.getActiveCategories = async (req, res, next) => {
  try {
    const locale = getLocaleFromRequest(req);
    const { rows } = await pool.query(
      `SELECT code, name, description, parent_code, is_active
       FROM news_categories
       WHERE is_active = TRUE
       ORDER BY name ASC`,
    );

    return res.json({
      success: true,
      data: rows.map((row) => {
        const nameLocale = parseLocaleField(row.name);
        const descLocale = parseLocaleField(row.description);
        return {
          code: row.code,
          name: getLocalizedValue(nameLocale, locale),
          description: getLocalizedValue(descLocale, locale) || '',
          parentCode: row.parent_code || null,
          isActive: row.is_active,
        };
      }),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/categories/:code
exports.getCategoryByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const locale = getLocaleFromRequest(req);
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
    const nameLocale = parseLocaleField(row.name);
    const descLocale = parseLocaleField(row.description);

    return res.json({
      success: true,
      data: {
        code: row.code,
        name: getLocalizedValue(nameLocale, locale),
        description: getLocalizedValue(descLocale, locale) || '',
        parentCode: row.parent_code || null,
        isActive: row.is_active,
      },
    });
  } catch (error) {
    return next(error);
  }
};
