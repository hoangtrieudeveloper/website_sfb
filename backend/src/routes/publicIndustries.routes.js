const express = require('express');
const {
  getPublicHero,
  getPublicListHeader,
  getPublicIndustries,
  getPublicProcess,
  getPublicCta,
} = require('../controllers/publicIndustries.controller');

const router = express.Router();

// Public Industries routes (no authentication required)
router.get('/hero', getPublicHero);
router.get('/list-header', getPublicListHeader);
router.get('/list', getPublicIndustries);
router.get('/process', getPublicProcess);
router.get('/cta', getPublicCta);

module.exports = router;

