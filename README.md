# TradeAI Pro - Trading Automatizado con IA

<div align="center">

![TradeAI Pro](https://img.shields.io/badge/TradeAI-Pro-blue?style=for-the-badge)
![Mobile First](https://img.shields.io/badge/Mobile-First-green?style=for-the-badge)
![Multi-Asset](https://img.shields.io/badge/Multi-Asset-Stocks%20%7C%20Crypto%20%7C%20Forex-orange?style=for-the-badge)

**App de trading automatizado inteligente con diseño mobile-first**

</div>

---

## 📱 Diseño Mobile-First

### Características Optimizadas para Móvil

✅ **Bottom Navigation Bar** - Navegación estilo app nativa (como Robinhood, Binance)  
✅ **Safe Area Support** - Compatible con iPhone notch y dispositivos con bordes redondeados  
✅ **Touch Targets 44px** - Botones optimizados para touch (mínimo Apple HIG)  
✅ **Horizontal Scroll** - Selectores de activos con scroll horizontal suave  
✅ **Compact Cards** - Diseño de tarjetas optimizado para pantallas pequeñas  
✅ **Bottom Sheet Modals** - Modales que aparecen desde abajo en móvil  
✅ **PWA Ready** - Meta tags para agregar a pantalla de inicio  
✅ **No Zoom on Focus** - Inputs no hacen zoom en iOS  
✅ **Smooth Animations** - Transiciones y animaciones fluidas  
✅ **Dark Mode** - Tema oscuro optimizado para OLED  

### Responsive Breakpoints

- **Mobile** (< 768px): Bottom nav, cards compactas, modales bottom sheet
- **Tablet** (768px - 1024px): Layout híbrido
- **Desktop** (> 1024px): Sidebar lateral, layout completo

---

## 🚀 Características Principales

### 📊 Dashboard
- Capital total con gradientes atractivos
- Gráfico de portafolio interactivo
- Top movimientos en tiempo real
- Mini gráficos de activos seleccionados
- Estadísticas rápidas (Win Rate, IA Confianza, Señales)

### 📈 Trading
- Selector horizontal de activos (scroll suave)
- Gráficos con indicadores técnicos (SMA 20, SMA 50)
- RSI gauge visual
- Señales de compra/venta en tiempo real
- Tips de trading activos
- Timeframes: 1W, 1M, 3M, 6M

### 🤖 Auto-Trader
- Modo simulación vs modo real
- Conexión con brokers (Interactive Brokers, Binance, Coinbase, etc.)
- Configuración de riesgo (Conservador, Moderado, Agresivo)
- Stop Loss y Take Profit personalizables
- Multi-moneda (USD, EUR, MXN, COP, ARS, etc.)
- Multi-categoría (Acciones, Crypto, Forex, Commodities)
- Logs en tiempo real
- Progreso hacia meta visual

### 🔔 Señales
- Filtros: Todas, Compra, Venta, Mantener
- Indicadores técnicos (RSI, MACD, SMA, Volumen, Tendencia)
- Nivel de confianza visual
- Razones de la señal
- Resumen de señales activas

### 🧠 Aprendizaje IA
- Win Rate con gráfico circular
- Radar de indicadores
- Progreso de aprendizaje por categoría
- Patrones aprendidos
- Métricas de riesgo (Sharpe, Drawdown, Precisión)

---

## 💰 Multi-Activo y Multi-Moneda

### Categorías Soportadas

| Categoría | Activos | Ejemplos |
|-----------|---------|----------|
| 📊 **Acciones** | 8+ | AAPL, GOOGL, MSFT, NVDA, TSLA, META |
| ₿ **Crypto** | 8+ | BTC, ETH, SOL, BNB, XRP, ADA, DOGE |
| 💱 **Forex** | 12+ | EUR/USD, USD/MXN, USD/COP, USD/ARS, USD/BRL |
| 🥇 **Commodities** | 4+ | Oro (XAU), Plata (XAG), Petróleo WTI, Gas Natural |

### Monedas Base Soportadas

🇺🇸 USD, 🇪🇺 EUR, 🇬🇧 GBP, 🇯🇵 JPY, 🇲🇽 MXN, 🇨🇴 COP, 🇦🇷 ARS, 🇨🇱 CLP, 🇵🇪 PEN, 🇧🇷 BRL, 🇻🇪 VES, ₿ BTC, Ξ ETH

---

## 🔌 Backend con Interactive Brokers

### ¿Por qué Interactive Brokers?

- ✅ **Regulado globalmente**: SEC, FINRA, FCA, 15+ reguladores
- ✅ **40+ años de historia** - Fundado en 1978
- ✅ **Seguro SIPC** hasta $500,000 USD
- ✅ **150+ mercados** en 33 países
- ✅ **Comisiones más bajas** del mercado
- ✅ **API profesional** y robusta
- ✅ **Multi-activo**: Acciones, Forex, Opciones, Futuros, Commodities

### Exchanges Crypto Soportados

- **Binance** - Exchange #1 mundial
- **Coinbase** - Exchange regulado USA
- **Kraken** - Exchange global
- **Bitso** - Líder en LATAM (MXN, ARS, COP, BRL)
- **+100 más** via CCXT

---

## 🛠️ Instalación

### Frontend

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build
```

### Backend

```bash
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar Interactive Brokers TWS
# Configurar API en: File → Global Configuration → API → Settings
# ✅ Enable ActiveX and Socket Clients
# Socket port: 7497 (Paper) o 7496 (Live)

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

---

## 🔐 Configuración de Seguridad

### Para Producción

1. **JWT Secret** - Generar clave fuerte:
   ```bash
   openssl rand -base64 32
   ```

2. **HTTPS** - Usar certificado SSL

3. **API Keys** - Nunca commitear `.env`

4. **2FA** - Activar en IB y exchanges

5. **Firewall** - Solo permitir tu IP

6. **Rate Limiting** - Ya configurado (100 req/15min)

---

## 📡 API Endpoints

### Autenticación
```bash
POST /api/auth/register
POST /api/auth/login
```

### Cuenta
```bash
GET /api/account/status
GET /api/account/ib/summary
GET /api/account/ib/positions
GET /api/account/crypto/balance/:exchange
```

### Trading
```bash
POST /api/trading/ib/order
POST /api/trading/ib/cancel/:orderId
POST /api/trading/crypto/order
POST /api/trading/crypto/cancel
```

### Mercado
```bash
GET /api/market/ib/price/:symbol
GET /api/market/ib/history/:symbol
GET /api/market/crypto/ticker/:exchange/:symbol
GET /api/market/crypto/ohlcv/:exchange/:symbol
```

### Auto-Trader
```bash
POST /api/autotrader/start
POST /api/autotrader/stop
GET /api/autotrader/status
GET /api/autotrader/stats
GET /api/autotrader/trades
GET /api/autotrader/signals
```

---

## 🧪 Paper Trading (Recomendado)

**SIEMPRE** empieza con Paper Trading:

1. Abrir cuenta demo en IB: https://www.interactivebrokers.com/en/index.php?f=2229
2. Configurar `IB_PORT=7497` en `.env`
3. Probar todas las funcionalidades sin riesgo
4. Cuando estés listo, cambiar a `IB_PORT=7496` para Live Trading

---

## ⚠️ Advertencias Importantes

1. **Nunca compartas tus API keys**
2. **Empieza con montos pequeños**
3. **Usa Stop Loss SIEMPRE**
4. **El trading tiene riesgo** - Puedes perder dinero
5. **Haz tu propia investigación** (DYOR)
6. **No inviertas más de lo que puedes perder**
7. **Consulta con un asesor financiero**

---

## 🎨 Tecnologías

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** (Mobile-first)
- **Recharts** (Gráficos)
- **Lucide React** (Iconos)
- **Vite** (Build tool)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Interactive Brokers API** (ib)
- **CCXT** (100+ exchanges crypto)
- **Socket.IO** (WebSocket)
- **JWT** (Autenticación)
- **Winston** (Logging)

---

## 📱 Screenshots

### Mobile View
- Bottom navigation bar estilo app nativa
- Cards compactas y optimizadas
- Gráficos interactivos touch-friendly
- Modales bottom sheet
- Selector horizontal de activos

### Desktop View
- Sidebar lateral con navegación
- Layout de 2 columnas
- Gráficos más grandes
- Modales centrados

---

## 🚀 Próximas Mejoras

- [ ] Notificaciones push (PWA)
- [ ] Modo offline con sincronización
- [ ] Gráficos de velas (candlestick)
- [ ] Alertas personalizadas
- [ ] Backtesting de estrategias
- [ ] Social trading (copiar traders)
- [ ] Análisis de sentimiento (news, social media)
- [ ] Integración con más brokers
- [ ] Multi-idioma (i18n)

---

## 📄 Licencia

MIT

---

## 🤝 Soporte

Para issues y preguntas, abrir un issue en GitHub.

---

<div align="center">

**Desarrollado con ❤️ para traders profesionales**

[⭐ Star este repo](#) si te gusta el proyecto

</div>
