import { LearningStats, Pattern, Trade, AssetCategory } from '../types';
import { assets } from './stockData';

const patterns: Pattern[] = [
  { name: 'Golden Cross', description: 'SMA20 cruza por encima de SMA50', successRate: 72, occurrences: 45, avgReturn: 3.2, lastUsed: '2024-01-15' },
  { name: 'RSI Oversold Bounce', description: 'RSI < 30 con volumen creciente', successRate: 68, occurrences: 38, avgReturn: 2.8, lastUsed: '2024-01-14' },
  { name: 'MACD Bullish Cross', description: 'MACD cruza línea de señal hacia arriba', successRate: 65, occurrences: 52, avgReturn: 2.1, lastUsed: '2024-01-13' },
  { name: 'Death Cross', description: 'SMA20 cruza por debajo de SMA50', successRate: 70, occurrences: 33, avgReturn: -3.5, lastUsed: '2024-01-12' },
  { name: 'RSI Overbought Reversal', description: 'RSI > 70 con divergencia', successRate: 66, occurrences: 41, avgReturn: -2.9, lastUsed: '2024-01-11' },
  { name: 'Volume Breakout', description: 'Precio rompe resistencia con alto volumen', successRate: 74, occurrences: 28, avgReturn: 4.1, lastUsed: '2024-01-10' },
  { name: 'Support Bounce', description: 'Precio rebota en soporte clave', successRate: 63, occurrences: 55, avgReturn: 1.9, lastUsed: '2024-01-09' },
  { name: 'Double Bottom', description: 'Patrón de doble suelo confirmado', successRate: 71, occurrences: 19, avgReturn: 3.8, lastUsed: '2024-01-08' },
];

export function getLearningStats(trades: Trade[]): LearningStats {
  const winningTrades = trades.filter(t => (t.profit || 0) > 0);
  const losingTrades = trades.filter(t => (t.profit || 0) < 0);
  
  const avgProfit = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0) / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0) / losingTrades.length : 0;
  
  return {
    totalTrades: trades.length,
    winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
    avgProfit,
    avgLoss,
    bestTrade: trades.length > 0 ? Math.max(...trades.map(t => t.profit || 0)) : 0,
    worstTrade: trades.length > 0 ? Math.min(...trades.map(t => t.profit || 0)) : 0,
    sharpeRatio: 1.85 + Math.random() * 0.5,
    maxDrawdown: -(5 + Math.random() * 8),
    patterns,
    accuracy: 68 + Math.random() * 12,
    learningRate: 0.001 + Math.random() * 0.002,
  };
}

export function getPatterns(): Pattern[] {
  return patterns.map(p => ({
    ...p,
    successRate: p.successRate + (Math.random() - 0.5) * 5,
    occurrences: p.occurrences + Math.floor(Math.random() * 5),
  }));
}

export function simulateAutoTrade(
  capital: number,
  riskLevel: string,
  categories: AssetCategory[],
  currency: string
): { trades: Trade[]; finalCapital: number } {
  const trades: Trade[] = [];
  let currentCapital = capital;
  
  const filteredAssets = assets.filter(a => categories.includes(a.category));
  const symbols = filteredAssets.length > 0 ? filteredAssets : assets.slice(0, 10);
  
  const reasons = [
    'RSI en sobreventa - oportunidad de compra',
    'Golden Cross detectado - tendencia alcista',
    'MACD bullish crossover confirmado',
    'Volumen inusual - posible breakout',
    'Precio en soporte clave - rebote probable',
    'RSI en sobrecompra - tomar ganancias',
    'Death Cross detectado - proteger capital',
    'Stop loss activado - gestión de riesgo',
    'Meta parcial alcanzada - asegurar ganancias',
    'Divergencia bajista - señal de venta',
  ];
  
  const numDays = 30;
  
  for (let day = 0; day < numDays; day++) {
    const numTrades = Math.floor(Math.random() * 3) + 1;
    
    for (let t = 0; t < numTrades; t++) {
      const asset = symbols[Math.floor(Math.random() * symbols.length)];
      const isBuy = Math.random() > 0.4;
      const riskMultiplier = riskLevel === 'aggressive' ? 0.15 : riskLevel === 'moderate' ? 0.08 : 0.04;
      const tradeAmount = currentCapital * riskMultiplier * (0.5 + Math.random() * 0.5);
      
      const profitPercent = (Math.random() - 0.35) * 8;
      const profit = tradeAmount * (profitPercent / 100);
      
      const date = new Date();
      date.setDate(date.getDate() - (numDays - day));
      
      trades.push({
        id: `trade-${day}-${t}`,
        symbol: asset.symbol,
        type: isBuy ? 'BUY' : 'SELL',
        price: asset.price * (1 + (Math.random() - 0.5) * 0.02),
        quantity: Math.floor(tradeAmount / asset.price),
        total: tradeAmount,
        date: date.toISOString().split('T')[0],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        confidence: 60 + Math.random() * 35,
        profit: isBuy ? profit : -profit * 0.3,
        category: asset.category,
        currency,
      });
      
      currentCapital += profit;
    }
  }
  
  return { trades, finalCapital: currentCapital };
}
