const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menu.controller');

/**
 * @swagger
 * tags:
 *   name: Public Menus
 *   description: Public API để lấy menu điều hướng cho frontend
 */

/**
 * @swagger
 * /api/public/menus:
 *   get:
 *     summary: Lấy danh sách menu public (chỉ menu active)
 *     tags: [Public Menus]
 *     responses:
 *       200:
 *         description: Danh sách menu
 */
router.get('/', menuController.getPublicMenus);

module.exports = router;

