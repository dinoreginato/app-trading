import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

interface CurrencyDisplayProps {
  amount: number; // Monto en USD (base)
  showSymbol?: boolean;
  showCode?: boolean;
  compact?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CurrencyDisplay({ 
  amount, 
  showSymbol = true, 
  showCode = false, 
  compact = false,
  className = '',
  prefix = '',
  suffix = ''
}: CurrencyDisplayProps) {
  const { formatMoney } = useCurrency();
  
  const formatted = formatMoney(amount, { showSymbol, showCode, compact });
  
  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

// Componente para mostrar cambio de precio con color
interface PriceChangeProps {
  currentPrice: number;
  previousPrice: number;
  className?: string;
}

export function PriceChange({ currentPrice, previousPrice, className = '' }: PriceChangeProps) {
  const { formatMoney } = useCurrency();
  
  const change = currentPrice - previousPrice;
  const percentChange = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;
  const isPositive = change >= 0;
  
  const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
  const arrow = isPositive ? '▲' : '▼';
  
  return (
    <span className={`${colorClass} ${className}`}>
      {arrow} {formatMoney(Math.abs(change), { compact: true })} ({percentChange.toFixed(2)}%)
    </span>
  );
}

// Componente para mostrar tasa de cambio
interface ExchangeRateProps {
  fromCurrency: string;
  toCurrency: string;
  className?: string;
}

export function ExchangeRate({ fromCurrency, toCurrency, className = '' }: ExchangeRateProps) {
  const { allCurrencies } = useCurrency();
  
  const from = allCurrencies.find(c => c.code === fromCurrency);
  const to = allCurrencies.find(c => c.code === toCurrency);
  
  if (!from || !to) return null;
  
  const rate = (1 / from.rateToUSD) * to.rateToUSD;
  
  return (
    <span className={className}>
      1 {from.symbol} = {rate.toFixed(to.decimals)} {to.symbol}
    </span>
  );
}
