import { useState } from 'react';
import { ChevronDown, TrendingUp, Search, Mail, MessageCircle } from 'lucide-react';

interface HelpPageProps {
  onNavigate: (page: string) => void;
}

export function HelpPage({ onNavigate }: HelpPageProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "What is FluxFi?",
      answer: "FluxFi is an AI-powered cross-chain yield router that automatically converts idle crypto assets into passive income by depositing them into high-yield DeFi vaults on Polygon.",
    },
    {
      question: "How do I get started?",
      answer: "Simply connect your wallet, sign up with an email, and click 'Activate Yield' on any idle asset. FluxFi will handle the rest - swapping to USDC and depositing into the best vault automatically.",
    },
    {
      question: "Which assets do you support?",
      answer: "We support BTC, ETH, SOL, MATIC, and USDC from Bitcoin, Ethereum, Solana, Polygon, and BSC networks. More assets will be added regularly.",
    },
    {
      question: "Is my money safe?",
      answer: "Yes! FluxFi is non-custodial, meaning your private keys stay in your wallet. We only use audited smart contracts from established protocols like Aave and Yearn.",
    },
    {
      question: "Can I withdraw anytime?",
      answer: "Absolutely! There are no lock-ups. You can withdraw your funds anytime, and they'll be automatically swapped back to your original token and sent to your wallet.",
    },
    {
      question: "What fees does FluxFi charge?",
      answer: "FluxFi charges a 0.5% swap fee when converting to USDC, and 10% of the yields earned. No deposit or withdrawal fees.",
    },
    {
      question: "What is the APY?",
      answer: "APY varies by vault. Currently: Aave 5.2%, Yearn 4.8%, Quickswap 6.5%, Beefy 5.9%. These rates fluctuate based on market conditions.",
    },
    {
      question: "What is Polygon and why do we use it?",
      answer: "Polygon is a Layer 2 scaling solution for Ethereum that enables fast, low-cost transactions. We use it because it has mature DeFi protocols with high yields and low fees.",
    },
    {
      question: "What is SideShift and why do we use it?",
      answer: "SideShift is a cross-chain liquidity aggregator that instantly converts assets from any blockchain to Polygon USDC. We use it to provide seamless, cross-chain support.",
    },
    {
      question: "How does the AI optimization work?",
      answer: "Our AI continuously monitors APY rates across all vaults. If a better opportunity appears, it automatically withdraws from the current vault and moves your funds to maximize returns.",
    },
    {
      question: "What are the risks?",
      answer: "DeFi involves risks including smart contract vulnerabilities, market volatility, and protocol risks. We recommend starting with small amounts and understanding the protocols.",
    },
    {
      question: "How often does the AI rebalance?",
      answer: "The AI monitors rates continuously and rebalances when it identifies opportunities with >1% better APY, accounting for fees.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about FluxFi
          </p>
        </div>

        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-3 mb-16">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() =>
                  setExpandedFAQ(expandedFAQ === index ? null : index)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-left font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedFAQ === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFAQ === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
            <MessageCircle className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Live Chat Support</h3>
            <p className="text-blue-100 mb-4">
              Need help? Use our AI chatbot for instant support on any FluxFi question.
            </p>
            <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Open Chat
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <Mail className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">
              For detailed issues, reach out to our support team.
            </p>
            <a
              href="mailto:support@fluxfi.app"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              support@fluxfi.app
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Concepts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                What is Polygon?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Polygon is a Layer 2 scaling solution for Ethereum that dramatically reduces transaction costs and increases speed. We use Polygon because it hosts mature DeFi protocols (Aave, Yearn, Quickswap) with high yields and minimal fees.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Why it matters:</strong> Your transactions are fast and cheap, and you earn the best yields available in DeFi.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                What is SideShift API?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                SideShift is a cross-chain liquidity aggregator that enables instant, trustless swaps between any blockchain. We use it to convert your BTC, ETH, SOL, or any asset into Polygon USDC automatically.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Why it matters:</strong> You can deposit from any chain without manual bridges or swaps - FluxFi handles it all.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                What is APY?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                APY (Annual Percentage Yield) is the yearly return on your investment, accounting for compounding. For example, 5% APY means $100 becomes $105 in one year.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Why it matters:</strong> Higher APY = more passive income for you.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                What is DeFi?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                DeFi (Decentralized Finance) is financial services built on blockchain without intermediaries. Aave and Yearn are DeFi protocols where people lend and borrow assets to earn yield.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Why it matters:</strong> DeFi protocols offer yields 10-100x higher than traditional finance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
