import { Server } from 'socket.io';
import { InteractiveBrokersService } from '../brokers/interactive-brokers';
import { CCXTBridgeService } from '../brokers/ccxt-bridge';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface TradingSession {
  sessionId: string;
  userId: string;
  config: any;
  status: 'running' | 'paused' | 'stopped';
  currentCapital: number;
  trades: any[];
  signals: any[];
  startedAt: Date;
  lastUpdate: Date;
}

export class TradingEngine {
  private ibService: InteractiveBrokersService;
  private ccxtService: CCXTBridgeService;
  private io: Server;
  private sessions: Map<string, TradingSession> = new Map();
  private intervals: Map<string, NodeJS.Timer> = new Map();

  constructor(ibService: InteractiveBrokersService, ccxtService: CCXTBridgeService, io: Server) {
    this.ibService = ibService;
    this.ccxtService = ccxtService;
    this.io = io;
  }

  async startSession(config: any): Promise<string> {
    const sessionId = uuidv4();
    
    const session: TradingSession = {
      sessionId,
      userId: config.userId,
      config,
      status: 'running',
      currentCapital: config.initialCapital,
      trades: [],
      signals: [],
      startedAt: new Date(),
      lastUpdate: new Date(),
    };

    this.sessions.set(config.userId, session);

    // Iniciar ciclo de trading
    this.startTradingCycle(session);

    return sessionId;
  }

  async stopSession(userId: string, sessionId?: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    session.status = 'stopped';
    this.sessions.set(userId, session);

    // Detener intervalo
    const interval = this.intervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(userId);
    }

