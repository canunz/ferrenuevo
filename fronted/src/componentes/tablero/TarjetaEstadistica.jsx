// ==========================================
// ARCHIVO: frontend/src/componentes/tablero/TarjetaEstadistica.jsx
// ==========================================
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const TarjetaEstadistica = ({
  titulo,
  valor,
  formato = 'numero',
  cambio,
  icono: Icono,
  color = 'blue',
  descripcion,
  loading = false,
  onClick
}) => {
  const formatearValor = (val, fmt) => {
    if (loading) return '...';
    
    switch (fmt) {
      case 'moneda':
        return new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
        }).format(val);
      case 'numero':
        return new Intl.NumberFormat('es-CL').format(val);
      case 'porcentaje':
        return `${val}%`;
      default:
        return val?.toString() || '0';
    }
  };

  const obtenerColorClase = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-700';
      case 'green':
        return 'bg-green-50 text-green-700';
      case 'red':
        return 'bg-red-50 text-red-700';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-700';
      case 'purple':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const obtenerColorIcono = (color) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      case 'red':
        return 'text-red-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'purple':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg border p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-500">{titulo}</h3>
            {descripcion && (
              <InformationCircleIcon 
                className="h-4 w-4 text-gray-400 cursor-help" 
                title={descripcion}
              />
            )}
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatearValor(valor, formato)}
          </p>
          {cambio !== undefined && (
            <div className="mt-2 flex items-center">
              {cambio >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span className={`ml-1 text-sm font-medium ${
                cambio >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(cambio)}%
              </span>
              <span className="ml-1 text-sm text-gray-500">vs mes anterior</span>
            </div>
          )}
        </div>
        {Icono && (
          <div className={`p-2 rounded-lg ${obtenerColorClase(color)}`}>
            <Icono className={`h-6 w-6 ${obtenerColorIcono(color)}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TarjetaEstadistica;