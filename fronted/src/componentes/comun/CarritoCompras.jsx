// ==========================================
// ARCHIVO: frontend/src/componentes/comun/RealizarPedido.jsx
// ==========================================
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ShoppingBagIcon, 
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useCarrito } from '../../contexto/ContextoCarrito';
import { useAuth } from '../../contexto/ContextoAuth';
import { useNotificacion } from '../../contexto/ContextoNotificacion';
import { servicioPagos } from '../../servicios/servicioPagos';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { useSnackbar } from 'notistack';

// Inicializar Mercado Pago
initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY);

const RealizarPedido = ({ abierto, onCerrar }) => {
  const { carrito, limpiarCarrito, obtenerTotal, actualizarCantidad, eliminarItem } = useCarrito();
  const { usuario } = useAuth();
  const { mostrarNotificacion } = useNotificacion();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Estados del formulario
  const [paso, setPaso] = useState(1); // 1: Datos, 2: Pago, 3: Confirmación
  const [metodoEnvio, setMetodoEnvio] = useState('retiro');
  const [metodoPago, setMetodoPago] = useState('credito');
  const [cargando, setCargando] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [procesandoPago, setProcesandoPago] = useState(false);

  // Datos del pedido
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    rut: usuario?.rut || ''
  });

  const [direccionEnvio, setDireccionEnvio] = useState({
    calle: '',
    numero: '',
    comuna: '',
    ciudad: 'Santiago',
    region: 'Metropolitana',
    codigoPostal: '',
    referencia: ''
  });

  const [notas, setNotas] = useState('');

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const total = obtenerTotal();
  const costoEnvio = metodoEnvio === 'domicilio' ? 5990 : 0;
  const totalFinal = total + costoEnvio;

  const regiones = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
    'Valparaíso', 'Metropolitana', 'O\'Higgins', 'Maule', 'Ñuble', 'Biobío',
    'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
  ];

  const handleInputChange = (seccion, campo, valor) => {
    if (seccion === 'personal') {
      setDatosPersonales(prev => ({ ...prev, [campo]: valor }));
    } else if (seccion === 'direccion') {
      setDireccionEnvio(prev => ({ ...prev, [campo]: valor }));
    }
  };

  const validarPaso1 = () => {
    const { nombre, email, telefono, rut } = datosPersonales;
    
    if (!nombre || !email || !telefono || !rut) {
      mostrarNotificacion('Por favor completa todos los campos personales', 'error');
      return false;
    }

    if (metodoEnvio === 'domicilio') {
      const { calle, numero, comuna, region } = direccionEnvio;
      if (!calle || !numero || !comuna || !region) {
        mostrarNotificacion('Por favor completa todos los campos de dirección', 'error');
        return false;
      }
    }

    return true;
  };

  const handleProcederPago = async () => {
    setLoading(true);
    setError(null);

    try {
      // Crear orden de compra
      const orden_compra = `ORD-${Date.now()}`;
      const session_id = `SESS-${Date.now()}`;
      const return_url = `${window.location.origin}/confirmacion-pago`;

      const response = await api.post('/pagos/webpay/crear', {
        monto: totalFinal,
        orden_compra,
        session_id,
        return_url
      });

      // Redirigir a Webpay
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      setError('Error al procesar el pago. Por favor, intente nuevamente.');
      enqueueSnackbar('Error al procesar el pago', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePagoExitoso = async (paymentId) => {
    try {
      await servicioPagos.procesarPagoExitoso(paymentId, preferenceId);
      mostrarNotificacion('¡Pago realizado con éxito!', 'success');
      limpiarCarrito();
      onCerrar();
    } catch (error) {
      console.error('Error al procesar pago exitoso:', error);
      mostrarNotificacion('Error al procesar el pago. Por favor, contacta a soporte.', 'error');
    }
  };

  const handlePagoFallido = async (error) => {
    try {
      await servicioPagos.procesarPagoFallido(null, preferenceId, error);
      mostrarNotificacion('El pago no pudo ser procesado. Por favor, intenta nuevamente.', 'error');
    } catch (error) {
      console.error('Error al procesar pago fallido:', error);
    }
  };

  const datosBancarios = {
    banco: 'Banco de Chile',
    titular: 'FERREMAS LTDA',
    rut: '96.789.123-4',
    tipoCuenta: 'Cuenta Corriente',
    numeroCuenta: '12345678',
    email: 'pagos@ferremas.cl'
  };

  if (!abierto) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center">
              <ShoppingBagIcon className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold">
                {paso === 1 && 'Datos del Pedido'}
                {paso === 2 && 'Procesar Pago'}
                {paso === 3 && '¡Pedido Confirmado!'}
              </h2>
            </div>
            <button
              onClick={onCerrar}
              className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Indicador de Pasos */}
          <div className="flex justify-center p-4 bg-gray-50 border-b">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((numeroPaso) => (
                <div key={numeroPaso} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      paso >= numeroPaso
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {numeroPaso}
                  </div>
                  {numeroPaso < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-colors ${
                        paso > numeroPaso ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1 overflow-y-auto p-6">
            {paso === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Datos Personales */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Datos Personales
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          value={datosPersonales.nombre}
                          onChange={(e) => handleInputChange('personal', 'nombre', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ej: Juan Pérez"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={datosPersonales.email}
                          onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={datosPersonales.telefono}
                          onChange={(e) => handleInputChange('personal', 'telefono', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RUT *
                        </label>
                        <input
                          type="text"
                          value={datosPersonales.rut}
                          onChange={(e) => handleInputChange('personal', 'rut', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="12.345.678-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Método de Entrega */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <TruckIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Método de Entrega
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          value="retiro"
                          checked={metodoEnvio === 'retiro'}
                          onChange={(e) => setMetodoEnvio(e.target.value)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex items-start">
                          <ShoppingBagIcon className="h-5 w-5 mr-2 text-gray-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Retiro en Tienda</p>
                            <p className="text-sm text-gray-600">Gratis - Disponible en 2 horas</p>
                            <p className="text-xs text-gray-500">Av. Providencia 1234, Santiago</p>
                          </div>
                        </div>
                      </label>
                      <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          value="domicilio"
                          checked={metodoEnvio === 'domicilio'}
                          onChange={(e) => setMetodoEnvio(e.target.value)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex items-start">
                          <TruckIcon className="h-5 w-5 mr-2 text-gray-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Envío a Domicilio</p>
                            <p className="text-sm text-gray-600">{formatearPrecio(5990)} - Entrega en 24-48 hrs</p>
                            <p className="text-xs text-gray-500">Solo en Región Metropolitana</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Dirección de Envío */}
                  {metodoEnvio === 'domicilio' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Dirección de Envío
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Calle *
                            </label>
                            <input
                              type="text"
                              value={direccionEnvio.calle}
                              onChange={(e) => handleInputChange('direccion', 'calle', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Av. Providencia"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Número *
                            </label>
                            <input
                              type="text"
                              value={direccionEnvio.numero}
                              onChange={(e) => handleInputChange('direccion', 'numero', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="1234"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comuna *
                          </label>
                          <input
                            type="text"
                            value={direccionEnvio.comuna}
                            onChange={(e) => handleInputChange('direccion', 'comuna', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Providencia"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Región *
                            </label>
                            <select
                              value={direccionEnvio.region}
                              onChange={(e) => handleInputChange('direccion', 'region', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {regiones.map((region) => (
                                <option key={region} value={region}>
                                  {region}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Código Postal
                            </label>
                            <input
                              type="text"
                              value={direccionEnvio.codigoPostal}
                              onChange={(e) => handleInputChange('direccion', 'codigoPostal', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="7500000"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Referencia
                          </label>
                          <input
                            type="text"
                            value={direccionEnvio.referencia}
                            onChange={(e) => handleInputChange('direccion', 'referencia', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Casa azul, Depto 501, etc."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notas del Pedido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas del Pedido (Opcional)
                    </label>
                    <textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Instrucciones especiales para el pedido..."
                    />
                  </div>
                </div>

                {/* Resumen del Pedido */}
                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                  <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
                  
                  {/* Productos */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {carrito.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 bg-white p-3 rounded-md">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">{item.nombre}</h4>
                          <p className="text-xs text-gray-600">Cant: {item.cantidad}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatearPrecio(item.precio * item.cantidad)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totales */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatearPrecio(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <span>{costoEnvio === 0 ? 'Gratis' : formatearPrecio(costoEnvio)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span className="text-blue-600">{formatearPrecio(totalFinal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Método de Pago
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Opciones de Pago */}
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="credito"
                          checked={metodoPago === 'credito'}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <CreditCardIcon className="h-5 w-5 mr-2 text-gray-600" />
                          <div>
                            <p className="font-medium">Tarjeta de Crédito</p>
                            <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="debito"
                          checked={metodoPago === 'debito'}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <CreditCardIcon className="h-5 w-5 mr-2 text-gray-600" />
                          <div>
                            <p className="font-medium">Tarjeta de Débito</p>
                            <p className="text-sm text-gray-600">RedCompra</p>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="transferencia"
                          checked={metodoPago === 'transferencia'}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <BanknotesIcon className="h-5 w-5 mr-2 text-gray-600" />
                          <div>
                            <p className="font-medium">Transferencia Bancaria</p>
                            <p className="text-sm text-gray-600">Pago inmediato</p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Datos Bancarios para Transferencia */}
                    {metodoPago === 'transferencia' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                          Datos para Transferencia
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Banco:</span>
                            <span>{datosBancarios.banco}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Titular:</span>
                            <span>{datosBancarios.titular}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">RUT:</span>
                            <span>{datosBancarios.rut}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Tipo:</span>
                            <span>{datosBancarios.tipoCuenta}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Cuenta:</span>
                            <span className="font-mono">{datosBancarios.numeroCuenta}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{datosBancarios.email}</span>
                          </div>
                        </div>
                        <p className="text-xs text-yellow-700 mt-3">
                          * Una vez realizada la transferencia, envía el comprobante al email indicado
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Resumen Final */}
                  <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h4 className="font-semibold mb-4">Resumen Final</h4>
                    
                    {/* Datos del Cliente */}
                    <div className="space-y-2 mb-4 text-sm">
                      <h5 className="font-medium text-gray-700">Cliente:</h5>
                      <p>{datosPersonales.nombre}</p>
                      <p>{datosPersonales.email}</p>
                      <p>{datosPersonales.telefono}</p>
                    </div>

                    {/* Dirección de Entrega */}
                    {metodoEnvio === 'domicilio' && (
                      <div className="space-y-2 mb-4 text-sm">
                        <h5 className="font-medium text-gray-700">Envío a:</h5>
                        <p>{direccionEnvio.calle} {direccionEnvio.numero}</p>
                        <p>{direccionEnvio.comuna}, {direccionEnvio.region}</p>
                        {direccionEnvio.referencia && (
                          <p className="text-gray-600">Ref: {direccionEnvio.referencia}</p>
                        )}
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total a Pagar:</span>
                        <span className="text-blue-600">{formatearPrecio(totalFinal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block"
                >
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">¡Pedido Confirmado!</h3>
                <p className="text-gray-600 mb-4">Tu pedido ha sido procesado exitosamente</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 inline-block">
                  <p className="text-sm text-green-800">
                    <strong>Número de Pedido:</strong> {pedido?.numero_pedido || 'Generando...'}
                  </p>
                  <p className="text-sm text-green-800">
                    <strong>Total:</strong> {formatearPrecio(totalFinal)}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Recibirás un email de confirmación en {datosPersonales.email}
                </p>
              </div>
            )}
          </div>

          {/* Footer con Botones */}
          {paso < 3 && (
            <div className="flex justify-between items-center p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={onCerrar}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              
              <div className="flex space-x-4">
                {paso === 2 && (
                  <button
                    onClick={() => setPaso(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Volver
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (paso === 1) {
                      if (validarPaso1()) {
                        setPaso(2);
                      }
                    } else if (paso === 2) {
                      handleProcederPago();
                    }
                  }}
                  disabled={loading}
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      {paso === 1 && 'Continuar al Pago'}
                      {paso === 2 && 'Realizar Pago'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RealizarPedido;