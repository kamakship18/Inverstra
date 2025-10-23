import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Clock, Bot, Loader2, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Progress } from './progress';
import fetchaiClient from '../../lib/fetchai';

const FetchAIEnhancedInfluencerCard = ({ prediction, darkMode }) => {
  const [fetchaiAnalysis, setFetchaiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

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

  const renderConfidence = (confidence) => {
    const stars = '★'.repeat(confidence) + '☆'.repeat(5 - confidence);
    return (
      <span className={`text-yellow-400 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>
        {stars}
      </span>
    );
  };

  const daysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getAnalysisQuality = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/10' };
    if (score >= 80) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (score >= 70) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  return (
    <Card 
      className={`rounded-2xl shadow-md transition-all w-72 flex-shrink-0 ${
        darkMode 
          ? 'bg-[#1a1a1a] border border-white/10 hover:shadow-cyan-500/20' 
          : 'bg-white border border-gray-200 hover:shadow-lg'
      }`}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {prediction.asset}
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={prediction.status === 'Active' 
                ? (darkMode 
                    ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                    : 'border-green-300 bg-green-50 text-green-700')
                : (darkMode 
                    ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                    : 'border-yellow-300 bg-yellow-50 text-yellow-700')}
            >
              {prediction.status}
            </Badge>
            {/* Fetch.ai Analysis Badge */}
            {fetchaiAnalysis && (
                <Badge 
                  variant="outline" 
                  className={`${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).bg} ${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).color} border-0`}
                >
                  <Bot className="w-3 h-3 mr-1" />
                  AI
                </Badge>
            )}
          </div>
        </div>
        
        <div className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          {prediction.type}
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
                <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Analysis
                </span>
              </div>
              <span className={`text-xs ${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).color}`}>
                {fetchaiAnalysis?.analysis?.credibilityScore || 0}%
              </span>
            </div>
            <Progress 
              value={fetchaiAnalysis?.analysis?.credibilityScore || 0} 
              className="mb-2" 
            />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {typeof fetchaiAnalysis?.analysis?.summary === 'string' 
                ? fetchaiAnalysis.analysis.summary.substring(0, 80) + '...'
                : JSON.stringify(fetchaiAnalysis?.analysis?.summary || 'No summary available').substring(0, 80) + '...'}
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
              <span className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Running AI analysis...
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Confidence
          </div>
          <div className="text-sm">{renderConfidence(prediction.confidence)}</div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center gap-1 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            <Clock className="w-4 h-4" />
            <span>{daysRemaining(prediction.endDate)} days left</span>
          </div>
          <div className="flex items-center space-x-2">
            {fetchaiAnalysis && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`text-xs p-1 h-auto ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                <Bot className="w-3 h-3 mr-1" />
                AI
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs p-0 h-auto ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}
            >
              Details
            </Button>
          </div>
        </div>

        {/* Detailed AI Analysis */}
        {showAnalysis && fetchaiAnalysis && (
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h5 className={`text-xs font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Analysis Details
            </h5>
            
            <div className="space-y-2">
              {/* Credibility Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Credibility
                  </span>
                  <span className={`text-xs font-bold ${getAnalysisQuality(fetchaiAnalysis?.analysis?.credibilityScore).color}`}>
                    {fetchaiAnalysis?.analysis?.credibilityScore || 0}%
                  </span>
                </div>
                <Progress value={fetchaiAnalysis?.analysis?.credibilityScore || 0} className="h-1" />
              </div>

              {/* Market Context */}
              {fetchaiAnalysis?.analysis?.marketContext && (
                <div>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Market: 
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {typeof fetchaiAnalysis.analysis.marketContext === 'string' 
                      ? fetchaiAnalysis.analysis.marketContext.substring(0, 60) + '...'
                      : JSON.stringify(fetchaiAnalysis.analysis.marketContext).substring(0, 60) + '...'}
                  </p>
                </div>
              )}

              {/* Risk Assessment */}
              {fetchaiAnalysis?.analysis?.riskAssessment && (
                <div>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Risk: 
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {typeof fetchaiAnalysis.analysis.riskAssessment === 'string' 
                      ? fetchaiAnalysis.analysis.riskAssessment.substring(0, 60) + '...'
                      : JSON.stringify(fetchaiAnalysis.analysis.riskAssessment).substring(0, 60) + '...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FetchAIEnhancedInfluencerCard;
