import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GestorPromociones from '../componentes/descuentos/GestorPromociones';
import FormularioCupon from '../componentes/descuentos/FormularioCupon';
import { useNavigate } from 'react-router-dom';

const ModalCupones = ({ abierto, onCerrar, children }) => {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onCerrar}
        >
          ×
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const PaginaDescuentos = () => {
  const [mostrarCupones, setMostrarCupones] = useState(false);
  const navigate = useNavigate();
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
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={() => navigate('/cupones')}
        >
          Ver cupones
        </button>
      </div>

      <GestorPromociones />
      <ModalCupones abierto={mostrarCupones} onCerrar={() => setMostrarCupones(false)}>
        <FormularioCupon />
      </ModalCupones>
    </motion.div>
  );
};

export default PaginaDescuentos;
