const { pool } = require('../config/database');

// GET /api/admin/products/list-header
exports.getListHeader = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, data, is_active, created_at, updated_at 
       FROM products_sections 
       WHERE section_type = 'list-header' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const row = rows[0];
    const data = row.data || {};

    return res.json({
      success: true,
      data: {
        id: row.id,
        subtitle: data.subtitle || '',
        title: data.title || '',
        description: data.description || '',
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
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

    // Kiểm tra xem đã có list header chưa
    const { rows: existing } = await pool.query(
      `SELECT id FROM products_sections 
       WHERE section_type = 'list-header' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    const data = {
      subtitle: subtitle || '',
      title: title || '',
      description: description || '',
    };

    let result;

    if (existing.length > 0) {
      // Update existing
      const { rows } = await pool.query(
        `UPDATE products_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [JSON.stringify(data), isActive !== undefined ? isActive : true, existing[0].id],
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
