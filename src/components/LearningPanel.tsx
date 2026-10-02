import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, BarChart3, Award, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getLearningStats, getPatterns } from '../utils/learningEngine';
import { Trade } from '../types';

interface LearningPanelProps {
  trades: Trade[];
}

export default function LearningPanel({ trades }: LearningPanelProps) {
  const [stats, setStats] = useState(getLearningStats(trades));
  const [patterns, setPatterns] = useState(getPatterns());
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    setStats(getLearningStats(trades));
    setPatterns(getPatterns());
  }, [trades]);

  const handleLearn = () => {
    setIsLearning(true);
    setTimeout(() => {
      setStats(getLearningStats(trades));
      setPatterns(getPatterns());
      setIsLearning(false);
    }, 2000);
  };

  const winRateData = [
    { name: 'Ganadoras', value: stats.winRate, color: '#10b981' },
    { name: 'Perdedoras', value: 100 - stats.winRate, color: '#ef4444' },
  ];

  const radarData = [
    { subject: 'RSI', A: 85 },
    { subject: 'MACD', A: 72 },
    { subject: 'SMA', A: 68 },
    { subject: 'Volumen', A: 78 },
    { subject: 'Patrones', A: 82 },
    { subject: 'Tendencia', A: 75 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Motor de Aprendizaje IA
            </h2>
            <p className="text-gray-400 text-sm mt-1">El sistema aprende de cada operación para mejorar sus decisiones</p>
          </div>
          <button
            onClick={handleLearn}
            disabled={isLearning}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLearning ? 'animate-spin' : ''}`} />
            {isLearning ? 'Aprendiendo...' : 'Entrenar Modelo'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={<Target className="w-5 h-5 text-blue-400" />} label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} color="blue" />
        <MetricCard icon={<TrendingUp className="w-5 h-5 text-green-400" />} label="Profit Promedio" value={`+$${stats.avgProfit.toFixed(2)}`} color="green" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5 text-red-400" />} label="Loss Promedio" value={`-$${Math.abs(stats.avgLoss).toFixed(2)}`} color="red" />
        <MetricCard icon={<Award className="w-5 h-5 text-yellow-400" />} label="Sharpe Ratio" value={stats.sharpeRatio.toFixed(2)} color="yellow" />
        <MetricCard icon={<BarChart3 className="w-5 h-5 text-purple-400" />} label="Total Trades" value={stats.totalTrades.toString()} color="purple" />
        <MetricCard icon={<TrendingUp className="w-5 h-5 text-green-400" />} label="Mejor Trade" value={`+$${stats.bestTrade.toFixed(2)}`} color="green" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5 text-red-400" />} label="Peor Trade" value={`-$${Math.abs(stats.worstTrade).toFixed(2)}`} color="red" />
        <MetricCard icon={<Brain className="w-5 h-5 text-blue-400" />} label="Precisión IA" value={`${stats.accuracy.toFixed(1)}%`} color="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Win Rate Pie */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Win Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={winRateData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {winRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">Ganadoras ({stats.winRate.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-400">Perdedoras ({(100 - stats.winRate).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Competencia por Indicador</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Radar name="IA" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Progress */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Progreso de Aprendizaje</h3>
          <div className="space-y-4">
            <LearningBar label="Reconocimiento de patrones" value={78} />
            <LearningBar label="Predicción de tendencias" value={72} />
            <LearningBar label="Gestión de riesgo" value={85} />
            <LearningBar label="Timing de entrada" value={68} />
            <LearningBar label="Timing de salida" value={74} />
            <LearningBar label="Análisis de volumen" value={81} />
          </div>
          <div className="mt-4 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <p className="text-xs text-purple-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Tasa de aprendizaje: {(stats.learningRate * 100).toFixed(3)}% por iteración
            </p>
          </div>
        </div>
      </div>

      {/* Patterns */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Patrones Aprendidos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((pattern, idx) => (
            <div key={idx} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{pattern.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pattern.successRate > 70 ? 'bg-green-500/20 text-green-400' :
                  pattern.successRate > 60 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {pattern.successRate.toFixed(0)}% éxito
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-3">{pattern.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{pattern.occurrences} veces usado</span>
                <span className={pattern.avgReturn > 0 ? 'text-green-400' : 'text-red-400'}>
                  Retorno promedio: {pattern.avgReturn > 0 ? '+' : ''}{pattern.avgReturn.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${pattern.successRate > 70 ? 'bg-green-500' : pattern.successRate > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${pattern.successRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Max Drawdown */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Métricas de Riesgo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-900/50 rounded-xl">
            <p className="text-3xl font-bold text-red-400">{stats.maxDrawdown.toFixed(1)}%</p>
            <p className="text-sm text-gray-400 mt-1">Max Drawdown</p>
            <p className="text-xs text-gray-500 mt-1">Mayor caída desde máximo</p>
          </div>
          <div className="text-center p-4 bg-gray-900/50 rounded-xl">
            <p className="text-3xl font-bold text-blue-400">{stats.sharpeRatio.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-1">Sharpe Ratio</p>
            <p className="text-xs text-gray-500 mt-1">Rendimiento ajustado al riesgo</p>
          </div>
          <div className="text-center p-4 bg-gray-900/50 rounded-xl">
            <p className="text-3xl font-bold text-green-400">{stats.accuracy.toFixed(0)}%</p>
            <p className="text-sm text-gray-400 mt-1">Precisión del Modelo</p>
            <p className="text-xs text-gray-500 mt-1">Aciertos en predicciones</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    green: 'from-green-500/10 to-green-600/5 border-green-500/20',
    red: 'from-red-500/10 to-red-600/5 border-red-500/20',
    yellow: 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function LearningBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
