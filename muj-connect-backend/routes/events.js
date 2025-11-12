const express = require('express');
const router = express.Router();
const {
  getEvents,
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes (Admin/Faculty)
router.get('/all', protect, authorize('admin', 'faculty'), getAllEvents);
router.post('/', protect, authorize('admin', 'faculty'), createEvent);
router.put('/:id', protect, authorize('admin', 'faculty'), updateEvent);
router.delete('/:id', protect, authorize('admin', 'faculty'), deleteEvent);

module.exports = router;
