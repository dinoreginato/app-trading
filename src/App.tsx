import { useState } from 'react';
import { LayoutDashboard, LineChart, Bot, Bell, Brain, Settings, FileText, TrendingUp, Globe, Bitcoin, DollarSign, Gem, User, ChevronDown } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TradingView from './components/TradingView';
import AutoTrader from './components/AutoTrader';
import Signals from './components/Signals';
import LearningPanel from './components/LearningPanel';
import AuditLogs from './components/AuditLogs';
import { CurrencySelector } from './components/CurrencySelector';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import { Trade, AssetCategory } from './types';

type Tab = 'dashboard' | 'trading' | 'autotrader' | 'signals' | 'learning' | 'logs';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [capital, setCapital] = useState(10000);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const { formatMoney, currency } = useCurrency();

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Inicio', icon: LayoutDashboard },
    { id: 'trading' as Tab, label: 'Trading', icon: LineChart },
    { id: 'autotrader' as Tab, label: 'Bot', icon: Bot },
    { id: 'signals' as Tab, label: 'Señales', icon: Bell },
    { id: 'learning' as Tab, label: 'IA', icon: Brain },
    { id: 'logs' as Tab, label: 'Logs', icon: FileText },
  ];

  const categories: { key: AssetCategory | 'all'; label: string; shortLabel: string; icon: React.ReactNode; color: string }[] = [
    { key: 'all', label: 'Todos', shortLabel: 'Todos', icon: <Globe className="w-3.5 h-3.5" />, color: 'bg-blue-500' },
    { key: 'stocks', label: 'Acciones', shortLabel: 'Acc.', icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'bg-indigo-500' },
    { key: 'crypto', label: 'Crypto', shortLabel: 'Crypto', icon: <Bitcoin className="w-3.5 h-3.5" />, color: 'bg-orange-500' },
    { key: 'forex', label: 'Forex', shortLabel: 'Forex', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'bg-green-500' },
    { key: 'commodities', label: 'Commodities', shortLabel: 'Comm.', icon: <Gem className="w-3.5 h-3.5" />, color: 'bg-yellow-500' },
  ];

  const winRate = trades.length > 0
    ? (trades.filter(t => (t.profit || 0) > 0).length / trades.length) * 100
    : 0;

  const currentCategory = categories.find(c => c.key === selectedCategory)!;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-gray-900 border-r border-gray-800 flex-col z-30">
        <div className="p-4 lg:p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-base font-bold text-white">TradeAI Pro</h1>
              <p className="text-xs text-gray-400">Multi-Moneda</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 lg:p-4 space-y-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Currency & Category */}
        <div className="hidden lg:block p-4 border-t border-gray-800 space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Moneda</p>
            <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-xl">
              <span className="text-xl">{currency.flag}</span>
              <div>
                <p className="text-xs font-medium text-white">{currency.code}</p>
                <p className="text-[10px] text-gray-400">{currency.country}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Categoría</p>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat.key ? 'bg-blue-600/30 text-blue-300' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full ${cat.color} flex items-center justify-center text-white`}>
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 lg:p-4 border-t border-gray-800">
          <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/20">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Capital</p>
            <p className="text-lg font-bold text-white">{formatMoney(capital, { compact: true })}</p>
            <p className="text-[10px] text-gray-400">{trades.length} ops • {winRate.toFixed(0)}% WR</p>
          </div>
        </div>
      </aside>

      {/* ===== MAIN WRAPPER ===== */}
      <div className="md:ml-20 lg:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
          <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
            {/* Logo + Capital */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm font-bold text-white leading-tight">TradeAI Pro</h1>
                <p className="text-[10px] text-green-400 font-medium leading-tight truncate">
                  {formatMoney(capital, { compact: true })}
                </p>
              </div>
            </div>

            {/* Center: Category + Currency */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CurrencySelector />

              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-gray-800 rounded-xl border border-gray-700 active:scale-95 transition-transform"
              >
                <span className={`w-5 h-5 rounded-full ${currentCategory.color} flex items-center justify-center text-white`}>
                  {currentCategory.icon}
                </span>
                <span className="text-xs font-medium text-white hidden sm:inline">{currentCategory.label}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            {/* Profile */}
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Category Dropdown */}
          {showCategoryMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCategoryMenu(false)} />
              <div className="absolute right-4 top-14 z-50 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl p-2 min-w-[180px]">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => { setSelectedCategory(cat.key); setShowCategoryMenu(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all active:scale-95 ${
                      selectedCategory === cat.key ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full ${cat.color} flex items-center justify-center text-white`}>
                      {cat.icon}
                    </span>
                    <span className="font-medium">{cat.label}</span>
                    {selectedCategory === cat.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard capital={capital} target={15000} trades={trades.length} winRate={winRate} selectedCategory={selectedCategory} />
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
            {activeTab === 'logs' && <AuditLogs />}
          </div>
        </main>

        {/* ===== BOTTOM NAVIGATION (MOBILE) ===== */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 md:hidden">
          <div className="flex items-center justify-around px-2 py-1.5">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all active:scale-90 min-w-[56px] ${
                    isActive ? 'text-blue-400' : 'text-gray-500'
                  }`}
                >
                  <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                    <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function App() {
  return (
    <CurrencyProvider>
      <AppContent />
    </CurrencyProvider>
  );
}

export default App;
