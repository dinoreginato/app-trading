import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Settings, DollarSign, Target, Calendar, Shield, Zap, Brain, Link2, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { AutoTraderConfig, Trade, AssetCategory } from '../types';
import { assets, getCategoryLabel } from '../utils/stockData';
import { useCurrency } from '../context/CurrencyContext';
import { currencies as allCurrencies } from '../utils/currency';

interface AutoTraderProps {
  onTradeUpdate: (trades: Trade[]) => void;
  onCapitalUpdate: (capital: number) => void;
  selectedCategory: AssetCategory | 'all';
}

const brokers = [
  { id: 'binance', name: 'Binance', categories: ['crypto'] as AssetCategory[], fees: '0.1%', description: 'Exchange crypto #1 mundial', features: ['Spot', 'Futures', 'API'] },
  { id: 'coinbase', name: 'Coinbase', categories: ['crypto'] as AssetCategory[], fees: '0.5%', description: 'Exchange regulado USA', features: ['Spot', 'Staking', 'API Pro'] },
  { id: 'alpaca', name: 'Alpaca', categories: ['stocks'] as AssetCategory[], fees: '0%', description: 'Acciones sin comisiones', features: ['Sin comisiones', 'Paper Trading', 'API'] },
  { id: 'interactive-brokers', name: 'Interactive Brokers', categories: ['stocks', 'forex', 'commodities'] as AssetCategory[], fees: '0.005%', description: 'Broker multi-activo global', features: ['Acciones', 'Forex', 'Opciones', 'Futuros'] },
  { id: 'oanda', name: 'OANDA', categories: ['forex'] as AssetCategory[], fees: 'Spread', description: 'Forex especializado', features: ['70+ pares', 'API v20', 'Auto Trading'] },
  { id: 'bitso', name: 'Bitso', categories: ['crypto', 'forex'] as AssetCategory[], fees: '0.65%', description: 'Exchange líder LATAM', features: ['MXN/ARS/COP', 'Crypto', 'API'] },
];

