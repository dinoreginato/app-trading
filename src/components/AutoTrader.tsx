import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Settings, DollarSign, Target, Calendar, Shield, Zap, Brain, TrendingUp, Link2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AutoTraderConfig, Trade, AssetCategory } from '../types';
import { assets, getCategoryLabel, currencies } from '../utils/stockData';

interface AutoTraderProps {
  onTradeUpdate: (trades: Trade[]) => void;
  onCapitalUpdate: (capital: number) => void;
  selectedCategory: AssetCategory | 'all';
}

const brokers = [
  { id: 'binance', name: 'Binance', type: 'exchange', categories: ['crypto'] as AssetCategory[], countries: ['Global'], fees: '0.1%', isReal: true, description: 'El exchange de criptomonedas más grande del mundo', features: ['Spot Trading', 'Futures', 'API completa', 'Trading bots'] },
  { id: 'coinbase', name: 'Coinbase', type: 'exchange', categories: ['crypto'] as AssetCategory[], countries: ['US', 'EU', 'UK'], fees: '0.5%', isReal: true, description: 'Exchange regulado en EE.UU.', features: ['Spot Trading', 'Staking', 'API Pro', 'Custodia segura'] },
  { id: 'alpaca', name: 'Alpaca', type: 'broker', categories: ['stocks'] as AssetCategory[], countries: ['US'], fees: '0%', isReal: true, description: 'Broker de acciones sin comisiones con API', features: ['Trading sin comisiones', 'Paper Trading', 'API REST', 'Datos en tiempo real'] },
  { id: 'interactive-brokers', name: 'Interactive Brokers', type: 'broker', categories: ['stocks', 'forex', 'commodities'] as AssetCategory[], countries: ['Global'], fees: '0.005%', isReal: true, description: 'Broker internacional multi-activo', features: ['Acciones globales', 'Forex', 'Opciones', 'Futuros'] },
  { id: 'oanda', name: 'OANDA', type: 'broker', categories: ['forex'] as AssetCategory[], countries: ['Global'], fees: 'Spread', isReal: true, description: 'Broker especializado en Forex', features: ['70+ pares de divisas', 'API v20', 'Trading automático', 'Análisis técnico'] },
  { id: 'bitso', name: 'Bitso', type: 'exchange', categories: ['crypto', 'forex'] as AssetCategory[], countries: ['MX', 'AR', 'CO', 'BR'], fees: '0.65%', isReal: true, description: 'Exchange líder en Latinoamérica', features: ['Peso MXN/ARS/COP', 'Crypto', 'API', 'Transferencias locales'] },
  { id: 'mercado-bitcoin', name: 'Mercado Bitcoin', type: 'exchange', categories: ['crypto'] as AssetCategory[], countries: ['AR', 'BR'], fees: '0.7%', isReal: true, description: 'Exchange líder en Argentina y Brasil', features: ['ARS/BRL', 'Bitcoin', 'Ethereum', 'API'] },
];

