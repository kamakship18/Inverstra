const express = require('express');
const router = express.Router();
const LearnerProfile = require('../models/LearnerProfile');

router.get('/', async (req, res) => {
  try {
    const profiles = await LearnerProfile.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    console.error('Error fetching learner profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch profiles',
      error: error.message
    });
  }
});

// GET - Retrieve a specific learner profile by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    
    const profile = await LearnerProfile.findOne({ walletAddress });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No profile found with this wallet address'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching learner profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch profile',
      error: error.message
    });
  }
});

// POST - Create new learner profile
router.post('/', async (req, res) => {
  try {
    const { name, experienceLevel, areasOfInterest, primaryGoal, riskTolerance, language, walletAddress } = req.body;
    
    // Basic validation
    if (!name || !experienceLevel || !areasOfInterest || !primaryGoal || !riskTolerance || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Check if a profile with this wallet address already exists
    const existingProfile = await LearnerProfile.findOne({ walletAddress });
    
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'A profile with this wallet address already exists'
      });
    }
    
    const newProfile = new LearnerProfile({
      name,
      experienceLevel,
      areasOfInterest,
      primaryGoal,
      riskTolerance,
      language: language || 'english',
      walletAddress
    });
    
    const savedProfile = await newProfile.save();
    
    res.status(201).json({
      success: true,
      message: 'Learner profile created successfully!',
      data: savedProfile
    });
  } catch (error) {
    console.error('Error creating learner profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not create profile',
      error: error.message
    });
  }
});

router.put('/wallet/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    const { name, experienceLevel, areasOfInterest, primaryGoal, riskTolerance, language } = req.body;
    
    // Basic validation
    if (!name || !experienceLevel || !areasOfInterest || !primaryGoal || !riskTolerance) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    const updatedProfile = await LearnerProfile.findOneAndUpdate(
      { walletAddress },
      { 
        name,
        experienceLevel,
        areasOfInterest,
        primaryGoal,
        riskTolerance,
        language: language || 'english',
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'No profile found with this wallet address'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Learner profile updated successfully!',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating learner profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not update profile',
      error: error.message
    });
  }
});

module.exports = router;
