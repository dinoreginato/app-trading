import { useState, useEffect } from 'react';
import { Play, Pause, Settings, DollarSign, Target, Calendar, Shield, Zap, Brain, Link2, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import BrokerConfig, { BrokerConfig as BrokerConfigType } from './BrokerConfig';
import { tradingService } from '../services/tradingService';
import { Trade, AssetCategory } from '../types';

interface AutoTraderProps {
  onTradeUpdate: (trades: Trade[]) => void;
  onCapitalUpdate: (capital: number) => void;
  selectedCategory: AssetCategory | 'all';
}

export default function AutoTrader({ onTradeUpdate, onCapitalUpdate, selectedCategory }: AutoTraderProps) {
  const [config, setConfig] = useState({
    initialCapital: 10000,
    targetAmount: 15000,
    targetDate: '2025-12-31',
    riskLevel: 'moderate',
    maxPositionSize: 10,
    stopLossPercent: 3,
    takeProfitPercent: 5,
    baseCurrency: 'USD',
    categories: selectedCategory === 'all' ? ['stocks', 'crypto', 'forex', 'commodities'] : [selectedCategory],
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentCapital, setCurrentCapital] = useState(config.initialCapital);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [day, setDay] = useState(0);
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [brokerConfig, setBrokerConfig] = useState<BrokerConfigType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
  };

  const handleBrokerConfigUpdate = (newConfig: BrokerConfigType) => {
    setBrokerConfig(newConfig);
    tradingService.setConfig(newConfig);
    addLog(`✅ Broker configurado: ${newConfig.broker}`);
    addLog(`Modo: ${newConfig.isPaperTrading ? 'Paper Trading (Simulación)' : 'Live Trading (Real)'}`);
    setShowBrokerModal(false);
  };

  const startTrading = () => {
    if (!brokerConfig?.isConfigured) {
      addLog('⚠️ Debes configurar un broker primero');
      setShowBrokerModal(true);
      return;
    }

    setIsRunning(true);
    setCurrentCapital(config.initialCapital);
    setTrades([]);
    setDay(0);
    addLog('🚀 Auto-Trader iniciado');
    addLog(`💰 Capital inicial: $${config.initialCapital.toLocaleString()}`);
    addLog(`🎯 Meta: $${config.targetAmount.toLocaleString()}`);
    addLog(`⚡ Nivel de riesgo: ${config.riskLevel}`);
    
    if (brokerConfig.isPaperTrading) {
      addLog('📋 Modo: Paper Trading (Simulación)');
    } else {
      addLog('💵 Modo: Live Trading (Dinero Real)');
      addLog('⚠️ Las operaciones se ejecutarán con dinero real');
    }
  };

  const stopTrading = () => {
    setIsRunning(false);
    addLog('⏸️ Auto-Trader pausado');
    addLog(`💰 Capital final: $${currentCapital.toFixed(2)}`);
    const profit = currentCapital - config.initialCapital;
    addLog(`📊 Ganancia/Pérdida: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
  };

  const executeTrade = async (trade: any) => {
    // Ejecutar orden real
    const result = await tradingService.executeOrder({
      symbol: trade.symbol,
      side: trade.type.toLowerCase() as 'buy' | 'sell',
      quantity: trade.quantity,
      type: 'market',
    });

    if (result.success) {
      addLog(`✅ Orden ejecutada: ${trade.type} ${trade.symbol}`);
      addLog(`💲 Precio: $${result.filledPrice?.toFixed(2)}`);
      addLog(`📊 Cantidad: ${result.filledQuantity}`);
      if (result.commission && result.commission > 0) {
        addLog(`💸 Comisión: $${result.commission.toFixed(2)}`);
      }
    } else {
      addLog(`❌ Error ejecutando orden: ${result.error}`);
    }

    return result;
  };

  const confirmTrade = (trade: any) => {
    setPendingTrade(trade);
    setShowConfirmation(true);
  };

  const handleConfirmTrade = async () => {
    if (!pendingTrade) return;
    
    setShowConfirmation(false);
    const result = await executeTrade(pendingTrade);
    
    if (result.success) {
      setTrades(prev => [pendingTrade, ...prev]);
      setCurrentCapital(prev => prev + (pendingTrade.profit || 0));
      onTradeUpdate([pendingTrade]);
      onCapitalUpdate(currentCapital + (pendingTrade.profit || 0));
    }
    
    setPendingTrade(null);
  };

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

      // Simular análisis y generar señales
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'BTC', 'ETH', 'EUR/USD'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
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

      const trade = {
        id: `auto-${Date.now()}`,
        symbol,
        type: isBuy ? 'BUY' as const : 'SELL' as const,
        price: 100 + Math.random() * 400,
        quantity: Math.floor(tradeAmount / 100),
        total: tradeAmount,
        date: new Date().toISOString().split('T')[0],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        confidence: 65 + Math.random() * 30,
        profit: isBuy ? profit : -profit * 0.3,
        category: 'stocks' as AssetCategory,
        currency: config.baseCurrency,
      };

      if (isBuy) {
        addLog(`📈 COMPRA ${symbol} @ $${trade.price.toFixed(2)} | Confianza: ${trade.confidence.toFixed(0)}%`);
      } else {
        addLog(`📉 VENTA ${symbol} @ $${trade.price.toFixed(2)} | P&L: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
      }

      // Si es modo real, pedir confirmación
      if (brokerConfig && !brokerConfig.isPaperTrading) {
        confirmTrade(trade);
      } else {
        // Modo paper, ejecutar directamente
        setTrades(prev => [trade, ...prev]);
        setCurrentCapital(prev => prev + profit);
        onTradeUpdate([trade]);
        onCapitalUpdate(currentCapital + profit);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning, currentCapital, config, brokerConfig]);

  const progress = ((currentCapital - config.initialCapital) / (config.targetAmount - config.initialCapital)) * 100;

  return (
    <div className="space-y-6">
      {/* Mode Indicator */}
      <div className={`rounded-2xl p-4 border ${
        brokerConfig?.isPaperTrading 
          ? 'bg-green-900/20 border-green-500/30' 
          : brokerConfig?.isConfigured
            ? 'bg-red-900/20 border-red-500/30'
            : 'bg-gray-800/50 border-gray-700/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {brokerConfig?.isPaperTrading ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="font-bold text-green-400">✅ Modo Simulación (Paper Trading)</h3>
                  <p className="text-sm text-gray-400">Operaciones sin riesgo para probar estrategias</p>
                </div>
              </>
            ) : brokerConfig?.isConfigured ? (
              <>
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="font-bold text-red-400">⚠️ MODO REAL - Dinero Real</h3>
                  <p className="text-sm text-gray-400">Las operaciones se ejecutan con dinero real</p>
                </div>
              </>
            ) : (
              <>
                <Link2 className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="font-bold text-blue-400">🔗 Conectar Broker</h3>
                  <p className="text-sm text-gray-400">Configura un broker para empezar a operar</p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setShowBrokerModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all"
          >
            <Settings className="w-4 h-4" />
            Configurar
          </button>
        </div>
      </div>

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

      {/* Broker Configuration Modal */}
      {showBrokerModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowBrokerModal(false)}>
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Link2 className="w-6 h-6 text-blue-400" />
                Configurar Broker
              </h3>
              <button onClick={() => setShowBrokerModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <BrokerConfig onConfigUpdate={handleBrokerConfigUpdate} />
          </div>
        </div>
      )}

      {/* Trade Confirmation Modal */}
      {showConfirmation && pendingTrade && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Confirmar Operación</h3>
                <p className="text-sm text-gray-400">Esta operación se ejecutará con dinero real</p>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Tipo:</span>
                <span className={`font-bold ${pendingTrade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                  {pendingTrade.type === 'BUY' ? '📈 COMPRA' : '📉 VENTA'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Activo:</span>
                <span className="text-white font-bold">{pendingTrade.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cantidad:</span>
                <span className="text-white">{pendingTrade.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total:</span>
                <span className="text-white font-bold">${pendingTrade.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setPendingTrade(null);
                  addLog('❌ Operación cancelada por el usuario');
                }}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmTrade}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
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
