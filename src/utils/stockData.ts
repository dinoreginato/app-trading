import { Asset, AssetCategory, CurrencyInfo } from '../types';

export const currencies: CurrencyInfo[] = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'Europa', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', country: 'Reino Unido', flag: '🇬🇧' },
  { code: 'JPY', name: 'Yen Japonés', symbol: '¥', country: 'Japón', flag: '🇯🇵' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', country: 'México', flag: '🇲🇽' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', country: 'Colombia', flag: '🇨🇴' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', country: 'Argentina', flag: '🇦🇷' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', country: 'Chile', flag: '🇨🇱' },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', country: 'Perú', flag: '🇵🇪' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', country: 'Brasil', flag: '🇧🇷' },
  { code: 'VES', name: 'Bolívar Venezolano', symbol: 'Bs', country: 'Venezuela', flag: '🇻🇪' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', country: 'Global', flag: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', country: 'Global', flag: 'Ξ' },
];

export const assets: Asset[] = [
  // Acciones USA
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 2.34, changePercent: 1.25, volume: 52340000, marketCap: '2.95T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -0.95, changePercent: -0.67, volume: 23450000, marketCap: '1.78T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.92, change: 4.56, changePercent: 1.22, volume: 19870000, marketCap: '2.81T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 3.12, changePercent: 1.78, volume: 45670000, marketCap: '1.86T', sector: 'Consumer', category: 'stocks', country: 'US' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23, volume: 98760000, marketCap: '789B', sector: 'Automotive', category: 'stocks', country: 'US' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 15.40, changePercent: 1.79, volume: 34560000, marketCap: '2.16T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'META', name: 'Meta Platforms', price: 505.75, change: 8.23, changePercent: 1.65, volume: 15670000, marketCap: '1.29T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: 1.23, changePercent: 0.62, volume: 8900000, marketCap: '571B', sector: 'Finance', category: 'stocks', country: 'US' },

  // Criptomonedas
  { symbol: 'BTC', name: 'Bitcoin', price: 67542.30, change: 1245.50, changePercent: 1.88, volume: 28500000000, marketCap: '1.32T', category: 'crypto', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -45.23, changePercent: -1.29, volume: 15200000000, marketCap: '415B', category: 'crypto', icon: 'Ξ' },
  { symbol: 'BNB', name: 'Binance Coin', price: 598.45, change: 12.34, changePercent: 2.10, volume: 1850000000, marketCap: '89B', category: 'crypto' },
  { symbol: 'SOL', name: 'Solana', price: 178.90, change: 8.45, changePercent: 4.96, volume: 3200000000, marketCap: '78B', category: 'crypto' },
  { symbol: 'XRP', name: 'Ripple', price: 0.6234, change: -0.0123, changePercent: -1.94, volume: 1450000000, marketCap: '34B', category: 'crypto' },
  { symbol: 'ADA', name: 'Cardano', price: 0.4567, change: 0.0234, changePercent: 5.40, volume: 567000000, marketCap: '16B', category: 'crypto' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.1234, change: 0.0056, changePercent: 4.75, volume: 890000000, marketCap: '17B', category: 'crypto' },
  { symbol: 'DOT', name: 'Polkadot', price: 7.89, change: -0.34, changePercent: -4.13, volume: 345000000, marketCap: '10B', category: 'crypto' },

  // Forex - Pares de divisas por país
  { symbol: 'EUR/USD', name: 'Euro / Dólar', price: 1.0876, change: 0.0023, changePercent: 0.21, volume: 150000000000, category: 'forex', pair: 'EUR/USD', country: 'EU/US' },
  { symbol: 'GBP/USD', name: 'Libra / Dólar', price: 1.2654, change: -0.0045, changePercent: -0.35, volume: 98000000000, category: 'forex', pair: 'GBP/USD', country: 'UK/US' },
  { symbol: 'USD/JPY', name: 'Dólar / Yen', price: 149.85, change: 0.67, changePercent: 0.45, volume: 112000000000, category: 'forex', pair: 'USD/JPY', country: 'US/JP' },
  { symbol: 'USD/MXN', name: 'Dólar / Peso MX', price: 17.12, change: 0.08, changePercent: 0.47, volume: 45000000000, category: 'forex', pair: 'USD/MXN', country: 'US/MX' },
  { symbol: 'USD/COP', name: 'Dólar / Peso CO', price: 3945.50, change: 12.30, changePercent: 0.31, volume: 12000000000, category: 'forex', pair: 'USD/COP', country: 'US/CO' },
  { symbol: 'USD/ARS', name: 'Dólar / Peso AR', price: 875.20, change: 5.40, changePercent: 0.62, volume: 8500000000, category: 'forex', pair: 'USD/ARS', country: 'US/AR' },
  { symbol: 'USD/CLP', name: 'Dólar / Peso CL', price: 923.45, change: -3.20, changePercent: -0.35, volume: 15000000000, category: 'forex', pair: 'USD/CLP', country: 'US/CL' },
  { symbol: 'USD/PEN', name: 'Dólar / Sol PE', price: 3.72, change: 0.01, changePercent: 0.27, volume: 5600000000, category: 'forex', pair: 'USD/PEN', country: 'US/PE' },
  { symbol: 'USD/BRL', name: 'Dólar / Real BR', price: 4.97, change: -0.03, changePercent: -0.60, volume: 23000000000, category: 'forex', pair: 'USD/BRL', country: 'US/BR' },
  { symbol: 'EUR/GBP', name: 'Euro / Libra', price: 0.8594, change: 0.0012, changePercent: 0.14, volume: 67000000000, category: 'forex', pair: 'EUR/GBP', country: 'EU/UK' },
  { symbol: 'EUR/JPY', name: 'Euro / Yen', price: 162.98, change: 0.89, changePercent: 0.55, volume: 45000000000, category: 'forex', pair: 'EUR/JPY', country: 'EU/JP' },
  { symbol: 'MXN/COP', name: 'Peso MX / Peso CO', price: 230.45, change: 1.23, changePercent: 0.54, volume: 3400000000, category: 'forex', pair: 'MXN/COP', country: 'MX/CO' },

  // Commodities
  { symbol: 'XAU/USD', name: 'Oro', price: 2345.60, change: 15.80, changePercent: 0.68, volume: 180000000000, category: 'commodities' },
  { symbol: 'XAG/USD', name: 'Plata', price: 27.45, change: -0.34, changePercent: -1.22, volume: 45000000000, category: 'commodities' },
  { symbol: 'WTI', name: 'Petróleo WTI', price: 78.34, change: 1.23, changePercent: 1.59, volume: 320000000000, category: 'commodities' },
  { symbol: 'NATGAS', name: 'Gas Natural', price: 2.34, change: -0.05, changePercent: -2.09, volume: 156000000000, category: 'commodities' },
];

