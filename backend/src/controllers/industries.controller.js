const { pool } = require('../config/database');

// GET /api/admin/industries
exports.getIndustries = async (req, res, next) => {
  try {
    const { active } = req.query;

    let query = `
      SELECT id, icon_name, title, short, points, gradient, sort_order, is_active, created_at, updated_at
      FROM industries
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
        iconName: row.icon_name || '',
        title: row.title,
        short: row.short || '',
        points: row.points || [],
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

// GET /api/admin/industries/:id
exports.getIndustryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM industries WHERE id = $1',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lĩnh vực',
      });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        id: row.id,
        iconName: row.icon_name || '',
        title: row.title,
        short: row.short || '',
        points: row.points || [],
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

// POST /api/admin/industries
exports.createIndustry = async (req, res, next) => {
  try {
    const { iconName = '', title, short = '', points = [], gradient = '', sortOrder = 0, isActive = true } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title không được để trống',
      });
    }

    const { rows } = await pool.query(
      `
        INSERT INTO industries (icon_name, title, short, points, gradient, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [iconName, title, short, JSON.stringify(points), gradient, sortOrder, isActive],
    );

    return res.status(201).json({
      success: true,
      message: 'Đã tạo lĩnh vực thành công',
      data: {
        id: rows[0].id,
        iconName: rows[0].icon_name || '',
        title: rows[0].title,
        short: rows[0].short || '',
        points: rows[0].points || [],
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

// PUT /api/admin/industries/:id
exports.updateIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { iconName = '', title, short = '', points = [], gradient = '', sortOrder = 0, isActive = true } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title không được để trống',
      });
    }

    const { rows } = await pool.query(
      `
        UPDATE industries
        SET icon_name = $1, title = $2, short = $3, points = $4, gradient = $5, sort_order = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `,
      [iconName, title, short, JSON.stringify(points), gradient, sortOrder, isActive, id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lĩnh vực',
      });
    }

    return res.json({
      success: true,
      message: 'Đã cập nhật lĩnh vực thành công',
      data: {
        id: rows[0].id,
        iconName: rows[0].icon_name || '',
        title: rows[0].title,
        short: rows[0].short || '',
        points: rows[0].points || [],
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

// DELETE /api/admin/industries/:id
exports.deleteIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'DELETE FROM industries WHERE id = $1 RETURNING id',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lĩnh vực',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa lĩnh vực thành công',
    });
  } catch (error) {
    return next(error);
  }
};

