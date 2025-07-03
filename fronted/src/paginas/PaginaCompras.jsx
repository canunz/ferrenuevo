import React, { useEffect, useState } from 'react';
import { servicioAuth } from '../servicios/servicioAuth';
import { servicioClientes } from '../servicios/servicioClientes';
import { motion } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const PaginaCompras = () => {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);

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
      } catch (err) {
        setError('Error al cargar compras: ' + (err.message || err));
      } finally {
        setCargando(false);
      }
    };
    cargarCompras();
  }, []);

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
                  <td className="px-4 py-2">{compra.id}</td>
                  <td className="px-4 py-2">{compra.fecha ? new Date(compra.fecha).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2">${compra.total ? compra.total.toLocaleString('es-CL') : '-'}</td>
                  <td className="px-4 py-2">{compra.estado || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default PaginaCompras; 