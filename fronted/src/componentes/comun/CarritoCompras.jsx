// ==========================================
// ARCHIVO: frontend/src/componentes/comun/CarritoCompras.jsx
// ==========================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ShoppingBagIcon, 
  PlusIcon, 
  MinusIcon,
  TrashIcon,
  CreditCardIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useCarrito } from '../../contexto/ContextoCarrito';

const CarritoCompras = ({ abierto, onCerrar }) => {
  const { 
    carrito, 
    eliminarDelCarrito, 
    actualizarCantidad, 
    limpiarCarrito, 
    obtenerTotal,
    obtenerCantidadTotal 
  } = useCarrito();

  const [metodoEnvio, setMetodoEnvio] = useState('retiro');
  const [metodoPago, setMetodoPago] = useState('credito');

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const total = obtenerTotal();
  const cantidadTotal = obtenerCantidadTotal();
  const costoEnvio = metodoEnvio === 'domicilio' ? 5990 : 0;
  const totalFinal = total + costoEnvio;

  const handleProcederPago = () => {
    // Aquí iría la lógica de procesamiento de pago
    alert('Procesando pago... (Funcionalidad en desarrollo)');
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
            onClick={onCerrar}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Panel del carrito */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">
                  Mi Carrito ({cantidadTotal})
                </h2>
              </div>
              <button
                onClick={onCerrar}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto">
              {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBagIcon className="h-16 w-16 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
                  <p className="text-sm text-center">
                    Agrega algunos productos para comenzar tu compra
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Items del carrito */}
                  {carrito.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex gap-3">
                        {/* Imagen del producto */}
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.nombre}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.marca}
                          </p>
                          <p className="text-sm font-medium text-blue-600">
                            {formatearPrecio(item.precio)}
                          </p>
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-sm font-medium">
                          {formatearPrecio(item.precio * item.cantidad)}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Opciones de envío */}
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Método de Entrega
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="retiro"
                          checked={metodoEnvio === 'retiro'}
                          onChange={(e) => setMetodoEnvio(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <ShoppingBagIcon className="h-5 w-5 mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">Retiro en tienda</p>
                            <p className="text-xs text-gray-600">Gratis</p>
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="domicilio"
                          checked={metodoEnvio === 'domicilio'}
                          onChange={(e) => setMetodoEnvio(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <TruckIcon className="h-5 w-5 mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">Envío a domicilio</p>
                            <p className="text-xs text-gray-600">{formatearPrecio(5990)}</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Opciones de pago */}
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Método de Pago
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="credito"
                          checked={metodoPago === 'credito'}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <CreditCardIcon className="h-5 w-5 mr-2 text-gray-600" />
                          <span className="text-sm">Tarjeta de Crédito</span>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="debito"
                          checked={metodoPago === 'debito'}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <CreditCardIcon className="h-5 w-5 mr-2 text-gray-600" />
                          <span className="text-sm">Tarjeta de Débito</span>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="transferencia"
                          checked={metodoPago === 'transferencia'}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <span className="h-5 w-5 mr-2 text-gray-600 text-xs">🏦</span>
                          <span className="text-sm">Transferencia Bancaria</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer con totales y botón de pago */}
            {carrito.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Resumen de totales */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatearPrecio(total)}</span>
                  </div>
                  {costoEnvio > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <span>{formatearPrecio(costoEnvio)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>{formatearPrecio(totalFinal)}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-2">
                  <button
                    onClick={handleProcederPago}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Proceder al Pago
                  </button>
                  <button
                    onClick={limpiarCarrito}
                    className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Vaciar Carrito
                  </button>
                </div>

                {/* Información adicional */}
                <div className="text-xs text-gray-600 text-center">
                  <p>🔒 Compra segura con encriptación SSL</p>
                  <p>📞 ¿Necesitas ayuda? Llama al (56) 2 2XXX XXXX</p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CarritoCompras;