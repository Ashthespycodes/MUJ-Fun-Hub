const express = require('express');
const {
  getStudySpots,
  getStudySpot,
  createStudySpot,
  updateStudySpot,
  deleteStudySpot,
} = require('../controllers/studySpotController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getStudySpots)
  .post(protect, authorize('admin'), createStudySpot);

router.route('/:id')
  .get(getStudySpot)
  .put(protect, authorize('admin'), updateStudySpot)
  .delete(protect, authorize('admin'), deleteStudySpot);

module.exports = router;
