import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Currency } from '../types';
import { currencies, convertFromUSD, formatCurrency, detectLocalCurrency } from '../utils/currency';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatMoney: (amountUSD: number, options?: { showSymbol?: boolean; showCode?: boolean; compact?: boolean }) => string;
  convert: (amountUSD: number) => number;
  allCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('selected_currency');
    if (saved) {
      const found = currencies.find(c => c.code === saved);
      if (found) return found;
    }
    return detectLocalCurrency();
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('selected_currency', newCurrency.code);
  };

  const formatMoney = (amountUSD: number, options?: { showSymbol?: boolean; showCode?: boolean; compact?: boolean }) => {
    const converted = convertFromUSD(amountUSD, currency);
    return formatCurrency(converted, currency, options);
  };

  const convert = (amountUSD: number) => {
    return convertFromUSD(amountUSD, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatMoney, convert, allCurrencies: currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
