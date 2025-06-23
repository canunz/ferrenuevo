// ==========================================
// ARCHIVO: frontend/src/componentes/inventario/ControlInventario.jsx - COMPLETO
// ==========================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const ControlInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroStock, setFiltroStock] = useState('todos');
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('todas');
  const [modalAjuste, setModalAjuste] = useState({ abierto: false, item: null });
  const [modalMovimiento, setModalMovimiento] = useState({ abierto: false, tipo: null });
  const { exito, error } = useNotificacion();

  // Datos simulados
  const sucursales = [
    { id: 'todas', nombre: 'Todas las Sucursales' },
    { id: 1, nombre: 'FERREMAS Centro' },
    { id: 2, nombre: 'FERREMAS Norte' },
    { id: 3, nombre: 'FERREMAS Sur' }
  ];

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    setCargando(true);
    try {
      const response = await fetch('/api/v1/inventario', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al cargar el inventario');
      }
      const data = await response.json();
      
      if (data.exito) {
        setInventario(data.datos);
      } else {
        throw new Error(data.mensaje || 'Error al cargar el inventario');
      }
    } catch (err) {
      error('Error al cargar inventario: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const obtenerColorStock = (item) => {
    if (item.stock_actual === 0) return 'bg-red-100 text-red-800';
    if (item.stock_actual <= item.stock_minimo) return 'bg-orange-100 text-orange-800';
    if (item.stock_actual >= item.stock_maximo * 0.8) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'agotado':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'bajo':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'normal':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const inventarioFiltrado = inventario.filter(item => {
    const cumpleBusqueda = item.producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          item.producto.codigo_sku.toLowerCase().includes(busqueda.toLowerCase()) ||
                          item.producto.marca.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleFiltroStock = filtroStock === 'todos' ||
                             (filtroStock === 'bajo' && item.estado === 'bajo') ||
                             (filtroStock === 'agotado' && item.estado === 'agotado') ||
                             (filtroStock === 'normal' && item.estado === 'normal');
    
    const cumpleSucursal = sucursalSeleccionada === 'todas' || 
                          item.sucursal.id === parseInt(sucursalSeleccionada);

    return cumpleBusqueda && cumpleFiltroStock && cumpleSucursal;
  });

  const estadisticasInventario = {
    totalProductos: inventario.length,
    stockBajo: inventario.filter(item => item.estado === 'bajo').length,
    agotados: inventario.filter(item => item.estado === 'agotado').length,
    valorTotal: inventario.reduce((sum, item) => sum + item.valor_total, 0)
  };

  const manejarAjusteStock = async (datos) => {
    try {
      // Simular ajuste de stock
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setInventario(prev => prev.map(item => 
        item.id === modalAjuste.item.id 
          ? { 
              ...item, 
              stock_actual: datos.nuevoStock,
              ultimo_movimiento: new Date().toISOString().split('T')[0],
              estado: datos.nuevoStock === 0 ? 'agotado' : 
                     datos.nuevoStock <= item.stock_minimo ? 'bajo' : 'normal',
              valor_total: datos.nuevoStock * item.producto.precio
            }
          : item
      ));

      exito('Stock actualizado correctamente');
      setModalAjuste({ abierto: false, item: null });
    } catch (err) {
      error('Error al actualizar stock');
    }
  };

  const manejarMovimiento = async (datos) => {
    try {
      // Simular movimiento de stock
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setInventario(prev => prev.map(item => 
        item.producto.id === parseInt(datos.producto_id)
          ? {
              ...item,
              stock_actual: modalMovimiento.tipo === 'entrada' 
                ? item.stock_actual + parseInt(datos.cantidad)
                : item.stock_actual - parseInt(datos.cantidad),
              ultimo_movimiento: new Date().toISOString().split('T')[0],
              estado: item.stock_actual === 0 ? 'agotado' :
                     item.stock_actual <= item.stock_minimo ? 'bajo' : 'normal',
              valor_total: item.stock_actual * item.producto.precio
            }
          : item
      ));

      exito(`Movimiento de ${modalMovimiento.tipo} registrado correctamente`);
      setModalMovimiento({ abierto: false, tipo: null });
    } catch (err) {
      error('Error al procesar el movimiento');
    }
  };

  const exportarInventario = () => {
    const csv = [
      ['Producto', 'SKU', 'Sucursal', 'Stock Actual', 'Stock Mínimo', 'Stock Máximo', 'Ubicación', 'Valor Total'],
      ...inventarioFiltrado.map(item => [
        item.producto.nombre,
        item.producto.codigo_sku,
        item.sucursal.nombre,
        item.stock_actual,
        item.stock_minimo,
        item.stock_maximo,
        item.ubicacion,
        item.valor_total
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    exito('Inventario exportado correctamente');
  };

  if (cargando) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Control de Inventario</h1>
          <p className="text-gray-600">Gestiona el stock de todos tus productos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportarInventario}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Exportar
          </button>
          <button
            onClick={() => setModalMovimiento({ abierto: true, tipo: 'entrada' })}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowUpIcon className="h-5 w-5 mr-2" />
            Entrada
          </button>
          <button
            onClick={() => setModalMovimiento({ abierto: true, tipo: 'salida' })}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <ArrowDownIcon className="h-5 w-5 mr-2" />
            Salida
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center">
            <ArchiveBoxIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{estadisticasInventario.totalProductos}</p>
              <p className="text-sm text-gray-600">Total Productos</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{estadisticasInventario.stockBajo}</p>
              <p className="text-sm text-gray-600">Stock Bajo</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{estadisticasInventario.agotados}</p>
              <p className="text-sm text-gray-600">Agotados</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatearPrecio(estadisticasInventario.valorTotal)}</p>
              <p className="text-sm text-gray-600">Valor Total</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filtroStock}
            onChange={(e) => setFiltroStock(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="normal">Stock Normal</option>
            <option value="bajo">Stock Bajo</option>
            <option value="agotado">Agotados</option>
          </select>

          <select
            value={sucursalSeleccionada}
            onChange={(e) => setSucursalSeleccionada(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {sucursales.map(sucursal => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </option>
            ))}
          </select>

          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Más Filtros
          </button>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventarioFiltrado.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {obtenerIconoEstado(item.estado)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {item.producto.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.producto.codigo_sku} • {item.producto.marca}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.sucursal.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorStock(item)}`}>
                      {item.stock_actual} / {item.stock_maximo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.ubicacion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatearPrecio(item.valor_total)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatearPrecio(item.producto.precio)} c/u
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setModalAjuste({ abierto: true, item })}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Ajuste de Stock */}
      <ModalAjusteStock
        abierto={modalAjuste.abierto}
        item={modalAjuste.item}
        onCerrar={() => setModalAjuste({ abierto: false, item: null })}
        onGuardar={manejarAjusteStock}
      />

      {/* Modal de Movimiento */}
      <ModalMovimiento
        abierto={modalMovimiento.abierto}
        tipo={modalMovimiento.tipo}
        onCerrar={() => setModalMovimiento({ abierto: false, tipo: null })}
        productos={inventario.map(item => item.producto)}
        onGuardar={manejarMovimiento}
      />
    </div>
  );
};

// Modal de Ajuste de Stock
const ModalAjusteStock = ({ abierto, item, onCerrar, onGuardar }) => {
  const [nuevoStock, setNuevoStock] = useState('');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    if (item) {
      setNuevoStock(item.stock_actual.toString());
      setObservaciones('');
    }
  }, [item]);

  const manejarGuardar = () => {
    onGuardar({
      nuevoStock: parseInt(nuevoStock),
      observaciones
    });
  };

  if (!abierto || !item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ajustar Stock</h3>
            <button onClick={onCerrar}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">{item.producto.nombre}</h4>
              <p className="text-sm text-gray-600">{item.producto.codigo_sku}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Actual: {item.stock_actual}
              </label>
              <input
                type="number"
                value={nuevoStock}
                onChange={(e) => setNuevoStock(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nuevo stock"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Motivo del ajuste..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={manejarGuardar}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Modal de Movimiento
const ModalMovimiento = ({ abierto, tipo, onCerrar, productos, onGuardar }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [observaciones, setObservaciones] = useState('');

  if (!abierto) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {tipo === 'entrada' ? 'Entrada de Stock' : 'Salida de Stock'}
            </h3>
            <button onClick={onCerrar}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto
              </label>
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar producto</option>
                {productos.map(producto => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - {producto.codigo_sku}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Cantidad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Motivo del movimiento..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              className={`px-4 py-2 text-white rounded-lg ${
                tipo === 'entrada' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              onClick={() => onGuardar({
                producto_id: productoSeleccionado,
                cantidad: cantidad,
                observaciones: observaciones
              })}
            >
              Confirmar {tipo === 'entrada' ? 'Entrada' : 'Salida'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ControlInventario;