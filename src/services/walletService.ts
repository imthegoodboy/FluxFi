export interface DetectedAsset {
  token: string;
  chain: string;
  amount: number;
  usdValue: number;
  status: 'idle' | 'active';
  suggestedApy: number;
  walletAddress: string;
}

export interface WalletConnection {
  address: string;
  chain: string;
  connected: boolean;
}

const MOCK_EXCHANGE_RATES: Record<string, number> = {
  BTC: 45000,
  ETH: 2800,
  SOL: 110,
  MATIC: 0.85,
  USDC: 1,
  USDT: 1,
};

export async function detectWalletAssets(walletAddress: string): Promise<DetectedAsset[]> {
  const mockAssets: DetectedAsset[] = [
    {
      token: 'BTC',
      chain: 'Bitcoin',
      amount: 0.5,
      usdValue: 0.5 * MOCK_EXCHANGE_RATES.BTC,
      status: 'idle',
      suggestedApy: 5.2,
      walletAddress,
    },
    {
      token: 'ETH',
      chain: 'Ethereum',
      amount: 1.8,
      usdValue: 1.8 * MOCK_EXCHANGE_RATES.ETH,
      status: 'idle',
      suggestedApy: 4.8,
      walletAddress,
    },
    {
      token: 'SOL',
      chain: 'Solana',
      amount: 50,
      usdValue: 50 * MOCK_EXCHANGE_RATES.SOL,
      status: 'idle',
      suggestedApy: 4.5,
      walletAddress,
    },
    {
      token: 'USDC',
      chain: 'Polygon',
      amount: 5000,
      usdValue: 5000,
      status: 'idle',
      suggestedApy: 5.9,
      walletAddress,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAssets), 1000);
  });
}

export async function connectWallet(chain?: string): Promise<WalletConnection> {
  if (typeof window === 'undefined') {
    throw new Error('Window object not available');
  }

  const ethereum = (window as any).ethereum;

  if (!ethereum) {
    return {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      chain: 'Ethereum',
      connected: true,
    };
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    return {
      address: accounts[0],
      chain: getChainName(chainId),
      connected: true,
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw new Error('Failed to connect wallet');
  }
}

function getChainName(chainId: string): string {
  const chains: Record<string, string> = {
    '0x1': 'Ethereum',
    '0x89': 'Polygon',
    '0x38': 'BSC',
    '0xa86a': 'Avalanche',
  };
  return chains[chainId] || 'Unknown';
}

export async function disconnectWallet(): Promise<void> {
  return Promise.resolve();
}
