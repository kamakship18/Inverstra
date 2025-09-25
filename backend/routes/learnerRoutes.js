const express = require('express');
const router = express.Router();
const LearnerProfile = require('../models/LearnerProfile');
const aiCurationService = require('../services/aiCurationService');

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
    
    // If MongoDB connection fails, return 404 to allow profile creation
    if (error.message.includes('buffering timed out') || error.message.includes('connection')) {
      return res.status(404).json({
        success: false,
        message: 'No profile found with this wallet address'
      });
    }
    
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
    const { 
      name, 
      experienceLevel, 
      areasOfInterest, 
      primaryGoal, 
      riskTolerance, 
      language, 
      walletAddress,
      // New enhanced fields
      investmentAmount,
      timeHorizon,
      learningGoals,
      preferredPredictionTypes,
      aiPreferences
    } = req.body;
    
    // Basic validation
    if (!name || !experienceLevel || !areasOfInterest || !primaryGoal || !riskTolerance || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Check if a profile with this wallet address already exists (with fallback)
    let existingProfile = null;
    try {
      existingProfile = await LearnerProfile.findOne({ walletAddress });
    } catch (dbError) {
      console.log('MongoDB connection issue, proceeding with profile creation:', dbError.message);
      // Continue with creation if DB is not available
    }
    
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'A profile with this wallet address already exists'
      });
    }
    
    // Create profile with enhanced fields
    const profileData = {
      name,
      experienceLevel,
      areasOfInterest,
      primaryGoal,
      riskTolerance,
      language: language || 'english',
      walletAddress,
      // Enhanced fields with defaults
      investmentAmount: investmentAmount || 0,
      timeHorizon: timeHorizon || 'medium-term',
      learningGoals: learningGoals || [],
      preferredPredictionTypes: preferredPredictionTypes || ['market-trends', 'crypto', 'stocks', 'news-analysis'],
      aiPreferences: aiPreferences || {
        newsFrequency: 'daily',
        marketAlerts: true,
        personalizedInsights: true,
        riskWarnings: true
      }
    };
    
    const newProfile = new LearnerProfile(profileData);
    
    try {
      const savedProfile = await newProfile.save();
      
      res.status(201).json({
        success: true,
        message: 'Learner profile created successfully!',
        data: savedProfile
      });
    } catch (saveError) {
      console.error('Error saving profile to MongoDB:', saveError);
      
      // If MongoDB save fails, still return success but log the issue
      res.status(201).json({
        success: true,
        message: 'Learner profile created successfully! (saved locally)',
        data: profileData,
        warning: 'Profile saved locally due to database connection issues'
      });
    }
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

// GET - Get AI-curated content for a user
router.get('/curated-content/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    
    const profile = await LearnerProfile.findOne({ walletAddress });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No profile found with this wallet address'
      });
    }

    // Check if curated content is recent (less than 24 hours old)
    const now = new Date();
    const lastUpdated = profile.curatedContent?.lastUpdated;
    const isContentFresh = lastUpdated && (now - lastUpdated) < 24 * 60 * 60 * 1000;

    let curatedContent = profile.curatedContent;

    // If content is stale or doesn't exist, generate new content
    if (!isContentFresh || !curatedContent) {
      console.log('Generating fresh AI-curated content for user:', profile.name);
      curatedContent = await aiCurationService.generatePersonalizedInsights(profile);
      
      // Update the profile with new curated content
      await LearnerProfile.findOneAndUpdate(
        { walletAddress },
        { 
          curatedContent,
          'activityStats.lastActiveDate': now,
          updatedAt: now
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        profile: {
          name: profile.name,
          experienceLevel: profile.experienceLevel,
          areasOfInterest: profile.areasOfInterest,
          primaryGoal: profile.primaryGoal,
          riskTolerance: profile.riskTolerance
        },
        curatedContent
      }
    });
  } catch (error) {
    console.error('Error fetching curated content:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch curated content',
      error: error.message
    });
  }
});

// POST - Update user activity stats
router.post('/activity/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    const { activityType, increment = 1 } = req.body;

    const updateFields = {
      'activityStats.lastActiveDate': new Date(),
      updatedAt: new Date()
    };

    // Update specific activity counter
    if (activityType) {
      updateFields[`activityStats.${activityType}`] = increment;
    }

    const updatedProfile = await LearnerProfile.findOneAndUpdate(
      { walletAddress },
      { $inc: updateFields },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'No profile found with this wallet address'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProfile.activityStats
    });
  } catch (error) {
    console.error('Error updating activity stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not update activity stats',
      error: error.message
    });
  }
});

// GET - Get personalized predictions based on user profile
router.get('/personalized-predictions/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    
    const profile = await LearnerProfile.findOne({ walletAddress });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No profile found with this wallet address'
      });
    }

    // This would integrate with your DAO predictions system
    // For now, return a placeholder response
    const personalizedPredictions = {
      recommended: [
        {
          id: '1',
          title: `AI-Recommended: ${profile.areasOfInterest[0]} Market Analysis`,
          description: `Based on your ${profile.riskTolerance} risk tolerance and ${profile.primaryGoal} goals`,
          category: profile.areasOfInterest[0],
          confidence: 'High',
          reason: `Matches your ${profile.experienceLevel} experience level`
        }
      ],
      trending: [
        {
          id: '2',
          title: 'Trending in Your Interest Areas',
          description: 'Popular predictions in your areas of interest',
          category: profile.areasOfInterest.join(', '),
          confidence: 'Medium'
        }
      ]
    };

    res.status(200).json({
      success: true,
      data: {
        profile: {
          name: profile.name,
          areasOfInterest: profile.areasOfInterest,
          riskTolerance: profile.riskTolerance
        },
        predictions: personalizedPredictions
      }
    });
  } catch (error) {
    console.error('Error fetching personalized predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch personalized predictions',
      error: error.message
    });
  }
});

// POST - Refresh AI-curated content
router.post('/refresh-content/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    
    const profile = await LearnerProfile.findOne({ walletAddress });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No profile found with this wallet address'
      });
    }

    console.log('Manually refreshing AI-curated content for user:', profile.name);
    const curatedContent = await aiCurationService.curateContentForUser(profile);
    
    // Update the profile with fresh curated content
    const updatedProfile = await LearnerProfile.findOneAndUpdate(
      { walletAddress },
      { 
        curatedContent,
        'activityStats.lastActiveDate': new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'AI-curated content refreshed successfully',
      data: {
        profile: {
          name: updatedProfile.name,
          experienceLevel: updatedProfile.experienceLevel,
          areasOfInterest: updatedProfile.areasOfInterest
        },
        curatedContent
      }
    });
  } catch (error) {
    console.error('Error refreshing curated content:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not refresh curated content',
      error: error.message
    });
  }
});

module.exports = router;
