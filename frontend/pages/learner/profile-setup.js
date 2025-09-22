import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, BookOpen, Target, BarChart3, WalletCards, Globe, Home, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import axios from 'axios';


export default function LearnerProfileSetup() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    experienceLevel: '',
    areasOfInterest: [],
    primaryGoal: '',
    riskTolerance: '',
    language: 'english'
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const totalSteps = 2;
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('inverstraUserProfile');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({...prev, ...parsedData}));
      } catch (e) {
        console.error("Error parsing saved profile data", e);
      }
    }
  }, []);
  
  const handleExperienceChange = (value) => {
    setFormData(prev => ({ ...prev, experienceLevel: value }));
    setErrors(prev => ({...prev, experienceLevel: ''}));
    
    const experienceLabels = {
      'beginner': 'Welcome beginner! We\'ll guide you through the basics.',
      'intermediate': 'Great! You have some investing experience.',
      'advanced': 'Excellent! We\'ll show you advanced investment strategies.'
    };
    showToast(experienceLabels[value] || 'Experience level selected!', 'info');
  };
  
  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const isRemoving = prev.areasOfInterest.includes(interest);
      const updatedInterests = isRemoving
        ? prev.areasOfInterest.filter(item => item !== interest)
        : [...prev.areasOfInterest, interest];
      
      setErrors(prev => ({...prev, areasOfInterest: ''}));
      
      const interestLabels = {
        'stocks': 'Stocks & Equities',
        'crypto': 'Cryptocurrency',
        'mutualFunds': 'Mutual Funds',
        'gold': 'Gold',
        'realEstate': 'Real Estate',
        'bonds': 'Bonds'
      };
      
      if (!isRemoving) {
        showToast(`${interestLabels[interest] || interest} added to your interests!`, 'success');
      }
      
      return { ...prev, areasOfInterest: updatedInterests };
    });
  };
  
  const handleGoalChange = (value) => {
    setFormData(prev => ({ ...prev, primaryGoal: value }));
    setErrors(prev => ({...prev, primaryGoal: ''}));
    
    const goalMessages = {
      'growth': 'We\'ll help you maximize long-term capital growth!',
      'income': 'We\'ll show you the best passive income strategies!',
      'retirement': 'Planning for a secure future is a great goal!'
    };
    
    showToast(goalMessages[value] || 'Investment goal selected!', 'success');
  };
  
  const handleRiskChange = (value) => {
    setFormData(prev => ({ ...prev, riskTolerance: value }));
    setErrors(prev => ({...prev, riskTolerance: ''}));
    
    const riskMessages = {
      'conservative': 'We\'ll focus on stable, lower-risk investments for you.',
      'moderate': 'A balanced approach - smart choice!',
      'aggressive': 'High risk, high reward - we\'ll find opportunities for growth!'
    };
    
    showToast(riskMessages[value] || 'Risk preference selected!', 'info');
  };
  
  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
    if (e.target.value.trim()) {
      setErrors(prev => ({...prev, name: ''}));
    }
  };
  
  const handleLanguageChange = (value) => {
    setFormData(prev => ({ ...prev, language: value }));
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Please enter your name';
      }
      
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = 'Please select your experience level';
      }
      
      if (formData.areasOfInterest.length === 0) {
        newErrors.areasOfInterest = 'Please select at least one area of interest';
      }
      
      if (!formData.primaryGoal) {
        newErrors.primaryGoal = 'Please select a primary goal';
      }
    }
    
    if (step === 2) {
      if (!formData.riskTolerance) {
        newErrors.riskTolerance = 'Please select your risk tolerance';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinue = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        showToast(`Moving to step ${currentStep + 1} of ${totalSteps}`, 'success');
      } else {
        // Save data to localStorage
        localStorage.setItem('inverstraUserProfile', JSON.stringify(formData));
        
        try {
          // Get wallet address from localStorage
          const walletAddress = localStorage.getItem('connectedWalletAddress');
          
          if (!walletAddress) {
            showToast('Wallet not connected. Please connect your wallet.', 'error');
            setTimeout(() => router.push('/wallet-connect'), 2000);
            return;
          }
          
          showToast('Saving your profile...', 'loading');
          
          // Check if profile already exists
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
          
          // First check if the profile exists
          const checkResponse = await axios.get(`${backendUrl}/api/learners/wallet/${walletAddress}`);
          
          if (checkResponse.data.success) {
            // Profile exists, update it
            await axios.put(`${backendUrl}/api/learners/wallet/${walletAddress}`, {
              ...formData,
              walletAddress
            });
            showToast('Profile updated successfully!', 'success');
          } else {
            // Profile doesn't exist, create it
            await axios.post(`${backendUrl}/api/learners`, {
              ...formData,
              walletAddress
            });
            showToast('Profile created successfully!', 'success');
          }
          
          setTimeout(() => router.push('/learner/dashboard'), 1500);
        } catch (error) {
          console.error('Error saving profile:', error);
          
          // If the error is 404 (profile not found), create a new profile
          if (error.response && error.response.status === 404) {
            try {
              const walletAddress = localStorage.getItem('connectedWalletAddress');
              const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
              
              await axios.post(`${backendUrl}/api/learners`, {
                ...formData,
                walletAddress
              });
              
              showToast('Profile created successfully!', 'success');
              setTimeout(() => router.push('/learner/dashboard'), 1500);
            } catch (createError) {
              console.error('Error creating profile:', createError);
              showToast('Failed to save profile. Please try again later.', 'error');
            }
          } else {
            showToast('Failed to save profile. Please try again later.', 'error');
          }
        }
      }
    } else {
      // Show error notification
      showToast('Please fill in all required fields', 'error');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 flex flex-col p-0 relative overflow-hidden bg-repeat bg-center">
      <Navbar />
      
      <Head>
        <title>Set Up Your Learner Profile | Inverstra</title>
        <meta name="description" content="Customize your Inverstra learning experience" />
      </Head>
      
      {/* Pastel/Neon blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 0.4, scale: 1 }} 
          transition={{ duration: 1 }} 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-300/50 to-cyan-200/50 dark:from-blue-500/20 dark:to-cyan-400/20 blur-3xl" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 0.4, scale: 1 }} 
          transition={{ duration: 1.2 }} 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-purple-300/50 to-pink-200/50 dark:from-purple-500/20 dark:to-pink-400/20 blur-3xl" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 0.3, scale: 1 }} 
          transition={{ duration: 1.4 }} 
          className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-pink-300/50 to-orange-200/50 dark:from-pink-500/20 dark:to-orange-400/20 blur-3xl" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 0.3, scale: 1 }} 
          transition={{ duration: 1.6 }} 
          className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-300/50 to-blue-200/50 dark:from-indigo-500/20 dark:to-blue-400/20 blur-3xl" 
        />
      </div>
      
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex flex-col items-center w-full flex-1 pt-24 pb-12">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="rounded-3xl backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-indigo-500/20 bg-white/80 dark:bg-slate-900/80 transition-all hover:shadow-blue-200/30 dark:hover:shadow-indigo-500/20 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.2),0_8px_10px_-6px_rgba(79,70,229,0.2)]">
            <CardContent className="p-10 relative before:absolute before:inset-0 before:rounded-3xl before:p-0.5 before:bg-gradient-to-br before:from-indigo-200 before:via-purple-200 before:to-pink-200 dark:before:from-indigo-600/30 dark:before:via-purple-600/30 dark:before:to-pink-600/30 before:opacity-50 before:blur-md before:-z-10">
              {/* Progress bar */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="text-center mb-2">
                  <span className="text-lg font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <span className="text-xl">{currentStep === 1 ? '📊' : '✅'}</span> Step {currentStep} of {totalSteps}
                  </span>
                </div>
                <div className="w-full max-w-md mx-auto bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-800/40 dark:to-slate-700/30 h-3 rounded-full overflow-hidden shadow-inner border border-white/50 dark:border-indigo-500/20">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }} 
                    transition={{ duration: 0.7 }}
                    className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 transition-all duration-300 animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.4)] dark:shadow-[0_0_15px_rgba(79,70,229,0.6)]"
                  ></motion.div>
                </div>
              </div>
      {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 drop-shadow-md">Set Up Your Learner Profile</h1>
                <p className="text-gray-600 dark:text-slate-300 max-w-lg mx-auto">Tell us about your investment goals and preferences</p>
              </div>
              
              {currentStep === 1 && (
                <>
                  {/* Name Input */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <User className="w-5 h-5 mr-2 text-blue-400" />
                      <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Your Name</h2>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-blue-400 dark:text-indigo-400">👤</span>
                      <Input
                        type="text"
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={handleNameChange}
                        className={`pl-10 bg-white/60 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-500 focus:ring-opacity-50 dark:focus:ring-opacity-60 focus:border-transparent rounded-xl transition-all duration-200 shadow-sm focus:shadow-blue-300/30 dark:focus:shadow-indigo-500/30 ${errors.name ? 'border-red-500 ring-2 ring-red-400/50' : 'focus:border-transparent'}`}
                      />
                      {errors.name && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Experience Level */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                      <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Investment Experience Level</h2>
                    </div>
                    
                    <RadioGroup 
                      className="grid grid-cols-3 gap-4"
                      value={formData.experienceLevel}
                      onValueChange={handleExperienceChange}
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative w-full h-full">
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: 0.1 }} 
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm hover:ring-2 hover:ring-blue-400 dark:hover:ring-indigo-500 focus-within:ring-2 focus-within:ring-blue-400 dark:focus-within:ring-indigo-500 ${
                              formData.experienceLevel === 'beginner' 
                                ? 'bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800 border-blue-400/50 shadow-lg ring-2 ring-blue-400 dark:ring-indigo-500' 
                                : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-white dark:hover:from-blue-900/20 dark:hover:to-slate-800/70'
                            }`}
                          > 
                            <RadioGroupItem value="beginner" id="beginner" className="sr-only" />
                            <span className="text-xl mb-1">🌱</span>
                            <Label htmlFor="beginner" className="font-medium text-gray-800 dark:text-white">Beginner</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">New to investing</p>
                          </motion.div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="relative w-full h-full">
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: 0.2 }} 
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm hover:ring-2 hover:ring-purple-400 dark:hover:ring-pink-500 focus-within:ring-2 focus-within:ring-purple-400 dark:focus-within:ring-pink-500 ${
                              formData.experienceLevel === 'intermediate' 
                                ? 'bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900/40 dark:to-pink-900 border-purple-400/50 shadow-lg ring-2 ring-purple-400 dark:ring-pink-500' 
                                : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-white dark:hover:from-purple-900/20 dark:hover:to-slate-800/70'
                            }`}
                          > 
                            <RadioGroupItem value="intermediate" id="intermediate" className="sr-only" />
                            <span className="text-xl mb-1">📊</span>
                            <Label htmlFor="intermediate" className="font-medium text-gray-800 dark:text-white">Intermediate</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Some experience</p>
                          </motion.div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="relative w-full h-full">
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: 0.3 }} 
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm hover:ring-2 hover:ring-pink-400 dark:hover:ring-blue-500 focus-within:ring-2 focus-within:ring-pink-400 dark:focus-within:ring-blue-500 ${
                              formData.experienceLevel === 'advanced' 
                                ? 'bg-gradient-to-br from-pink-100 to-blue-50 dark:from-pink-900/40 dark:to-blue-900 border-pink-400/50 shadow-lg ring-2 ring-pink-400 dark:ring-blue-500' 
                                : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 hover:bg-gradient-to-br hover:from-pink-50/50 hover:to-white dark:hover:from-pink-900/20 dark:hover:to-slate-800/70'
                            }`}
                          > 
                            <RadioGroupItem value="advanced" id="advanced" className="sr-only" />
                            <span className="text-xl mb-1">🚀</span>
                            <Label htmlFor="advanced" className="font-medium text-gray-800 dark:text-white">Advanced</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Experienced investor</p>
                          </motion.div>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    {errors.experienceLevel && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.experienceLevel}
                      </div>
                    )}
                  </div>
                  
                  {/* Areas of Interest */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <Target className="w-5 h-5 mr-2 text-blue-400" />
                      <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Areas of Interest</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Select all that apply to your investment interests</p>
                    
                    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${errors.areasOfInterest ? 'border border-red-500 p-2 rounded-md' : ''}`}>
                      {[
                        { id: 'stocks', label: 'Stocks/Equities', icon: '📈' },
                        { id: 'crypto', label: 'Crypto', icon: '🌐' },
                        { id: 'mutualFunds', label: 'Mutual Funds', icon: '💼' },
                        { id: 'gold', label: 'Gold', icon: '🪙' },
                        { id: 'realEstate', label: 'Real Estate', icon: '🏠' },
                        { id: 'bonds', label: 'Bonds', icon: '📑' }
                      ].map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleInterestToggle(item.id)}
                          className={`p-3 rounded-xl border cursor-pointer flex items-center transition-all duration-200 shadow-sm hover:scale-105 hover:ring-2 hover:ring-blue-400 dark:hover:ring-indigo-500 focus-within:ring-2 focus-within:ring-blue-400 dark:focus-within:ring-indigo-500 ${formData.areasOfInterest.includes(item.id) 
                            ? 'bg-gradient-to-br from-blue-100 to-pink-50 dark:from-blue-900/40 dark:to-pink-900 border-blue-400/50 shadow-lg ring-2 ring-blue-400 dark:ring-indigo-500 text-gray-900 dark:text-white' 
                            : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300'}`}
                        >
                          <span className="mr-2">{item.icon}</span>
                          <span className="text-sm">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    
                    {errors.areasOfInterest && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.areasOfInterest}
                      </div>
                    )}
                  </div>
                  
                  {/* Primary Investment Goal */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                      <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Primary Investment Goal</h2>
                    </div>
                    
                    <RadioGroup 
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      value={formData.primaryGoal}
                      onValueChange={handleGoalChange}
                    >
                      <div className="flex flex-col">
                        <div className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 hover:ring-2 hover:ring-blue-400 dark:hover:ring-indigo-500 focus-within:ring-2 focus-within:ring-blue-400 dark:focus-within:ring-indigo-500 ${formData.primaryGoal === 'growth' ? 'bg-gradient-to-br from-blue-100 to-pink-50 dark:from-blue-900/40 dark:to-pink-900 border-blue-400/50 shadow-lg ring-2 ring-blue-400 dark:ring-indigo-500' : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700'}`}> 
                          <RadioGroupItem value="growth" id="growth" className="sr-only" />
                          <span className="text-xl mr-3">💹</span>
                          <div>
                            <Label htmlFor="growth" className="font-medium text-gray-800 dark:text-white">Wealth Growth</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Long-term capital appreciation</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 hover:ring-2 hover:ring-purple-400 dark:hover:ring-pink-500 focus-within:ring-2 focus-within:ring-purple-400 dark:focus-within:ring-pink-500 ${formData.primaryGoal === 'income' ? 'bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900/40 dark:to-pink-900 border-purple-400/50 shadow-lg ring-2 ring-purple-400 dark:ring-pink-500' : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700'}`}> 
                          <RadioGroupItem value="income" id="income" className="sr-only" />
                          <span className="text-xl mr-3">💰</span>
                          <div>
                            <Label htmlFor="income" className="font-medium text-gray-800 dark:text-white">Passive Income</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Regular dividends and yields</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 hover:ring-2 hover:ring-pink-400 dark:hover:ring-blue-500 focus-within:ring-2 focus-within:ring-pink-400 dark:focus-within:ring-blue-500 ${formData.primaryGoal === 'retirement' ? 'bg-gradient-to-br from-pink-100 to-blue-50 dark:from-pink-900/40 dark:to-blue-900 border-pink-400/50 shadow-lg ring-2 ring-pink-400 dark:ring-blue-500' : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700'}`}> 
                          <RadioGroupItem value="retirement" id="retirement" className="sr-only" />
                          <span className="text-xl mr-3">🧓</span>
                          <div>
                            <Label htmlFor="retirement" className="font-medium text-gray-800 dark:text-white">Retirement Planning</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Building your future nest egg</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    {errors.primaryGoal && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.primaryGoal}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {currentStep === 2 && (
                <>
                  {/* Risk Tolerance */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <WalletCards className="w-5 h-5 mr-2 text-blue-400" />
                      <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Risk Tolerance</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">How comfortable are you with investment risk?</p>
                    
                    <RadioGroup 
                      className="grid grid-cols-1 gap-4"
                      value={formData.riskTolerance}
                      onValueChange={handleRiskChange}
                    >
                      <div className="flex flex-col">
                        <div className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 hover:ring-2 hover:ring-blue-400 dark:hover:ring-indigo-500 focus-within:ring-2 focus-within:ring-blue-400 dark:focus-within:ring-indigo-500 ${formData.riskTolerance === 'conservative' ? 'bg-gradient-to-br from-blue-100 to-pink-50 dark:from-blue-900/40 dark:to-pink-900 border-blue-400/50 shadow-lg ring-2 ring-blue-400 dark:ring-indigo-500' : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700'}`}> 
                          <RadioGroupItem value="conservative" id="conservative" className="sr-only" />
                          <span className="text-xl mr-3">🛡️</span>
                          <div>
                            <Label htmlFor="conservative" className="font-medium text-gray-800 dark:text-white">Conservative</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Prefer stability over high returns</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 hover:ring-2 hover:ring-purple-400 dark:hover:ring-pink-500 focus-within:ring-2 focus-within:ring-purple-400 dark:focus-within:ring-pink-500 ${formData.riskTolerance === 'moderate' ? 'bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900/40 dark:to-pink-900 border-purple-400/50 shadow-lg ring-2 ring-purple-400 dark:ring-pink-500' : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700'}`}> 
                          <RadioGroupItem value="moderate" id="moderate" className="sr-only" />
                          <span className="text-xl mr-3">⚖️</span>
                          <div>
                            <Label htmlFor="moderate" className="font-medium text-gray-800 dark:text-white">Moderate</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Balanced approach to risk and return</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 hover:ring-2 hover:ring-pink-400 dark:hover:ring-blue-500 focus-within:ring-2 focus-within:ring-pink-400 dark:focus-within:ring-blue-500 ${formData.riskTolerance === 'aggressive' ? 'bg-gradient-to-br from-pink-100 to-blue-50 dark:from-pink-900/40 dark:to-blue-900 border-pink-400/50 shadow-lg ring-2 ring-pink-400 dark:ring-blue-500' : 'bg-white/60 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700'}`}> 
                          <RadioGroupItem value="aggressive" id="aggressive" className="sr-only" />
                          <span className="text-xl mr-3">🚀</span>
                          <div>
                            <Label htmlFor="aggressive" className="font-medium text-gray-800 dark:text-white">Aggressive</Label>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Willing to take higher risks for greater returns</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    {errors.riskTolerance && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.riskTolerance}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <div className="flex justify-between mt-12">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-700 dark:text-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 rounded-full shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg border-gray-200 dark:border-indigo-500/20 px-6"
                >
                  <span className="mr-2">←</span>
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-700 hover:via-indigo-600 hover:to-purple-700 text-white rounded-full shadow-md font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-600/40 hover:scale-105 px-8 py-3"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {currentStep === totalSteps ? 'Start Exploring' : 'Continue'}
                    <motion.div 
                      className="ml-2" 
                      animate={{ x: [0, 5, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </span>
                  <span className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}