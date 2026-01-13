const { pool } = require('../config/database');
const { applyLocaleToData, getLocaleFromRequest } = require('../utils/locale');

// GET /api/public/homepage - Lấy tất cả các blocks đang active
// Locale được đọc từ query ?locale= hoặc header Accept-Language
exports.getPublicHomepageBlocks = async (req, res, next) => {
  try {
    // Đọc locale từ query hoặc header Accept-Language
    const currentLocale = getLocaleFromRequest(req);
    
    const { rows } = await pool.query(
      `
      SELECT id, section_type, data, is_active, created_at, updated_at
      FROM homepage_blocks
      WHERE is_active = TRUE
      ORDER BY 
        CASE section_type
          WHEN 'hero' THEN 1
          WHEN 'aboutCompany' THEN 2
          WHEN 'features' THEN 3
          WHEN 'solutions' THEN 4
          WHEN 'trusts' THEN 5
          WHEN 'testimonials' THEN 6
          WHEN 'consult' THEN 7
          ELSE 8
        END
      `,
    );

    return res.json({
      success: true,
      data: rows.map(row => ({
        id: row.id,
        sectionType: row.section_type,
        data: applyLocaleToData(row.data || {}, currentLocale),
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/homepage/:sectionType - Lấy một block cụ thể (chỉ khi active)
// Locale được đọc từ query ?locale= hoặc header Accept-Language
exports.getPublicHomepageBlock = async (req, res, next) => {
  try {
    const { sectionType } = req.params;
    // Đọc locale từ query hoặc header Accept-Language
    const currentLocale = getLocaleFromRequest(req);

    const { rows } = await pool.query(
      'SELECT * FROM homepage_blocks WHERE section_type = $1 AND is_active = TRUE',
      [sectionType],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy khối ${sectionType} hoặc khối này đang bị tắt`,
      });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        id: row.id,
        sectionType: row.section_type,
        data: applyLocaleToData(row.data || {}, currentLocale),
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

