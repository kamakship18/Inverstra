const express = require('express');
const router = express.Router();
const tokenService = require('../services/tokenService');

// GET - Get user tokens
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const userTokens = await tokenService.getUserTokens(walletAddress);
    
    res.json({
      success: true,
      data: userTokens
    });
  } catch (error) {
    console.error('Error getting user tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user tokens',
      error: error.message
    });
  }
});

// POST - Initialize user tokens
router.post('/initialize', async (req, res) => {
  try {
    const { walletAddress, userType } = req.body;
    
    if (!walletAddress || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and user type are required'
      });
    }

    const userTokens = await tokenService.initializeUserTokens(walletAddress, userType);
    
    res.json({
      success: true,
      data: userTokens,
      message: `Welcome! You received ${userTokens.totalTokens} tokens as a ${userType}.`
    });
  } catch (error) {
    console.error('Error initializing user tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize user tokens',
      error: error.message
    });
  }
});

// POST - Spend tokens
router.post('/spend', async (req, res) => {
  try {
    const { walletAddress, amount, transactionType, description, relatedEntity } = req.body;
    
    if (!walletAddress || !amount || !transactionType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, amount, transaction type, and description are required'
      });
    }

    const userTokens = await tokenService.spendTokens(
      walletAddress, 
      amount, 
      transactionType, 
      description, 
      relatedEntity
    );
    
    res.json({
      success: true,
      data: userTokens,
      message: `Successfully spent ${amount} tokens.`
    });
  } catch (error) {
    console.error('Error spending tokens:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to spend tokens',
      error: error.message
    });
  }
});

// POST - Earn tokens
router.post('/earn', async (req, res) => {
  try {
    const { walletAddress, amount, transactionType, description, relatedEntity } = req.body;
    
    if (!walletAddress || !amount || !transactionType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, amount, transaction type, and description are required'
      });
    }

    const userTokens = await tokenService.earnTokens(
      walletAddress, 
      amount, 
      transactionType, 
      description, 
      relatedEntity
    );
    
    res.json({
      success: true,
      data: userTokens,
      message: `Successfully earned ${amount} tokens!`
    });
  } catch (error) {
    console.error('Error earning tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to earn tokens',
      error: error.message
    });
  }
});

// GET - Transaction history
router.get('/:walletAddress/history', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    const history = await tokenService.getTransactionHistory(walletAddress, parseInt(limit), parseInt(page));
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction history',
      error: error.message
    });
  }
});

// GET - Leaderboard
router.get('/leaderboard/:userType?', async (req, res) => {
  try {
    const { userType } = req.params;
    const { limit = 10 } = req.query;
    
    const leaderboard = await tokenService.getLeaderboard(userType, parseInt(limit));
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard',
      error: error.message
    });
  }
});

// POST - Check if user can perform action
router.post('/check-action', async (req, res) => {
  try {
    const { walletAddress, action } = req.body;
    
    if (!walletAddress || !action) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and action are required'
      });
    }

    const result = await tokenService.canPerformAction(walletAddress, action);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error checking action permission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check action permission',
      error: error.message
    });
  }
});

// POST - Award achievement
router.post('/achievement', async (req, res) => {
  try {
    const { walletAddress, achievementName, description } = req.body;
    
    if (!walletAddress || !achievementName || !description) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, achievement name, and description are required'
      });
    }

    const userTokens = await tokenService.awardAchievement(walletAddress, achievementName, description);
    
    res.json({
      success: true,
      data: userTokens,
      message: `Achievement unlocked: ${achievementName}!`
    });
  } catch (error) {
    console.error('Error awarding achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to award achievement',
      error: error.message
    });
  }
});

module.exports = router;
