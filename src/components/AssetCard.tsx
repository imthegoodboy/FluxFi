import { useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { DetectedAsset } from '../services/walletService';
import { Vault, getBestVault } from '../services/vaultService';
import { ActivateYieldModal } from './ActivateYieldModal';

interface AssetCardProps {
  asset: DetectedAsset;
  vaults: Vault[];
  onActivated: () => void;
}

export function AssetCard({ asset, vaults, onActivated }: AssetCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [bestVault, setBestVault] = useState<Vault | null>(null);

  const handleActivateClick = async () => {
    const vault = await getBestVault('USDC');
    setBestVault(vault);
    setShowModal(true);
  };

  const potentialAnnualEarnings = (asset.usdValue * asset.suggestedApy) / 100;

  return (
    <>
      <div className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 hover:border-orange-300 transition-all hover:shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">
                {asset.amount} {asset.token}
              </span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                Idle
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              ${asset.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{asset.chain}</p>
          </div>
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>

        <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-4 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Potential APY</span>
            <span className="text-lg font-bold text-green-600">
              {asset.suggestedApy.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Annual Earnings</span>
            <span className="text-sm font-semibold text-gray-900">
              ${potentialAnnualEarnings.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleActivateClick}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Zap className="w-5 h-5" />
          <span>Activate Yield</span>
        </button>
      </div>

      {showModal && bestVault && (
        <ActivateYieldModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          asset={asset}
          vault={bestVault}
          onSuccess={onActivated}
        />
      )}
    </>
  );
}
