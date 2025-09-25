import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Award, History, Trophy, Zap } from 'lucide-react';

const TokenModal = ({ isOpen, onClose, walletAddress, userType }) => {
  const [tokens, setTokens] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && walletAddress) {
      generateDemoData();
    }
  }, [isOpen, walletAddress, userType]);

  const generateDemoData = () => {
    // Generate demo tokens
    const demoTokens = {
      walletAddress: walletAddress,
      userType: userType,
      totalTokens: userType === 'learner' ? 20 : userType === 'influencer' ? 50 : 30,
      availableTokens: userType === 'learner' ? 20 : userType === 'influencer' ? 50 : 30,
      lockedTokens: 0,
      tokenCategories: {
        viewing: userType === 'learner' ? 20 : 0,
        voting: userType === 'dao_member' ? 30 : 0,
        creation: userType === 'influencer' ? 50 : 0,
        bonus: 0
      },
      level: 1,
      reputation: 0,
      badges: [
        {
          name: "Welcome Bonus",
          description: "Received initial tokens for joining",
          earnedAt: new Date(),
          tokenReward: userType === 'learner' ? 20 : userType === 'influencer' ? 50 : 30
        }
      ],
      lastTransactionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Generate demo transaction history
    const demoHistory = [
      {
        transactionId: "demo-1",
        walletAddress: walletAddress,
        transactionType: "initial_bonus",
        amount: userType === 'learner' ? 20 : userType === 'influencer' ? 50 : 30,
        balanceBefore: 0,
        balanceAfter: userType === 'learner' ? 20 : userType === 'influencer' ? 50 : 30,
        description: `Welcome bonus: ${userType === 'learner' ? 20 : userType === 'influencer' ? 50 : 30} tokens for ${userType} registration`,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        transactionId: "demo-2",
        walletAddress: walletAddress,
        transactionType: "daily_bonus",
        amount: 5,
        balanceBefore: userType === 'learner' ? 20 : userType === 'influencer' ? 50 : 30,
        balanceAfter: (userType === 'learner' ? 20 : userType === 'influencer' ? 50 : 30) + 5,
        description: "Daily login bonus: 5 tokens",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    setTokens(demoTokens);
    setTransactionHistory(demoHistory);
  };

  const getTokenCategoryIcon = (category) => {
    switch (category) {
      case 'viewing': return <Coins className="w-4 h-4 text-yellow-500" />;
      case 'voting': return <Award className="w-4 h-4 text-purple-500" />;
      case 'creation': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bonus': return <Zap className="w-4 h-4 text-blue-500" />;
      default: return <Coins className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'initial_bonus': return <Zap className="w-4 h-4 text-green-500" />;
      case 'prediction_view': return <Coins className="w-4 h-4 text-yellow-500" />;
      case 'prediction_create': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'dao_vote': return <Award className="w-4 h-4 text-purple-500" />;
      case 'prediction_approval': return <Trophy className="w-4 h-4 text-green-500" />;
      case 'achievement_bonus': return <Award className="w-4 h-4 text-yellow-500" />;
      default: return <Coins className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTransactionType = (type) => {
    const types = {
      'initial_bonus': 'Welcome Bonus',
      'prediction_view': 'View Prediction',
      'prediction_create': 'Create Prediction',
      'dao_vote': 'DAO Vote',
      'prediction_approval': 'Prediction Approved',
      'achievement_bonus': 'Achievement Bonus',
      'level_up_bonus': 'Level Up Bonus',
      'daily_bonus': 'Daily Bonus',
      'referral_bonus': 'Referral Bonus'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white sm:max-w-2xl">
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="ml-2 text-gray-400">Loading token data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!tokens) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white sm:max-w-2xl">
          <div className="text-center p-8">
            <p className="text-gray-400">Failed to load token data</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Coins className="mr-2 text-yellow-500" size={24} />
            Token Dashboard
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your tokens and track your progress
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className="flex-1"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className="flex-1"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button
            variant={activeTab === 'achievements' ? 'default' : 'outline'}
            onClick={() => setActiveTab('achievements')}
            className="flex-1"
          >
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-500/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-400 text-sm">Available</p>
                    <p className="text-2xl font-bold text-white">{tokens.availableTokens}</p>
                  </div>
                  <Coins className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">{tokens.totalTokens}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl border border-green-500/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 text-sm">Level</p>
                    <p className="text-2xl font-bold text-white">{tokens.level}</p>
                  </div>
                  <Award className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-400 text-sm">Reputation</p>
                    <p className="text-2xl font-bold text-white">{tokens.reputation}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Token Categories */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Token Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(tokens.tokenCategories).map(([category, amount]) => (
                  <div key={category} className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg">
                    {getTokenCategoryIcon(category)}
                    <div>
                      <p className="text-sm text-gray-400 capitalize">{category}</p>
                      <p className="font-semibold text-white">{amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <div className="space-y-3">
              {transactionHistory.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.transactionType)}
                    <div>
                      <p className="font-medium text-white">{formatTransactionType(transaction.transactionType)}</p>
                      <p className="text-sm text-gray-400">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </p>
                    <p className="text-sm text-gray-400">Balance: {transaction.balanceAfter}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tokens.badges && tokens.badges.length > 0 ? (
                tokens.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-500/20">
                    <Award className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-white">{badge.name}</p>
                      <p className="text-sm text-gray-400">{badge.description}</p>
                      <p className="text-xs text-yellow-400">
                        Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <Award className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No achievements yet</p>
                  <p className="text-sm text-gray-500">Keep using the platform to earn achievements!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TokenModal;
