import { useState } from 'react';
import { Brain, Target, TrendingUp, Award, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Trade } from '../types';

interface LearningPanelProps {
  trades: Trade[];
}

export default function LearningPanel({ trades }: LearningPanelProps) {
  const [isLearning, setIsLearning] = useState(false);

  const winRate = trades.length > 0 
    ? (trades.filter(t => (t.profit || 0) > 0).length / trades.length) * 100 
    : 0;

  const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const avgProfit = trades.length > 0 ? totalProfit / trades.length : 0;

  const handleLearn = () => {
    setIsLearning(true);
    setTimeout(() => setIsLearning(false), 2000);
  };

  const winRateData = [
    { name: 'Ganadoras', value: winRate, color: '#10b981' },
    { name: 'Perdedoras', value: 100 - winRate, color: '#ef4444' },
  ];

  const radarData = [
    { subject: 'RSI', A: 85 },
    { subject: 'MACD', A: 72 },
    { subject: 'SMA', A: 68 },
    { subject: 'Vol', A: 78 },
    { subject: 'Patrones', A: 82 },
    { subject: 'Trend', A: 75 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              Motor IA
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Aprende de cada operación</p>
          </div>
          <button
            onClick={handleLearn}
            disabled={isLearning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLearning ? 'animate-spin' : ''}`} />
            {isLearning ? '...' : 'Entrenar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatMini icon={<Target className="w-3.5 h-3.5 text-blue-400" />} label="Win Rate" value={`${winRate.toFixed(0)}%`} color="blue" />
        <StatMini icon={<TrendingUp className="w-3.5 h-3.5 text-green-400" />} label="Profit Avg" value={`$${avgProfit.toFixed(0)}`} color="green" />
        <StatMini icon={<Award className="w-3.5 h-3.5 text-yellow-400" />} label="Trades" value={trades.length.toString()} color="yellow" />
        <StatMini icon={<Brain className="w-3.5 h-3.5 text-purple-400" />} label="Precisión" value="87%" color="purple" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 rounded-2xl p-3 border border-gray-700/50">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">Win Rate</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={winRateData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                {winRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[9px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {winRate.toFixed(0)}%
            </span>
            <span className="flex items-center gap-1 text-[9px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {(100 - winRate).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-3 border border-gray-700/50">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">Indicadores</h3>
          <ResponsiveContainer width="100%" height={120}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 8 }} />
              <Radar name="IA" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-xs font-semibold text-gray-400 mb-3">Progreso de Aprendizaje</h3>
        <div className="space-y-2.5">
          <LearningBar label="Patrones" value={78} />
          <LearningBar label="Tendencias" value={72} />
          <LearningBar label="Riesgo" value={85} />
          <LearningBar label="Timing" value={68} />
        </div>
      </div>
    </div>
  );
}

function StatMini({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-2.5`}>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="text-[9px] text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-base font-bold text-white">{value}</p>
    </div>
  );
}

function LearningBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
