import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CreditCardIcon,
  TruckIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PencilIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { useNotificacion } from '../../contexto/ContextoNotificacion';
import { servicioPedidos } from '../../servicios/servicioPedidos';

const DetallePedido = ({ pedidoId, onCerrar, onActualizar }) => {
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState({});
  const { exito, error } = useNotificacion();

  useEffect(() => {
    if (pedidoId) {
      cargarPedido();
    }
  }, [pedidoId]);

  const cargarPedido = async () => {
    setCargando(true);
    try {
      const response = await servicioPedidos.obtenerPorId(pedidoId);
      if (response.success) {
        const pedidoReal = response.data;
        
        // Formatear el pedido para el componente
        const pedidoFormateado = {
          id: pedidoReal.id,
          numero_pedido: pedidoReal.numero_pedido,
          usuario: {
            id: pedidoReal.usuario_id,
            nombre: pedidoReal.usuario,
            email: pedidoReal.usuario_email,
            telefono: pedidoReal.usuario_telefono || '',
            rut: pedidoReal.usuario_rut || ''
          },
          estado: pedidoReal.estado,
          total: pedidoReal.total,
          subtotal: pedidoReal.subtotal,
          costo_envio: pedidoReal.costo_envio || 0,
          metodo_entrega: pedidoReal.metodo_entrega,
          direccion_entrega: pedidoReal.direccion_entrega,
          fecha_creacion: pedidoReal.fecha_creacion,
          fecha_actualizacion: pedidoReal.fecha_actualizacion,
          observaciones: pedidoReal.observaciones,
          productos: pedidoReal.productos || []
        };
        
        setPedido(pedidoFormateado);
        setFormulario({
          observaciones: pedidoFormateado.observaciones || '',
          direccion_entrega: pedidoFormateado.direccion_entrega || '',
          fecha_entrega_estimada: pedidoFormateado.fecha_entrega_estimada || ''
        });
      } else {
        error('No se pudo cargar el pedido');
      }
    } catch (err) {
      console.error('Error al cargar pedido:', err);
      error('Error al cargar el pedido');
    } finally {
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

  const guardarCambios = async () => {
    try {
      // Simular guardado
      setPedido(prev => ({
        ...prev,
        ...formulario,
        fecha_actualizacion: new Date().toISOString()
      }));
      setEditando(false);
      exito('Pedido actualizado correctamente');
      if (onActualizar) {
        onActualizar();
      }
    } catch (err) {
      error('Error al actualizar el pedido');
    }
  };

  const imprimirPedido = () => {
    window.print();
  };

  const compartirPedido = () => {
    if (navigator.share) {
      navigator.share({
        title: `Pedido ${pedido.numero_pedido}`,
        text: `Detalles del pedido ${pedido.numero_pedido}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      exito('Enlace copiado al portapapeles');
    }
  };

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <ClockIcon className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontró el pedido</p>
          <button
            onClick={onCerrar}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Encabezado */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBagIcon className="w-6 h-6" />
                Pedido {pedido.numero_pedido}
              </h2>
              <p className="text-gray-600 mt-1">
                Creado el {formatearFecha(pedido.fecha_creacion)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${obtenerColorEstado(pedido.estado)}`}>
                {obtenerIconoEstado(pedido.estado)}
                {pedido.estado.replace('_', ' ')}
              </span>
              
              <button
                onClick={imprimirPedido}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Imprimir"
              >
                <PrinterIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={compartirPedido}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Compartir"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={onCerrar}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cerrar"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Información Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información del Cliente */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Información del Cliente
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Nombre</p>
                    <p className="text-gray-900">{pedido.usuario.nombre}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">RUT</p>
                    <p className="text-gray-900">{pedido.usuario.rut}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 flex items-center gap-1">
                      <EnvelopeIcon className="w-4 h-4" />
                      Email
                    </p>
                    <p className="text-gray-900">{pedido.usuario.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4" />
                      Teléfono
                    </p>
                    <p className="text-gray-900">{pedido.usuario.telefono}</p>
                  </div>
                </div>
              </div>

              {/* Información de Entrega */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  Información de Entrega
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Método de entrega</p>
                    <p className="text-gray-900 flex items-center gap-1">
                      <TruckIcon className="w-4 h-4" />
                      {pedido.metodo_entrega.replace('_', ' ')}
                    </p>
                  </div>
                  {pedido.direccion_entrega && (
                    <div>
                      <p className="font-medium text-gray-700">Dirección</p>
                      <p className="text-gray-900">{pedido.direccion_entrega}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-700">Fecha estimada de entrega</p>
                    <p className="text-gray-900 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {formatearFecha(pedido.fecha_entrega_estimada)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Productos del Pedido</h3>
                <div className="space-y-4">
                  {pedido.productos.map((producto) => (
                    <div key={producto.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          <img
                            src={producto.producto_imagen}
                            alt={producto.producto_nombre}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/assets/imagenes/productos/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{producto.producto_nombre}</h4>
                          <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                          <p className="text-sm text-gray-600">Stock disponible: {producto.stock_disponible}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatearPrecio(producto.precio_unitario)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Subtotal: {formatearPrecio(producto.subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Observaciones</h3>
                {editando ? (
                  <textarea
                    value={formulario.observaciones || ''}
                    onChange={(e) => setFormulario({...formulario, observaciones: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observaciones del pedido..."
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {pedido.observaciones || 'Sin observaciones'}
                  </p>
                )}
              </div>
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">
              {/* Resumen de Costos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen de Costos</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatearPrecio(pedido.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo de envío:</span>
                    <span>{formatearPrecio(pedido.costo_envio)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-lg">{formatearPrecio(pedido.total)}</span>
                  </div>
                </div>
              </div>

              {/* Información de Pago */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5" />
                  Información de Pago
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Método de pago</p>
                    <p className="text-gray-900">{pedido.metodo_pago}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Estado del pago</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pedido.estado_pago === 'pagado' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                    }`}>
                      {pedido.estado_pago}
                    </span>
                  </div>
                </div>
              </div>

              {/* Historial de Estados */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Historial de Estados</h3>
                <div className="space-y-3">
                  {pedido.historial_estados.map((historial, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {historial.estado.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-600">{formatearFecha(historial.fecha)}</p>
                        {historial.comentario && (
                          <p className="text-xs text-gray-500 mt-1">{historial.comentario}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="space-y-2">
                <button
                  onClick={() => setEditando(!editando)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  {editando ? 'Cancelar Edición' : 'Editar Pedido'}
                </button>
                
                {editando && (
                  <button
                    onClick={guardarCambios}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Guardar Cambios
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DetallePedido;
