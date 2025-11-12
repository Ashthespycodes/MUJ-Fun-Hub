const Confession = require('../models/Confession');
const mongoose = require('mongoose');

// @desc    Get all approved confessions
// @route   GET /api/confessions
// @access  Public
exports.getConfessions = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const confessions = await Confession.find({ isApproved: true })
      .sort('-createdAt')
      .populate('author', 'name');

    res.json({
      success: true,
      count: confessions.length,
      data: confessions
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      data: []
    });
  }
};

// @desc    Get all confessions (admin only - including unapproved)
// @route   GET /api/confessions/all
// @access  Private/Admin
exports.getAllConfessions = async (req, res) => {
  try {
    const confessions = await Confession.find()
      .sort('-createdAt')
      .populate('author', 'name email');

    res.json({
      success: true,
      count: confessions.length,
      data: confessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new confession
// @route   POST /api/confessions
// @access  Private
exports.createConfession = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    const confession = await Confession.create({
      content,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
      author: req.user.id
    });

    res.status(201).json({
      success: true,
      data: confession
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create confession',
      error: error.message
    });
  }
};

// @desc    Approve confession
// @route   PUT /api/confessions/:id/approve
// @access  Private/Admin
exports.approveConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: 'Confession not found'
      });
    }

    confession.isApproved = true;
    await confession.save();

    res.json({
      success: true,
      data: confession
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to approve confession',
      error: error.message
    });
  }
};

// @desc    Delete confession
// @route   DELETE /api/confessions/:id
// @access  Private/Admin
exports.deleteConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: 'Confession not found'
      });
    }

    await confession.deleteOne();

    res.json({
      success: true,
      message: 'Confession deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete confession',
      error: error.message
    });
  }
};

// @desc    Like/Unlike confession
// @route   PUT /api/confessions/:id/like
// @access  Private
exports.likeConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: 'Confession not found'
      });
    }

    const userIndex = confession.likedBy.indexOf(req.user.id);

    if (userIndex > -1) {
      // Unlike
      confession.likedBy.splice(userIndex, 1);
      confession.likes = Math.max(0, confession.likes - 1);
    } else {
      // Like
      confession.likedBy.push(req.user.id);
      confession.likes += 1;
    }

    await confession.save();

    res.json({
      success: true,
      data: confession
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to like confession',
      error: error.message
    });
  }
};
