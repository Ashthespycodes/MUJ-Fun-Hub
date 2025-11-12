const Review = require('../models/Review');
const mongoose = require('mongoose');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const { category, rating } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (rating) filter.rating = parseInt(rating);

    const reviews = await Review.find(filter)
      .sort('-createdAt')
      .populate('author', 'name course year');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      data: []
    });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('author', 'name course year');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { category, title, content, rating } = req.body;

    const review = await Review.create({
      category,
      title,
      content,
      rating,
      author: req.user.id
    });

    const populatedReview = await Review.findById(review._id)
      .populate('author', 'name course year');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner
    if (review.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name course year');

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner or admin
    if (review.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const userIndex = review.helpfulBy.indexOf(req.user.id);

    if (userIndex > -1) {
      // Remove helpful
      review.helpfulBy.splice(userIndex, 1);
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // Add helpful
      review.helpfulBy.push(req.user.id);
      review.helpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to mark review as helpful',
      error: error.message
    });
  }
};
