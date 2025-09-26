import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast, Toaster } from 'react-hot-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

// Icons
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Lock,
  TrendingUp
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';

export default function VerifyPrediction() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    predictionText: '',
    sourceUrl: '',
    asset: '',
    category: '',
    targetPrice: '',
    deadline: '',
    reasoning: '',
    isPublic: true
  });

  // UI state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Check wallet connection and theme mounting
  useEffect(() => {
    setMounted(true);
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
    } else {
      router.push('/wallet-connect');
    }
  }, [router]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVerify = async () => {
    if (!formData.predictionText.trim()) {
      toast.error('Please enter the prediction text');
      return;
    }

    if (!formData.asset.trim()) {
      toast.error('Please specify the asset');
      return;
    }

    setIsVerifying(true);
    
    try {
      // Simulate AI verification process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock verification result
      const mockResult = {
        id: Date.now().toString(),
        predictionText: formData.predictionText,
        asset: formData.asset,
        category: formData.category,
        targetPrice: formData.targetPrice,
        deadline: formData.deadline,
        reasoning: formData.reasoning,
        sourceUrl: formData.sourceUrl,
        isPublic: formData.isPublic,
        verificationScore: Math.floor(Math.random() * 21) + 20, // 20-40%
        aiAnalysis: {
          credibility: Math.floor(Math.random() * 21) + 20,
          marketRelevance: Math.floor(Math.random() * 21) + 20,
          reasoningQuality: Math.floor(Math.random() * 21) + 20,
          riskAssessment: Math.floor(Math.random() * 21) + 20
        },
        recommendations: [
          "Yet to be verified from the DAO community",
          "Prediction shows some market fundamentals",
          "Consider current market volatility",
          "Source appears credible and recent",
          "Risk level is moderate to high"
        ],
        createdAt: new Date(),
        verifiedBy: walletAddress
      };

      setVerificationResult(mockResult);
      setShowResults(true);
      toast.success('Prediction verified successfully!');
      
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify prediction. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMakeLive = async () => {
    if (!verificationResult) return;
    
    try {
      // Store verification result
      const verifications = JSON.parse(localStorage.getItem('verifiedPredictions') || '[]');
      verifications.push(verificationResult);
      localStorage.setItem('verifiedPredictions', JSON.stringify(verifications));
      
      toast.success('Prediction made live for community!');
      router.push('/verified-predictions');
    } catch (error) {
      console.error('Error making prediction live:', error);
      toast.error('Failed to make prediction live');
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <Navbar />
      <Toaster position="top-right" />
      
      <Head>
        <title>Verify Prediction | Inverstra</title>
        <meta name="description" content="Verify the credibility of predictions found online" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <div className="relative flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Verify a Prediction
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6">
              Found a prediction online? Paste it here and let our advanced AI analyze its credibility, market relevance, and reasoning quality along with community validation.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                AI-Powered Analysis
              </Badge>
              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                Community Validation
              </Badge>
              <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Real-time Insights
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification Form */}
          <Card className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Prediction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="predictionText" className="text-gray-700 dark:text-gray-300">
                  Prediction Text *
                </Label>
                <Textarea
                  id="predictionText"
                  placeholder="Paste the prediction you found online..."
                  value={formData.predictionText}
                  onChange={(e) => handleChange('predictionText', e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="sourceUrl" className="text-gray-700 dark:text-gray-300">
                  Source URL (Optional)
                </Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  placeholder="https://example.com/prediction"
                  value={formData.sourceUrl}
                  onChange={(e) => handleChange('sourceUrl', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="asset" className="text-gray-700 dark:text-gray-300">
                    Asset *
                  </Label>
                  <Input
                    id="asset"
                    placeholder="e.g., Bitcoin, Tesla, Gold"
                    value={formData.asset}
                    onChange={(e) => handleChange('asset', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                    Category
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="equities">Equities</SelectItem>
                      <SelectItem value="commodities">Commodities</SelectItem>
                      <SelectItem value="indices">Indices</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetPrice" className="text-gray-700 dark:text-gray-300">
                    Target Price
                  </Label>
                  <Input
                    id="targetPrice"
                    placeholder="e.g., $100,000"
                    value={formData.targetPrice}
                    onChange={(e) => handleChange('targetPrice', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="deadline" className="text-gray-700 dark:text-gray-300">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reasoning" className="text-gray-700 dark:text-gray-300">
                  Additional Reasoning (Optional)
                </Label>
                <Textarea
                  id="reasoning"
                  placeholder="Add any additional context or reasoning..."
                  value={formData.reasoning}
                  onChange={(e) => handleChange('reasoning', e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleChange('isPublic', checked)}
                />
                <Label htmlFor="isPublic" className="text-gray-700 dark:text-gray-300">
                  Make this verification public for the community
                </Label>
              </div>

              <Button
                onClick={handleVerify}
                disabled={isVerifying || !formData.predictionText.trim() || !formData.asset.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Prediction
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Live Preview Card */}
            <Card className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-500" />
                  Live Preview
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  This is how your verification will appear
                </p>
              </CardHeader>
              <CardContent>
                <div className={`${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border-2 border-dashed`}>
                  {formData.predictionText || formData.asset ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <Shield className="h-3 w-3 mr-1" />
                          Verification Preview
                        </Badge>
                        <div className="text-xs text-gray-500 dark:text-slate-500">
                          {formData.isPublic ? 'Public' : 'Private'}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {formData.asset || 'Asset'}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">
                          {formData.predictionText || 'Your prediction will appear here...'}
                        </p>
                      </div>
                      
                      {(formData.targetPrice || formData.deadline) && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {formData.targetPrice && (
                            <Badge variant="outline" className="text-xs">
                              Target: {formData.targetPrice}
                            </Badge>
                          )}
                          {formData.deadline && (
                            <Badge variant="outline" className="text-xs">
                              By: {formData.deadline}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {formData.sourceUrl && (
                        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Source available
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-slate-500 text-sm">
                        Start filling the form to see a preview
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Verification Results */}
            {isVerifying && (
              <Card className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm shadow-xl`}>
                <CardContent className="p-8 text-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-green-600/30 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-green-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 mb-4">
                    Our advanced AI is analyzing the credibility, market relevance, and reasoning quality of this prediction.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {verificationResult && showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Verification Score */}
                <Card className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Verification Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 mx-auto shadow-lg">
                          <div className="text-3xl font-bold text-white">
                            {verificationResult.verificationScore}%
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Overall Credibility Score
                      </h3>
                      <p className="text-gray-600 dark:text-slate-300">
                        AI-verified prediction analysis
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800/30 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {verificationResult.aiAnalysis.credibility}%
                        </div>
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Credibility</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800/30 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {verificationResult.aiAnalysis.marketRelevance}%
                        </div>
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Market Relevance</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800/30 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                          {verificationResult.aiAnalysis.reasoningQuality}%
                        </div>
                        <div className="text-sm font-medium text-orange-700 dark:text-orange-300">Reasoning Quality</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800/30 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <AlertCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                          {verificationResult.aiAnalysis.riskAssessment}%
                        </div>
                        <div className="text-sm font-medium text-red-700 dark:text-red-300">Risk Assessment</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {verificationResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-slate-300 text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  {verificationResult.isPublic && (
                    <Button
                      onClick={handleMakeLive}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Make Live for Community
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowResults(false)}
                    className="w-full"
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Keep Private
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
