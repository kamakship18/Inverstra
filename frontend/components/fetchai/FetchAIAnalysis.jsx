import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  Bot, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Loader2,
  BarChart3,
  Activity,
  Clock
} from 'lucide-react';
import fetchaiClient from '../../lib/fetchai';

const FetchAIAnalysis = ({ analysis, loading, error }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('summary');
  const [agentPerformance, setAgentPerformance] = useState(null);

  const darkMode = theme === 'dark';

  useEffect(() => {
    if (analysis && analysis.agentResults) {
      setAgentPerformance(analysis.agentResults);
    }
  }, [analysis]);

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'fair': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getQualityBgColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">Running Fetch.ai Analysis...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Multiple AI agents are analyzing your prediction</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-gray-900 dark:text-gray-100">
          Error running Fetch.ai analysis: {error}
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm" 
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500 dark:text-gray-400">No analysis data available</p>
        </CardContent>
      </Card>
    );
  }

  const quality = fetchaiClient.getAnalysisQuality(analysis?.analysis);

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fetch.ai Analysis</h2>
            <p className="text-gray-600 dark:text-gray-400">Multi-agent AI analysis results</p>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className={`${getQualityBgColor(quality)} border-0`}
        >
          {quality.toUpperCase()}
        </Badge>
      </div>

      {/* Analysis Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Credibility Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analysis?.analysis?.credibilityScore || 0}
            </div>
            <Progress 
              value={analysis?.analysis?.credibilityScore || 0} 
              className="mt-2" 
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Based on multi-agent analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overall Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getConfidenceColor(analysis?.analysis?.overallConfidence || 0)}`}>
              {analysis?.analysis?.overallConfidence || 0}%
            </div>
            <Progress 
              value={analysis?.analysis?.overallConfidence || 0} 
              className="mt-2" 
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Agent consensus confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bot className="h-4 w-4 mr-2" />
              Agents Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analysis.agentsUsed || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Specialized AI agents
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Response time: {(analysis.responseTime / 1000).toFixed(1)}s
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'summary', label: 'Summary', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'market', label: 'Market Data', icon: <TrendingUp className="h-4 w-4" /> },
            { id: 'risk', label: 'Risk Assessment', icon: <Shield className="h-4 w-4" /> },
            { id: 'news', label: 'News Analysis', icon: <Activity className="h-4 w-4" /> },
            { id: 'agents', label: 'Agent Results', icon: <Bot className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Summary</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive analysis from multiple AI agents
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Insights</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {analysis?.analysis?.summary || 'No summary available'}
                  </p>
                </div>
                
                {analysis?.analysis?.recommendations && analysis.analysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {analysis.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'market' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Data Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis?.analysis?.marketData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${analysis.analysis.marketData.currentPrice || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analysis.analysis.marketData.volume24h || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">24h Volume</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${getConfidenceColor(analysis.analysis.marketData.sentiment === 'positive' ? 80 : 30)}`}>
                      {analysis.analysis.marketData.sentiment || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sentiment</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analysis.analysis.marketData.volatility || 'N/A'}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Volatility</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No market data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis?.analysis?.riskAssessment ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Risk Levels</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Overall Risk</span>
                          <span className="text-sm font-medium">{analysis.analysis.riskAssessment.overallRisk || 0}%</span>
                        </div>
                        <Progress value={analysis.analysis.riskAssessment.overallRisk || 0} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Risk Factors</h4>
                      <ul className="space-y-1">
                        {analysis.analysis.riskAssessment.riskFactors?.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            • {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No risk assessment available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">News Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis?.analysis?.newsAnalysis ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getConfidenceColor(analysis.analysis.newsAnalysis.sentimentScore || 0)}`}>
                        {analysis.analysis.newsAnalysis.sentiment || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sentiment</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analysis.analysis.newsAnalysis.newsCount || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">News Articles</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analysis.analysis.newsAnalysis.impactScore || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Impact Score</p>
                    </div>
                  </div>
                  {analysis.analysis.newsAnalysis.keyHeadlines && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Headlines</h4>
                      <ul className="space-y-1">
                        {analysis.analysis.newsAnalysis.keyHeadlines.map((headline, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            • {headline}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No news analysis available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {agentPerformance && agentPerformance.length > 0 ? (
                <div className="space-y-4">
                  {agentPerformance.map((agent, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {agent.agentName}
                        </h4>
                        <Badge variant="outline">
                          {agent.task}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                          <p className="font-medium">{agent.responseTime}ms</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <p className="font-medium">{agent.success ? 'Success' : 'Failed'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                          <p className="font-medium">{agent.result?.quality || 0}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Agent ID:</span>
                          <p className="font-medium text-xs">{agent.agentId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No agent performance data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FetchAIAnalysis;
