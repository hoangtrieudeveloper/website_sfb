const express = require('express');
const router = express.Router();
const { getPublicSeoByPath } = require('../controllers/seo.controller');

// Public route - không cần authentication
// Route để match root path - hỗ trợ cả query parameter
router.get('/', (req, res, next) => {
  req.params = req.params || {};
  // Nếu có query parameter path, dùng nó (cho trường hợp path là '/')
  if (req.query.path) {
    try {
      req.params.path = decodeURIComponent(req.query.path);
    } catch (e) {
      req.params.path = req.query.path;
    }
  } else {
    req.params.path = '/';
  }
  getPublicSeoByPath(req, res, next);
});

// Route để match tất cả paths khác
router.get('/:path', getPublicSeoByPath);

module.exports = router;


