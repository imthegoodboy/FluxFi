import { useState } from 'react';
import { X, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import { DetectedAsset } from '../services/walletService';
import { Vault, depositToVault } from '../services/vaultService';
import { createSwapOrder } from '../services/sideshiftService';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ActivateYieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: DetectedAsset;
  vault: Vault;
  onSuccess: () => void;
}

type Step = 'confirm' | 'swapping' | 'depositing' | 'complete';

export function ActivateYieldModal({
  isOpen,
  onClose,
  asset,
  vault,
  onSuccess,
}: ActivateYieldModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('confirm');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleActivate = async () => {
    if (!user) {
      setError('Please sign in to continue');
      return;
    }

    try {
      setError('');
      setStep('swapping');

      const swapOrder = await createSwapOrder(
        asset.token,
        'USDC',
        asset.amount,
        asset.walletAddress
      );

      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'swap_in',
        from_token: asset.token,
        to_token: 'USDC',
        amount: asset.amount,
        tx_hash: swapOrder.orderId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

      setStep('depositing');

      const depositResult = await depositToVault(
        user.id,
        vault.id,
        swapOrder.settleAmount,
        'USDC'
      );

      const { data: deposit } = await supabase
        .from('deposits')
        .insert({
          user_id: user.id,
          original_token: asset.token,
          original_amount: asset.amount,
          original_chain: asset.chain,
          converted_token: 'USDC',
          converted_amount: swapOrder.settleAmount,
          vault_id: vault.id,
          status: 'active',
          deposited_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (deposit) {
        await supabase.from('transactions').insert({
          user_id: user.id,
          deposit_id: deposit.id,
          type: 'deposit',
          from_token: 'USDC',
          to_token: 'USDC',
          amount: swapOrder.settleAmount,
          tx_hash: depositResult.txHash,
          status: 'completed',
          completed_at: new Date().toISOString(),
        });
      }

      setStep('complete');

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Activation failed:', err);
      setError(err.message || 'Failed to activate yield');
      setStep('confirm');
    }
  };

  const estimatedUSDC = asset.usdValue * 0.995;
  const annualEarnings = (estimatedUSDC * vault.current_apy) / 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={step !== 'confirm' && step !== 'complete'}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Activate Yield
        </h2>

        {step === 'confirm' && (
          <>
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">You're depositing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {asset.amount} {asset.token}
                </p>
                <p className="text-sm text-gray-500">
                  ≈ ${asset.usdValue.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-center py-2">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Step 1: Swap</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asset.token} → USDC (Polygon)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Via SideShift • Est. {estimatedUSDC.toFixed(2)} USDC
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Step 2: Deposit</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vault.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    APY: {vault.current_apy.toFixed(2)}% • {vault.protocol}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">
                  Estimated Annual Earnings
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${annualEarnings.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  That's ${(annualEarnings / 12).toFixed(2)} per month
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleActivate}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md"
              >
                Activate Yield
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {(step === 'swapping' || step === 'depositing') && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {step === 'swapping' && 'Swapping to USDC...'}
              {step === 'depositing' && 'Depositing to vault...'}
            </p>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Please wait while we process your transaction
            </p>
          </div>
        )}

        {step === 'complete' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">
              Yield Activated!
            </p>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Your {asset.token} is now earning {vault.current_apy.toFixed(2)}% APY
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
