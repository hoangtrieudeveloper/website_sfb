const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProduct,
} = require('../controllers/products.controller');
const {
  getProductDetail,
  saveProductDetail,
} = require('../controllers/productDetails.controller');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/productCategories.controller');
const {
  getBenefits,
  getBenefitById,
  createBenefit,
  updateBenefit,
  deleteBenefit,
} = require('../controllers/productBenefits.controller');
const {
  getHero,
  updateHero,
} = require('../controllers/productHero.controller');
const {
  getContact,
  updateContact,
} = require('../controllers/productContact.controller');

const router = express.Router();

/**
 * @openapi
 * /api/admin/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Danh sách sản phẩm
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
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
router.get('/', getProducts);

// Đặt các route cụ thể TRƯỚC route /:id để tránh conflict
// Categories routes
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Benefits routes
router.get('/benefits', getBenefits);
router.get('/benefits/:id', getBenefitById);
router.post('/benefits', createBenefit);
router.put('/benefits/:id', updateBenefit);
router.delete('/benefits/:id', deleteBenefit);

// Hero routes - phải đặt trước /:id
router.get('/hero', getHero);
router.put('/hero', updateHero);

// Contact Banner routes - phải đặt trước /:id
router.get('/contact', getContact);
router.put('/contact', updateContact);

// Product Details routes - đặt trước /:id
router.get('/:productId/detail', getProductDetail);
router.post('/:productId/detail', saveProductDetail);
router.put('/:productId/detail', saveProductDetail);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Chi tiết sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get('/:id', getProductById);

/**
 * @openapi
 * /api/admin/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Tạo sản phẩm mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               categoryId:
 *                 type: integer
 *               name:
 *                 type: string
 *               tagline:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Đã tạo sản phẩm
 */
router.post('/', createProduct);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Cập nhật sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã cập nhật
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put('/:id', updateProduct);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Xóa sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã xóa
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.delete('/:id', deleteProduct);

/**
 * @openapi
 * /api/admin/products/{id}/toggle:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Bật/tắt sản phẩm (active hoặc featured)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field
 *             properties:
 *               field:
 *                 type: string
 *                 enum: [active, featured]
 *     responses:
 *       200:
 *         description: Đã cập nhật
 */
router.patch('/:id/toggle', toggleProduct);

module.exports = router;

