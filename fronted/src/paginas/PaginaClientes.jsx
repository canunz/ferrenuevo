import React from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline';
import ListaClientes from '../componentes/clientes/ListaClientes';

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
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <ListaClientes />
      </div>
    </motion.div>
  );
};

export default PaginaClientes;