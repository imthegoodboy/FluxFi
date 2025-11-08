import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          wallet_address: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          wallet_address?: string;
          email?: string | null;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          token_symbol: string;
          chain: string;
          amount: number;
          usd_value: number;
          status: string;
          wallet_address: string;
          created_at: string;
          updated_at: string;
        };
      };
      vaults: {
        Row: {
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
        };
      };
      deposits: {
        Row: {
          id: string;
          user_id: string;
          asset_id: string | null;
          original_token: string;
          original_amount: number;
          original_chain: string;
          converted_token: string;
          converted_amount: number;
          vault_id: string | null;
          status: string;
          deposited_at: string;
          withdrawn_at: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          deposit_id: string | null;
          type: string;
          from_token: string | null;
          to_token: string | null;
          amount: number;
          tx_hash: string | null;
          status: string;
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
      };
      earnings: {
        Row: {
          id: string;
          user_id: string;
          deposit_id: string;
          vault_id: string;
          amount: number;
          apy_at_time: number;
          period_start: string;
          period_end: string;
          claimed: boolean;
          created_at: string;
        };
      };
    };
  };
};
