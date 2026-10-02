import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH
// ============================================
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// ============================================
// ACCOUNT
// ============================================
export const accountAPI = {
  getStatus: async () => {
    const response = await api.get('/account/status');
    return response.data;
  },

  getIBSummary: async () => {
    const response = await api.get('/account/ib/summary');
    return response.data;
  },

  getIBPositions: async () => {
    const response = await api.get('/account/ib/positions');
    return response.data;
  },

  getCryptoBalance: async (exchange: string) => {
    const response = await api.get(`/account/crypto/balance/${exchange}`);
    return response.data;
  },

  getCryptoPositions: async (exchange: string) => {
    const response = await api.get(`/account/crypto/positions/${exchange}`);
    return response.data;
  },
};

// ============================================
// TRADING
// ============================================
export const tradingAPI = {
  // Interactive Brokers
  placeIBOrder: async (order: {
    symbol: string;
    action: 'BUY' | 'SELL';
    quantity: number;
    orderType: 'MKT' | 'LMT' | 'STP' | 'STP LMT';
    limitPrice?: number;
    stopPrice?: number;
    tif?: 'DAY' | 'GTC' | 'IOC' | 'GTD';
  }) => {
    const response = await api.post('/trading/ib/order', order);
    return response.data;
  },

  cancelIBOrder: async (orderId: number) => {
    const response = await api.post(`/trading/ib/cancel/${orderId}`);
    return response.data;
  },

  getIBOrders: async () => {
    const response = await api.get('/trading/ib/orders');
    return response.data;
  },

  // Crypto
  placeCryptoOrder: async (order: {
    symbol: string;
    side: 'buy' | 'sell';
    amount: number;
    type: 'market' | 'limit';
    price?: number;
    exchange: string;
  }) => {
    const response = await api.post('/trading/crypto/order', order);
    return response.data;
  },

  cancelCryptoOrder: async (exchange: string, orderId: string, symbol: string) => {
    const response = await api.post('/trading/crypto/cancel', { exchange, orderId, symbol });
    return response.data;
  },

  getCryptoOrders: async (exchange: string, symbol?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (symbol) params.append('symbol', symbol);
    if (limit) params.append('limit', limit.toString());
    const response = await api.get(`/trading/crypto/orders/${exchange}?${params}`);
    return response.data;
  },
};

// ============================================
// MARKET DATA
// ============================================
export const marketAPI = {
  // Interactive Brokers
  getIBPrice: async (symbol: string, secType?: string) => {
    const params = secType ? `?secType=${secType}` : '';
    const response = await api.get(`/market/ib/price/${symbol}${params}`);
    return response.data;
  },

  getIBHistory: async (symbol: string, duration?: string, barSize?: string) => {
    const params = new URLSearchParams();
    if (duration) params.append('duration', duration);
    if (barSize) params.append('barSize', barSize);
    const response = await api.get(`/market/ib/history/${symbol}?${params}`);
    return response.data;
  },

  // Crypto
  getCryptoTicker: async (exchange: string, symbol: string) => {
    const response = await api.get(`/market/crypto/ticker/${exchange}/${symbol}`);
    return response.data;
  },

  getCryptoOrderBook: async (exchange: string, symbol: string, limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/market/crypto/orderbook/${exchange}/${symbol}${params}`);
    return response.data;
  },

  getCryptoOHLCV: async (exchange: string, symbol: string, timeframe?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (timeframe) params.append('timeframe', timeframe);
    if (limit) params.append('limit', limit.toString());
    const response = await api.get(`/market/crypto/ohlcv/${exchange}/${symbol}?${params}`);
    return response.data;
  },

  getCryptoTrades: async (exchange: string, symbol: string, limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/market/crypto/trades/${exchange}/${symbol}${params}`);
    return response.data;
  },

  subscribe: async (symbols: string[]) => {
    const response = await api.post('/market/subscribe', { symbols });
    return response.data;
  },
};

// ============================================
// AUTO-TRADER
// ============================================
export const autoTraderAPI = {
  start: async (config: {
    initialCapital: number;
    targetAmount: number;
    riskLevel: 'conservative' | 'moderate' | 'aggressive';
    categories: string[];
    baseCurrency: string;
    stopLossPercent?: number;
    takeProfitPercent?: number;
  }) => {
    const response = await api.post('/autotrader/start', config);
    return response.data;
  },

  stop: async (sessionId: string) => {
    const response = await api.post('/autotrader/stop', { sessionId });
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get('/autotrader/status');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/autotrader/stats');
    return response.data;
  },

  getTrades: async (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const response = await api.get(`/autotrader/trades?${params}`);
    return response.data;
  },

  getSignals: async () => {
    const response = await api.get('/autotrader/signals');
    return response.data;
  },
};

export default api;
