export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: string;
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
