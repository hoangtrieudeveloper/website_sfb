const express = require('express');
const {
  getPublicHomepageBlocks,
  getPublicHomepageBlock,
} = require('../controllers/publicHomepage.controller');

const router = express.Router();

/**
 * @openapi
 * /api/public/homepage:
 *   get:
 *     tags:
 *       - Public Homepage
 *     summary: Lấy tất cả các blocks đang active trên trang chủ (không cần đăng nhập)
 *     responses:
 *       200:
 *         description: Danh sách các blocks đang active
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       sectionType:
 *                         type: string
 *                       data:
 *                         type: object
 *                       isActive:
 *                         type: boolean
 */
router.get('/', getPublicHomepageBlocks);

/**
 * @openapi
 * /api/public/homepage/{sectionType}:
 *   get:
 *     tags:
 *       - Public Homepage
 *     summary: Lấy một block cụ thể (chỉ khi active) (không cần đăng nhập)
 *     parameters:
 *       - in: path
 *         name: sectionType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [hero, aboutCompany, features, solutions, trusts, consult]
 *     responses:
 *       200:
 *         description: Thông tin block
 *       404:
 *         description: Không tìm thấy block hoặc block đang bị tắt
 */
router.get('/:sectionType', getPublicHomepageBlock);

module.exports = router;