    logger.info(`⏸️ Sesión ${session.sessionId} detenida para ${userId}`);
  }

  getSessionStatus(userId: string): any {
    const session = this.sessions.get(userId);
    if (!session) {
      return { status: 'inactive' };
    }

    return {
      sessionId: session.sessionId,
      status: session.status,
      currentCapital: session.currentCapital,
      totalTrades: session.trades.length,
      startedAt: session.startedAt,
      lastUpdate: session.lastUpdate,
      config: session.config,
    };
  }

  getSessionStats(userId: string): any {
    const session = this.sessions.get(userId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    const winningTrades = session.trades.filter(t => (t.profit || 0) > 0);
    const losingTrades = session.trades.filter(t => (t.profit || 0) < 0);

    const totalProfit = session.trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const avgProfit = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0) / winningTrades.length 
      : 0;
    const avgLoss = losingTrades.length > 0 
      ? losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0) / losingTrades.length 
      : 0;

    return {
      totalTrades: session.trades.length,
      winRate: session.trades.length > 0 ? (winningTrades.length / session.trades.length) * 100 : 0,
      totalProfit,
      avgProfit,
      avgLoss,
      bestTrade: session.trades.length > 0 ? Math.max(...session.trades.map(t => t.profit || 0)) : 0,
      worstTrade: session.trades.length > 0 ? Math.min(...session.trades.map(t => t.profit || 0)) : 0,
      currentCapital: session.currentCapital,
      initialCapital: session.config.initialCapital,
      targetAmount: session.config.targetAmount,
      progress: ((session.currentCapital - session.config.initialCapital) / (session.config.targetAmount - session.config.initialCapital)) * 100,
    };
  }

  getSessionTrades(userId: string, limit: number = 50, offset: number = 0): any[] {
    const session = this.sessions.get(userId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    return session.trades.slice(offset, offset + limit);
  }

  getActiveSignals(userId: string): any[] {
    const session = this.sessions.get(userId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    return session.signals;
  }

  private startTradingCycle(session: TradingSession): void {
    // Ejecutar ciclo cada 30 segundos
    const interval = setInterval(async () => {
      if (session.status !== 'running') {
        return;
      }

      try {
        await this.executeTradingCycle(session);
      } catch (error: any) {
        logger.error(`Error en ciclo de trading: ${error.message}`);
      }
    }, 30000); // 30 segundos

    this.intervals.set(session.userId, interval);
    logger.info(`🔄 Ciclo de trading iniciado para ${session.userId}`);
  }

  private async executeTradingCycle(session: TradingSession): Promise<void> {
    logger.info(`🔄 Ejecutando ciclo de trading para ${session.userId}`);

    // Generar señales basadas en análisis técnico
    const signals = await this.generateSignals(session);
    session.signals = signals;

    // Ejecutar trades basados en señales
    for (const signal of signals) {
      if (signal.confidence >= 70 && session.status === 'running') {
        await this.executeTrade(session, signal);
      }
    }

    session.lastUpdate = new Date();
    this.sessions.set(session.userId, session);

    // Emitir actualización por WebSocket
    this.io.to(session.userId).emit('sessionUpdate', {
      sessionId: session.sessionId,
      status: session.status,
      currentCapital: session.currentCapital,
      totalTrades: session.trades.length,
      lastUpdate: session.lastUpdate,
    });
  }

  private async generateSignals(session: TradingSession): Promise<any[]> {
    const signals: any[] = [];
    const categories = session.config.categories;

    // Generar señales para cada categoría
    for (const category of categories) {
      // Simular análisis técnico
      const rsi = Math.random() * 100;
      const macdBullish = Math.random() > 0.5;
      const trendUp = Math.random() > 0.4;

      let signalType: string;
      let confidence: number;
      const reasons: string[] = [];

      if (rsi < 25 && macdBullish && trendUp) {
        signalType = 'STRONG_BUY';
        confidence = 85 + Math.random() * 15;
        reasons.push('RSI en sobreventa extrema', 'MACD bullish confirmado', 'Tendencia alcista fuerte');
      } else if (rsi < 35 || (macdBullish && Math.random() > 0.5)) {
        signalType = 'BUY';
        confidence = 65 + Math.random() * 20;
        if (rsi < 35) reasons.push('RSI bajo - posible rebote');
        if (macdBullish) reasons.push('MACD cruzando al alza');
      } else if (rsi > 75 && !macdBullish) {
        signalType = 'STRONG_SELL';
        confidence = 80 + Math.random() * 18;
        reasons.push('RSI en sobrecompra extrema', 'MACD bearish', 'Posible corrección fuerte');
      } else if (rsi > 65 || (!macdBullish && !trendUp)) {
        signalType = 'SELL';
        confidence = 60 + Math.random() * 20;
        if (rsi > 65) reasons.push('RSI alto - tomar ganancias');
        if (!trendUp) reasons.push('Tendencia bajista');
      } else {
        signalType = 'HOLD';
        confidence = 45 + Math.random() * 20;
        reasons.push('Sin señales claras', 'Esperar confirmación');
      }

      // Seleccionar símbolo aleatorio de la categoría
      const symbols = this.getSymbolsForCategory(category);
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      signals.push({
        symbol,
        category,
        type: signalType,
        confidence: Math.round(confidence),
        reasons,
        indicators: {
          rsi: Math.round(rsi),
          macd: macdBullish ? 'Bullish' : 'Bearish',
          trend: trendUp ? 'Alcista' : 'Bajista',
        },
        timestamp: new Date().toISOString(),
      });
    }

    return signals;
  }

  private async executeTrade(session: TradingSession, signal: any): Promise<void> {
    const isBuy = signal.type.includes('BUY');
    const riskMultiplier = session.config.riskLevel === 'aggressive' ? 0.12 
                          : session.config.riskLevel === 'moderate' ? 0.07 
                          : 0.04;
    
    const tradeAmount = session.currentCapital * riskMultiplier * (0.5 + Math.random() * 0.5);
    
    // Simular profit/loss
    const profitPercent = (Math.random() - 0.35) * 6;
    const profit = tradeAmount * (profitPercent / 100);

    const trade = {
      id: uuidv4(),
      sessionId: session.sessionId,
      symbol: signal.symbol,
      category: signal.category,
      type: isBuy ? 'BUY' : 'SELL',
      amount: tradeAmount,
      price: 100 + Math.random() * 400, // Precio simulado
      quantity: Math.floor(tradeAmount / 100),
      reason: signal.reasons.join(', '),
      confidence: signal.confidence,
      profit: isBuy ? profit : -profit * 0.3,
      timestamp: new Date().toISOString(),
    };

    session.trades.push(trade);
    session.currentCapital += trade.profit;

    logger.info(`💰 Trade ejecutado: ${trade.type} ${trade.symbol} | P&L: ${trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}`);

    // Emitir trade por WebSocket
    this.io.to(session.userId).emit('newTrade', trade);
  }

  private getSymbolsForCategory(category: string): string[] {
    const symbols: Record<string, string[]> = {
      stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM'],
      crypto: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'],
      forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/MXN', 'USD/COP'],
      commodities: ['XAU/USD', 'XAG/USD', 'WTI', 'NATGAS'],
    };

    return symbols[category] || [];
  }
}
