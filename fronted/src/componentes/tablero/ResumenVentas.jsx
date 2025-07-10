import React from 'react';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';

const ResumenVentas = ({ ventas = [] }) => {
  const totalVentas = ventas.reduce((sum, venta) => sum + venta.monto, 0);
  const promedioVentas = ventas.length > 0 ? totalVentas / ventas.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CurrencyDollarIcon className="w-5 h-5" />
          Resumen de Ventas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Análisis de las ventas recientes
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP'
              }).format(totalVentas)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Ventas</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP'
              }).format(promedioVentas)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Venta</p>
          </div>
        </div>
        
        {ventas.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Últimas Transacciones
            </h4>
            <div className="space-y-2">
              {ventas.slice(0, 5).map((venta, index) => (
                <motion.div
                  key={venta.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {venta.cliente}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {venta.fecha}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP'
                      }).format(venta.monto)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumenVentas;
