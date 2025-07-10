import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UserIcon,
  CreditCardIcon,
  CogIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const SeguimientoPedido = ({ pedido, onActualizarEstado }) => {
  const [estadoActual, setEstadoActual] = useState(pedido?.estado || 'pendiente');
  const [historialEstados, setHistorialEstados] = useState([]);

  useEffect(() => {
    if (pedido) {
      setEstadoActual(pedido.estado);
      generarHistorialEstados(pedido.estado);
    }
  }, [pedido]);

  const generarHistorialEstados = async (estado) => {
    try {
      // Obtener historial real desde el backend
      const response = await fetch(`/api/v1/pedidos/${pedido.id}/historial`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const historialReal = await response.json();
        setHistorialEstados(historialReal.data || []);
      } else {
        // Si no hay historial real, usar estados básicos sin fechas falsas
        const estados = [
          { id: 'pendiente', nombre: 'Pendiente', descripcion: 'Pedido recibido y en espera de confirmación', completado: false },
          { id: 'confirmado', nombre: 'Confirmado', descripcion: 'Pedido confirmado y en proceso de preparación', completado: false },
          { id: 'en_preparacion', nombre: 'En Preparación', descripcion: 'Productos siendo preparados para envío', completado: false },
          { id: 'enviado', nombre: 'Enviado', descripcion: 'Pedido enviado y en tránsito', completado: false },
          { id: 'entregado', nombre: 'Entregado', descripcion: 'Pedido entregado exitosamente', completado: false }
        ];

        const estadoIndex = estados.findIndex(e => e.id === estado);
        const historial = estados.map((estadoItem, index) => ({
          ...estadoItem,
          completado: index <= estadoIndex,
          fecha: null // No generar fechas falsas
        }));

        setHistorialEstados(historial);
      }
    } catch (error) {
      console.error('Error al obtener historial de estados:', error);
      // En caso de error, mostrar estados básicos sin fechas
      const estados = [
        { id: 'pendiente', nombre: 'Pendiente', descripcion: 'Pedido recibido y en espera de confirmación', completado: false },
        { id: 'confirmado', nombre: 'Confirmado', descripcion: 'Pedido confirmado y en proceso de preparación', completado: false },
        { id: 'en_preparacion', nombre: 'En Preparación', descripcion: 'Productos siendo preparados para envío', completado: false },
        { id: 'enviado', nombre: 'Enviado', descripcion: 'Pedido enviado y en tránsito', completado: false },
        { id: 'entregado', nombre: 'Entregado', descripcion: 'Pedido entregado exitosamente', completado: false }
      ];

      const estadoIndex = estados.findIndex(e => e.id === estado);
      const historial = estados.map((estadoItem, index) => ({
        ...estadoItem,
        completado: index <= estadoIndex,
        fecha: null
      }));

      setHistorialEstados(historial);
    }
  };

  const obtenerIconoEstado = (estado, completado) => {
    if (completado) {
      return <CheckCircleSolid className="w-6 h-6 text-green-600" />;
    }

    switch (estado) {
      case 'pendiente': return <ClockIcon className="w-6 h-6 text-yellow-500" />;
      case 'confirmado': return <CheckCircleIcon className="w-6 h-6 text-blue-500" />;
      case 'en_preparacion': return <CogIcon className="w-6 h-6 text-orange-500" />;
      case 'enviado': return <TruckIcon className="w-6 h-6 text-indigo-500" />;
      case 'entregado': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'cancelado': return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default: return <ExclamationTriangleIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return fecha.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const cambiarEstado = async (nuevoEstado) => {
    try {
      setEstadoActual(nuevoEstado);
      generarHistorialEstados(nuevoEstado);
      if (onActualizarEstado) {
        await onActualizarEstado(pedido.id, nuevoEstado);
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (!pedido) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No se encontró información del pedido</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Encabezado del Pedido */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Pedido {pedido.numero_pedido}
            </h2>
            <p className="text-gray-600 mt-1">
              Realizado el {formatearFecha(new Date(pedido.fecha_creacion))}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatearPrecio(pedido.total)}
            </div>
            <div className="text-sm text-gray-600">
              {pedido.productos.length} productos
            </div>
          </div>
        </div>
      </div>

      {/* Información del Cliente */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Información del Cliente
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="font-medium">Nombre:</span>
              {pedido.usuario.nombre}
            </p>
            <p className="flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4" />
              {pedido.usuario.email}
            </p>
            <p className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              {pedido.usuario.telefono}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            Información de Entrega
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="font-medium">Método:</span>
              {pedido.metodo_entrega.replace('_', ' ')}
            </p>
            {pedido.direccion_entrega && (
              <p className="flex items-center gap-2">
                <span className="font-medium">Dirección:</span>
                {pedido.direccion_entrega}
              </p>
            )}
            {pedido.observaciones && (
              <p className="flex items-center gap-2">
                <span className="font-medium">Observaciones:</span>
                {pedido.observaciones}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Timeline de Estados */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Seguimiento del Pedido</h3>
        <div className="relative">
          {historialEstados.map((estado, index) => (
            <motion.div
              key={estado.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start mb-6"
            >
              {/* Línea conectora */}
              {index < historialEstados.length - 1 && (
                <div className={`absolute left-3 top-8 w-0.5 h-16 ${
                  estado.completado ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}

              {/* Icono del estado */}
              <div className="relative z-10 bg-white p-1 rounded-full">
                {obtenerIconoEstado(estado.id, estado.completado)}
              </div>

              {/* Contenido del estado */}
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${
                    estado.completado ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {estado.nombre}
                  </h4>
                  {estado.fecha && (
                    <span className="text-sm text-gray-500">
                      {formatearFecha(estado.fecha)}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${
                  estado.completado ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {estado.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Productos del Pedido */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Productos del Pedido</h3>
        <div className="space-y-3">
          {pedido.productos.map((producto) => (
            <div key={producto.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{producto.producto_nombre}</h4>
                  <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
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
        
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatearPrecio(pedido.subtotal)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-2">
            <span>Total:</span>
            <span>{formatearPrecio(pedido.total)}</span>
          </div>
        </div>
      </div>

      {/* Acciones de Estado (Solo para administradores) */}
      {estadoActual !== 'entregado' && estadoActual !== 'cancelado' && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Cambiar Estado</h3>
          <div className="flex flex-wrap gap-2">
            {historialEstados
              .filter(estado => !estado.completado && estado.id !== estadoActual)
              .map((estado) => (
                <button
                  key={estado.id}
                  onClick={() => cambiarEstado(estado.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  Marcar como {estado.nombre}
                </button>
              ))}
            
            {estadoActual !== 'cancelado' && (
              <button
                onClick={() => cambiarEstado('cancelado')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>
      )}

      {/* Estado Cancelado */}
      {estadoActual === 'cancelado' && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircleIcon className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Pedido Cancelado</h3>
            </div>
            <p className="text-red-700 mt-1">
              Este pedido ha sido cancelado y no puede ser modificado.
            </p>
          </div>
        </div>
      )}

      {/* Estado Entregado */}
      {estadoActual === 'entregado' && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircleSolid className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Pedido Entregado</h3>
            </div>
            <p className="text-green-700 mt-1">
              ¡El pedido ha sido entregado exitosamente!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeguimientoPedido;
