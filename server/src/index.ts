import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { logger } from './utils/logger';
import { authMiddleware } from './middleware/auth';
import { accountRoutes } from './routes/account';
import { tradingRoutes } from './routes/trading';
import { marketRoutes } from './routes/market';
import { autoTraderRoutes } from './routes/autotrader';
import { InteractiveBrokersService } from './brokers/interactive-brokers';
import { CCXTBridgeService } from './brokers/ccxt-bridge';
import { TradingEngine } from './services/trading-engine';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite por IP
});
app.use('/api/', limiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas públicas
app.use('/api/auth', require('./routes/auth').authRoutes);

// Rutas protegidas
app.use('/api/account', authMiddleware, accountRoutes);
app.use('/api/trading', authMiddleware, tradingRoutes);
app.use('/api/market', authMiddleware, marketRoutes);
app.use('/api/autotrader', authMiddleware, autoTraderRoutes);

// WebSocket para datos en tiempo real
io.on('connection', (socket) => {
  logger.info(`Cliente conectado: ${socket.id}`);
  
  socket.on('subscribe', (symbols: string[]) => {
    socket.join('market-data');
    logger.info(`Cliente ${socket.id} suscrito a: ${symbols.join(', ')}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicializar servicios
const ibService = new InteractiveBrokersService();
const ccxtService = new CCXTBridgeService();
const tradingEngine = new TradingEngine(ibService, ccxtService, io);

// Hacer servicios disponibles globalmente
app.set('ibService', ibService);
app.set('ccxtService', ccxtService);
app.set('tradingEngine', tradingEngine);
app.set('io', io);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error no manejado:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    code: err.code || 'INTERNAL_ERROR'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  logger.info(`🚀 TradeAI Pro Backend corriendo en puerto ${PORT}`);
  logger.info(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Interactive Brokers: ${process.env.IB_HOST || 'localhost'}:${process.env.IB_PORT || 7497}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recibido, cerrando servicios...');
  await ibService.disconnect();
  httpServer.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

export { app, httpServer, io };
