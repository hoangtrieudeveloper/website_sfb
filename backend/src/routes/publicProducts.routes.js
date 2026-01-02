const express = require('express');
const {
  getPublicHero,
  getPublicBenefits,
  getPublicListHeader,
  getPublicCta,
  getPublicTestimonials,
  getPublicProducts,
  getPublicCategories,
} = require('../controllers/publicProducts.controller');

const router = express.Router();

/**
 * @openapi
 * /api/public/products/hero:
 *   get:
 *     tags:
 *       - Public Products
 *     summary: Lấy hero section cho trang products (public)
 *     responses:
 *       200:
 *         description: Hero section data
 */
router.get('/hero', getPublicHero);

/**
 * @openapi
 * /api/public/products/benefits:
 *   get:
 *     tags:
 *       - Public Products
 *     summary: Lấy danh sách benefits cho trang products (public)
 *     responses:
 *       200:
 *         description: Benefits list
 */
router.get('/benefits', getPublicBenefits);

/**
 * @openapi
 * /api/public/products/list-header:
 *   get:
 *     tags:
 *       - Public Products
 *     summary: Lấy list header cho trang products (public)
 *     responses:
 *       200:
 *         description: List header data
 */
router.get('/list-header', getPublicListHeader);

/**
 * @openapi
 * /api/public/products/cta:
 *   get:
 *     tags:
 *       - Public Products
 *     summary: Lấy CTA section cho trang products (public)
 *     responses:
 *       200:
 *         description: CTA data
 */
router.get('/cta', getPublicCta);

/**
 * @openapi
 * /api/public/products/testimonials:
 *   get:
 *     tags:
 *       - Public Products
 *     summary: Lấy danh sách testimonials cho trang products (public)
 *     responses:
 *       200:
 *         description: Testimonials list
 */
router.get('/testimonials', getPublicTestimonials);

/**
 * @openapi
 * /api/public/products/list:
 *   get:
 *     tags:
 *       - Public Products
 *     summary: Lấy danh sách products (public)
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Products list
 */
router.get('/list', getPublicProducts);

/**
 * @openapi
 * /api/public/products/categories:
 *   get:
 *     tags:
 *       - Public Products
 *     summary: Lấy danh sách categories (public)
 *     responses:
 *       200:
 *         description: Categories list
 */
router.get('/categories', getPublicCategories);

module.exports = router;

