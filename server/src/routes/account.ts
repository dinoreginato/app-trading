import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { InteractiveBrokersService } from '../brokers/interactive-brokers';
import { CCXTBridgeService } from '../brokers/ccxt-bridge';
import { logger } from '../utils/logger';

export const accountRoutes = Router();

// Obtener resumen de cuenta IB
accountRoutes.get('/ib/summary', async (req: AuthRequest, res: Response) => {
  try {
    const ibService: InteractiveBrokersService = req.app.get('ibService');
    
    if (!ibService.getConnectionStatus()) {
      return res.status(503).json({ 
        error: 'Interactive Brokers no conectado',
        code: 'IB_NOT_CONNECTED'
      });
    }

    const summary = await ibService.getAccountSummary();
    
    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo resumen IB:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener posiciones IB
accountRoutes.get('/ib/positions', async (req: AuthRequest, res: Response) => {
  try {
    const ibService: InteractiveBrokersService = req.app.get('ibService');
    const positions = ibService.getPositions();
    
    res.json({
      success: true,
      data: positions,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo posiciones IB:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener balance crypto
accountRoutes.get('/crypto/balance/:exchange', async (req: AuthRequest, res: Response) => {
  try {
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    const { exchange } = req.params;
    
    const balance = await ccxtService.getBalance(exchange);
    
    res.json({
      success: true,
      data: balance,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo balance crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener posiciones crypto
accountRoutes.get('/crypto/positions/:exchange', async (req: AuthRequest, res: Response) => {
  try {
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    const { exchange } = req.params;
    
    const positions = await ccxtService.getPositions(exchange);
    
    res.json({
      success: true,
      data: positions,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Error obteniendo posiciones crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Estado de conexión
accountRoutes.get('/status', async (req: AuthRequest, res: Response) => {
  try {
    const ibService: InteractiveBrokersService = req.app.get('ibService');
    const ccxtService: CCXTBridgeService = req.app.get('ccxtService');
    
    res.json({
      success: true,
      data: {
        interactiveBrokers: {
          connected: ibService.getConnectionStatus(),
          host: process.env.IB_HOST || 'localhost',
          port: process.env.IB_PORT || '7497'
        },
        cryptoExchanges: {
          available: ccxtService.getAvailableExchanges(),
          connected: ccxtService.getAvailableExchanges().length > 0
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('Error obteniendo estado:', error);
    res.status(500).json({ error: error.message });
  }
});
