const mongoose = require('mongoose');

const verificationDataSchema = new mongoose.Schema({
  // Basic prediction information
  predictionText: {
    type: String,
    required: true,
    trim: true
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  asset: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  targetPrice: {
    type: String,
    trim: true
  },
  deadline: {
    type: String,
    trim: true
  },
  reasoning: {
    type: String,
    trim: true
  },

  // Verification results from AI
  verificationResult: {
    verificationScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    aiAnalysis: {
      credibility: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      marketRelevance: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      reasoningQuality: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      riskAssessment: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      }
    },
    recommendations: [{
      type: String,
      trim: true
    }],
    isPublic: {
      type: Boolean,
      default: true
    }
  },

  // Creator information
  creator: {
    type: String,
    required: true,
    trim: true
  },

  // Status and submission info
  status: {
    type: String,
    enum: ['submitted-to-dao', 'dao-approved', 'dao-rejected', 'published', 'private'],
    default: 'submitted-to-dao'
  },
  submissionType: {
    type: String,
    enum: ['verification', 'prediction'],
    default: 'verification'
  },

  // DAO integration
  daoPredictionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DAOPrediction'
  },

  // Blockchain integration
  transactionHash: {
    type: String,
    trim: true
  },
  blockNumber: {
    type: Number
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
verificationDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
verificationDataSchema.index({ creator: 1, status: 1 });
verificationDataSchema.index({ createdAt: -1 });
verificationDataSchema.index({ asset: 1 });
verificationDataSchema.index({ category: 1 });

module.exports = mongoose.model('VerificationData', verificationDataSchema);
