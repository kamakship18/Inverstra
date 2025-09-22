import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Info, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

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

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Navbar />

      <Head>
        <title>Connect Wallet | Inverstra</title>
        <meta name="description" content="Connect your wallet to join Inverstra's decentralized investment platform" />
      </Head>

      {/* Soft pastel abstract background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-200/30 dark:bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pink-200/30 dark:bg-cyan-500/5 blur-3xl"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

      <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-800 shadow-xl relative z-10">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Inverstra
              </span>
            </div>

            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <img src="/MetaMask_Fox.svg.png" alt="MetaMask" className="h-14 w-14" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Let's get started!</h1>
            <p className="text-gray-600 dark:text-slate-300 mb-8">
              Connect your wallet to join the decentralized investment revolution.
            </p>

            <Button
              onClick={connectWallet}
              disabled={isPending || isConnected}
              className="w-full py-6 bg-gradient-to-r from-orange-300 to-blue-400 dark:from-orange-600 dark:to-blue-800 hover:opacity-90 text-gray-900 dark:text-white rounded-xl font-medium text-lg transition-all"
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-b-2 rounded-full border-white"></div>
                  Connecting...
                </div>
              ) : isConnected ? (
                <div className="flex items-center">
                  <div className="mr-2 h-5 w-5 text-green-500">✓</div>
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
              <div className="mt-4 w-full p-3 rounded-lg bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Connected Wallet:</p>
                <p className="text-xs font-mono text-gray-700 dark:text-slate-300 break-all">{account}</p>
              </div>
            )}

            <div className="flex items-center mt-6 text-gray-500 dark:text-slate-400 text-sm">
              <Info className="w-4 h-4 mr-2 text-blue-400" />
              <p>We'll never ask for your private key. Inverstra is 100% non-custodial.</p>
            </div>

            <div className="w-full mt-12 pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-between text-xs text-gray-500 dark:text-slate-500">
              <div className="hover:text-blue-500 transition">Terms of use</div>
              <div className="hover:text-blue-500 transition">How Inverstra works</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
