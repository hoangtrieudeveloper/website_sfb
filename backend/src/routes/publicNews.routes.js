const express = require('express');
const {
  getPublicNews,
  getPublicNewsBySlug,
  getFeaturedNews,
} = require('../controllers/publicNews.controller');

const router = express.Router();

/**
 * @openapi
 * /api/public/news:
 *   get:
 *     tags:
 *       - Public News
 *     summary: Danh sách bài viết công khai (không cần đăng nhập)
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo categoryId
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tiêu đề
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Chỉ lấy bài viết nổi bật
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 */
router.get('/', getPublicNews);

/**
 * @openapi
 * /api/public/news/featured:
 *   get:
 *     tags:
 *       - Public News
 *     summary: Lấy danh sách bài viết nổi bật
 *     responses:
 *       200:
 *         description: Danh sách bài viết nổi bật
 */
router.get('/featured', getFeaturedNews);

/**
 * @openapi
 * /api/public/news/{slug}:
 *   get:
 *     tags:
 *       - Public News
 *     summary: Chi tiết bài viết theo slug (không cần đăng nhập)
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin bài viết
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.get('/:slug', getPublicNewsBySlug);

module.exports = router;

