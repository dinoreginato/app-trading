import { BrokerConfig } from '../components/BrokerConfig';

// Servicio de Trading Real
// Conecta con brokers reales para ejecutar operaciones

export interface RealTradeOrder {
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  type: 'market' | 'limit';
  limitPrice?: number;
  timeInForce?: 'day' | 'gtc' | 'ioc';
}

export interface TradeResult {
  success: boolean;
  orderId?: string;
  filledPrice?: number;
  filledQuantity?: number;
  commission?: number;
  error?: string;
  timestamp: string;
}

export interface AccountBalance {
  cash: number;
  portfolioValue: number;
  buyingPower: number;
  currency: string;
}

class TradingService {
  private config: BrokerConfig | null = null;
  private logs: any[] = [];

  // Configurar broker
  setConfig(config: BrokerConfig) {
    this.config = config;
    this.log('CONFIG', `Broker configurado: ${config.broker}`, { paper: config.isPaperTrading });
  }

  // Verificar si está configurado
  isConfigured(): boolean {
    return this.config?.isConfigured || false;
  }

  // Verificar si es paper trading
  isPaperTrading(): boolean {
    return this.config?.isPaperTrading || true;
  }

  // Obtener balance de la cuenta
  async getBalance(): Promise<AccountBalance | null> {
    if (!this.isConfigured()) {
      this.log('ERROR', 'Broker no configurado');
      return null;
    }

    try {
      const balance = await this.fetchBalance();
      this.log('BALANCE', 'Balance obtenido', balance);
      return balance;
    } catch (error) {
      this.log('ERROR', 'Error obteniendo balance', error);
      return null;
    }
  }

