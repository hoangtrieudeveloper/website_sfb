const express = require('express');
const {
  getContact,
} = require('../controllers/publicContact.controller');

const router = express.Router();

// GET /api/public/contact
router.get('/', getContact);

module.exports = router;

