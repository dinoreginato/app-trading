import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { InteractiveBrokersService } from '../brokers/interactive-brokers';
import { CCXTBridgeService } from '../brokers/ccxt-bridge';
import { logger } from '../utils/logger';

export const tradingRoutes = Router();

// Ejecutar orden en Interactive Brokers
tradingRoutes.post('/ib/order',
  [
    body('symbol').isString().notEmpty(),
    body('action').isIn(['BUY', 'SELL']),
    body('quantity').isInt({ min: 1 }),
    body('orderType').isIn(['MKT', 'LMT', 'STP', 'STP LMT']),
    body('limitPrice').optional().isFloat(),
    body('stopPrice').optional().isFloat(),
    body('tif').optional().isIn(['DAY', 'GTC', 'IOC', 'GTD']),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const ibService: InteractiveBrokersService = req.app.get('ibService');
      
      if (!ibService.getConnectionStatus()) {
        return res.status(503).json({ 
          error: 'Interactive Brokers no conectado',
          code: 'IB_NOT_CONNECTED'
        });
      }

      const { symbol, action, quantity, orderType, limitPrice, stopPrice, tif } = req.body;

      logger.info(`📤 Orden IB: ${action} ${quantity} ${symbol} (${orderType})`);

      const result = await ibService.placeOrder({
        symbol,
        action,
        quantity,
        orderType,
        limitPrice,
        stopPrice,
        tif
      });

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      logger.error('Error ejecutando orden IB:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Cancelar orden IB
tradingRoutes.post('/ib/cancel/:orderId', async (req: AuthRequest, res: Response) => {
  try {
    const ibService: InteractiveBrokersService = req.app.get('ibService');
    const orderId = parseInt(req.params.orderId);

    await ibService.cancelOrder(orderId);

    res.json({
      success: true,
      message: `Orden ${orderId} cancelada`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error cancelando orden IB:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener órdenes abiertas IB
tradingRoutes.get('/ib/orders', async (req: AuthRequest, res: Response) => {
  try {
    const ibService: InteractiveBrokersService = req.app.get('ibService');
    const orders = await ibService.getOrderHistory();

    res.json({
      success: true,
      data: orders,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo órdenes IB:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ejecutar orden crypto
tradingRoutes.post('/crypto/order',
  [
    body('symbol').isString().notEmpty(),
    body('side').isIn(['buy', 'sell']),
    body('amount').isFloat({ min: 0.00000001 }),
    body('type').isIn(['market', 'limit']),
    body('price').optional().isFloat(),
    body('exchange').isString().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
      const { symbol, side, amount, type, price, exchange } = req.body;

      logger.info(`📤 Orden crypto: ${side} ${amount} ${symbol} en ${exchange}`);

      const result = await ccxtService.placeOrder({
        symbol,
        side,
        amount,
        type,
        price,
        exchange
      });

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      logger.error('Error ejecutando orden crypto:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Cancelar orden crypto
tradingRoutes.post('/crypto/cancel', async (req: AuthRequest, res: Response) => {
  try {
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    const { exchange, orderId, symbol } = req.body;

    await ccxtService.cancelOrder(exchange, orderId, symbol);

    res.json({
      success: true,
      message: `Orden ${orderId} cancelada en ${exchange}`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error cancelando orden crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener historial de órdenes crypto
tradingRoutes.get('/crypto/orders/:exchange', async (req: AuthRequest, res: Response) => {
  try {
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    const { exchange } = req.params;
    const { symbol, limit } = req.query;

    const orders = await ccxtService.getOrderHistory(
      exchange,
      symbol as string | undefined,
      limit ? parseInt(limit as string) : 50
    );

    res.json({
      success: true,
      data: orders,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo órdenes crypto:', error);
    res.status(500).json({ error: error.message });
  }
});
