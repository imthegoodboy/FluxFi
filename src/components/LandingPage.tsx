import { useState } from 'react';
import {
  TrendingUp,
  Zap,
  Shield,
  DollarSign,
  ArrowRight,
  Coins,
  BarChart3,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { connectWallet } from '../services/walletService';
import { AuthModal } from './AuthModal';

interface LandingPageProps {
  onConnect: (address: string) => void;
  onNavigate?: (page: string) => void;
}

export function LandingPage({ onConnect, onNavigate }: LandingPageProps) {
  const [connecting, setConnecting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const connection = await connectWallet();
      setWalletAddress(connection.address);
      setShowAuthModal(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleAuthComplete = () => {
    setShowAuthModal(false);
    onConnect(walletAddress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="border-b border-white border-opacity-10 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FluxFi</h1>
                <p className="text-xs text-blue-300">AI-Powered Yield Router</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {onNavigate && (
                <>
                  <button
                    onClick={() => onNavigate('features')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => onNavigate('help')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help
                  </button>
                </>
              )}
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg disabled:opacity-50"
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">
              Built on Polygon • Powered by SideShift
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Turn Your Idle Crypto
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Into Automatic Income
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            FluxFi automatically routes your BTC, ETH, SOL, and other assets into
            the highest-yielding DeFi vaults on Polygon. AI-optimized, fully
            automated, withdraw anytime.
          </p>

          <p className="text-lg text-blue-300 max-w-2xl mx-auto mb-8 flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Cross-chain swaps powered by SideShift • Polygon scaling for speed</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-xl hover:shadow-2xl flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{connecting ? 'Connecting...' : 'Get Started'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-20 transition-all">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
              <Coins className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Polygon Scaling
            </h3>
            <p className="text-gray-300">
              We use Polygon, a Layer 2 scaling solution, for fast transactions, low fees, and access to mature DeFi protocols like Aave and Yearn.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-20 transition-all">
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              SideShift Bridge
            </h3>
            <p className="text-gray-300">
              SideShift API enables instant cross-chain swaps from any blockchain to Polygon USDC, making deposits seamless and trustless.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-20 transition-all">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              AI Optimization
            </h3>
            <p className="text-gray-300">
              Our AI continuously monitors and rebalances to maximize your yield, automatically moving funds to the best-performing vaults.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-blue-900 to-cyan-900 bg-opacity-50 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white mb-6">
              Why Use Polygon?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-900">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Ultra-Low Fees</p>
                  <p className="text-gray-300 text-sm">Transactions cost mere cents, not dollars</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-900">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Lightning Fast</p>
                  <p className="text-gray-300 text-sm">Transactions settle in seconds, not minutes</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-900">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Top DeFi Protocols</p>
                  <p className="text-gray-300 text-sm">Home to Aave, Yearn, Quickswap, and more</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-900">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Ethereum Security</p>
                  <p className="text-gray-300 text-sm">Backed by Ethereum's robust security</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-emerald-900 bg-opacity-50 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white mb-6">
              How SideShift Works
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-900">1</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">You Choose Asset</p>
                  <p className="text-gray-300 text-sm">Select BTC, ETH, SOL, or any supported token</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-900">2</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Instant Swap</p>
                  <p className="text-gray-300 text-sm">SideShift swaps it to Polygon USDC instantly</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-900">3</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Deposit to Vault</p>
                  <p className="text-gray-300 text-sm">We deposit into the highest-yield DeFi vault</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-900">4</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Start Earning</p>
                  <p className="text-gray-300 text-sm">Your funds immediately start generating yield</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Example: 0.5 BTC Activation
          </h3>
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Original Asset</p>
              <p className="text-white text-xl font-bold">0.5 BTC</p>
              <p className="text-blue-100 text-xs">~$22,500</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Swapped to</p>
              <p className="text-white text-xl font-bold">USDC</p>
              <p className="text-blue-100 text-xs">Polygon</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Annual Yield</p>
              <p className="text-white text-xl font-bold">$1,170</p>
              <p className="text-blue-100 text-xs">5.2% APY</p>
            </div>
          </div>
          <p className="text-blue-100">All automatically handled by FluxFi. Withdraw anytime to get your BTC back.</p>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthComplete}
        walletAddress={walletAddress}
      />
    </div>
  );
}
