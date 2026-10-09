import { useState, useEffect } from 'react';
import { FileText, Shield, AlertTriangle, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { tradingService } from '../services/tradingService';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(tradingService.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.type === filter);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'ORDER_SUCCESS': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'ORDER_ERROR': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'BALANCE': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'CONFIG': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'ORDER_SUCCESS': return 'border-green-500/30 bg-green-500/5';
      case 'ORDER_ERROR': return 'border-red-500/30 bg-red-500/5';
      case 'BALANCE': return 'border-purple-500/30 bg-purple-500/5';
      case 'CONFIG': return 'border-yellow-500/30 bg-yellow-500/5';
      default: return 'border-gray-700 bg-gray-900/30';
    }
  };

  const clearLogs = () => {
    tradingService.clearLogs();
    setLogs([]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Logs de Auditoría
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Registro completo de todas las operaciones y eventos del sistema
            </p>
          </div>
          <button
            onClick={clearLogs}
            className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg text-sm transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {[
            { key: 'all', label: 'Todos', icon: '📋' },
            { key: 'ORDER', label: 'Órdenes', icon: '📄' },
            { key: 'ORDER_SUCCESS', label: 'Exitosas', icon: '✅' },
            { key: 'ORDER_ERROR', label: 'Errores', icon: '❌' },
            { key: 'BALANCE', label: 'Balance', icon: '💰' },
            { key: 'CONFIG', label: 'Config', icon: '⚙️' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === f.key ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No hay logs registrados</p>
              <p className="text-xs text-gray-500 mt-1">Los logs aparecerán aquí cuando se ejecuten operaciones</p>
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${getLogColor(log.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{log.type}</span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      {log.paper && (
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[9px] font-medium">
                          PAPER
                        </span>
                      )}
                      {log.broker && (
                        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[9px] font-medium">
                          {log.broker.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{log.message}</p>
                    {log.data && (
                      <pre className="mt-2 p-2 bg-gray-900/50 rounded text-[10px] text-gray-400 overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Logs"
          value={logs.length.toString()}
          icon={<FileText className="w-4 h-4 text-blue-400" />}
          color="blue"
        />
        <StatCard
          label="Órdenes Exitosas"
          value={logs.filter(l => l.type === 'ORDER_SUCCESS').length.toString()}
          icon={<CheckCircle className="w-4 h-4 text-green-400" />}
          color="green"
        />
        <StatCard
          label="Errores"
          value={logs.filter(l => l.type === 'ORDER_ERROR').length.toString()}
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
          color="red"
        />
        <StatCard
          label="Paper Trading"
          value={logs.filter(l => l.paper).length.toString()}
          icon={<Shield className="w-4 h-4 text-purple-400" />}
          color="purple"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-3`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
