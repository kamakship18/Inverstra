import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, LightbulbIcon, TrendingUp, Award, PieChart, Languages, AlertCircle, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

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
      window.location.href = '/connect-wallet';
    }
  }, []);
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Navbar />
      <Head>
        <title>Set Up Your Finfluencer Profile | Inverstra</title>
        <meta name="description" content="Create your Finfluencer profile on Inverstra" />
      </Head>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-violet-500/5 blur-3xl"></div>
      </div>
      
      <div className="text-center mb-8 relative top-8 z-10">
        
        <h1 className="text-2xl font-bold text-white mb-2">Create Your Finfluencer Profile</h1>
        <p className="text-slate-300 max-w-lg">
          Showcase your expertise and build your Web3 reputation
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="flex items-center justify-center w-full max-w-md mb-6 relative z-10">
        <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <span className="text-slate-300 text-sm ml-4">Step {currentStep} of {totalSteps}</span>
      </div>
      
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 relative z-10">
        <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-purple-500/30 transition-all flex-1">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <>
                {/* Name Input */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <User className="w-5 h-5 mr-2 text-purple-400" />
                    <h2 className="text-xl font-medium text-white">Your Name</h2>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">How you want to be known in the community</p>
                  
                  <div>
                    <Input
                      className={`bg-slate-800/80 border-slate-700 text-white focus:border-purple-500/50 ${
                        errors.name ? 'border-red-500' : ''
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
                </div>
                
                {/* Expertise Areas */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                    <h2 className="text-xl font-medium text-white">Expertise Areas</h2>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Select all areas of financial expertise you cover</p>
                  
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
                      <div
                        key={item.id}
                        onClick={() => handleExpertiseToggle(item.id)}
                        className={`p-3 rounded-lg border cursor-pointer flex items-center transition-all ${
                          formData.expertiseAreas.includes(item.id) 
                            ? 'bg-purple-900/30 border-purple-500/50 text-white'
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-purple-500/30'
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  {errors.expertiseAreas && (
                    <p className="text-red-500 text-xs mt-2 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.expertiseAreas}
                    </p>
                  )}
                </div>
                
                {/* Experience Background */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Award className="w-5 h-5 mr-2 text-purple-400" />
                    <h2 className="text-xl font-medium text-white">Experience Background</h2>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Share your financial expertise and credentials</p>
                  
                  <Textarea
                    className={`bg-slate-800/80 border-slate-700 text-white resize-none focus:border-purple-500/50 ${
                      errors.experienceBackground ? 'border-red-500' : ''
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
                    <p className="text-xs text-slate-400 mt-2">
                      *You'll be able to verify credentials (CA, CFA, MBA etc.) later
                    </p>
                  )}
                </div>
              </>
            )}
            
            {currentStep === 2 && (
              <>
                {/* Content Style */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <PieChart className="w-5 h-5 mr-2 text-purple-400" />
                    <h2 className="text-xl font-medium text-white">Content Style</h2>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Select the formats you'll use for sharing insights</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'technicalCharts', label: 'Technical Charts', icon: '📉', desc: 'Chart analysis & patterns' },
                      { id: 'macroNews', label: 'Macro News Commentary', icon: '📰', desc: 'Big picture economic insights' },
                      { id: 'portfolioShowcase', label: 'Portfolio Showcase', icon: '💼', desc: 'Share your investment picks' },
                      { id: 'memes', label: 'Memes + Explain Like 5', icon: '🤓', desc: 'Simplified, fun content' },
                      { id: 'tutorials', label: 'Educational Tutorials', icon: '📚', desc: 'Step-by-step learning' },
                      { id: 'predictions', label: 'Market Predictions', icon: '🔮', desc: 'Future market trends' }
                    ].map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleContentStyleToggle(item.id)}
                        className={`p-4 rounded-lg border cursor-pointer flex items-center transition-all ${
                          formData.contentStyle.includes(item.id) 
                            ? 'bg-purple-900/30 border-purple-500/50 text-white'
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-purple-500/30'
                        }`}
                      >
                        <span className="text-xl mr-3">{item.icon}</span>
                        <div>
                          <Label className="font-medium text-white">{item.label}</Label>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.contentStyle && (
                    <p className="text-red-500 text-xs mt-2 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.contentStyle}
                    </p>
                  )}
                </div>
              </>
            )}
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
              >
                Back
              </Button>
              
              <Button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white"
              >
                {currentStep === totalSteps ? 'Start Creating' : 'Continue'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile preview section */}
        <div className="hidden lg:block relative z-10 w-80">
          <div className="sticky top-8">
            <Card className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-4 border-b border-slate-800">
                <h3 className="text-lg font-medium text-white mb-1">Profile Preview</h3>
                <p className="text-xs text-slate-400">How others will see your expertise</p>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {/* Avatar with initials from user's name */}
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'FI'}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-medium">{formData.name || 'Your Name'}</h4>
                    <p className="text-sm text-slate-400">{formatAddress(walletAddress)}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-xs text-green-500">Verified Creator</span>
                    </div>
                  </div>
                </div>
                
                {formData.expertiseAreas.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-xs uppercase text-slate-500 mb-2">Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                      {formData.expertiseAreas.map(area => (
                        <span 
                          key={area} 
                          className="text-xs px-2 py-1 rounded-full bg-purple-900/30 border border-purple-500/40 text-purple-300"
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
                  </div>
                )}
                
                {formData.contentStyle.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-xs uppercase text-slate-500 mb-2">Content Style</h5>
                    <div className="flex flex-wrap gap-2">
                      {formData.contentStyle.map(style => (
                        <span 
                          key={style} 
                          className="text-xs px-2 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/40 text-indigo-300"
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
                  </div>
                )}
                
                {formData.experienceBackground && (
                  <div>
                    <h5 className="text-xs uppercase text-slate-500 mb-2">Background</h5>
                    <p className="text-sm text-slate-300 line-clamp-4">
                      {formData.experienceBackground}
                    </p>
                  </div>
                )}
                
                {/* Stats preview */}
                <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-white font-medium">0</p>
                    <p className="text-xs text-slate-500">Predictions</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">0</p>
                    <p className="text-xs text-slate-500">Followers</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">0%</p>
                    <p className="text-xs text-slate-500">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-slate-500 text-sm relative z-10">
        <p>Connected wallet: {formatAddress(walletAddress)}</p>
      </footer>
    </div>
  );
}