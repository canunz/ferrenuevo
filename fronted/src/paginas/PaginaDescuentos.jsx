import React from 'react';
import { motion } from 'framer-motion';
import { TicketIcon } from '@heroicons/react/24/outline';

const PaginaDescuentos = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Descuentos y Promociones
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona descuentos, cupones y promociones especiales
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <TicketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Módulo de Descuentos y Promociones en desarrollo
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PaginaDescuentos;
