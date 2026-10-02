import { useState } from 'react';
import { LayoutDashboard, LineChart, Bot, Bell, Brain, Menu, X, TrendingUp, Globe, Bitcoin, DollarSign, Gem } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TradingView from './components/TradingView';
import AutoTrader from './components/AutoTrader';
import Signals from './components/Signals';
import LearningPanel from './components/LearningPanel';
import ConnectionStatus from './components/ConnectionStatus';
import { Trade, AssetCategory } from './types';
import { getCategoryLabel } from './utils/stockData';

type Tab = 'dashboard' | 'trading' | 'autotrader' | 'signals' | 'learning';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [capital, setCapital] = useState(10000);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trading' as Tab, label: 'Trading', icon: LineChart },
    { id: 'autotrader' as Tab, label: 'Auto-Trader', icon: Bot },
    { id: 'signals' as Tab, label: 'Señales', icon: Bell },
    { id: 'learning' as Tab, label: 'Aprendizaje IA', icon: Brain },
  ];

  const categories: { key: AssetCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Todos', icon: <Globe className="w-4 h-4" /> },
    { key: 'stocks', label: 'Acciones', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'crypto', label: 'Crypto', icon: <Bitcoin className="w-4 h-4" /> },
    { key: 'forex', label: 'Forex', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'commodities', label: 'Commodities', icon: <Gem className="w-4 h-4" /> },
  ];

  const winRate = trades.length > 0
    ? (trades.filter(t => (t.profit || 0) > 0).length / trades.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
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
                <p className="text-xs text-gray-400">Multi-Moneda & Multi-Activo</p>
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

          {/* Category Filter in Sidebar */}
          <div className="p-4 border-t border-gray-700/50">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-2">Categoría de Activos</p>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat.key
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/20">
              <p className="text-sm font-medium text-white">Capital Actual</p>
              <p className="text-xl font-bold text-green-400 mt-1">${capital.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-400 mt-1">{trades.length} operaciones • {winRate.toFixed(0)}% win rate</p>
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
                  {selectedCategory !== 'all' ? `${getCategoryLabel(selectedCategory)}` : 'Todos los activos'} • 
                  {activeTab === 'dashboard' && ' Vista general de tu portafolio'}
                  {activeTab === 'trading' && ' Análisis técnico multi-activo'}
                  {activeTab === 'autotrader' && ' Trading automático con conexión a brokers reales'}
                  {activeTab === 'signals' && ' Señales IA en tiempo real'}
                  {activeTab === 'learning' && ' Estadísticas del modelo de aprendizaje'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Category Pills on Top */}
              <div className="hidden lg:flex gap-1">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Mercado Abierto</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <>
              <Dashboard capital={capital} target={15000} trades={trades.length} winRate={winRate} selectedCategory={selectedCategory} />
              <div className="mt-6">
                <ConnectionStatus />
              </div>
            </>
          )}
          {activeTab === 'trading' && <TradingView selectedCategory={selectedCategory} />}
          {activeTab === 'autotrader' && (
            <AutoTrader
              onTradeUpdate={(newTrades) => setTrades(prev => [...newTrades, ...prev])}
              onCapitalUpdate={(newCapital) => setCapital(newCapital)}
              selectedCategory={selectedCategory}
            />
          )}
          {activeTab === 'signals' && <Signals selectedCategory={selectedCategory} />}
          {activeTab === 'learning' && <LearningPanel trades={trades} />}
        </div>
      </main>
    </div>
  );
}

export default App;
