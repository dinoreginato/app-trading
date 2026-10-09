import { useState, useEffect } from 'react';
import { Bell, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { assets, getCategoryColor } from '../utils/stockData';
import { AssetCategory } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface SignalsProps {
  selectedCategory: AssetCategory | 'all';
}

export default function Signals({ selectedCategory }: SignalsProps) {
  const { formatMoney } = useCurrency();
  const [filter, setFilter] = useState('all');
  const [signals, setSignals] = useState<any[]>([]);

  const filteredAssets = selectedCategory === 'all' ? assets : assets.filter(a => a.category === selectedCategory);

  useEffect(() => {
    generateSignals();
    const interval = setInterval(generateSignals, 10000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const generateSignals = () => {
    const newSignals = filteredAssets.map(asset => {
      const rsi = Math.random() * 100;
      const type = rsi < 30 ? 'STRONG_BUY' : rsi < 40 ? 'BUY' : rsi > 70 ? 'STRONG_SELL' : rsi > 60 ? 'SELL' : 'HOLD';
      const confidence = 60 + Math.random() * 35;

      return {
        symbol: asset.symbol,
        name: asset.name,
        type,
        confidence: Math.round(confidence),
        category: asset.category,
        price: asset.price,
        change: asset.changePercent,
      };
    });
    setSignals(newSignals);
  };

  const filteredSignals = filter === 'all' ? signals : signals.filter(s => {
    if (filter === 'buy') return s.type === 'STRONG_BUY' || s.type === 'BUY';
    if (filter === 'sell') return s.type === 'STRONG_SELL' || s.type === 'SELL';
    return s.type === 'HOLD';
  });

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'STRONG_BUY': return 'from-green-500 to-emerald-600';
      case 'BUY': return 'from-green-400 to-green-600';
      case 'HOLD': return 'from-yellow-400 to-yellow-600';
      case 'SELL': return 'from-red-400 to-red-600';
      case 'STRONG_SELL': return 'from-red-500 to-rose-700';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getSignalLabel = (type: string) => {
    switch (type) {
      case 'STRONG_BUY': return { text: 'COMPRA FUERTE', color: 'text-green-400 bg-green-500/20' };
      case 'BUY': return { text: 'COMPRA', color: 'text-green-300 bg-green-500/10' };
      case 'HOLD': return { text: 'MANTENER', color: 'text-yellow-400 bg-yellow-500/10' };
      case 'SELL': return { text: 'VENTA', color: 'text-red-300 bg-red-500/10' };
      case 'STRONG_SELL': return { text: 'VENTA FUERTE', color: 'text-red-400 bg-red-500/20' };
      default: return { text: 'NEUTRAL', color: 'text-gray-400 bg-gray-500/10' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {[
          { key: 'all', label: 'Todas', icon: '📊' },
          { key: 'buy', label: 'Compra', icon: '📈' },
          { key: 'sell', label: 'Venta', icon: '📉' },
          { key: 'hold', label: 'Mantener', icon: '⏸' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
              filter === f.key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredSignals.map(signal => {
          const label = getSignalLabel(signal.type);
          return (
            <div key={signal.symbol} className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 active:scale-[0.99] transition-transform">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getCategoryColor(signal.category)} flex items-center justify-center text-white font-bold text-sm`}>
                    {signal.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{signal.symbol}</h3>
                    <p className="text-[10px] text-gray-400">{signal.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${label.color}`}>
                    {label.text}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{signal.confidence}%</p>
                </div>
              </div>

              <div className="w-full h-1.5 bg-gray-700 rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getSignalColor(signal.type)} transition-all`}
                  style={{ width: `${signal.confidence}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Precio: <span className="text-white font-medium">{formatMoney(signal.price)}</span></span>
                <span className={signal.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {signal.change >= 0 ? '+' : ''}{signal.change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
