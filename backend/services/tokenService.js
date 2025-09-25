const UserTokens = require('../models/UserTokens');
const TokenTransaction = require('../models/TokenTransaction');
const { v4: uuidv4 } = require('uuid');

class TokenService {
  constructor() {
    this.initialTokens = {
      learner: 20,      // Learners get 20 tokens to view predictions
      influencer: 50,   // Influencers get 50 tokens to create predictions
      dao_member: 30    // DAO members get 30 tokens for voting
    };
    
    this.tokenCosts = {
      viewPrediction: 2,    // Cost to view a prediction
      createPrediction: 10, // Cost to create a prediction
      daoVote: 1           // Cost to vote in DAO
    };
    
    this.tokenRewards = {
      predictionApproved: 25,  // Reward for approved prediction
      dailyLogin: 5,          // Daily login bonus
      levelUp: 10,            // Level up bonus
      achievement: 15         // Achievement bonus
    };
  }

  // Initialize tokens for new user
  async initializeUserTokens(walletAddress, userType) {
    try {
      const existingTokens = await UserTokens.findOne({ walletAddress });
      if (existingTokens) {
        return existingTokens;
      }

      const initialAmount = this.initialTokens[userType] || 20;
      
      const userTokens = new UserTokens({
        walletAddress,
        userType,
        totalTokens: initialAmount,
        availableTokens: initialAmount,
        tokenCategories: {
          viewing: userType === 'learner' ? initialAmount : 0,
          voting: userType === 'dao_member' ? initialAmount : 0,
          creation: userType === 'influencer' ? initialAmount : 0,
          bonus: 0
        }
      });

      await userTokens.save();

      // Create initial transaction record
      await this.createTransaction({
        walletAddress,
        transactionType: 'initial_bonus',
        amount: initialAmount,
        balanceBefore: 0,
        balanceAfter: initialAmount,
        description: `Welcome bonus: ${initialAmount} tokens for ${userType} registration`
      });

      return userTokens;
    } catch (error) {
      console.error('Error initializing user tokens:', error);
      throw error;
    }
  }

  // Get user tokens
  async getUserTokens(walletAddress) {
    try {
      let userTokens = await UserTokens.findOne({ walletAddress });
      
      if (!userTokens) {
        // Auto-initialize if not found
        userTokens = await this.initializeUserTokens(walletAddress, 'learner');
      }

      return userTokens;
    } catch (error) {
      console.error('Error getting user tokens:', error);
      throw error;
    }
  }

  // Spend tokens
  async spendTokens(walletAddress, amount, transactionType, description, relatedEntity = null) {
    try {
      const userTokens = await this.getUserTokens(walletAddress);
      
      if (userTokens.availableTokens < amount) {
        throw new Error(`Insufficient tokens. Required: ${amount}, Available: ${userTokens.availableTokens}`);
      }

      const balanceBefore = userTokens.availableTokens;
      const balanceAfter = balanceBefore - amount;

      // Update token balances
      userTokens.availableTokens = balanceAfter;
      userTokens.totalTokens = userTokens.totalTokens; // Total stays same, just moving from available
      userTokens.lastTransactionDate = new Date();

      await userTokens.save();

      // Create transaction record
      await this.createTransaction({
        walletAddress,
        transactionType,
        amount: -amount, // Negative for spending
        balanceBefore,
        balanceAfter,
        description,
        relatedEntity
      });

      return userTokens;
    } catch (error) {
      console.error('Error spending tokens:', error);
      throw error;
    }
  }

  // Earn tokens
  async earnTokens(walletAddress, amount, transactionType, description, relatedEntity = null) {
    try {
      const userTokens = await this.getUserTokens(walletAddress);
      
      const balanceBefore = userTokens.availableTokens;
      const balanceAfter = balanceBefore + amount;

      // Update token balances
      userTokens.availableTokens = balanceAfter;
      userTokens.totalTokens = userTokens.totalTokens + amount;
      userTokens.lastTransactionDate = new Date();

      // Update token categories
      if (transactionType === 'prediction_approval') {
        userTokens.tokenCategories.bonus += amount;
      } else if (transactionType === 'achievement_bonus') {
        userTokens.tokenCategories.bonus += amount;
      }

      // Check for level up
      const newLevel = this.calculateLevel(userTokens.totalTokens);
      if (newLevel > userTokens.level) {
        userTokens.level = newLevel;
        // Give level up bonus
        await this.earnTokens(walletAddress, this.tokenRewards.levelUp, 'level_up_bonus', 
          `Level up bonus! Reached level ${newLevel}`, { type: 'level_up', id: newLevel.toString() });
      }

      await userTokens.save();

      // Create transaction record
      await this.createTransaction({
        walletAddress,
        transactionType,
        amount,
        balanceBefore,
        balanceAfter,
        description,
        relatedEntity
      });

      return userTokens;
    } catch (error) {
      console.error('Error earning tokens:', error);
      throw error;
    }
  }

  // Create transaction record
  async createTransaction(transactionData) {
    try {
      const transaction = new TokenTransaction({
        transactionId: uuidv4(),
        ...transactionData
      });

      await transaction.save();
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactionHistory(walletAddress, limit = 20, page = 1) {
    try {
      const skip = (page - 1) * limit;
      
      const transactions = await TokenTransaction.find({ walletAddress })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await TokenTransaction.countDocuments({ walletAddress });

      return {
        transactions,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  // Calculate user level based on total tokens
  calculateLevel(totalTokens) {
    if (totalTokens < 100) return 1;
    if (totalTokens < 250) return 2;
    if (totalTokens < 500) return 3;
    if (totalTokens < 1000) return 4;
    if (totalTokens < 2000) return 5;
    if (totalTokens < 5000) return 6;
    if (totalTokens < 10000) return 7;
    if (totalTokens < 25000) return 8;
    if (totalTokens < 50000) return 9;
    return 10; // Max level
  }

  // Get leaderboard
  async getLeaderboard(userType = null, limit = 10) {
    try {
      const filter = userType ? { userType } : {};
      
      const leaderboard = await UserTokens.find(filter)
        .sort({ totalTokens: -1 })
        .limit(limit)
        .select('walletAddress userType totalTokens level reputation badges');

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Check if user can perform action
  async canPerformAction(walletAddress, action) {
    try {
      const userTokens = await this.getUserTokens(walletAddress);
      const requiredTokens = this.tokenCosts[action];
      
      return {
        canPerform: userTokens.availableTokens >= requiredTokens,
        requiredTokens,
        availableTokens: userTokens.availableTokens,
        userTokens
      };
    } catch (error) {
      console.error('Error checking action permission:', error);
      throw error;
    }
  }

  // Award achievement
  async awardAchievement(walletAddress, achievementName, description) {
    try {
      const userTokens = await this.getUserTokens(walletAddress);
      
      // Check if already has this achievement
      const hasAchievement = userTokens.badges.some(badge => badge.name === achievementName);
      if (hasAchievement) {
        return userTokens;
      }

      // Add achievement badge
      userTokens.badges.push({
        name: achievementName,
        description,
        tokenReward: this.tokenRewards.achievement
      });

      await userTokens.save();

      // Award bonus tokens
      await this.earnTokens(walletAddress, this.tokenRewards.achievement, 'achievement_bonus', 
        `Achievement unlocked: ${achievementName}`, { type: 'achievement', id: achievementName });

      return userTokens;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      throw error;
    }
  }
}

module.exports = new TokenService();
