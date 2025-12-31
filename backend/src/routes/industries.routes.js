const express = require('express');
const {
  getIndustries,
  getIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} = require('../controllers/industries.controller');
const {
  getHero,
  updateHero,
} = require('../controllers/industriesHero.controller');
const {
  getListHeader,
  updateListHeader,
} = require('../controllers/industriesListHeader.controller');
const {
  getProcess,
  updateProcess,
} = require('../controllers/industriesProcess.controller');

const router = express.Router();

// Industries CRUD
router.get('/', getIndustries);
router.post('/', createIndustry);

// Hero routes - phải đặt trước /:id
router.get('/hero', getHero);
router.put('/hero', updateHero);

// List Header routes - phải đặt trước /:id
router.get('/list-header', getListHeader);
router.put('/list-header', updateListHeader);

// Process routes - phải đặt trước /:id
router.get('/process', getProcess);
router.put('/process', updateProcess);

// Dynamic routes - phải đặt SAU các routes đặc biệt
router.get('/:id', getIndustryById);
router.put('/:id', updateIndustry);
router.delete('/:id', deleteIndustry);

module.exports = router;

