import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Brain, X, Sun, Moon } from "lucide-react";
import Link from 'next/link';
import communityPredictions from './communityPredictions.json';

export default function CommunityHub() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [walletAddress, setWalletAddress] = useState("");
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [userTokens, setUserTokens] = useState(null);

  const darkMode = theme === 'dark';
  
  useEffect(() => {
    setMounted(true);
    fetchActivePredictions();
    generateDemoTokens();
    
    // Get wallet address from localStorage
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
    } else {
      // Fallback for demo purposes
      setWalletAddress("0x7F4e8ce31EE1F0924057366Fd56252B4BB711AF3");
      localStorage.setItem('userRole', 'influencer'); // Set default role
    }
  }, []);

  // Generate demo user tokens
  const generateDemoTokens = () => {
    const walletAddress = localStorage.getItem('connectedWalletAddress') || "0x7F4e8ce31EE1F0924057366Fd56252B4BB711AF3";
    const userRole = localStorage.getItem('userRole') || 'influencer';
    
    const demoTokens = {
      walletAddress: walletAddress,
      userType: userRole,
      totalTokens: userRole === 'learner' ? 20 : userRole === 'influencer' ? 50 : 30,
      availableTokens: userRole === 'learner' ? 20 : userRole === 'influencer' ? 50 : 30,
      lockedTokens: 0,
      tokenCategories: {
        viewing: userRole === 'learner' ? 20 : 0,
        voting: userRole === 'dao_member' ? 30 : 0,
        creation: userRole === 'influencer' ? 50 : 0,
        bonus: 0
      },
      level: 1,
      reputation: 0,
      badges: [
        {
          name: "Welcome Bonus",
          description: "Received initial tokens for joining",
          earnedAt: new Date(),
          tokenReward: userRole === 'learner' ? 20 : userRole === 'influencer' ? 50 : 30
        }
      ],
      lastTransactionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setUserTokens(demoTokens);
  };

  const fetchActivePredictions = async () => {
    try {
      // Try to fetch from MongoDB first
      const response = await fetch('/api/prediction-data?status=submitted-to-dao&limit=20');
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        // Transform MongoDB data to match the expected format
        const transformedPredictions = result.data.map(pred => ({
          id: pred._id,
          creatorName: pred.createdBy ? formatAddress(pred.createdBy) : 'Anonymous',
          community: 'DAO Community',
          category: pred.formData?.category || 'General',
          asset: pred.formData?.asset || 'Unknown Asset',
          predictionType: pred.formData?.predictionType || 'priceTarget',
          targetPrice: pred.formData?.targetPrice || 'N/A',
          deadline: pred.formData?.deadline || 'N/A',
          confidence: pred.formData?.confidence || 3,
          reasoning: pred.reasoning || 'No reasoning provided',
          confirmed: pred.formData?.confirmed || false,
          votes: { yes: pred.daoData?.yesVotes || 0, no: pred.daoData?.noVotes || 0 },
          status: pred.status || 'submitted-to-dao',
          createdAt: pred.createdAt,
          validationScore: pred.validationScore || 0
        }));
        
        setPredictions(transformedPredictions);
      } else {
        // Fallback to static data if no MongoDB data
        setPredictions(communityPredictions);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      // Fallback to static data
      setPredictions(communityPredictions);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleVote = async (predictionId, voteType) => {
    try {
      // Check if user has enough tokens to vote
      if (!userTokens || userTokens.availableTokens < 1) {
        alert('Insufficient tokens! You need 1 token to vote in DAO.');
        return;
      }

      // Simulate token spending for demo
      const updatedTokens = {
        ...userTokens,
        availableTokens: userTokens.availableTokens - 1,
        totalTokens: userTokens.totalTokens - 1
      };
      setUserTokens(updatedTokens);

      // Simulate vote submission
      setUserVotes(prev => ({
        ...prev,
        [predictionId]: voteType
      }));

      // Update vote count in the prediction data
      setPredictions(prev => prev.map(pred => {
        if (pred.id === predictionId) {
          return {
            ...pred,
            votes: {
              yes: voteType === 'yes' ? pred.votes.yes + 1 : pred.votes.yes,
              no: voteType === 'no' ? pred.votes.no + 1 : pred.votes.no
            }
          };
        }
        return pred;
      }));
      
      alert(`Vote ${voteType === 'yes' ? 'YES' : 'NO'} recorded successfully! Cost: 1 token`);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error submitting vote. Please try again.');
    }
  };

  const handleAIAnalysis = async (prediction) => {
    setLoadingAI(true);
    setCurrentPrediction(prediction);
    setShowAiDialog(true);
    
    try {
      // Demo mode: Generate AI analysis locally
      const demoAnalysis = {
        summary: `AI Analysis: ${prediction.asset} → ${prediction.targetPrice}`,
        marketContext: `Based on current market trends, ${prediction.asset} shows ${prediction.category === 'Crypto' ? 'high volatility with potential for significant movements' : 'stable growth patterns with moderate risk factors'}. The prediction aligns with current market sentiment and technical indicators.`,
        credibilityAssessment: `This prediction has a ${prediction.confidence}% confidence level. The creator has provided detailed reasoning and the asset shows strong fundamentals. The timeframe appears realistic based on historical data.`,
        relatedNews: `Recent market developments support this prediction: ${prediction.category === 'Crypto' ? 'Institutional adoption continues to grow, with major companies adding crypto to their balance sheets' : 'Economic indicators show positive trends for traditional assets'}. Market sentiment is generally bullish for this asset class.`,
        confidence: Math.min(prediction.confidence || 75, 95)
      };
      
      // Simulate loading delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAiAnalysis(demoAnalysis);
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      setAiAnalysis({
        summary: `Analysis for: ${prediction.asset}`,
        marketContext: 'Market analysis unavailable',
        credibilityAssessment: 'Credibility assessment unavailable',
        relatedNews: 'Related news unavailable',
        confidence: 5
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getConsensusPercentage = (votes) => {
    const total = votes.yes + votes.no;
    return total > 0 ? Math.round((votes.yes / total) * 100) : 0;
  };

  const askAi = (prediction) => {
    setCurrentPrediction(prediction);
    setShowAiDialog(true);
    setAiResponse("");
    
    setTimeout(() => {
      const responses = [
        `Based on current market trends and technical analysis, this ${prediction.asset} prediction has a moderate probability of occurring. The target price of ${prediction.targetPrice} is ambitious but not impossible given recent momentum. I would recommend watching for key support levels before making any decisions.`,
        `This ${prediction.asset} prediction seems overly optimistic. While the asset has shown strong performance, the target price of ${prediction.targetPrice} represents a significant deviation from current analyst consensus. Market volatility could work against this prediction in the near term.`,
        `The ${prediction.asset} prediction to reach ${prediction.targetPrice} aligns with several fundamental indicators and appears to have a reasonable chance of success. Recent institutional interest in this asset class supports this bullish outlook.`
      ];
      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
    }, 1000);
  };

  const userStats = {
    votesCast: 12,
    alignedWithDAO: 83,
    supportedPublished: 9,
    streak: 5,
    rank: "Top 10%"
  };

  const votingHistory = [
    { title: "ETH to $2.5K", result: "✅ Published", youVoted: "Up", consensus: "78% Up" },
    { title: "BTC above $75K", result: "❌ Rejected", youVoted: "Down", consensus: "65% Down" },
    { title: "AAPL Q2 Beat", result: "⏳ Pending", youVoted: "Up", consensus: "51% Up" }
  ];

  const activityFeed = [
    { type: "submit", user: "AlphaGuru", action: "submitted a prediction on", subject: "Tesla earnings beat", time: "2h ago" },
    { type: "vote", user: "Community", action: "voted to reject", subject: "@BetaBoi's BTC call", time: "5h ago" },
    { type: "comment", user: "CryptoQueen", action: "commented on", subject: "Reliance forecast", time: "8h ago" },
    { type: "publish", user: "DAO", action: "published", subject: "NIFTY prediction to chain", time: "1d ago" }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'vote': return '🗳️';
      case 'submit': return '✍️';
      case 'comment': return '💬';
      case 'publish': return '📣';
      default: return '📋';
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100 text-gray-900'
    }`}>
      {/* Navbar with wallet address */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 transition-colors ${
        darkMode 
          ? 'bg-slate-900/80 border-slate-800' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Investra</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/influencer/dashboard" className={`transition-colors ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
              Dashboard
            </Link>
            <Link href="/community-hub" className={`font-medium border-b-2 border-blue-500 pb-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Community Hub
            </Link>
            
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(darkMode ? 'light' : 'dark')}
              className={`p-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          
          {walletAddress ? (
            <div className={`border rounded-full px-4 py-2 flex items-center space-x-2 transition-colors ${
              darkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-gray-100 border-gray-300'
            }`}>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {formatAddress(walletAddress)}
              </span>
            </div>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-glow-blue">
              Connect Wallet
            </Button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Governance Footprint Section - Moved to Top */}
        <div className="mb-8">
          <h2 className={`text-3xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Governance Footprint
          </h2>
          
          <Card className={`backdrop-blur-md p-4 mb-6 transition-colors ${
            darkMode 
              ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700' 
              : 'bg-white/70 border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex flex-col">
                <span className={`text-sm font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Votes Cast
                </span>
                <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userStats.votesCast}
                </span>
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Aligned with DAO
                </span>
                <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userStats.alignedWithDAO}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Supported & Published
                </span>
                <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userStats.supportedPublished}
                </span>
              </div>
            </div>
          </Card>
          
          <div className="space-y-3">
            {votingHistory.map((item, index) => (
              <div 
                key={index}
                className={`flex justify-between items-center p-4 border rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700' 
                    : 'bg-white/40 border-gray-200 hover:bg-white/70 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Badge className={`font-black text-base px-3 py-1 ${
                    item.result.includes('✅') ? 'bg-green-600 text-white' : 
                    item.result.includes('❌') ? 'bg-red-600 text-white' : 
                    'bg-blue-600 text-white'
                  } border-2 border-opacity-100`}>
                    {item.result}
                  </Badge>
                  <span className={`font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`font-black text-base px-3 py-1 ${
                    item.youVoted === 'Up' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  } border-2 border-opacity-100`}>
                    You: {item.youVoted}
                  </Badge>
                  <span className={`text-sm font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {item.consensus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* voting - Extended to full width */}
        <div className="w-full space-y-6">
            <h1 className={`text-3xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pending Predictions
            </h1>
            
            {predictions.map((prediction) => {
              const consensusPercentage = getConsensusPercentage(prediction.votes);
              const hasVoted = userVotes[prediction.id] !== undefined;
              
              return (
                <Card 
                  key={prediction.id}
                  className={`backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300 group ${
                    darkMode 
                      ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700' 
                      : 'bg-white/70 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className={`text-2xl font-black group-hover:text-blue-400 transition-colors ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {prediction.asset}
                          </h2>
                          <span className="text-blue-400 font-black text-lg">→ {prediction.targetPrice}</span>
                        </div>
                        <p className={`text-sm font-black mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          Proposed by <span className="text-blue-300 font-black">@{prediction.creatorName}</span> | {prediction.community}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-violet-900/80 text-violet-300 border border-violet-600/30">
                          {prediction.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex gap-2 mb-3">
                      <Badge className="bg-blue-900/80 text-blue-300 border border-blue-600/30">
                        ⌛ {getDaysLeft(prediction.deadline)} days left
                      </Badge>
                      <Badge className="bg-amber-900/80 text-amber-300 border border-amber-600/30 flex items-center">
                        <span>Confidence: </span>
                        <span className="ml-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < prediction.confidence ? "text-yellow-400" : "text-gray-600"}>★</span>
                          ))}
                        </span>
                      </Badge>
                    </div>
                    
                    <p className={`line-clamp-4 font-black ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {prediction.reasoning}
                    </p>
                    
                    {hasVoted && (
                      <div className="mt-4">
                        <p className={`text-sm font-black mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          Community Consensus
                        </p>
                        <div className="flex items-center">
                          <div className={`w-full rounded-full h-2 mr-3 ${
                            darkMode ? 'bg-slate-800' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`${consensusPercentage > 50 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`}
                              style={{ width: `${consensusPercentage}%` }} 
                            />
                          </div>
                          <span className={`text-sm font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {consensusPercentage}% in favor
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className={`flex flex-wrap justify-between gap-3 pt-4 border-t ${
                    darkMode ? 'border-slate-800' : 'border-gray-200'
                  }`}>
                    <div className="flex gap-2">
                      {hasVoted ? (
                        <div className={`px-4 py-2 rounded-md flex items-center font-black text-base ${
                          userVotes[prediction.id] === 'yes' 
                          ? 'bg-green-600 text-white border-2 border-green-500' 
                          : 'bg-red-600 text-white border-2 border-red-500'
                        }`}>
                          You voted: {userVotes[prediction.id] === 'yes' ? '👍' : '👎'}
                        </div>
                      ) : (
                        <>
                          <Button 
                            className="bg-green-600 text-white hover:bg-green-700 border-2 border-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-green font-black text-base px-4 py-2"
                            onClick={() => handleVote(prediction.id, 'yes')}
                          >
                            👍 Upvote
                          </Button>
                          <Button 
                            className="bg-red-600 text-white hover:bg-red-700 border-2 border-red-500 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-red font-black text-base px-4 py-2"
                            onClick={() => handleVote(prediction.id, 'no')}
                          >
                            👎 Downvote
                          </Button>
                        </>
                      )}
                      
                      {/* AI Analysis button */}
                      <Button 
                        className="bg-indigo-600 text-white hover:bg-indigo-700 border-2 border-indigo-500 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-blue font-black text-base px-4 py-2"
                        onClick={() => handleAIAnalysis(prediction)}
                        disabled={loadingAI}
                      >
                        <Brain className="mr-2 h-4 w-4" /> 
                        {loadingAI ? 'Analyzing...' : 'Ask AI'}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      </div>
      
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className={`backdrop-blur-md sm:max-w-4xl max-h-[80vh] overflow-y-auto transition-colors ${
          darkMode 
            ? 'bg-slate-900/95 border-slate-700 text-white' 
            : 'bg-white/95 border-gray-200 text-gray-900'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-2xl font-black flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Brain className="mr-2 text-blue-400" size={20} /> AI Analysis
            </DialogTitle>
            <DialogDescription className={`font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {currentPrediction && (
                <>Comprehensive analysis for: {currentPrediction.title}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {loadingAI ? (
              <div className="flex justify-center items-center p-6">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI is analyzing prediction...
                </span>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className={`p-4 border rounded-lg ${
                  darkMode 
                    ? 'bg-blue-900/20 border-blue-800/30' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <h3 className={`font-black mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    📋 Summary
                  </h3>
                  <p className={`text-sm font-black whitespace-pre-wrap ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {aiAnalysis.summary}
                  </p>
                </div>

                {/* Market Context */}
                <div className={`p-4 border rounded-lg ${
                  darkMode 
                    ? 'bg-green-900/20 border-green-800/30' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <h3 className={`font-black mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    📈 Market Context
                  </h3>
                  <p className={`text-sm font-black whitespace-pre-wrap ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {aiAnalysis.marketContext}
                  </p>
                </div>

                {/* Credibility Assessment */}
                <div className={`p-4 border rounded-lg ${
                  darkMode 
                    ? 'bg-yellow-900/20 border-yellow-800/30' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <h3 className={`font-black mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    🔍 Credibility Assessment
                  </h3>
                  <p className={`text-sm font-black whitespace-pre-wrap ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {aiAnalysis.credibilityAssessment}
                  </p>
                </div>

                {/* Related News */}
                <div className={`p-4 border rounded-lg ${
                  darkMode 
                    ? 'bg-purple-900/20 border-purple-800/30' 
                    : 'bg-purple-50 border-purple-200'
                }`}>
                  <h3 className={`font-black mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    📰 Related News
                  </h3>
                  <p className={`text-sm font-black whitespace-pre-wrap ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {aiAnalysis.relatedNews}
                  </p>
                </div>

                {/* Confidence Score */}
                <div className={`p-4 border rounded-lg ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-black ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      AI Confidence Score:
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-20 rounded-full h-2 ${
                        darkMode ? 'bg-slate-700' : 'bg-gray-300'
                      }`}>
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(aiAnalysis.confidence / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-blue-400 font-black">{aiAnalysis.confidence}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-4 border rounded-lg ${
                darkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-gray-300' 
                  : 'bg-gray-100 border-gray-200 text-gray-700'
              }`}>
                Click "Ask AI" to get a comprehensive analysis of this prediction.
              </div>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button className={`transition-all ${
                darkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* glow effects for css */}
      <style jsx global>{`
        .shadow-glow-blue {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
        .shadow-glow-green {
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
        }
        .shadow-glow-red {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
        }
      `}</style>
    </div>
  );
}