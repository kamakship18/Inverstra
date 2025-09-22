import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, LightbulbIcon, ChevronRight, ArrowLeft, Home } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
    } else {
      window.location.href = '/wallet-connect';
    }
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Navbar />

      <Head>
        <title>Choose Your Role | Inverstra</title>
        <meta name="description" content="Choose how you want to engage with the Inverstra platform" />
      </Head>

      {/* Background pastel elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-200/30 dark:bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pink-200/30 dark:bg-cyan-500/5 blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-10 relative z-10 mt-12">
        <div className="flex items-center justify-center mb-2">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Inverstra
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          What brings you to Inverstra?
        </h1>
        <p className="text-gray-600 dark:text-slate-300 max-w-lg">
          Choose how you want to engage with the platform.
        </p>
      </div>

      {/* Role cards */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-4xl relative z-10">
        {/* Learner */}
        <Card
          className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border hover:border-blue-400/50 transition-all cursor-pointer flex-1
          ${selectedRole === 'learner' ? 'border-blue-400/50 shadow-lg shadow-blue-400/20' : 'border-gray-200 dark:border-slate-800'}`}
          onClick={() => handleRoleSelect('learner')}
        >
          <CardContent className="p-8 h-full flex flex-col">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">I'm a Learner</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-8 flex-grow">
              Explore investment tips. Learn from community-approved predictions. Track risk with AI.
            </p>
            <Link href="/learner/profile-setup">
              <Button
                className={`justify-between w-full bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-600 dark:to-blue-700 hover:opacity-90
                ${selectedRole === 'learner' ? 'from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600' : ''}`}
                disabled={selectedRole === 'influencer'}
              >
                <span>Continue as Learner</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-px h-40 bg-gray-300 dark:bg-slate-700/50 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full text-gray-500 dark:text-slate-400">
              or
            </div>
          </div>
        </div>

        {/* Mobile divider */}
        <div className="md:hidden flex items-center justify-center py-2">
          <span className="text-gray-500 dark:text-slate-400">or</span>
        </div>

        {/* Influencer */}
        <Card
          className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border hover:border-purple-400/50 transition-all cursor-pointer flex-1
          ${selectedRole === 'influencer' ? 'border-purple-400/50 shadow-lg shadow-purple-400/20' : 'border-gray-200 dark:border-slate-800'}`}
          onClick={() => handleRoleSelect('influencer')}
        >
          <CardContent className="p-8 h-full flex flex-col">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <LightbulbIcon className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">I'm an Influencer</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-8 flex-grow">
              Share your strategies, propose predictions to your community, build your Web3 rep.
            </p>

            <Link href="/influencer/profile-setup">
              <Button
                className={`justify-between w-full bg-gradient-to-r from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 hover:opacity-90
                ${selectedRole === 'influencer' ? 'from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600' : ''}`}
                disabled={selectedRole === 'learner'}
              >
                <span>Continue as Influencer</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 dark:text-slate-500 text-sm relative z-10">
        <p>Already connected: {walletAddress ? formatAddress(walletAddress) : 'Not connected'}</p>
      </footer>
    </div>
  );
}
