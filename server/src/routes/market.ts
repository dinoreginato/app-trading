import { Router, Response } from 'express';
import { query } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { InteractiveBrokersService } from '../brokers/interactive-brokers';
import { CCXTBridgeService } from '../brokers/ccxt-bridge';
import { logger } from '../utils/logger';

export const marketRoutes = Router();

// Obtener precio en tiempo real IB
marketRoutes.get('/ib/price/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const ibService: InteractiveBrokersService = req.app.get('ibService');
    const { symbol } = req.params;
    const secType = req.query.secType as string || 'STK';

    if (!ibService.getConnectionStatus()) {
      return res.status(503).json({ 
        error: 'Interactive Brokers no conectado',
        code: 'IB_NOT_CONNECTED'
      });
    }

    const price = await ibService.requestMarketData(symbol, secType);

    res.json({
      success: true,
      data: {
        symbol,
        price,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('Error obteniendo precio IB:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener datos históricos IB
marketRoutes.get('/ib/history/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const ibService: InteractiveBrokersService = req.app.get('ibService');
    const { symbol } = req.params;
    const { duration, barSize } = req.query;

    if (!ibService.getConnectionStatus()) {
      return res.status(503).json({ 
        error: 'Interactive Brokers no conectado',
        code: 'IB_NOT_CONNECTED'
      });
    }

    const data = await ibService.getHistoricalData(
      symbol,
      duration as string || '1 M',
      barSize as string || '1 day'
    );

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo histórico IB:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener ticker crypto
marketRoutes.get('/crypto/ticker/:exchange/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    const { exchange, symbol } = req.params;

    const ticker = await ccxtService.getTicker(exchange, symbol);

    res.json({
      success: true,
      data: ticker,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo ticker crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener orderbook crypto
marketRoutes.get('/crypto/orderbook/:exchange/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    const { exchange, symbol } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const orderbook = await ccxtService.getOrderBook(exchange, symbol, limit);

    res.json({
      success: true,
      data: orderbook,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo orderbook crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener OHLCV crypto
marketRoutes.get('/crypto/ohlcv/:exchange/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    const { exchange, symbol } = req.params;
    const { timeframe, limit } = req.query;

    const data = await ccxtService.getOHLCV(
      exchange,
      symbol,
      timeframe as string || '1d',
      limit ? parseInt(limit as string) : 100
    );

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo OHLCV crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener trades recientes crypto
marketRoutes.get('/crypto/trades/:exchange/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    const { exchange, symbol } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const trades = await ccxtService.getRecentTrades(exchange, symbol, limit);

    res.json({
      success: true,
      data: trades,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo trades crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Suscribir a datos en tiempo real (WebSocket)
marketRoutes.post('/subscribe', async (req: AuthRequest, res: Response) => {
  try {
    const ibService: InteractiveBrokersService = req.app.get('ibService');
    const { symbols } = req.body;

    if (ibService.getConnectionStatus()) {
      ibService.subscribeMarketData(symbols);
    }

    res.json({
      success: true,
      message: `Suscrito a ${symbols.length} símbolos`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error suscribiendo a datos:', error);
    res.status(500).json({ error: error.message });
  }
});
