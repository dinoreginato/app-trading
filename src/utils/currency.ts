import { Currency } from '../types';

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'United States', countryCode: 'US', locale: 'en-US', decimals: 2, rateToUSD: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'Europe', countryCode: 'EU', locale: 'de-DE', decimals: 2, rateToUSD: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', country: 'United Kingdom', countryCode: 'GB', locale: 'en-GB', decimals: 2, rateToUSD: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', country: 'Japan', countryCode: 'JP', locale: 'ja-JP', decimals: 0, rateToUSD: 149.85 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽', country: 'Mexico', countryCode: 'MX', locale: 'es-MX', decimals: 2, rateToUSD: 17.12 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', flag: '🇨🇴', country: 'Colombia', countryCode: 'CO', locale: 'es-CO', decimals: 0, rateToUSD: 3945 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', flag: '🇦🇷', country: 'Argentina', countryCode: 'AR', locale: 'es-AR', decimals: 2, rateToUSD: 875 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CL$', flag: '🇨🇱', country: 'Chile', countryCode: 'CL', locale: 'es-CL', decimals: 0, rateToUSD: 923 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪', country: 'Peru', countryCode: 'PE', locale: 'es-PE', decimals: 2, rateToUSD: 3.72 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', country: 'Brazil', countryCode: 'BR', locale: 'pt-BR', decimals: 2, rateToUSD: 4.97 },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs', flag: '🇻🇪', country: 'Venezuela', countryCode: 'VE', locale: 'es-VE', decimals: 2, rateToUSD: 36.50 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', country: 'China', countryCode: 'CN', locale: 'zh-CN', decimals: 2, rateToUSD: 7.24 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', country: 'South Korea', countryCode: 'KR', locale: 'ko-KR', decimals: 0, rateToUSD: 1325 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', country: 'India', countryCode: 'IN', locale: 'hi-IN', decimals: 2, rateToUSD: 83.12 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', country: 'Canada', countryCode: 'CA', locale: 'en-CA', decimals: 2, rateToUSD: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', country: 'Australia', countryCode: 'AU', locale: 'en-AU', decimals: 2, rateToUSD: 1.53 },
];

export function convertFromUSD(amountUSD: number, currency: Currency): number {
  return amountUSD * currency.rateToUSD;
}

export function convertToUSD(amount: number, currency: Currency): number {
  return amount / currency.rateToUSD;
}

export function formatCurrency(amount: number, currency: Currency, options?: {
  showSymbol?: boolean;
  showCode?: boolean;
  compact?: boolean;
}): string {
  const { showSymbol = true, showCode = false, compact = false } = options || {};
  
  let formatted: string;
  
  if (compact && Math.abs(amount) >= 1000) {
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    
    if (absAmount >= 1e9) {
      formatted = `${sign}${(absAmount / 1e9).toFixed(1)}B`;
    } else if (absAmount >= 1e6) {
      formatted = `${sign}${(absAmount / 1e6).toFixed(1)}M`;
    } else if (absAmount >= 1e3) {
      formatted = `${sign}${(absAmount / 1e3).toFixed(1)}K`;
    } else {
      formatted = amount.toFixed(currency.decimals);
    }
  } else {
    formatted = amount.toLocaleString(currency.locale, {
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    });
  }
  
  let result = '';
  if (showSymbol) {
    result = `${currency.symbol}${formatted}`;
  } else {
    result = formatted;
  }
  
  if (showCode) {
    result = `${result} ${currency.code}`;
  }
  
  return result;
}

export function detectLocalCurrency(): Currency {
  const lang = navigator.language || 'en-US';
  const region = lang.split('-')[1]?.toUpperCase() || 'US';
  
  const match = currencies.find(c => c.countryCode === region);
  return match || currencies.find(c => c.code === 'USD')!;
}

export function getCurrenciesByRegion(): Record<string, Currency[]> {
  return {
    '🌎 Americas': currencies.filter(c => ['US', 'MX', 'CO', 'AR', 'CL', 'PE', 'BR', 'VE', 'CA'].includes(c.countryCode)),
    '🌍 Europe': currencies.filter(c => ['EU', 'GB'].includes(c.countryCode)),
    '🌏 Asia': currencies.filter(c => ['JP', 'CN', 'KR', 'IN'].includes(c.countryCode)),
    '🌏 Oceania': currencies.filter(c => ['AU'].includes(c.countryCode)),
  };
}
