import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast, Toaster } from 'react-hot-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Icons
import { 
  ArrowLeft, 
  Search, 
  Shield, 
  CheckCircle, 
  ExternalLink,
  Calendar,
  TrendingUp,
  Eye,
  Filter
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';

export default function VerifiedPredictions() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [verifiedPredictions, setVerifiedPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setMounted(true);
    loadVerifiedPredictions();
  }, []);

  useEffect(() => {
    filterPredictions();
  }, [verifiedPredictions, searchTerm, selectedCategory]);

  const loadVerifiedPredictions = () => {
    try {
      const stored = localStorage.getItem('verifiedPredictions');
      if (stored) {
        const predictions = JSON.parse(stored);
        setVerifiedPredictions(predictions);
      }
    } catch (error) {
      console.error('Error loading verified predictions:', error);
    }
  };

  const filterPredictions = () => {
    let filtered = verifiedPredictions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pred => 
        pred.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pred.predictionText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pred => pred.category === selectedCategory);
    }

    setFilteredPredictions(filtered);
  };

  const formatAddress = (address) => {
    if (!address) return "Anonymous";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <Navbar />
      <Toaster position="top-right" />
      
      <Head>
        <title>Verified Predictions | Inverstra</title>
        <meta name="description" content="Browse AI-verified predictions from the community" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verified Predictions
            </h1>
            <p className="text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Browse predictions that have been verified by our AI and community validation system.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-2 rounded-md border ${
              theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Categories</option>
            <option value="crypto">Crypto</option>
            <option value="equities">Equities</option>
            <option value="commodities">Commodities</option>
            <option value="indices">Indices</option>
            <option value="forex">Forex</option>
          </select>
        </div>

        {/* Predictions Grid */}
        {filteredPredictions.length === 0 ? (
          <Card className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm`}>
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Verified Predictions Yet
              </h3>
              <p className="text-gray-600 dark:text-slate-300 mb-6">
                Be the first to verify a prediction and share it with the community!
              </p>
              <Button
                onClick={() => router.push('/verify-prediction')}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
              >
                <Shield className="h-4 w-4 mr-2" />
                Verify a Prediction
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPredictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      <div className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(prediction.verificationScore)} ${getScoreColor(prediction.verificationScore)}`}>
                        {prediction.verificationScore}%
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {prediction.asset}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-gray-700 dark:text-slate-300 text-sm mb-2">
                        {prediction.predictionText}
                      </p>
                      
                      {prediction.targetPrice && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Target: {prediction.targetPrice}
                        </div>
                      )}
                      
                      {prediction.deadline && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          By: {new Date(prediction.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-gray-50 dark:bg-slate-800 rounded">
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {prediction.aiAnalysis.credibility}%
                        </div>
                        <div className="text-gray-600 dark:text-slate-400">Credibility</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-slate-800 rounded">
                        <div className="font-semibold text-purple-600 dark:text-purple-400">
                          {prediction.aiAnalysis.marketRelevance}%
                        </div>
                        <div className="text-gray-600 dark:text-slate-400">Relevance</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-slate-700">
                      <div className="text-xs text-gray-500 dark:text-slate-500">
                        Verified by {formatAddress(prediction.verifiedBy)}
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                        Yet to be verified from DAO
                      </div>
                    </div>
                    
                    {prediction.sourceUrl && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(prediction.sourceUrl, '_blank')}
                          className="text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Source
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
