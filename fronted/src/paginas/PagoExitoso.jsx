import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon,
  HomeIcon,
  ShoppingBagIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const PagoExitoso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token_ws');
    if (token) {
      fetch('/api/v1/transbank/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_ws: token })
      })
        .then(res => res.json())
        .then(data => setDetalle(data.message || data))
        .catch(() => setDetalle({ error: 'No se pudo obtener el detalle del pago' }));
    }
  }, [location.search]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!detalle) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (detalle.error) return <div className="min-h-screen flex items-center justify-center text-red-600">{detalle.error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icono de éxito */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600 mb-8">
            Tu pedido ha sido procesado correctamente
          </p>

          {/* Detalles del pago */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-700">Orden de Compra:</span>
              </div>
              <span className="font-medium text-gray-900">{detalle.orden_compra || detalle.ordenCompra || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-gray-700">Monto Total:</span>
              </div>
              <span className="font-bold text-green-600">
                {detalle.monto ? formatearPrecio(detalle.monto) : 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-gray-700">Fecha:</span>
              </div>
              <span className="font-medium text-gray-900">
                {detalle.fecha ? formatearFecha(detalle.fecha) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Mensaje adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800 text-sm">
              Hemos enviado un correo de confirmación con los detalles de tu pedido. 
              Te contactaremos pronto para coordinar la entrega.
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Volver al Inicio
            </button>
            
            <button
              onClick={() => navigate('/productos')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Seguir Comprando
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PagoExitoso; 