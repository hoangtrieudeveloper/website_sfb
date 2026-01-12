const { pool } = require('../config/database');

// Helper function để xử lý locale object: convert thành JSON string nếu là object, giữ nguyên nếu là string
const processLocaleField = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') {
    // Nếu là JSON string (bắt đầu bằng {), parse và stringify lại để đảm bảo format đúng
    if (value.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && (parsed.vi !== undefined || parsed.en !== undefined || parsed.ja !== undefined)) {
          return JSON.stringify(parsed);
        }
      } catch (e) {
        // Không phải JSON hợp lệ, trả về string gốc
      }
    }
    return value;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    // Kiểm tra xem có phải locale object không
    if (value.vi !== undefined || value.en !== undefined || value.ja !== undefined) {
      return JSON.stringify(value);
    }
  }
  return String(value);
};

// Helper function để parse locale field từ database: nếu là JSON string thì parse, nếu không thì trả về string
const parseLocaleField = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    // Thử parse JSON
    if (value.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && (parsed.vi !== undefined || parsed.en !== undefined || parsed.ja !== undefined)) {
          return parsed;
        }
      } catch (e) {
        // Không phải JSON hợp lệ, trả về string gốc
      }
    }
    return value;
  }
  return value;
};

// GET /api/admin/products/categories
exports.getCategories = async (req, res, next) => {
  try {
    const { active } = req.query;

    let query = `
      SELECT id, slug, name, icon_name, sort_order, is_active, created_at, updated_at
      FROM product_categories
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
        slug: row.slug,
        name: parseLocaleField(row.name),
        iconName: row.icon_name || '',
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

// GET /api/admin/products/categories/:id
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM product_categories WHERE id = $1',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        id: row.id,
        slug: row.slug,
        name: parseLocaleField(row.name),
        iconName: row.icon_name || '',
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

// POST /api/admin/products/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { slug, name, iconName = '', sortOrder = 0, isActive = true } = req.body;

    // Kiểm tra name không rỗng (hỗ trợ cả string và locale object)
    const nameStr = typeof name === 'string' ? name : (name?.vi || name?.en || name?.ja || '');
    if (!slug || !nameStr.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Slug và name không được để trống',
      });
    }

    const { rows } = await pool.query(
      `
        INSERT INTO product_categories (slug, name, icon_name, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [slug, processLocaleField(name), iconName, sortOrder, isActive],
    );

    return res.status(201).json({
      success: true,
      data: {
        id: rows[0].id,
        slug: rows[0].slug,
        name: parseLocaleField(rows[0].name),
        iconName: rows[0].icon_name || '',
        sortOrder: rows[0].sort_order || 0,
        isActive: rows[0].is_active !== undefined ? rows[0].is_active : true,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
      },
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại',
      });
    }
    return next(error);
  }
};

// PUT /api/admin/products/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { slug, name, iconName, sortOrder, isActive } = req.body;

    const fields = [];
    const params = [];

    const addField = (column, value) => {
      if (value !== undefined) {
        params.push(value);
        fields.push(`${column} = $${params.length}`);
      }
    };

    addField('slug', slug);
    if (name !== undefined) {
      addField('name', processLocaleField(name));
    }
    addField('icon_name', iconName);
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
        UPDATE product_categories
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${params.length}
        RETURNING *
      `,
      params,
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    return res.json({
      success: true,
      data: {
        id: rows[0].id,
        slug: rows[0].slug,
        name: parseLocaleField(rows[0].name),
        iconName: rows[0].icon_name || '',
        sortOrder: rows[0].sort_order || 0,
        isActive: rows[0].is_active !== undefined ? rows[0].is_active : true,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
      },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại',
      });
    }
    return next(error);
  }
};

// DELETE /api/admin/products/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem có products nào đang dùng category này không
    const { rows: products } = await pool.query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [id],
    );

    if (parseInt(products[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục đang có sản phẩm',
      });
    }

    const { rowCount } = await pool.query(
      'DELETE FROM product_categories WHERE id = $1',
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa danh mục',
    });
  } catch (error) {
    return next(error);
  }
};

