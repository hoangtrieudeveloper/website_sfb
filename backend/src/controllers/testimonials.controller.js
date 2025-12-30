const { pool } = require('../config/database');

// GET /api/admin/testimonials
exports.getTestimonials = async (req, res, next) => {
  try {
    const { active } = req.query;

    let query = `
      SELECT id, quote, author, company, rating, sort_order, is_active, created_at, updated_at
      FROM testimonials
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
        quote: row.quote || '',
        author: row.author,
        company: row.company || '',
        rating: row.rating || 5,
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

// GET /api/admin/testimonials/:id
exports.getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM testimonials WHERE id = $1',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        id: row.id,
        quote: row.quote || '',
        author: row.author,
        company: row.company || '',
        rating: row.rating || 5,
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

// POST /api/admin/testimonials
exports.createTestimonial = async (req, res, next) => {
  try {
    const { quote, author, company = '', rating = 5, sortOrder = 0, isActive = true } = req.body;

    if (!quote || !author) {
      return res.status(400).json({
        success: false,
        message: 'Quote và Author không được để trống',
      });
    }

    const { rows } = await pool.query(
      `
        INSERT INTO testimonials (quote, author, company, rating, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [quote, author, company, rating, sortOrder, isActive],
    );

    return res.status(201).json({
      success: true,
      message: 'Đã tạo đánh giá thành công',
      data: {
        id: rows[0].id,
        quote: rows[0].quote,
        author: rows[0].author,
        company: rows[0].company || '',
        rating: rows[0].rating || 5,
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

// PUT /api/admin/testimonials/:id
exports.updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quote, author, company = '', rating = 5, sortOrder = 0, isActive = true } = req.body;

    if (!quote || !author) {
      return res.status(400).json({
        success: false,
        message: 'Quote và Author không được để trống',
      });
    }

    const { rows } = await pool.query(
      `
        UPDATE testimonials
        SET quote = $1, author = $2, company = $3, rating = $4, sort_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `,
      [quote, author, company, rating, sortOrder, isActive, id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }

    return res.json({
      success: true,
      message: 'Đã cập nhật đánh giá thành công',
      data: {
        id: rows[0].id,
        quote: rows[0].quote,
        author: rows[0].author,
        company: rows[0].company || '',
        rating: rows[0].rating || 5,
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

// DELETE /api/admin/testimonials/:id
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING id',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa đánh giá thành công',
    });
  } catch (error) {
    return next(error);
  }
};

