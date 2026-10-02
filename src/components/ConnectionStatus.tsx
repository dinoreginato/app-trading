import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Server, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { accountAPI } from '../services/api';

interface ConnectionStatus {
  interactiveBrokers: {
    connected: boolean;
    host: string;
    port: number;
  };
  cryptoExchanges: {
    available: string[];
    connected: boolean;
  };
  timestamp: string;
}

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await accountAPI.getStatus();
      setStatus(response.data);
      setBackendAvailable(true);
    } catch (err: any) {
      setBackendAvailable(false);
      if (err.code === 'ERR_NETWORK') {
        setError('Backend no disponible. Inicia el servidor con: cd server && npm run dev');
      } else if (err.response?.status === 401) {
        setError('No autenticado. Inicia sesión primero.');
      } else {
        setError(err.response?.data?.error || 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          Estado de Conexión
        </h3>
        <button
          onClick={checkStatus}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {!backendAvailable ? (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-medium">Backend no conectado</p>
              <p className="text-sm text-gray-400 mt-1">{error || 'Verificando conexión...'}</p>
              <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400 font-mono">
                  # Para iniciar el backend:<br />
                  cd server<br />
                  npm install<br />
                  cp .env.example .env<br />
                  npm run dev
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Interactive Brokers */}
          <div className={`p-4 rounded-xl border ${
            status?.interactiveBrokers.connected 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {status?.interactiveBrokers.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className="text-white font-medium">Interactive Brokers</p>
                  <p className="text-xs text-gray-400">
                    {status?.interactiveBrokers.host}:{status?.interactiveBrokers.port}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                status?.interactiveBrokers.connected 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {status?.interactiveBrokers.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            {status?.interactiveBrokers.connected && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-300">
                <Shield className="w-3 h-3" />
                Broker regulado - Seguro SIPC hasta $500,000
              </div>
            )}
          </div>

          {/* Crypto Exchanges */}
          <div className={`p-4 rounded-xl border ${
            status?.cryptoExchanges.connected 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-gray-700/20 border-gray-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {status?.cryptoExchanges.connected ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-white font-medium">Crypto Exchanges</p>
                  <p className="text-xs text-gray-400">
                    {status?.cryptoExchanges.available.length || 0} exchanges configurados
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                status?.cryptoExchanges.connected 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {status?.cryptoExchanges.connected ? 'Conectado' : 'No configurado'}
              </span>
            </div>
            {status?.cryptoExchanges.available && status.cryptoExchanges.available.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {status.cryptoExchanges.available.map((exchange) => (
                  <span key={exchange} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                    {exchange}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Last Update */}
          {status?.timestamp && (
            <p className="text-xs text-gray-500 text-right">
              Última actualización: {new Date(status.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
