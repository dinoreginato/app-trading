# TradeAI Pro Backend

Backend profesional para trading automatizado con conexión a **Interactive Brokers** (el broker más confiable del mundo) y exchanges de criptomonedas.

## 🏆 ¿Por qué Interactive Brokers?

- ✅ **Regulado globalmente**: SEC, FINRA, FCA, y 15+ reguladores
- ✅ **40+ años de historia** - Fundado en 1978
- ✅ **Seguro SIPC** hasta $500,000 USD
- ✅ **150+ mercados** en 33 países
- ✅ **Comisiones más bajas** del mercado
- ✅ **API profesional** y robusta
- ✅ **Multi-activo**: Acciones, Forex, Opciones, Futuros, Commodities

## 🚀 Instalación

### 1. Clonar e instalar dependencias

```bash
cd server
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Interactive Brokers
IB_HOST=127.0.0.1
IB_PORT=7497          # 7497 = Paper Trading, 7496 = Live Trading
IB_CLIENT_ID=1

# JWT Secret (GENERAR UNO NUEVO)
JWT_SECRET=tu-clave-secreta-aqui

# Crypto Exchanges (opcional)
BINANCE_API_KEY=tu_key
BINANCE_SECRET=tu_secret
```

### 3. Configurar Interactive Brokers TWS

1. **Descargar TWS**: https://www.interactivebrokers.com/en/trading/tws.php
2. **Configurar API**:
   - File → Global Configuration → API → Settings
   - ✅ Enable ActiveX and Socket Clients
   - Socket port: 7497 (Paper) o 7496 (Live)
   - ✅ Allow connections from localhost only (si estás en local)
   - Master API client ID: dejar en 0
3. **Reiniciar TWS**

### 4. Iniciar el servidor

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

El servidor correrá en `http://localhost:3001`

## 📡 API Endpoints

### Autenticación

```bash
# Registro
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Respuesta
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "id": "user_123", "email": "...", "name": "..." }
}
```

### Cuenta

```bash
# Estado de conexión
GET /api/account/status
Headers: Authorization: Bearer <token>

# Resumen de cuenta IB
GET /api/account/ib/summary

# Posiciones IB
GET /api/account/ib/positions

# Balance crypto (Binance, Coinbase, etc.)
GET /api/account/crypto/balance/binance

# Posiciones crypto
GET /api/account/crypto/positions/binance
```

### Trading

```bash
# Orden IB (acciones, forex, commodities)
POST /api/trading/ib/order
{
  "symbol": "AAPL",
  "action": "BUY",
  "quantity": 10,
  "orderType": "MKT",
  "tif": "DAY"
}

# Orden IB Limit
POST /api/trading/ib/order
{
  "symbol": "MSFT",
  "action": "BUY",
  "quantity": 5,
  "orderType": "LMT",
  "limitPrice": 375.50,
  "tif": "GTC"
}

# Orden Forex IB
POST /api/trading/ib/order
{
  "symbol": "EUR/USD",
  "action": "BUY",
  "quantity": 10000,
  "orderType": "MKT"
}

# Cancelar orden IB
POST /api/trading/ib/cancel/123

# Orden crypto (market)
POST /api/trading/crypto/order
{
  "symbol": "BTC/USDT",
  "side": "buy",
  "amount": 0.01,
  "type": "market",
  "exchange": "binance"
}

# Orden crypto (limit)
POST /api/trading/crypto/order
{
  "symbol": "ETH/USDT",
  "side": "buy",
  "amount": 1.5,
  "type": "limit",
  "price": 3200.00,
  "exchange": "coinbase"
}

# Cancelar orden crypto
POST /api/trading/crypto/cancel
{
  "exchange": "binance",
  "orderId": "123456",
  "symbol": "BTC/USDT"
}
```

### Datos de Mercado

