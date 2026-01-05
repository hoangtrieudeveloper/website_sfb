const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth.middleware');
const {
  getSeoPages,
  getSeoPageByPath,
  updateSeoPage,
} = require('../controllers/seo.controller');

// Admin routes - cần authentication
router.get('/', requireAuth, getSeoPages);

// Routes với path parameter - dùng :path đơn giản
router.get('/:path', requireAuth, getSeoPageByPath);
router.put('/:path', requireAuth, updateSeoPage);
router.post('/:path', requireAuth, updateSeoPage); // POST cũng được để tạo mới

module.exports = router;


