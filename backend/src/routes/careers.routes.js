const express = require('express');
const router = express.Router();
const {
  getHero,
  updateHero,
  getBenefits,
  updateBenefits,
  getPositions,
  updatePositions,
  getCTA,
  updateCTA,
} = require('../controllers/careers.controller');

// Hero routes
router.get('/hero', getHero);
router.put('/hero', updateHero);

// Benefits routes
router.get('/benefits', getBenefits);
router.put('/benefits', updateBenefits);

// Positions routes
router.get('/positions', getPositions);
router.put('/positions', updatePositions);

// CTA routes
router.get('/cta', getCTA);
router.put('/cta', updateCTA);

module.exports = router;

