const express = require('express');
const router = express.Router();
const {
  getEatingSpots,
  getEatingSpot,
  createEatingSpot,
  updateEatingSpot,
  deleteEatingSpot
} = require('../controllers/eatingSpotController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getEatingSpots);
router.get('/:id', getEatingSpot);

// Admin routes
router.post('/', protect, authorize('admin'), createEatingSpot);
router.put('/:id', protect, authorize('admin'), updateEatingSpot);
router.delete('/:id', protect, authorize('admin'), deleteEatingSpot);

module.exports = router;
