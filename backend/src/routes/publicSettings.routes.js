const express = require('express');
const router = express.Router();
const { getPublicSettings } = require('../controllers/publicSettings.controller');

// Public route - no authentication required
router.get('/', getPublicSettings);

module.exports = router;


