const { pool } = require('../config/database');

// Helper function to parse locale field from JSON string
const parseLocaleField = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null && ('vi' in parsed || 'en' in parsed || 'ja' in parsed)) {
        return parsed;
      }
    } catch (e) {
      // Not JSON, return as string
    }
    return value;
  }
  if (typeof value === 'object' && value !== null && ('vi' in value || 'en' in value || 'ja' in value)) {
    return value;
  }
  return value;
};

// Helper function to process locale field for database storage
const processLocaleField = (value) => {
  if (!value) return null;
  if (typeof value === 'object' && value !== null && ('vi' in value || 'en' in value || 'ja' in value)) {
    return JSON.stringify(value);
  }
  return typeof value === 'string' ? value : String(value);
};

// Helper function to extract string from locale object or return string as is
const extractString = (value, defaultValue = '') => {
  if (!value) return defaultValue;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && !Array.isArray(value)) {
    // If it's a locale object, return it as JSONB
    if ('vi' in value || 'en' in value || 'ja' in value) {
      return value; // Return locale object for JSONB storage
    }
  }
  return defaultValue;
};

// Helper function to extract string value for VARCHAR fields (fallback to vi locale)
const extractStringValue = (value, defaultValue = '', maxLength = 100) => {
  if (!value) return defaultValue;
  if (typeof value === 'string') {
    // Truncate if exceeds maxLength
    return value.length > maxLength ? value.substring(0, maxLength) : value;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    // If it's a locale object, extract vi value or first available
    if ('vi' in value || 'en' in value || 'ja' in value) {
      const str = value.vi || value.en || value.ja || defaultValue;
      return str.length > maxLength ? str.substring(0, maxLength) : str;
    }
  }
  return defaultValue;
};

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
        title: parseLocaleField(row.title),
        short: parseLocaleField(row.short || ''),
        points: Array.isArray(row.points) ? row.points.map(p => parseLocaleField(p)) : [],
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
        title: parseLocaleField(row.title),
        short: parseLocaleField(row.short || ''),
        points: Array.isArray(row.points) ? row.points.map(p => parseLocaleField(p)) : [],
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

    // Validate title - check if it's a locale object or string
    const titleValue = typeof title === 'object' && title !== null && ('vi' in title || 'en' in title || 'ja' in title)
      ? title
      : (title || '');
    const hasTitle = typeof titleValue === 'string' 
      ? titleValue.trim() !== ''
      : (titleValue.vi?.trim() || titleValue.en?.trim() || titleValue.ja?.trim() || '');

    if (!hasTitle) {
      return res.status(400).json({
        success: false,
        message: 'Title không được để trống',
      });
    }

    // Process locale fields for database storage
    const titleForDb = processLocaleField(title);
    const shortForDb = processLocaleField(short);
    const iconNameValue = extractStringValue(iconName, '', 100);

    // Process points - each point can be a locale object or string
    const processedPoints = Array.isArray(points) 
      ? points.map(p => processLocaleField(p))
      : [];

    const { rows } = await pool.query(
      `
        INSERT INTO industries (icon_name, title, short, points, gradient, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [
        iconNameValue,
        titleForDb, // TEXT column, no truncation needed
        shortForDb,
        JSON.stringify(processedPoints),
        gradient,
        sortOrder,
        isActive
      ],
    );

    return res.status(201).json({
      success: true,
      message: 'Đã tạo lĩnh vực thành công',
      data: {
        id: rows[0].id,
        iconName: rows[0].icon_name || '',
        title: parseLocaleField(rows[0].title),
        short: parseLocaleField(rows[0].short || ''),
        points: Array.isArray(rows[0].points) ? rows[0].points.map(p => parseLocaleField(p)) : [],
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

    // Validate title - check if it's a locale object or string
    const titleValue = typeof title === 'object' && title !== null && ('vi' in title || 'en' in title || 'ja' in title)
      ? title
      : (title || '');
    const hasTitle = typeof titleValue === 'string' 
      ? titleValue.trim() !== ''
      : (titleValue.vi?.trim() || titleValue.en?.trim() || titleValue.ja?.trim() || '');

    if (!hasTitle) {
      return res.status(400).json({
        success: false,
        message: 'Title không được để trống',
      });
    }

    // Process locale fields for database storage
    const titleForDb = processLocaleField(title);
    const shortForDb = processLocaleField(short);
    const iconNameValue = extractStringValue(iconName, '', 100);

    // Process points - each point can be a locale object or string
    const processedPoints = Array.isArray(points) 
      ? points.map(p => processLocaleField(p))
      : [];

    const { rows } = await pool.query(
      `
        UPDATE industries
        SET icon_name = $1, title = $2, short = $3, points = $4, gradient = $5, sort_order = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `,
      [
        iconNameValue,
        titleForDb, // TEXT column, no truncation needed
        shortForDb,
        JSON.stringify(processedPoints),
        gradient,
        sortOrder,
        isActive,
        id
      ],
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
        title: parseLocaleField(rows[0].title),
        short: parseLocaleField(rows[0].short || ''),
        points: Array.isArray(rows[0].points) ? rows[0].points.map(p => parseLocaleField(p)) : [],
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

