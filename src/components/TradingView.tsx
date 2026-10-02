import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { assets, generatePriceHistory, getCategoryColor, getCategoryLabel } from '../utils/stockData';
import { AssetCategory, PricePoint } from '../types';

interface TradingViewProps {
  selectedCategory: AssetCategory | 'all';
}

export default function TradingView({ selectedCategory }: TradingViewProps) {
  const filteredAssets = selectedCategory === 'all' ? assets.slice(0, 12) : assets.filter(a => a.category === selectedCategory);
  
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [showIndicators, setShowIndicators] = useState({ sma20: true, sma50: true, volume: false });
  const [timeframe, setTimeframe] = useState('1M');

  useEffect(() => {
    const days = timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 180;
    if (filteredAssets.length > 0) {
      const data = generatePriceHistory(filteredAssets[selectedAsset % filteredAssets.length].price, days);
      setPriceData(data);
    }
  }, [selectedAsset, timeframe, selectedCategory]);

  const asset = filteredAssets[selectedAsset % filteredAssets.length];
  if (!asset) return null;
  
  const lastPoint = priceData[priceData.length - 1];
  const rsi = lastPoint?.rsi || 50;

  const getRSIColor = (rsi: number) => {
    if (rsi < 30) return 'text-green-400';
    if (rsi > 70) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getRSILabel = (rsi: number) => {
    if (rsi < 30) return 'Sobreventa - Comprar';
    if (rsi > 70) return 'Sobrecompra - Vender';
    return 'Neutral';
  };

  const buySignals = priceData.filter(p => p.buySignal).length;
  const sellSignals = priceData.filter(p => p.sellSignal).length;

  return (
    <div className="space-y-6">
      {/* Asset Selector */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex flex-wrap gap-2 mb-6">
          {filteredAssets.map((a, idx) => (
            <button
              key={a.symbol}
              onClick={() => setSelectedAsset(idx)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedAsset === idx
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {a.symbol}
            </button>
          ))}
        </div>

        {/* Asset Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(asset.category)} flex items-center justify-center text-white font-bold`}>
              {asset.category === 'crypto' ? asset.icon || asset.symbol.slice(0, 1) : asset.symbol.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{asset.symbol}</h2>
              <p className="text-gray-400">{asset.name} • {getCategoryLabel(asset.category)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toFixed(2)}</p>
            <p className={`text-lg flex items-center gap-1 ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {asset.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Timeframe */}
        <div className="flex gap-2 mb-4">
          {['1W', '1M', '3M', '6M'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                timeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={priceData}>
            <defs>
              <linearGradient id="colorPriceMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => v.slice(5)} />
            <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v) => v < 1 ? v.toFixed(4) : v.toFixed(2)} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => [`$${value.toFixed(value < 1 ? 4 : 2)}`, 'Precio']}
            />
            <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="url(#colorPriceMain)" strokeWidth={2} name="Precio" />
            {showIndicators.sma20 && <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="SMA 20" />}
            {showIndicators.sma50 && <Line type="monotone" dataKey="sma50" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="SMA 50" />}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Indicators Toggle */}
        <div className="flex flex-wrap gap-3 mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showIndicators.sma20} onChange={() => setShowIndicators(prev => ({ ...prev, sma20: !prev.sma20 }))} className="rounded text-yellow-500" />
            <span className="w-3 h-0.5 bg-yellow-500 inline-block"></span> SMA 20
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showIndicators.sma50} onChange={() => setShowIndicators(prev => ({ ...prev, sma50: !prev.sma50 }))} className="rounded text-purple-500" />
            <span className="w-3 h-0.5 bg-purple-500 inline-block"></span> SMA 50
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showIndicators.volume} onChange={() => setShowIndicators(prev => ({ ...prev, volume: !prev.volume }))} className="rounded text-blue-500" />
            Volumen
          </label>
        </div>
      </div>

      {/* RSI & Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RSI Gauge */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">RSI (14)</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#374151" strokeWidth="12" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={rsi < 30 ? '#10b981' : rsi > 70 ? '#ef4444' : '#f59e0b'}
                  strokeWidth="12"
                  strokeDasharray={`${(rsi / 100) * 352} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${getRSIColor(rsi)}`}>{rsi.toFixed(0)}</span>
                <span className="text-xs text-gray-400">RSI</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className={`font-medium ${getRSIColor(rsi)}`}>{getRSILabel(rsi)}</p>
            <p className="text-xs text-gray-400 mt-1">
              {rsi < 30 ? '🟢 Zona de compra - RSI bajo indica posible rebote' :
               rsi > 70 ? '🔴 Zona de venta - RSI alto indica posible corrección' :
               '🟡 Zona neutral - Esperar señales más claras'}
            </p>
          </div>
        </div>

        {/* Signals Summary */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Señales del Período</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Señales de Compra</span>
              </div>
              <span className="text-2xl font-bold text-green-400">{buySignals}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Señales de Venta</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{sellSignals}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Señales Pendientes</span>
              </div>
              <span className="text-2xl font-bold text-yellow-400">{Math.floor(Math.random() * 5) + 1}</span>
            </div>
          </div>
        </div>

        {/* Trading Tips */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Tips de Trading</h3>
          <div className="space-y-3">
            <TipCard type="buy" text="Comprar cuando RSI < 30 y precio toca soporte" active={rsi < 35} />
            <TipCard type="sell" text="Vender cuando RSI > 70 y hay divergencia" active={rsi > 65} />
            <TipCard type="buy" text="Golden Cross: SMA20 cruza sobre SMA50" active={lastPoint?.sma20 !== undefined && lastPoint?.sma50 !== undefined && lastPoint.sma20 > lastPoint.sma50} />
            <TipCard type="sell" text="Death Cross: SMA20 cruza bajo SMA50" active={lastPoint?.sma20 !== undefined && lastPoint?.sma50 !== undefined && lastPoint.sma20 < lastPoint.sma50} />
            <TipCard type="info" text="Nunca invertir más del 5% en una sola operación" active={true} />
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      {showIndicators.volume && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Volumen de Operaciones</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priceData.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => v.slice(5)} />
              <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
                formatter={(value: number) => [`${(value/1000000).toFixed(2)}M`, 'Volumen']}
              />
              <Bar dataKey="volume" fill="#3b82f6" opacity={0.7} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function TipCard({ type, text, active }: { type: 'buy' | 'sell' | 'info'; text: string; active: boolean }) {
  const colors = {
    buy: active ? 'border-green-500/40 bg-green-500/10' : 'border-gray-700 bg-gray-800/30',
    sell: active ? 'border-red-500/40 bg-red-500/10' : 'border-gray-700 bg-gray-800/30',
    info: 'border-blue-500/30 bg-blue-500/5',
  };

  const icons = {
    buy: active ? '🟢' : '⚪',
    sell: active ? '🔴' : '⚪',
    info: '🔵',
  };

  return (
    <div className={`p-3 rounded-xl border ${colors[type]} transition-all`}>
      <p className="text-sm text-gray-300 flex items-center gap-2">
        <span>{icons[type]}</span>
        {text}
        {active && type !== 'info' && <span className="ml-auto text-xs text-green-400 font-medium">ACTIVA</span>}
      </p>
    </div>
  );
}
