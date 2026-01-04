const { pool } = require('../config/database');

// POST /api/public/contact (submit form)
exports.submitRequest = async (req, res, next) => {
  try {
    const { name, email, phone, company, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      });
    }

    // Insert contact request
    const { rows } = await pool.query(
      `INSERT INTO contact_requests (name, email, phone, company, service, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [name, email, phone, company || null, service, message]
    );

    return res.json({
      success: true,
      message: 'Đã gửi yêu cầu tư vấn thành công',
      data: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        phone: rows[0].phone,
        company: rows[0].company,
        service: rows[0].service,
        message: rows[0].message,
        status: rows[0].status,
        createdAt: rows[0].created_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/contact-requests
exports.getRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contact_requests WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Filter by status
    if (status && status !== 'all') {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    // Search by name, email, phone, or service
    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR phone ILIKE $${paramCount} OR service ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const { rows: countRows } = await pool.query(countQuery, params);
    const total = parseInt(countRows[0].count);

    // Add pagination and ordering
    paramCount++;
    query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    params.push(limit);
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const { rows } = await pool.query(query, params);

    return res.json({
      success: true,
      data: rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        company: row.company,
        service: row.service,
        message: row.message,
        status: row.status,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/contact-requests/:id
exports.getRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM contact_requests WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu tư vấn',
      });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        company: row.company,
        service: row.service,
        message: row.message,
        status: row.status,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/contact-requests/:id
exports.updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Check if request exists
    const { rows: existingRows } = await pool.query(
      'SELECT * FROM contact_requests WHERE id = $1',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu tư vấn',
      });
    }

    // Update request
    const updateFields = [];
    const params = [];
    let paramCount = 0;

    if (status !== undefined) {
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      params.push(status);
    }

    if (notes !== undefined) {
      paramCount++;
      updateFields.push(`notes = $${paramCount}`);
      params.push(notes);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật',
      });
    }

    paramCount++;
    params.push(id);

    await pool.query(
      `UPDATE contact_requests 
       SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount}`,
      params
    );

    // Get updated request
    const { rows: updatedRows } = await pool.query(
      'SELECT * FROM contact_requests WHERE id = $1',
      [id]
    );

    const row = updatedRows[0];
    return res.json({
      success: true,
      message: 'Đã cập nhật yêu cầu tư vấn thành công',
      data: {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        company: row.company,
        service: row.service,
        message: row.message,
        status: row.status,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/admin/contact-requests/:id
exports.deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if request exists
    const { rows } = await pool.query(
      'SELECT * FROM contact_requests WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu tư vấn',
      });
    }

    // Delete request
    await pool.query('DELETE FROM contact_requests WHERE id = $1', [id]);

    return res.json({
      success: true,
      message: 'Đã xóa yêu cầu tư vấn thành công',
    });
  } catch (error) {
    return next(error);
  }
};

