const fs = require('fs');
const path = require('path');
const pool = require('../config/database').pool;
const { ensureTablesOnce } = require('../utils/ensureMediaTables');

const mediaUploadsDir = path.join(__dirname, '../../uploads/media');

function ensureFolderDirectory(folderId) {
  const folderPath = path.join(mediaUploadsDir, `folder-${folderId}`);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return folderPath;
}

// Helper function để tạo slug từ name
function createSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/admin/media/folders
exports.getFolders = async (req, res, next) => {
  try {
    // Đảm bảo bảng đã được tạo
    await ensureTablesOnce();
    
    const { parent_id } = req.query;
    
    let query = 'SELECT * FROM media_folders';
    const params = [];
    
    if (parent_id !== undefined) {
      if (parent_id === null || parent_id === 'null') {
        query += ' WHERE parent_id IS NULL';
      } else {
        query += ' WHERE parent_id = $1';
        params.push(parent_id);
      }
    }
    
    query += ' ORDER BY name ASC';
    
    const { rows } = await pool.query(query, params);
    
    // Đếm số file trong mỗi folder
    const foldersWithCount = await Promise.all(
      rows.map(async (folder) => {
        const countResult = await pool.query(
          'SELECT COUNT(*) as count FROM media_files WHERE folder_id = $1',
          [folder.id]
        );
        return {
          ...folder,
          fileCount: parseInt(countResult.rows[0].count),
        };
      })
    );
    
    return res.status(200).json({
      success: true,
      data: foldersWithCount,
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/media/folders/tree
exports.getFolderTree = async (req, res, next) => {
  try {
    // Đảm bảo bảng đã được tạo
    await ensureTablesOnce();
    
    const { rows } = await pool.query(
      'SELECT * FROM media_folders ORDER BY name ASC'
    );
    
    // Đếm số file trong mỗi folder
    const foldersWithCount = await Promise.all(
      rows.map(async (folder) => {
        const countResult = await pool.query(
          'SELECT COUNT(*) as count FROM media_files WHERE folder_id = $1',
          [folder.id]
        );
        return {
          ...folder,
          fileCount: parseInt(countResult.rows[0].count),
        };
      })
    );
    
    // Xây dựng cây thư mục
    const folderMap = new Map();
    const rootFolders = [];
    
    foldersWithCount.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });
    
    foldersWithCount.forEach((folder) => {
      const folderNode = folderMap.get(folder.id);
      if (folder.parent_id) {
        const parent = folderMap.get(folder.parent_id);
        if (parent) {
          parent.children.push(folderNode);
        }
      } else {
        rootFolders.push(folderNode);
      }
    });
    
    return res.status(200).json({
      success: true,
      data: rootFolders,
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/media/folders/:id
exports.getFolderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { rows } = await pool.query(
      'SELECT * FROM media_folders WHERE id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Thư mục không tồn tại',
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

// POST /api/admin/media/folders
exports.createFolder = async (req, res, next) => {
  try {
    const { name, parent_id, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên thư mục không được để trống',
      });
    }
    
    // Đảm bảo bảng đã được tạo
    await ensureTablesOnce();
    
    // Tạo slug unique
    let slug = createSlug(name);
    let counter = 1;
    let existingFolder = await pool.query(
      'SELECT id FROM media_folders WHERE slug = $1',
      [slug]
    );
    
    while (existingFolder.rows.length > 0) {
      slug = `${createSlug(name)}-${counter}`;
      existingFolder = await pool.query(
        'SELECT id FROM media_folders WHERE slug = $1',
        [slug]
      );
      counter++;
    }
    
    // Kiểm tra parent_id có tồn tại không
    if (parent_id) {
      const parentCheck = await pool.query(
        'SELECT id FROM media_folders WHERE id = $1',
        [parent_id]
      );
      if (parentCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Thư mục cha không tồn tại',
        });
      }
    }
    
    const { rows } = await pool.query(
      `INSERT INTO media_folders (name, slug, parent_id, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), slug, parent_id || null, description || null]
    );
    
    ensureFolderDirectory(rows[0].id);
    
    return res.status(201).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/media/folders/:id
exports.updateFolder = async (req, res, next) => {
  try {
    // Đảm bảo bảng đã được tạo
    await ensureTablesOnce();
    
    const { id } = req.params;
    const { name, parent_id, description } = req.body;
    
    // Kiểm tra folder có tồn tại không
    const existingFolder = await pool.query(
      'SELECT * FROM media_folders WHERE id = $1',
      [id]
    );
    
    if (existingFolder.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Thư mục không tồn tại',
      });
    }
    
    // Kiểm tra không được set parent_id là chính nó
    if (parent_id && parseInt(parent_id) === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Không thể đặt thư mục cha là chính nó',
      });
    }
    
    // Kiểm tra parent_id có tồn tại không
    if (parent_id) {
      const parentCheck = await pool.query(
        'SELECT id FROM media_folders WHERE id = $1',
        [parent_id]
      );
      if (parentCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Thư mục cha không tồn tại',
        });
      }
    }
    
    const updateFields = [];
    const params = [];
    let paramIndex = 1;
    
    if (name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`);
      params.push(name.trim());
    }
    
    if (parent_id !== undefined) {
      updateFields.push(`parent_id = $${paramIndex++}`);
      params.push(parent_id || null);
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
    
    // Nếu đổi tên, cập nhật slug
    if (name !== undefined) {
      let slug = createSlug(name);
      let counter = 1;
      let existingSlug = await pool.query(
        'SELECT id FROM media_folders WHERE slug = $1 AND id != $2',
        [slug, id]
      );
      
      while (existingSlug.rows.length > 0) {
        slug = `${createSlug(name)}-${counter}`;
        existingSlug = await pool.query(
          'SELECT id FROM media_folders WHERE slug = $1 AND id != $2',
          [slug, id]
        );
        counter++;
      }
      
      updateFields.push(`slug = $${paramIndex++}`);
      params.push(slug);
    }
    
    params.push(id);
    
    const { rows } = await pool.query(
      `UPDATE media_folders
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

// DELETE /api/admin/media/folders/:id
exports.deleteFolder = async (req, res, next) => {
  try {
    // Đảm bảo bảng đã được tạo
    await ensureTablesOnce();
    
    const { id } = req.params;
    
    // Kiểm tra folder có tồn tại không
    const existingFolder = await pool.query(
      'SELECT * FROM media_folders WHERE id = $1',
      [id]
    );
    
    if (existingFolder.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Thư mục không tồn tại',
      });
    }
    
    // Kiểm tra có file trong folder không
    const fileCount = await pool.query(
      'SELECT COUNT(*) as count FROM media_files WHERE folder_id = $1',
      [id]
    );
    
    if (parseInt(fileCount.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa thư mục có chứa file. Vui lòng xóa hoặc di chuyển file trước.',
      });
    }
    
    // Kiểm tra có thư mục con không
    const childCount = await pool.query(
      'SELECT COUNT(*) as count FROM media_folders WHERE parent_id = $1',
      [id]
    );
    
    if (parseInt(childCount.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa thư mục có chứa thư mục con. Vui lòng xóa thư mục con trước.',
      });
    }
    
    await pool.query('DELETE FROM media_folders WHERE id = $1', [id]);
    
    return res.status(200).json({
      success: true,
      message: 'Đã xóa thư mục thành công',
    });
  } catch (error) {
    return next(error);
  }
};
