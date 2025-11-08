export interface SwapQuote {
  depositCoin: string;
  settleCoin: string;
  depositAmount: number;
  settleAmount: number;
  rate: number;
  fee: number;
  estimatedTime: number;
}

export interface SwapOrder {
  orderId: string;
  depositAddress: string;
  depositCoin: string;
  settleCoin: string;
  settleAddress: string;
  depositAmount: number;
  settleAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

const SIDESHIFT_RATES: Record<string, number> = {
  'BTC-USDC': 44950,
  'ETH-USDC': 2795,
  'SOL-USDC': 109.5,
  'MATIC-USDC': 0.845,
  'USDC-BTC': 0.0000222,
  'USDC-ETH': 0.000358,
  'USDC-SOL': 0.00913,
  'USDC-MATIC': 1.183,
};

export async function getSwapQuote(
  fromToken: string,
  toToken: string,
  amount: number
): Promise<SwapQuote> {
  const rateKey = `${fromToken}-${toToken}`;
  const rate = SIDESHIFT_RATES[rateKey] || 1;
  const fee = amount * 0.005;
  const settleAmount = (amount * rate) - (fee * rate);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        depositCoin: fromToken,
        settleCoin: toToken,
        depositAmount: amount,
        settleAmount,
        rate,
        fee,
        estimatedTime: 300,
      });
    }, 500);
  });
}

export async function createSwapOrder(
  fromToken: string,
  toToken: string,
  amount: number,
  settleAddress: string
): Promise<SwapOrder> {
  const quote = await getSwapQuote(fromToken, toToken, amount);

  const order: SwapOrder = {
    orderId: `SS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    depositAddress: generateDepositAddress(fromToken),
    depositCoin: fromToken,
    settleCoin: toToken,
    settleAddress,
    depositAmount: amount,
    settleAmount: quote.settleAmount,
    status: 'pending',
    createdAt: new Date(),
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      order.status = 'processing';
      setTimeout(() => {
        order.status = 'completed';
        resolve(order);
      }, 3000);
    }, 1000);
  });
}

export async function getOrderStatus(orderId: string): Promise<SwapOrder['status']> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('completed');
    }, 500);
  });
}

function generateDepositAddress(coin: string): string {
  const prefixes: Record<string, string> = {
    BTC: 'bc1q',
    ETH: '0x',
    SOL: 'Sol',
    MATIC: '0x',
  };

  const prefix = prefixes[coin] || '0x';
  const randomString = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  return prefix + randomString.substring(0, 40);
}

export async function reverseSwap(
  fromToken: string,
  toToken: string,
  amount: number,
  settleAddress: string
): Promise<SwapOrder> {
  return createSwapOrder(fromToken, toToken, amount, settleAddress);
}
