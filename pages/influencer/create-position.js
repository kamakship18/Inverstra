import React, { useState, useEffect } from 'react';

import { ethers } from "ethers";
import { contractABI } from "../../contract/abi";
import { contractAddress } from "../../contract/contractAddress";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ChevronRight, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Bitcoin, 
  BarChart3, 
  Globe, 
  Settings, 
  Star, 
  Link, 
  Wand2, 
  Share2, 
  AlertCircle,
  User
} from 'lucide-react';

const CreatePredictionPage = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [userName, setUserName] = useState('');
  
  // Get user name from local storage
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Anonymous';
    setUserName(storedName);
  }, []);
  
  // Initialize form with useState and validation errors
  const [formData, setFormData] = useState({
    community: '',
    category: '',
    asset: '',
    predictionType: 'priceTarget',
    targetPrice: '',
    deadline: '',
    confidence: 3,
    reasoning: '',
    confirmed: false,
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({
    community: '',
    category: '',
    asset: '',
    targetPrice: '',
    deadline: '',
    reasoning: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate setup form fields
  const validateSetupFields = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.community) {
      newErrors.community = 'Please select a community';
      isValid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }
    
    if (!formData.asset) {
      newErrors.asset = 'Please select an asset';
      isValid = false;
    }
    
    if (!formData.targetPrice) {
      newErrors.targetPrice = 'This field is required';
      isValid = false;
    } else if (formData.predictionType !== 'event') {
      // Validate if number for price target and percentage types
      if (!/^-?\d*\.?\d+%?$/.test(formData.targetPrice)) {
        newErrors.targetPrice = 'Please enter a valid number';
        isValid = false;
      }
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Please select a deadline';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validateReasoningFields = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.reasoning || formData.reasoning.trim().length < 20) {
      newErrors.reasoning = 'Please provide detailed reasoning (at least 20 characters)';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleTabChange = (nextTab) => {
    if (activeTab === 'setup' && nextTab === 'reasoning') {
      if (!validateSetupFields()) return;
    }
    
    if (activeTab === 'reasoning' && nextTab === 'preview') {
      if (!validateReasoningFields()) return;
    }
    
    setActiveTab(nextTab);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.confirmed) {
      alert("Please confirm your submission");
      return;
    }

    if (!window.ethereum) return alert("MetaMask is required.");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.submitForm(
        formData.community,
        formData.category,
        formData.asset,
        formData.predictionType,
        formData.targetPrice,
        formData.deadline,
        parseInt(formData.confidence),
        formData.reasoning,
        formData.confirmed
      );
      await tx.wait();
      alert("Prediction submitted successfully!");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed: " + (err.message || "Unknown error"));
    }
  };
  
  const getConfidenceColor = (level) => {
    const colors = [
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-green-400',
      'text-green-500'
    ];
    return colors[level - 1] || 'text-white';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-4 md:p-8">
      {/* Header with user name */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center text-gray-400">
          <Home size={16} className="mr-2" />
          <span className="mr-2">Dashboard</span>
          <ChevronRight size={16} className="mr-2" />
          <span className="text-cyan-400">Create Prediction</span>
        </div>
        <div className="flex items-center bg-gray-800/70 rounded-full px-3 py-1 text-cyan-300">
          <User size={16} className="mr-2" />
          <span>{userName}'s Next Prediction</span>
        </div>
      </div>
      
      {/* Progress Steps */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="setup" className="data-[state=active]:bg-cyan-800 data-[state=active]:text-white text-black">
            Setup
          </TabsTrigger>
          <TabsTrigger value="reasoning" className="data-[state=active]:bg-cyan-800 data-[state=active]:text-white text-black">
            Reasoning
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-cyan-800 data-[state=active]:text-white text-black">
            Preview
          </TabsTrigger>
          <TabsTrigger value="submit" className="data-[state=active]:bg-cyan-800 data-[state=active]:text-white text-black">
            Submit
          </TabsTrigger>
        </TabsList>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT SECTION: Prediction Composer */}
          <div className="space-y-8">
            <Card className="bg-gray-900/50 border-gray-800 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Create New Prediction</CardTitle>
                <CardDescription className="text-gray-400">
                  Create a prediction to share with your DAO community
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <TabsContent value="setup" className="space-y-6">
                    {/* Community Selector */}
                    <div>
                      <label className="block text-white mb-2">Choose your DAO community*</label>
                      <Select 
                        onValueChange={(value) => handleChange('community', value)}
                        value={formData.community}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select community" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="cryptovisors">CryptoVisors DAO</SelectItem>
                          <SelectItem value="marketoracles">Market Oracles</SelectItem>
                          <SelectItem value="foresight">Foresight Collective</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.community && <p className="text-red-500 text-sm mt-1">{errors.community}</p>}
                      <p className="text-gray-500 text-sm mt-1">
                        Only members of this DAO can vote on your prediction
                      </p>
                    </div>
                    
                    {/* Category Selector */}
                    <div>
                      <label className="block text-white mb-2">Category*</label>
                      <Select 
                        onValueChange={(value) => handleChange('category', value)}
                        value={formData.category}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="equities">
                            <div className="flex items-center">
                              <DollarSign size={16} className="mr-2 text-green-400" />
                              <span>Equities (Stocks)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="crypto">
                            <div className="flex items-center">
                              <Bitcoin size={16} className="mr-2 text-orange-400" />
                              <span>Crypto</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="commodities">
                            <div className="flex items-center">
                              <BarChart3 size={16} className="mr-2 text-yellow-400" />
                              <span>Commodities</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="indices">
                            <div className="flex items-center">
                              <TrendingUp size={16} className="mr-2 text-blue-400" />
                              <span>Indices</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="macro">
                            <div className="flex items-center">
                              <Globe size={16} className="mr-2 text-purple-400" />
                              <span>Macro Events</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                    
                    {/* Asset Picker */}
                    <div>
                      <label className="block text-white mb-2">Asset*</label>
                      <Select 
                        onValueChange={(value) => handleChange('asset', value)}
                        value={formData.asset}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select asset" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="AAPL">AAPL - Apple Inc.</SelectItem>
                          <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                          <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                          <SelectItem value="NIFTY50">NIFTY50 - Nifty 50 Index</SelectItem>
                          <SelectItem value="GOLD">GOLD - Gold</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.asset && <p className="text-red-500 text-sm mt-1">{errors.asset}</p>}
                    </div>
                    
                    {/* Prediction Type */}
                    <div>
                      <label className="block text-white mb-2">Prediction Type*</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          type="button"
                          variant={formData.predictionType === 'priceTarget' ? 'default' : 'outline'}
                          className={formData.predictionType === 'priceTarget' ? 'bg-cyan-800 hover:bg-cyan-700' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'}
                          onClick={() => handleChange('predictionType', 'priceTarget')}
                        >
                          Will reach price X
                        </Button>
                        <Button 
                          type="button"
                          variant={formData.predictionType === 'percentage' ? 'default' : 'outline'}
                          className={formData.predictionType === 'percentage' ? 'bg-cyan-800 hover:bg-cyan-700' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'}
                          onClick={() => handleChange('predictionType', 'percentage')}
                        >
                          % change
                        </Button>
                        <Button 
                          type="button"
                          variant={formData.predictionType === 'event' ? 'default' : 'outline'}
                          className={formData.predictionType === 'event' ? 'bg-cyan-800 hover:bg-cyan-700' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'}
                          onClick={() => handleChange('predictionType', 'event')}
                        >
                          Event
                        </Button>
                      </div>
                    </div>
                    
                    {/* Target Input */}
                    <div>
                      <label className="block text-white mb-2">
                        {formData.predictionType === 'priceTarget' && 'Target Price*'}
                        {formData.predictionType === 'percentage' && 'Percentage Change*'}
                        {formData.predictionType === 'event' && 'Event Description*'}
                      </label>
                      <Input 
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder={
                          formData.predictionType === 'priceTarget' ? 'Enter target price' :
                          formData.predictionType === 'percentage' ? 'Enter % (e.g. 5.2%)' :
                          'Describe the event'
                        }
                        value={formData.targetPrice}
                        onChange={(e) => {
                          // Validate input based on prediction type
                          if (formData.predictionType === 'priceTarget') {
                            // Allow only numbers and decimal points
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleChange('targetPrice', value);
                          } else if (formData.predictionType === 'percentage') {
                            // Allow numbers, decimal points, and % sign
                            const value = e.target.value.replace(/[^0-9.%-]/g, '');
                            handleChange('targetPrice', value);
                          } else {
                            // For event type, allow any text
                            handleChange('targetPrice', e.target.value);
                          }
                        }}
                      />
                      {errors.targetPrice && <p className="text-red-500 text-sm mt-1">{errors.targetPrice}</p>}
                    </div>
                    
                    {/* Deadline */}
                    <div>
                      <label className="block text-white mb-2">Target Deadline*</label>
                      <div className="flex items-center">
                        <Input 
                          type="date" 
                          className="bg-gray-800 border-gray-700 text-white"
                          value={formData.deadline}
                          onChange={(e) => handleChange('deadline', e.target.value)}
                        />
                        <Calendar className="ml-2 text-gray-400" size={20} />
                      </div>
                      {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                    </div>
                    
                    {/* Confidence Slider */}
                    <div>
                      <label className="block text-white mb-2">Your Confidence Level</label>
                      <div className="flex items-center space-x-2">
                        <Slider 
                          min={1}
                          max={5}
                          step={1}
                          value={[formData.confidence]}
                          onValueChange={(value) => handleChange('confidence', value[0])}
                          className="py-4"
                        />
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={20} 
                              className={star <= formData.confidence ? getConfidenceColor(formData.confidence) : 'text-gray-600'} 
                              fill={star <= formData.confidence ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        How confident are you in this prediction?
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => handleTabChange('reasoning')}
                        className="bg-cyan-600 hover:bg-cyan-500"
                      >
                        Next: Add Reasoning
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reasoning" className="space-y-6">
                    {/* Reasoning Field */}
                    <div>
                      <label className="block text-white mb-2">Your Reasoning*</label>
                      <Textarea 
                        placeholder="What's your reasoning or supporting analysis?"
                        className="min-h-40 bg-gray-800 border-gray-700 text-white"
                        value={formData.reasoning}
                        onChange={(e) => handleChange('reasoning', e.target.value)}
                      />
                      {errors.reasoning && <p className="text-red-500 text-sm mt-1">{errors.reasoning}</p>}
                      <p className="text-gray-500 text-sm mt-1">
                        Provide detailed analysis to support your prediction
                      </p>
                    </div>
                    
                    {/* AI Assist */}
                    <Card className="bg-gray-800/50 border border-purple-600/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center text-purple-300">
                          <Wand2 size={16} className="mr-2" />
                          AI Assist
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="border-purple-600/40 text-purple-300 bg-gray-800/80 hover:bg-purple-900/40">
                            <Wand2 size={14} className="mr-2" />
                            Improve wording
                          </Button>
                          <Button variant="outline" size="sm" className="border-purple-600/40 text-purple-300 bg-gray-800/80 hover:bg-purple-900/40">
                            <AlertCircle size={14} className="mr-2" />
                            Risk rating
                          </Button>
                          <Button variant="outline" size="sm" className="border-purple-600/40 text-purple-300 bg-gray-800/80 hover:bg-purple-900/40">
                            <Settings size={14} className="mr-2" />
                            More professional
                          </Button>
                          <Button variant="outline" size="sm" className="border-purple-600/40 text-purple-300 bg-gray-800/80 hover:bg-purple-900/40">
                            <Link size={14} className="mr-2" />
                            Add sources
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab('setup')}
                        className="border-gray-700 text-white"
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => handleTabChange('preview')}
                        className="bg-cyan-600 hover:bg-cyan-500"
                      >
                        Next: Preview
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="space-y-6">
                    <Alert className="border-amber-500/20 bg-amber-500/10">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      <AlertTitle className="text-amber-400">Preview</AlertTitle>
                      <AlertDescription className="text-amber-200">
                        Review your prediction before submitting to your DAO community.
                      </AlertDescription>
                    </Alert>
                    
                    {/* Summary of prediction details */}
                    <div className="space-y-4 bg-gray-800/30 rounded-md p-4">
                      <h3 className="text-white font-medium">Prediction Summary</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Community:</span>
                          <p className="text-white">{
                            formData.community === 'cryptovisors' ? 'CryptoVisors DAO' : 
                            formData.community === 'marketoracles' ? 'Market Oracles' : 
                            formData.community === 'foresight' ? 'Foresight Collective' :
                            'Not selected'
                          }</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Category:</span>
                          <p className="text-white">{
                            formData.category === 'equities' ? 'Equities' : 
                            formData.category === 'crypto' ? 'Crypto' : 
                            formData.category === 'commodities' ? 'Commodities' : 
                            formData.category === 'indices' ? 'Indices' : 
                            formData.category === 'macro' ? 'Macro Events' : 
                            'Not selected'
                          }</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Asset:</span>
                          <p className="text-white">{formData.asset || 'Not selected'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Prediction:</span>
                          <p className="text-white">
                            {formData.predictionType === 'priceTarget' && `Will reach ${formData.targetPrice || 'X'}`}
                            {formData.predictionType === 'percentage' && `Will change by ${formData.targetPrice || 'X%'}`}
                            {formData.predictionType === 'event' && `Will ${formData.targetPrice || 'event'}`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">By:</span>
                          <p className="text-white">{formData.deadline || 'No deadline set'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Confidence:</span>
                          <p className={getConfidenceColor(formData.confidence)}>
                            {formData.confidence}/5
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab('reasoning')}
                        className="border-gray-700 text-white"
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab('submit')}
                        className="bg-cyan-600 hover:bg-cyan-500"
                      >
                        Next: Submit
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="submit" className="space-y-6">
                    {/* Confirmation */}
                    <Alert className="border-cyan-500/20 bg-cyan-500/10">
                      <AlertCircle className="h-4 w-4 text-cyan-400" />
                      <AlertTitle className="text-cyan-400">Almost there!</AlertTitle>
                      <AlertDescription className="text-cyan-200">
                        Your prediction will be submitted to the blockchain and shared with your DAO community.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                      <Checkbox
                        checked={formData.confirmed}
                        onCheckedChange={(checked) => handleChange('confirmed', checked)}
                        className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                      />
                      <div className="space-y-1 leading-none">
                        <label className="text-white">
                          I confirm this prediction is clear, verifiable, and backed with reasoning
                        </label>
                        <p className="text-gray-500 text-sm">
                          By submitting, this prediction will be reviewed by your DAO community
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab('preview')}
                        className="border-gray-700 text-white"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={!formData.confirmed}
                        className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                      >
                        Submit to DAO Community
                      </Button>
                    </div>
                    <div className="flex justify-center mt-4">
    <Button 
      type="button" 
      onClick={() => window.location.href = '/influencer/community-hub'}
      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
    >
      Continue to Community Hub
    </Button>
  </div>
                  </TabsContent>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* RIGHT SECTION: Live Preview Card */}
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-2">Live Preview</h3>
              <p className="text-gray-400 text-sm">This is how your prediction will appear after DAO approval</p>
            </div>
            
            <Card className="bg-gray-900/50 border-gray-800 shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-cyan-900/20">
              <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-300 text-xs py-1 px-3 rounded-bl-lg">
                Pending DAO Review
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                      {formData.community?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <CardTitle className="text-white">
                        {formData.community ? 
                          formData.community === 'cryptovisors' ? 'CryptoVisors DAO' : 
                          formData.community === 'marketoracles' ? 'Market Oracles' : 
                          formData.community === 'foresight' ? 'Foresight Collective' :
                          formData.community : 'Your Community'}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-xs">by {userName} • Verified</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800/50">
                    {formData.category ? 
                      formData.category === 'equities' ? 'Equities' : 
                      formData.category === 'crypto' ? 'Crypto' : 
                      formData.category === 'commodities' ? 'Commodities' : 
                      formData.category === 'indices' ? 'Indices' : 
                      formData.category === 'macro' ? 'Macro Events' : 
                      formData.category : 'Category'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white flex items-center">
                      {formData.asset ? formData.asset : 'Asset'} 
                      {formData.predictionType === 'priceTarget' && 
                        <span className="ml-2 text-cyan-400">will reach {formData.targetPrice || 'X'}</span>
                      }
                      {formData.predictionType === 'percentage' && 
                        <span className="ml-2 text-cyan-400">will change by {formData.targetPrice || 'X%'}</span>
                      }
                      {formData.predictionType === 'event' && 
                        <span className="ml-2 text-cyan-400">will {formData.targetPrice || 'event'}</span>
                      }
                    </h3>
                    
                    <div className="mt-2 flex gap-2">
                      {formData.deadline && (
                        <Badge variant="outline" className="border-gray-700 text-gray-400">
                          <Calendar size={12} className="mr-1" />
                          By {formData.deadline}
                        </Badge>
                      )}
                      {formData.confidence && (
                        <Badge variant="outline" className={`border-gray-700 ${getConfidenceColor(formData.confidence)}`}>
                          <div className="flex items-center">
                            {[...Array(formData.confidence)].map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" className="mr-0.5" />
                            ))}
                            <span className="ml-1">Confidence</span>
                          </div>
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-md p-3 text-sm text-gray-300">
                    {formData.reasoning || "Your reasoning will appear here..."}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-gray-800 pt-3">
                <div className="flex justify-between items-center w-full text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Share2 size={14} className="mr-1" />
                      Share
                    </div>
                    {formData.predictionType === 'priceTarget' && (
                      <Badge className="bg-gray-800/80 text-gray-400 hover:bg-gray-700">Short-term</Badge>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            {/* Mobile Submit Button (Visible on small screens) */}
            <div className="md:hidden fixed bottom-4 right-4 left-4">
              <Button 
                type="button" 
                onClick={() => validateSetupFields() && validateReasoningFields() && setActiveTab('submit')}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600"
              >
                Continue to Submit
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default CreatePredictionPage;
