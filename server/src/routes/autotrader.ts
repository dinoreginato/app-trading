import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { TradingEngine } from '../services/trading-engine';
import { logger } from '../utils/logger';

export const autoTraderRoutes = Router();

// Iniciar auto-trader
autoTraderRoutes.post('/start',
  [
    body('initialCapital').isFloat({ min: 100 }),
    body('targetAmount').isFloat({ min: 101 }),
    body('riskLevel').isIn(['conservative', 'moderate', 'aggressive']),
    body('categories').isArray({ min: 1 }),
    body('baseCurrency').isString(),
    body('stopLossPercent').optional().isFloat({ min: 0.1, max: 50 }),
    body('takeProfitPercent').optional().isFloat({ min: 0.1, max: 100 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tradingEngine: TradingEngine = req.app.get('tradingEngine');
      const userId = req.userId!;

      const config = {
        userId,
        initialCapital: req.body.initialCapital,
        targetAmount: req.body.targetAmount,
        riskLevel: req.body.riskLevel,
        categories: req.body.categories,
        baseCurrency: req.body.baseCurrency,
        stopLossPercent: req.body.stopLossPercent || 3,
        takeProfitPercent: req.body.takeProfitPercent || 5,
      };

      const sessionId = await tradingEngine.startSession(config);

      logger.info(`🤖 Auto-Trader iniciado para ${userId}: Sesión ${sessionId}`);

      res.json({
        success: true,
        data: {
          sessionId,
          status: 'running',
          config,
          startedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      logger.error('Error iniciando auto-trader:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Detener auto-trader
autoTraderRoutes.post('/stop', async (req: AuthRequest, res: Response) => {
  try {
    const tradingEngine: TradingEngine = req.app.get('tradingEngine');
    const userId = req.userId!;
    const { sessionId } = req.body;

    await tradingEngine.stopSession(userId, sessionId);

    logger.info(`⏸️ Auto-Trader detenido para ${userId}`);

    res.json({
      success: true,
      message: 'Auto-Trader detenido',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error deteniendo auto-trader:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener estado del auto-trader
autoTraderRoutes.get('/status', async (req: AuthRequest, res: Response) => {
  try {
    const tradingEngine: TradingEngine = req.app.get('tradingEngine');
    const userId = req.userId!;

    const status = tradingEngine.getSessionStatus(userId);

    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo estado auto-trader:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener estadísticas del auto-trader
autoTraderRoutes.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const tradingEngine: TradingEngine = req.app.get('tradingEngine');
    const userId = req.userId!;

    const stats = tradingEngine.getSessionStats(userId);

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener historial de operaciones del auto-trader
autoTraderRoutes.get('/trades', async (req: AuthRequest, res: Response) => {
  try {
    const tradingEngine: TradingEngine = req.app.get('tradingEngine');
    const userId = req.userId!;
    const { limit, offset } = req.query;

    const trades = tradingEngine.getSessionTrades(
      userId,
      limit ? parseInt(limit as string) : 50,
      offset ? parseInt(offset as string) : 0
    );

    res.json({
      success: true,
      data: trades,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo trades:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener señales activas
autoTraderRoutes.get('/signals', async (req: AuthRequest, res: Response) => {
  try {
    const tradingEngine: TradingEngine = req.app.get('tradingEngine');
    const userId = req.userId!;

    const signals = tradingEngine.getActiveSignals(userId);

    res.json({
      success: true,
      data: signals,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo señales:', error);
    res.status(500).json({ error: error.message });
  }
});
