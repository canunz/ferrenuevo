import React from 'react';
import { motion } from 'framer-motion';
import { CreditCardIcon } from '@heroicons/react/24/outline';

const PaginaPagos = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Pagos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra pagos y transacciones financieras
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Módulo de Gestión de Pagos en desarrollo
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PaginaPagos;