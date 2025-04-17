import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Info, ChevronRight, ArrowLeft } from 'lucide-react';

export default function ConnectWallet() {
  const [isPending, setIsPending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);

  // Check if MetaMask is installed and if wallet was previously connected
//   useEffect(() => {
//     // Check localStorage for previously connected account
//     const savedAccount = localStorage.getItem('connectedWalletAddress');
//     if (savedAccount) {
//       setAccount(savedAccount);
//       setIsConnected(true);
//     }

//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", handleAccountsChanged);
//       window.ethereum.on("chainChanged", handleChainChanged);
//     }
//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
//         window.ethereum.removeListener("chainChanged", handleChainChanged);
//       }
//     };
//   }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // clear localStorage when disconnected
      localStorage.removeItem('connectedWalletAddress');
      setAccount(null);
      setIsConnected(false);
    } else {
      
      localStorage.setItem('connectedWalletAddress', accounts[0]);
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

//   const handleChainChanged = (chainId) => {
//     console.log(`Chain changed to ${chainId}`);
//     // You can also switch networks in MetaMask based on the chainId
//   };

  const connectWallet = async () => {
    setIsPending(true);
    
    if (window.ethereum) {
      try {
        const [selectedAccount] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        
        localStorage.setItem('connectedWalletAddress', selectedAccount);
        
        setAccount(selectedAccount);
        setIsConnected(true);
        setIsPending(false);
 
        setTimeout(() => {
          window.location.href = '/role-selection';
        }, 1000);
      } catch (error) {
        console.error("Connection failed", error);
        setIsPending(false);
      }
    } else {
      alert("Please install MetaMask!");
      setIsPending(false);
    }
  };

  // address for display 
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* go back to Dashboard button */}
<div className="absolute top-4 left-4 z-20">
 <Link href="/">
  <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-blue-400">
   <ArrowLeft className="w-5 h-5" />
   <span>Back to Dashboard</span>
  </Button>
 </Link>
</div>
      <Head>
        <title>Connect Wallet | Inverstra</title>
        <meta name="description" content="Connect your wallet to join Inverstra's decentralized investment platform" />
      </Head>
      
      {/* abstract background elements to add a little pop of colour*/}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl"></div>
      </div>
      
      {/* grid lines overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
      
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-xl relative z-10">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Inverstra
              </span>
            </div>
            
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-900/30 flex items-center justify-center">
                <img src="/MetaMask_Fox.svg.png" alt="MetaMask" className="h-14 w-14" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-white">Let's get started!</h1>
            <p className="text-slate-300 mb-8">
              Connect your wallet to join the decentralized investment revolution.
            </p>
            
            <Button 
              onClick={connectWallet} 
              disabled={isPending || isConnected}
              className="w-full py-6 bg-gradient-to-r from-orange-600 to-blue-800 hover:from-orange-400 hover:to-orange-500 text-white rounded-xl font-medium text-lg transition-all"
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-b-2 rounded-full border-white"></div>
                  Connecting...
                </div>
              ) : isConnected ? (
                <div className="flex items-center">
                  <div className="mr-2 h-5 w-5 text-green-400">✓</div>
                  Connected! {formatAddress(account)}
                </div>
              ) : (
                <div className="flex items-center">
                  <img src="/MetaMask_Fox.svg.png" alt="MetaMask" className="h-5 w-5 mr-2" />
                  Connect with MetaMask
                </div>
              )}
            </Button>
            
            {isConnected && (
              <div className="mt-4 w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Connected Wallet:</p>
                <p className="text-xs font-mono text-slate-300 break-all">{account}</p>
              </div>
            )}
            
            <div className="flex items-center mt-6 text-slate-400 text-sm">
              <Info className="w-4 h-4 mr-2 text-blue-400" />
              <p>We'll never ask for your private key. Inverstra is 100% non-custodial.</p>
            </div>
            
            <div className="w-full mt-12 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500">
              <div className="hover:text-blue-400 transition">
                Terms of use
              </div>
              <div className="hover:text-blue-400 transition">
                How Inverstra works
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}