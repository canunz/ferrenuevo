import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { servicioPagos } from '../servicios/servicioPagos';

const PaginaPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [aprobando, setAprobando] = useState(null);

  // Mover cargarPagos aquí
  const cargarPagos = async () => {
    setCargando(true);
    setError(null);
    try {
      // Cambiar listarSinToken por listar (autenticado)
      const res = await servicioPagos.listar({ estado: 'pendiente' });
      setPagos(res.data || res);
    } catch (err) {
      setError('Error al cargar pagos: ' + (err.message || err));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  const aprobarPago = async (pagoId) => {
    setAprobando(pagoId);
    try {
      await servicioPagos.aprobar(pagoId);
      await cargarPagos();
    } catch (err) {
      alert('Error al aprobar pago: ' + (err.message || ''));
    }
    setAprobando(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Pagos Pendientes (Efectivo)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra pagos en efectivo pendientes de aprobación
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {cargando ? (
          <div className="text-center py-8">Cargando pagos...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : pagos.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No hay pagos pendientes.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">ID</th>
                <th className="px-2 py-1">Pedido</th>
                <th className="px-2 py-1">Monto</th>
                <th className="px-2 py-1">Método</th>
                <th className="px-2 py-1">Estado</th>
                <th className="px-2 py-1">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id} className="border-b">
                  <td className="px-2 py-1">{pago.id}</td>
                  <td className="px-2 py-1">{pago.pedido_id}</td>
                  <td className="px-2 py-1">${pago.monto}</td>
                  <td className="px-2 py-1">{pago.metodo_pago?.nombre || '-'}</td>
                  <td className="px-2 py-1">{pago.estado}</td>
                  <td className="px-2 py-1">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                      onClick={() => aprobarPago(pago.id)}
                      disabled={aprobando === pago.id}
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      {aprobando === pago.id ? 'Aprobando...' : 'Aprobar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default PaginaPagos;