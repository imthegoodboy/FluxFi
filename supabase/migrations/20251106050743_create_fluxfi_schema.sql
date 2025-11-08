/*
  # FluxFi Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User ID from auth
      - `wallet_address` (text) - Primary wallet address
      - `email` (text) - User email
      - `created_at` (timestamptz) - Account creation time
      - `updated_at` (timestamptz) - Last update time
    
    - `assets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - Owner
      - `token_symbol` (text) - BTC, ETH, SOL, etc.
      - `chain` (text) - Bitcoin, Ethereum, Solana, etc.
      - `amount` (numeric) - Token amount
      - `usd_value` (numeric) - USD equivalent
      - `status` (text) - idle, active, withdrawing
      - `wallet_address` (text) - Source wallet
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `deposits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `asset_id` (uuid, foreign key)
      - `original_token` (text) - BTC, ETH, etc.
      - `original_amount` (numeric)
      - `original_chain` (text)
      - `converted_token` (text) - USDC
      - `converted_amount` (numeric)
      - `vault_id` (uuid, foreign key)
      - `status` (text) - pending, active, withdrawn
      - `deposited_at` (timestamptz)
      - `withdrawn_at` (timestamptz)
    
    - `vaults`
      - `id` (uuid, primary key)
      - `name` (text) - Aave USDC, Yearn USDC, etc.
      - `protocol` (text) - aave, yearn, quickswap
      - `token` (text) - USDC, USDT, etc.
      - `chain` (text) - Polygon
      - `contract_address` (text) - Vault contract
      - `current_apy` (numeric) - Current APY %
      - `tvl` (numeric) - Total value locked
      - `risk_score` (numeric) - 1-10 risk rating
      - `is_active` (boolean) - Active status
      - `updated_at` (timestamptz)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `deposit_id` (uuid, foreign key)
      - `type` (text) - swap_in, deposit, withdraw, swap_out, rebalance
      - `from_token` (text)
      - `to_token` (text)
      - `amount` (numeric)
      - `tx_hash` (text) - Blockchain transaction hash
      - `status` (text) - pending, completed, failed
      - `error_message` (text)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz)
    
    - `earnings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `deposit_id` (uuid, foreign key)
      - `vault_id` (uuid, foreign key)
      - `amount` (numeric) - Earnings in USDC
      - `apy_at_time` (numeric) - APY when earned
      - `period_start` (timestamptz)
      - `period_end` (timestamptz)
      - `claimed` (boolean)
      - `created_at` (timestamptz)
    
    - `yield_history`
      - `id` (uuid, primary key)
      - `vault_id` (uuid, foreign key)
      - `apy` (numeric) - APY %
      - `tvl` (numeric) - TVL at time
      - `recorded_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for public vault information
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token_symbol text NOT NULL,
  chain text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  usd_value numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'idle',
  wallet_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assets"
  ON assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Vaults table
CREATE TABLE IF NOT EXISTS vaults (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  protocol text NOT NULL,
  token text NOT NULL,
  chain text NOT NULL DEFAULT 'Polygon',
  contract_address text NOT NULL,
  current_apy numeric NOT NULL DEFAULT 0,
  tvl numeric NOT NULL DEFAULT 0,
  risk_score numeric NOT NULL DEFAULT 5,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vaults"
  ON vaults FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  original_token text NOT NULL,
  original_amount numeric NOT NULL,
  original_chain text NOT NULL,
  converted_token text NOT NULL DEFAULT 'USDC',
  converted_amount numeric NOT NULL DEFAULT 0,
  vault_id uuid REFERENCES vaults(id),
  status text NOT NULL DEFAULT 'pending',
  deposited_at timestamptz DEFAULT now(),
  withdrawn_at timestamptz
);

ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deposits"
  ON deposits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deposits"
  ON deposits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deposits"
  ON deposits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  deposit_id uuid REFERENCES deposits(id) ON DELETE CASCADE,
  type text NOT NULL,
  from_token text,
  to_token text,
  amount numeric NOT NULL,
  tx_hash text,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Earnings table
CREATE TABLE IF NOT EXISTS earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  deposit_id uuid REFERENCES deposits(id) ON DELETE CASCADE NOT NULL,
  vault_id uuid REFERENCES vaults(id) NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  apy_at_time numeric NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own earnings"
  ON earnings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Yield history table
CREATE TABLE IF NOT EXISTS yield_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid REFERENCES vaults(id) ON DELETE CASCADE NOT NULL,
  apy numeric NOT NULL,
  tvl numeric NOT NULL DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE yield_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view yield history"
  ON yield_history FOR SELECT
  TO authenticated
  USING (true);

-- Insert default vaults
INSERT INTO vaults (name, protocol, token, chain, contract_address, current_apy, tvl, risk_score, is_active) VALUES
  ('Aave Polygon USDC', 'aave', 'USDC', 'Polygon', '0x625E7708f30cA75bfd92586e17077590C60eb4cD', 5.2, 150000000, 3, true),
  ('Yearn USDC Vault', 'yearn', 'USDC', 'Polygon', '0x0000000000000000000000000000000000000000', 4.8, 80000000, 4, true),
  ('Quickswap USDC Pool', 'quickswap', 'USDC', 'Polygon', '0x0000000000000000000000000000000000000000', 6.5, 45000000, 6, true),
  ('Beefy USDC Vault', 'beefy', 'USDC', 'Polygon', '0x0000000000000000000000000000000000000000', 5.9, 32000000, 5, true)
ON CONFLICT DO NOTHING;