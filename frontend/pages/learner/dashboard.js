import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Sun, Moon, Wallet, Bell, Search, Check, Clock, X, ChevronDown, Share2, Calendar, Home, Compass, BookOpen, User } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Head from 'next/head';
import axios from 'axios';

import communityPredictions from './communityPredictions.json';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [walletAddress, setWalletAddress] = useState("");
  
  const [userName, setUserName] = useState("User");

useEffect(() => {
  // Try to fetch user profile from the backend first
  const fetchUserProfile = async () => {
    try {
      const walletAddress = localStorage.getItem('connectedWalletAddress');
      if (walletAddress) {
        setWalletAddress(walletAddress);
        
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await axios.get(`${backendUrl}/api/learners/wallet/${walletAddress}`);
        
        if (response.data.success) {
          const profileData = response.data.data;
          setUserName(profileData.name);
          
          // Save to localStorage as backup
          localStorage.setItem('inverstraUserProfile', JSON.stringify(profileData));
        }
      }
    } catch (error) {
      console.error("Error fetching profile from API:", error);
      
      // Fallback to localStorage
      try {
        const savedData = localStorage.getItem('inverstraUserProfile');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.name) {
            setUserName(parsedData.name);
          }
        }
      } catch (e) {
        console.error("Error retrieving user name from storage", e);
      }
    }
  };
  
  fetchUserProfile();
}, []);

  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
    } else {
     
      const dummyAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      localStorage.setItem('connectedWalletAddress', dummyAddress);
      setWalletAddress(dummyAddress);
    }
  }, []);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // to filter predictions that have 70% more yes than no votes
  const filteredPredictions = communityPredictions.filter(pred => {
    const totalVotes = pred.votes.yes + pred.votes.no;
    const yesPercentage = (pred.votes.yes / totalVotes) * 100;
    const noPercentage = (pred.votes.no / totalVotes) * 100;
    return yesPercentage > noPercentage;
  });

  const ConfidenceDisplay = ({ level }) => {
    return (
      <div className="flex items-center">
        <div className="flex">
          {Array(level).fill(0).map((_, i) => (
            <span key={i} className="text-yellow-400">★</span>
          ))}
          {Array(5 - level).fill(0).map((_, i) => (
            <span key={i} className="text-gray-600">★</span>
          ))}
        </div>
        <span className="ml-2 text-yellow-400">Confidence</span>
      </div>
    );
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      "Equities": "from-blue-900 to-cyan-900",
      "Crypto": "from-purple-900 to-indigo-900",
      "Commodities": "from-pink-800 to-orange-900",
      "Forex": "from-green-900 to-emerald-900",
      "default": "from-gray-900 to-gray-800"
    };
    
    return gradients[category] || gradients.default;
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      "Equities": "text-cyan-400",
      "Crypto": "text-purple-400",
      "Commodities": "text-amber-400",
      "Forex": "text-emerald-400",
      "default": "text-gray-400"
    };
    
    return colors[category] || colors.default;
  };

  const getHoverGlowColor = (category) => {
    const glows = {
      "Equities": "group-hover:shadow-cyan-500/50",
      "Crypto": "group-hover:shadow-purple-500/50",
      "Commodities": "group-hover:shadow-amber-500/50",
      "Forex": "group-hover:shadow-emerald-500/50",
      "default": "group-hover:shadow-white/20"
    };
    
    return glows[category] || glows.default;
  };

  const PredictionCard = ({ prediction }) => {
    const categoryColor = getCategoryTextColor(prediction.category);
    const categoryGradient = getCategoryGradient(prediction.category);
    const hoverGlow = getHoverGlowColor(prediction.category);
    
    const isConfirmed = prediction.confirmed || prediction.status === "confirmed";
    
    const statusDisplay = isConfirmed ? (
      <div className="flex items-center text-green-400 text-sm">
        <Check size={14} className="mr-1" />
        <span>Verified</span>
      </div>
    ) : (
      <div className="px-3 py-1 bg-amber-900/30 text-amber-500 text-xs font-medium rounded-md">
        Pending Verification
      </div>
    );

    const displayText = prediction.predictionText || 
      (prediction.predictionType === "priceTarget" ? 
      `will reach ${prediction.targetPrice}` : 
      "will perform as predicted");

    const assetName = prediction.asset;
    
    const reasoningText = prediction.reasoning;

    const difficultyLevel = prediction.difficulty || "Medium";

    const timeFrame = prediction.timeFrame || (() => {
      const deadline = new Date(prediction.deadline);
      const today = new Date();
      const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) return "Short-term";
      if (diffDays <= 30) return "Mid-term";
      return "Long-term";
    })();

    return (
      <div className={`bg-gradient-to-br ${categoryGradient} rounded-xl border border-gray-800 mb-6 overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] ${hoverGlow}`}>
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
           
            <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">
              {prediction.creatorName ? prediction.creatorName.charAt(0) : "?"}
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-bold text-white mr-1">{prediction.creatorName}</h3>
                {(prediction.verified || isConfirmed) && (
                  <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-500 px-2 py-0.5 rounded text-white ml-1">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {prediction.creatorTitle || prediction.community || "Community Member"}
              </p>
            </div>
          </div>
          <div className={categoryColor}>
            {prediction.category}
          </div>
        </div>
        
        {/* Prediction */}
        <div className="px-4 pt-2 pb-4">
          <h2 className="text-xl font-bold">
            <span className="text-white">{assetName}</span>{" "}
            <span className={categoryColor}>{displayText}</span>
          </h2>
          
          <div className="flex items-center mt-2 mb-3">
            <Calendar size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-400">By {new Date(prediction.deadline).toLocaleDateString()}</span>
          </div>
          
          <div className="mt-2 mb-4">
            <ConfidenceDisplay level={prediction.confidence} />
          </div>
          
          <p className="text-gray-300 bg-black/30 backdrop-blur-sm p-3 rounded-lg text-sm mt-2 mb-3 group-hover:bg-black/40 transition-all">
            {reasoningText}
          </p>
        </div>
        
        {/* Footer with actions */}
        <div className="border-t border-gray-800/50 px-4 py-3 flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors">
              <Share2 size={18} />
              <span className="ml-1 text-sm">Share</span>
            </div>
            <div className="text-sm text-gray-500">{timeFrame}</div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <span className="text-sm text-purple-400">Difficulty:</span>
            <span className="text-sm text-gray-300">{difficultyLevel}</span>
          </div> */}
        </div>
        
        {!isConfirmed && (
          <div className="bg-amber-900/30 text-amber-500 text-center py-1 text-sm">
            Pending Verification
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1A132F] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Head>
        <title>Learner Dashboard | Inverstra</title>
        <meta name="description" content="View investment predictions and manage your learning journey" />
      </Head>
      
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mt-20">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Welcome Block */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-1">👋 Welcome back, {userName}!</h1>
              <p className="text-gray-400">Here's what's trending in your network today.</p>
            </div>
            
            {/* Recent Predictions (Instagram-style) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Predictions</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveFilter("All")}
                    className={`text-xs px-3 py-1 rounded-full ${activeFilter === "All" 
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" 
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setActiveFilter("Equities")}
                    className={`text-xs px-3 py-1 rounded-full ${activeFilter === "Equities" 
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" 
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                  >
                    Stocks
                  </button>
                  <button 
                    onClick={() => setActiveFilter("Crypto")}
                    className={`text-xs px-3 py-1 rounded-full ${activeFilter === "Crypto" 
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" 
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                  >
                    Crypto
                  </button>
                  <button 
                    onClick={() => setActiveFilter("Commodities")}
                    className={`text-xs px-3 py-1 rounded-full ${activeFilter === "Commodities" 
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" 
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                  >
                    Commodities
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {filteredPredictions
                  .filter(pred => activeFilter === "All" || pred.category === activeFilter)
                  .map(prediction => (
                    <PredictionCard key={prediction.id} prediction={prediction} />
                  ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {/* AI Recommendations */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-6">
                <h2 className="text-lg font-bold mb-4">AI Recommendations</h2>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
                    <div className="flex items-start">
                      <span className="text-2xl mr-2">💡</span>
                      <div>
                        <p className="text-sm">You seem interested in Crypto. Join the <span className="text-purple-400">Altcoin Alpha</span> community.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
                    <div className="flex items-start">
                      <span className="text-2xl mr-2">📉</span>
                      <div>
                        <p className="text-sm">Try predicting price movements with higher risk-reward.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
                    <div className="flex items-start">
                      <span className="text-2xl mr-2">🔔</span>
                      <div>
                        <p className="text-sm">Set up alerts for BTC price movements to catch trends early.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Financial News */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Market Updates</h2>
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all cursor-pointer">
                    <h3 className="font-medium text-sm text-white mb-1">RBI holds rates steady as inflation concerns persist</h3>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all cursor-pointer">
                    <h3 className="font-medium text-sm text-white mb-1">Bitcoin hits new monthly high amid institutional inflows</h3>
                    <p className="text-xs text-gray-400">5 hours ago</p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all cursor-pointer">
                    <h3 className="font-medium text-sm text-white mb-1">Gold prices continue rally as geopolitical tensions rise</h3>
                    <p className="text-xs text-gray-400">8 hours ago</p>
                  </div>
                </div>
                <button className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-sm transition-all flex justify-center items-center">
                  View all updates
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-10">
        <div className="flex justify-around items-center h-16">
          <a href="#" className="flex flex-col items-center text-[#FF5F6D]">
            <Home size={20} />
            <span className="text-xs mt-1">Feed</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-400">
            <Compass size={20} />
            <span className="text-xs mt-1">Discover</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-400">
            <BookOpen size={20} />
            <span className="text-xs mt-1">Learn</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-400">
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
}