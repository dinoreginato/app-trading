import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, BarChart3, Brain, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { stocks, generatePriceHistory } from '../utils/stockData';

interface DashboardProps {
  capital: number;
  target: number;
  trades: number;
  winRate: number;
}

export default function Dashboard({ capital, target, trades, winRate }: DashboardProps) {
  const [portfolioHistory, setPortfolioHistory] = useState<{ date: string; value: number }[]>([]);
  const [selectedStock, setSelectedStock] = useState(0);
  const [priceData, setPriceData] = useState<{ time: string; price: number }[]>([]);

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
    const data = generatePriceHistory(stocks[selectedStock].price, 30);
    setPriceData(data.map(d => ({ time: d.time, price: d.price })));
  }, [selectedStock]);

  const progress = Math.min((capital / target) * 100, 100);
  const totalGain = capital - (capital * 0.9);
  const monthlyReturn = ((totalGain / (capital * 0.9)) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Capital Actual"
          value={`$${capital.toLocaleString('es', { minimumFractionDigits: 2 })}`}
          change={`+${monthlyReturn}% este mes`}
          positive={true}
          color="blue"
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          title="Meta"
          value={`$${target.toLocaleString('es', { minimumFractionDigits: 2 })}`}
          change={`${progress.toFixed(1)}% completado`}
          positive={true}
          color="green"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          title="Operaciones"
          value={trades.toString()}
          change={`${winRate}% win rate`}
          positive={winRate > 50}
          color="purple"
        />
        <StatCard
          icon={<Brain className="w-5 h-5" />}
          title="IA Confianza"
          value="87%"
          change="Mejorando +2.3%"
          positive={true}
          color="orange"
        />
      </div>

      {/* Portfolio Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Evolución del Portafolio
          </h3>
          <div className="flex gap-2">
            {['7D', '1M', '3M', '1A'].map(period => (
              <button key={period} className="px-3 py-1 text-xs rounded-lg bg-gray-700/50 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
                {period}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={portfolioHistory}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => [`$${value.toLocaleString('es', { minimumFractionDigits: 2 })}`, 'Valor']}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Movers & Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Top Movimientos
          </h3>
          <div className="space-y-3">
            {stocks.slice(0, 6).map((stock, idx) => (
              <div
                key={stock.symbol}
                onClick={() => setSelectedStock(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  selectedStock === idx ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{stock.symbol}</p>
                    <p className="text-gray-400 text-xs">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${stock.price.toFixed(2)}</p>
                  <p className={`text-xs flex items-center gap-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            {stocks[selectedStock]?.symbol} - Precio
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickFormatter={(v) => v.slice(5)} />
              <YAxis stroke="#9ca3af" fontSize={10} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Precio']}
              />
              <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Progress to target */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progreso hacia la meta</span>
              <span className="text-green-400 font-medium">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, change, positive, color }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/20',
  };

  const iconColors: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    orange: 'text-orange-400 bg-orange-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColors[color]}`}>
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}
