const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();
const DAOPrediction = require('../models/DAOPrediction');
const InfluencerProfile = require('../models/InfluencerProfile');
const PredictionData = require('../models/PredictionData');

// Import contract ABI and address
const { predictionDAOAbi } = require('../contract/daoAbi.js');

// Get contract address from environment variable
const DAO_CONTRACT_ADDRESS = process.env.DAO_CONTRACT_ADDRESS || "0xd9145CCE52D386f254917e481eB44e9943F39138";

const DAO_CONTRACT_CONFIG = {
  localhost: {
    address: DAO_CONTRACT_ADDRESS,
    chainId: 1337,
    name: "Localhost"
  }
};

// Contract interaction helper
class DAOContractService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.initializeProvider();
  }

  initializeProvider() {
    try {
      // For local development, use localhost
      this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
      
      // Get contract address for current network
      const networkConfig = DAO_CONTRACT_CONFIG.localhost; // Default to localhost
      const contractAddress = networkConfig.address;
      
      if (contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000") {
        this.contract = new ethers.Contract(contractAddress, predictionDAOAbi, this.provider);
        console.log('✅ DAO Contract initialized at:', contractAddress);
      } else {
        console.log('⚠️ DAO Contract not deployed yet');
      }
    } catch (error) {
      console.error('❌ Error initializing DAO contract:', error.message);
    }
  }

  async getActivePredictions() {
    // Try contract first, fallback to MongoDB
    if (this.contract) {
      try {
        const predictions = await this.contract.getActivePredictions();
        return predictions.map(pred => ({
          id: pred.id.toString(),
          creator: pred.creator,
          title: pred.title,
          description: pred.description,
          category: pred.category,
          endTime: pred.endTime.toString(),
          isActive: pred.isActive,
          isApproved: pred.isApproved,
          totalVotes: pred.totalVotes.toString(),
          yesVotes: pred.yesVotes.toString(),
          noVotes: pred.noVotes.toString(),
          createdAt: pred.createdAt.toString()
        }));
      } catch (error) {
        console.error('Contract error, falling back to MongoDB:', error.message);
      }
    }
    
    // Fallback to MongoDB
    try {
      const predictions = await DAOPrediction.find({
        isActive: true,
        endTime: { $gt: new Date() }
      }).sort({ createdAt: -1 });
      
      return predictions.map(pred => ({
        id: pred.id.toString(),
        creator: pred.creator,
        title: pred.title,
        description: pred.description,
        category: pred.category,
        endTime: Math.floor(pred.endTime.getTime() / 1000).toString(),
        isActive: pred.isActive,
        isApproved: pred.isApproved,
        totalVotes: pred.totalVotes.toString(),
        yesVotes: pred.yesVotes.toString(),
        noVotes: pred.noVotes.toString(),
        createdAt: Math.floor(pred.createdAt.getTime() / 1000).toString()
      }));
    } catch (error) {
      console.error('MongoDB fallback error:', error);
      return [];
    }
  }

  async getApprovedPredictions() {
    // Try contract first, fallback to MongoDB
    if (this.contract) {
      try {
        const predictions = await this.contract.getApprovedPredictions();
        return predictions.map(pred => ({
          id: pred.id.toString(),
          creator: pred.creator,
          title: pred.title,
          description: pred.description,
          category: pred.category,
          endTime: pred.endTime.toString(),
          isActive: pred.isActive,
          isApproved: pred.isApproved,
          totalVotes: pred.totalVotes.toString(),
          yesVotes: pred.yesVotes.toString(),
          noVotes: pred.noVotes.toString(),
          createdAt: pred.createdAt.toString()
        }));
      } catch (error) {
        console.error('Contract error, falling back to MongoDB:', error.message);
      }
    }
    
    // Fallback to MongoDB - implement 70% threshold logic
    try {
      const predictions = await DAOPrediction.find({
        isActive: false // Voting period ended
      }).sort({ createdAt: -1 });
      
      // Filter predictions that have 70%+ yes votes
      const approvedPredictions = predictions.filter(pred => {
        const totalVotes = pred.yesVotes + pred.noVotes;
        if (totalVotes === 0) return false; // No votes yet
        
        const yesPercentage = (pred.yesVotes / totalVotes) * 100;
        return yesPercentage >= 70; // 70% threshold
      });
      
      return approvedPredictions.map(pred => ({
        id: pred.id.toString(),
        creator: pred.creator,
        title: pred.title,
        description: pred.description,
        category: pred.category,
        endTime: Math.floor(pred.endTime.getTime() / 1000).toString(),
        isActive: pred.isActive,
        isApproved: true, // These are approved by 70%+ votes
        totalVotes: pred.totalVotes.toString(),
        yesVotes: pred.yesVotes.toString(),
        noVotes: pred.noVotes.toString(),
        createdAt: Math.floor(pred.createdAt.getTime() / 1000).toString()
      }));
    } catch (error) {
      console.error('MongoDB fallback error:', error);
      return [];
    }
  }

  async getPrediction(predictionId) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const prediction = await this.contract.predictions(predictionId);
      return {
        id: prediction.id.toString(),
        creator: prediction.creator,
        title: prediction.title,
        description: prediction.description,
        category: prediction.category,
        endTime: prediction.endTime.toString(),
        isActive: prediction.isActive,
        isApproved: prediction.isApproved,
        totalVotes: prediction.totalVotes.toString(),
        yesVotes: prediction.yesVotes.toString(),
        noVotes: prediction.noVotes.toString(),
        createdAt: prediction.createdAt.toString()
      };
    } catch (error) {
      console.error('Error fetching prediction:', error);
      throw error;
    }
  }

  async getVotingStats(predictionId) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const stats = await this.contract.getVotingStats(predictionId);
      return {
        yesVotes: stats.yesVotes.toString(),
        noVotes: stats.noVotes.toString(),
        totalVotes: stats.totalVotes.toString(),
        approvalPercentage: stats.approvalPercentage.toString()
      };
    } catch (error) {
      console.error('Error fetching voting stats:', error);
      throw error;
    }
  }

  async hasUserVoted(predictionId, userAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      return await this.contract.hasUserVoted(predictionId, userAddress);
    } catch (error) {
      console.error('Error checking user vote:', error);
      throw error;
    }
  }

  async getPredictionCount() {
    // Try contract first, fallback to MongoDB
    if (this.contract) {
      try {
        const count = await this.contract.getPredictionCount();
        return count.toString();
      } catch (error) {
        console.error('Contract error, falling back to MongoDB:', error.message);
      }
    }
    
    // Fallback to MongoDB
    try {
      const count = await DAOPrediction.countDocuments();
      return count.toString();
    } catch (error) {
      console.error('MongoDB fallback error:', error);
      return "0";
    }
  }

  // MongoDB-only methods for creating and managing predictions
  async createPredictionInDB(predictionData) {
    try {
      // Get the next ID
      const lastPrediction = await DAOPrediction.findOne().sort({ id: -1 });
      const nextId = lastPrediction ? lastPrediction.id + 1 : 1;
      
      const prediction = new DAOPrediction({
        id: nextId,
        creator: predictionData.creator,
        title: predictionData.title,
        description: predictionData.description,
        category: predictionData.category,
        endTime: new Date(predictionData.endTime * 1000),
        isActive: true,
        isApproved: false,
        totalVotes: 0,
        yesVotes: 0,
        noVotes: 0,
        createdAt: new Date(),
        votes: [],
        contractSynced: false,
        contractPredictionId: predictionData.contractPredictionId || null
      });
      
      await prediction.save();
      return prediction;
    } catch (error) {
      console.error('Error creating prediction in DB:', error);
      throw error;
    }
  }

  async voteInDB(predictionId, voter, support) {
    try {
      const prediction = await DAOPrediction.findOne({ id: predictionId });
      if (!prediction) {
        throw new Error('Prediction not found');
      }
      
      if (!prediction.isActive) {
        throw new Error('Prediction is not active');
      }
      
      if (new Date() > prediction.endTime) {
        throw new Error('Voting period has ended');
      }
      
      // Check if user already voted
      const existingVote = prediction.votes.find(vote => vote.voter === voter);
      if (existingVote) {
        throw new Error('User has already voted');
      }
      
      // Add vote
      prediction.votes.push({
        voter: voter,
        support: support,
        timestamp: new Date()
      });
      
      // Update vote counts
      prediction.totalVotes += 1;
      if (support) {
        prediction.yesVotes += 1;
      } else {
        prediction.noVotes += 1;
      }
      
      // Check if prediction should be approved (70% threshold)
      const approvalPercentage = (prediction.yesVotes / prediction.totalVotes) * 100;
      if (approvalPercentage >= 70) {
        prediction.isApproved = true;
        prediction.isActive = false;
      }
      
      await prediction.save();
      return prediction;
    } catch (error) {
      console.error('Error voting in DB:', error);
      throw error;
    }
  }
}

