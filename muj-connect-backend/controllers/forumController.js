const ForumPost = require('../models/ForumPost');
const mongoose = require('mongoose');

// @desc    Get all forum posts
// @route   GET /api/forum/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const { category, sort } = req.query;
    const filter = {};

    if (category) filter.category = category;

    let sortOption = '-createdAt'; // default: newest first
    if (sort === 'popular') sortOption = '-upvotes';
    if (sort === 'views') sortOption = '-views';

    const posts = await ForumPost.find(filter)
      .sort(sortOption)
      .populate('author', 'name course year')
      .populate('replies.author', 'name');

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      data: []
    });
  }
};

// @desc    Get single forum post
// @route   GET /api/forum/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name course year')
      .populate('replies.author', 'name course');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create forum post
// @route   POST /api/forum/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const post = await ForumPost.create({
      title,
      content,
      category,
      tags,
      author: req.user.id
    });

    const populatedPost = await ForumPost.findById(post._id)
      .populate('author', 'name course year');

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
};

// @desc    Update forum post
// @route   PUT /api/forum/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post = await ForumPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name course year');

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update post',
      error: error.message
    });
  }
};

// @desc    Delete forum post
// @route   DELETE /api/forum/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
};

// @desc    Add reply to forum post
// @route   POST /api/forum/posts/:id/replies
// @access  Private
exports.addReply = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const reply = {
      content: req.body.content,
      author: req.user.id
    };

    post.replies.push(reply);
    await post.save();

    const updatedPost = await ForumPost.findById(post._id)
      .populate('author', 'name course year')
      .populate('replies.author', 'name course');

    res.status(201).json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add reply',
      error: error.message
    });
  }
};

// @desc    Upvote forum post
// @route   PUT /api/forum/posts/:id/upvote
// @access  Private
exports.upvotePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userIndex = post.upvotedBy.indexOf(req.user.id);

    if (userIndex > -1) {
      // Remove upvote
      post.upvotedBy.splice(userIndex, 1);
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      // Add upvote
      post.upvotedBy.push(req.user.id);
      post.upvotes += 1;
    }

    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to upvote post',
      error: error.message
    });
  }
};

// @desc    Mark post as solved
// @route   PUT /api/forum/posts/:id/solve
// @access  Private
exports.markSolved = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Only post owner can mark as solved
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Only the post author can mark it as solved'
      });
    }

    post.isSolved = !post.isSolved;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to mark post as solved',
      error: error.message
    });
  }
};
