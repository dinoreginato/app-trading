import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { currencies, getCurrenciesByRegion } from '../utils/currency';
import { ChevronDown, Globe, Search } from 'lucide-react';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currenciesByRegion = getCurrenciesByRegion();

  const filteredCurrencies = searchTerm
    ? currencies.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition-all active:scale-95"
      >
        <span className="text-lg">{currency.flag}</span>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-medium text-white">{currency.code}</div>
          <div className="text-[10px] text-gray-400">{currency.symbol}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => { setIsOpen(false); setSearchTerm(''); }}
          />
          <div className="absolute right-0 top-full mt-2 w-80 max-h-[500px] bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-xl">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar moneda o país..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[400px]">
              {filteredCurrencies ? (
                // Search results
                <div className="p-2">
                  {filteredCurrencies.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-4">No se encontraron monedas</p>
                  ) : (
                    filteredCurrencies.map(c => (
                      <CurrencyItem
                        key={c.code}
                        currency={c}
                        isSelected={c.code === currency.code}
                        onClick={() => {
                          setCurrency(c);
                          setIsOpen(false);
                          setSearchTerm('');
                        }}
                      />
                    ))
                  )}
                </div>
              ) : (
                // Grouped by region
                <div className="p-2">
                  {Object.entries(currenciesByRegion).map(([region, regionCurrencies]) => (
                    <div key={region} className="mb-3">
                      <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {region}
                      </div>
                      {regionCurrencies.map(c => (
                        <CurrencyItem
                          key={c.code}
                          currency={c}
                          isSelected={c.code === currency.code}
                          onClick={() => {
                            setCurrency(c);
                            setIsOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-700 bg-gray-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Moneda activa:</span>
                <span className="font-medium text-white">
                  {currency.flag} {currency.name}
                </span>
              </div>
              <div className="mt-1 text-[10px] text-gray-500">
                1 USD = {currency.rateToUSD.toLocaleString()} {currency.code}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface CurrencyItemProps {
  currency: any;
  isSelected: boolean;
  onClick: () => void;
}

function CurrencyItem({ currency, isSelected, onClick }: CurrencyItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-[0.98] ${
        isSelected 
          ? 'bg-blue-600/20 border border-blue-500/30' 
          : 'hover:bg-gray-700/50'
      }`}
    >
      <span className="text-2xl">{currency.flag}</span>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{currency.code}</span>
          <span className="text-xs text-gray-400">{currency.symbol}</span>
        </div>
        <div className="text-xs text-gray-400">{currency.name}</div>
      </div>
      {isSelected && (
        <div className="w-2 h-2 rounded-full bg-blue-500" />
      )}
    </button>
  );
}
