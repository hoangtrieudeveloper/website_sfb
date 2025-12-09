const express = require('express');
const {
  getActiveCategories,
  getCategoryByCode,
} = require('../controllers/publicCategories.controller');

const router = express.Router();

/**
 * @openapi
 * /api/public/categories:
 *   get:
 *     tags:
 *       - Public Categories
 *     summary: Danh sách danh mục tin tức công khai (chỉ active)
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/', getActiveCategories);

/**
 * @openapi
 * /api/public/categories/{code}:
 *   get:
 *     tags:
 *       - Public Categories
 *     summary: Chi tiết danh mục
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get('/:code', getCategoryByCode);

module.exports = router;

