import { Stock, PricePoint } from '../types';

export const stocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 2.34, changePercent: 1.25, volume: 52340000, marketCap: '2.95T', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -0.95, changePercent: -0.67, volume: 23450000, marketCap: '1.78T', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.92, change: 4.56, changePercent: 1.22, volume: 19870000, marketCap: '2.81T', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 3.12, changePercent: 1.78, volume: 45670000, marketCap: '1.86T', sector: 'Consumer' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23, volume: 98760000, marketCap: '789B', sector: 'Automotive' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 15.40, changePercent: 1.79, volume: 34560000, marketCap: '2.16T', sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms', price: 505.75, change: 8.23, changePercent: 1.65, volume: 15670000, marketCap: '1.29T', sector: 'Technology' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: 1.23, changePercent: 0.62, volume: 8900000, marketCap: '571B', sector: 'Finance' },
  { symbol: 'V', name: 'Visa Inc.', price: 279.30, change: -1.45, changePercent: -0.52, volume: 6780000, marketCap: '573B', sector: 'Finance' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.80, change: 0.89, changePercent: 0.57, volume: 7890000, marketCap: '378B', sector: 'Healthcare' },
];

export function generatePriceHistory(basePrice: number, days: number = 90): PricePoint[] {
  const points: PricePoint[] = [];
  let price = basePrice * 0.85;
  const volatility = 0.02;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, basePrice * 0.5);
    
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const sma20 = i >= 19 ? points.slice(-20).reduce((sum, p) => sum + p.price, 0) / 20 : undefined;
    const sma50 = i >= 49 ? points.slice(-50).reduce((sum, p) => sum + p.price, 0) / 50 : undefined;
    
    const rsi = calculateRSI(points, price);
    const { macd, signal } = calculateMACD(points, price);
    
    const buySignal = (rsi !== null && rsi < 30) || (sma20 !== undefined && sma50 !== undefined && sma20 > sma50 && price < sma20 * 0.98);
    const sellSignal = (rsi !== null && rsi > 70) || (sma20 !== undefined && sma50 !== undefined && sma20 < sma50 && price > sma20 * 1.02);
    
    points.push({
      time: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      sma20: sma20 ? Math.round(sma20 * 100) / 100 : undefined,
      sma50: sma50 ? Math.round(sma50 * 100) / 100 : undefined,
      rsi: rsi ? Math.round(rsi * 100) / 100 : undefined,
      macd: macd ? Math.round(macd * 100) / 100 : undefined,
      signal: signal ? Math.round(signal * 100) / 100 : undefined,
      buySignal,
      sellSignal,
    });
  }
  
  return points;
}

function calculateRSI(points: PricePoint[], currentPrice: number): number | null {
  if (points.length < 14) return null;
  
  const recentPrices = [...points.slice(-14).map(p => p.price), currentPrice];
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i < recentPrices.length; i++) {
    const diff = recentPrices[i] - recentPrices[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  
  const avgGain = gains / 14;
  const avgLoss = losses / 14;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateMACD(points: PricePoint[], currentPrice: number): { macd: number | null; signal: number | null } {
  if (points.length < 26) return { macd: null, signal: null };
  
  const prices = [...points.map(p => p.price), currentPrice];
  
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  const macd = ema12 - ema26;
  const signal = macd * 0.8;
  
  return { macd, signal };
}

function calculateEMA(prices: number[], period: number): number {
  const multiplier = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  return ema;
}

export function generateSignals(): { symbol: string; type: string; confidence: number; reasons: string[] }[] {
  return stocks.map(stock => {
    const rsi = Math.random() * 100;
    const trend = Math.random();
    
    let type: string;
    let confidence: number;
    const reasons: string[] = [];
    
    if (rsi < 25 && trend > 0.6) {
      type = 'STRONG_BUY';
      confidence = 85 + Math.random() * 15;
      reasons.push('RSI en zona de sobreventa', 'Tendencia alcista detectada', 'Volumen creciente');
    } else if (rsi < 35) {
      type = 'BUY';
      confidence = 65 + Math.random() * 20;
      reasons.push('RSI bajo - posible rebote', 'Soporte técnico cercano');
    } else if (rsi > 75) {
      type = 'STRONG_SELL';
      confidence = 80 + Math.random() * 15;
      reasons.push('RSI en sobrecompra', 'Posible corrección inminente', 'Divergencia bajista');
    } else if (rsi > 65) {
      type = 'SELL';
      confidence = 60 + Math.random() * 20;
      reasons.push('RSI alto - tomar ganancias', 'Resistencia cercana');
    } else {
      type = 'HOLD';
      confidence = 50 + Math.random() * 20;
      reasons.push('Sin señales claras', 'Mercado lateral');
    }
    
    return { symbol: stock.symbol, type, confidence: Math.round(confidence), reasons };
  });
}
