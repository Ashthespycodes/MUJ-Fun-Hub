const StudySpot = require('../models/StudySpot');
const mongoose = require('mongoose');

exports.getStudySpots = async (req, res, next) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'Database not connected. Please start MongoDB to see actual data.'
      });
    }

    const studySpots = await StudySpot.find();
    res.status(200).json({
      success: true,
      count: studySpots.length,
      data: studySpots
    });
  } catch (error) {
    // Return empty array instead of error when DB fails
    res.status(200).json({
      success: true,
      count: 0,
      data: [],
      message: 'Database error. Displaying sample data on frontend.'
    });
  }
};

exports.getStudySpot = async (req, res, next) => {
  try {
    const studySpot = await StudySpot.findById(req.params.id);
    if (!studySpot) {
      return res.status(404).json({
        success: false,
        message: 'Study spot not found'
      });
    }
    res.status(200).json({
      success: true,
      data: studySpot
    });
  } catch (error) {
    next(error);
  }
};

exports.createStudySpot = async (req, res, next) => {
  try {
    const studySpot = await StudySpot.create(req.body);
    res.status(201).json({
      success: true,
      data: studySpot
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStudySpot = async (req, res, next) => {
  try {
    const studySpot = await StudySpot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!studySpot) {
      return res.status(404).json({
        success: false,
        message: 'Study spot not found'
      });
    }
    res.status(200).json({
      success: true,
      data: studySpot
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudySpot = async (req, res, next) => {
  try {
    const studySpot = await StudySpot.findByIdAndDelete(req.params.id);
    if (!studySpot) {
      return res.status(404).json({
        success: false,
        message: 'Study spot not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
