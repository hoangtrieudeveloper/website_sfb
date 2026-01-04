const express = require('express');
const {
  getContact,
} = require('../controllers/publicContact.controller');
const {
  submitRequest,
} = require('../controllers/contactRequests.controller');

const router = express.Router();

// GET /api/public/contact
router.get('/', getContact);

// POST /api/public/contact (submit form)
router.post('/', submitRequest);

module.exports = router;

