const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  validation: {
    trustLevel: {
      type: String,
      enum: ['verified', 'unverified', 'suspicious'],
      default: 'unverified'
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }
});

const predictionDataSchema = new mongoose.Schema({
  // Original prediction data from influencer
  predictionText: {
    type: String,
    required: true
  },
  reasoning: {
    type: String,
    required: true
  },
  validationScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  sources: [sourceSchema],
  perplexityCheck: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Form data from create-prediction page
  formData: {
    category: String,
    asset: String,
    predictionType: String, // 'priceTarget', 'percentage', 'event'
    targetPrice: String,
    deadline: String,
    confidence: Number,
    confirmed: Boolean
  },
  
  // AI validation results
  aiValidation: {
    reasoningScore: Number,
    sourceCredibility: Number,
    marketRelevance: Number,
    overallScore: Number,
    validationPassed: Boolean,
    validationDate: Date
  },
  
  // DAO voting data
  daoData: {
    daoPredictionId: String, // Reference to DAOPrediction
    votingPeriod: Number, // in days
    totalVotes: { type: Number, default: 0 },
    yesVotes: { type: Number, default: 0 },
    noVotes: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    approvalDate: Date
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['draft', 'validated', 'submitted-to-dao', 'voting', 'approved', 'rejected', 'expired'],
    default: 'draft'
  },
  
  // Performance tracking (for future use)
  performance: {
    actualOutcome: String,
    accuracy: Number,
    outcomeDate: Date,
    isResolved: { type: Boolean, default: false }
  },
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    submissionMethod: {
      type: String,
      enum: ['web', 'api', 'mobile'],
      default: 'web'
    }
  }
});

// Indexes for efficient queries
predictionDataSchema.index({ createdBy: 1, createdAt: -1 });
predictionDataSchema.index({ status: 1 });
predictionDataSchema.index({ 'daoData.isApproved': 1 });
predictionDataSchema.index({ 'formData.category': 1 });
predictionDataSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PredictionData', predictionDataSchema);
