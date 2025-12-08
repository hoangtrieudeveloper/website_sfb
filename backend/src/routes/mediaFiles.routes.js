const express = require('express');
const router = express.Router();
const mediaFilesController = require('../controllers/mediaFiles.controller');
const requireAuth = require('../middlewares/auth.middleware');

// GET /api/admin/media/files - Lấy danh sách files
router.get('/', requireAuth, mediaFilesController.getFiles);

// GET /api/admin/media/files/:id - Lấy thông tin file theo ID
router.get('/:id', requireAuth, mediaFilesController.getFileById);

// DELETE /api/admin/media/files/:id - Xóa file
router.delete('/:id', requireAuth, mediaFilesController.deleteFile);

// PUT /api/admin/media/files/:id - Cập nhật thông tin file
router.put('/:id', requireAuth, mediaFilesController.updateFile);

module.exports = router;
