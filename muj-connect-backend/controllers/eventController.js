const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const { category, upcoming } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;

    // Show only upcoming events by default
    if (upcoming !== 'false') {
      filter.date = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .sort('date startTime')
      .populate('postedBy', 'name role');

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      data: []
    });
  }
};

// @desc    Get all events (admin - including past and inactive)
// @route   GET /api/events/all
// @access  Private/Admin
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort('-date')
      .populate('postedBy', 'name role');

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('postedBy', 'name role');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin/Faculty
exports.createEvent = async (req, res) => {
  try {
    req.body.postedBy = req.user.id;
    const event = await Event.create(req.body);

    const populatedEvent = await Event.findById(event._id)
      .populate('postedBy', 'name role');

    res.status(201).json({
      success: true,
      data: populatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin/Faculty
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the poster or admin
    if (event.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('postedBy', 'name role');

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin/Faculty
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the poster or admin
    if (event.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};
