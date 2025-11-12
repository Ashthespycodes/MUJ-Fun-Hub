const EatingSpot = require('../models/EatingSpot');
const mongoose = require('mongoose');

// @desc    Get all eating spots
// @route   GET /api/eating-spots
// @access  Public
exports.getEatingSpots = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const { type, vegetarian, priceRange } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (vegetarian !== undefined) filter.vegetarian = vegetarian === 'true';
    if (priceRange) filter.priceRange = priceRange;

    const eatingSpots = await EatingSpot.find(filter)
      .sort('-rating createdAt');

    res.json({
      success: true,
      count: eatingSpots.length,
      data: eatingSpots
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      data: []
    });
  }
};

// @desc    Get single eating spot
// @route   GET /api/eating-spots/:id
// @access  Public
exports.getEatingSpot = async (req, res) => {
  try {
    const eatingSpot = await EatingSpot.findById(req.params.id);

    if (!eatingSpot) {
      return res.status(404).json({
        success: false,
        message: 'Eating spot not found'
      });
    }

    res.json({
      success: true,
      data: eatingSpot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create eating spot
// @route   POST /api/eating-spots
// @access  Private/Admin
exports.createEatingSpot = async (req, res) => {
  try {
    req.body.addedBy = req.user.id;
    const eatingSpot = await EatingSpot.create(req.body);

    res.status(201).json({
      success: true,
      data: eatingSpot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create eating spot',
      error: error.message
    });
  }
};

// @desc    Update eating spot
// @route   PUT /api/eating-spots/:id
// @access  Private/Admin
exports.updateEatingSpot = async (req, res) => {
  try {
    const eatingSpot = await EatingSpot.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!eatingSpot) {
      return res.status(404).json({
        success: false,
        message: 'Eating spot not found'
      });
    }

    res.json({
      success: true,
      data: eatingSpot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update eating spot',
      error: error.message
    });
  }
};

// @desc    Delete eating spot
// @route   DELETE /api/eating-spots/:id
// @access  Private/Admin
exports.deleteEatingSpot = async (req, res) => {
  try {
    const eatingSpot = await EatingSpot.findById(req.params.id);

    if (!eatingSpot) {
      return res.status(404).json({
        success: false,
        message: 'Eating spot not found'
      });
    }

    await eatingSpot.deleteOne();

    res.json({
      success: true,
      message: 'Eating spot deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete eating spot',
      error: error.message
    });
  }
};
