const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Academic', 'Administrative', 'Exam', 'Holiday', 'Important', 'General']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  department: {
    type: String,
    trim: true
  },
  targetAudience: [{
    type: String,
    enum: ['All', 'Students', 'Faculty', 'Staff', 'B.Tech', 'M.Tech', 'MBA', 'BBA']
  }],
  attachments: [{
    filename: String,
    url: String
  }],
  validTill: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
noticeSchema.index({ category: 1, createdAt: -1 });
noticeSchema.index({ priority: 1 });
noticeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
