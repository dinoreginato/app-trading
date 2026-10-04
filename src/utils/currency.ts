// ============================================
// SISTEMA MULTI-MONEDA - TradeAI Pro
// ============================================

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  countryCode: string;
  locale: string;
  decimals: number;
  // Tasa de cambio respecto al USD (1 USD = X unidades de esta moneda)
  rateToUSD: number;
}

export const currencies: Currency[] = [
  // Norteamérica
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸', country: 'Estados Unidos', countryCode: 'US', locale: 'en-US', decimals: 2, rateToUSD: 1 },
  { code: 'CAD', name: 'Dólar Canadiense', symbol: 'CA$', flag: '🇨🇦', country: 'Canadá', countryCode: 'CA', locale: 'en-CA', decimals: 2, rateToUSD: 1.36 },
  { code: 'MXN', name: 'Peso Mexicano', symbol: 'MX$', flag: '🇲🇽', country: 'México', countryCode: 'MX', locale: 'es-MX', decimals: 2, rateToUSD: 17.12 },
  
  // Sudamérica
  { code: 'COP', name: 'Peso Colombiano', symbol: 'COL$', flag: '🇨🇴', country: 'Colombia', countryCode: 'CO', locale: 'es-CO', decimals: 0, rateToUSD: 3945 },
  { code: 'ARS', name: 'Peso Argentino', symbol: 'AR$', flag: '🇦🇷', country: 'Argentina', countryCode: 'AR', locale: 'es-AR', decimals: 2, rateToUSD: 875 },
  { code: 'CLP', name: 'Peso Chileno', symbol: 'CL$', flag: '🇨🇱', country: 'Chile', countryCode: 'CL', locale: 'es-CL', decimals: 0, rateToUSD: 923 },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', flag: '🇵🇪', country: 'Perú', countryCode: 'PE', locale: 'es-PE', decimals: 2, rateToUSD: 3.72 },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷', country: 'Brasil', countryCode: 'BR', locale: 'pt-BR', decimals: 2, rateToUSD: 4.97 },
  { code: 'VES', name: 'Bolívar Venezolano', symbol: 'Bs', flag: '🇻🇪', country: 'Venezuela', countryCode: 'VE', locale: 'es-VE', decimals: 2, rateToUSD: 36.50 },
  { code: 'UYU', name: 'Peso Uruguayo', symbol: '$U', flag: '🇺🇾', country: 'Uruguay', countryCode: 'UY', locale: 'es-UY', decimals: 2, rateToUSD: 39.80 },
  { code: 'PYG', name: 'Guaraní Paraguayo', symbol: '₲', flag: '🇵🇾', country: 'Paraguay', countryCode: 'PY', locale: 'es-PY', decimals: 0, rateToUSD: 7250 },
  { code: 'BOB', name: 'Boliviano', symbol: 'Bs', flag: '🇧🇴', country: 'Bolivia', countryCode: 'BO', locale: 'es-BO', decimals: 2, rateToUSD: 6.91 },
  { code: 'EC', name: 'Dólar Ecuador', symbol: '$', flag: '🇪🇨', country: 'Ecuador', countryCode: 'EC', locale: 'es-EC', decimals: 2, rateToUSD: 1 },
  
  // Europa
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'Europa', countryCode: 'EU', locale: 'de-DE', decimals: 2, rateToUSD: 0.92 },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧', country: 'Reino Unido', countryCode: 'GB', locale: 'en-GB', decimals: 2, rateToUSD: 0.79 },
  { code: 'CHF', name: 'Franco Suizo', symbol: 'CHF', flag: '🇨🇭', country: 'Suiza', countryCode: 'CH', locale: 'de-CH', decimals: 2, rateToUSD: 0.88 },
  
  // Asia
  { code: 'JPY', name: 'Yen Japonés', symbol: '¥', flag: '🇯🇵', country: 'Japón', countryCode: 'JP', locale: 'ja-JP', decimals: 0, rateToUSD: 149.85 },
  { code: 'CNY', name: 'Yuan Chino', symbol: '¥', flag: '🇨🇳', country: 'China', countryCode: 'CN', locale: 'zh-CN', decimals: 2, rateToUSD: 7.24 },
  { code: 'KRW', name: 'Won Surcoreano', symbol: '₩', flag: '🇰🇷', country: 'Corea del Sur', countryCode: 'KR', locale: 'ko-KR', decimals: 0, rateToUSD: 1325 },
  { code: 'INR', name: 'Rupia India', symbol: '₹', flag: '🇮🇳', country: 'India', countryCode: 'IN', locale: 'hi-IN', decimals: 2, rateToUSD: 83.12 },
];

