import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Settings, DollarSign, Target, Calendar, Shield, Zap, Brain, TrendingUp } from 'lucide-react';
import { AutoTraderConfig, Trade } from '../types';
import { simulateAutoTrade } from '../utils/learningEngine';
import { stocks } from '../utils/stockData';

interface AutoTraderProps {
  onTradeUpdate: (trades: Trade[]) => void;
  onCapitalUpdate: (capital: number) => void;
}

export default function AutoTrader({ onTradeUpdate, onCapitalUpdate }: AutoTraderProps) {
  const [config, setConfig] = useState<AutoTraderConfig>({
    initialCapital: 10000,
    targetAmount: 15000,
    targetDate: '2024-12-31',
    riskLevel: 'moderate',
    isActive: false,
    maxPositionSize: 10,
    stopLossPercent: 3,
    takeProfitPercent: 5,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentCapital, setCurrentCapital] = useState(config.initialCapital);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [day, setDay] = useState(0);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
  }, []);

  const startTrading = useCallback(() => {
    setIsRunning(true);
    setCurrentCapital(config.initialCapital);
    setTrades([]);
    setDay(0);
    addLog('🚀 Auto-Trader iniciado');
    addLog(`💰 Capital inicial: $${config.initialCapital.toLocaleString()}`);
    addLog(`🎯 Meta: $${config.targetAmount.toLocaleString()}`);
    addLog(`⚡ Nivel de riesgo: ${config.riskLevel}`);
  }, [config, addLog]);

  const stopTrading = useCallback(() => {
    setIsRunning(false);
    addLog('⏸️ Auto-Trader pausado');
    addLog(`💰 Capital final: $${currentCapital.toFixed(2)}`);
    const profit = currentCapital - config.initialCapital;
    addLog(`📊 Ganancia/Pérdida: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
  }, [currentCapital, config.initialCapital, addLog]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDay(prev => {
        const newDay = prev + 1;
        if (newDay > 30) {
          setIsRunning(false);
          addLog('✅ Ciclo de 30 días completado');
          return prev;
        }
        return newDay;
      });

      // Simulate trades
      const numTrades = Math.floor(Math.random() * 3) + 1;
      const newTrades: Trade[] = [];

      for (let i = 0; i < numTrades; i++) {
        const stock = stocks[Math.floor(Math.random() * stocks.length)];
        const isBuy = Math.random() > 0.4;
        const riskMultiplier = config.riskLevel === 'aggressive' ? 0.12 : config.riskLevel === 'moderate' ? 0.07 : 0.04;
        const tradeAmount = currentCapital * riskMultiplier * (0.5 + Math.random() * 0.5);
        
        const profitPercent = (Math.random() - 0.35) * 6;
        const profit = tradeAmount * (profitPercent / 100);

        const reasons = [
          'RSI en sobreventa - oportunidad detectada',
          'Golden Cross confirmado en gráfico diario',
          'MACD bullish crossover - momentum positivo',
          'Volumen inusualmente alto - breakout probable',
          'Precio en soporte clave - rebote esperado',
          'RSI sobrecompra - tomando ganancias',
          'Stop loss activado - gestión de riesgo',
          'Divergencia bajista detectada',
        ];

        const trade: Trade = {
          id: `auto-${Date.now()}-${i}`,
          symbol: stock.symbol,
          type: isBuy ? 'BUY' : 'SELL',
          price: stock.price * (1 + (Math.random() - 0.5) * 0.02),
          quantity: Math.floor(tradeAmount / stock.price),
          total: tradeAmount,
          date: new Date().toISOString().split('T')[0],
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          confidence: 65 + Math.random() * 30,
          profit: isBuy ? profit : -profit * 0.3,
        };

        newTrades.push(trade);
        setCurrentCapital(prev => prev + profit);

        if (isBuy) {
          addLog(`📈 COMPRA ${stock.symbol} @ $${trade.price.toFixed(2)} | Confianza: ${trade.confidence.toFixed(0)}%`);
        } else {
          addLog(`📉 VENTA ${stock.symbol} @ $${trade.price.toFixed(2)} | P&L: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
        }
      }

      setTrades(prev => [...newTrades, ...prev]);
      onTradeUpdate([...newTrades, ...trades]);
      onCapitalUpdate(currentCapital);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, currentCapital, config.riskLevel, addLog, trades, onTradeUpdate, onCapitalUpdate]);

  const progress = ((currentCapital - config.initialCapital) / (config.targetAmount - config.initialCapital)) * 100;

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Auto-Trader IA
          </h2>
          <button
            onClick={isRunning ? stopTrading : startTrading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Detener' : 'Iniciar Trading'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ConfigInput
            icon={<DollarSign className="w-4 h-4" />}
            label="Capital Inicial"
            value={config.initialCapital}
            onChange={(v) => setConfig(prev => ({ ...prev, initialCapital: v }))}
            prefix="$"
            disabled={isRunning}
          />
          <ConfigInput
            icon={<Target className="w-4 h-4" />}
            label="Meta de Ganancia"
            value={config.targetAmount}
            onChange={(v) => setConfig(prev => ({ ...prev, targetAmount: v }))}
            prefix="$"
            disabled={isRunning}
          />
          <ConfigInput
            icon={<Calendar className="w-4 h-4" />}
            label="Fecha Límite"
            value={config.targetDate}
            onChange={(v) => setConfig(prev => ({ ...prev, targetDate: v as any }))}
            type="date"
            disabled={isRunning}
          />
          <div className="space-y-1">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Nivel de Riesgo
            </label>
            <select
              value={config.riskLevel}
              onChange={(e) => setConfig(prev => ({ ...prev, riskLevel: e.target.value as any }))}
              disabled={isRunning}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="conservative">🛡️ Conservador (4% por operación)</option>
              <option value="moderate">⚖️ Moderado (8% por operación)</option>
              <option value="aggressive">🔥 Agresivo (15% por operación)</option>
            </select>
          </div>
          <ConfigInput
            icon={<Shield className="w-4 h-4" />}
            label="Stop Loss (%)"
            value={config.stopLossPercent}
            onChange={(v) => setConfig(prev => ({ ...prev, stopLossPercent: v }))}
            suffix="%"
            disabled={isRunning}
          />
          <ConfigInput
            icon={<TrendingUp className="w-4 h-4" />}
            label="Take Profit (%)"
            value={config.takeProfitPercent}
            onChange={(v) => setConfig(prev => ({ ...prev, takeProfitPercent: v }))}
            suffix="%"
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Status Panel */}
      {isRunning && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Estado en Tiempo Real
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Capital Actual</span>
                <span className="text-xl font-bold text-white">${currentCapital.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ganancia/Pérdida</span>
                <span className={`text-lg font-bold ${currentCapital >= config.initialCapital ? 'text-green-400' : 'text-red-400'}`}>
                  {currentCapital >= config.initialCapital ? '+' : ''}${(currentCapital - config.initialCapital).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Operaciones Realizadas</span>
                <span className="text-lg font-bold text-white">{trades.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Día</span>
                <span className="text-lg font-bold text-white">{day}/30</span>
              </div>

              {/* Progress Bar */}
              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progreso hacia meta</span>
                  <span className="text-blue-400 font-medium">{Math.max(0, progress).toFixed(1)}%</span>
                </div>
                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-500 relative"
                    style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${config.initialCapital.toLocaleString()}</span>
                  <span>${config.targetAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Registro de Actividad
            </h3>
            <div className="h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600">
              {logs.map((log, idx) => (
                <div key={idx} className="text-sm text-gray-300 p-2 bg-gray-900/50 rounded-lg font-mono">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-gray-500 text-center py-8">Esperando operaciones...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Trades */}
      {trades.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Últimas Operaciones</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Tipo</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Activo</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Precio</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Total</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Confianza</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">P&L</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Razón</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 10).map(trade => (
                  <tr key={trade.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.type === 'BUY' ? '📈 COMPRA' : '📉 VENTA'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-white font-medium">{trade.symbol}</td>
                    <td className="py-3 px-2 text-gray-300">${trade.price.toFixed(2)}</td>
                    <td className="py-3 px-2 text-gray-300">${trade.total.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${trade.confidence}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs">{trade.confidence.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className={`py-3 px-2 font-medium ${(trade.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(trade.profit || 0) >= 0 ? '+' : ''}${(trade.profit || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-gray-400 text-xs max-w-48 truncate">{trade.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🧠 Cómo funciona el Auto-Trader IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TipStep number={1} title="Analiza" description="Escanea el mercado 24/7 buscando patrones y oportunidades" />
          <TipStep number={2} title="Evalúa" description="Calcula RSI, MACD, SMAs y otros indicadores técnicos" />
          <TipStep number={3} title="Decide" description="Compra o vende basándose en su modelo de aprendizaje" />
          <TipStep number={4} title="Aprende" description="Mejora sus decisiones con cada operación realizada" />
        </div>
      </div>
    </div>
  );
}

function ConfigInput({ icon, label, value, onChange, prefix, suffix, type = 'number', disabled }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  onChange: (value: any) => void;
  prefix?: string;
  suffix?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-400 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          disabled={disabled}
          className={`w-full bg-gray-700/50 border border-gray-600 rounded-xl py-2.5 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 ${prefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-8' : 'pr-4'}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

function TipStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {number}
      </div>
      <div>
        <h4 className="text-white font-medium text-sm">{title}</h4>
        <p className="text-gray-400 text-xs mt-1">{description}</p>
      </div>
    </div>
  );
}
