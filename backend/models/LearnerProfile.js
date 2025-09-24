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
    enum: ['growth', 'income', 'retirement', 'learning', 'trading']
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
    trim: true,
    unique: true
  },
  // New fields for enhanced AI curation
  investmentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  timeHorizon: {
    type: String,
    enum: ['short-term', 'medium-term', 'long-term'],
    default: 'medium-term'
  },
  learningGoals: {
    type: [String],
    default: []
  },
  preferredPredictionTypes: {
    type: [String],
    default: ['market-trends', 'crypto', 'stocks', 'news-analysis']
  },
  aiPreferences: {
    type: {
      newsFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
      },
      marketAlerts: {
        type: Boolean,
        default: true
      },
      personalizedInsights: {
        type: Boolean,
        default: true
      },
      riskWarnings: {
        type: Boolean,
        default: true
      }
    },
    default: {}
  },
  // AI-generated curated content
  curatedContent: {
    type: {
      lastUpdated: Date,
      marketTrends: [String],
      personalizedNews: [String],
      riskAlerts: [String],
      learningRecommendations: [String]
    },
    default: {}
  },
  // User activity tracking for better AI recommendations
  activityStats: {
    type: {
      predictionsViewed: { type: Number, default: 0 },
      predictionsVoted: { type: Number, default: 0 },
      learningModulesCompleted: { type: Number, default: 0 },
      lastActiveDate: Date
    },
    default: {}
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
