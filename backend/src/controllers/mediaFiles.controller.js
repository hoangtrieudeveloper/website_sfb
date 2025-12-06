const pool = require('../config/database').pool;
const fs = require('fs');
const path = require('path');
const { ensureTablesOnce } = require('../utils/ensureMediaTables');

// GET /api/admin/media/files
exports.getFiles = async (req, res, next) => {
  try {
    // Đảm bảo bảng đã được tạo
    await ensureTablesOnce();
    
    const { folder_id, file_type, search, page = 1, limit = 50, sort_by = 'created_at', sort_order = 'DESC' } = req.query;
    
    let query = `
      SELECT mf.*, u.name as uploaded_by_name
      FROM media_files mf
      LEFT JOIN users u ON mf.uploaded_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;
    
    if (folder_id !== undefined) {
      if (folder_id === null || folder_id === 'null') {
        query += ' AND mf.folder_id IS NULL';
      } else {
        query += ` AND mf.folder_id = $${paramIndex++}`;
        params.push(folder_id);
      }
    }
    
    if (file_type) {
      query += ` AND mf.file_type = $${paramIndex++}`;
      params.push(file_type);
    }
    
    if (search) {
      query += ` AND (mf.original_name ILIKE $${paramIndex} OR mf.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Validate sort_by
    const allowedSortFields = ['created_at', 'original_name', 'file_size', 'file_type'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY mf.${sortField} ${sortDir}`;
    
    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), offset);
    
    const { rows } = await pool.query(query, params);
    
    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM media_files WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;
    
    if (folder_id !== undefined) {
      if (folder_id === null || folder_id === 'null') {
        countQuery += ' AND folder_id IS NULL';
      } else {
        countQuery += ` AND folder_id = $${countParamIndex++}`;
        countParams.push(folder_id);
      }
    }
    
    if (file_type) {
      countQuery += ` AND file_type = $${countParamIndex++}`;
      countParams.push(file_type);
    }
    
    if (search) {
      countQuery += ` AND (original_name ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/media/files/:id
exports.getFileById = async (req, res, next) => {
  try {
    // Đảm bảo bảng đã được tạo
    await ensureTablesOnce();
    
    const { id } = req.params;
    
    const { rows } = await pool.query(
      `SELECT mf.*, u.name as uploaded_by_name
       FROM media_files mf
       LEFT JOIN users u ON mf.uploaded_by = u.id
       WHERE mf.id = $1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File không tồn tại',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/admin/media/files/:id
exports.deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Lấy thông tin file
    const { rows } = await pool.query(
      'SELECT * FROM media_files WHERE id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File không tồn tại',
      });
    }
    
    const file = rows[0];
    
    // Xóa file vật lý
    const filePath = path.join(__dirname, '../../', file.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Xóa record trong database
    await pool.query('DELETE FROM media_files WHERE id = $1', [id]);
    
    return res.status(200).json({
      success: true,
      message: 'Đã xóa file thành công',
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/media/files/:id
exports.updateFile = async (req, res, next) => {
  try {
    // Đảm bảo bảng đã được tạo
    await ensureTablesOnce();
    
    const { id } = req.params;
    const { folder_id, alt_text, description } = req.body;
    
    // Kiểm tra file có tồn tại không
    const existingFile = await pool.query(
      'SELECT * FROM media_files WHERE id = $1',
      [id]
    );
    
    if (existingFile.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File không tồn tại',
      });
    }
    
    const updateFields = [];
    const params = [];
    let paramIndex = 1;
    
    if (folder_id !== undefined) {
      // Kiểm tra folder có tồn tại không (nếu không phải null)
      if (folder_id !== null) {
        const folderCheck = await pool.query(
          'SELECT id FROM media_folders WHERE id = $1',
          [folder_id]
        );
        if (folderCheck.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Thư mục không tồn tại',
          });
        }
      }
      updateFields.push(`folder_id = $${paramIndex++}`);
      params.push(folder_id || null);
    }
    
    if (alt_text !== undefined) {
      updateFields.push(`alt_text = $${paramIndex++}`);
      params.push(alt_text || null);
    }
    
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      params.push(description || null);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật',
      });
    }
    
    params.push(id);
    
    const { rows } = await pool.query(
      `UPDATE media_files
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      params
    );
    
    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    return next(error);
  }
};
