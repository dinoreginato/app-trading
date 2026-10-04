import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { assets, getCategoryColor, getCategoryLabel } from '../utils/stockData';
import { AssetCategory } from '../types';

interface SignalData {
  symbol: string;
  name: string;
  type: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  reasons: string[];
  category: AssetCategory;
  indicators: {
    rsi: number;
    macd: string;
    sma: string;
    volume: string;
    trend: string;
  };
}

interface SignalsProps {
  selectedCategory: AssetCategory | 'all';
}

export default function Signals({ selectedCategory }: SignalsProps) {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const filteredAssets = selectedCategory === 'all' ? assets : assets.filter(a => a.category === selectedCategory);

  useEffect(() => {
    generateSignals();
    const interval = setInterval(generateSignals, 10000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const generateSignals = () => {
    const newSignals: SignalData[] = filteredAssets.map(asset => {
      const rsi = Math.random() * 100;
      const macdBullish = Math.random() > 0.5;
      const smaCross = Math.random() > 0.5;
      const volumeHigh = Math.random() > 0.5;
      const trendUp = Math.random() > 0.4;

      let type: SignalData['type'];
      let confidence: number;
      const reasons: string[] = [];

      if (rsi < 25 && macdBullish && trendUp) {
        type = 'STRONG_BUY';
        confidence = 85 + Math.random() * 15;
        reasons.push('RSI sobreventa extrema', 'MACD bullish', 'Tendencia alcista');
      } else if (rsi < 35 || (macdBullish && volumeHigh)) {
        type = 'BUY';
        confidence = 65 + Math.random() * 20;
        if (rsi < 35) reasons.push('RSI bajo - rebote');
        if (macdBullish) reasons.push('MACD al alza');
        if (volumeHigh) reasons.push('Volumen creciente');
      } else if (rsi > 75 && !macdBullish) {
        type = 'STRONG_SELL';
        confidence = 80 + Math.random() * 18;
        reasons.push('RSI sobrecompra', 'MACD bearish', 'Corrección probable');
      } else if (rsi > 65 || (!macdBullish && !trendUp)) {
        type = 'SELL';
        confidence = 60 + Math.random() * 20;
        if (rsi > 65) reasons.push('RSI alto - ganancias');
        if (!trendUp) reasons.push('Tendencia bajista');
      } else {
        type = 'HOLD';
        confidence = 45 + Math.random() * 20;
        reasons.push('Sin señales claras', 'Esperar');
      }

      return {
        symbol: asset.symbol,
        name: asset.name,
        type,
        confidence: Math.round(confidence),
        reasons,
        category: asset.category,
        indicators: {
          rsi: Math.round(rsi),
          macd: macdBullish ? 'Bullish' : 'Bearish',
          sma: smaCross ? 'Golden Cross' : 'Death Cross',
          volume: volumeHigh ? 'Alto' : 'Normal',
          trend: trendUp ? 'Alcista' : 'Bajista',
        },
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
      {/* Filter Pills */}
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

      {/* Signals List */}
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

              {/* Confidence Bar */}
              <div className="w-full h-1.5 bg-gray-700 rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getSignalColor(signal.type)} transition-all`}
                  style={{ width: `${signal.confidence}%` }}
                />
              </div>

              {/* Indicators - Compact */}
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                <MiniIndicator label="RSI" value={signal.indicators.rsi.toString()} color={signal.indicators.rsi < 30 ? 'green' : signal.indicators.rsi > 70 ? 'red' : 'yellow'} />
                <MiniIndicator label="MACD" value={signal.indicators.macd === 'Bullish' ? '↑' : '↓'} color={signal.indicators.macd === 'Bullish' ? 'green' : 'red'} />
                <MiniIndicator label="SMA" value={signal.indicators.sma === 'Golden Cross' ? 'GC' : 'DC'} color={signal.indicators.sma === 'Golden Cross' ? 'green' : 'red'} />
                <MiniIndicator label="Vol" value={signal.indicators.volume === 'Alto' ? '▲' : '—'} color={signal.indicators.volume === 'Alto' ? 'blue' : 'gray'} />
                <MiniIndicator label="Trend" value={signal.indicators.trend === 'Alcista' ? '↑' : '↓'} color={signal.indicators.trend === 'Alcista' ? 'green' : 'red'} />
              </div>

              {/* Reasons */}
              <div className="space-y-1">
                {signal.reasons.slice(0, 2).map((reason, idx) => (
                  <p key={idx} className="text-[10px] text-gray-400 flex items-center gap-1.5">
                    {signal.type.includes('BUY') ? <CheckCircle2 className="w-2.5 h-2.5 text-green-400 shrink-0" /> :
                     signal.type.includes('SELL') ? <AlertCircle className="w-2.5 h-2.5 text-red-400 shrink-0" /> :
                     <Clock className="w-2.5 h-2.5 text-yellow-400 shrink-0" />}
                    {reason}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-sm font-semibold text-white mb-3">Resumen</h3>
        <div className="grid grid-cols-5 gap-2">
          <SummaryMini label="Fuerte" count={signals.filter(s => s.type === 'STRONG_BUY').length} color="green" />
          <SummaryMini label="Compra" count={signals.filter(s => s.type === 'BUY').length} color="green" />
          <SummaryMini label="Hold" count={signals.filter(s => s.type === 'HOLD').length} color="yellow" />
          <SummaryMini label="Venta" count={signals.filter(s => s.type === 'SELL').length} color="red" />
          <SummaryMini label="Fuerte" count={signals.filter(s => s.type === 'STRONG_SELL').length} color="red" />
        </div>
      </div>
    </div>
  );
}

function MiniIndicator({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-500/20 text-green-400',
    red: 'bg-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
    gray: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className={`text-center p-1.5 rounded-lg ${colors[color]}`}>
      <p className="text-[8px] text-gray-500 uppercase">{label}</p>
      <p className="text-xs font-bold">{value}</p>
    </div>
  );
}

function SummaryMini({ label, count, color }: { label: string; count: number; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className={`text-center p-2 rounded-lg ${colors[color]}`}>
      <p className="text-lg font-bold">{count}</p>
      <p className="text-[8px] uppercase tracking-wider">{label}</p>
    </div>
  );
}
