const express = require('express');
const router = express.Router();
const { getPublicSeoByPath } = require('../controllers/seo.controller');

// Public route - không cần authentication
// Route để match root path
router.get('/', (req, res, next) => {
  req.params = req.params || {};
  req.params.path = '/';
  getPublicSeoByPath(req, res, next);
});

// Route để match tất cả paths khác
router.get('/:path', getPublicSeoByPath);

module.exports = router;


