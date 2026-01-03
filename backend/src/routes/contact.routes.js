const express = require('express');
const {
  getHero,
  updateHero,
} = require('../controllers/contactHero.controller');
const {
  getInfoCards,
  updateInfoCards,
} = require('../controllers/contactInfoCards.controller');
const {
  getForm,
  updateForm,
} = require('../controllers/contactForm.controller');
const {
  getSidebar,
  updateSidebar,
} = require('../controllers/contactSidebar.controller');
const {
  getMap,
  updateMap,
} = require('../controllers/contactMap.controller');

const router = express.Router();

// Hero routes
router.get('/hero', getHero);
router.put('/hero', updateHero);

// Info Cards routes
router.get('/info-cards', getInfoCards);
router.put('/info-cards', updateInfoCards);

// Form routes
router.get('/form', getForm);
router.put('/form', updateForm);

// Sidebar routes
router.get('/sidebar', getSidebar);
router.put('/sidebar', updateSidebar);

// Map routes
router.get('/map', getMap);
router.put('/map', updateMap);

module.exports = router;

