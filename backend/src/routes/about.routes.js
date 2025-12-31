const express = require('express');
const router = express.Router();
const {
  getHero,
  updateHero,
  getCompany,
  updateCompany,
  getVisionMission,
  updateVisionMission,
  getCoreValues,
  updateCoreValues,
  getMilestones,
  updateMilestones,
  getLeadership,
  updateLeadership,
} = require('../controllers/about.controller');

// Hero routes
router.get('/hero', getHero);
router.put('/hero', updateHero);

// Company routes
router.get('/company', getCompany);
router.put('/company', updateCompany);

// Vision & Mission routes
router.get('/vision-mission', getVisionMission);
router.put('/vision-mission', updateVisionMission);

// Core Values routes
router.get('/core-values', getCoreValues);
router.put('/core-values', updateCoreValues);

// Milestones routes
router.get('/milestones', getMilestones);
router.put('/milestones', updateMilestones);

// Leadership routes
router.get('/leadership', getLeadership);
router.put('/leadership', updateLeadership);

module.exports = router;

