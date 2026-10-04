import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { assets, generatePriceHistory, getCategoryColor, getCategoryLabel } from '../utils/stockData';
import { AssetCategory, PricePoint } from '../types';

interface TradingViewProps {
  selectedCategory: AssetCategory | 'all';
}

export default function TradingView({ selectedCategory }: TradingViewProps) {
  const filteredAssets = selectedCategory === 'all' ? assets.slice(0, 12) : assets.filter(a => a.category === selectedCategory);
  
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [showIndicators, setShowIndicators] = useState({ sma20: true, sma50: true });
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

  const buySignals = priceData.filter(p => p.buySignal).length;
  const sellSignals = priceData.filter(p => p.sellSignal).length;

  return (
    <div className="space-y-4">
      {/* Asset Selector - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {filteredAssets.map((a, idx) => (
          <button
            key={a.symbol}
            onClick={() => setSelectedAsset(idx)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 shrink-0 ${
              selectedAsset === idx
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-gray-800 text-gray-300 border border-gray-700'
            }`}
          >
            <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${getCategoryColor(a.category)} flex items-center justify-center text-white text-[9px] font-bold`}>
              {a.category === 'crypto' ? a.icon || a.symbol.slice(0, 1) : a.symbol.slice(0, 2)}
            </span>
            {a.symbol}
          </button>
        ))}
      </div>

      {/* Asset Info Card */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getCategoryColor(asset.category)} flex items-center justify-center text-white font-bold text-sm`}>
              {asset.category === 'crypto' ? asset.icon || asset.symbol.slice(0, 1) : asset.symbol.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{asset.symbol}</h2>
              <p className="text-[10px] text-gray-400">{asset.name} • {getCategoryLabel(asset.category)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toFixed(2)}</p>
            <p className={`text-xs font-medium flex items-center gap-0.5 justify-end ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Timeframe */}
        <div className="flex gap-1.5 mb-3">
          {['1W', '1M', '3M', '6M'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-all active:scale-95 ${
                timeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-400'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={priceData}>
            <defs>
              <linearGradient id="colorPriceMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={9} tickFormatter={(v) => v.slice(5)} interval="preserveStartEnd" />
            <YAxis stroke="#9ca3af" fontSize={9} domain={['auto', 'auto']} tickFormatter={(v) => v < 1 ? v.toFixed(3) : v.toFixed(0)} width={45} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: '11px' }}
              formatter={(value: number) => [`$${value.toFixed(value < 1 ? 4 : 2)}`, 'Precio']}
            />
            <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="url(#colorPriceMain)" strokeWidth={2} />
            {showIndicators.sma20 && <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} />}
            {showIndicators.sma50 && <Line type="monotone" dataKey="sma50" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Indicators Toggle */}
        <div className="flex gap-2 mt-3">
          <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showIndicators.sma20} onChange={() => setShowIndicators(prev => ({ ...prev, sma20: !prev.sma20 }))} className="w-3.5 h-3.5 rounded" />
            <span className="w-2 h-0.5 bg-yellow-500 inline-block rounded"></span> SMA 20
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showIndicators.sma50} onChange={() => setShowIndicators(prev => ({ ...prev, sma50: !prev.sma50 }))} className="w-3.5 h-3.5 rounded" />
            <span className="w-2 h-0.5 bg-purple-500 inline-block rounded"></span> SMA 50
          </label>
        </div>
      </div>

      {/* RSI & Signals - Compact Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* RSI */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">RSI</h3>
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#374151" strokeWidth="5" />
                <circle
                  cx="28" cy="28" r="22" fill="none"
                  stroke={rsi < 30 ? '#10b981' : rsi > 70 ? '#ef4444' : '#f59e0b'}
                  strokeWidth="5"
                  strokeDasharray={`${(rsi / 100) * 138} 138`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${getRSIColor(rsi)}`}>{rsi.toFixed(0)}</span>
              </div>
            </div>
            <div>
              <p className={`text-xs font-medium ${getRSIColor(rsi)}`}>
                {rsi < 30 ? 'Sobreventa' : rsi > 70 ? 'Sobrecompra' : 'Neutral'}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {rsi < 30 ? '🟢 Comprar' : rsi > 70 ? '🔴 Vender' : '🟡 Esperar'}
              </p>
            </div>
          </div>
        </div>

        {/* Signals */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Señales</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-gray-300">Compra</span>
              </div>
              <span className="text-sm font-bold text-green-400">{buySignals}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs text-gray-300">Venta</span>
              </div>
              <span className="text-sm font-bold text-red-400">{sellSignals}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs text-gray-300">Pendiente</span>
              </div>
              <span className="text-sm font-bold text-yellow-400">{Math.floor(Math.random() * 5) + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Tips */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-sm font-semibold text-white mb-3">💡 Tips Activos</h3>
        <div className="space-y-2">
          <TipRow active={rsi < 35} text="RSI < 30 + soporte → Comprar" type="buy" />
          <TipRow active={rsi > 65} text="RSI > 70 + divergencia → Vender" type="sell" />
          <TipRow active={lastPoint?.sma20 !== undefined && lastPoint?.sma50 !== undefined && lastPoint.sma20 > lastPoint.sma50} text="Golden Cross: SMA20 > SMA50" type="buy" />
          <TipRow active={true} text="Max 5% del capital por operación" type="info" />
        </div>
      </div>
    </div>
  );
}

function TipRow({ active, text, type }: { active: boolean; text: string; type: 'buy' | 'sell' | 'info' }) {
  const colors = {
    buy: active ? 'border-green-500/30 bg-green-500/5' : 'border-gray-700/50 bg-gray-900/30',
    sell: active ? 'border-red-500/30 bg-red-500/5' : 'border-gray-700/50 bg-gray-900/30',
    info: 'border-blue-500/20 bg-blue-500/5',
  };

  const icons = { buy: active ? '🟢' : '⚪', sell: active ? '🔴' : '⚪', info: '🔵' };

  return (
    <div className={`p-2.5 rounded-xl border ${colors[type]} flex items-center gap-2`}>
      <span className="text-xs">{icons[type]}</span>
      <span className="text-xs text-gray-300 flex-1">{text}</span>
      {active && type !== 'info' && <span className="text-[9px] text-green-400 font-bold">ACTIVA</span>}
    </div>
  );
}
