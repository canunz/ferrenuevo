import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { servicioFacturas } from '../../servicios/servicioFacturas';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const ListaFacturas = ({ onVerFactura, onEmitirFactura }) => {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    estado: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [paginacion, setPaginacion] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  const { exito, error } = useNotificacion();

  const cargarFacturas = async () => {
    try {
      setCargando(true);
      const params = {
        page: paginacion.current_page,
        limit: paginacion.items_per_page,
        ...filtros
      };
      
      const respuesta = await servicioFacturas.obtenerTodas(params);
      setFacturas(respuesta.data || []);
      setPaginacion(respuesta.paginacion || paginacion);
    } catch (err) {
      console.error('Error al cargar facturas:', err);
      error('Error al cargar las facturas');
      setFacturas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, [paginacion.current_page, filtros]);

  const buscarFacturas = async () => {
    if (!terminoBusqueda.trim()) {
      cargarFacturas();
      return;
    }

    try {
      setCargando(true);
      const respuesta = await servicioFacturas.buscar(terminoBusqueda);
      setFacturas(respuesta.data || []);
    } catch (err) {
      console.error('Error al buscar facturas:', err);
      error('Error al buscar facturas');
      setFacturas([]);
    } finally {
      setCargando(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
    setTerminoBusqueda('');
  };

  const obtenerColorEstado = (estado) => {
    const estados = servicioFacturas.obtenerEstados();
    const estadoInfo = estados.find(s => s.value === estado);
    return estadoInfo?.color || 'gray';
  };

  const obtenerLabelEstado = (estado) => {
    const estados = servicioFacturas.obtenerEstados();
    const estadoInfo = estados.find(s => s.value === estado);
    return estadoInfo?.label || estado;
  };

  const cambiarPagina = (nuevaPagina) => {
    setPaginacion(prev => ({ ...prev, current_page: nuevaPagina }));
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Facturas</h2>
          </div>
          <button
            onClick={onEmitirFactura}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Emitir Factura
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Búsqueda */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarFacturas()}
                placeholder="Buscar por número de factura, cliente..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              {servicioFacturas.obtenerEstados().map(estado => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filtros.fecha_inicio}
              onChange={(e) => setFiltros(prev => ({ ...prev, fecha_inicio: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              value={filtros.fecha_fin}
              onChange={(e) => setFiltros(prev => ({ ...prev, fecha_fin: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={limpiarFiltros}
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de facturas */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(facturas) && facturas.length > 0 ? (
              facturas.map((factura) => (
                <tr key={factura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {servicioFacturas.formatearNumero(factura.numero_factura)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {factura.cliente_nombre || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {servicioFacturas.formatearFecha(factura.fecha_emision)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {servicioFacturas.formatearMoneda(factura.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${obtenerColorEstado(factura.estado)}-100 text-${obtenerColorEstado(factura.estado)}-800`}>
                      {obtenerLabelEstado(factura.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onVerFactura(factura.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver factura"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => servicioFacturas.exportar({ id: factura.id })}
                        className="text-green-600 hover:text-green-900"
                        title="Descargar factura"
                      >
                        <DocumentArrowDownIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  {Array.isArray(facturas) ? 'No se encontraron facturas' : 'Cargando facturas...'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {paginacion.total_pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Mostrando página {paginacion.current_page} de {paginacion.total_pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => cambiarPagina(paginacion.current_page - 1)}
                disabled={paginacion.current_page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => cambiarPagina(paginacion.current_page + 1)}
                disabled={paginacion.current_page === paginacion.total_pages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaFacturas;
