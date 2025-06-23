// ==========================================
// ARCHIVO: frontend/src/componentes/integraciones/VistaLogs.jsx
// ==========================================
const VistaLogs = ({ logs }) => {
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroIntegracion, setFiltroIntegracion] = useState('todas');
  
    const logsFiltrados = logs.filter(log => {
      const cumpleEstado = filtroEstado === 'todos' || log.estado === filtroEstado;
      const cumpleIntegracion = filtroIntegracion === 'todas' || log.integracion === filtroIntegracion;
      return cumpleEstado && cumpleIntegracion;
    });
  
    const obtenerColorEstado = (estado) => {
      switch (estado) {
        case 'exitoso':
          return 'bg-green-100 text-green-800';
        case 'error':
          return 'bg-red-100 text-red-800';
        case 'advertencia':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    const obtenerIconoEstado = (estado) => {
      switch (estado) {
        case 'exitoso':
          return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
        case 'error':
          return <XCircleIcon className="w-4 h-4 text-red-600" />;
        default:
          return <InformationCircleIcon className="w-4 h-4 text-blue-600" />;
      }
    };
  
    const integracionesUnicas = [...new Set(logs.map(log => log.integracion))];
  
    return (
      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="exitoso">Exitoso</option>
                <option value="error">Error</option>
                <option value="advertencia">Advertencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Integración</label>
              <select
                value={filtroIntegracion}
                onChange={(e) => setFiltroIntegracion(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="todas">Todas las integraciones</option>
                {integracionesUnicas.map(integracion => (
                  <option key={integracion} value={integracion}>{integracion}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Exportar Logs
              </button>
            </div>
          </div>
        </div>
  
        {/* Lista de logs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Logs de API ({logsFiltrados.length} registros)
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {logsFiltrados.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {obtenerIconoEstado(log.estado)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">{log.integracion}</h4>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{log.accion}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorEstado(log.estado)}`}>
                          {log.estado}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.detalles}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{log.timestamp}</span>
                        <span>Tiempo: {log.tiempo_respuesta}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
  
          {logsFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron logs con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>
    );
  };