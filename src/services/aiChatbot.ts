import { supabase } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const AI_KNOWLEDGE_BASE = {
  flux_fi: "FluxFi is an AI-powered cross-chain yield router that turns idle crypto into automatic passive income. We support BTC, ETH, SOL, MATIC, and USDC.",
  getting_started: "To get started with FluxFi: 1) Connect your wallet 2) Sign in or create an account 3) Activate yield on idle assets 4) Watch your earnings grow automatically.",
  supported_assets: "We support BTC, ETH, SOL, MATIC, and USDC across Bitcoin, Ethereum, Solana, and Polygon networks.",
  vaults: "We offer yield farming through Aave (5.2% APY), Yearn (4.8% APY), Quickswap (6.5% APY), and Beefy (5.9% APY) on Polygon.",
  fees: "FluxFi charges a minimal 0.5% swap fee and 10% of the yields earned. No deposit or withdrawal fees.",
  polygon: "Polygon is a Layer 2 scaling solution for Ethereum. We use it for fast, low-cost transactions and access to top-tier DeFi protocols.",
  sideshift: "SideShift is a cross-chain liquidity aggregator we use to swap assets from any blockchain to Polygon USDC instantly and securely.",
  security: "Your funds are secure. We use smart contracts from audited protocols (Aave, Yearn). Your private keys remain in your wallet.",
  withdraw: "You can withdraw anytime. Your funds are automatically swapped back to your original token and sent to your wallet within minutes.",
  apy: "APY (Annual Percentage Yield) is the yearly return on your investment. Our displayed APYs are current rates that may fluctuate based on market conditions.",
  risks: "DeFi involves risks including smart contract vulnerabilities, market volatility, and protocol risks. We recommend starting with small amounts.",
  support: "Need help? Check our FAQ or contact our support team. For urgent issues, please reach out through our help page.",
};

export class AIChatbot {
  private conversationHistory: ChatMessage[] = [];

  async saveChatMessage(
    userId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: userId,
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    await supabase.from('chat_messages').insert(message);
    this.conversationHistory.push(message);

    return message;
  }

  async generateResponse(userMessage: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();

    const keywords: Record<string, string> = {
      'what is': AI_KNOWLEDGE_BASE.flux_fi,
      'how do': AI_KNOWLEDGE_BASE.getting_started,
      'getting started': AI_KNOWLEDGE_BASE.getting_started,
      'supported assets': AI_KNOWLEDGE_BASE.supported_assets,
      'assets': AI_KNOWLEDGE_BASE.supported_assets,
      'vaults': AI_KNOWLEDGE_BASE.vaults,
      'yields': AI_KNOWLEDGE_BASE.vaults,
      'fees': AI_KNOWLEDGE_BASE.fees,
      'polygon': AI_KNOWLEDGE_BASE.polygon,
      'sideshift': AI_KNOWLEDGE_BASE.sideshift,
      'security': AI_KNOWLEDGE_BASE.security,
      'safe': AI_KNOWLEDGE_BASE.security,
      'withdraw': AI_KNOWLEDGE_BASE.withdraw,
      'apy': AI_KNOWLEDGE_BASE.apy,
      'returns': AI_KNOWLEDGE_BASE.apy,
      'risks': AI_KNOWLEDGE_BASE.risks,
      'risk': AI_KNOWLEDGE_BASE.risks,
      'help': AI_KNOWLEDGE_BASE.support,
      'support': AI_KNOWLEDGE_BASE.support,
    };

    for (const [key, answer] of Object.entries(keywords)) {
      if (lowerMessage.includes(key)) {
        return answer;
      }
    }

    return this.generateFallbackResponse(userMessage);
  }

  private generateFallbackResponse(userMessage: string): string {
    const responses = [
      `I'm not sure about "${userMessage}", but I can help with questions about yield farming, asset activation, withdrawal, or supported protocols. What would you like to know?`,
      `Great question! To help you better, could you clarify if you're asking about our vaults, fees, security, or how to get started?`,
      `I'm here to help! Ask me about FluxFi features, supported assets, yields, Polygon, SideShift, or how to maximize your earnings.`,
      `That's a good question. Feel free to ask about our services, available vaults, how withdrawals work, or any other FluxFi features.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    return data || [];
  }

  async clearHistory(userId: string): Promise<void> {
    await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);

    this.conversationHistory = [];
  }
}

export const chatbot = new AIChatbot();