export function getAssetsByCategory(category: AssetCategory | 'all'): Asset[] {
  if (category === 'all') return assets;
  return assets.filter(a => a.category === category);
}

export function getAssetsByCountry(country: string): Asset[] {
  return assets.filter(a => a.country === country || a.country?.includes(country));
}

export function getCategoryLabel(category: AssetCategory): string {
  switch (category) {
    case 'stocks': return 'Acciones';
    case 'crypto': return 'Criptomonedas';
    case 'forex': return 'Forex / Divisas';
    case 'commodities': return 'Materias Primas';
  }
}

export function getCategoryIcon(category: AssetCategory): string {
  switch (category) {
    case 'stocks': return '📊';
    case 'crypto': return '₿';
    case 'forex': return '💱';
    case 'commodities': return '🥇';
  }
}

export function getCategoryColor(category: AssetCategory): string {
  switch (category) {
    case 'stocks': return 'from-blue-500 to-blue-600';
    case 'crypto': return 'from-orange-500 to-yellow-500';
    case 'forex': return 'from-green-500 to-emerald-600';
    case 'commodities': return 'from-yellow-500 to-amber-600';
  }
}

export function generatePriceHistory(basePrice: number, days: number = 90): import('../types').PricePoint[] {
  const points: import('../types').PricePoint[] = [];
  let price = basePrice * 0.85;
  const volatility = basePrice > 1000 ? 0.015 : basePrice > 10 ? 0.02 : 0.025;
  
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

function calculateRSI(points: import('../types').PricePoint[], currentPrice: number): number | null {
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

function calculateMACD(points: import('../types').PricePoint[], currentPrice: number): { macd: number | null; signal: number | null } {
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