export default function AutoTrader({ onTradeUpdate, onCapitalUpdate, selectedCategory }: AutoTraderProps) {
  const { formatMoney, currency } = useCurrency();
  
  const [config, setConfig] = useState<AutoTraderConfig>({
    initialCapital: 10000,
    targetAmount: 15000,
    targetDate: '2025-12-31',
    riskLevel: 'moderate',
    isActive: false,
    maxPositionSize: 10,
    stopLossPercent: 3,
    takeProfitPercent: 5,
    baseCurrency: currency.code,
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
    addLog(`💰 Capital: $${config.initialCapital.toLocaleString()} ${config.baseCurrency}`);
    addLog(`🎯 Meta: $${config.targetAmount.toLocaleString()}`);
    addLog(`⚡ Riesgo: ${config.riskLevel}`);
    if (isRealMode && connectedBroker) {
      addLog(`🔗 MODO REAL: ${connectedBroker}`);
    }
  }, [config, addLog, isRealMode, connectedBroker]);

  const stopTrading = useCallback(() => {
    setIsRunning(false);
    addLog('⏸️ Auto-Trader pausado');
    const profit = currentCapital - config.initialCapital;
    addLog(`📊 P&L: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
  }, [currentCapital, config.initialCapital, addLog]);

  const filteredAssets = assets.filter(a => config.categories.includes(a.category));

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDay(prev => {
        const newDay = prev + 1;
        if (newDay > 30) {
          setIsRunning(false);
          addLog('✅ Ciclo completado');
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

        const reasons = ['RSI sobreventa', 'Golden Cross', 'MACD bullish', 'Volumen alto', 'Soporte clave', 'RSI sobrecompra', 'Stop loss', 'Divergencia'];

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
        addLog(`${isBuy ? '📈' : '📉'} ${trade.type} ${asset.symbol} | ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
      }

      setTrades(prev => [...newTrades, ...prev]);
      onTradeUpdate(newTrades);
      onCapitalUpdate(currentCapital);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, currentCapital, config, addLog, filteredAssets, onTradeUpdate, onCapitalUpdate]);

  const progress = ((currentCapital - config.initialCapital) / (config.targetAmount - config.initialCapital)) * 100;

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className={`rounded-2xl p-4 border ${isRealMode ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isRealMode ? <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
            <div className="min-w-0">
              <p className={`text-xs font-bold ${isRealMode ? 'text-red-400' : 'text-green-400'}`}>
                {isRealMode ? 'MODO REAL' : 'SIMULACIÓN'}
              </p>
              {connectedBroker && <p className="text-[10px] text-blue-300 truncate">🔗 {connectedBroker}</p>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setShowBrokerModal(true)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium active:scale-95">
              <Link2 className="w-3.5 h-3.5 inline mr-1" />
              Broker
            </button>
            <button onClick={() => setIsRealMode(!isRealMode)} className={`px-3 py-1.5 rounded-lg text-xs font-medium active:scale-95 ${isRealMode ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
              {isRealMode ? 'OFF' : 'ON'}
            </button>
          </div>
        </div>
      </div>

      {/* Config Card */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            Configuración
          </h2>
          <button
            onClick={isRunning ? stopTrading : startTrading}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              isRunning ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Detener' : 'Iniciar'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ConfigField icon={<DollarSign className="w-3.5 h-3.5" />} label="Capital" value={config.initialCapital} onChange={(v) => setConfig(prev => ({ ...prev, initialCapital: v }))} prefix="$" disabled={isRunning} />
          <ConfigField icon={<Target className="w-3.5 h-3.5" />} label="Meta" value={config.targetAmount} onChange={(v) => setConfig(prev => ({ ...prev, targetAmount: v }))} prefix="$" disabled={isRunning} />
          <ConfigField icon={<Shield className="w-3.5 h-3.5" />} label="Stop Loss" value={config.stopLossPercent} onChange={(v) => setConfig(prev => ({ ...prev, stopLossPercent: v }))} suffix="%" disabled={isRunning} />
          <ConfigField icon={<TrendingUp className="w-3.5 h-3.5" />} label="Take Profit" value={config.takeProfitPercent} onChange={(v) => setConfig(prev => ({ ...prev, takeProfitPercent: v }))} suffix="%" disabled={isRunning} />
        </div>

        {/* Risk Level */}
        <div className="mt-3">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 block">Nivel de Riesgo</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'conservative', label: '🛡️ Bajo', desc: '4%' },
              { value: 'moderate', label: '⚖️ Medio', desc: '8%' },
              { value: 'aggressive', label: '🔥 Alto', desc: '15%' },
            ].map(risk => (
              <button
                key={risk.value}
                onClick={() => !isRunning && setConfig(prev => ({ ...prev, riskLevel: risk.value as any }))}
                disabled={isRunning}
                className={`p-2 rounded-xl text-center transition-all active:scale-95 disabled:opacity-50 ${
                  config.riskLevel === risk.value ? 'bg-blue-600/30 border border-blue-500/30' : 'bg-gray-700/30 border border-gray-700'
                }`}
              >
                <p className="text-xs font-bold text-white">{risk.label}</p>
                <p className="text-[9px] text-gray-400">{risk.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="mt-3">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 block">Moneda Base</label>
          <select
            value={config.baseCurrency}
            onChange={(e) => setConfig(prev => ({ ...prev, baseCurrency: e.target.value }))}
            disabled={isRunning}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
          >
            {allCurrencies.slice(0, 10).map((c: any) => (
              <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="mt-3">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 block">Categorías</label>
          <div className="flex flex-wrap gap-2">
            {(['stocks', 'crypto', 'forex', 'commodities'] as AssetCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => !isRunning && setConfig(prev => ({
                  ...prev,
                  categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat]
                }))}
                disabled={isRunning}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 disabled:opacity-50 ${
                  config.categories.includes(cat) ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-400'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status */}
      {isRunning && (
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            En Vivo
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-900/50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400">Capital</p>
              <p className="text-lg font-bold text-white">{formatMoney(currentCapital, { compact: true })}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400">P&L</p>
              <p className={`text-lg font-bold ${currentCapital >= config.initialCapital ? 'text-green-400' : 'text-red-400'}`}>
                {currentCapital >= config.initialCapital ? '+' : ''}{formatMoney(Math.abs(currentCapital - config.initialCapital), { compact: true })}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Progreso</span>
              <span className="text-blue-400 font-bold">{Math.max(0, progress).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-xs mb-3">
            <span className="text-gray-400">Ops: <span className="text-white font-bold">{trades.length}</span></span>
            <span className="text-gray-400">Día: <span className="text-white font-bold">{day}/30</span></span>
          </div>

          {/* Logs */}
          <div className="h-32 overflow-y-auto space-y-1 scrollbar-hide">
            {logs.slice(0, 10).map((log, idx) => (
              <div key={idx} className="text-[10px] text-gray-300 p-1.5 bg-gray-900/50 rounded font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Trades */}
      {trades.length > 0 && (
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="text-sm font-bold text-white mb-3">Últimas Operaciones</h3>
          <div className="space-y-2">
            {trades.slice(0, 5).map(trade => (
              <div key={trade.id} className="flex items-center justify-between p-2.5 bg-gray-900/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {trade.type}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">{trade.symbol}</p>
                    <p className="text-[9px] text-gray-400">{getCategoryLabel(trade.category)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${(trade.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(trade.profit || 0) >= 0 ? '+' : ''}{formatMoney(Math.abs(trade.profit || 0))}
                  </p>
                  <p className="text-[9px] text-gray-400">{trade.confidence.toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broker Modal */}
      {showBrokerModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBrokerModal(false)}>
          <div className="bg-gray-800 rounded-t-3xl sm:rounded-2xl p-5 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto border-t sm:border border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Conectar Broker</h3>
              <button onClick={() => setShowBrokerModal(false)} className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 active:scale-95">
                ×
              </button>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
              <p className="text-xs text-yellow-300">⚠️ Necesitas cuenta verificada y API keys del broker</p>
            </div>

            <div className="space-y-2">
              {brokers.map(broker => (
                <button
                  key={broker.id}
                  onClick={() => { setConnectedBroker(broker.name); setShowBrokerModal(false); addLog(`🔗 ${broker.name}`); }}
                  className={`w-full p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                    connectedBroker === broker.name ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white">{broker.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{broker.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {broker.categories.map(cat => (
                          <span key={cat} className="px-1.5 py-0.5 rounded text-[8px] bg-gray-700 text-gray-300">{getCategoryLabel(cat)}</span>
                        ))}
                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-gray-700 text-gray-300">{broker.fees}</span>
                      </div>
                    </div>
                    {connectedBroker === broker.name && (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigField({ icon, label, value, onChange, prefix, suffix, disabled }: {
  icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] text-gray-400 flex items-center gap-1 mb-1">
        {icon} {label}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 ${prefix ? 'pl-7' : 'pl-2.5'} ${suffix ? 'pr-7' : 'pr-2.5'}`}
        />
        {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{suffix}</span>}
      </div>
    </div>
  );
}
