import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useCarrito } from '../../contexto/ContextoCarrito';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const CarritoLateral = ({ abierto, onCerrar }) => {
  const navigate = useNavigate();
  const { carrito, actualizarCantidad, eliminarItem, limpiarCarrito, obtenerTotal } = useCarrito();
  const { mostrarNotificacion } = useNotificacion();

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const calcularSubtotal = () => obtenerTotal();
  const calcularIVA = () => calcularSubtotal() * 0.19;
  const calcularTotal = () => calcularSubtotal() + calcularIVA();

  const handleCantidadChange = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    actualizarCantidad(id, nuevaCantidad);
  };

  const handleEliminar = (id) => {
    eliminarItem(id);
    mostrarNotificacion('Producto eliminado del carrito', 'success');
  };

  const handleProcederPago = () => {
    if (carrito.length === 0) {
      mostrarNotificacion('El carrito está vacío', 'error');
      return;
    }
    onCerrar();
    navigate('/confirmacion-pago');
  };

  const handleVaciarCarrito = () => {
    limpiarCarrito();
    mostrarNotificacion('Carrito vaciado', 'success');
  };

  return (
    <AnimatePresence>
      {abierto && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onCerrar}
          />

          {/* Carrito lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header del carrito */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <ShoppingCartIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Carrito de Compras</h2>
                {carrito.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {carrito.length}
                  </span>
                )}
              </div>
              <button
                onClick={onCerrar}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto">
              {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingCartIcon className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-500 mb-6">Agrega productos para comenzar a comprar</p>
                  <button
                    onClick={() => {
                      onCerrar();
                      navigate('/catalogo');
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Productos
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {carrito.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.imagen || '/assets/imagenes/productos/placeholder.jpg'}
                        alt={item.nombre}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.nombre}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatearPrecio(item.precio)}
                        </p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="mx-2 text-sm font-medium w-8 text-center">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatearPrecio(item.precio * item.cantidad)}
                        </p>
                        <button
                          onClick={() => handleEliminar(item.id)}
                          className="mt-1 p-1 text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con resumen y botones */}
            {carrito.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Resumen */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatearPrecio(calcularSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (19%):</span>
                    <span className="font-medium">{formatearPrecio(calcularIVA())}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatearPrecio(calcularTotal())}</span>
                  </div>
                </div>

                {/* Botones */}
                <div className="space-y-2">
                  <button
                    onClick={handleProcederPago}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Proceder al Pago
                  </button>
                  <button
                    onClick={handleVaciarCarrito}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CarritoLateral; 