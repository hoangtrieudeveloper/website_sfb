const { pool } = require('../config/database');

// GET /api/admin/industries/list-header
exports.getListHeader = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM industries_list_header WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        id: row.id,
        title: row.title || '',
        description: row.description || '',
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/industries/list-header
exports.updateListHeader = async (req, res, next) => {
  try {
    const { title, description, isActive } = req.body;

    // Kiểm tra xem đã có header chưa
    const { rows: existing } = await pool.query(
      'SELECT id FROM industries_list_header WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    let result;

    if (existing.length > 0) {
      // Update existing
      const { rows } = await pool.query(
        `
          UPDATE industries_list_header
          SET
            title = $1,
            description = $2,
            is_active = $3,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $4
          RETURNING *
        `,
        [
          title || '',
          description || '',
          isActive !== undefined ? isActive : true,
          existing[0].id,
        ],
      );
      result = rows[0];
    } else {
      // Create new
      const { rows } = await pool.query(
        `
          INSERT INTO industries_list_header (title, description, is_active)
          VALUES ($1, $2, $3)
          RETURNING *
        `,
        [
          title || '',
          description || '',
          isActive !== undefined ? isActive : true,
        ],
      );
      result = rows[0];
    }

    return res.json({
      success: true,
      message: 'Đã cập nhật list header thành công',
      data: {
        id: result.id,
        title: result.title || '',
        description: result.description || '',
        isActive: result.is_active !== undefined ? result.is_active : true,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

