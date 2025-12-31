const express = require('express');
const router = express.Router();
const {
  getHero,
  getBenefits,
  getPositions,
  getCTA,
} = require('../controllers/publicCareers.controller');

/**
 * @swagger
 * /api/public/careers/hero:
 *   get:
 *     summary: Lấy thông tin Hero section của trang Careers
 *     tags: [Public Careers]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/hero', getHero);

/**
 * @swagger
 * /api/public/careers/benefits:
 *   get:
 *     summary: Lấy danh sách Benefits
 *     tags: [Public Careers]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/benefits', getBenefits);

/**
 * @swagger
 * /api/public/careers/positions:
 *   get:
 *     summary: Lấy danh sách Positions
 *     tags: [Public Careers]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/positions', getPositions);

/**
 * @swagger
 * /api/public/careers/cta:
 *   get:
 *     summary: Lấy thông tin CTA section
 *     tags: [Public Careers]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/cta', getCTA);

module.exports = router;