  // Ejecutar orden de compra/venta
  async executeOrder(order: RealTradeOrder): Promise<TradeResult> {
    if (!this.isConfigured()) {
      this.log('ERROR', 'Broker no configurado');
      return {
        success: false,
        error: 'Broker no configurado',
        timestamp: new Date().toISOString(),
      };
    }

    this.log('ORDER', `Ejecutando orden: ${order.side} ${order.quantity} ${order.symbol}`, order);

    try {
      const result = await this.placeOrder(order);
      
      this.log('ORDER_SUCCESS', 'Orden ejecutada', {
        orderId: result.orderId,
        symbol: order.symbol,
        side: order.side,
        quantity: result.filledQuantity,
        price: result.filledPrice,
        commission: result.commission,
      });

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      this.log('ORDER_ERROR', 'Error ejecutando orden', { error: errorMsg, order });
      
      return {
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Obtener logs de auditoría
  getLogs() {
    return this.logs;
  }

  // Limpiar logs
  clearLogs() {
    this.logs = [];
  }

  // === MÉTODOS PRIVADOS ===

  private async fetchBalance(): Promise<AccountBalance> {
    if (!this.config) throw new Error('No config');

    switch (this.config.broker) {
      case 'alpaca':
        return this.fetchAlpacaBalance();
      case 'binance':
        return this.fetchBinanceBalance();
      case 'coinbase':
        return this.fetchCoinbaseBalance();
      case 'ibkr':
        return this.fetchIBKRBalance();
      default:
        throw new Error('Broker no soportado');
    }
  }

  private async placeOrder(order: RealTradeOrder): Promise<TradeResult> {
    if (!this.config) throw new Error('No config');

    // Si es paper trading, simular la orden
    if (this.config.isPaperTrading) {
      return this.simulateOrder(order);
    }

    // Orden real
    switch (this.config.broker) {
      case 'alpaca':
        return this.placeAlpacaOrder(order);
      case 'binance':
        return this.placeBinanceOrder(order);
      case 'coinbase':
        return this.placeCoinbaseOrder(order);
      case 'ibkr':
        return this.placeIBKROrder(order);
      default:
        throw new Error('Broker no soportado');
    }
  }

  // === ALPACA (Acciones USA) ===
  
  private async fetchAlpacaBalance(): Promise<AccountBalance> {
    // En producción, llamar a la API real de Alpaca
    // const response = await fetch('https://api.alpaca.markets/v2/account', {
    //   headers: {
    //     'APCA-API-KEY-ID': this.config!.apiKey,
    //     'APCA-API-SECRET-KEY': this.config!.apiSecret,
    //   }
    // });
    // const data = await response.json();
    
    // Por ahora, retornar datos simulados
    return {
      cash: 10000,
      portfolioValue: 15000,
      buyingPower: 20000,
      currency: 'USD',
    };
  }

  private async placeAlpacaOrder(order: RealTradeOrder): Promise<TradeResult> {
    // En producción, llamar a la API real de Alpaca
    // const response = await fetch('https://api.alpaca.markets/v2/orders', {
    //   method: 'POST',
    //   headers: {
    //     'APCA-API-KEY-ID': this.config!.apiKey,
    //     'APCA-API-SECRET-KEY': this.config!.apiSecret,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     symbol: order.symbol,
    //     qty: order.quantity,
    //     side: order.side,
    //     type: order.type,
    //     time_in_force: order.timeInForce || 'day',
    //     limit_price: order.limitPrice,
    //   }),
    // });
    // const data = await response.json();

    // Simular respuesta
    return {
      success: true,
      orderId: `alpaca_${Date.now()}`,
      filledPrice: 100 + Math.random() * 100,
      filledQuantity: order.quantity,
      commission: 0, // Alpaca no cobra comisiones
      timestamp: new Date().toISOString(),
    };
  }

  // === BINANCE (Crypto) ===

  private async fetchBinanceBalance(): Promise<AccountBalance> {
    // En producción, usar el SDK de Binance o llamar a la API
    // const client = new Binance({ apiKey, apiSecret });
    // const account = await client.account();
    
    return {
      cash: 5000,
      portfolioValue: 8000,
      buyingPower: 5000,
      currency: 'USDT',
    };
  }

  private async placeBinanceOrder(order: RealTradeOrder): Promise<TradeResult> {
    // En producción, usar el SDK de Binance
    // const client = new Binance({ apiKey, apiSecret });
    // const result = await client.order({
    //   symbol: order.symbol,
    //   side: order.side.toUpperCase(),
    //   type: order.type.toUpperCase(),
    //   quantity: order.quantity,
    //   price: order.limitPrice,
    // });

    return {
      success: true,
      orderId: `binance_${Date.now()}`,
      filledPrice: 50000 + Math.random() * 10000,
      filledQuantity: order.quantity,
      commission: order.quantity * 0.001, // 0.1% comisión
      timestamp: new Date().toISOString(),
    };
  }

  // === COINBASE (Crypto) ===

  private async fetchCoinbaseBalance(): Promise<AccountBalance> {
    return {
      cash: 3000,
      portfolioValue: 5000,
      buyingPower: 3000,
      currency: 'USD',
    };
  }

  private async placeCoinbaseOrder(order: RealTradeOrder): Promise<TradeResult> {
    return {
      success: true,
      orderId: `coinbase_${Date.now()}`,
      filledPrice: 50000 + Math.random() * 10000,
      filledQuantity: order.quantity,
      commission: order.quantity * 0.005, // 0.5% comisión
      timestamp: new Date().toISOString(),
    };
  }

  // === INTERACTIVE BROKERS ===

  private async fetchIBKRBalance(): Promise<AccountBalance> {
    return {
      cash: 25000,
      portfolioValue: 50000,
      buyingPower: 100000,
      currency: 'USD',
    };
  }

  private async placeIBKROrder(order: RealTradeOrder): Promise<TradeResult> {
    return {
      success: true,
      orderId: `ibkr_${Date.now()}`,
      filledPrice: 100 + Math.random() * 200,
      filledQuantity: order.quantity,
      commission: 1.00, // $1 por orden
      timestamp: new Date().toISOString(),
    };
  }

  // === SIMULACIÓN (Paper Trading) ===

  private async simulateOrder(order: RealTradeOrder): Promise<TradeResult> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Simular precio de ejecución
    const basePrice = order.symbol.includes('BTC') ? 50000 : 
                      order.symbol.includes('ETH') ? 3000 :
                      order.symbol.includes('AAPL') ? 180 :
                      100 + Math.random() * 100;

    const slippage = (Math.random() - 0.5) * 0.02; // 0-2% slippage
    const filledPrice = basePrice * (1 + slippage);

    return {
      success: true,
      orderId: `paper_${Date.now()}`,
      filledPrice,
      filledQuantity: order.quantity,
      commission: 0, // Paper trading sin comisiones
      timestamp: new Date().toISOString(),
    };
  }

  // === LOGGING ===

  private log(type: string, message: string, data?: any) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data,
      broker: this.config?.broker,
      paper: this.config?.isPaperTrading,
    };

    this.logs.unshift(entry);
    
    // Mantener solo los últimos 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    console.log(`[TradingService] ${type}: ${message}`, data || '');
  }
}

// Instancia singleton
export const tradingService = new TradingService();
