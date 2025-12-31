const { pool } = require('../config/database');

// GET /api/admin/products/benefits
exports.getBenefits = async (req, res, next) => {
  try {
    const { active } = req.query;

    // Lấy benefits section
    const { rows: sections } = await pool.query(
      `SELECT id FROM products_sections 
       WHERE section_type = 'benefits' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    if (sections.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const sectionId = sections[0].id;

    let query = `
      SELECT id, data, sort_order, is_active, created_at, updated_at
      FROM products_section_items
      WHERE section_id = $1 AND section_type = 'benefits'
    `;
    const params = [sectionId];

    if (active !== undefined) {
      params.push(active === 'true');
      query += ` AND is_active = $2`;
    }

    query += ` ORDER BY sort_order ASC, id ASC`;

    const { rows } = await pool.query(query, params);

    return res.json({
      success: true,
      data: rows.map(row => {
        const data = row.data || {};
        return {
          id: row.id,
          icon: data.icon || '',
          title: data.title || '',
          description: data.description || '',
          gradient: data.gradient || '',
          sortOrder: row.sort_order || 0,
          isActive: row.is_active !== undefined ? row.is_active : true,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }),
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
      `SELECT id, data, sort_order, is_active, created_at, updated_at
       FROM products_section_items
       WHERE id = $1 AND section_type = 'benefits'`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lợi ích',
      });
    }

    const row = rows[0];
    const data = row.data || {};

    return res.json({
      success: true,
      data: {
        id: row.id,
        icon: data.icon || '',
        title: data.title || '',
        description: data.description || '',
        gradient: data.gradient || '',
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

    // Lấy hoặc tạo benefits section
    let { rows: sections } = await pool.query(
      `SELECT id FROM products_sections 
       WHERE section_type = 'benefits' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    let sectionId;
    if (sections.length === 0) {
      const { rows: newSection } = await pool.query(
        `INSERT INTO products_sections (section_type, data, is_active)
         VALUES ('benefits', '{}'::jsonb, true)
         RETURNING id`,
      );
      sectionId = newSection[0].id;
    } else {
      sectionId = sections[0].id;
    }

    const data = {
      icon,
      title,
      description,
      gradient,
    };

    const { rows } = await pool.query(
      `INSERT INTO products_section_items (section_id, section_type, data, sort_order, is_active)
       VALUES ($1, 'benefits', $2, $3, $4)
       RETURNING id, data, sort_order, is_active, created_at, updated_at`,
      [sectionId, JSON.stringify(data), sortOrder, isActive],
    );

    const row = rows[0];
    const rowData = row.data || {};

    return res.status(201).json({
      success: true,
      data: {
        id: row.id,
        icon: rowData.icon || '',
        title: rowData.title || '',
        description: rowData.description || '',
        gradient: rowData.gradient || '',
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

// PUT /api/admin/products/benefits/:id
exports.updateBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { icon, title, description, gradient, sortOrder, isActive } = req.body;

    // Lấy benefit hiện tại
    const { rows: existing } = await pool.query(
      `SELECT data FROM products_section_items WHERE id = $1 AND section_type = 'benefits'`,
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lợi ích',
      });
    }

    const currentData = existing[0].data || {};
    const data = {
      icon: icon !== undefined ? icon : currentData.icon,
      title: title !== undefined ? title : currentData.title,
      description: description !== undefined ? description : currentData.description,
      gradient: gradient !== undefined ? gradient : currentData.gradient,
    };

    const fields = [];
    const params = [];

    fields.push('data = $' + (params.length + 1));
    params.push(JSON.stringify(data));

    if (sortOrder !== undefined) {
      fields.push('sort_order = $' + (params.length + 1));
      params.push(sortOrder);
    }

    if (isActive !== undefined) {
      fields.push('is_active = $' + (params.length + 1));
      params.push(isActive);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const { rows } = await pool.query(
      `UPDATE products_section_items
       SET ${fields.join(', ')}
       WHERE id = $${params.length}
       RETURNING id, data, sort_order, is_active, created_at, updated_at`,
      params,
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lợi ích',
      });
    }

    const row = rows[0];
    const rowData = row.data || {};

    return res.json({
      success: true,
      data: {
        id: row.id,
        icon: rowData.icon || '',
        title: rowData.title || '',
        description: rowData.description || '',
        gradient: rowData.gradient || '',
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

// DELETE /api/admin/products/benefits/:id
exports.deleteBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM products_section_items WHERE id = $1 AND section_type = \'benefits\'',
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
