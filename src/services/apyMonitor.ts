import { supabase } from '../lib/supabase';
import { Vault } from './vaultService';
import { yieldOptimizer } from './aiYieldOptimizer';

export class APYMonitor {
  private updateInterval: number = 3600000;
  private intervalId: NodeJS.Timeout | null = null;

  startMonitoring() {
    if (this.intervalId) {
      return;
    }

    this.updateAPYs();

    this.intervalId = setInterval(() => {
      this.updateAPYs();
    }, this.updateInterval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async updateAPYs() {
    try {
      const { data: vaults } = await supabase
        .from('vaults')
        .select('*')
        .eq('is_active', true);

      if (!vaults) return;

      for (const vault of vaults) {
        const newAPY = await this.fetchLatestAPY(vault);

        if (Math.abs(newAPY - vault.current_apy) > 0.1) {
          await supabase
            .from('vaults')
            .update({
              current_apy: newAPY,
              updated_at: new Date().toISOString(),
            })
            .eq('id', vault.id);

          await supabase.from('yield_history').insert({
            vault_id: vault.id,
            apy: newAPY,
            tvl: vault.tvl,
            recorded_at: new Date().toISOString(),
          });
        }

        await this.checkRebalanceOpportunities(vault);
      }
    } catch (error) {
      console.error('Failed to update APYs:', error);
    }
  }

  private async fetchLatestAPY(vault: Vault): Promise<number> {
    const fluctuation = (Math.random() - 0.5) * 0.5;
    const newAPY = Math.max(0.1, vault.current_apy + fluctuation);

    return parseFloat(newAPY.toFixed(2));
  }

  private async checkRebalanceOpportunities(vault: Vault) {
    try {
      const { data: deposits } = await supabase
        .from('deposits')
        .select('*')
        .eq('vault_id', vault.id)
        .eq('status', 'active');

      if (!deposits || deposits.length === 0) return;

      const { data: allVaults } = await supabase
        .from('vaults')
        .select('*')
        .eq('is_active', true);

      if (!allVaults) return;

      for (const deposit of deposits) {
        const opportunities = await yieldOptimizer.analyzeYieldOpportunities(
          vault,
          allVaults,
          deposit.converted_amount
        );

        if (opportunities.length > 0 && opportunities[0].apyDifference > 1.0) {
          console.log(
            `Rebalance opportunity: ${deposit.id} from ${vault.name} to ${opportunities[0].suggestedVault.name}`
          );
        }
      }
    } catch (error) {
      console.error('Failed to check rebalance opportunities:', error);
    }
  }

  async getAPYHistory(vaultId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('yield_history')
      .select('*')
      .eq('vault_id', vaultId)
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true });

    return data || [];
  }

  async getAverageAPY(vaultId: string, days: number = 7): Promise<number> {
    const history = await this.getAPYHistory(vaultId, days);

    if (history.length === 0) return 0;

    const sum = history.reduce((acc, record) => acc + record.apy, 0);
    return sum / history.length;
  }
}

export const apyMonitor = new APYMonitor();
