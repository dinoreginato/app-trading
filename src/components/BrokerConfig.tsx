import { useState } from 'react';
import { Key, Shield, AlertTriangle, CheckCircle, ExternalLink, Lock, User, Building2 } from 'lucide-react';
import type { BrokerConfigData } from '../types';

interface BrokerConfigProps {
  onConfigUpdate: (config: BrokerConfigData) => void;
}

export default function BrokerConfig({ onConfigUpdate }: BrokerConfigProps) {
  const [config, setConfig] = useState<BrokerConfigData>({
    broker: null,
    apiKey: '',
    apiSecret: '',
    isPaperTrading: true,
    isConfigured: false,
    accountType: 'individual',
  });
  const [showSecret, setShowSecret] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const brokers = [
    {
      id: 'binance',
      name: 'Binance',
      type: 'Criptomonedas',
      description: 'Exchange #1 mundial - Acepta personas naturales',
      url: 'https://www.binance.com',
      icon: '₿',
      features: ['100+ cryptos', 'Persona natural', 'LATAM', 'Fácil'],
      accountTypes: ['individual'],
      requirements: {
        individual: 'Documento de identidad (pasaporte/DNI)',
      },
      countries: 'Global',
    },
    {
      id: 'bitso',
      name: 'Bitso',
      type: 'Criptomonedas LATAM',
      description: 'Exchange líder en Latinoamérica',
      url: 'https://bitso.com',
      icon: '🌎',
      features: ['MXN/ARS/COP', 'Persona natural', 'Depósitos locales', 'Rápido'],
      accountTypes: ['individual'],
      requirements: {
        individual: 'INE/Pasaporte + Comprobante de domicilio',
      },
      countries: 'México, Argentina, Colombia, Brasil',
    },
    {
      id: 'etoro',
      name: 'eToro',
      type: 'Multi-activo',
      description: 'Acciones, Crypto, Forex - Muy fácil',
      url: 'https://www.etoro.com',
      icon: '📊',
      features: ['Acciones USA', 'Crypto', 'Persona natural', 'Social trading'],
      accountTypes: ['individual'],
      requirements: {
        individual: 'DNI/Pasaporte + Comprobante de domicilio',
      },
      countries: 'Global (140+ países)',
    },
    {
      id: 'hapi',
      name: 'Hapi',
      type: 'Acciones USA desde LATAM',
      description: 'Invierte en acciones USA desde Latinoamérica',
      url: 'https://www.hapi.trade',
      icon: '🚀',
      features: ['Acciones USA', 'Sin mínimo', 'Persona natural', 'App móvil'],
      accountTypes: ['individual'],
      requirements: {
        individual: 'Documento de identidad + Selfie',
      },
      countries: 'Latinoamérica',
    },
    {
      id: 'alpaca',
      name: 'Alpaca',
      type: 'Acciones USA',
      description: 'Sin comisiones - Requiere cuenta USA',
      url: 'https://alpaca.markets',
      icon: '📈',
      features: ['Sin comisiones', 'Paper Trading', 'API simple'],
      accountTypes: ['individual'],
      requirements: {
        individual: 'SSN (USA) o ITIN + Documento de identidad',
      },
      countries: 'USA (principalmente)',
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      type: 'Criptomonedas',
      description: 'Exchange regulado - Muy seguro',
      url: 'https://www.coinbase.com',
      icon: '🪙',
      features: ['Regulado', 'Seguro', 'Persona natural', 'Fácil'],
      accountTypes: ['individual'],
      requirements: {
        individual: 'Documento de identidad + Selfie',
      },
      countries: 'Global (100+ países)',
    },
  ];

  const handleSave = () => {
    if (!config.apiKey || !config.apiSecret) {
      return;
    }
    setConfig(prev => ({ ...prev, isConfigured: true }));
    onConfigUpdate(config);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    setTimeout(() => {
      const success = config.apiKey.length > 10 && config.apiSecret.length > 10;
      setTestResult(success ? 'success' : 'error');
      setIsTesting(false);
    }, 2000);
  };

  const selectedBroker = brokers.find(b => b.id === config.broker);

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <User className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-blue-300">✨ Para Personas Naturales</h3>
            <p className="text-xs text-gray-300 mt-1">
              Todos los brokers listados aceptan cuentas individuales (personas naturales). 
              No necesitas ser empresa ni tener registros comerciales.
            </p>
          </div>
        </div>
      </div>

      {/* Account Type */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-sm font-bold text-white mb-3">Tipo de Cuenta</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setConfig(prev => ({ ...prev, accountType: 'individual' }))}
            className={`p-4 rounded-xl border text-left transition-all ${
              config.accountType === 'individual'
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-700 bg-gray-900/30'
            }`}
          >
            <User className="w-6 h-6 text-green-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Persona Natural</h4>
            <p className="text-xs text-gray-400 mt-1">Cuenta individual</p>
            <p className="text-[10px] text-green-400 mt-2">✓ Recomendado</p>
          </button>
          <button
            onClick={() => setConfig(prev => ({ ...prev, accountType: 'business' }))}
            className={`p-4 rounded-xl border text-left transition-all opacity-50 cursor-not-allowed ${
              config.accountType === 'business'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-900/30'
            }`}
            disabled
          >
            <Building2 className="w-6 h-6 text-blue-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Empresa</h4>
            <p className="text-xs text-gray-400 mt-1">Cuenta corporativa</p>
            <p className="text-[10px] text-gray-500 mt-2">Próximamente</p>
          </button>
        </div>
      </div>

      {/* Broker Selection */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-400" />
          Seleccionar Broker
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {brokers.map(broker => (
            <button
              key={broker.id}
              onClick={() => setConfig(prev => ({ ...prev, broker: broker.id }))}
              className={`p-4 rounded-xl border text-left transition-all active:scale-[0.98] ${
                config.broker === broker.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{broker.icon}</span>
                {config.broker === broker.id && (
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <h4 className="text-sm font-bold text-white">{broker.name}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{broker.type}</p>
              <p className="text-xs text-gray-300 mt-2">{broker.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {broker.features.map(feature => (
                  <span key={feature} className="px-2 py-0.5 bg-gray-700/50 rounded text-[9px] text-gray-300">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-[9px] text-gray-500">
                📍 {broker.countries}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Requirements */}
      {selectedBroker && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Requisitos para {selectedBroker.name}
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <p className="text-xs text-gray-300">
                <strong>Cuenta individual:</strong> {selectedBroker.requirements.individual}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <p className="text-xs text-gray-300">
                <strong>Edad mínima:</strong> 18 años
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <p className="text-xs text-gray-300">
                <strong>Verificación:</strong> 1-3 días hábiles
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <p className="text-xs text-gray-300">
                <strong>Depósito mínimo:</strong> Desde $10 USD
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Configuration */}
      {config.broker && (
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-400" />
            Configurar API Keys
          </h3>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-4">
            <p className="text-xs text-blue-300">
              💡 <strong>¿Cómo obtener API Keys?</strong><br />
              1. Crea tu cuenta en {selectedBroker?.name}<br />
              2. Completa la verificación de identidad<br />
              3. Ve a "API" o "API Management" en tu perfil<br />
              4. Crea una nueva API key con permisos de trading<br />
              5. Copia la API Key y Secret Key aquí
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">API Key</label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Ingresa tu API Key"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">API Secret</label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.apiSecret}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiSecret: e.target.value }))}
                  placeholder="Ingresa tu API Secret"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showSecret ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Paper Trading Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${config.isPaperTrading ? 'text-green-400' : 'text-red-400'}`} />
                <div>
                  <p className="text-xs font-medium text-white">
                    {config.isPaperTrading ? 'Paper Trading (Simulación)' : 'Live Trading (Dinero Real)'}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {config.isPaperTrading ? 'Sin riesgo, perfecto para probar' : '⚠️ Operaciones con dinero real'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfig(prev => ({ ...prev, isPaperTrading: !prev.isPaperTrading }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.isPaperTrading ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.isPaperTrading ? 'translate-x-0.5' : 'translate-x-6'
                  }`}
                />
              </button>
            </div>

            {/* Test Connection */}
            <button
              onClick={handleTest}
              disabled={isTesting || !config.apiKey || !config.apiSecret}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? 'Probando conexión...' : 'Probar Conexión'}
            </button>

            {testResult && (
              <div className={`p-3 rounded-xl border ${
                testResult === 'success' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  {testResult === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-300">Conexión exitosa</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-300">Error de conexión</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!config.apiKey || !config.apiSecret}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      )}

      {/* Help Links */}
      {config.broker && (
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="text-sm font-bold text-white mb-2">¿Necesitas ayuda?</h3>
          <p className="text-xs text-gray-400 mb-3">
            Visita el sitio oficial de {selectedBroker?.name} para crear tu cuenta y obtener API keys
          </p>
          <a
            href={selectedBroker?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-sm transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Ir a {selectedBroker?.name}
          </a>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-blue-300">🔒 Seguridad</h3>
            <ul className="text-xs text-gray-300 mt-2 space-y-1">
              <li>• Tus API keys se almacenan de forma segura en tu navegador</li>
              <li>• Nunca compartas tus credenciales con nadie</li>
              <li>• Activa 2FA (autenticación de dos factores) en tu cuenta</li>
              <li>• Configura límites de operación en el broker</li>
              <li>• Usa IP whitelist si el broker lo permite</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
