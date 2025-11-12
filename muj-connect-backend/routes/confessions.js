const express = require('express');
const router = express.Router();
const {
  getConfessions,
  getAllConfessions,
  createConfession,
  approveConfession,
  deleteConfession,
  likeConfession
} = require('../controllers/confessionController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getConfessions);

// Protected routes
router.post('/', protect, createConfession);
router.put('/:id/like', protect, likeConfession);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllConfessions);
router.put('/:id/approve', protect, authorize('admin'), approveConfession);
router.delete('/:id', protect, authorize('admin'), deleteConfession);

module.exports = router;
