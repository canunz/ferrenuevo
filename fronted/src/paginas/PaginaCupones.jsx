import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioCupon from '../componentes/descuentos/FormularioCupon';

const PaginaCupones = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto py-8">
      <button
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Gestión de Cupones</h2>
      <FormularioCupon />
    </div>
  );
};

export default PaginaCupones; 