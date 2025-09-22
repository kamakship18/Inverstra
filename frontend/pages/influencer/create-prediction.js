import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'react-hot-toast';

import { ethers } from "ethers";
import { contractABI } from "../../contract/abi";
import { contractAddress } from "../../contract/contractAddress";
import Navbar from '@/components/layout/Navbar';
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
  User, 
  DollarSign, 
  Bitcoin, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Star, 
  Upload, 
  Loader2, 
  FileText, 
  Trash2, 
  Shield, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Share2 
} from 'lucide-react';

const CreatePredictionPage = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  // Get user name from local storage
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Anonymous';
    setUserName(storedName);
  }, []);
  
  // Initialize form with useState and validation errors
  const [formData, setFormData] = useState({
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
    category: '',
    asset: '',
    targetPrice: '',
    deadline: '',
    reasoning: '',
  });
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileValidations, setFileValidations] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  
  // Validation states
  const [assetOptions, setAssetOptions] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [validationPercentage, setValidationPercentage] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [reasoningValidation, setReasoningValidation] = useState(null);
  
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
  
  // Fetch assets based on selected category
  const fetchAssetsByCategory = async (category) => {
    setIsLoadingAssets(true);
    try {
      let assets = [];
      
      if (category === 'crypto') {
        // Fetch cryptocurrencies from CoinGecko API
        const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
        const data = await response.json();
        // Limit to top 50 to avoid overwhelmingly large dropdown
        assets = data.slice(0, 50).map(coin => ({
          value: coin.symbol.toUpperCase(),
          label: `${coin.symbol.toUpperCase()} - ${coin.name}`
        }));
      } else if (category === 'equities') {
        // Fetch Indian stocks using Alpha Vantage API
        const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=india&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY}`);
        const data = await response.json();
        if (data.bestMatches) {
          assets = data.bestMatches.map(match => ({
            value: match['1. symbol'],
            label: `${match['1. symbol']} - ${match['2. name']}`
          }));
        }
      } else if (category === 'commodities') {
        // For commodities, we can use a fixed list since there aren't many commonly traded ones
        assets = [
          { value: 'GOLD', label: 'GOLD - Gold' },
          { value: 'SILVER', label: 'SILVER - Silver' },
          { value: 'CRUDE', label: 'CRUDE - Crude Oil' },
          { value: 'NG', label: 'NG - Natural Gas' }
        ];
      } else if (category === 'indices') {
        // For indices, use a fixed list of common indices
        assets = [
          { value: 'NIFTY50', label: 'NIFTY50 - Nifty 50 Index' },
          { value: 'SENSEX', label: 'SENSEX - BSE Sensex' },
          { value: 'BANKNIFTY', label: 'BANKNIFTY - Bank Nifty' },
          { value: 'FINNIFTY', label: 'FINNIFTY - Fin Nifty' }
        ];
      }
      
      setAssetOptions(assets);
      // Reset the selected asset when category changes
      handleChange('asset', '');
    } catch (error) {
      console.error('Error fetching assets:', error);
      setAssetOptions([]);
    } finally {
      setIsLoadingAssets(false);
    }
  };
  
  // Validate prediction through AI APIs
  const validatePrediction = async () => {
    if (!validateReasoningFields()) {
      return;
    }
    
    setIsValidating(true);
    setValidationError("");
    
    try {
      // Send reasoning to Groq API for validation
      const groqResponse = await fetch('/api/validate-reasoning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reasoning: formData.reasoning }),
      });
      
      const groqData = await groqResponse.json();
      setReasoningValidation(groqData);
      
      // Calculate total validation score
      const totalScore = getTotalValidationScore();
      setValidationPercentage(totalScore);
      
      // Check if validation passes threshold (70%)
      if (!validationMeetsThreshold()) {
        setValidationError("Prediction not strong enough. Please add more relevant reasoning or credible documents. Validation requires a score of at least 70%.");
        toast.error("Please strengthen your reasoning or add more credible sources. Validation requires a score of at least 70%.");
      } else {
        // If validation passes, allow moving to the preview tab
        toast.success("Validation successful! You can now proceed to preview.");
      }
      
    } catch (error) {
      console.error('Error validating prediction:', error);
      setValidationError("Error validating prediction. Please try again.");
      toast.error("Error validating prediction. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };
  
  // Validate setup form fields
  const validateSetupFields = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
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
    
    if (activeTab === 'reasoning' && (nextTab === 'preview' || nextTab === 'submit')) {
      if (!validationMeetsThreshold()) {
        toast.error("Please strengthen your reasoning or add more credible sources. Validation requires a score of at least 70%.");
        return;
      }
    }
    
    setActiveTab(nextTab);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.confirmed) {
      toast.error("Please confirm your submission");
      return;
    }

    if (!validationMeetsThreshold()) {
      toast.error("Your prediction must pass validation before submission");
      return;
    }

    try {
      // First save to MongoDB
      const sources = uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        validation: fileValidations[file.id] || { trustLevel: 'unverified', score: 0 }
      }));

      const mongoResponse = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          predictionText: `${formData.asset} ${formData.predictionType === 'priceTarget' ? 'will reach ' + formData.targetPrice : 
                          formData.predictionType === 'percentage' ? 'will change by ' + formData.targetPrice : 
                          'will ' + formData.targetPrice} by ${formData.deadline}`,
          reasoning: formData.reasoning,
          validationScore: validationPercentage,
          sources: sources,
          perplexityCheck: reasoningValidation,
          createdBy: userName,
          createdAt: new Date().toISOString()
        }),
      });

      const mongoData = await mongoResponse.json();
      
      if (!mongoResponse.ok) {
        throw new Error(mongoData.error || 'Error saving to database');
      }

      // Then submit to blockchain
      if (!window.ethereum) {
        toast.error("MetaMask is required for blockchain submission");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.submitForm(
        "general", // Default community since we removed community selection
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
      toast.success("Prediction submitted successfully!");
      
      // Redirect to community hub
      setTimeout(() => {
        router.push('/influencer/community-hub');
      }, 2000);
      
    } catch (err) {
      console.error("Transaction failed:", err);
      toast.error("Transaction failed: " + (err.message || "Unknown error"));
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
  
  // Trigger asset fetching when category changes
  useEffect(() => {
    if (formData.category) {
      fetchAssetsByCategory(formData.category);
    }
  }, [formData.category]);
  
  // File upload handling
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Check file types
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                         'image/png', 'image/jpeg', 'text/plain'];
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast.error('Only PDF, DOCX, PNG, JPG, and TXT files are allowed');
    }
    
    // Process each valid file
    for (const file of validFiles) {
      try {
        // Create a preview for the file
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random().toString(36).substring(2, 9)
        });
        
        setUploadedFiles(prev => [...prev, fileWithPreview]);
        
        // Send the file to Perplexity API for validation
        await validateFileWithPerplexity(fileWithPreview);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error(`Error processing file ${file.name}`);
      }
    }
    
    setIsUploading(false);
    // Clear the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove a file from the uploaded files
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setFileValidations(prev => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
  };
  
  // Validate a file with Perplexity API
  const validateFileWithPerplexity = async (file) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('predictionText', `${formData.asset} ${formData.predictionType === 'priceTarget' ? 'will reach ' + formData.targetPrice : 
                formData.predictionType === 'percentage' ? 'will change by ' + formData.targetPrice : 
                'will ' + formData.targetPrice} by ${formData.deadline}`);
      
      // Send file to Perplexity API via your Next.js API route
      const response = await fetch('/api/validate-document', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error validating document');
      }
      
      // Update file validations with the result
      setFileValidations(prev => ({
        ...prev,
        [file.id]: data
      }));
      
    } catch (error) {
      console.error('Error validating file with Perplexity:', error);
      // Set a default validation with error status
      setFileValidations(prev => ({
        ...prev,
        [file.id]: {
          trustLevel: 'unverified',
          score: 0,
          summary: 'Error validating document',
          error: true
        }
      }));
    }
  };
  
  // Get the total validation score (max 50% from reasoning, max 50% from documents)
  const getTotalValidationScore = () => {
    // Calculate reasoning score component (max 50%)
    const reasoningScore = reasoningValidation ? (reasoningValidation.score / 100) * 50 : 0;
    
    // Calculate documents score component (max 50%)
    let documentsScore = 0;
    const validations = Object.values(fileValidations);
    if (validations.length > 0) {
      // Find the highest scoring document
      const highestScore = Math.max(...validations.map(v => v.score || 0));
      documentsScore = (highestScore / 100) * 50;
    }
    
    return Math.round(reasoningScore + documentsScore);
  };
  
  // Check if the validation meets the threshold
  const validationMeetsThreshold = () => {
    const totalScore = getTotalValidationScore();
    
    // Check if reasoning score is at least 70%
    const reasoningMeetsThreshold = reasoningValidation && (reasoningValidation.score >= 70);
    
    // Check if at least one document has trustLevel = trusted or score >= 70
    const documentsValidations = Object.values(fileValidations);
    const documentsMeetThreshold = documentsValidations.some(v => 
      v.trustLevel === 'trusted' || (v.score && v.score >= 70)
    );
    
    // Both criteria must be met
    return totalScore >= 70 && reasoningMeetsThreshold && documentsMeetThreshold;
  };
   return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 pt-20 p-4 md:p-8">
        {/* Breadcrumb navigation */}
        <div className="container mx-auto mb-6">
          <div className="flex items-center text-gray-400 bg-gray-800/30 px-4 py-2 rounded-lg shadow-sm">
            <Home size={16} className="mr-2" />
            <span className="mr-2">Dashboard</span>
            <ChevronRight size={16} className="mr-2" />
            <span className="text-cyan-400">Create Prediction</span>
            <div className="ml-auto flex items-center bg-gray-800/70 rounded-full px-3 py-1 text-cyan-300">
              <User size={16} className="mr-2" />
              <span>{userName}'s Next Prediction</span>
            </div>
          </div>
        </div>
        
        {/* Progress Steps */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="container mx-auto">
          <TabsList className="grid grid-cols-4 mb-6 shadow-md">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
            {/* LEFT SECTION: Prediction Form */}
            <div className="lg:col-span-2 space-y-6">
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
                          disabled={isLoadingAssets}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            {isLoadingAssets ? (
                              <SelectItem disabled>
                                <div className="flex items-center">
                                  <span className="loader mr-2"></span>
                                  Loading assets...
                                </div>
                              </SelectItem>
                            ) : (
                              assetOptions.length > 0 ? (
                                assetOptions.map(asset => (
                                  <SelectItem key={asset.value} value={asset.value}>
                                    <div className="flex items-center">
                                      <span className="text-gray-400 mr-2">•</span>
                                      {asset.label}
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled>
                                  No assets found for this category
                                </SelectItem>
                              )
                            )}
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
                        
                        {/* Reasoning Validation Results */}
                        {reasoningValidation && (
                          <div className="mt-4 p-3 bg-gray-800/50 rounded-md border border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-white font-medium">Reasoning Validation</h4>
                              <Badge className={reasoningValidation.score >= 70 ? "bg-green-600/30 text-green-400" : "bg-red-600/30 text-red-400"}>
                                Score: {reasoningValidation.score}%
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{reasoningValidation.message}</p>
                            <details className="text-xs text-gray-400">
                              <summary className="cursor-pointer hover:text-white">View detailed feedback</summary>
                              <p className="mt-2 p-2 bg-gray-800 rounded">{reasoningValidation.details}</p>
                            </details>
                          </div>
                        )}
                      </div>
                      
                      {/* File Upload Section */}
                      <div>
                        <label className="block text-white mb-2">Supporting Documents</label>
                        <div className="flex flex-col space-y-4">
                          <div 
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-gray-700 rounded-md p-6 text-center cursor-pointer hover:border-cyan-500 transition-colors"
                          >
                            <input 
                              type="file"
                              multiple
                              accept=".pdf,.docx,.png,.jpg,.jpeg,.txt"
                              onChange={handleFileUpload}
                              ref={fileInputRef}
                              className="hidden"
                            />
                            <Upload size={28} className="mx-auto mb-2 text-gray-500" />
                            <p className="text-gray-400">
                              Drag & drop or click to upload supporting documents
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Supports PDF, DOCX, PNG, JPG, TXT (Max 5MB each)
                            </p>
                          </div>
                          
                          {/* File Upload Progress */}
                          {isUploading && (
                            <div className="flex items-center justify-center p-2 bg-gray-800/60 rounded-md">
                              <Loader2 size={18} className="animate-spin mr-2 text-cyan-400" />
                              <span className="text-cyan-400 text-sm">Processing document...</span>
                            </div>
                          )}
                          
                          {/* Uploaded Files List */}
                          {uploadedFiles.length > 0 && (
                            <div className="space-y-3 mt-3">
                              <h4 className="text-white text-sm font-medium">Uploaded Documents</h4>
                              <div className="divide-y divide-gray-800">
                                {uploadedFiles.map(file => (
                                  <div key={file.id} className="py-3 first:pt-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-start">
                                        {file.type.includes('image') ? (
                                          <img 
                                            src={file.preview} 
                                            alt={file.name} 
                                            className="w-10 h-10 object-cover rounded mr-3"
                                          />
                                        ) : (
                                          <FileText size={24} className="text-gray-400 mr-3" />
                                        )}
                                        <div>
                                          <p className="text-white text-sm truncate max-w-[200px]">{file.name}</p>
                                          <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                      </div>
                                      <button 
                                        type="button"
                                        onClick={() => removeFile(file.id)}
                                        className="text-gray-500 hover:text-red-400"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                    
                                    {/* Document Validation Status */}
                                    {fileValidations[file.id] && (
                                      <div className="mt-2 ml-10 p-2 bg-gray-800/60 rounded text-xs">
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center">
                                            {fileValidations[file.id].trustLevel === 'trusted' ? (
                                              <Shield className="h-3 w-3 text-green-400 mr-1" />
                                            ) : fileValidations[file.id].trustLevel === 'unverified' ? (
                                              <Shield className="h-3 w-3 text-yellow-400 mr-1" />
                                            ) : (
                                              <Shield className="h-3 w-3 text-red-400 mr-1" />
                                            )}
                                            <span className={
                                              fileValidations[file.id].trustLevel === 'trusted' ? 'text-green-400' :
                                              fileValidations[file.id].trustLevel === 'unverified' ? 'text-yellow-400' :
                                              'text-red-400'
                                            }>
                                              {fileValidations[file.id].trustLevel === 'trusted' ? 'Trusted Source' :
                                               fileValidations[file.id].trustLevel === 'unverified' ? 'Unverified Source' :
                                               'Low Quality Source'}
                                            </span>
                                          </div>
                                          <span className="text-gray-400">
                                            Score: {fileValidations[file.id].score || 0}%
                                          </span>
                                        </div>
                                        {fileValidations[file.id].summary && (
                                          <p className="text-gray-300 text-xs mt-1">{fileValidations[file.id].summary}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        {uploadedFiles.map(file => (
                          <div key={file.id} className="flex items-center bg-gray-800 border border-gray-700 rounded-md p-2">
                            <FileText className="text-gray-400 mr-2" />
                            <span className="text-white text-sm flex-1">{file.name}</span>
                            <Button 
                              variant="outline" 
                              onClick={() => removeFile(file.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                        <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md p-2 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                          <Upload className="text-gray-400 mr-2" />
                          <span className="text-white text-sm">Upload Files</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        Upload any relevant documents (PDF, DOCX, PNG, JPG, TXT) to support your prediction
                      </p>

                    </TabsContent>
                    
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
                        onClick={validatePrediction}
                        className="bg-cyan-600 hover:bg-cyan-500"
                        disabled={isValidating}
                      >
                        {isValidating ? (
                          <span className="flex items-center">
                            <Loader2 size={18} className="animate-spin mr-2" /> Validating...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Shield size={18} className="mr-2" /> Validate Prediction
                          </span>
                        )}
                      </Button>
                    </div>
                  
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
                    
                    {validationError && (
                      <Alert className="border-red-500/20 bg-red-500/10 mb-4">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertTitle className="text-red-400">Validation Failed</AlertTitle>
                        <AlertDescription className="text-red-200">
                          {validationError}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {validationPercentage > 0 && !validationError && (
                      <Alert className="border-green-500/20 bg-green-500/10 mb-4">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <AlertTitle className="text-green-400">Validation Score: {validationPercentage}%</AlertTitle>
                        <AlertDescription className="text-green-200">
                          Your prediction is well-supported and ready for review.
                        </AlertDescription>
                      </Alert>
                    )}
                    
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
            
            {/* RIGHT SECTION: Validation Result & Preview */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Validation Result Card */}
            <Card className="bg-gray-900/60 border-gray-800 shadow-lg overflow-hidden">
              <CardHeader className="bg-gray-800/50 border-b border-gray-800/50">
                <CardTitle className="text-lg text-white flex items-center">
                  <CheckCircle size={18} className="mr-2 text-cyan-400" />
                  Validation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {isValidating ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-cyan-600/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-cyan-300">Analyzing prediction...</p>
                  </div>
                ) : validationPercentage > 0 ? (
                  <div className="space-y-4">
                    <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${
                          validationPercentage >= 80 ? 'bg-green-500' : 
                          validationPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${validationPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Score:</span>
                      <span className={`font-medium ${
                        validationPercentage >= 80 ? 'text-green-400' : 
                        validationPercentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{validationPercentage}%</span>
                    </div>
                    
                    {validationError ? (
                      <Alert className="border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertTitle className="text-red-400">Validation Failed</AlertTitle>
                        <AlertDescription className="text-red-200 text-sm">
                          {validationError}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="border-green-500/20 bg-green-500/10">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <AlertTitle className="text-green-400">Prediction Validated</AlertTitle>
                        <AlertDescription className="text-green-200 text-sm">
                          Your prediction is well-supported by data and reasoning.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-400 text-sm">
                    <p>Submit your reasoning to get validation results</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Live Preview */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 shadow-lg">
              <h3 className="text-lg font-medium text-white mb-2">Live Preview</h3>
              <p className="text-gray-400 text-sm">This is how your prediction will appear after approval</p>
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
            <div className="lg:hidden fixed bottom-4 right-4 left-4 z-10">
              <Button 
                type="button" 
                onClick={() => validatePrediction()}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg"
              >
                Validate Prediction
              </Button>
            </div>
          </div> {/* Closing RIGHT SECTION */}
          </div> {/* Closing grid grid-cols-1 lg:grid-cols-3 gap-6 */}
        </Tabs> 
      </div> 
    </>
  );
};

export default CreatePredictionPage;