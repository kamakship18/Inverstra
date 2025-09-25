const express = require('express');
const router = express.Router();
const InfluencerProfile = require('../models/InfluencerProfile');

// GET - Get all influencer profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await InfluencerProfile.find().sort({ reputation: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    console.error('Error fetching influencer profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch profiles',
      error: error.message
    });
  }
});

// GET - Retrieve a specific influencer profile by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    
    const profile = await InfluencerProfile.findOne({ walletAddress });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No influencer profile found with this wallet address'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching influencer profile:', error);
    
    // If MongoDB connection fails, return 404 to allow profile creation
    if (error.message.includes('buffering timed out') || error.message.includes('connection')) {
      return res.status(404).json({
        success: false,
        message: 'No influencer profile found with this wallet address'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch profile',
      error: error.message
    });
  }
});

// POST - Create a new influencer profile
router.post('/', async (req, res) => {
  try {
    const profileData = req.body;
    
    // Check if profile already exists
    const existingProfile = await InfluencerProfile.findOne({ 
      walletAddress: profileData.walletAddress 
    });
    
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists for this wallet address'
      });
    }
    
    const newProfile = new InfluencerProfile(profileData);
    const savedProfile = await newProfile.save();
    
    res.status(201).json({
      success: true,
      message: 'Influencer profile created successfully',
      data: savedProfile
    });
  } catch (error) {
    console.error('Error creating influencer profile:', error);
    
    // If MongoDB connection fails, log warning but don't crash
    if (error.message.includes('buffering timed out') || error.message.includes('connection')) {
      console.warn('MongoDB connection failed, profile not saved:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed. Profile not saved.',
        error: 'Database unavailable'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not create profile',
      error: error.message
    });
  }
});

// PUT - Update an existing influencer profile
router.put('/wallet/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    const updateData = req.body;
    
    const updatedProfile = await InfluencerProfile.findOneAndUpdate(
      { walletAddress },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'No influencer profile found with this wallet address'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Influencer profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating influencer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not update profile',
      error: error.message
    });
  }
});

// POST - Update prediction stats when a prediction is created
router.post('/stats/:walletAddress/prediction-created', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    
    const updatedProfile = await InfluencerProfile.findOneAndUpdate(
      { walletAddress },
      { 
        $inc: { 
          'predictionStats.totalCreated': 1,
          totalPredictions: 1
        },
        $set: {
          'predictionStats.lastPredictionDate': new Date(),
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'No influencer profile found with this wallet address'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Prediction stats updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating prediction stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not update stats',
      error: error.message
    });
  }
});

// POST - Update stats when a prediction is approved
router.post('/stats/:walletAddress/prediction-approved', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    
    const updatedProfile = await InfluencerProfile.findOneAndUpdate(
      { walletAddress },
      { 
        $inc: { 
          'predictionStats.totalApproved': 1,
          successfulPredictions: 1
        },
        $set: {
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'No influencer profile found with this wallet address'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Approval stats updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating approval stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not update stats',
      error: error.message
    });
  }
});

module.exports = router;
