import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPinIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  TruckIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useCarrito } from '../contexto/ContextoCarrito';
import { useAuth } from '../contexto/ContextoAuth';
import { servicioPagos } from '../servicios/servicioPagos';

const DATOS_BANCARIOS = {
  banco: 'Banco de Prueba',
  titular: 'Ferremas SpA',
  rut: '76.123.456-7',
  tipoCuenta: 'Cuenta Corriente',
  numeroCuenta: '123456789',
  email: 'pagos@ferremas.cl',
};

const ConfirmacionPago = () => {
  const navigate = useNavigate();
  const { carrito, limpiarCarrito } = useCarrito();
  const { usuario } = useAuth();

  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    direccion: '',
    ciudad: 'Santiago',
    comuna: '',
    codigoPostal: ''
  });
  const [metodoEntrega, setMetodoEntrega] = useState('retiro');
  const [metodoPago, setMetodoPago] = useState('webpay');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  // Calcular totales
  const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const iva = subtotal * 0.19;
  const costoDespacho = metodoEntrega === 'despacho' ? 5000 : 0;
  const total = subtotal + iva + costoDespacho;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    if (metodoPago === 'webpay') {
      try {
        // Crear transacción con Transbank
        const transaccionData = {
          monto: Math.round(total),
          ordenCompra: `ORD-${Date.now()}`,
          sessionId: `session-${Date.now()}`,
          returnUrl: `${window.location.origin}/pago-exitoso`,
          items: carrito.map(item => ({
            id: item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio
          })),
          cliente: {
            id: usuario?.id,
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            direccion: formData.direccion,
            ciudad: formData.ciudad,
            comuna: formData.comuna
          },
          metodoEntrega,
          metodoPago
        };
        
        console.log('🔄 Enviando datos de transacción:', transaccionData);
        
        const response = await servicioPagos.crearTransaccionTransbank(transaccionData);
        
        console.log('📬 Respuesta de Transbank:', response);
        
        if (response.success && response.message && response.message.url && response.message.token) {
          // Redirección segura a Webpay usando formulario POST
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = response.message.url;

          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'token_ws';
          input.value = response.message.token;
          form.appendChild(input);

          document.body.appendChild(form);
          form.submit();
        } else {
          console.error('❌ Respuesta inválida de Transbank:', response);
          setError(`Error al procesar el pago: ${response.message || 'Respuesta inválida del servidor'}`);
        }
      } catch (error) {
        console.error('❌ Error al crear transacción:', error);
        setError(`Error al procesar el pago: ${error.message || 'Error de conexión'}`);
      } finally {
        setCargando(false);
      }
    } else {
      // Simular registro de pedido para transferencia o efectivo
      setTimeout(() => {
        setExito(true);
        limpiarCarrito();
        setCargando(false);
      }, 1200);
    }
  };

  if (carrito.length === 0 && !exito) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carrito Vacío</h2>
          <p className="text-gray-600 mb-4">No hay productos en tu carrito para procesar el pago.</p>
          <button
            onClick={() => navigate('/catalogo')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al Catálogo
          </button>
        </div>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
          <CheckIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">¡Pedido registrado!</h2>
          <p className="text-gray-700 mb-4">
            Tu pedido ha sido registrado correctamente.<br />
            {metodoPago === 'transferencia' && (
              <>Por favor realiza la transferencia a la cuenta indicada y envía el comprobante a <b>{DATOS_BANCARIOS.email}</b>.</>
            )}
            {metodoPago === 'efectivo' && (
              <>Recuerda que debes pagar en efectivo al momento de retirar tu pedido en tienda.</>
            )}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Confirmar Pedido</h1>
                <p className="text-blue-100">Revisa los detalles antes de proceder al pago</p>
              </div>
              <CreditCardIcon className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Formulario de Dirección */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                Información de Entrega
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Método de entrega */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Entrega *</label>
                  <select
                    name="metodoEntrega"
                    value={metodoEntrega}
                    onChange={e => {
                      setMetodoEntrega(e.target.value);
                      if (e.target.value === 'retiro' && metodoPago === 'efectivo') setMetodoPago('efectivo');
                      if (e.target.value === 'retiro' && metodoPago === 'webpay') setMetodoPago('webpay');
                      if (e.target.value === 'despacho' && metodoPago === 'efectivo') setMetodoPago('webpay');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="retiro">Retiro en tienda (sin costo)</option>
                    <option value="despacho">Despacho a domicilio (+$5.000)</option>
                  </select>
                </div>
                {/* Método de pago */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago *</label>
                  <select
                    name="metodoPago"
                    value={metodoPago}
                    onChange={e => setMetodoPago(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="webpay">Webpay (Tarjeta)</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                    {metodoEntrega === 'retiro' && <option value="efectivo">Efectivo (solo retiro en tienda)</option>}
                  </select>
                </div>
                {/* Datos bancarios si corresponde */}
                {metodoPago === 'transferencia' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-2">
                    <h4 className="font-semibold text-yellow-800 mb-2">Datos para Transferencia</h4>
                    <div className="text-sm text-yellow-900">
                      <div><b>Banco:</b> {DATOS_BANCARIOS.banco}</div>
                      <div><b>Titular:</b> {DATOS_BANCARIOS.titular}</div>
                      <div><b>RUT:</b> {DATOS_BANCARIOS.rut}</div>
                      <div><b>Tipo de Cuenta:</b> {DATOS_BANCARIOS.tipoCuenta}</div>
                      <div><b>N° Cuenta:</b> {DATOS_BANCARIOS.numeroCuenta}</div>
                      <div><b>Email:</b> {DATOS_BANCARIOS.email}</div>
                    </div>
                    <p className="text-xs text-yellow-700 mt-2">* Envía el comprobante a {DATOS_BANCARIOS.email}</p>
                  </div>
                )}
                {/* Formulario de dirección */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required={metodoEntrega === 'despacho'}
                    placeholder="Calle, número, departamento"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comuna *</label>
                    <input
                      type="text"
                      name="comuna"
                      value={formData.comuna}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      {metodoPago === 'webpay' && <CreditCardIcon className="h-5 w-5 mr-2" />}
                      {metodoPago === 'transferencia' && <TruckIcon className="h-5 w-5 mr-2" />}
                      {metodoPago === 'efectivo' && <CheckIcon className="h-5 w-5 mr-2" />}
                      {metodoPago === 'webpay' && 'Pagar con Webpay'}
                      {metodoPago === 'transferencia' && 'Registrar pedido y mostrar datos bancarios'}
                      {metodoPago === 'efectivo' && 'Registrar pedido para pago en tienda'}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Resumen del Pedido */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingCartIcon className="h-5 w-5 mr-2 text-blue-600" />
                Resumen del Pedido
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-3">
                  {carrito.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.imagen || '/assets/imagenes/productos/placeholder.jpg'}
                          alt={item.nombre}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.nombre}</p>
                          <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Totales */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (19%):</span>
                    <span>${iva.toLocaleString('es-CL')}</span>
                  </div>
                  {metodoEntrega === 'despacho' && (
                    <div className="flex justify-between text-gray-600">
                      <span>Despacho:</span>
                      <span>${costoDespacho.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span>${total.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Información adicional */}
              <div className="mt-4 space-y-3">
                {metodoEntrega === 'despacho' && (
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <TruckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Despacho a domicilio</p>
                      <p className="text-xs text-blue-700">Costo fijo $5.000 en RM</p>
                    </div>
                  </div>
                )}
                {metodoEntrega === 'retiro' && (
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Retiro en tienda</p>
                      <p className="text-xs text-green-700">Sin costo adicional</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CreditCardIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Pago Seguro</p>
                    <p className="text-xs text-green-700">Transbank Webpay Plus, Transferencia o Efectivo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmacionPago; 