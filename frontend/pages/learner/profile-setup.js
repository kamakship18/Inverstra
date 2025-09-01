// pages/learner/profile-setup.js
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


export default function LearnerProfileSetup() {
  const router = useRouter();
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
  };
  
  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const updatedInterests = prev.areasOfInterest.includes(interest)
        ? prev.areasOfInterest.filter(item => item !== interest)
        : [...prev.areasOfInterest, interest];
      
      setErrors(prev => ({...prev, areasOfInterest: ''}));
      return { ...prev, areasOfInterest: updatedInterests };
    });
  };
  
  const handleGoalChange = (value) => {
    setFormData(prev => ({ ...prev, primaryGoal: value }));
    setErrors(prev => ({...prev, primaryGoal: ''}));
  };
  
  const handleRiskChange = (value) => {
    setFormData(prev => ({ ...prev, riskTolerance: value }));
    setErrors(prev => ({...prev, riskTolerance: ''}));
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
  
  const handleContinue = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Save data to localStorage and redirect to dashboard
        localStorage.setItem('inverstraUserProfile', JSON.stringify(formData));
        console.log('Profile data saved:', formData);
        router.push('/learner/dashboard');
      }
    } else {
      // Show error notification
      console.log('Please fill in all required fields');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Head>
        <title>Set Up Your Learner Profile | Inverstra</title>
        <meta name="description" content="Customize your Inverstra learning experience" />
      </Head>
      
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl"></div>
      </div>
      
      {/* Grid lines overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
      
      {/* Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <Button variant="ghost" className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/50">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
      </div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center mb-2">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Inverstra
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Customize Your Learning Experience</h1>
        <p className="text-slate-300 max-w-lg">
          Tell us about your investment goals and preferences
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="flex items-center justify-center w-full max-w-md mb-6 relative z-10">
        <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <span className="text-slate-300 text-sm ml-4">Step {currentStep} of {totalSteps}</span>
      </div>
      
      <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-blue-500/30 transition-all w-full max-w-2xl relative z-10">
        <CardContent className="p-8">
          {currentStep === 1 && (
            <>
              {/* Name Input */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  <h2 className="text-xl font-medium text-white">Your Name</h2>
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleNameChange}
                    className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 ${errors.name ? 'border-red-500' : 'focus:border-blue-500'}`}
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
                  <h2 className="text-xl font-medium text-white">Investment Experience Level</h2>
                </div>
                
                <RadioGroup 
                  className="grid grid-cols-3 gap-4"
                  value={formData.experienceLevel}
                  onValueChange={handleExperienceChange}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative w-full h-full">
                      <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex flex-col items-center justify-center text-center cursor-pointer ${formData.experienceLevel === 'beginner' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.experienceLevel ? 'border-red-500' : ''}`}>
                        <RadioGroupItem value="beginner" id="beginner" className="sr-only" />
                        <span className="text-xl mb-1">🌱</span>
                        <Label htmlFor="beginner" className="font-medium text-white">Beginner</Label>
                        <p className="text-xs text-slate-400 mt-1">New to investing</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative w-full h-full">
                      <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex flex-col items-center justify-center text-center cursor-pointer ${formData.experienceLevel === 'intermediate' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.experienceLevel ? 'border-red-500' : ''}`}>
                        <RadioGroupItem value="intermediate" id="intermediate" className="sr-only" />
                        <span className="text-xl mb-1">📊</span>
                        <Label htmlFor="intermediate" className="font-medium text-white">Intermediate</Label>
                        <p className="text-xs text-slate-400 mt-1">Some experience</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative w-full h-full">
                      <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex flex-col items-center justify-center text-center cursor-pointer ${formData.experienceLevel === 'advanced' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.experienceLevel ? 'border-red-500' : ''}`}>
                        <RadioGroupItem value="advanced" id="advanced" className="sr-only" />
                        <span className="text-xl mb-1">🚀</span>
                        <Label htmlFor="advanced" className="font-medium text-white">Advanced</Label>
                        <p className="text-xs text-slate-400 mt-1">Experienced investor</p>
                      </div>
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
                  <h2 className="text-xl font-medium text-white">Areas of Interest</h2>
                </div>
                <p className="text-sm text-slate-400 mb-4">Select all that apply to your investment interests</p>
                
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
                      className={`p-3 rounded-lg border cursor-pointer flex items-center transition-all ${
                        formData.areasOfInterest.includes(item.id) 
                          ? 'bg-blue-900/30 border-blue-500/50 text-white'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-blue-500/30'
                      }`}
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
                  <h2 className="text-xl font-medium text-white">Primary Investment Goal</h2>
                </div>
                
                <RadioGroup 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  value={formData.primaryGoal}
                  onValueChange={handleGoalChange}
                >
                  <div className="flex flex-col">
                    <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex items-center cursor-pointer ${formData.primaryGoal === 'growth' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.primaryGoal ? 'border-red-500' : ''}`}>
                      <RadioGroupItem value="growth" id="growth" className="sr-only" />
                      <span className="text-xl mr-3">💹</span>
                      <div>
                        <Label htmlFor="growth" className="font-medium text-white">Wealth Growth</Label>
                        <p className="text-xs text-slate-400">Long-term capital appreciation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex items-center cursor-pointer ${formData.primaryGoal === 'income' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.primaryGoal ? 'border-red-500' : ''}`}>
                      <RadioGroupItem value="income" id="income" className="sr-only" />
                      <span className="text-xl mr-3">💰</span>
                      <div>
                        <Label htmlFor="income" className="font-medium text-white">Passive Income</Label>
                        <p className="text-xs text-slate-400">Regular dividends and yields</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex items-center cursor-pointer ${formData.primaryGoal === 'retirement' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.primaryGoal ? 'border-red-500' : ''}`}>
                      <RadioGroupItem value="retirement" id="retirement" className="sr-only" />
                      <span className="text-xl mr-3">🧓</span>
                      <div>
                        <Label htmlFor="retirement" className="font-medium text-white">Retirement Planning</Label>
                        <p className="text-xs text-slate-400">Building your future nest egg</p>
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
                  <h2 className="text-xl font-medium text-white">Risk Tolerance</h2>
                </div>
                <p className="text-sm text-slate-400 mb-6">How comfortable are you with investment risk?</p>
                
                <RadioGroup 
                  className="grid grid-cols-1 gap-4"
                  value={formData.riskTolerance}
                  onValueChange={handleRiskChange}
                >
                  <div className="flex flex-col">
                    <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex items-center cursor-pointer ${formData.riskTolerance === 'conservative' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.riskTolerance ? 'border-red-500' : ''}`}>
                      <RadioGroupItem value="conservative" id="conservative" className="sr-only" />
                      <span className="text-xl mr-3">🛡️</span>
                      <div>
                        <Label htmlFor="conservative" className="font-medium text-white">Conservative</Label>
                        <p className="text-xs text-slate-400">Prefer stability over high returns</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex items-center cursor-pointer ${formData.riskTolerance === 'moderate' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.riskTolerance ? 'border-red-500' : ''}`}>
                      <RadioGroupItem value="moderate" id="moderate" className="sr-only" />
                      <span className="text-xl mr-3">⚖️</span>
                      <div>
                        <Label htmlFor="moderate" className="font-medium text-white">Moderate</Label>
                        <p className="text-xs text-slate-400">Balanced approach to risk and return</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className={`p-4 rounded-lg border hover:border-blue-500/50 transition flex items-center cursor-pointer ${formData.riskTolerance === 'aggressive' ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'} ${errors.riskTolerance ? 'border-red-500' : ''}`}>
                      <RadioGroupItem value="aggressive" id="aggressive" className="sr-only" />
                      <span className="text-xl mr-3">🚀</span>
                      <div>
                        <Label htmlFor="aggressive" className="font-medium text-white">Aggressive</Label>
                        <p className="text-xs text-slate-400">Willing to take higher risks for greater returns</p>
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
            >
              {currentStep === totalSteps ? 'Start Exploring' : 'Continue'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <footer className="mt-8 text-center text-slate-500 text-sm relative z-10">
        <p>Connected wallet: 0x71a2...3e5f</p>
      </footer>
    </div>
  );
}