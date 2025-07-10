import React, { useEffect, useState } from 'react';
import { servicioAuth } from '../servicios/servicioAuth';
import { servicioClientes } from '../servicios/servicioClientes';
import { motion } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const PaginaCompras = () => {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [detalleCompra, setDetalleCompra] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const cargarCompras = async () => {
      setCargando(true);
      setError(null);
      try {
        // Obtener perfil del usuario autenticado
        const perfil = await servicioAuth.obtenerPerfil();
        if (!perfil || !perfil.data || !perfil.data.id) {
          setError('No se pudo obtener el usuario autenticado.');
          setCargando(false);
          return;
        }
        setUsuario(perfil.data);
        // Obtener historial de compras del cliente
        const historial = await servicioClientes.obtenerHistorial(perfil.data.id);
        setCompras(historial.data || historial || []);
        console.log('COMPRAS:', historial.data || historial || []);
      } catch (err) {
        setError('Error al cargar compras: ' + (err.message || err));
      } finally {
        setCargando(false);
      }
    };
    cargarCompras();
  }, []);

  useEffect(() => {
    if (detalleCompra) {
      console.log('DETALLE COMPRA:', detalleCompra);
    }
  }, [detalleCompra]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <ShoppingCartIcon className="w-10 h-10 text-blue-600 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Compras</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Aquí puedes ver el historial de tus compras realizadas</p>
      </div>

      {cargando && (
        <div className="text-center text-gray-500">Cargando compras...</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center mb-4">{error}</div>
      )}
      {!cargando && !error && compras.length === 0 && (
        <div className="text-center text-gray-500">No tienes compras registradas.</div>
      )}
      {!cargando && !error && compras.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left"># Pedido</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{compra.id || compra.pedido_id}</td>
                  <td className="px-4 py-2">{compra.fecha_compra ? new Date(compra.fecha_compra).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2">{compra.monto_total ? `$${Number(compra.monto_total).toLocaleString('es-CL')}` : '-'}</td>
                  <td className="px-4 py-2">{compra.metodo_pago || '-'}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => { setDetalleCompra(compra); setModalAbierto(true); }}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalle de compra */}
      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-auto p-6 z-50">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setModalAbierto(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
            <Dialog.Title className="text-xl font-bold mb-2">Detalle de Compra</Dialog.Title>
            {detalleCompra ? (
                <div>
                  <div className="mb-2"><b>N° Pedido:</b> {detalleCompra.id || detalleCompra.pedido_id || detalleCompra.numero_pedido || '-'}</div>
                  <div className="mb-2"><b>Fecha:</b> {detalleCompra.fecha_compra ? new Date(detalleCompra.fecha_compra).toLocaleDateString() : (detalleCompra.fecha ? new Date(detalleCompra.fecha).toLocaleDateString() : '-')}</div>
                  <div className="mb-2"><b>Total:</b> ${detalleCompra.monto_total ? Number(detalleCompra.monto_total).toLocaleString('es-CL') : (detalleCompra.total ? Number(detalleCompra.total).toLocaleString('es-CL') : '-')}</div>
                  <div className="mb-2"><b>Estado:</b> {detalleCompra.estado || detalleCompra.status || '-'}</div>
                  <div className="mb-2"><b>Productos:</b></div>
                  {detalleCompra.productos && detalleCompra.productos.length > 0 ? (
                    <ul className="list-disc ml-6">
                      {detalleCompra.productos.map((prod, idx) => (
                        <li key={idx}>
                          {prod.nombre} x{prod.cantidad} - ${prod.precio_unitario ? prod.precio_unitario.toLocaleString('es-CL') : '-'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">No hay productos registrados.</div>
                  )}
                </div>
            ) : (
              <div className="text-gray-500">No hay información de la compra.</div>
            )}
          </div>
        </div>
      </Dialog>
    </motion.div>
  );
};

export default PaginaCompras; 