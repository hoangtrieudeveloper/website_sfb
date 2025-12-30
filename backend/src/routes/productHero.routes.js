const express = require('express');
const {
  getHero,
  updateHero,
} = require('../controllers/productHero.controller');

const router = express.Router();

router.get('/', getHero);
router.put('/', updateHero);

module.exports = router;

