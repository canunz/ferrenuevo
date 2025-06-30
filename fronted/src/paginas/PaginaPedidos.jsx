import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useNotificacion } from '../contexto/ContextoNotificacion';
import { servicioPedidos } from '../servicios/servicioPedidos';

const PaginaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [filtros, setFiltros] = useState({
    estado: 'todos',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });
  const { exito, error } = useNotificacion();

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    setCargando(true);
    try {
      // Simular carga de pedidos
      setTimeout(() => {
        setPedidos([
          {
            id: 1,
            numero_pedido: 'PED-2024-001',
            usuario: {
              id: 1,
              nombre: 'Juan Pérez',
              email: 'juan.perez@email.com',
              telefono: '+56 9 1234 5678'
            },
            estado: 'pendiente',
            total: 485990,
            subtotal: 450000,
            metodo_entrega: 'domicilio',
            direccion_entrega: 'Av. Providencia 1234, Providencia, Santiago',
            fecha_creacion: '2024-06-30 10:30:00',
            fecha_actualizacion: '2024-06-30 10:30:00',
            productos: [
              {
                id: 1,
                producto_id: 1,
                producto_nombre: 'Taladro Eléctrico DeWalt 20V',
                cantidad: 2,
                precio_unitario: 125000,
                subtotal: 250000
              },
              {
                id: 2,
                producto_id: 2,
                producto_nombre: 'Sierra Circular Bosch 725',
                cantidad: 1,
                precio_unitario: 200000,
                subtotal: 200000
              }
            ],
            observaciones: 'Entregar en horario de oficina'
          },
          {
            id: 2,
            numero_pedido: 'PED-2024-002',
            usuario: {
              id: 2,
              nombre: 'María González',
              email: 'maria.gonzalez@email.com',
              telefono: '+56 9 8765 4321'
            },
            estado: 'confirmado',
            total: 234500,
            subtotal: 220000,
            metodo_entrega: 'retiro_tienda',
            direccion_entrega: null,
            fecha_creacion: '2024-06-29 15:45:00',
            fecha_actualizacion: '2024-06-30 09:15:00',
            productos: [
              {
                id: 3,
                producto_id: 3,
                producto_nombre: 'Martillo Stanley 16oz',
                cantidad: 3,
                precio_unitario: 45000,
                subtotal: 135000
              },
              {
                id: 4,
                producto_id: 4,
                producto_nombre: 'Set Destornilladores DeWalt',
                cantidad: 1,
                precio_unitario: 85000,
                subtotal: 85000
              }
            ],
            observaciones: null
          },
          {
            id: 3,
            numero_pedido: 'PED-2024-003',
            usuario: {
              id: 3,
              nombre: 'Carlos Rodríguez',
              email: 'carlos.rodriguez@email.com',
              telefono: '+56 9 5555 1234'
            },
            estado: 'en_preparacion',
            total: 156750,
            subtotal: 150000,
            metodo_entrega: 'domicilio',
            direccion_entrega: 'Calle Las Condes 890, Las Condes, Santiago',
            fecha_creacion: '2024-06-28 14:20:00',
            fecha_actualizacion: '2024-06-30 11:30:00',
            productos: [
              {
                id: 5,
                producto_id: 5,
                producto_nombre: 'Lijadora Orbital Makita',
                cantidad: 1,
                precio_unitario: 120000,
                subtotal: 120000
              },
              {
                id: 6,
                producto_id: 6,
                producto_nombre: 'Llave Inglesa Ajustable 12"',
                cantidad: 2,
                precio_unitario: 15000,
                subtotal: 30000
              }
            ],
            observaciones: 'Productos para proyecto de construcción'
          },
          {
            id: 4,
            numero_pedido: 'PED-2024-004',
            usuario: {
              id: 4,
              nombre: 'Ana Silva',
              email: 'ana.silva@email.com',
              telefono: '+56 9 7777 8888'
            },
            estado: 'enviado',
            total: 89990,
            subtotal: 85000,
            metodo_entrega: 'domicilio',
            direccion_entrega: 'Av. Apoquindo 4567, Las Condes, Santiago',
            fecha_creacion: '2024-06-27 16:10:00',
            fecha_actualizacion: '2024-06-30 08:45:00',
            productos: [
              {
                id: 7,
                producto_id: 7,
                producto_nombre: 'Taladro Percutor Black & Decker',
                cantidad: 1,
                precio_unitario: 85000,
                subtotal: 85000
              }
            ],
            observaciones: 'Entregar antes del mediodía'
          },
          {
            id: 5,
            numero_pedido: 'PED-2024-005',
            usuario: {
              id: 5,
              nombre: 'Roberto Méndez',
              email: 'roberto.mendez@email.com',
              telefono: '+56 9 9999 1111'
            },
            estado: 'entregado',
            total: 320000,
            subtotal: 300000,
            metodo_entrega: 'retiro_tienda',
            direccion_entrega: null,
            fecha_creacion: '2024-06-26 12:30:00',
            fecha_actualizacion: '2024-06-29 17:20:00',
            productos: [
              {
                id: 8,
                producto_id: 8,
                producto_nombre: 'Sierra Circular Bosch 725',
                cantidad: 1,
                precio_unitario: 200000,
                subtotal: 200000
              },
              {
                id: 9,
                producto_id: 9,
                producto_nombre: 'Set Destornilladores DeWalt',
                cantidad: 1,
                precio_unitario: 85000,
                subtotal: 85000
              },
              {
                id: 10,
                producto_id: 10,
                producto_nombre: 'Martillo Stanley 16oz',
                cantidad: 1,
                precio_unitario: 45000,
                subtotal: 45000
              }
            ],
            observaciones: null
          }
        ]);
        setCargando(false);
      }, 1000);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      error('Error al cargar los pedidos');
      setCargando(false);
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'confirmado': return 'text-blue-600 bg-blue-100';
      case 'en_preparacion': return 'text-orange-600 bg-orange-100';
      case 'enviado': return 'text-indigo-600 bg-indigo-100';
      case 'entregado': return 'text-green-600 bg-green-100';
      case 'cancelado': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'pendiente': return <ClockIcon className="w-4 h-4" />;
      case 'confirmado': return <CheckCircleIcon className="w-4 h-4" />;
      case 'en_preparacion': return <PencilIcon className="w-4 h-4" />;
      case 'enviado': return <TruckIcon className="w-4 h-4" />;
      case 'entregado': return <CheckCircleIcon className="w-4 h-4" />;
      case 'cancelado': return <XCircleIcon className="w-4 h-4" />;
      default: return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      // Simular cambio de estado
      setPedidos(prev => prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, estado: nuevoEstado, fecha_actualizacion: new Date().toISOString() }
          : pedido
      ));
      exito(`Estado del pedido cambiado a ${nuevoEstado}`);
    } catch (err) {
      error('Error al cambiar el estado del pedido');
    }
  };

  const eliminarPedido = async (pedidoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      try {
        setPedidos(prev => prev.filter(pedido => pedido.id !== pedidoId));
        exito('Pedido eliminado correctamente');
      } catch (err) {
        error('Error al eliminar el pedido');
      }
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtros.estado !== 'todos' && pedido.estado !== filtros.estado) return false;
    if (filtros.busqueda && !pedido.numero_pedido.toLowerCase().includes(filtros.busqueda.toLowerCase()) && 
        !pedido.usuario.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false;
    return true;
  });

  const estadisticas = {
    total: pedidos.length,
    pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
    enPreparacion: pedidos.filter(p => p.estado === 'en_preparacion').length,
    enviados: pedidos.filter(p => p.estado === 'enviado').length,
    entregados: pedidos.filter(p => p.estado === 'entregado').length,
    cancelados: pedidos.filter(p => p.estado === 'cancelado').length,
    valorTotal: pedidos.reduce((sum, p) => sum + p.total, 0)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBagIcon className="w-6 h-6" />
              Gestión de Pedidos
            </h2>
            <p className="text-blue-100 mt-1">
              Administra y da seguimiento a todos los pedidos de la ferretería
            </p>
          </div>
          <button
            onClick={() => {/* Implementar nuevo pedido */}}
            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Pedido
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
          <div className="text-sm text-gray-600">Total Pedidos</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">{estadisticas.enPreparacion}</div>
          <div className="text-sm text-gray-600">En Preparación</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-indigo-600">{estadisticas.enviados}</div>
          <div className="text-sm text-gray-600">Enviados</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{estadisticas.entregados}</div>
          <div className="text-sm text-gray-600">Entregados</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">{estadisticas.cancelados}</div>
          <div className="text-sm text-gray-600">Cancelados</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-lg font-bold text-gray-900">{formatearPrecio(estadisticas.valorTotal)}</div>
          <div className="text-sm text-gray-600">Valor Total</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="en_preparacion">En Preparación</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                value={filtros.busqueda}
                onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                placeholder="Número de pedido o cliente..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pedidos ({pedidosFiltrados.length})
        </h3>
        
        {cargando ? (
          <div className="text-center py-8">
            <ClockIcon className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-500">Cargando pedidos...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {pedido.numero_pedido}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${obtenerColorEstado(pedido.estado)}`}>
                        {obtenerIconoEstado(pedido.estado)}
                        {pedido.estado.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Cliente:</span>
                        <p>{pedido.usuario.nombre}</p>
                        <p className="text-xs">{pedido.usuario.email}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium">Total:</span>
                        <p className="font-semibold text-gray-900">{formatearPrecio(pedido.total)}</p>
                        <p className="text-xs">{pedido.productos.length} productos</p>
                      </div>
                      
                      <div>
                        <span className="font-medium">Entrega:</span>
                        <p>{pedido.metodo_entrega.replace('_', ' ')}</p>
                        {pedido.direccion_entrega && (
                          <p className="text-xs truncate">{pedido.direccion_entrega}</p>
                        )}
                      </div>
                      
                      <div>
                        <span className="font-medium">Fecha:</span>
                        <p>{formatearFecha(pedido.fecha_creacion)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPedidoSeleccionado(pedido);
                        setModalDetalle(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        setPedidoSeleccionado(pedido);
                        setModalEditar(true);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => eliminarPedido(pedido.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {modalDetalle && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles del Pedido {pedidoSeleccionado.numero_pedido}
              </h3>
              <button
                onClick={() => setModalDetalle(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Información del Cliente</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nombre:</span> {pedidoSeleccionado.usuario.nombre}</p>
                  <p><span className="font-medium">Email:</span> {pedidoSeleccionado.usuario.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {pedidoSeleccionado.usuario.telefono}</p>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Información del Pedido</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Estado:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(pedidoSeleccionado.estado)}`}>
                      {pedidoSeleccionado.estado.replace('_', ' ')}
                    </span>
                  </p>
                  <p><span className="font-medium">Método de entrega:</span> {pedidoSeleccionado.metodo_entrega.replace('_', ' ')}</p>
                  {pedidoSeleccionado.direccion_entrega && (
                    <p><span className="font-medium">Dirección:</span> {pedidoSeleccionado.direccion_entrega}</p>
                  )}
                  <p><span className="font-medium">Fecha de creación:</span> {formatearFecha(pedidoSeleccionado.fecha_creacion)}</p>
                  <p><span className="font-medium">Última actualización:</span> {formatearFecha(pedidoSeleccionado.fecha_actualizacion)}</p>
                  {pedidoSeleccionado.observaciones && (
                    <p><span className="font-medium">Observaciones:</span> {pedidoSeleccionado.observaciones}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                <div className="space-y-3">
                  {pedidoSeleccionado.productos.map((producto) => (
                    <div key={producto.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{producto.producto_nombre}</p>
                          <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatearPrecio(producto.precio_unitario)}</p>
                          <p className="text-sm text-gray-600">Subtotal: {formatearPrecio(producto.subtotal)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatearPrecio(pedidoSeleccionado.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className="font-semibold text-lg">{formatearPrecio(pedidoSeleccionado.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PaginaPedidos;