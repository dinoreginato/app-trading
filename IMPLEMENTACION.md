# 🚀 Guía de Implementación - Trading con Dinero Real

## ✅ Estado Actual

La aplicación TradeAI Pro ya incluye:

- ✅ **Frontend completo** con interfaz multi-moneda y multi-activo
- ✅ **Servicio de trading** (`src/services/tradingService.ts`) que se conecta con brokers
- ✅ **Configuración de brokers** con soporte para Alpaca, Binance, Coinbase e IBKR
- ✅ **Modo Paper Trading** para pruebas sin riesgo
- ✅ **Sistema de confirmaciones** antes de ejecutar órdenes reales
- ✅ **Logs de auditoría** completos de todas las operaciones
- ✅ **Indicadores visuales** de modo (paper/live)

---

## 📋 Pasos para Implementar Trading Real

### 1️⃣ Configurar Backend (Recomendado para Producción)

Para mayor seguridad, las API keys deben manejarse en un backend, no en el frontend.

#### Opción A: Backend Node.js (Express)

```bash
# Crear carpeta del backend
mkdir backend
cd backend
npm init -y
npm install express cors dotenv axios
```

**Ejemplo de endpoint (`server.js`):**

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Alpaca API
app.post('/api/trade/alpaca', async (req, res) => {
  const { symbol, side, quantity, type } = req.body;
  
  try {
    const response = await fetch('https://api.alpaca.markets/v2/orders', {
      method: 'POST',
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol,
        qty: quantity,
        side,
        type: type || 'market',
        time_in_force: 'day',
      }),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Binance API
app.post('/api/trade/binance', async (req, res) => {
  const { symbol, side, quantity, price } = req.body;
  
  // Usar SDK de Binance o llamar a la API directamente
  // https://binance-docs.github.io/apidocs/spot/en/
  
  res.json({ success: true, orderId: 'binance_123' });
});

app.listen(3001, () => {
  console.log('Backend corriendo en puerto 3001');
});
```

**Archivo `.env`:**

```env
# Alpaca
ALPACA_API_KEY=tu_api_key_aqui
ALPACA_SECRET_KEY=tu_secret_key_aqui

# Binance
BINANCE_API_KEY=tu_api_key_aqui
BINANCE_SECRET_KEY=tu_secret_key_aqui

# Coinbase
COINBASE_API_KEY=tu_api_key_aqui
COINBASE_SECRET_KEY=tu_secret_key_aqui
```

#### Opción B: Backend Python (Flask)

```bash
pip install flask flask-cors python-dotenv alpaca-trade-api python-binance
```

**Ejemplo (`app.py`):**

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Alpaca
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce

trading_client = TradingClient(
    os.getenv('ALPACA_API_KEY'),
    os.getenv('ALPACA_SECRET_KEY'),
    paper=True  # Cambiar a False para trading real
)

@app.route('/api/trade/alpaca', methods=['POST'])
def trade_alpaca():
    data = request.json
    
    order = MarketOrderRequest(
        symbol=data['symbol'],
        qty=data['quantity'],
        side=OrderSide.BUY if data['side'] == 'buy' else OrderSide.SELL,
        time_in_force=TimeInForce.DAY
    )
    
    result = trading_client.submit_order(order)
    return jsonify({'orderId': result.id, 'status': 'success'})

if __name__ == '__main__':
    app.run(port=3001)
```

---

### 2️⃣ Obtener API Keys de Brokers

#### Alpaca (Acciones USA - Recomendado para empezar)

1. Ir a [https://alpaca.markets/](https://alpaca.markets/)
2. Crear cuenta gratuita
3. Verificar identidad (requiere documento)
4. Ir a "Paper Trading" para pruebas
5. En "API Keys", generar nuevas claves
6. Copiar API Key y Secret Key

**Ventajas:**
- ✅ Sin comisiones
- ✅ Paper trading incluido
- ✅ API simple y bien documentada
- ✅ Aprobación rápida (1-2 días)

#### Binance (Criptomonedas)

1. Ir a [https://www.binance.com/](https://www.binance.com/)
2. Crear cuenta y verificar identidad (KYC)
3. Ir a "API Management"
4. Crear nueva API key
5. Habilitar permisos de "Spot Trading"
6. **IMPORTANTE:** Configurar "IP Restriction" para mayor seguridad

**Ventajas:**
- ✅ Mayor volumen del mundo
- ✅ 100+ criptomonedas
- ✅ Comisiones bajas (0.1%)

#### Interactive Brokers (Profesional)

1. Ir a [https://www.interactivebrokers.com/](https://www.interactivebrokers.com/)
2. Abrir cuenta (requiere depósito mínimo)
3. Completar verificación (puede tomar 1-2 semanas)
4. Descargar TWS (Trader Workstation)
5. En TWS: File → Global Configuration → API → Settings
6. Habilitar "Enable ActiveX and Socket Clients"
7. Configurar puerto (7496 para live, 7497 para paper)

**Ventajas:**
- ✅ 150+ mercados globales
- ✅ Acciones, opciones, futuros, forex
- ✅ Comisiones más bajas del mercado
- ✅ Seguro SIPC hasta $500,000

---

### 3️⃣ Probar en Paper Trading (OBLIGATORIO)

**Antes de usar dinero real, prueba durante 2-4 semanas:**

1. Configurar broker en modo Paper Trading
2. Ejecutar el auto-trader con montos simulados
3. Analizar resultados:
   - Win rate
   - Profit/loss total
   - Max drawdown
   - Sharpe ratio
4. Ajustar parámetros si es necesario
5. Solo cuando estés satisfecho, cambiar a Live Trading

---

### 4️⃣ Cambiar a Live Trading

Cuando estés listo para operar con dinero real:

1. **En la app:**
   - Ir a Auto-Trader
   - Click en "Configurar"
   - Desactivar "Paper Trading"
   - Guardar configuración

2. **Verificaciones previas:**
   - ✅ Tienes saldo suficiente en el broker
   - ✅ Entiendes los riesgos
   - ✅ Has probado en paper trading
   - ✅ Has configurado stop loss
   - ✅ Has establecido límites diarios

3. **Empezar con montos pequeños:**
   - Primera semana: $100-500
   - Segunda semana: $500-1000
   - Tercera semana: $1000-5000
   - Aumentar gradualmente según resultados

---

### 5️⃣ Medidas de Seguridad

#### En el Backend:

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite por IP
});
app.use('/api/', limiter);

// Validación de órdenes
function validateOrder(order) {
  const MAX_ORDER_SIZE = 10000; // $10,000 máximo por orden
  const MAX_DAILY_VOLUME = 50000; // $50,000 máximo por día
  
  if (order.total > MAX_ORDER_SIZE) {
    throw new Error('Orden excede límite máximo');
  }
  
  // Verificar volumen diario
  const todayVolume = getTodayVolume();
  if (todayVolume + order.total > MAX_DAILY_VOLUME) {
    throw new Error('Volumen diario excedido');
  }
}
```

#### En el Frontend:

- ✅ Confirmación antes de cada orden real
- ✅ Stop loss automático configurado
- ✅ Límite máximo por operación
- ✅ Notificaciones por email/SMS
- ✅ Logs de auditoría completos

---

### 6️⃣ Desplegar en Producción

#### Opción A: Vercel (Frontend) + Railway (Backend)

```bash
# Frontend (ya configurado)
npm run build
# Subir a Vercel

# Backend
cd backend
# Subir a Railway o Render
```

#### Opción B: AWS / DigitalOcean

```bash
# Backend en EC2 o Droplet
ssh user@your-server
git clone your-repo
cd backend
npm install
pm2 start server.js --name "tradeai-backend"

# Configurar nginx como reverse proxy
# Configurar SSL con Let's Encrypt
```

---

## ⚠️ Consideraciones Legales

### Regulaciones por País:

- **USA:** SEC, FINRA (requiere registro si gestionas dinero de terceros)
- **México:** CNBV (Comisión Nacional Bancaria y de Valores)
- **España:** CNMV (Comisión Nacional del Mercado de Valores)
- **Colombia:** Superintendencia Financiera
- **Argentina:** CNV (Comisión Nacional de Valores)

### Recomendaciones:

1. **No gestiones dinero de terceros** sin licencia adecuada
2. **Usa la app solo para tu propio capital**
3. **Consulta con un asesor financiero** antes de empezar
4. **Declara tus ganancias** según las leyes de tu país
5. **Mantén registros** de todas las operaciones

---

## 📊 Monitoreo y Alertas

### Configurar alertas:

```javascript
// Enviar notificación cuando haya una operación
function sendNotification(trade) {
  // Email
  sendEmail({
    to: 'tu@email.com',
    subject: `Nueva operación: ${trade.side} ${trade.symbol}`,
    body: `Se ejecutó una orden de ${trade.side} ${trade.quantity} ${trade.symbol} a $${trade.price}`
  });
  
  // Telegram Bot
  sendTelegramMessage(`🔔 Nueva operación: ${trade.side} ${trade.symbol}`);
  
  // SMS (usando Twilio)
  sendSMS(`Operación ejecutada: ${trade.side} ${trade.symbol}`);
}
```

---

## 🎯 Checklist Final

Antes de operar con dinero real:

- [ ] Cuenta verificada en broker
- [ ] API keys obtenidas y configuradas
- [ ] Backend desplegado (si usas backend)
- [ ] Probado en Paper Trading por 2-4 semanas
- [ ] Stop loss configurado
- [ ] Límites diarios establecidos
- [ ] Sistema de notificaciones funcionando
- [ ] Logs de auditoría activos
- [ ] Asesoría legal/financiera consultada
- [ ] Entendidos los riesgos involucrados

---

## 🆘 Soporte y Recursos

### Documentación de APIs:

- **Alpaca:** https://docs.alpaca.markets/
- **Binance:** https://binance-docs.github.io/apidocs/
- **Coinbase:** https://docs.cloud.coinbase.com/
- **Interactive Brokers:** https://interactivebrokers.github.io/

### Comunidades:

- Reddit: r/algotrading, r/alpacamarkets
- Discord: Servidores de cada broker
- Stack Overflow: Tag "algorithmic-trading"

---

## 📞 Contacto

Si necesitas ayuda con la implementación:

1. Revisa los logs de auditoría en la app
2. Consulta la documentación del broker
3. Verifica que las API keys tengan los permisos correctos
4. Asegúrate de tener saldo suficiente
5. Revisa que no haya restricciones de IP

---

**⚠️ DISCLAIMER:** El trading conlleva riesgo de pérdida de capital. Esta aplicación es una herramienta de ayuda, no garantiza ganancias. Opera bajo tu propio riesgo y responsabilidad.