// Detectar moneda por país (basado en idioma del navegador)
export function detectLocalCurrency(): Currency {
  const lang = navigator.language || 'es';
  const region = lang.split('-')[1]?.toUpperCase() || 'US';
  
  const match = currencies.find(c => c.countryCode === region);
  if (match) return match;
  
  // Fallback según idioma
  if (lang.startsWith('es')) return currencies.find(c => c.code === 'MXN')!;
  if (lang.startsWith('pt')) return currencies.find(c => c.code === 'BRL')!;
  if (lang.startsWith('ja')) return currencies.find(c => c.code === 'JPY')!;
  if (lang.startsWith('zh')) return currencies.find(c => c.code === 'CNY')!;
  
  return currencies.find(c => c.code === 'USD')!;
}

// Convertir de USD a moneda local
export function convertFromUSD(amountUSD: number, currency: Currency): number {
  return amountUSD * currency.rateToUSD;
}

// Convertir de moneda local a USD
export function convertToUSD(amount: number, currency: Currency): number {
  return amount / currency.rateToUSD;
}

// Convertir entre dos monedas (ambas respecto a USD)
export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  const amountUSD = convertToUSD(amount, from);
  return convertFromUSD(amountUSD, to);
}

// Formatear número como moneda localizada
export function formatCurrency(amount: number, currency: Currency, options?: {
  showSymbol?: boolean;
  showCode?: boolean;
  compact?: boolean;
}): string {
  const { showSymbol = true, showCode = false, compact = false } = options || {};
  
  try {
    const formatter = new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
      notation: compact && Math.abs(amount) >= 10000 ? 'compact' : 'standard',
    });
    
    let formatted = formatter.format(amount);
    
    if (!showSymbol) {
      // Remover símbolo de moneda
      formatted = formatted.replace(currency.symbol, '').trim();
    }
    
    if (showCode) {
      formatted = `${formatted} ${currency.code}`;
    }
    
    return formatted;
  } catch {
    // Fallback si el locale no está soportado
    const decimals = currency.decimals;
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${currency.symbol}${formatted}`;
  }
}

// Formatear porcentaje con signo
export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

// Formatear número compacto (1.2K, 3.4M, etc.)
export function formatCompactNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}

// Obtener símbolo de moneda
export function getCurrencySymbol(currency: Currency): string {
  return currency.symbol;
}

// Obtener tasa de cambio formateada
export function formatExchangeRate(from: Currency, to: Currency): string {
  const rate = convertCurrency(1, from, to);
  return `1 ${from.code} = ${formatCurrency(rate, to, { showCode: true })}`;
}

// Agrupar monedas por región
export function getCurrenciesByRegion(): Record<string, Currency[]> {
  return {
    '🌎 Norteamérica': currencies.filter(c => ['US', 'CA', 'MX'].includes(c.countryCode)),
    '🌎 Sudamérica': currencies.filter(c => ['CO', 'AR', 'CL', 'PE', 'BR', 'VE', 'UY', 'PY', 'BO', 'EC'].includes(c.countryCode)),
    '🌍 Europa': currencies.filter(c => ['EU', 'GB', 'CH'].includes(c.countryCode)),
    '🌏 Asia': currencies.filter(c => ['JP', 'CN', 'KR', 'IN'].includes(c.countryCode)),
  };
}

// Países soportados con su moneda local
export const supportedCountries = [
  { code: 'MX', name: 'México', flag: '🇲🇽', currency: 'MXN' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: 'COP' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: 'ARS' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: 'CLP' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪', currency: 'PEN' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', currency: 'BRL' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', currency: 'VES' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', currency: 'USD' },
  { code: 'ES', name: 'España', flag: '🇪🇸', currency: 'EUR' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧', currency: 'GBP' },
  { code: 'JP', name: 'Japón', flag: '🇯🇵', currency: 'JPY' },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: 'CNY' },
];
