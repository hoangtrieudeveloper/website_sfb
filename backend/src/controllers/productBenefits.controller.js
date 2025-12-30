const { pool } = require('../config/database');

// GET /api/admin/products/benefits
exports.getBenefits = async (req, res, next) => {
  try {
    const { active } = req.query;

    let query = `
      SELECT id, icon, title, description, gradient, sort_order, is_active, created_at, updated_at
      FROM product_benefits
    `;
    const params = [];

    if (active !== undefined) {
      params.push(active === 'true');
      query += ` WHERE is_active = $1`;
    }

    query += ` ORDER BY sort_order ASC, id ASC`;

    const { rows } = await pool.query(query, params);

    return res.json({
      success: true,
      data: rows.map(row => ({
        id: row.id,
        icon: row.icon || '',
        title: row.title,
        description: row.description || '',
        gradient: row.gradient || '',
        sortOrder: row.sort_order || 0,
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/products/benefits/:id
exports.getBenefitById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM product_benefits WHERE id = $1',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lợi ích',
      });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        id: row.id,
        icon: row.icon || '',
        title: row.title,
        description: row.description || '',
        gradient: row.gradient || '',
        sortOrder: row.sort_order || 0,
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/admin/products/benefits
exports.createBenefit = async (req, res, next) => {
  try {
    const { icon = '', title, description = '', gradient = '', sortOrder = 0, isActive = true } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title không được để trống',
      });
    }

    const { rows } = await pool.query(
      `
        INSERT INTO product_benefits (icon, title, description, gradient, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [icon, title, description, gradient, sortOrder, isActive],
    );

    return res.status(201).json({
      success: true,
      data: {
        id: rows[0].id,
        icon: rows[0].icon || '',
        title: rows[0].title,
        description: rows[0].description || '',
        gradient: rows[0].gradient || '',
        sortOrder: rows[0].sort_order || 0,
        isActive: rows[0].is_active !== undefined ? rows[0].is_active : true,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/products/benefits/:id
exports.updateBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { icon, title, description, gradient, sortOrder, isActive } = req.body;

    const fields = [];
    const params = [];

    const addField = (column, value) => {
      if (value !== undefined) {
        params.push(value);
        fields.push(`${column} = $${params.length}`);
      }
    };

    addField('icon', icon);
    addField('title', title);
    addField('description', description);
    addField('gradient', gradient);
    addField('sort_order', sortOrder);
    addField('is_active', isActive);

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật',
      });
    }

    params.push(id);

    const { rows } = await pool.query(
      `
        UPDATE product_benefits
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${params.length}
        RETURNING *
      `,
      params,
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lợi ích',
      });
    }

    return res.json({
      success: true,
      data: {
        id: rows[0].id,
        icon: rows[0].icon || '',
        title: rows[0].title,
        description: rows[0].description || '',
        gradient: rows[0].gradient || '',
        sortOrder: rows[0].sort_order || 0,
        isActive: rows[0].is_active !== undefined ? rows[0].is_active : true,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/admin/products/benefits/:id
exports.deleteBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM product_benefits WHERE id = $1',
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lợi ích',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa lợi ích',
    });
  } catch (error) {
    return next(error);
  }
};