const daoService = new DAOContractService();

// Routes

// Create a new prediction (MongoDB primary, contract as backup)
router.post('/predictions/create', async (req, res) => {
  try {
    const { title, description, category, votingPeriod, creator, originalPredictionData } = req.body;
    
    if (!title || !description || !category || !votingPeriod || !creator) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const endTime = Math.floor(Date.now() / 1000) + (parseInt(votingPeriod) * 24 * 60 * 60);
    
    const predictionData = {
      creator,
      title,
      description,
      category,
      endTime
    };
    
    // Try to create in contract first, then save to MongoDB
    let contractPredictionId = null;
    if (daoService.contract) {
      try {
        const votingPeriodSeconds = parseInt(votingPeriod) * 24 * 60 * 60;
        const tx = await daoService.contract.createPrediction(
          title,
          description,
          category,
          votingPeriodSeconds
        );
        const receipt = await tx.wait();
        
        // Extract prediction ID from events
        const predictionCreatedEvent = receipt.logs.find(
          log => log.topics[0] === daoService.contract.interface.getEvent('PredictionCreated').topicHash
        );
        
        if (predictionCreatedEvent) {
          contractPredictionId = daoService.contract.interface.parseLog(predictionCreatedEvent).args.predictionId.toString();
        }
      } catch (error) {
        console.error('Contract creation failed, using MongoDB only:', error.message);
      }
    }
    
    // Create in MongoDB
    predictionData.contractPredictionId = contractPredictionId;
    const prediction = await daoService.createPredictionInDB(predictionData);
    
    // Also save comprehensive prediction data if provided
    if (originalPredictionData) {
      try {
        const comprehensiveData = new PredictionData({
          predictionText: title,
          reasoning: description,
          validationScore: originalPredictionData.validationScore || 0,
          sources: originalPredictionData.sources || [],
          perplexityCheck: originalPredictionData.perplexityCheck || null,
          createdBy: creator,
          formData: originalPredictionData.formData || {},
          aiValidation: originalPredictionData.aiValidation || {},
          daoData: {
            daoPredictionId: prediction.id.toString(),
            votingPeriod: parseInt(votingPeriod),
            totalVotes: 0,
            yesVotes: 0,
            noVotes: 0,
            isApproved: false
          },
          status: 'submitted-to-dao'
        });
        
        await comprehensiveData.save();
        console.log('Saved comprehensive prediction data for DAO prediction:', prediction.id);
      } catch (comprehensiveError) {
        console.error('Error saving comprehensive prediction data:', comprehensiveError);
        // Don't fail the main prediction creation
      }
    }
    
    // Create or update influencer profile
    try {
      let influencerProfile = await InfluencerProfile.findOne({ walletAddress: creator });
      
      if (!influencerProfile) {
        // Create new influencer profile
        influencerProfile = new InfluencerProfile({
          name: creator.substring(0, 6) + '...' + creator.substring(creator.length - 4), // Default name from wallet
          walletAddress: creator,
          bio: 'Influencer on Investra platform',
          expertise: [category],
          verificationStatus: 'unverified',
          reputation: 0
        });
        await influencerProfile.save();
        console.log('Created new influencer profile for:', creator);
      } else {
        // Update existing profile
        await InfluencerProfile.findOneAndUpdate(
          { walletAddress: creator },
          { 
            $inc: { 
              'predictionStats.totalCreated': 1,
              totalPredictions: 1
            },
            $set: {
              'predictionStats.lastPredictionDate': new Date(),
              updatedAt: new Date()
            }
          }
        );
        console.log('Updated influencer profile stats for:', creator);
      }
    } catch (profileError) {
      console.error('Error handling influencer profile:', profileError);
      // Don't fail the prediction creation if profile update fails
    }
    
    res.json({
      success: true,
      data: {
        id: prediction.id,
        contractPredictionId: contractPredictionId,
        message: contractPredictionId ? 'Prediction created in both contract and database' : 'Prediction created in database (contract unavailable)'
      }
    });
  } catch (error) {
    console.error('Error creating prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create prediction',
      error: error.message
    });
  }
});

