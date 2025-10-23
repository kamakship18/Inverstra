/**
 * Fetch.ai Demo Page
 * This page demonstrates the Fetch.ai integration functionality
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Bot, Zap, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FetchAIDashboard from '../components/fetchai/FetchAIDashboard';
import FetchAIAnalysis from '../components/fetchai/FetchAIAnalysis';
import fetchaiClient from '../lib/fetchai';
import ThemeToggle from '../components/ui/ThemeToggle';

const FetchAIDemo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [testPrediction, setTestPrediction] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize test prediction data
    setTestPrediction({
      title: 'Bitcoin will reach $100,000 by end of 2024',
      description: 'Based on institutional adoption, upcoming halving cycle, and growing mainstream acceptance, Bitcoin is positioned for significant growth.',
      category: 'crypto',
      creator: '0x1234567890123456789012345678901234567890',
      createdAt: new Date().toISOString(),
      investmentAmount: 10000,
      riskTolerance: 'moderate',
      timeHorizon: '1 year'
    });
  }, []);

  const runTestAnalysis = async () => {
    if (!testPrediction) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchaiClient.analyzePrediction(testPrediction);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error running test analysis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Bot className="h-4 w-4" /> },
    { id: 'analysis', label: 'Analysis Demo', icon: <Zap className="h-4 w-4" /> },
    { id: 'about', label: 'About', icon: <CheckCircle className="h-4 w-4" /> }
  ];

  return (
    <>
      <Head>
        <title>Fetch.ai Demo - Inverstra</title>
        <meta name="description" content="Demonstration of Fetch.ai integration with Inverstra platform" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Main App</span>
                </Link>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center space-x-3">
                  <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Fetch.ai Integration Demo</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Advanced AI agents for financial prediction analysis</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Beta
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
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
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fetch.ai Agent Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-400">Monitor and manage your AI agents in real-time</p>
              </div>
              <FetchAIDashboard />
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Prediction Analysis Demo</h2>
                <p className="text-gray-600 dark:text-gray-400">See how Fetch.ai agents analyze investment predictions</p>
              </div>

              {/* Test Prediction Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Sample Prediction</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    A pre-defined prediction to demonstrate agent analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testPrediction && (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-white">{testPrediction.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{testPrediction.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Category: {testPrediction.category}</Badge>
                        <Badge variant="secondary">Risk: {testPrediction.riskTolerance}</Badge>
                        <Badge variant="secondary">Amount: ${testPrediction.investmentAmount}</Badge>
                        <Badge variant="secondary">Horizon: {testPrediction.timeHorizon}</Badge>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-4">
                    <Button 
                      onClick={runTestAnalysis} 
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>Run AI Analysis</span>
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setAnalysisResult(null)}
                      disabled={loading}
                    >
                      Clear Results
                    </Button>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-gray-900 dark:text-gray-100">
                        Error: {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {analysisResult && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis Results</h3>
                  <FetchAIAnalysis 
                    analysis={analysisResult} 
                    loading={loading} 
                    error={error} 
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">About Fetch.ai Integration</h2>
                <p className="text-gray-600 dark:text-gray-400">Learn about the advanced AI capabilities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-blue-600" />
                      Multi-Agent Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Specialized AI agents work together to provide comprehensive analysis of investment predictions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-green-600" />
                      Real-time Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Get instant analysis with multiple AI agents processing data in parallel for faster results.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                      Enhanced Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Multiple agents provide different perspectives, leading to more accurate and reliable predictions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-orange-600" />
                      Specialized Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Each agent specializes in different aspects: market data, risk assessment, news analysis, and more.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-red-600" />
                      Token Economy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Agents are rewarded with tokens for quality work, creating an incentive for better performance.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-indigo-600" />
                      Continuous Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Agents improve over time through feedback and performance metrics, getting smarter with each analysis.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FetchAIDemo;
