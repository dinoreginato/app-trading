export type AssetCategory = 'stocks' | 'crypto' | 'forex' | 'commodities';

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
  sector?: string;
  category: AssetCategory;
  country?: string;
  pair?: string;
  icon?: string;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  total: number;
  date: string;
  reason: string;
  confidence: number;
  profit?: number;
  category: AssetCategory;
  currency: string;
}

export interface AutoTraderConfig {
  initialCapital: number;
  targetAmount: number;
  targetDate: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  isActive: boolean;
  maxPositionSize: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  baseCurrency: string;
  categories: AssetCategory[];
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  countryCode: string;
  locale: string;
  decimals: number;
  rateToUSD: number;
}