// Vote on a prediction (MongoDB primary, contract as backup)
router.post('/predictions/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { voter, support } = req.body;
    
    if (!voter || typeof support !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Missing voter address or support value'
      });
    }
    
    // Try to vote in contract first, then save to MongoDB
    if (daoService.contract) {
      try {
        const tx = await daoService.contract.vote(id, support);
        await tx.wait();
        console.log('Vote recorded in contract');
      } catch (error) {
        console.error('Contract voting failed, using MongoDB only:', error.message);
      }
    }
    
    // Vote in MongoDB
    const prediction = await daoService.voteInDB(parseInt(id), voter, support);
    
    // Check if prediction becomes approved (70%+ yes votes) and update influencer stats
    try {
      const totalVotes = prediction.yesVotes + prediction.noVotes;
      if (totalVotes > 0) {
        const yesPercentage = (prediction.yesVotes / totalVotes) * 100;
        
        if (yesPercentage >= 70 && !prediction.isApproved) {
          // Prediction just became approved, update influencer stats
          await InfluencerProfile.findOneAndUpdate(
            { walletAddress: prediction.creator },
            { 
              $inc: { 
                'predictionStats.totalApproved': 1,
                successfulPredictions: 1,
                reputation: 5 // Increase reputation for approved prediction
              },
              $set: {
                updatedAt: new Date()
              }
            }
          );
          console.log('Updated influencer stats for approved prediction:', prediction.creator);
        }
      }
    } catch (statsError) {
      console.error('Error updating influencer stats after vote:', statsError);
      // Don't fail the vote if stats update fails
    }
    
    res.json({
      success: true,
      data: {
        predictionId: id,
        voter: voter,
        support: support,
        totalVotes: prediction.totalVotes,
        yesVotes: prediction.yesVotes,
        noVotes: prediction.noVotes,
        isApproved: prediction.isApproved,
        message: 'Vote recorded successfully'
      }
    });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to vote',
      error: error.message
    });
  }
});

