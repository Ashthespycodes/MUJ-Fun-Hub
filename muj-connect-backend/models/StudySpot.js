const mongoose = require('mongoose');

const studySpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  image: {
    type: String,
    default: '',
  },
  noiseLevel: {
    type: String,
    enum: ['Quiet', 'Moderate', 'Variable'],
    required: [true, 'Please specify the noise level'],
  },
  wifi: {
    type: Boolean,
    default: false,
  },
  powerOutlets: {
    type: Boolean,
    default: false,
  },
  seatingCapacity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: [true, 'Please specify the seating capacity'],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  operatingHours: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudySpot', studySpotSchema);
