import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, TrendingUp, Award, PieChart, Languages, AlertCircle, User, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

// Animation variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function InfluencerProfileSetup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    expertiseAreas: [],
    experienceBackground: '',
    contentStyle: [],
    languages: []
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [walletAddress, setWalletAddress] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
    } else {
      // Redirect to wallet connect page if no wallet is connected
      router.push('/wallet-connect');
    }
  }, [router]);
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
    if (e.target.value) {
      setErrors(prev => ({ ...prev, name: null }));
    }
  };
  
  const handleExpertiseToggle = (area) => {
    setFormData(prev => {
      const updatedAreas = prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter(item => item !== area)
        : [...prev.expertiseAreas, area];
      
      // Clear error if at least one area is selected
      if (updatedAreas.length > 0) {
        setErrors(prev => ({ ...prev, expertiseAreas: null }));
      }
      
      return { ...prev, expertiseAreas: updatedAreas };
    });
  };
  
  const handleExperienceChange = (e) => {
    setFormData(prev => ({ ...prev, experienceBackground: e.target.value }));
    if (e.target.value) {
      setErrors(prev => ({ ...prev, experienceBackground: null }));
    }
  };
  
  const handleContentStyleToggle = (style) => {
    setFormData(prev => {
      const updatedStyles = prev.contentStyle.includes(style)
        ? prev.contentStyle.filter(item => item !== style)
        : [...prev.contentStyle, style];
      
      // Clear error if at least one style is selected
      if (updatedStyles.length > 0) {
        setErrors(prev => ({ ...prev, contentStyle: null }));
      }
      
      return { ...prev, contentStyle: updatedStyles };
    });
  };
  
  const handleLanguageToggle = (language) => {
    setFormData(prev => {
      const updatedLanguages = prev.languages.includes(language)
        ? prev.languages.filter(item => item !== language)
        : [...prev.languages, language];
      
      return { ...prev, languages: updatedLanguages };
    });
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (formData.expertiseAreas.length === 0) {
        newErrors.expertiseAreas = 'Please select at least one expertise area';
      }
      
      if (!formData.experienceBackground.trim()) {
        newErrors.experienceBackground = 'Experience background is required';
      }
    }
    
    if (step === 2) {
      if (formData.contentStyle.length === 0) {
        newErrors.contentStyle = 'Please select at least one content style';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinue = () => {
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        localStorage.setItem('userName', formData.name);
        console.log('Profile data:', formData);
        router.push('/influencer/dashboard');
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.push('/role-selection');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 transition-colors duration-300">
      <Navbar />
      <Head>
        <title>Set Up Your Finfluencer Profile | Inverstra</title>
        <meta name="description" content="Create your Finfluencer profile on Inverstra" />
      </Head>
      
      {/* Content starts below navbar with proper padding */}
      <div className="pt-20 px-4 pb-10 relative overflow-hidden">
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Light mode specific gradient elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(at_top_left,rgba(210,215,250,0.3)_0%,rgba(255,255,255,0)_50%)] dark:bg-[radial-gradient(at_top_left,rgba(120,50,180,0.12)_0%,rgba(0,0,0,0)_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(at_top_right,rgba(180,200,250,0.3)_0%,rgba(255,255,255,0)_60%)] dark:bg-[radial-gradient(at_top_right,rgba(80,60,200,0.12)_0%,rgba(0,0,0,0)_60%)]"></div>
          
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/15 to-blue-400/15 dark:bg-purple-500/10 blur-3xl"></div>
          <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-pink-300/10 to-orange-200/10 dark:from-pink-700/10 dark:to-orange-900/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tl from-blue-400/15 to-indigo-300/15 dark:from-blue-400/10 dark:to-indigo-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-300/10 to-violet-300/10 dark:from-indigo-500/5 dark:to-violet-500/5 blur-3xl"></div>
          
          {/* Decorative patterns */}
          <div className="absolute top-40 left-10 w-10 h-10 border-4 border-purple-200/30 dark:border-purple-700/20 rounded-full"></div>
          <div className="absolute bottom-40 right-10 w-20 h-20 border-4 border-blue-200/30 dark:border-blue-700/20 rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-gradient-to-br from-pink-400/20 to-red-300/20 dark:from-pink-600/20 dark:to-red-700/20 rounded-full"></div>
        </div>
        
        <motion.div 
          className="text-center mb-8 relative z-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-3 drop-shadow-sm">
            Create Your Finfluencer Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto text-lg">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-[length:100%_2px] bg-no-repeat bg-bottom pb-1 dark:from-purple-400 dark:to-blue-400">Showcase your expertise</span> and build your Web3 reputation
          </p>
        </motion.div>
        
        {/* Progress indicator */}
        <motion.div 
          className="flex items-center justify-center w-full max-w-md mb-8 mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="w-full bg-slate-200 dark:bg-slate-700/30 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="text-slate-600 dark:text-slate-300 text-sm ml-4">Step {currentStep} of {totalSteps}</span>
        </motion.div>
        
        <motion.div 
          className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="lg:col-span-2"
            variants={fadeIn}
          >
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.07)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:hover:shadow-[0_15px_35px_rgb(0,0,0,0.25)] bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-900/90 dark:to-slate-800/80">
              <CardContent className="p-8">
                {currentStep === 1 && (
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    {/* Name Input */}
                    <motion.div className="mb-8" variants={fadeIn}>
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100/80 to-indigo-100/80 dark:from-purple-900/30 dark:to-indigo-900/30 mr-3">
                          <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Your Name</h2>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 pl-12">How you want to be known in the community</p>
                      
                      <div>
                        <Input
                          id="influencer-name"
                          className={`bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus-visible:ring-purple-500 ${
                            errors.name ? 'border-red-500 dark:border-red-500' : ''
                          }`}
                          placeholder="Enter your name or pseudonym"
                          value={formData.name}
                          onChange={handleNameChange}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </motion.div>
                    
                    {/* Expertise Areas */}
                    <motion.div className="mb-8" variants={fadeIn}>
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100/80 to-indigo-100/80 dark:from-purple-900/30 dark:to-indigo-900/30 mr-3">
                          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Expertise Areas</h2>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 pl-12">Select all areas of financial expertise you cover</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { id: 'crypto', label: 'Crypto Markets', icon: '🌐' },
                          { id: 'indianStocks', label: 'Indian Stock Market', icon: '📊' },
                          { id: 'usStocks', label: 'US Stock Market', icon: '🇺🇸' },
                          { id: 'mutualFunds', label: 'Mutual Funds', icon: '💼' },
                          { id: 'technicalAnalysis', label: 'Technical Analysis', icon: '📈' },
                          { id: 'fundamentalAnalysis', label: 'Fundamental Research', icon: '🧠' },
                          { id: 'taxes', label: 'Tax Planning', icon: '📝' },
                          { id: 'realEstate', label: 'Real Estate', icon: '🏠' },
                          { id: 'commodities', label: 'Commodities', icon: '🪙' }
                        ].map(item => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleExpertiseToggle(item.id)}
                            className={`p-3 rounded-lg border cursor-pointer flex items-center transition-all shadow-sm hover:shadow-md ${
                              formData.expertiseAreas.includes(item.id) 
                                ? 'bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-900/30 dark:border-purple-500/50 dark:text-white'
                                : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-200 dark:hover:border-purple-500/30'
                            }`}
                          >
                            <span className="mr-2">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                          </motion.div>
                        ))}
                      </div>
                      {errors.expertiseAreas && (
                        <p className="text-red-500 text-xs mt-2 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.expertiseAreas}
                        </p>
                      )}
                    </motion.div>
                    
                    {/* Experience Background */}
                    <motion.div className="mb-8" variants={fadeIn}>
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100/80 to-indigo-100/80 dark:from-purple-900/30 dark:to-indigo-900/30 mr-3">
                          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Experience Background</h2>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 pl-12">Share your financial expertise and credentials</p>
                      
                      <Textarea
                        className={`bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none focus-visible:ring-purple-500 ${
                          errors.experienceBackground ? 'border-red-500 dark:border-red-500' : ''
                        }`}
                        placeholder="Tell us about your background in finance, trading experience, certifications, etc."
                        rows={4}
                        value={formData.experienceBackground}
                        onChange={handleExperienceChange}
                      />
                      {errors.experienceBackground ? (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.experienceBackground}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          *You'll be able to verify credentials (CA, CFA, MBA etc.) later
                        </p>
                      )}
                    </motion.div>
                  </motion.div>
                )}
                
                {currentStep === 2 && (
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    {/* Content Style */}
                    <motion.div className="mb-8" variants={fadeIn}>
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100/80 to-indigo-100/80 dark:from-purple-900/30 dark:to-indigo-900/30 mr-3">
                          <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Content Style</h2>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 pl-12">Select the formats you'll use for sharing insights</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'technicalCharts', label: 'Technical Charts', icon: '📉', desc: 'Chart analysis & patterns' },
                          { id: 'macroNews', label: 'Macro News Commentary', icon: '📰', desc: 'Big picture economic insights' },
                          { id: 'portfolioShowcase', label: 'Portfolio Showcase', icon: '💼', desc: 'Share your investment picks' },
                          { id: 'memes', label: 'Memes + Explain Like 5', icon: '🤓', desc: 'Simplified, fun content' },
                          { id: 'tutorials', label: 'Educational Tutorials', icon: '📚', desc: 'Step-by-step learning' },
                          { id: 'predictions', label: 'Market Predictions', icon: '🔮', desc: 'Future market trends' }
                        ].map(item => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleContentStyleToggle(item.id)}
                            className={`p-4 rounded-lg border cursor-pointer flex items-center transition-all shadow-sm hover:shadow-md ${
                              formData.contentStyle.includes(item.id) 
                                ? 'bg-blue-100 border-blue-300 text-blue-900 dark:bg-purple-900/30 dark:border-purple-500/50 dark:text-white'
                                : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-200 dark:hover:border-purple-500/30'
                            }`}
                          >
                            <span className="text-xl mr-3">{item.icon}</span>
                            <div>
                              <Label className="font-medium text-slate-800 dark:text-white">{item.label}</Label>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {errors.contentStyle && (
                        <p className="text-red-500 text-xs mt-2 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.contentStyle}
                        </p>
                      )}
                    </motion.div>
                    
                    {/* Languages Section */}
                    <motion.div className="mb-8" variants={fadeIn}>
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100/80 to-indigo-100/80 dark:from-purple-900/30 dark:to-indigo-900/30 mr-3">
                          <Languages className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Languages</h2>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 pl-12">Select languages you'll use for your content</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'].map(lang => (
                          <motion.div
                            key={lang}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLanguageToggle(lang)}
                            className={`px-3 py-2 rounded-full border cursor-pointer flex items-center transition-all ${
                              formData.languages.includes(lang) 
                                ? 'bg-indigo-100 border-indigo-300 text-indigo-900 dark:bg-indigo-900/30 dark:border-indigo-500/50 dark:text-white'
                                : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-500/30'
                            }`}
                          >
                            {lang}
                            {formData.languages.includes(lang) && (
                              <Check className="ml-1 w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
                
                <motion.div className="flex justify-between mt-8" variants={fadeIn}>
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-purple-500/30 dark:hover:text-white transition-all"
                  >
                    Back
                  </Button>
                  
                  <Button 
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_18px_rgba(79,70,229,0.35)] dark:shadow-[0_4px_12px_rgba(79,70,229,0.4)] dark:hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)] transition-all"
                  >
                    {currentStep === totalSteps ? 'Start Creating' : 'Continue'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Profile preview section */}
          <motion.div 
            className="hidden lg:block"
            variants={fadeIn}
          >
            <div className="sticky top-24">
              <Card className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-[0_8px_25px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_25px_rgb(0,0,0,0.2)] overflow-hidden bg-gradient-to-br from-white via-white to-slate-50/90 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-800/80">
                <div className="bg-gradient-to-r from-purple-200/80 via-indigo-100/80 to-blue-100/80 dark:from-purple-900/40 dark:via-indigo-900/30 dark:to-blue-900/40 p-4 border-b border-slate-200/80 dark:border-slate-800/80">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 flex items-center">
                    <span className="mr-2">✨</span> 
                    Profile Preview 
                    <div className="w-2 h-2 rounded-full animate-pulse bg-green-500 ml-2"></div>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">How others will see your expertise</p>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {/* Avatar with initials from user's name */}
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'FI'}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-slate-900 dark:text-white font-medium">{formData.name || 'Your Name'}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{formatAddress(walletAddress)}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                        <span className="text-xs text-green-600 dark:text-green-500">Verified Creator</span>
                      </div>
                    </div>
                  </div>
                  
                  {formData.expertiseAreas.length > 0 && (
                    <motion.div 
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h5 className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-2">Expertise</h5>
                      <div className="flex flex-wrap gap-2">
                        {formData.expertiseAreas.map(area => (
                          <span 
                            key={area} 
                            className="text-xs px-2 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-500/40 dark:text-purple-300"
                          >
                            {area === 'crypto' && '🌐 Crypto'}
                            {area === 'indianStocks' && '📊 Indian Stocks'}
                            {area === 'usStocks' && '🇺🇸 US Stocks'}
                            {area === 'technicalAnalysis' && '📈 Technical'}
                            {area === 'fundamentalAnalysis' && '🧠 Fundamental'}
                            {area === 'taxes' && '📝 Tax Planning'}
                            {area === 'realEstate' && '🏠 Real Estate'}
                            {area === 'mutualFunds' && '💼 Mutual Funds'}
                            {area === 'commodities' && '🪙 Commodities'}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {formData.contentStyle.length > 0 && (
                    <motion.div 
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h5 className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-2">Content Style</h5>
                      <div className="flex flex-wrap gap-2">
                        {formData.contentStyle.map(style => (
                          <span 
                            key={style} 
                            className="text-xs px-2 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 dark:bg-indigo-900/30 dark:border-indigo-500/40 dark:text-indigo-300"
                          >
                            {style === 'technicalCharts' && '📉 Charts'}
                            {style === 'macroNews' && '📰 Macro News'}
                            {style === 'portfolioShowcase' && '💼 Portfolio'}
                            {style === 'memes' && '🤓 Memes & Simple'}
                            {style === 'tutorials' && '📚 Tutorials'}
                            {style === 'predictions' && '🔮 Predictions'}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {formData.languages.length > 0 && (
                    <motion.div 
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h5 className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-2">Languages</h5>
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.map(lang => (
                          <span 
                            key={lang} 
                            className="text-xs px-2 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-500/40 dark:text-indigo-300"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {formData.experienceBackground && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h5 className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-2">Background</h5>
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-4">
                        {formData.experienceBackground}
                      </p>
                    </motion.div>
                  )}
                  
                  {/* Stats preview */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">0</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Predictions</p>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">0</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Followers</p>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">0%</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
        
        <footer className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm relative z-10">
          <p>Connected wallet: {formatAddress(walletAddress)}</p>
        </footer>
      </div>
    </div>
  );
}