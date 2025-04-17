// pages/role-selection.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, LightbulbIcon, ChevronRight, ArrowLeft } from 'lucide-react';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Get wallet address from localStorage on component mount
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
    } else {
      // Redirect to wallet connect page if no wallet is connected
      window.location.href = '/connect-wallet';
    }
  }, []);
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Head>
        <title>Choose Your Role | Inverstra</title>
        <meta name="description" content="Choose how you want to engage with the Inverstra platform" />
      </Head>
      
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl"></div>
      </div>
      
      {/* Grid lines overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
      
      {/* Back link positioned at top right */}
      <div className="absolute top-6 right-6 z-20"> 
        <Link href="/wallet-connect" className="text-slate-400 hover:text-white flex items-center text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to wallet connection
        </Link>
      </div>
      
      <div className="text-center mb-10 relative z-10 mt-12">
        <div className="flex items-center justify-center mb-2">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Inverstra
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">What brings you to Inverstra?</h1>
        <p className="text-slate-300 max-w-lg">
          Choose how you want to engage with the platform.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-4xl relative z-10">
        <Card 
          className={`bg-slate-900/80 backdrop-blur-sm border hover:border-blue-500/50 transition-all cursor-pointer flex-1
          ${selectedRole === 'learner' ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-slate-800'}`}
          onClick={() => handleRoleSelect('learner')}
        >
          <CardContent className="p-8 h-full flex flex-col">
            <div className="bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-900/50 transition-colors">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">I'm a Learner</h2>
            <p className="text-slate-300 mb-8 flex-grow">
              Explore investment tips. Learn from community-approved predictions. Track risk with AI.
            </p>
            <Link href="/learner/profile-setup"> 
            <Button 
              className={`justify-between w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
              ${selectedRole === 'learner' ? 'from-blue-500 to-blue-600' : ''}`}
              disabled={selectedRole === 'influencer'}
            >
              <span>Continue as Learner</span>
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Only show divider on desktop */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-px h-40 bg-slate-700/50 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 py-2 rounded-full text-slate-400">
              or
            </div>
          </div>
        </div>
        
        {/* Mobile divider */}
        <div className="md:hidden flex items-center justify-center py-2">
          <span className="text-slate-400">or</span>
        </div>
        
        <Card 
          className={`bg-slate-900/80 backdrop-blur-sm border hover:border-purple-500/50 transition-all cursor-pointer flex-1
          ${selectedRole === 'influencer' ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' : 'border-slate-800'}`}
          onClick={() => handleRoleSelect('influencer')}
        >
          <CardContent className="p-8 h-full flex flex-col">
            <div className="bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-900/50 transition-colors">
              <LightbulbIcon className="w-8 h-8 text-purple-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">I'm an Influencer</h2>
            <p className="text-slate-300 mb-8 flex-grow">
              Share your strategies, propose predictions to your community, build your Web3 rep.
            </p>
            
            <Link href="/influencer/profile-setup">
            <Button 
              className={`justify-between w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600
              ${selectedRole === 'influencer' ? 'from-purple-500 to-purple-600' : ''}`}
              disabled={selectedRole === 'learner'}
            >
              <span>Continue as Influencer</span>
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <footer className="mt-12 text-center text-slate-500 text-sm relative z-10">
        <p>Already connected: {walletAddress ? formatAddress(walletAddress) : 'Not connected'}</p>
      </footer>
    </div>
  );
}