// Get all active predictions (for voting)
router.get('/predictions/active', async (req, res) => {
  try {
    const predictions = await daoService.getActivePredictions();
    res.json({
      success: true,
      data: predictions,
      count: predictions.length
    });
  } catch (error) {
    console.error('Error fetching active predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active predictions',
      error: error.message
    });
  }
});

// Get all approved predictions (70%+ votes)
router.get('/predictions/approved', async (req, res) => {
  try {
    const predictions = await daoService.getApprovedPredictions();
    res.json({
      success: true,
      data: predictions,
      count: predictions.length
    });
  } catch (error) {
    console.error('Error fetching approved predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved predictions',
      error: error.message
    });
  }
});

// Get total prediction count (must be before /:id route)
router.get('/predictions/count', async (req, res) => {
  try {
    const count = await daoService.getPredictionCount();
    
    res.json({
      success: true,
      data: {
        totalPredictions: count
      }
    });
  } catch (error) {
    console.error('Error fetching prediction count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction count',
      error: error.message
    });
  }
});

// Get specific prediction details
router.get('/predictions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prediction = await daoService.getPrediction(id);
    const votingStats = await daoService.getVotingStats(id);
    
    res.json({
      success: true,
      data: {
        ...prediction,
        votingStats
      }
    });
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction',
      error: error.message
    });
  }
});

// Get voting stats for a prediction
router.get('/predictions/:id/voting-stats', async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await daoService.getVotingStats(id);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching voting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch voting stats',
      error: error.message
    });
  }
});

// Check if user has voted on a prediction
router.get('/predictions/:id/has-voted/:userAddress', async (req, res) => {
  try {
    const { id, userAddress } = req.params;
    const hasVoted = await daoService.hasUserVoted(id, userAddress);
    
    res.json({
      success: true,
      data: {
        hasVoted,
        predictionId: id,
        userAddress
      }
    });
  } catch (error) {
    console.error('Error checking user vote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check user vote',
      error: error.message
    });
  }
});

// Health check for DAO service
router.get('/health', async (req, res) => {
  try {
    const isContractInitialized = daoService.contract !== null;
    
    res.json({
      success: true,
      data: {
        contractInitialized: isContractInitialized,
        providerConnected: daoService.provider !== null,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error checking DAO health:', error);
    res.status(500).json({
      success: false,
      message: 'DAO service health check failed',
      error: error.message
    });
  }
});

module.exports = router;