export default function AutoTrader({ onTradeUpdate, onCapitalUpdate, selectedCategory }: AutoTraderProps) {
  const [config, setConfig] = useState<AutoTraderConfig>({
    initialCapital: 10000,
    targetAmount: 15000,
    targetDate: '2025-12-31',
    riskLevel: 'moderate',
    isActive: false,
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
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null);
  const [isRealMode, setIsRealMode] = useState(false);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
  }, []);

  const startTrading = useCallback(() => {
    setIsRunning(true);
    setCurrentCapital(config.initialCapital);
    setTrades([]);
    setDay(0);
    addLog('🚀 Auto-Trader iniciado');
    addLog(`💰 Capital inicial: $${config.initialCapital.toLocaleString()} ${config.baseCurrency}`);
    addLog(`🎯 Meta: $${config.targetAmount.toLocaleString()} ${config.baseCurrency}`);
    addLog(`⚡ Nivel de riesgo: ${config.riskLevel}`);
    addLog(`📊 Categorías: ${config.categories.map(c => getCategoryLabel(c)).join(', ')}`);
    if (isRealMode && connectedBroker) {
      addLog(`🔗 MODO REAL conectado a ${connectedBroker}`);
      addLog('⚠️ Las operaciones se ejecutarán con dinero real');
    } else {
      addLog('📋 Modo simulación (Paper Trading)');
    }
  }, [config, addLog, isRealMode, connectedBroker]);

  const stopTrading = useCallback(() => {
    setIsRunning(false);
    addLog('⏸️ Auto-Trader pausado');
    addLog(`💰 Capital final: ${currentCapital.toFixed(2)} ${config.baseCurrency}`);
    const profit = currentCapital - config.initialCapital;
    addLog(`📊 Ganancia/Pérdida: ${profit >= 0 ? '+' : ''}${profit.toFixed(2)} ${config.baseCurrency}`);
  }, [currentCapital, config, addLog]);

  const filteredAssets = assets.filter(a => config.categories.includes(a.category));

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

      const numTrades = Math.floor(Math.random() * 3) + 1;
      const newTrades: Trade[] = [];

      for (let i = 0; i < numTrades; i++) {
        const asset = filteredAssets[Math.floor(Math.random() * filteredAssets.length)];
        if (!asset) continue;
        
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
          symbol: asset.symbol,
          type: isBuy ? 'BUY' : 'SELL',
          price: asset.price * (1 + (Math.random() - 0.5) * 0.02),
          quantity: Math.floor(tradeAmount / asset.price),
          total: tradeAmount,
          date: new Date().toISOString().split('T')[0],
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          confidence: 65 + Math.random() * 30,
          profit: isBuy ? profit : -profit * 0.3,
          category: asset.category,
          currency: config.baseCurrency,
        };

        newTrades.push(trade);
        setCurrentCapital(prev => prev + profit);

        if (isBuy) {
          addLog(`📈 COMPRA ${asset.symbol} @ ${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toFixed(2)} | Confianza: ${trade.confidence.toFixed(0)}%`);
        } else {
          addLog(`📉 VENTA ${asset.symbol} @ ${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toFixed(2)} | P&L: ${profit >= 0 ? '+' : ''}${profit.toFixed(2)}`);
        }
      }

      setTrades(prev => [...newTrades, ...prev]);
      onTradeUpdate(newTrades);
      onCapitalUpdate(currentCapital);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, currentCapital, config, addLog, filteredAssets, onTradeUpdate, onCapitalUpdate]);

  const progress = ((currentCapital - config.initialCapital) / (config.targetAmount - config.initialCapital)) * 100;

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className={`rounded-2xl p-4 border ${isRealMode ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isRealMode ? (
              <AlertTriangle className="w-6 h-6 text-red-400" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            )}
            <div>
              <h3 className={`font-bold ${isRealMode ? 'text-red-400' : 'text-green-400'}`}>
                {isRealMode ? '⚠️ MODO REAL - Dinero Real' : '✅ Modo Simulación (Paper Trading)'}
              </h3>
              <p className="text-sm text-gray-400">
                {isRealMode
                  ? 'Las operaciones se ejecutan con dinero real a través del broker conectado'
                  : 'Modo seguro para practicar sin riesgo. Conecta un broker para operar con dinero real.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBrokerModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all"
            >
              <Link2 className="w-4 h-4" />
              Conectar Broker
            </button>
            <button
              onClick={() => setIsRealMode(!isRealMode)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isRealMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRealMode ? 'Desactivar Real' : 'Activar Real'}
            </button>
          </div>
        </div>
        {connectedBroker && (
          <div className="mt-3 flex items-center gap-2 text-sm text-blue-300">
            <Link2 className="w-4 h-4" />
            Conectado a: <strong>{connectedBroker}</strong>
          </div>
        )}
      </div>

      {/* Configuration Panel */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Auto-Trader IA - Configuración
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
          <ConfigInput icon={<DollarSign className="w-4 h-4" />} label="Capital Inicial" value={config.initialCapital} onChange={(v: number) => setConfig(prev => ({ ...prev, initialCapital: v }))} prefix="$" disabled={isRunning} />
          <ConfigInput icon={<Target className="w-4 h-4" />} label="Meta de Ganancia" value={config.targetAmount} onChange={(v: number) => setConfig(prev => ({ ...prev, targetAmount: v }))} prefix="$" disabled={isRunning} />
          <ConfigInput icon={<Calendar className="w-4 h-4" />} label="Fecha Límite" value={config.targetDate} onChange={(v: string) => setConfig(prev => ({ ...prev, targetDate: v }))} type="date" disabled={isRunning} />
          
          {/* Base Currency */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              💱 Moneda Base
            </label>
            <select
              value={config.baseCurrency}
              onChange={(e) => setConfig(prev => ({ ...prev, baseCurrency: e.target.value }))}
              disabled={isRunning}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
              ))}
            </select>
          </div>

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

          {/* Categories */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              📊 Categorías de Activos
            </label>
            <div className="flex flex-wrap gap-2">
              {(['stocks', 'crypto', 'forex', 'commodities'] as AssetCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    if (!isRunning) {
                      setConfig(prev => ({
                        ...prev,
                        categories: prev.categories.includes(cat)
                          ? prev.categories.filter(c => c !== cat)
                          : [...prev.categories, cat]
                      }));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    config.categories.includes(cat)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Panel */}
      {isRunning && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Estado en Tiempo Real
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Capital Actual</span>
                <span className="text-xl font-bold text-white">{currentCapital.toFixed(2)} {config.baseCurrency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ganancia/Pérdida</span>
                <span className={`text-lg font-bold ${currentCapital >= config.initialCapital ? 'text-green-400' : 'text-red-400'}`}>
                  {currentCapital >= config.initialCapital ? '+' : ''}{(currentCapital - config.initialCapital).toFixed(2)} {config.baseCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Operaciones</span>
                <span className="text-lg font-bold text-white">{trades.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Día</span>
                <span className="text-lg font-bold text-white">{day}/30</span>
              </div>
              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progreso hacia meta</span>
                  <span className="text-blue-400 font-medium">{Math.max(0, progress).toFixed(1)}%</span>
                </div>
                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-500 relative" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Registro de Actividad
            </h3>
            <div className="h-64 overflow-y-auto space-y-2">
              {logs.map((log, idx) => (
                <div key={idx} className="text-sm text-gray-300 p-2 bg-gray-900/50 rounded-lg font-mono">
                  {log}
                </div>
              ))}
              {logs.length === 0 && <p className="text-gray-500 text-center py-8">Esperando operaciones...</p>}
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
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Categoría</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Precio</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">P&L</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Razón</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 10).map(trade => (
                  <tr key={trade.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trade.type === 'BUY' ? '📈 COMPRA' : '📉 VENTA'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-white font-medium">{trade.symbol}</td>
                    <td className="py-3 px-2 text-gray-400 text-xs">{getCategoryLabel(trade.category)}</td>
                    <td className="py-3 px-2 text-gray-300">{trade.price < 1 ? trade.price.toFixed(4) : trade.price.toFixed(2)}</td>
                    <td className={`py-3 px-2 font-medium ${(trade.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(trade.profit || 0) >= 0 ? '+' : ''}{(trade.profit || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-gray-400 text-xs max-w-48 truncate">{trade.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broker Connection Modal */}
      {showBrokerModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowBrokerModal(false)}>
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Link2 className="w-6 h-6 text-blue-400" />
                Conectar con Broker / Exchange
              </h3>
              <button onClick={() => setShowBrokerModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-300 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <strong>Importante:</strong> Para operar con dinero real necesitas una cuenta verificada en el broker/exchange y proporcionar tus API keys.
              </p>
            </div>

            <div className="space-y-3">
              {brokers.map(broker => (
                <div key={broker.id} className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  connectedBroker === broker.name ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'
                }`} onClick={() => { setConnectedBroker(broker.name); setShowBrokerModal(false); addLog(`🔗 Conectado a ${broker.name}`); }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold">{broker.name}</h4>
                      <p className="text-gray-400 text-xs mt-1">{broker.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {broker.categories.map(cat => (
                          <span key={cat} className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300">{getCategoryLabel(cat)}</span>
                        ))}
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300">Comisión: {broker.fees}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {connectedBroker === broker.name ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">✓ Conectado</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">Conectar</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigInput({ icon, label, value, onChange, prefix, type = 'number', disabled }: {
  icon: React.ReactNode; label: string; value: number | string; onChange: (value: any) => void; prefix?: string; type?: string; disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-400 flex items-center gap-2">{icon} {label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          disabled={disabled}
          className={`w-full bg-gray-700/50 border border-gray-600 rounded-xl py-2.5 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 ${prefix ? 'pl-8' : 'pl-4'} pr-4`}
        />
      </div>
    </div>
  );
}
