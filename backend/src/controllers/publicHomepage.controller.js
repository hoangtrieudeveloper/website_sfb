const { pool } = require('../config/database');

// GET /api/public/homepage - Lấy tất cả các blocks đang active
exports.getPublicHomepageBlocks = async (req, res, next) => {
  try {
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
        data: row.data || {},
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
exports.getPublicHomepageBlock = async (req, res, next) => {
  try {
    const { sectionType } = req.params;

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
        data: row.data || {},
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

