import { useState } from 'react';
import { Play, Pause, Bot, DollarSign, Target, Calendar } from 'lucide-react';
import { Trade, AssetCategory } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface AutoTraderProps {
  onTradeUpdate: (trades: Trade[]) => void;
  onCapitalUpdate: (capital: number) => void;
  selectedCategory: AssetCategory | 'all';
}

export default function AutoTrader({ onTradeUpdate, onCapitalUpdate, selectedCategory }: AutoTraderProps) {
  const { formatMoney } = useCurrency();
  const [isRunning, setIsRunning] = useState(false);
  const [capital, setCapital] = useState(10000);
  const [target, setTarget] = useState(15000);
  const [risk, setRisk] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  const startBot = () => {
    setIsRunning(true);
    // Simular trades
    const interval = setInterval(() => {
      const newTrade: Trade = {
        id: Date.now().toString(),
        symbol: 'BTC',
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        price: 67000 + Math.random() * 1000,
        quantity: 0.01,
        total: 670 + Math.random() * 10,
        date: new Date().toISOString(),
        reason: 'RSI oversold',
        confidence: 75 + Math.random() * 20,
        profit: (Math.random() - 0.4) * 50,
        category: 'crypto',
        currency: 'USD',
      };
      onTradeUpdate([newTrade]);
      setCapital(prev => prev + (newTrade.profit || 0));
      onCapitalUpdate(capital + (newTrade.profit || 0));
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      setIsRunning(false);
    }, 30000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            Auto-Trader IA
          </h2>
          <button
            onClick={startBot}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              isRunning ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Detener' : 'Iniciar'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">Capital</label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                disabled={isRunning}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-8 pr-2.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">Meta</label>
            <div className="relative">
              <Target className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                disabled={isRunning}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-8 pr-2.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 block">Nivel de Riesgo</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'conservative', label: '🛡️ Bajo', desc: '4%' },
              { value: 'moderate', label: '⚖️ Medio', desc: '8%' },
              { value: 'aggressive', label: '🔥 Alto', desc: '15%' },
            ].map(r => (
              <button
                key={r.value}
                onClick={() => !isRunning && setRisk(r.value as any)}
                disabled={isRunning}
                className={`p-2 rounded-xl text-center transition-all active:scale-95 disabled:opacity-50 ${
                  risk === r.value ? 'bg-blue-600/30 border border-blue-500/30' : 'bg-gray-700/30 border border-gray-700'
                }`}
              >
                <p className="text-xs font-bold text-white">{r.label}</p>
                <p className="text-[9px] text-gray-400">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-sm font-bold text-white mb-3">Estado del Bot</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900/50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400">Capital Actual</p>
            <p className="text-lg font-bold text-white">{formatMoney(capital, { compact: true })}</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400">Progreso</p>
            <p className="text-lg font-bold text-green-400">{((capital / target) * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
