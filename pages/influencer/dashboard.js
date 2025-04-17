'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  Target, 
  Globe, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle,
  Zap,
  Award
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// mock data
const trustData = {
  accuracy: 82,
  specializations: ['Crypto', 'Mid-Cap Stocks'],
  verifiedPredictions: 44,
  avgDifficulty: 3.6
};

const statsData = [
  { id: 1, title: 'Active Predictions', value: 6, icon: TrendingUp, color: 'text-blue-400' },
  { id: 2, title: 'Followers', value: '1.2k', icon: Users, color: 'text-green-400' },
  { id: 3, title: 'Accuracy Rate', value: '82%', icon: Target, color: 'text-purple-400' },
  { id: 4, title: 'Community Memberships', value: 3, icon: Globe, color: 'text-orange-400' }
];

const activePredictions = [
  { 
    id: 1, 
    asset: 'BTC/USDT', 
    type: 'Price ↑ 10% in 7 days', 
    status: 'Active', 
    confidence: 4, 
    daysLeft: 5,
    endDate: '2025-04-22'
  },
  { 
    id: 2, 
    asset: 'ETH/USDT', 
    type: 'Price ↓ 5% in 3 days', 
    status: 'Pending Verification', 
    confidence: 3, 
    daysLeft: 1,
    endDate: '2025-04-18' 
  },
  { 
    id: 3, 
    asset: 'AAPL', 
    type: 'Earnings beat by 5%', 
    status: 'Active', 
    confidence: 5, 
    daysLeft: 10,
    endDate: '2025-04-27' 
  },
  { 
    id: 4, 
    asset: 'SOL/USDT', 
    type: 'Price ↑ 15% in 14 days', 
    status: 'Active', 
    confidence: 4, 
    daysLeft: 12,
    endDate: '2025-04-29' 
  },
  { 
    id: 5, 
    asset: 'AMZN', 
    type: 'Earnings miss by 2%', 
    status: 'Active', 
    confidence: 3, 
    daysLeft: 8,
    endDate: '2025-04-25' 
  },
  { 
    id: 6, 
    asset: 'XRP/USDT', 
    type: 'Price ↑ 8% in 5 days', 
    status: 'Active', 
    confidence: 4, 
    daysLeft: 3,
    endDate: '2025-04-20' 
  }
];

const communities = [
  { 
    id: 1, 
    name: 'CryptoVisors DAO', 
    role: 'Contributor', 
    votes: 27, 
    communityAccuracy: 76,
    badgeColor: 'bg-blue-500/20 text-blue-400'
  },
  { 
    id: 2, 
    name: 'Market Oracles', 
    role: 'Member', 
    votes: 15, 
    communityAccuracy: 81,
    badgeColor: 'bg-purple-500/20 text-purple-400'
  },
  { 
    id: 3, 
    name: 'Foresight Collective', 
    role: 'Contributor', 
    votes: 42, 
    communityAccuracy: 79,
    badgeColor: 'bg-emerald-500/20 text-emerald-400'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function InfluencerDashboard() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get wallet address from localStorage
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Render confidence stars (filled or outline)
  const renderConfidence = (level) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`${i < level ? 'text-yellow-400' : 'text-gray-600'}`}>●</span>
    ));
  };
  
  // Calculate days remaining
  const daysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#141414] flex items-center justify-center">
        <div className="text-2xl text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#141414] text-[#f5f5f5] pb-20">
      <Head>
        <title>Influencer Dashboard | Inverstra</title>
        <meta name="description" content="Manage your predictions and community engagement" />
      </Head>
      
      {/* Header with wallet info */}
      <header className="p-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Inverstra
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-slate-400">
            <span>Connected as: </span>
            <span className="font-mono text-white">{formatAddress(walletAddress)}</span>
          </div>

          <Link href ="/">
          <Button variant="outline" size="sm" className="border-white/40 hover:border-white/20">
            Home
          </Button>
          </Link>

          <Link href="/influencer/create-position">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
              <Plus className="mr-2 h-4 w-4" /> Create New Prediction
            </Button>
          </Link>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span>Your last prediction has been verified! +25 trust points earned.</span>
          </div>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          {/* Trust Fingerprint */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#3A1C71] via-[#D76D77] to-[#FFAF7B] text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Your Financial Fingerprint is growing!</h3>
                    <p className="text-sm opacity-90">+12% accuracy this month</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                </div>
          </div>
          
          {/* Stats Overview */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4">Stats Snapshot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsData.map((stat) => (
                <Card key={stat.id} className="rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-md hover:shadow-blue-500/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{stat.title}</p>
                        <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-opacity-20 ${stat.color.replace('text', 'bg').replace('400', '500/20')}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
          
          {/* Active Predictions */}
          <motion.section variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Active Predictions</h2>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                {activePredictions.map((prediction) => (
                  <Card 
                    key={prediction.id} 
                    className="rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-md hover:shadow-cyan-500/20 transition-all w-72 flex-shrink-0"
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-lg font-bold text-white">{prediction.asset}</div>
                        <Badge 
                          variant="outline" 
                          className={prediction.status === 'Active' 
                            ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                            : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                        >
                          {prediction.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-slate-300 mb-4">{prediction.type}</div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-slate-400">Confidence</div>
                        <div className="text-sm">{renderConfidence(prediction.confidence)}</div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Clock className="w-4 h-4" />
                          <span>{daysRemaining(prediction.endDate)} days left</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs p-0 h-auto text-slate-400">Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.section>
          
          {/* Community Memberships */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4">Your DAO Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communities.map((community) => (
                <Card 
                  key={community.id} 
                  className="rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-md hover:shadow-blue-500/20 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">{community.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={community.badgeColor}
                        >
                          {community.role}
                        </Badge>
                      </div>
                      <Award className="w-5 h-5 text-yellow-400" />
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Community Accuracy</span>
                          <span className="font-semibold text-white">{community.communityAccuracy}%</span>
                        </div>
                        <Progress value={community.communityAccuracy} className="h-1.5 bg-slate-700" indicatorClassName="bg-cyan-500" />
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-slate-400">Your contributions:</span>
                        <span className="ml-2 font-semibold text-white">{community.votes} votes</span>
                      </div>
                    </div>
                    
                    <Link href= "/influencer/community-hub">
                      <Button variant="ghost" size="sm" className="w-full border border-white/10 hover:bg-white/5 text-white">
                        View Community
                      </Button>
                    </Link>

                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
          
          {/* Quick Actions */}
          <motion.section variants={itemVariants}>
            <Card className="rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#242424] border border-white/10 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold mb-2 text-white">Ready to make your next prediction?</h3>
                    <p className="text-slate-400">Create a new prediction or join a community to start contributing.</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/influencer/create-position">
                    <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                      <Plus className="mr-2 h-4 w-4" /> Create New Prediction
                    </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}