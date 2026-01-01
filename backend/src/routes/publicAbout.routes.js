const express = require('express');
const router = express.Router();
const {
  getPublicAboutHero,
  getPublicAboutCompany,
  getPublicAboutVisionMission,
  getPublicAboutCoreValues,
  getPublicAboutMilestones,
  getPublicAboutLeadership,
} = require('../controllers/publicAbout.controller');

/**
 * @openapi
 * /api/public/about/hero:
 *   get:
 *     tags:
 *       - Public About
 *     summary: Lấy thông tin hero section của trang About (chỉ khi active) (không cần đăng nhập)
 *     responses:
 *       200:
 *         description: Thông tin hero section
 */
router.get('/hero', getPublicAboutHero);

/**
 * @openapi
 * /api/public/about/company:
 *   get:
 *     tags:
 *       - Public About
 *     summary: Lấy thông tin company section của trang About (chỉ khi active) (không cần đăng nhập)
 *     responses:
 *       200:
 *         description: Thông tin company section
 */
router.get('/company', getPublicAboutCompany);

/**
 * @openapi
 * /api/public/about/vision-mission:
 *   get:
 *     tags:
 *       - Public About
 *     summary: Lấy thông tin vision-mission section của trang About (chỉ khi active) (không cần đăng nhập)
 *     responses:
 *       200:
 *         description: Thông tin vision-mission section
 */
router.get('/vision-mission', getPublicAboutVisionMission);

/**
 * @openapi
 * /api/public/about/core-values:
 *   get:
 *     tags:
 *       - Public About
 *     summary: Lấy thông tin core-values section của trang About (chỉ khi active) (không cần đăng nhập)
 *     responses:
 *       200:
 *         description: Thông tin core-values section
 */
router.get('/core-values', getPublicAboutCoreValues);

/**
 * @openapi
 * /api/public/about/milestones:
 *   get:
 *     tags:
 *       - Public About
 *     summary: Lấy thông tin milestones section của trang About (chỉ khi active) (không cần đăng nhập)
 *     responses:
 *       200:
 *         description: Thông tin milestones section
 */
router.get('/milestones', getPublicAboutMilestones);

/**
 * @openapi
 * /api/public/about/leadership:
 *   get:
 *     tags:
 *       - Public About
 *     summary: Lấy thông tin leadership section của trang About (chỉ khi active) (không cần đăng nhập)
 *     responses:
 *       200:
 *         description: Thông tin leadership section
 */
router.get('/leadership', getPublicAboutLeadership);

module.exports = router;

