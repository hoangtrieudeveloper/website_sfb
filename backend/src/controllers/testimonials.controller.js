const { pool } = require('../config/database');

// GET /api/admin/testimonials
exports.getTestimonials = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC'
    );
    // Map snake_case to camelCase for frontend
    const mappedData = result.rows.map(row => ({
      id: row.id,
      quote: row.quote,
      author: row.author,
      company: row.company || null,
      rating: row.rating,
      sortOrder: row.sort_order,
      isActive: row.is_active !== undefined ? row.is_active : true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    res.json({
      success: true,
      data: mappedData,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/testimonials/:id
exports.getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM testimonials WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }
    // Map snake_case to camelCase for frontend
    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        quote: row.quote,
        author: row.author,
        company: row.company || null,
        rating: row.rating,
        sortOrder: row.sort_order,
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/testimonials
exports.createTestimonial = async (req, res, next) => {
  try {
    const { quote, author, company, rating, sortOrder, isActive } = req.body;

    if (!quote || !author) {
      return res.status(400).json({
        success: false,
        message: 'Quote và Author không được để trống',
      });
    }

    const result = await pool.query(
      `INSERT INTO testimonials (quote, author, company, rating, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [
        quote,
        author,
        company || null,
        rating || 5,
        sortOrder || 0,
        isActive !== undefined ? isActive : true,
      ]
    );

    // Map snake_case to camelCase for frontend
    const row = result.rows[0];
    res.status(201).json({
      success: true,
      data: {
        id: row.id,
        quote: row.quote,
        author: row.author,
        company: row.company || null,
        rating: row.rating,
        sortOrder: row.sort_order,
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
      message: 'Đã tạo đánh giá thành công',
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/testimonials/:id
exports.updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quote, author, company, rating, sortOrder, isActive } = req.body;

    if (!quote || !author) {
      return res.status(400).json({
        success: false,
        message: 'Quote và Author không được để trống',
      });
    }

    const result = await pool.query(
      `UPDATE testimonials
        SET quote = $1,
            author = $2,
            company = $3,
            rating = $4,
            sort_order = $5,
            is_active = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *`,
      [
        quote,
        author,
        company || null,
        rating || 5,
        sortOrder || 0,
        isActive !== undefined ? isActive : true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }

    // Map snake_case to camelCase for frontend
    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        quote: row.quote,
        author: row.author,
        company: row.company || null,
        rating: row.rating,
        sortOrder: row.sort_order,
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
      message: 'Đã cập nhật đánh giá thành công',
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/testimonials/:id
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa đánh giá thành công',
    });
  } catch (error) {
    next(error);
  }
};

