const mongoose = require('mongoose');

const eatingSpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Canteen', 'Cafe', 'Restaurant', 'Food Court', 'Mess', 'Other']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  cuisine: [{
    type: String,
    trim: true
  }],
  priceRange: {
    type: String,
    enum: ['₹', '₹₹', '₹₹₹'],
    default: '₹₹'
  },
  timings: {
    type: String,
    default: '9:00 AM - 9:00 PM'
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  popularItems: [{
    type: String,
    trim: true
  }],
  image: {
    type: String
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
eatingSpotSchema.index({ type: 1 });
eatingSpotSchema.index({ rating: -1 });

module.exports = mongoose.model('EatingSpot', eatingSpotSchema);
