import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ListaInventario from '../componentes/inventario/ListaInventario';
import ListaProductosCompletos from '../componentes/inventario/ListaProductosCompletos';

const PaginaInventario = () => {
  const [vistaActiva, setVistaActiva] = useState('completa'); // 'completa' o 'movimientos'

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
        
        {/* Selector de vista */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => setVistaActiva('completa')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              vistaActiva === 'completa'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📦 Todos los Productos
          </button>
          <button
            onClick={() => setVistaActiva('movimientos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              vistaActiva === 'movimientos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📊 Movimientos de Stock
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {vistaActiva === 'completa' ? (
          <ListaProductosCompletos />
        ) : (
          <ListaInventario />
        )}
      </div>
    </motion.div>
  );
};

export default PaginaInventario;