import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, Brain, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { assets, generatePriceHistory, getCategoryColor, getCategoryLabel } from '../utils/stockData';
import { AssetCategory } from '../types';

interface DashboardProps {
  capital: number;
  target: number;
  trades: number;
  winRate: number;
  selectedCategory: AssetCategory | 'all';
}

export default function Dashboard({ capital, target, trades, winRate, selectedCategory }: DashboardProps) {
  const [portfolioHistory, setPortfolioHistory] = useState<{ date: string; value: number }[]>([]);
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [priceData, setPriceData] = useState<{ time: string; price: number }[]>([]);

  const filteredAssets = selectedCategory === 'all' ? assets.slice(0, 12) : assets.filter(a => a.category === selectedCategory).slice(0, 8);

  useEffect(() => {
    const history = [];
    let value = capital;
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      value = value * (1 + (Math.random() - 0.4) * 0.03);
      history.push({
        date: date.toLocaleDateString('es', { day: '2-digit', month: 'short' }),
        value: Math.round(value * 100) / 100,
      });
    }
    setPortfolioHistory(history);
  }, [capital]);

  useEffect(() => {
    if (filteredAssets.length > 0) {
      const data = generatePriceHistory(filteredAssets[selectedAsset % filteredAssets.length].price, 30);
      setPriceData(data.map(d => ({ time: d.time, price: d.price })));
    }
  }, [selectedAsset, selectedCategory]);

  const progress = Math.min((capital / target) * 100, 100);
  const monthlyReturn = 12.45;
  const currentAsset = filteredAssets[selectedAsset % filteredAssets.length];

  return (
    <div className="space-y-4">
      {/* Hero Card - Capital Principal */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-5 shadow-xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Capital Total</p>
          <p className="text-3xl sm:text-4xl font-bold text-white mt-1">
            ${capital.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full text-green-300 text-xs font-medium">
              <ArrowUpRight className="w-3 h-3" />
              +{monthlyReturn}%
            </span>
            <span className="text-xs text-blue-100">este mes</span>
          </div>
        </div>

        {/* Mini Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-100 mb-1.5">
            <span>Meta: ${target.toLocaleString()}</span>
            <span className="font-bold">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <QuickStat icon={<Activity className="w-4 h-4" />} label="Operaciones" value={trades.toString()} sublabel={`${winRate.toFixed(0)}% win rate`} color="purple" />
        <QuickStat icon={<Brain className="w-4 h-4" />} label="IA Confianza" value="87%" sublabel="+2.3% hoy" color="orange" />
        <QuickStat icon={<Target className="w-4 h-4" />} label="Mejor Trade" value="+$342" sublabel="NVDA" color="green" />
        <QuickStat icon={<Zap className="w-4 h-4" />} label="Señales Hoy" value="12" sublabel="8 compra" color="blue" />
      </div>

      {/* Portfolio Chart */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            Portafolio
          </h3>
          <div className="flex gap-1">
            {['7D', '1M', '3M'].map(period => (
              <button key={period} className="px-2 py-1 text-[10px] rounded-md bg-gray-700/50 text-gray-400 active:bg-blue-600 active:text-white transition-colors">
                {period}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={portfolioHistory}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => [`$${value.toLocaleString('es', { maximumFractionDigits: 0 })}`, 'Valor']}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorValue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Movers */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Top Movimientos
          </h3>
          <span className="text-[10px] text-gray-400">{getCategoryLabel(selectedCategory === 'all' ? 'stocks' : selectedCategory)}</span>
        </div>
        <div className="space-y-2">
          {filteredAssets.slice(0, 5).map((asset, idx) => (
            <button
              key={asset.symbol}
              onClick={() => setSelectedAsset(idx)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all active:scale-[0.98] ${
                selectedAsset === idx ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-gray-900/30 hover:bg-gray-700/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getCategoryColor(asset.category)} flex items-center justify-center text-white font-bold text-[10px]`}>
                  {asset.category === 'crypto' ? asset.icon || asset.symbol.slice(0, 1) : asset.symbol.slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{asset.symbol}</p>
                  <p className="text-gray-400 text-[10px] truncate max-w-[100px]">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-sm">${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toFixed(2)}</p>
                <p className={`text-[10px] font-medium flex items-center gap-0.5 justify-end ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mini Chart Selected Asset */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{currentAsset?.symbol}</h3>
            <p className="text-[10px] text-gray-400">{currentAsset?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">${currentAsset?.price < 1 ? currentAsset?.price.toFixed(4) : currentAsset?.price.toFixed(2)}</p>
            <p className={`text-xs font-medium ${currentAsset?.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {currentAsset?.change >= 0 ? '+' : ''}{currentAsset?.changePercent.toFixed(2)}%
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={priceData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: '11px' }}
              formatter={(value: number) => [`$${value.toFixed(value < 1 ? 4 : 2)}`, 'Precio']}
            />
            <Area type="monotone" dataKey="price" stroke="#10b981" fill="url(#colorPrice)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value, sublabel, color }: {
  icon: React.ReactNode; label: string; value: string; sublabel: string; color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-3`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>
    </div>
  );
}
