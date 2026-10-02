import IB from 'ib';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export interface IBOrder {
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  orderType: 'MKT' | 'LMT' | 'STP' | 'STP LMT';
  limitPrice?: number;
  stopPrice?: number;
  tif?: 'DAY' | 'GTC' | 'IOC' | 'GTD';
}

export interface IBPosition {
  symbol: string;
  position: number;
  marketPrice: number;
  marketValue: number;
  averageCost: number;
  unrealizedPNL: number;
  realizedPNL: number;
}

export interface IBAccountSummary {
  accountCode: string;
  netLiquidation: number;
  totalCashValue: number;
  buyingPower: number;
  grossPositionValue: number;
  unrealizedPNL: number;
  realizedPNL: number;
  availableFunds: number;
  excessLiquidity: number;
}

export class InteractiveBrokersService extends EventEmitter {
  private ib: IB;
  private isConnected: boolean = false;
  private clientId: number;
  private host: string;
  private port: number;
  private nextOrderId: number = -1;
  private positions: Map<string, IBPosition> = new Map();
  private marketData: Map<string, number> = new Map();

  constructor() {
    super();
    this.clientId = parseInt(process.env.IB_CLIENT_ID || '1');
    this.host = process.env.IB_HOST || '127.0.0.1';
    this.port = parseInt(process.env.IB_PORT || '7497'); // 7497 = TWS Paper, 7496 = TWS Live

    this.ib = new IB({
      clientId: this.clientId,
      host: this.host,
      port: this.port,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.ib.on('connected', () => {
      this.isConnected = true;
      logger.info('✅ Conectado a Interactive Brokers TWS/Gateway');
      this.emit('connected');
    });

    this.ib.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('⚠️ Desconectado de Interactive Brokers');
      this.emit('disconnected');
    });

    this.ib.on('error', (err: Error) => {
      logger.error('❌ Error de IB:', err.message);
      this.emit('error', err);
    });

    this.ib.on('result', (event: string, args: any) => {
      this.emit('result', event, args);
    });

    // Manejo de posiciones
    this.ib.on('position', (account: string, contract: any, pos: number, avgCost: number) => {
      const symbol = contract.symbol;
      this.positions.set(symbol, {
        symbol,
        position: pos,
        marketPrice: 0,
        marketValue: pos * avgCost,
        averageCost: avgCost,
        unrealizedPNL: 0,
        realizedPNL: 0,
      });
      this.emit('position', { symbol, position: pos, avgCost });
    });

    // Manejo de datos de mercado
    this.ib.on('tickPrice', (tickerId: number, field: number, price: number) => {
      if (field === 1 || field === 2 || field === 4) { // BID, ASK, LAST
        this.emit('tickPrice', { tickerId, price });
      }
    });

    // Manejo de órdenes
    this.ib.on('orderStatus', (orderId: number, status: string, filled: number, remaining: number, avgFillPrice: number) => {
      logger.info(`📋 Orden ${orderId}: ${status} | Llenado: ${filled} | Restante: ${remaining}`);
      this.emit('orderStatus', { orderId, status, filled, remaining, avgFillPrice });
    });

    this.ib.on('execDetails', (orderId: number, contract: any, exec: any) => {
      logger.info(`✅ Ejecución: ${contract.symbol} ${exec.side} ${exec.shares} @ ${exec.price}`);
      this.emit('execution', { orderId, symbol: contract.symbol, side: exec.side, shares: exec.shares, price: exec.price });
    });
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout conectando a IB TWS'));
      }, 10000);

      this.ib.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.ib.once('error', (err: Error) => {
        clearTimeout(timeout);
        reject(err);
      });

      this.ib.connect();
    });
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      this.ib.disconnect();
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Obtener siguiente ID de orden válido
  async getNextOrderId(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.nextOrderId > 0) {
        resolve(this.nextOrderId++);
        return;
      }

      this.ib.once('nextValidId', (orderId: number) => {
        this.nextOrderId = orderId + 1;
        resolve(orderId);
      });

      this.ib.reqIds();
    });
  }

  // Obtener resumen de cuenta
  async getAccountSummary(): Promise<IBAccountSummary> {
    return new Promise((resolve, reject) => {
      const summary: any = {};
      const timeout = setTimeout(() => reject(new Error('Timeout obteniendo resumen')), 10000);

      const handler = (reqId: number, account: string, tag: string, value: string, currency: string) => {
        switch (tag) {
          case 'NetLiquidation': summary.netLiquidation = parseFloat(value); break;
          case 'TotalCashValue': summary.totalCashValue = parseFloat(value); break;
          case 'BuyingPower': summary.buyingPower = parseFloat(value); break;
          case 'GrossPositionValue': summary.grossPositionValue = parseFloat(value); break;
          case 'UnrealizedPnL': summary.unrealizedPNL = parseFloat(value); break;
          case 'RealizedPnL': summary.realizedPNL = parseFloat(value); break;
          case 'AvailableFunds': summary.availableFunds = parseFloat(value); break;
          case 'ExcessLiquidity': summary.excessLiquidity = parseFloat(value); break;
          case 'AccountCode': summary.accountCode = value; break;
        }
      };

      this.ib.on('accountValue', handler);
      
      this.ib.once('accountDownloadEnd', () => {
        clearTimeout(timeout);
        this.ib.removeListener('accountValue', handler);
        resolve(summary as IBAccountSummary);
      });

      this.ib.reqAccountSummary(9001, 'All', [
        'NetLiquidation', 'TotalCashValue', 'BuyingPower',
        'GrossPositionValue', 'UnrealizedPnL', 'RealizedPnL',
        'AvailableFunds', 'ExcessLiquidity', 'AccountCode'
      ]);
    });
  }

  // Obtener posiciones actuales
  getPositions(): IBPosition[] {
    return Array.from(this.positions.values());
  }

  // Crear contrato para un símbolo
  private createContract(symbol: string, secType: string = 'STK', exchange: string = 'SMART', currency: string = 'USD'): any {
    if (secType === 'CASH') {
      // Para Forex
      const [base, quote] = symbol.split('/');
      return {
        symbol: base,
        secType: 'CASH',
        exchange: 'IDEALPRO',
        currency: quote,
      };
    }

    return {
      symbol,
      secType,
      exchange,
      primaryExch: exchange === 'SMART' ? 'NASDAQ' : exchange,
      currency,
    };
  }

  // Solicitar datos de mercado en tiempo real
  async requestMarketData(symbol: string, secType: string = 'STK'): Promise<number> {
    return new Promise((resolve, reject) => {
      const contract = this.createContract(symbol, secType);
      const tickerId = Date.now();

      const timeout = setTimeout(() => {
        reject(new Error(`Timeout obteniendo precio para ${symbol}`));
      }, 5000);

      const handler = (id: number, field: number, price: number) => {
        if (id === tickerId && (field === 1 || field === 2 || field === 4)) {
          clearTimeout(timeout);
          this.ib.cancelMktData(tickerId);
          this.ib.removeListener('tickPrice', handler);
          this.marketData.set(symbol, price);
          resolve(price);
        }
      };

      this.ib.on('tickPrice', handler);
      this.ib.reqMktData(tickerId, contract, '', false, false);
    });
  }

  // Ejecutar orden de mercado
  async placeOrder(order: IBOrder): Promise<{ orderId: number; status: string }> {
    const orderId = await this.getNextOrderId();
    const contract = this.createContract(order.symbol);
    
    const ibOrder = {
      orderId,
      action: order.action,
      totalQuantity: order.quantity,
      orderType: order.orderType,
      lmtPrice: order.limitPrice,
      auxPrice: order.stopPrice,
      tif: order.tif || 'DAY',
      transmit: true,
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout ejecutando orden'));
      }, 30000);

      const handler = (id: number, status: string) => {
        if (id === orderId) {
          if (['Filled', 'Cancelled', 'ApiCancelled'].includes(status)) {
            clearTimeout(timeout);
            this.ib.removeListener('orderStatus', handler);
            resolve({ orderId, status });
          }
        }
      };

      this.ib.on('orderStatus', handler);
      this.ib.placeOrder(orderId, contract, ibOrder);
      logger.info(`📤 Orden enviada: ${order.action} ${order.quantity} ${order.symbol} @ ${order.orderType}`);
    });
  }

  // Cancelar orden
  async cancelOrder(orderId: number): Promise<void> {
    this.ib.cancelOrder(orderId);
    logger.info(`❌ Orden ${orderId} cancelada`);
  }

  // Obtener historial de órdenes
  async getOrderHistory(): Promise<any[]> {
    return new Promise((resolve) => {
      const orders: any[] = [];
      
      this.ib.once('openOrder', (orderId: number, contract: any, order: any, state: any) => {
        orders.push({
          orderId,
          symbol: contract.symbol,
          action: order.action,
          quantity: order.totalQuantity,
          orderType: order.orderType,
          status: state.status,
          filled: order.filledQuantity,
          remaining: order.remainingQuantity,
        });
      });

      this.ib.reqAllOpenOrders();
      
      setTimeout(() => resolve(orders), 3000);
    });
  }

  // Suscribirse a datos de mercado en tiempo real
  subscribeMarketData(symbols: string[]): void {
    symbols.forEach((symbol, index) => {
      const contract = this.createContract(symbol);
      this.ib.reqMktData(1000 + index, contract, '', false, false);
    });
  }

  // Obtener precio histórico
  async getHistoricalData(symbol: string, duration: string = '1 M', barSize: string = '1 day'): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const contract = this.createContract(symbol);
      const endDateTime = '';
      const whatToShow = 'TRADES';
      const useRTH = 1;
      const formatDate = 1;

      const bars: any[] = [];
      
      this.ib.once('historicalData', (reqId: number, bar: any) => {
        if (bar.length === 0) {
          resolve(bars);
        }
      });

      this.ib.on('historicalData', (reqId: number, bar: any) => {
        bars.push({
          date: bar.date,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume,
        });
      });

      this.ib.reqHistoricalData(
        1, contract, endDateTime, duration, barSize,
        whatToShow, useRTH, formatDate, false, null
      );
    });
  }
}
