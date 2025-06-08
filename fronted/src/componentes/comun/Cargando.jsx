import React from 'react';
import { motion } from 'framer-motion';

const Cargando = ({ mensaje = 'Cargando...', tamaño = 'md', centrado = true }) => {
  const tamaños = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const contenedor = centrado 
    ? 'flex flex-col items-center justify-center min-h-64 space-y-4'
    : 'flex items-center space-x-3';

  return (
    <div className={contenedor}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${tamaños[tamaño]} border-4 border-blue-200 border-t-blue-600 rounded-full`}
      />
      {mensaje && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400 text-sm font-medium"
        >
          {mensaje}
        </motion.p>
      )}
    </div>
  );
};

export default Cargando;