import React from 'react';
import { motion } from 'framer-motion';
import GestorPromociones from '../componentes/descuentos/GestorPromociones';

const PaginaDescuentos = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Promociones y Descuentos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Asigna promociones a productos o categorías y gestiona los descuentos.
        </p>
      </div>

      <GestorPromociones />
      
    </motion.div>
  );
};

export default PaginaDescuentos;
