import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ReportesExternos = () => {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    tipo: 'todos',
    estado: 'todos'
  });

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      // Simular carga de reportes
      setTimeout(() => {
        setReportes([
          {
            id: 1,
            nombre: 'Reporte de Ventas Mensual',
            tipo: 'ventas',
            formato: 'PDF',
            tamaño: '2.3 MB',
            fechaGeneracion: '2024-06-30 10:30',
            estado: 'completado',
            descripcion: 'Análisis detallado de ventas del mes de junio',
            url: '/reportes/ventas-mensual-junio.pdf',
            integracion: 'Sistema Interno'
          },
          {
            id: 2,
            nombre: 'Reporte de Inventario',
            tipo: 'inventario',
            formato: 'Excel',
            tamaño: '1.8 MB',
            fechaGeneracion: '2024-06-29 16:45',
            estado: 'completado',
            descripcion: 'Estado actual del inventario con alertas de stock',
            url: '/reportes/inventario-actual.xlsx',
            integracion: 'Sistema Interno'
          },
          {
            id: 3,
            nombre: 'Reporte de Pagos MercadoPago',
            tipo: 'pagos',
            formato: 'CSV',
            tamaño: '856 KB',
            fechaGeneracion: '2024-06-28 14:20',
            estado: 'completado',
            descripcion: 'Transacciones procesadas por MercadoPago',
            url: '/reportes/pagos-mercadopago.csv',
            integracion: 'MercadoPago'
          },
          {
            id: 4,
            nombre: 'Reporte de Tipos de Cambio',
            tipo: 'divisas',
            formato: 'JSON',
            tamaño: '245 KB',
            fechaGeneracion: '2024-06-30 09:00',
            estado: 'completado',
            descripcion: 'Historial de tipos de cambio del Banco Central',
            url: '/reportes/tipos-cambio.json',
            integracion: 'Banco Central'
          },
          {
            id: 5,
            nombre: 'Reporte de Analytics',
            tipo: 'analytics',
            formato: 'PDF',
            tamaño: '3.1 MB',
            fechaGeneracion: '2024-06-27 11:15',
            estado: 'procesando',
            descripcion: 'Análisis de tráfico web y conversiones',
            url: null,
            integracion: 'Google Analytics'
          },
          {
            id: 6,
            nombre: 'Reporte de Email Marketing',
            tipo: 'marketing',
            formato: 'Excel',
            tamaño: '1.2 MB',
            fechaGeneracion: '2024-06-26 13:30',
            estado: 'error',
            descripcion: 'Estadísticas de campañas de email',
            url: null,
            integracion: 'Mailchimp'
          }
        ]);
        setCargando(false);
      }, 1500);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      setCargando(false);
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'completado': return 'text-green-600 bg-green-100';
      case 'procesando': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'completado': return <CheckCircleIcon className="w-4 h-4" />;
      case 'procesando': return <ClockIcon className="w-4 h-4" />;
      case 'error': return <ExclamationTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const descargarReporte = (reporte) => {
    if (reporte.url) {
      // Simular descarga
      const link = document.createElement('a');
      link.href = reporte.url;
      link.download = reporte.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generarNuevoReporte = () => {
    // Simular generación de reporte
    const nuevoReporte = {
      id: Date.now(),
      nombre: 'Nuevo Reporte Personalizado',
      tipo: 'personalizado',
      formato: 'PDF',
      tamaño: '0 KB',
      fechaGeneracion: new Date().toLocaleString(),
      estado: 'procesando',
      descripcion: 'Reporte generado a solicitud del usuario',
      url: null,
      integracion: 'Sistema Interno'
    };
    
    setReportes([nuevoReporte, ...reportes]);
  };

  const reportesFiltrados = reportes.filter(reporte => {
    if (filtros.tipo !== 'todos' && reporte.tipo !== filtros.tipo) return false;
    if (filtros.estado !== 'todos' && reporte.estado !== filtros.estado) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6" />
              Reportes Externos
            </h2>
            <p className="text-purple-100 mt-1">
              Gestión y descarga de reportes de integraciones externas
            </p>
          </div>
          <button
            onClick={generarNuevoReporte}
            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ChartBarIcon className="w-5 h-5" />
            Nuevo Reporte
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filtros
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Reporte
            </label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="todos">Todos los tipos</option>
              <option value="ventas">Ventas</option>
              <option value="inventario">Inventario</option>
              <option value="pagos">Pagos</option>
              <option value="divisas">Divisas</option>
              <option value="analytics">Analytics</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="todos">Todos los estados</option>
              <option value="completado">Completado</option>
              <option value="procesando">Procesando</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Lista de Reportes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Reportes Disponibles ({reportesFiltrados.length})
        </h3>
        
        {cargando ? (
          <div className="text-center py-8">
            <ClockIcon className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
            <p className="text-gray-500">Cargando reportes...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reportesFiltrados.map((reporte) => (
              <motion.div
                key={reporte.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {reporte.nombre}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${obtenerColorEstado(reporte.estado)}`}>
                        {obtenerIconoEstado(reporte.estado)}
                        {reporte.estado}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {reporte.descripcion}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {reporte.fechaGeneracion}
                      </span>
                      <span>Formato: {reporte.formato}</span>
                      <span>Tamaño: {reporte.tamaño}</span>
                      <span>Integración: {reporte.integracion}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {reporte.url && (
                      <button
                        onClick={() => descargarReporte(reporte)}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                        title="Descargar reporte"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => setReporteSeleccionado(reporte)}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {reporteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detalles del Reporte
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre:</label>
                <p className="text-gray-900 dark:text-white">{reporteSeleccionado.nombre}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción:</label>
                <p className="text-gray-900 dark:text-white">{reporteSeleccionado.descripcion}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${obtenerColorEstado(reporteSeleccionado.estado)}`}>
                  {obtenerIconoEstado(reporteSeleccionado.estado)}
                  {reporteSeleccionado.estado}
                </span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Generación:</label>
                <p className="text-gray-900 dark:text-white">{reporteSeleccionado.fechaGeneracion}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Integración:</label>
                <p className="text-gray-900 dark:text-white">{reporteSeleccionado.integracion}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              {reporteSeleccionado.url && (
                <button
                  onClick={() => descargarReporte(reporteSeleccionado)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Descargar
                </button>
              )}
              <button
                onClick={() => setReporteSeleccionado(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ReportesExternos;
