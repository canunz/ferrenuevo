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
import { servicioClientes } from '../servicios/servicioClientes';
import { servicioProductos } from '../servicios/servicioProductos';

const PaginaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [formularioPedido, setFormularioPedido] = useState({
    cliente_id: '',
    productos: [],
    metodo_entrega: 'retiro_tienda',
    direccion_entrega: '',
    observaciones: ''
  });
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    producto_id: '',
    cantidad: 1,
    precio_unitario: 0
  });
  const [filtros, setFiltros] = useState({
    estado: 'todos',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });
  const [clientes, setClientes] = useState([]);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const { exito, error } = useNotificacion();

  useEffect(() => {
    cargarPedidos();
    cargarProductos();
    cargarClientes();
  }, []);

  useEffect(() => {
    console.log('PRODUCTOS DISPONIBLES:', productosDisponibles);
  }, [productosDisponibles]);

  const cargarPedidos = async () => {
    setCargando(true);
    try {
      const response = await servicioPedidos.obtenerTodos();
      console.log('📦 Respuesta de pedidos:', response);
      if (response.success) {
        setPedidos(response.data.pedidos || []);
        console.log('📦 Pedidos cargados:', response.data.pedidos);
      } else {
        setPedidos([]);
        error('No se pudieron cargar los pedidos');
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      error('Error al cargar los pedidos');
      setPedidos([]);
    } finally {
      setCargando(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await servicioProductos.obtenerTodos({ limit: 100 });
      if (response.success) {
        setProductosDisponibles(response.data || []);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const cargarClientes = async () => {
    setCargandoClientes(true);
    try {
      const response = await servicioClientes.obtenerTodos({ limit: 100 });
      if (response.success) {
        setClientes(response.data || []);
      }
    } catch (e) {
      setClientes([]);
    } finally {
      setCargandoClientes(false);
    }
  };

  const agregarProducto = () => {
    if (productoSeleccionado.producto_id && productoSeleccionado.cantidad > 0) {
      const producto = productosDisponibles.find(p => p.id == productoSeleccionado.producto_id);
      if (producto) {
        const nuevoProducto = {
          producto_id: parseInt(productoSeleccionado.producto_id),
          cantidad: parseInt(productoSeleccionado.cantidad),
          precio_unitario: parseFloat(producto.precio)
        };
        
        setFormularioPedido(prev => ({
          ...prev,
          productos: [...prev.productos, nuevoProducto]
        }));
        
        setProductoSeleccionado({
          producto_id: '',
          cantidad: 1,
          precio_unitario: 0
        });
      }
    }
  };

  const eliminarProducto = (index) => {
    setFormularioPedido(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
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
    const precioNumerico = parseFloat(precio) || 0;
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precioNumerico);
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
      const response = await servicioPedidos.actualizarEstado(pedidoId, nuevoEstado);
      if (response.success) {
        setPedidos(prev => prev.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, estado: nuevoEstado, fecha_actualizacion: new Date().toISOString() }
            : pedido
        ));
        exito(`Estado del pedido cambiado a ${nuevoEstado}`);
      } else {
        error(response.message || 'Error al cambiar el estado del pedido');
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      error('Error al cambiar el estado del pedido');
    }
  };

  const eliminarPedido = async (pedidoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      try {
        const response = await servicioPedidos.eliminar(pedidoId);
        if (response.success) {
          setPedidos(prev => prev.filter(pedido => pedido.id !== pedidoId));
          exito('Pedido eliminado correctamente');
        } else {
          error(response.message || 'Error al eliminar el pedido');
        }
      } catch (err) {
        console.error('Error al eliminar pedido:', err);
        error('Error al eliminar el pedido');
      }
    }
  };

  const crearPedido = async (datos) => {
    try {
      const payload = { ...datos };
      if (datos.cliente_id) payload.cliente_id = datos.cliente_id;
      const response = await servicioPedidos.crear(payload);
      if (response.success) {
        setPedidos(prev => [response.data.pedido, ...prev]);
        setModalNuevo(false);
        setFormularioPedido({
          cliente_id: '',
          productos: [],
          metodo_entrega: 'retiro_tienda',
          direccion_entrega: '',
          observaciones: ''
        });
        exito('Pedido creado correctamente');
      } else {
        error(response.message || 'Error al crear el pedido');
      }
    } catch (err) {
      console.error('Error al crear pedido:', err);
      error('Error al crear el pedido');
    }
  };

  const actualizarPedido = async (pedidoId, datos) => {
    try {
      console.log('Datos enviados a actualizarPedido:', datos);
      const response = await servicioPedidos.actualizar(pedidoId, datos);
      if (response.success) {
        setPedidos(prev => prev.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, ...response.data.pedido }
            : pedido
        ));
        setModalEditar(false);
        setPedidoSeleccionado(null);
        exito('Pedido actualizado correctamente');
      } else {
        error(response.message || 'Error al actualizar el pedido');
      }
    } catch (err) {
      console.error('Error al actualizar pedido:', err);
      error('Error al actualizar el pedido');
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
    valorTotal: pedidos.reduce((sum, p) => {
      const total = parseFloat(p.total) || 0;
      return sum + total;
    }, 0)
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
            onClick={() => setModalNuevo(true)}
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
                        <p>{pedido.usuario}</p>
                        <p className="text-xs">{pedido.usuario_email}</p>
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
                          <p className="text-xs truncate">
                            {pedido.direccion_entrega.length < 10 ? 'Dirección no especificada' : pedido.direccion_entrega}
                          </p>
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
                  <p><span className="font-medium">Nombre:</span> {pedidoSeleccionado.usuario || pedidoSeleccionado.cliente_nombre}</p>
                  <p><span className="font-medium">Email:</span> {pedidoSeleccionado.usuario_email || pedidoSeleccionado.cliente_email}</p>
                  <p><span className="font-medium">Teléfono:</span> {pedidoSeleccionado.usuario_telefono || pedidoSeleccionado.cliente_telefono}</p>
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
                    <p><span className="font-medium">Dirección:</span> {
                      pedidoSeleccionado.direccion_entrega.length < 10 ? 
                      'Dirección no especificada' : 
                      pedidoSeleccionado.direccion_entrega
                    }</p>
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

      {/* Modal de Nuevo Pedido */}
      {modalNuevo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Nuevo Pedido
              </h3>
              <button
                onClick={() => setModalNuevo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente
                </label>
                <select
                  value={formularioPedido.cliente_id || ''}
                  onChange={e => setFormularioPedido({ ...formularioPedido, cliente_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={cargandoClientes}
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} ({cliente.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Entrega
                </label>
                <select
                  value={formularioPedido.metodo_entrega}
                  onChange={(e) => setFormularioPedido({...formularioPedido, metodo_entrega: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="retiro_tienda">Retiro en Tienda</option>
                  <option value="despacho_domicilio">Domicilio</option>
                </select>
              </div>

              {formularioPedido.metodo_entrega === 'despacho_domicilio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={formularioPedido.direccion_entrega}
                    onChange={(e) => setFormularioPedido({...formularioPedido, direccion_entrega: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese la dirección de entrega"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Productos
                </label>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <select
                      value={productoSeleccionado.producto_id}
                      onChange={(e) => {
                        const producto = productosDisponibles.find(p => p.id == e.target.value);
                        setProductoSeleccionado({
                          ...productoSeleccionado,
                          producto_id: e.target.value,
                          precio_unitario: producto ? producto.precio : 0
                        });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar producto</option>
                      {productosDisponibles.map(producto => (
                        <option key={producto.id} value={producto.id}>
                          {producto.nombre} - ${producto.precio}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={productoSeleccionado.cantidad}
                      onChange={(e) => setProductoSeleccionado({...productoSeleccionado, cantidad: parseInt(e.target.value) || 1})}
                      min="1"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Cantidad"
                    />
                    <button
                      onClick={agregarProducto}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Agregar
                    </button>
                  </div>
                  
                  {formularioPedido.productos.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Productos seleccionados:</h4>
                      {formularioPedido.productos.map((producto, index) => {
                        const productoInfo = productosDisponibles.find(p => p.id == producto.producto_id);
                        return (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span>{productoInfo?.nombre || 'Producto'}</span>
                            <span>Cantidad: {producto.cantidad}</span>
                            <span>${producto.precio_unitario}</span>
                            <button
                              onClick={() => eliminarProducto(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formularioPedido.observaciones}
                  onChange={(e) => setFormularioPedido({...formularioPedido, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setModalNuevo(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (formularioPedido.productos.length === 0) {
                      error('Debe seleccionar al menos un producto');
                      return;
                    }
                    crearPedido(formularioPedido);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear Pedido
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Editar Pedido */}
      {modalEditar && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Editar Pedido {pedidoSeleccionado.numero_pedido}
              </h3>
              <button
                onClick={() => setModalEditar(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={pedidoSeleccionado.estado}
                  onChange={(e) => {
                    setPedidoSeleccionado({...pedidoSeleccionado, estado: e.target.value});
                    cambiarEstado(pedidoSeleccionado.id, e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="preparando">Preparando</option>
                  <option value="listo">Listo</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Entrega
                </label>
                <select
                  value={pedidoSeleccionado.metodo_entrega}
                  onChange={(e) => setPedidoSeleccionado({...pedidoSeleccionado, metodo_entrega: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="retiro_tienda">Retiro en Tienda</option>
                  <option value="despacho_domicilio">Domicilio</option>
                </select>
              </div>

              {pedidoSeleccionado.metodo_entrega === 'despacho_domicilio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={pedidoSeleccionado.direccion_entrega || ''}
                    onChange={(e) => setPedidoSeleccionado({...pedidoSeleccionado, direccion_entrega: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese la dirección de entrega"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={pedidoSeleccionado.observaciones || ''}
                  onChange={(e) => setPedidoSeleccionado({...pedidoSeleccionado, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setModalEditar(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => actualizarPedido(pedidoSeleccionado.id, pedidoSeleccionado)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PaginaPedidos;