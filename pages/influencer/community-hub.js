// pages/creator/community-hub.js
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import communityPredictions from './communityPredictions.json';

export default function CommunityHub() {
  const [predictions, setPredictions] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  
  useEffect(() => {
    // Load data from the JSON file
    setPredictions(communityPredictions);
  }, []);

  const handleVote = (predictionId, voteType) => {
    setUserVotes(prev => ({
      ...prev,
      [predictionId]: voteType
    }));

    // Update vote count in the prediction data
    setPredictions(prev => 
      prev.map(prediction => {
        if (prediction.id === predictionId) {
          const updatedVotes = { ...prediction.votes };
          voteType === 'yes' ? updatedVotes.yes++ : updatedVotes.no++;
          return {
            ...prediction,
            votes: updatedVotes
          };
        }
        return prediction;
      })
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="font-bold text-white">I</span>
            </div>
            <span className="text-xl font-bold text-white">Investra</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/community-hub" className="text-white font-medium border-b-2 border-blue-500 pb-1">
              Community Hub
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
              My Profile
            </Link>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-glow-blue">
            Connect Wallet
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar: Contributor Stats */}
          <div className="w-full lg:w-1/4">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700 shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Contributor Profile</h2>
                <Badge className="bg-blue-900/60 text-blue-300 border border-blue-500/50 px-3">
                  Level 3
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-300">Total votes this month</span>
                  <span className="font-bold text-white">{userStats.votesCast}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-300">Streak</span>
                  <span className="font-bold text-white">🔥 {userStats.streak} days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-300">Aligned with DAO</span>
                  <div className="flex items-center">
                    <span className="font-bold text-white mr-2">{userStats.alignedWithDAO}%</span>
                    <div className="w-16 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${userStats.alignedWithDAO}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-300">Community Rank</span>
                  <Badge className="bg-violet-900/60 text-violet-300 border border-violet-500/50">
                    {userStats.rank}
                  </Badge>
                </div>
                
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-900/30 rounded-lg">
                  <h3 className="text-blue-400 font-medium mb-2">Top Supported Prediction</h3>
                  <p className="text-white">NIFTY breakout to 78K</p>
                  <div className="mt-2 text-sm text-blue-300">Published on-chain • 94% consensus</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Center: Predictions & Voting */}
          <div className="w-full lg:w-2/4 space-y-6">
            <h1 className="text-2xl font-bold text-white mb-4">Pending Predictions</h1>
            
            {predictions.map((prediction) => {
              const consensusPercentage = getConsensusPercentage(prediction.votes);
              const hasVoted = userVotes[prediction.id] !== undefined;
              
              return (
                <Card 
                  key={prediction.id}
                  className="bg-slate-900/70 backdrop-blur-md border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-slate-700 group"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {prediction.asset}
                          </h2>
                          <span className="text-blue-400 font-semibold">→ {prediction.targetPrice}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Proposed by <span className="text-blue-300">@{prediction.creatorName}</span> | {prediction.community}
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
                    
                    <p className="line-clamp-4 text-gray-300">
                      {prediction.reasoning}
                    </p>
                    
                    {hasVoted && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-1">Community Consensus</p>
                        <div className="flex items-center">
                          <div className="w-full bg-slate-800 rounded-full h-2 mr-3">
                            <div 
                              className={`${consensusPercentage > 50 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`}
                              style={{ width: `${consensusPercentage}%` }} 
                            />
                          </div>
                          <span className="text-sm text-white font-medium">{consensusPercentage}% in favor</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex flex-wrap justify-between gap-3 pt-4 border-t border-slate-800">
                    <div className="flex gap-2">
                      {hasVoted ? (
                        <div className={`px-4 py-2 rounded-md flex items-center ${
                          userVotes[prediction.id] === 'yes' 
                          ? 'bg-green-800/50 text-green-200 border border-green-700' 
                          : 'bg-red-800/50 text-red-200 border border-red-700'
                        }`}>
                          You voted: {userVotes[prediction.id] === 'yes' ? '👍' : '👎'}
                        </div>
                      ) : (
                        <>
                          <Button 
                            className="bg-green-800/80 text-green-200 hover:bg-green-700 border border-green-700/30 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-green"
                            onClick={() => handleVote(prediction.id, 'yes')}
                          >
                            👍 Upvote
                          </Button>
                          <Button 
                            className="bg-red-800/80 text-red-200 hover:bg-red-700 border border-red-700/30 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-red"
                            onClick={() => handleVote(prediction.id, 'no')}
                          >
                            👎 Downvote
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="text-blue-300 border-blue-600/50 hover:bg-blue-900/50 transition-all"
                      >
                        💬 Discussion
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-slate-300 border-slate-600/50 hover:bg-slate-800 transition-all"
                      >
                        🔗 Share
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
            
            {/* Voting History Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-white mb-4">Your Governance Footprint</h2>
              
              <Card className="bg-slate-900/70 backdrop-blur-md border-slate-800 p-4 mb-6">
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Votes Cast</span>
                    <span className="text-white text-2xl font-bold">{userStats.votesCast}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Aligned with DAO</span>
                    <span className="text-white text-2xl font-bold">{userStats.alignedWithDAO}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Supported & Published</span>
                    <span className="text-white text-2xl font-bold">{userStats.supportedPublished}</span>
                  </div>
                </div>
              </Card>
              
              <div className="space-y-3">
                {votingHistory.map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-900/40 border border-slate-800 rounded-lg hover:bg-slate-900/70 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`${
                        item.result.includes('✅') ? 'bg-green-900/50 text-green-300' : 
                        item.result.includes('❌') ? 'bg-red-900/50 text-red-300' : 
                        'bg-blue-900/50 text-blue-300'
                      } border border-opacity-30`}>
                        {item.result}
                      </Badge>
                      <span className="font-medium text-white">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${
                        item.youVoted === 'Up' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                      } border border-opacity-30`}>
                        You: {item.youVoted}
                      </Badge>
                      <span className="text-sm text-gray-400">{item.consensus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar: Activity Feed */}
          <div className="w-full lg:w-1/4">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700 shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Community Activity Feed</h2>
              
              <div className="space-y-4">
                {activityFeed.map((activity, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border-l-2 ${
                      activity.type === 'vote' ? 'border-blue-500 bg-blue-900/20' :
                      activity.type === 'submit' ? 'border-green-500 bg-green-900/20' :
                      activity.type === 'comment' ? 'border-amber-500 bg-amber-900/20' :
                      'border-violet-500 bg-violet-900/20'
                    } rounded-r-lg`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      <div>
                        <p className="text-sm text-gray-300">
                          <span className="text-blue-300 font-medium">@{activity.user}</span> {activity.action}{' '}
                          <span className="text-white">{activity.subject}</span>
                        </p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-6 bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors">
                View All Activity
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add global styles for glow effects */}
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