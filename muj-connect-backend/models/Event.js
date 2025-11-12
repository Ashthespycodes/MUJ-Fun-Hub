const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Cultural', 'Technical', 'Sports', 'Academic', 'Workshop', 'Seminar', 'Competition', 'Social', 'Other']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true
  },
  contact: {
    email: String,
    phone: String
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationLink: {
    type: String
  },
  registrationDeadline: {
    type: Date
  },
  capacity: {
    type: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String
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
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ isActive: 1 });

module.exports = mongoose.model('Event', eventSchema);
