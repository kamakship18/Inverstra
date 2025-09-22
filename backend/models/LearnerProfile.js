const mongoose = require('mongoose');

const learnerProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  areasOfInterest: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one area of interest is required'
    }
  },
  primaryGoal: {
    type: String,
    required: true,
    enum: ['growth', 'income', 'retirement']
  },
  riskTolerance: {
    type: String,
    required: true,
    enum: ['conservative', 'moderate', 'aggressive']
  },
  language: {
    type: String,
    default: 'english'
  },
  walletAddress: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LearnerProfile', learnerProfileSchema);
