import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Award, Zap } from 'lucide-react';

const TokenDisplay = ({ walletAddress, userType, showDetails = false, className = "" }) => {
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      // Generate demo tokens based on user type
      generateDemoTokens();
    }
  }, [walletAddress, userType]);

  const generateDemoTokens = () => {
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
    
    setTokens(demoTokens);
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse flex space-x-2">
          <div className="w-6 h-6 bg-yellow-500/20 rounded-full"></div>
          <div className="w-12 h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!tokens) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Coins className="w-5 h-5 text-yellow-500" />
        <span className="text-gray-400">--</span>
      </div>
    );
  }

  const getTokenIcon = () => {
    switch (userType) {
      case 'learner':
        return <Coins className="w-5 h-5 text-yellow-500" />;
      case 'influencer':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'dao_member':
        return <Award className="w-5 h-5 text-purple-500" />;
      default:
        return <Zap className="w-5 h-5 text-blue-500" />;
    }
  };

  const getLevelColor = (level) => {
    if (level >= 8) return 'text-red-400';
    if (level >= 6) return 'text-purple-400';
    if (level >= 4) return 'text-blue-400';
    if (level >= 2) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getLevelBadge = (level) => {
    if (level >= 8) return '🔥 Legend';
    if (level >= 6) return '💎 Expert';
    if (level >= 4) return '⭐ Advanced';
    if (level >= 2) return '🚀 Intermediate';
    return '🌱 Beginner';
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Main Token Display */}
      <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/20 rounded-lg px-3 py-2">
        {getTokenIcon()}
        <div className="flex flex-col">
          <span className="text-yellow-400 font-bold text-lg">{tokens.availableTokens}</span>
          <span className="text-xs text-gray-400">tokens</span>
        </div>
      </div>

      {/* Level Badge */}
      <div className="flex items-center space-x-2">
        <div className={`text-sm font-semibold ${getLevelColor(tokens.level)}`}>
          Lv.{tokens.level}
        </div>
        <div className="text-xs text-gray-400">
          {getLevelBadge(tokens.level)}
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total:</span>
            <span className="text-white font-semibold">{tokens.totalTokens}</span>
          </div>
          {tokens.lockedTokens > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">Locked:</span>
              <span className="text-orange-400">{tokens.lockedTokens}</span>
            </div>
          )}
          {tokens.badges && tokens.badges.length > 0 && (
            <div className="flex items-center space-x-1">
              <Award className="w-3 h-3 text-yellow-500" />
              <span className="text-yellow-400">{tokens.badges.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenDisplay;
