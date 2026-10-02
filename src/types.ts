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

export interface PricePoint {
  time: string;
  price: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  buySignal?: boolean;
  sellSignal?: boolean;
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

export interface Position {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  profit: number;
  profitPercent: number;
  category: AssetCategory;
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

export interface LearningStats {
  totalTrades: number;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  bestTrade: number;
  worstTrade: number;
  sharpeRatio: number;
  maxDrawdown: number;
  patterns: Pattern[];
  accuracy: number;
  learningRate: number;
}

export interface Pattern {
  name: string;
  description: string;
  successRate: number;
  occurrences: number;
  avgReturn: number;
  lastUsed: string;
}

export interface Signal {
  symbol: string;
  type: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  reasons: string[];
  indicators: {
    rsi: number;
    macd: string;
    sma: string;
    volume: string;
    trend: string;
  };
}

export interface BrokerConnection {
  id: string;
  name: string;
  type: 'exchange' | 'broker' | 'bank';
  status: 'connected' | 'disconnected' | 'pending';
  categories: AssetCategory[];
  countries: string[];
  apiKey?: string;
  balance?: number;
  logo?: string;
  description: string;
  features: string[];
  fees: string;
  isReal: boolean;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  country: string;
  flag: string;
}
