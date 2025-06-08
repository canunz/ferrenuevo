import React from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

const PaginaClientes = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tu base de clientes
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Módulo de Gestión de Clientes en desarrollo
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PaginaClientes;