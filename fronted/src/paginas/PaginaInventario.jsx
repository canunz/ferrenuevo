import React from 'react';
import { motion } from 'framer-motion';
import ListaInventario from '../componentes/inventario/ListaInventario';

const PaginaInventario = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="pt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Control de Inventario
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3">
          Monitorea el stock y movimientos de inventario
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <ListaInventario />
      </div>
    </motion.div>
  );
};

export default PaginaInventario;