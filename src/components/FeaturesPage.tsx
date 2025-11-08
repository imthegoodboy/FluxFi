import { ArrowRight, Zap, Shield, TrendingUp, Coins, Cpu, Gauge, Lock } from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
}

export function FeaturesPage({ onNavigate }: FeaturesPageProps) {
  const features = [
    {
      icon: Coins,
      title: "Cross-Chain Support",
      description: "Deposit from BTC, ETH, SOL, or any major blockchain. We handle the cross-chain complexity for you.",
      details: ["Bitcoin", "Ethereum", "Solana", "Polygon", "BSC"],
    },
    {
      icon: Zap,
      title: "Instant Swapping",
      description: "Powered by SideShift API, convert assets to USDC on Polygon in seconds with minimal slippage.",
      details: ["0.5% swap fee", "Instant settlement", "Secure bridging"],
    },
    {
      icon: TrendingUp,
      title: "AI Yield Optimization",
      description: "Our AI monitors 24/7 and automatically reallocates your funds to the highest-yielding vaults.",
      details: ["Real-time monitoring", "Auto-rebalancing", "Risk assessment"],
    },
    {
      icon: Cpu,
      title: "Multi-Protocol Integration",
      description: "Access yield from Aave, Yearn, Quickswap, and Beefy - all integrated seamlessly.",
      details: ["Aave 5.2% APY", "Yearn 4.8% APY", "Quickswap 6.5% APY", "Beefy 5.9% APY"],
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Your funds stay in audited smart contracts. Your private keys never leave your wallet.",
      details: ["Non-custodial", "Audited contracts", "Transparent", "Insurance ready"],
    },
    {
      icon: Lock,
      title: "Anytime Withdrawal",
      description: "No lock-ups or restrictions. Withdraw your funds instantly back to your original token.",
      details: ["No lock period", "Auto-swap back", "Direct to wallet", "No hidden fees"],
    },
    {
      icon: Gauge,
      title: "Real-Time Analytics",
      description: "Track your portfolio performance, earnings, and APY changes in real-time.",
      details: ["Live APY tracking", "Earnings dashboard", "Performance charts"],
    },
    {
      icon: TrendingUp,
      title: "Passive Income",
      description: "Earn yield automatically while you sleep. Compound your returns effortlessly.",
      details: ["Auto-compounding", "24/7 earning", "No manual trading"],
    },
  ];

  const protocols = [
    { name: "Polygon", description: "Layer 2 scaling solution for Ethereum. Fast, cheap transactions.", icon: "⚡" },
    { name: "Aave", description: "Leading decentralized lending protocol. Safety-focused.", icon: "🏦" },
    { name: "Yearn", description: "Yield farming aggregator. Optimized strategies.", icon: "🚜" },
    { name: "SideShift", description: "Cross-chain liquidity bridge. Instant swaps.", icon: "🌉" },
    { name: "Quickswap", description: "DEX on Polygon. Liquidity pools with APY.", icon: "⚙️" },
    { name: "Beefy", description: "Yield farming optimizer. Auto-compounding.", icon: "🐮" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FluxFi</h1>
              </div>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Powerful Features</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to transform idle crypto into passive income
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-1">
                  {feature.details.map((detail, i) => (
                    <p key={i} className="text-xs text-gray-500 flex items-center space-x-2">
                      <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                      <span>{detail}</span>
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Supported Protocols
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocols.map((protocol, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <div className="text-4xl mb-3">{protocol.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {protocol.name}
                </h3>
                <p className="text-sm text-gray-600">{protocol.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Connect Wallet</p>
                  <p className="text-sm text-gray-600">Link your wallet from any blockchain</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Activate Yield</p>
                  <p className="text-sm text-gray-600">Choose an asset and activate automatic yield</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Sit Back & Earn</p>
                  <p className="text-sm text-gray-600">AI optimizes your yield 24/7</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Withdraw Anytime</p>
                  <p className="text-sm text-gray-600">Get your funds back to your original token</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Why Choose FluxFi?</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Zap className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>AI-powered optimization for maximum returns</span>
              </li>
              <li className="flex items-start space-x-3">
                <Shield className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>Fully non-custodial and secure</span>
              </li>
              <li className="flex items-start space-x-3">
                <Coins className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>Multi-chain support from day one</span>
              </li>
              <li className="flex items-start space-x-3">
                <Lock className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>No lock-ups or restrictions</span>
              </li>
              <li className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>Transparent analytics and tracking</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-gray-600 mb-8">
            Transform your idle crypto into automatic passive income today
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
