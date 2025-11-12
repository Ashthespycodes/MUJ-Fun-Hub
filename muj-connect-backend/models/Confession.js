const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Confession content is required'],
    trim: true,
    maxlength: [1000, 'Confession cannot exceed 1000 characters']
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
confessionSchema.index({ createdAt: -1 });
confessionSchema.index({ isApproved: 1 });

module.exports = mongoose.model('Confession', confessionSchema);
