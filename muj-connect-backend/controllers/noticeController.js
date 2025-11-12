const Notice = require('../models/Notice');
const mongoose = require('mongoose');

// @desc    Get all active notices
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const { category, priority } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Only show notices that haven't expired
    filter.$or = [
      { validTill: { $gte: new Date() } },
      { validTill: null }
    ];

    const notices = await Notice.find(filter)
      .sort('-priority -createdAt')
      .populate('postedBy', 'name role');

    res.json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      data: []
    });
  }
};

// @desc    Get all notices (admin - including inactive)
// @route   GET /api/notices/all
// @access  Private/Admin
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort('-createdAt')
      .populate('postedBy', 'name role');

    res.json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public
exports.getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('postedBy', 'name role');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.json({
      success: true,
      data: notice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private/Admin/Faculty
exports.createNotice = async (req, res) => {
  try {
    req.body.postedBy = req.user.id;
    const notice = await Notice.create(req.body);

    const populatedNotice = await Notice.findById(notice._id)
      .populate('postedBy', 'name role');

    res.status(201).json({
      success: true,
      data: populatedNotice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create notice',
      error: error.message
    });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private/Admin/Faculty
exports.updateNotice = async (req, res) => {
  try {
    let notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check if user is the poster or admin
    if (notice.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this notice'
      });
    }

    notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('postedBy', 'name role');

    res.json({
      success: true,
      data: notice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update notice',
      error: error.message
    });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin/Faculty
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check if user is the poster or admin
    if (notice.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this notice'
      });
    }

    await notice.deleteOne();

    res.json({
      success: true,
      message: 'Notice deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete notice',
      error: error.message
    });
  }
};
