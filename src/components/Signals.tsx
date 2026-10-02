import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
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
        reasons.push('RSI en sobreventa extrema', 'MACD bullish confirmado', 'Tendencia alcista fuerte');
      } else if (rsi < 35 || (macdBullish && volumeHigh)) {
        type = 'BUY';
        confidence = 65 + Math.random() * 20;
        if (rsi < 35) reasons.push('RSI bajo - posible rebote');
        if (macdBullish) reasons.push('MACD cruzando al alza');
        if (volumeHigh) reasons.push('Volumen creciente');
      } else if (rsi > 75 && !macdBullish) {
        type = 'STRONG_SELL';
        confidence = 80 + Math.random() * 18;
        reasons.push('RSI en sobrecompra extrema', 'MACD bearish', 'Posible corrección fuerte');
      } else if (rsi > 65 || (!macdBullish && !trendUp)) {
        type = 'SELL';
        confidence = 60 + Math.random() * 20;
        if (rsi > 65) reasons.push('RSI alto - tomar ganancias');
        if (!trendUp) reasons.push('Tendencia bajista');
      } else {
        type = 'HOLD';
        confidence = 45 + Math.random() * 20;
        reasons.push('Sin señales claras', 'Esperar confirmación');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-400" />
              Señales de Trading en Tiempo Real
            </h2>
            <p className="text-gray-400 text-sm mt-1">Actualizado cada 10 segundos • Multi-activo: Acciones, Crypto, Forex, Commodities</p>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'buy', label: '📈 Compra' },
              { key: 'sell', label: '📉 Venta' },
              { key: 'hold', label: '⏸ Mantener' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f.key ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSignals.map(signal => {
          const label = getSignalLabel(signal.type);
          return (
            <div key={signal.symbol} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-blue-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(signal.category)} flex items-center justify-center text-white font-bold`}>
                    {signal.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{signal.symbol}</h3>
                    <p className="text-gray-400 text-xs">{signal.name} • {getCategoryLabel(signal.category)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${label.color}`}>
                    {label.text}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">Confianza: {signal.confidence}%</p>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getSignalColor(signal.type)} transition-all duration-500`}
                  style={{ width: `${signal.confidence}%` }}
                />
              </div>

              {/* Indicators */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <IndicatorBadge label="RSI" value={signal.indicators.rsi.toString()} color={signal.indicators.rsi < 30 ? 'green' : signal.indicators.rsi > 70 ? 'red' : 'yellow'} />
                <IndicatorBadge label="MACD" value={signal.indicators.macd} color={signal.indicators.macd === 'Bullish' ? 'green' : 'red'} />
                <IndicatorBadge label="SMA" value={signal.indicators.sma === 'Golden Cross' ? 'GC' : 'DC'} color={signal.indicators.sma === 'Golden Cross' ? 'green' : 'red'} />
                <IndicatorBadge label="Vol" value={signal.indicators.volume} color={signal.indicators.volume === 'Alto' ? 'blue' : 'gray'} />
                <IndicatorBadge label="Trend" value={signal.indicators.trend === 'Alcista' ? '↑' : '↓'} color={signal.indicators.trend === 'Alcista' ? 'green' : 'red'} />
              </div>

              {/* Reasons */}
              <div className="space-y-1">
                {signal.reasons.map((reason, idx) => (
                  <p key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                    {signal.type.includes('BUY') ? <CheckCircle2 className="w-3 h-3 text-green-400" /> :
                     signal.type.includes('SELL') ? <AlertCircle className="w-3 h-3 text-red-400" /> :
                     <Clock className="w-3 h-3 text-yellow-400" />}
                    {reason}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Resumen de Señales</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <SummaryCard label="Compra Fuerte" count={signals.filter(s => s.type === 'STRONG_BUY').length} color="green" />
          <SummaryCard label="Compra" count={signals.filter(s => s.type === 'BUY').length} color="green" />
          <SummaryCard label="Mantener" count={signals.filter(s => s.type === 'HOLD').length} color="yellow" />
          <SummaryCard label="Venta" count={signals.filter(s => s.type === 'SELL').length} color="red" />
          <SummaryCard label="Venta Fuerte" count={signals.filter(s => s.type === 'STRONG_SELL').length} color="red" />
        </div>
      </div>
    </div>
  );
}

function IndicatorBadge({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-500/20 text-green-400 border border-green-500/30',
    red: 'bg-red-500/20 text-red-400 border border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  return (
    <div className={`text-center p-2 rounded-lg ${colors[color]}`}>
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="text-xs font-bold">{value}</p>
    </div>
  );
}

function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
  const colors: Record<string, string> = {
    green: 'from-green-500/20 to-green-600/5 border border-green-500/20',
    yellow: 'from-yellow-500/20 to-yellow-600/5 border border-yellow-500/20',
    red: 'from-red-500/20 to-red-600/5 border border-red-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-center`}>
      <p className="text-3xl font-bold text-white">{count}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
