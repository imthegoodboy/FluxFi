import { supabase } from '../lib/supabase';

export interface Vault {
  id: string;
  name: string;
  protocol: string;
  token: string;
  chain: string;
  contract_address: string;
  current_apy: number;
  tvl: number;
  risk_score: number;
  is_active: boolean;
  updated_at: string;
}

export interface DepositResult {
  depositId: string;
  vaultId: string;
  txHash: string;
  status: 'pending' | 'completed' | 'failed';
}

export async function getActiveVaults(): Promise<Vault[]> {
  const { data, error } = await supabase
    .from('vaults')
    .select('*')
    .eq('is_active', true)
    .order('current_apy', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBestVault(token: string = 'USDC'): Promise<Vault | null> {
  const { data, error } = await supabase
    .from('vaults')
    .select('*')
    .eq('token', token)
    .eq('is_active', true)
    .order('current_apy', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function depositToVault(
  userId: string,
  vaultId: string,
  amount: number,
  token: string
): Promise<DepositResult> {
  const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  await new Promise(resolve => setTimeout(resolve, 2000));

  const result: DepositResult = {
    depositId: crypto.randomUUID(),
    vaultId,
    txHash,
    status: 'completed',
  };

  return result;
}

export async function withdrawFromVault(
  depositId: string,
  amount: number
): Promise<{ txHash: string; status: string }> {
  const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    txHash,
    status: 'completed',
  };
}

export async function calculateEarnings(
  depositAmount: number,
  apy: number,
  daysInVault: number
): Promise<number> {
  const dailyRate = apy / 365 / 100;
  const earnings = depositAmount * dailyRate * daysInVault;
  return earnings;
}

export async function rebalanceToVault(
  currentVaultId: string,
  targetVaultId: string,
  amount: number
): Promise<{ success: boolean; txHash: string }> {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  return {
    success: true,
    txHash,
  };
}
