const express = require('express');
const { login } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập CMS SFB (demo)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@sfb.local
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: demo-token-123
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Admin SFB
 *                     email:
 *                       type: string
 *                       example: admin@sfb.local
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
router.post('/login', login);

module.exports = router;




