import { useEffect, useState } from 'react';
import { TrendingUp, Wallet, DollarSign, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DetectedAsset, detectWalletAssets } from '../services/walletService';
import { Vault, getActiveVaults } from '../services/vaultService';
import { supabase } from '../lib/supabase';
import { AssetCard } from './AssetCard';
import { VaultList } from './VaultList';
import { PortfolioOverview } from './PortfolioOverview';
import { ChatBot } from './ChatBot';

interface DashboardProps {
  walletAddress: string;
}

export function Dashboard({ walletAddress }: DashboardProps) {
  const { signOut } = useAuth();
  const [assets, setAssets] = useState<DetectedAsset[]>([]);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    loadData();
  }, [walletAddress]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [detectedAssets, activeVaults] = await Promise.all([
        detectWalletAssets(walletAddress),
        getActiveVaults(),
      ]);

      setAssets(detectedAssets);
      setVaults(activeVaults);

      const total = detectedAssets.reduce((sum, asset) => sum + asset.usdValue, 0);
      setTotalValue(total);

      const { data: userDeposits } = await supabase
        .from('deposits')
        .select('*')
        .eq('status', 'active');

      if (userDeposits) {
        setDeposits(userDeposits);

        const earnings = userDeposits.reduce((sum, deposit) => {
          const days = Math.floor(
            (Date.now() - new Date(deposit.deposited_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const vault = activeVaults.find((v) => v.id === deposit.vault_id);
          if (vault) {
            return sum + (deposit.converted_amount * (vault.current_apy / 100 / 365) * days);
          }
          return sum;
        }, 0);

        setTotalEarnings(earnings);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  const idleAssets = assets.filter((a) => a.status === 'idle');
  const activeAssets = assets.filter((a) => a.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FluxFi</h1>
                <p className="text-xs text-gray-500">Cross-Chain Yield Router</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <PortfolioOverview
              totalValue={totalValue}
              totalEarnings={totalEarnings}
              activeDeposits={deposits.length}
            />

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Assets
                    </h2>
                    <p className="text-sm text-gray-500">
                      {idleAssets.length} idle {idleAssets.length === 1 ? 'asset' : 'assets'} detected
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Wallet</p>
                  <p className="text-sm font-mono text-gray-700">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>

              {idleAssets.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {idleAssets.map((asset, index) => (
                    <AssetCard
                      key={index}
                      asset={asset}
                      vaults={vaults}
                      onActivated={loadData}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">All assets are earning yield</p>
                </div>
              )}
            </div>

            {deposits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Active Positions
                    </h2>
                    <p className="text-sm text-gray-500">
                      Earning ${totalEarnings.toFixed(2)} so far
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {deposits.map((deposit) => {
                    const vault = vaults.find((v) => v.id === deposit.vault_id);
                    if (!vault) return null;

                    const days = Math.floor(
                      (Date.now() - new Date(deposit.deposited_at).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const earnings =
                      deposit.converted_amount *
                      (vault.current_apy / 100 / 365) *
                      days;

                    return (
                      <div
                        key={deposit.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {deposit.original_amount} {deposit.original_token}
                            </p>
                            <p className="text-sm text-gray-500">{vault.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              +${earnings.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {vault.current_apy.toFixed(2)}% APY
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{days} days active</span>
                          <span>
                            ${deposit.converted_amount.toFixed(2)} in vault
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <VaultList vaults={vaults} />
          </div>
        )}
      </div>

      <ChatBot />
    </div>
  );
}
