import { useState } from 'react';
import { LayoutDashboard, LineChart, Bot, Bell, Brain, Menu, X, TrendingUp } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TradingView from './components/TradingView';
import AutoTrader from './components/AutoTrader';
import Signals from './components/Signals';
import LearningPanel from './components/LearningPanel';
import { Trade } from './types';

type Tab = 'dashboard' | 'trading' | 'autotrader' | 'signals' | 'learning';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [capital, setCapital] = useState(10000);

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trading' as Tab, label: 'Trading', icon: LineChart },
    { id: 'autotrader' as Tab, label: 'Auto-Trader', icon: Bot },
    { id: 'signals' as Tab, label: 'Señales', icon: Bell },
    { id: 'learning' as Tab, label: 'Aprendizaje IA', icon: Brain },
  ];

  const winRate = trades.length > 0
    ? (trades.filter(t => (t.profit || 0) > 0).length / trades.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800/80 backdrop-blur-xl border-r border-gray-700/50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">TradeAI Pro</h1>
                <p className="text-xs text-gray-400">Trading Inteligente</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.id === 'signals' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/20">
              <p className="text-sm font-medium text-white">Capital Actual</p>
              <p className="text-xl font-bold text-green-400 mt-1">${capital.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-400 mt-1">{trades.length} operaciones realizadas</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-400">
                  {activeTab === 'dashboard' && 'Vista general de tu portafolio y rendimiento'}
                  {activeTab === 'trading' && 'Análisis técnico y gráficos en tiempo real'}
                  {activeTab === 'autotrader' && 'Configura y ejecuta el trading automático'}
                  {activeTab === 'signals' && 'Señales de compra y venta basadas en IA'}
                  {activeTab === 'learning' && 'Estadísticas de aprendizaje del modelo IA'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Mercado Abierto</span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-400">Win Rate</p>
                <p className="text-sm font-bold text-white">{winRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <Dashboard capital={capital} target={15000} trades={trades.length} winRate={winRate} />
          )}
          {activeTab === 'trading' && <TradingView />}
          {activeTab === 'autotrader' && (
            <AutoTrader
              onTradeUpdate={(newTrades) => setTrades(prev => [...newTrades, ...prev])}
              onCapitalUpdate={(newCapital) => setCapital(newCapital)}
            />
          )}
          {activeTab === 'signals' && <Signals />}
          {activeTab === 'learning' && <LearningPanel trades={trades} />}
        </div>
      </main>
    </div>
  );
}

export default App;
