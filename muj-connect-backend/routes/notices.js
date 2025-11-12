const express = require('express');
const router = express.Router();
const {
  getNotices,
  getAllNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getNotices);
router.get('/:id', getNotice);

// Protected routes (Admin/Faculty)
router.get('/all', protect, authorize('admin', 'faculty'), getAllNotices);
router.post('/', protect, authorize('admin', 'faculty'), createNotice);
router.put('/:id', protect, authorize('admin', 'faculty'), updateNotice);
router.delete('/:id', protect, authorize('admin', 'faculty'), deleteNotice);

module.exports = router;
