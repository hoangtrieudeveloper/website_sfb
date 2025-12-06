const express = require('express');
const {
  getFiles,
  getFileById,
  deleteFile,
  updateFile,
} = require('../controllers/mediaFiles.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @openapi
 * /api/admin/media/files:
 *   get:
 *     tags:
 *       - Media Files
 *     summary: Lấy danh sách file media
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder_id
 *         schema:
 *           type: integer
 *           nullable: true
 *       - in: query
 *         name: file_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách file
 */
router.get('/', requireAuth, getFiles);

/**
 * @openapi
 * /api/admin/media/files/:id:
 *   get:
 *     tags:
 *       - Media Files
 *     summary: Lấy thông tin file theo ID
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', requireAuth, getFileById);

/**
 * @openapi
 * /api/admin/media/files/:id:
 *   put:
 *     tags:
 *       - Media Files
 *     summary: Cập nhật thông tin file
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', requireAuth, updateFile);

/**
 * @openapi
 * /api/admin/media/files/:id:
 *   delete:
 *     tags:
 *       - Media Files
 *     summary: Xóa file
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', requireAuth, deleteFile);

module.exports = router;
