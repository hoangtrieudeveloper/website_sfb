const { pool } = require('../config/database');

// Chuẩn hóa dữ liệu menu trả về cho frontend
const mapMenu = (row) => ({
  id: row.id,
  title: row.title,
  url: row.url,
  position: row.position,
  parentId: row.parent_id,
  parentTitle: row.parent_title || null,
  sortOrder: row.sort_order || 0,
  icon: row.icon || '',
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// GET /api/admin/menus
exports.getMenus = async (req, res, next) => {
  try {
    const { position, search, active } = req.query;

    const conditions = [];
    const params = [];

    if (position) {
      params.push(position);
      conditions.push(`m.position = $${params.length}`);
    }

    if (typeof active !== 'undefined') {
      params.push(active === 'true');
      conditions.push(`m.is_active = $${params.length}`);
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      conditions.push(
        `(LOWER(m.title) LIKE $${params.length} OR LOWER(m.url) LIKE $${params.length})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        m.id,
        m.title,
        m.url,
        m.position,
        m.parent_id,
        pm.title AS parent_title,
        m.sort_order,
        m.icon,
        m.is_active,
        m.created_at,
        m.updated_at
      FROM menus m
      LEFT JOIN menus pm ON m.parent_id = pm.id
      ${whereClause}
      ORDER BY m.position, COALESCE(m.parent_id, m.id), m.sort_order, m.id
    `;

    const { rows } = await pool.query(query, params);

    return res.json({
      success: true,
      data: rows.map(mapMenu),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/menus/:id
exports.getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
        SELECT
          m.id,
          m.title,
          m.url,
          m.position,
          m.parent_id,
          pm.title AS parent_title,
          m.sort_order,
          m.icon,
          m.is_active,
          m.created_at,
          m.updated_at
        FROM menus m
        LEFT JOIN menus pm ON m.parent_id = pm.id
        WHERE m.id = $1
        LIMIT 1
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy menu',
      });
    }

    return res.json({
      success: true,
      data: mapMenu(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/admin/menus
exports.createMenu = async (req, res, next) => {
  try {
    const {
      title,
      url,
      position = 'header',
      parentId = null,
      sortOrder = 0,
      icon = '',
      isActive = true,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề menu không được để trống',
      });
    }

    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Đường dẫn (URL) không được để trống',
      });
    }

    const insertQuery = `
      INSERT INTO menus (
        title,
        url,
        position,
        parent_id,
        sort_order,
        icon,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const params = [
      title.trim(),
      url.trim(),
      position || 'header',
      parentId || null,
      Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
      icon || '',
      !!isActive,
    ];

    const { rows } = await pool.query(insertQuery, params);

    return res.status(201).json({
      success: true,
      data: mapMenu(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/menus/:id
exports.updateMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      url,
      position,
      parentId,
      sortOrder,
      icon,
      isActive,
    } = req.body;

    const fields = [];
    const params = [];

    const addField = (column, value) => {
      params.push(value);
      fields.push(`${column} = $${params.length}`);
    };

    if (title !== undefined) addField('title', title);
    if (url !== undefined) addField('url', url);
    if (position !== undefined) addField('position', position);
    if (parentId !== undefined) addField('parent_id', parentId || null);
    if (sortOrder !== undefined)
      addField(
        'sort_order',
        Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
      );
    if (icon !== undefined) addField('icon', icon);
    if (isActive !== undefined) addField('is_active', !!isActive);

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật',
      });
    }

    params.push(id);

    const updateQuery = `
      UPDATE menus
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${params.length}
      RETURNING *
    `;

    const { rows } = await pool.query(updateQuery, params);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy menu',
      });
    }

    return res.json({
      success: true,
      data: mapMenu(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/admin/menus/:id
exports.deleteMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM menus WHERE id = $1',
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy menu',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa menu',
    });
  } catch (error) {
    return next(error);
  }
};


