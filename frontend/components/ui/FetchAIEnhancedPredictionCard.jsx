import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ChevronRight, Lock, Coins, Eye, TrendingUp, Calendar, User, Bot, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Progress } from './progress';
import fetchaiClient from '../../lib/fetchai';

const FetchAIEnhancedPredictionCard = ({ prediction, onViewPrediction, userTokens }) => {
  const { theme } = useTheme();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [fetchaiAnalysis, setFetchaiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const darkMode = theme === 'dark';

  // Run Fetch.ai analysis when component mounts
  useEffect(() => {
    if (prediction && !fetchaiAnalysis) {
      runFetchAIAnalysis();
    }
  }, [prediction]);

  const runFetchAIAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      const analysis = await fetchaiClient.analyzePrediction(prediction);
      setFetchaiAnalysis(analysis);
    } catch (error) {
      console.error('Fetch.ai analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUnlockPrediction = async () => {
    if (isUnlocked) {
      onViewPrediction(prediction);
      return;
    }

    if (!userTokens || userTokens.availableTokens < 2) {
      alert('Insufficient tokens! You need 2 tokens to view this prediction.');
      return;
    }

    setIsUnlocking(true);
    
    // Simulate token spending for demo
    setTimeout(() => {
      setIsUnlocked(true);
      onViewPrediction(prediction);
      
      // Update user tokens in parent component (demo mode)
      // eslint-disable-next-line no-undef
      if (window.updateUserTokens) {
        const updatedTokens = {
          ...userTokens,
          availableTokens: userTokens.availableTokens - 2,
          totalTokens: userTokens.totalTokens - 2
        };
        // eslint-disable-next-line no-undef
        window.updateUserTokens(updatedTokens);
      }
      
      alert('Prediction unlocked! Cost: 2 tokens');
      setIsUnlocking(false);
    }, 1000);
  };

  const getCategoryColor = (category) => {
    if (darkMode) {
      switch (category) {
        case 'Equities': return 'text-blue-400 bg-blue-900/20 border-blue-500/20';
        case 'Crypto': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
        case 'Commodities': return 'text-green-400 bg-green-900/20 border-green-500/20';
        default: return 'text-purple-400 bg-purple-900/20 border-purple-500/20';
      }
    } else {
      switch (category) {
        case 'Equities': return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'Crypto': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'Commodities': return 'text-green-600 bg-green-50 border-green-200';
        default: return 'text-purple-600 bg-purple-50 border-purple-200';
      }
    }
  };

  const getStatusColor = (status) => {
    if (darkMode) {
      switch (status) {
        case 'active': return 'text-green-400 bg-green-900/20';
        case 'completed': return 'text-blue-400 bg-blue-900/20';
        case 'expired': return 'text-red-400 bg-red-900/20';
        default: return 'text-gray-400 bg-gray-900/20';
      }
    } else {
      switch (status) {
        case 'active': return 'text-green-600 bg-green-50';
        case 'completed': return 'text-blue-600 bg-blue-50';
        case 'expired': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    }
  };

  const getAnalysisQuality = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/20' };
    if (score >= 80) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20' };
    if (score >= 70) return { label: 'Fair', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { label: 'Poor', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20' };
  };

  return (
    <div className={`rounded-xl transition-all duration-300 hover:shadow-lg ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 hover:shadow-slate-900/20' 
        : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
    }`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(prediction.category)}`}>
                {prediction.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prediction.status)}`}>
                {prediction.status}
              </span>
              {/* Fetch.ai Analysis Badge */}
              {fetchaiAnalysis && (
                <Badge 
                  variant="secondary" 
                  className={`${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).bg} ${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).color} border-0`}
                >
                  <Bot className="w-3 h-3 mr-1" />
                  AI Enhanced
                </Badge>
              )}
            </div>
            <h3 className={`text-lg font-semibold mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {prediction.title}
            </h3>
            <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {prediction.description}
            </p>
          </div>
          
          {/* Token Cost Badge */}
          <div className={`flex items-center space-x-1 rounded-lg px-2 py-1 ${
            darkMode 
              ? 'bg-yellow-900/20 border border-yellow-500/20' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <Coins className={`w-4 h-4 ${darkMode ? 'text-yellow-500' : 'text-yellow-600'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>2</span>
          </div>
        </div>

        {/* Fetch.ai Analysis Summary */}
        {fetchaiAnalysis && (
          <div className={`mb-4 p-3 rounded-lg border ${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Bot className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Analysis
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Credibility: {fetchaiAnalysis?.analysis?.credibilityScore || 0}%
                </span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).color} ${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).bg}`}
                >
                  {getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).label}
                </Badge>
              </div>
            </div>
            <Progress 
              value={fetchaiAnalysis?.analysis?.credibilityScore || 0} 
              className="mb-2" 
            />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {typeof fetchaiAnalysis?.analysis?.summary === 'string' 
                ? fetchaiAnalysis.analysis.summary 
                : JSON.stringify(fetchaiAnalysis?.analysis?.summary || 'No summary available')}
            </p>
          </div>
        )}

        {/* Analysis Loading State */}
        {isAnalyzing && (
          <div className={`mb-4 p-3 rounded-lg border ${
            darkMode 
              ? 'bg-blue-900/20 border-blue-500/20' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Running AI analysis...
              </span>
            </div>
          </div>
        )}

        {/* Prediction Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-green-500' : 'text-green-600'}`} />
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Target</p>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{prediction.targetPrice}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`} />
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Deadline</p>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{prediction.deadline}</p>
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              by {prediction.creator ? prediction.creator.substring(0, 6) + '...' : 'Anonymous'}
            </span>
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {prediction.confidence}% confidence
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 space-y-3">
        {/* View AI Analysis Button */}
        {fetchaiAnalysis && (
          <Button
            variant="outline"
            onClick={() => setShowAnalysis(!showAnalysis)}
            className={`w-full ${
              darkMode 
                ? 'border-blue-500/20 bg-blue-900/20 hover:bg-blue-800/30 text-blue-400' 
                : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600'
            }`}
          >
            <Bot className="w-4 h-4 mr-2" />
            {showAnalysis ? 'Hide' : 'View'} AI Analysis
          </Button>
        )}

        {/* Unlock Prediction Button */}
        <button
          onClick={handleUnlockPrediction}
          disabled={isUnlocking || (!isUnlocked && (!userTokens || userTokens.availableTokens < 2))}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200 ${
            isUnlocked
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : isUnlocking
              ? darkMode 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : (!userTokens || userTokens.availableTokens < 2)
              ? darkMode 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-lg'
          }`}
        >
          {isUnlocking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Unlocking...</span>
            </>
          ) : isUnlocked ? (
            <>
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Unlock with 2 Tokens</span>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Token Balance Warning */}
        {!isUnlocked && userTokens && userTokens.availableTokens < 2 && (
          <div className={`p-2 rounded-lg ${
            darkMode 
              ? 'bg-red-900/20 border border-red-500/20' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-xs text-center ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              Insufficient tokens. You have {userTokens.availableTokens} tokens, need 2.
            </p>
          </div>
        )}
      </div>

      {/* Detailed AI Analysis */}
      {showAnalysis && fetchaiAnalysis && (
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="p-6">
            <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Detailed AI Analysis
            </h4>
            
            <div className="space-y-4">
              {/* Credibility Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Credibility Score
                  </span>
                  <span className={`text-sm font-bold ${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).color}`}>
                    {fetchaiAnalysis?.analysis?.credibilityScore || 0}%
                  </span>
                </div>
                <Progress value={fetchaiAnalysis?.analysis?.credibilityScore || 0} className="mb-2" />
              </div>

              {/* Market Context */}
              {fetchaiAnalysis?.analysis?.marketContext && (
                <div>
                  <h5 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Market Context
                  </h5>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {typeof fetchaiAnalysis.analysis.marketContext === 'string' 
                      ? fetchaiAnalysis.analysis.marketContext 
                      : JSON.stringify(fetchaiAnalysis.analysis.marketContext)}
                  </p>
                </div>
              )}

              {/* Risk Assessment */}
              {fetchaiAnalysis?.analysis?.riskAssessment && (
                <div>
                  <h5 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Risk Assessment
                  </h5>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {typeof fetchaiAnalysis.analysis.riskAssessment === 'string' 
                      ? fetchaiAnalysis.analysis.riskAssessment 
                      : JSON.stringify(fetchaiAnalysis.analysis.riskAssessment)}
                  </p>
                </div>
              )}

              {/* Agent Performance */}
              {fetchaiAnalysis.agentPerformance && (
                <div>
                  <h5 className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Agent Performance
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(fetchaiAnalysis.agentPerformance).map(([agent, performance]) => (
                      <div key={agent} className="flex items-center justify-between">
                        <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {agent}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {performance.quality}%
                          </span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full" 
                              style={{ width: `${performance.quality}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchAIEnhancedPredictionCard;
