import { Asset, AssetCategory } from '../types';

export const assets: Asset[] = [
  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.30, changePercent: 1.30, volume: 52340000, marketCap: '2.8T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: -1.20, changePercent: -0.84, volume: 23450000, marketCap: '1.8T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 4.50, changePercent: 1.20, volume: 19870000, marketCap: '2.8T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 3.15, changePercent: 1.80, volume: 45670000, marketCap: '1.8T', sector: 'Consumer', category: 'stocks', country: 'US' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.70, changePercent: -2.24, volume: 98760000, marketCap: '789B', sector: 'Automotive', category: 'stocks', country: 'US' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 15.40, changePercent: 1.79, volume: 34560000, marketCap: '2.2T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'META', name: 'Meta Platforms', price: 505.75, change: 8.25, changePercent: 1.66, volume: 15670000, marketCap: '1.3T', sector: 'Technology', category: 'stocks', country: 'US' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: 1.25, changePercent: 0.63, volume: 8900000, marketCap: '571B', sector: 'Finance', category: 'stocks', country: 'US' },

  // Crypto
  { symbol: 'BTC', name: 'Bitcoin', price: 67542.30, change: 1245.50, changePercent: 1.88, volume: 28500000000, marketCap: '1.3T', category: 'crypto', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -45.23, changePercent: -1.29, volume: 15200000000, marketCap: '415B', category: 'crypto', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', price: 178.90, change: 8.45, changePercent: 4.96, volume: 3200000000, marketCap: '78B', category: 'crypto' },
  { symbol: 'BNB', name: 'Binance Coin', price: 598.45, change: 12.34, changePercent: 2.10, volume: 1850000000, marketCap: '89B', category: 'crypto' },
  { symbol: 'XRP', name: 'Ripple', price: 0.6234, change: -0.0123, changePercent: -1.94, volume: 1450000000, marketCap: '34B', category: 'crypto' },
  { symbol: 'ADA', name: 'Cardano', price: 0.4567, change: 0.0234, changePercent: 5.40, volume: 567000000, marketCap: '16B', category: 'crypto' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.1234, change: 0.0056, changePercent: 4.75, volume: 890000000, marketCap: '17B', category: 'crypto' },
  { symbol: 'DOT', name: 'Polkadot', price: 7.89, change: -0.34, changePercent: -4.13, volume: 345000000, marketCap: '10B', category: 'crypto' },

  // Forex
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0876, change: 0.0023, changePercent: 0.21, volume: 150000000000, category: 'forex', pair: 'EUR/USD', country: 'EU/US' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2654, change: -0.0045, changePercent: -0.35, volume: 98000000000, category: 'forex', pair: 'GBP/USD', country: 'UK/US' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 149.85, change: 0.67, changePercent: 0.45, volume: 112000000000, category: 'forex', pair: 'USD/JPY', country: 'US/JP' },
  { symbol: 'USD/MXN', name: 'US Dollar / Mexican Peso', price: 17.12, change: 0.08, changePercent: 0.47, volume: 45000000000, category: 'forex', pair: 'USD/MXN', country: 'US/MX' },
  { symbol: 'USD/COP', name: 'US Dollar / Colombian Peso', price: 3945.50, change: 12.30, changePercent: 0.31, volume: 12000000000, category: 'forex', pair: 'USD/COP', country: 'US/CO' },
  { symbol: 'USD/ARS', name: 'US Dollar / Argentine Peso', price: 875.20, change: 5.40, changePercent: 0.62, volume: 8500000000, category: 'forex', pair: 'USD/ARS', country: 'US/AR' },
  { symbol: 'USD/CLP', name: 'US Dollar / Chilean Peso', price: 923.45, change: -3.20, changePercent: -0.35, volume: 15000000000, category: 'forex', pair: 'USD/CLP', country: 'US/CL' },
  { symbol: 'USD/PEN', name: 'US Dollar / Peruvian Sol', price: 3.72, change: 0.01, changePercent: 0.27, volume: 5600000000, category: 'forex', pair: 'USD/PEN', country: 'US/PE' },
  { symbol: 'USD/BRL', name: 'US Dollar / Brazilian Real', price: 4.97, change: -0.03, changePercent: -0.60, volume: 23000000000, category: 'forex', pair: 'USD/BRL', country: 'US/BR' },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', price: 0.8594, change: 0.0012, changePercent: 0.14, volume: 67000000000, category: 'forex', pair: 'EUR/GBP', country: 'EU/UK' },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', price: 162.98, change: 0.89, changePercent: 0.55, volume: 45000000000, category: 'forex', pair: 'EUR/JPY', country: 'EU/JP' },
  { symbol: 'MXN/COP', name: 'Mexican Peso / Colombian Peso', price: 230.45, change: 1.23, changePercent: 0.54, volume: 3400000000, category: 'forex', pair: 'MXN/COP', country: 'MX/CO' },

  // Commodities
  { symbol: 'XAU/USD', name: 'Gold', price: 2345.60, change: 15.80, changePercent: 0.68, volume: 180000000000, category: 'commodities' },
  { symbol: 'XAG/USD', name: 'Silver', price: 27.45, change: -0.34, changePercent: -1.22, volume: 45000000000, category: 'commodities' },
  { symbol: 'WTI', name: 'Crude Oil WTI', price: 78.34, change: 1.23, changePercent: 1.59, volume: 320000000000, category: 'commodities' },
  { symbol: 'NATGAS', name: 'Natural Gas', price: 2.34, change: -0.05, changePercent: -2.09, volume: 156000000000, category: 'commodities' },
];

export function getAssetsByCategory(category: AssetCategory | 'all'): Asset[] {
  if (category === 'all') return assets;
  return assets.filter(a => a.category === category);
}

export function getCategoryLabel(category: AssetCategory): string {
  switch (category) {
    case 'stocks': return 'Acciones';
    case 'crypto': return 'Criptomonedas';
    case 'forex': return 'Forex';
    case 'commodities': return 'Materias Primas';
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

export function generatePriceHistory(basePrice: number, days: number = 30): { time: string; price: number }[] {
  const data = [];
  let price = basePrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simular variación de precio
    const change = (Math.random() - 0.5) * basePrice * 0.02;
    price = Math.max(price + change, basePrice * 0.8);
    
    data.push({
      time: date.toISOString().split('T')[0],
      price: price
    });
  }
  
  return data;
}
