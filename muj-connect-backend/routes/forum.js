const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addReply,
  upvotePost,
  markSolved
} = require('../controllers/forumController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/posts', getPosts);
router.get('/posts/:id', getPost);

// Protected routes
router.post('/posts', protect, createPost);
router.put('/posts/:id', protect, updatePost);
router.delete('/posts/:id', protect, deletePost);
router.post('/posts/:id/replies', protect, addReply);
router.put('/posts/:id/upvote', protect, upvotePost);
router.put('/posts/:id/solve', protect, markSolved);

module.exports = router;
