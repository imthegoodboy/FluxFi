import { TrendingUp, DollarSign, Activity } from 'lucide-react';

interface PortfolioOverviewProps {
  totalValue: number;
  totalEarnings: number;
  activeDeposits: number;
}

export function PortfolioOverview({
  totalValue,
  totalEarnings,
  activeDeposits,
}: PortfolioOverviewProps) {
  const avgApy = totalValue > 0 ? (totalEarnings / totalValue) * 365 * 100 : 0;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
            Total Value
          </span>
        </div>
        <p className="text-3xl font-bold mb-1">
          ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
        <p className="text-blue-100 text-sm">Portfolio Balance</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
            +{avgApy.toFixed(2)}%
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">
          ${totalEarnings.toFixed(2)}
        </p>
        <p className="text-gray-500 text-sm">Total Earnings</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Active
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{activeDeposits}</p>
        <p className="text-gray-500 text-sm">
          {activeDeposits === 1 ? 'Position' : 'Positions'}
        </p>
      </div>
    </div>
  );
}
