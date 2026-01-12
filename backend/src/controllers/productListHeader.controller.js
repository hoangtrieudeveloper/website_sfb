const { pool } = require('../config/database');

// Helper function to get section regardless of is_active status (for admin)
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    `SELECT id, data, is_active, created_at, updated_at 
     FROM products_sections 
     WHERE section_type = $1 
     ORDER BY id DESC LIMIT 1`,
    [sectionType],
  );
  return rows.length > 0 ? rows[0] : null;
};

// GET /api/admin/products/list-header
exports.getListHeader = async (req, res, next) => {
  try {
    const section = await getSectionAnyStatus('list-header');

    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};

    return res.json({
      success: true,
      data: {
        id: section.id,
        subtitle: data.subtitle || '',
        title: data.title || '',
        description: data.description || '',
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/products/list-header
exports.updateListHeader = async (req, res, next) => {
  try {
    const { subtitle, title, description, isActive } = req.body;

    // Kiểm tra xem đã có list header chưa (bất kể is_active status)
    const existing = await getSectionAnyStatus('list-header');

    // Get existing data to preserve fields that are not provided
    const existingData = existing?.data || {};

    // Helper function to check if a value is not empty (handles both string and locale objects)
    const isNotEmpty = (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Check if it's a locale object
        if (value.vi !== undefined || value.en !== undefined || value.ja !== undefined) {
          return (value.vi && value.vi.trim() !== '') || (value.en && value.en.trim() !== '') || (value.ja && value.ja.trim() !== '');
        }
      }
      return false;
    };

    const data = {
      subtitle: isNotEmpty(subtitle) ? subtitle : (existingData.subtitle || ''),
      title: isNotEmpty(title) ? title : (existingData.title || ''),
      description: isNotEmpty(description) ? description : (existingData.description || ''),
    };

    let result;

    if (existing) {
      // Update existing
      const { rows } = await pool.query(
        `UPDATE products_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [JSON.stringify(data), isActive !== undefined ? isActive : (existing.is_active !== undefined ? existing.is_active : true), existing.id],
      );
      result = rows[0];
    } else {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO products_sections (section_type, data, is_active)
         VALUES ('list-header', $1, $2)
         RETURNING *`,
        [JSON.stringify(data), isActive !== undefined ? isActive : true],
      );
      result = rows[0];
    }

    const resultData = result.data || {};

    return res.json({
      success: true,
      message: 'Đã cập nhật list header thành công',
      data: {
        id: result.id,
        subtitle: resultData.subtitle || '',
        title: resultData.title || '',
        description: resultData.description || '',
        isActive: result.is_active !== undefined ? result.is_active : true,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};
