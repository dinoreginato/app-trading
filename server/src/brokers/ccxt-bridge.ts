import ccxt from 'ccxt';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export interface CryptoOrder {
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  type: 'market' | 'limit';
  price?: number;
  exchange: string;
}

export interface CryptoPosition {
  symbol: string;
  amount: number;
  side: 'long' | 'short';
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  exchange: string;
}

export class CCXTBridgeService extends EventEmitter {
  private exchanges: Map<string, ccxt.Exchange> = new Map();
  private isConnected: boolean = false;

  constructor() {
    super();
    this.initializeExchanges();
  }

  private initializeExchanges(): void {
    // Binance
    if (process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET) {
      const binance = new ccxt.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_SECRET,
        options: { defaultType: 'spot' }
      });
      this.exchanges.set('binance', binance);
      logger.info('✅ Binance configurado');
    }

    // Coinbase
    if (process.env.COINBASE_API_KEY && process.env.COINBASE_SECRET) {
      const coinbase = new ccxt.coinbase({
        apiKey: process.env.COINBASE_API_KEY,
        secret: process.env.COINBASE_SECRET,
      });
      this.exchanges.set('coinbase', coinbase);
      logger.info('✅ Coinbase configurado');
    }

    // Kraken
    if (process.env.KRAKEN_API_KEY && process.env.KRAKEN_SECRET) {
      const kraken = new ccxt.kraken({
        apiKey: process.env.KRAKEN_API_KEY,
        secret: process.env.KRAKEN_SECRET,
      });
      this.exchanges.set('kraken', kraken);
      logger.info('✅ Kraken configurado');
    }

    // Bitso (LATAM)
    if (process.env.BITSO_API_KEY && process.env.BITSO_SECRET) {
      const bitso = new ccxt.bitso({
        apiKey: process.env.BITSO_API_KEY,
        secret: process.env.BITSO_SECRET,
      });
      this.exchanges.set('bitso', bitso);
      logger.info('✅ Bitso configurado (LATAM)');
    }

    this.isConnected = this.exchanges.size > 0;
  }

  async connect(exchangeName: string): Promise<boolean> {
    const exchange = this.exchanges.get(exchangeName);
    if (!exchange) {
      throw new Error(`Exchange ${exchangeName} no configurado`);
    }

    try {
      await exchange.loadMarkets();
      logger.info(`✅ Conectado a ${exchangeName} - ${Object.keys(exchange.markets).length} mercados`);
      return true;
    } catch (error: any) {
      logger.error(`❌ Error conectando a ${exchangeName}:`, error.message);
      throw error;
    }
  }

  async disconnect(exchangeName: string): Promise<void> {
    const exchange = this.exchanges.get(exchangeName);
    if (exchange) {
      await exchange.close();
      logger.info(`🔌 Desconectado de ${exchangeName}`);
    }
  }

  getExchange(name: string): ccxt.Exchange {
    const exchange = this.exchanges.get(name);
    if (!exchange) {
      throw new Error(`Exchange ${name} no disponible`);
    }
    return exchange;
  }

  getAvailableExchanges(): string[] {
    return Array.from(this.exchanges.keys());
  }

  // Obtener balance de un exchange
  async getBalance(exchangeName: string): Promise<any> {
    const exchange = this.getExchange(exchangeName);
    const balance = await exchange.fetchBalance();
    
    return {
      exchange: exchangeName,
      total: balance.total,
      free: balance.free,
      used: balance.used,
      info: balance.info,
    };
  }

  // Obtener precio actual
  async getTicker(exchangeName: string, symbol: string): Promise<any> {
    const exchange = this.getExchange(exchangeName);
    const ticker = await exchange.fetchTicker(symbol);
    
    return {
      symbol: ticker.symbol,
      last: ticker.last,
      bid: ticker.bid,
      ask: ticker.ask,
      high: ticker.high,
      low: ticker.low,
      volume: ticker.baseVolume,
      change: ticker.percentage,
      timestamp: ticker.timestamp,
    };
  }

  // Obtener orderbook
  async getOrderBook(exchangeName: string, symbol: string, limit: number = 20): Promise<any> {
    const exchange = this.getExchange(exchangeName);
    const orderbook = await exchange.fetchOrderBook(symbol, limit);
    
    return {
      symbol: orderbook.symbol,
      bids: orderbook.bids,
      asks: orderbook.asks,
      timestamp: orderbook.timestamp,
      datetime: orderbook.datetime,
    };
  }

  // Ejecutar orden
  async placeOrder(order: CryptoOrder): Promise<any> {
    const exchange = this.getExchange(order.exchange);
    
    let result;
    if (order.type === 'market') {
      result = await exchange.createMarketOrder(order.symbol, order.side, order.amount);
    } else {
      if (!order.price) {
        throw new Error('Precio requerido para orden limit');
      }
      result = await exchange.createLimitOrder(order.symbol, order.side, order.amount, order.price);
    }

    logger.info(`📤 Orden crypto: ${order.side.toUpperCase()} ${order.amount} ${order.symbol} en ${order.exchange}`);
    
    return {
      id: result.id,
      symbol: result.symbol,
      type: result.type,
      side: result.side,
      amount: result.amount,
      price: result.price,
      cost: result.cost,
      status: result.status,
      timestamp: result.timestamp,
      exchange: order.exchange,
    };
  }

  // Cancelar orden
  async cancelOrder(exchangeName: string, orderId: string, symbol: string): Promise<void> {
    const exchange = this.getExchange(exchangeName);
    await exchange.cancelOrder(orderId, symbol);
    logger.info(`❌ Orden ${orderId} cancelada en ${exchangeName}`);
  }

  // Obtener posiciones abiertas
  async getPositions(exchangeName: string): Promise<CryptoPosition[]> {
    const exchange = this.getExchange(exchangeName);
    
    try {
      const positions = await exchange.fetchPositions();
      return positions.map((p: any) => ({
        symbol: p.symbol,
        amount: p.contracts,
        side: p.side,
        entryPrice: p.entryPrice,
        markPrice: p.markPrice,
        unrealizedPnl: p.unrealizedPnl,
        exchange: exchangeName,
      }));
    } catch (error) {
      // Algunos exchanges no soportan fetchPositions
      return [];
    }
  }

  // Obtener historial de órdenes
  async getOrderHistory(exchangeName: string, symbol?: string, limit: number = 50): Promise<any[]> {
    const exchange = this.getExchange(exchangeName);
    const orders = await exchange.fetchOrders(symbol, undefined, limit);
    
    return orders.map((o: any) => ({
      id: o.id,
      symbol: o.symbol,
      type: o.type,
      side: o.side,
      amount: o.amount,
      price: o.price,
      cost: o.cost,
      status: o.status,
      timestamp: o.timestamp,
      datetime: o.datetime,
    }));
  }

  // Obtener datos OHLCV (velas)
  async getOHLCV(exchangeName: string, symbol: string, timeframe: string = '1d', limit: number = 100): Promise<any[]> {
    const exchange = this.getExchange(exchangeName);
    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
    
    return ohlcv.map((candle: number[]) => ({
      timestamp: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
    }));
  }

  // Obtener trades recientes
  async getRecentTrades(exchangeName: string, symbol: string, limit: number = 50): Promise<any[]> {
    const exchange = this.getExchange(exchangeName);
    const trades = await exchange.fetchTrades(symbol, undefined, limit);
    
    return trades.map((t: any) => ({
      id: t.id,
      symbol: t.symbol,
      price: t.price,
      amount: t.amount,
      cost: t.cost,
      side: t.side,
      timestamp: t.timestamp,
      datetime: t.datetime,
    }));
  }
}
