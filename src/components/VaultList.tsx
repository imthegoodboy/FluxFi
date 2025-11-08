import { Shield, TrendingUp, DollarSign } from 'lucide-react';
import { Vault } from '../services/vaultService';

interface VaultListProps {
  vaults: Vault[];
}

export function VaultList({ vaults }: VaultListProps) {
  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-600 bg-green-100';
    if (score <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 3) return 'Low Risk';
    if (score <= 6) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Available Vaults</h2>
          <p className="text-sm text-gray-500">
            {vaults.length} protocols on Polygon
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {vaults.map((vault) => (
          <div
            key={vault.id}
            className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {vault.name}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {vault.protocol}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                  vault.risk_score
                )}`}
              >
                {getRiskLabel(vault.risk_score)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center space-x-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">APY</span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {vault.current_apy.toFixed(2)}%
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-1 mb-1">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">TVL</span>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  ${(vault.tvl / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Token: {vault.token}</span>
              <span>Chain: {vault.chain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
