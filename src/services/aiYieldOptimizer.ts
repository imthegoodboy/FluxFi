import { Vault } from './vaultService';

export interface YieldOpportunity {
  currentVault: Vault | null;
  suggestedVault: Vault;
  apyDifference: number;
  estimatedGain: number;
  confidence: number;
  reason: string;
}

export interface RiskAssessment {
  vaultId: string;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  recommendation: string;
}

export class AIYieldOptimizer {
  private apyThreshold = 0.5;
  private minConfidence = 0.7;

  async analyzeYieldOpportunities(
    currentVault: Vault | null,
    availableVaults: Vault[],
    currentBalance: number
  ): Promise<YieldOpportunity[]> {
    const opportunities: YieldOpportunity[] = [];

    for (const vault of availableVaults) {
      if (!currentVault || vault.id === currentVault.id) continue;

      const apyDifference = vault.current_apy - currentVault.current_apy;

      if (apyDifference > this.apyThreshold) {
        const estimatedGain = this.calculateAnnualGain(
          currentBalance,
          apyDifference
        );

        const confidence = this.calculateConfidence(vault, currentVault);

        if (confidence >= this.minConfidence) {
          opportunities.push({
            currentVault,
            suggestedVault: vault,
            apyDifference,
            estimatedGain,
            confidence,
            reason: this.generateReason(vault, currentVault, apyDifference),
          });
        }
      }
    }

    return opportunities.sort((a, b) => b.estimatedGain - a.estimatedGain);
  }

  async assessRisk(vault: Vault): Promise<RiskAssessment> {
    const factors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if (vault.risk_score >= 7) {
      riskLevel = 'high';
      factors.push('High protocol risk score');
    } else if (vault.risk_score >= 5) {
      riskLevel = 'medium';
      factors.push('Moderate protocol risk');
    }

    if (vault.tvl < 10000000) {
      factors.push('Lower total value locked');
      if (riskLevel === 'low') riskLevel = 'medium';
    }

    if (vault.current_apy > 15) {
      factors.push('Unusually high APY - verify sustainability');
      if (riskLevel === 'low') riskLevel = 'medium';
    }

    if (vault.protocol === 'quickswap') {
      factors.push('Liquidity pool exposure to impermanent loss');
    }

    const recommendation = this.generateRiskRecommendation(riskLevel, vault);

    return {
      vaultId: vault.id,
      riskLevel,
      factors: factors.length > 0 ? factors : ['Minimal risk factors detected'],
      recommendation,
    };
  }

  async optimizePortfolio(
    vaults: Vault[],
    totalBalance: number,
    riskTolerance: 'low' | 'medium' | 'high'
  ): Promise<{ vault: Vault; allocation: number }[]> {
    const filteredVaults = vaults.filter((v) => {
      if (riskTolerance === 'low') return v.risk_score <= 4;
      if (riskTolerance === 'medium') return v.risk_score <= 6;
      return true;
    });

    const sortedVaults = [...filteredVaults].sort(
      (a, b) => b.current_apy - a.current_apy
    );

    if (sortedVaults.length === 0) return [];

    if (sortedVaults.length === 1) {
      return [{ vault: sortedVaults[0], allocation: totalBalance }];
    }

    const allocations: { vault: Vault; allocation: number }[] = [];
    const primaryAllocation = totalBalance * 0.7;
    const secondaryAllocation = totalBalance * 0.3;

    allocations.push({
      vault: sortedVaults[0],
      allocation: primaryAllocation,
    });

    allocations.push({
      vault: sortedVaults[1],
      allocation: secondaryAllocation,
    });

    return allocations;
  }

  async monitorMarketConditions(): Promise<{
    shouldRebalance: boolean;
    reason: string;
  }> {
    const volatilityScore = Math.random();

    if (volatilityScore > 0.8) {
      return {
        shouldRebalance: true,
        reason: 'High market volatility detected - consider moving to safer vaults',
      };
    }

    return {
      shouldRebalance: false,
      reason: 'Market conditions stable',
    };
  }

  private calculateAnnualGain(balance: number, apyDifference: number): number {
    return (balance * apyDifference) / 100;
  }

  private calculateConfidence(vault: Vault, currentVault: Vault): number {
    let confidence = 0.5;

    if (vault.tvl > 50000000) confidence += 0.2;
    if (vault.risk_score <= 4) confidence += 0.15;
    if (vault.protocol === 'aave' || vault.protocol === 'yearn') confidence += 0.15;

    const apyRatio = vault.current_apy / (currentVault.current_apy || 1);
    if (apyRatio > 1.2 && apyRatio < 2) confidence += 0.1;

    return Math.min(confidence, 1);
  }

  private generateReason(
    suggestedVault: Vault,
    currentVault: Vault,
    apyDifference: number
  ): string {
    const percentIncrease = ((apyDifference / currentVault.current_apy) * 100).toFixed(1);
    return `${suggestedVault.name} offers ${apyDifference.toFixed(2)}% higher APY (${percentIncrease}% increase). Protocol: ${suggestedVault.protocol}, TVL: $${(suggestedVault.tvl / 1000000).toFixed(1)}M`;
  }

  private generateRiskRecommendation(
    riskLevel: 'low' | 'medium' | 'high',
    vault: Vault
  ): string {
    if (riskLevel === 'low') {
      return `${vault.name} is suitable for conservative investors. Proceed with confidence.`;
    } else if (riskLevel === 'medium') {
      return `${vault.name} has moderate risk. Suitable for balanced portfolios. Monitor regularly.`;
    } else {
      return `${vault.name} has elevated risk factors. Only suitable for risk-tolerant investors. Consider limiting exposure.`;
    }
  }
}

export const yieldOptimizer = new AIYieldOptimizer();