```bash
# Precio en tiempo real IB
GET /api/market/ib/price/AAPL

# Datos históricos IB
GET /api/market/ib/history/AAPL?duration=1 M&barSize=1 day

# Ticker crypto
GET /api/market/crypto/ticker/binance/BTC/USDT

# Orderbook crypto
GET /api/market/crypto/orderbook/binance/BTC/USDT?limit=20

# OHLCV (velas) crypto
GET /api/market/crypto/ohlcv/binance/BTC/USDT?timeframe=1h&limit=100

# Trades recientes crypto
GET /api/market/crypto/trades/binance/ETH/USDT?limit=50
```

### Auto-Trader

```bash
# Iniciar auto-trader
POST /api/autotrader/start
{
  "initialCapital": 10000,
  "targetAmount": 15000,
  "riskLevel": "moderate",
  "categories": ["stocks", "crypto", "forex"],
  "baseCurrency": "USD",
  "stopLossPercent": 3,
  "takeProfitPercent": 5
}

# Detener auto-trader
POST /api/autotrader/stop
{
  "sessionId": "uuid-here"
}

# Estado del auto-trader
GET /api/autotrader/status

# Estadísticas
GET /api/autotrader/stats

# Historial de trades
GET /api/autotrader/trades?limit=50&offset=0

# Señales activas
GET /api/autotrader/signals
```

## 🔐 Seguridad

### Para producción:

1. **Cambiar JWT_SECRET** por una clave fuerte:
   ```bash
   openssl rand -base64 32
   ```

2. **Usar HTTPS** con certificado SSL

3. **Rate limiting** ya configurado (100 req/15min)

4. **Helmet** para headers de seguridad

5. **CORS** configurado solo para tu frontend

6. **Variables de entorno** nunca commitear `.env`

7. **Firewall** - Solo permitir conexiones desde tu IP

8. **2FA** en tu cuenta de IB y exchanges

## 📊 WebSocket

Conectar para datos en tiempo real:

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => {
  console.log('Conectado');
  socket.emit('subscribe', ['AAPL', 'BTC/USDT']);
});

socket.on('tickPrice', (data) => {
  console.log('Nuevo precio:', data);
});

socket.on('newTrade', (trade) => {
  console.log('Trade ejecutado:', trade);
});

socket.on('sessionUpdate', (update) => {
  console.log('Actualización de sesión:', update);
});
```

## 🌍 Exchanges Soportados

### Interactive Brokers (Principal)
- ✅ Acciones USA (NYSE, NASDAQ)
- ✅ Acciones Europeas (LSE, Euronext)
- ✅ Acciones Asiáticas (TSE, HKEX)
- ✅ Forex (70+ pares)
- ✅ Opciones
- ✅ Futuros
- ✅ Commodities (Oro, Plata, Petróleo)
- ✅ Bonos

### Crypto (via CCXT)
- ✅ Binance (Global)
- ✅ Coinbase (USA, EU)
- ✅ Kraken (Global)
- ✅ Bitso (México, Argentina, Colombia, Brasil)
- ✅ +100 exchanges más disponibles

## 🧪 Paper Trading (Recomendado para empezar)

**SIEMPRE** empieza con Paper Trading:

1. Abrir cuenta demo en IB: https://www.interactivebrokers.com/en/index.php?f=2229
2. Configurar `IB_PORT=7497` en `.env`
3. Probar todas las funcionalidades sin riesgo
4. Cuando estés listo, cambiar a `IB_PORT=7496` para Live Trading

## ⚠️ Advertencias Importantes

1. **Nunca compartas tus API keys**
2. **Empieza con montos pequeños**
3. **Usa Stop Loss SIEMPRE**
4. **El trading tiene riesgo** - Puedes perder dinero
5. **Haz tu propia investigación** (DYOR)
6. **No inviertas más de lo que puedes perder**
7. **Consulta con un asesor financiero**

## 📝 Licencia

MIT

## 🤝 Soporte

Para issues y preguntas, abrir un issue en GitHub.

---

**Desarrollado con ❤️ para traders profesionales**
