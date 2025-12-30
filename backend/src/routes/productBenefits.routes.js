const express = require('express');
const {
  getBenefits,
  getBenefitById,
  createBenefit,
  updateBenefit,
  deleteBenefit,
} = require('../controllers/productBenefits.controller');

const router = express.Router();

router.get('/', getBenefits);
router.get('/:id', getBenefitById);
router.post('/', createBenefit);
router.put('/:id', updateBenefit);
router.delete('/:id', deleteBenefit);

module.exports = router;

