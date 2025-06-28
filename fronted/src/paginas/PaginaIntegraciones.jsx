import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon, 
  CurrencyDollarIcon,
  CreditCardIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import BancoCentral from '../componentes/integraciones/BancoCentral';

const PaginaIntegraciones = () => {
  const [moduloActivo, setModuloActivo] = useState('banco-central');

  const modulos = [
    {
      id: 'banco-central',
      nombre: 'Banco Central',
      descripcion: 'Tipos de cambio y conversor de monedas',
      icono: CurrencyDollarIcon,
      color: 'blue'
    },
    {
      id: 'mercadopago',
      nombre: 'MercadoPago',
      descripcion: 'Configuración de pagos online',
      icono: CreditCardIcon,
      color: 'green'
    },
    {
      id: 'reportes',
      nombre: 'Reportes Externos',
      descripcion: 'Integración con servicios de reportes',
      icono: ChartBarIcon,
      color: 'purple'
    },
    {
      id: 'api-keys',
      nombre: 'Configuración API',
      descripcion: 'Gestión de claves API y webhooks',
      icono: GlobeAltIcon,
      color: 'orange'
    }
  ];

  const renderModulo = () => {
    switch (moduloActivo) {
      case 'banco-central':
        return <BancoCentral />;
      case 'mercadopago':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-center py-12">
              <CreditCardIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                MercadoPago
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Configuración de pagos online en desarrollo
              </p>
            </div>
          </div>
        );
      case 'reportes':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-center py-12">
              <ChartBarIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Reportes Externos
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Integración con servicios de reportes en desarrollo
              </p>
            </div>
          </div>
        );
      case 'api-keys':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-center py-12">
              <GlobeAltIcon className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Configuración API
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Gestión de claves API y webhooks en desarrollo
              </p>
            </div>
          </div>
        );
      default:
        return <BancoCentral />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Integraciones Externas
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Conecta con APIs externas, servicios de pago y otros sistemas
        </p>
      </div>

      {/* Navegación de módulos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modulos.map((modulo) => {
          const IconComponent = modulo.icono;
          const isActive = moduloActivo === modulo.id;
          
          return (
            <button
              key={modulo.id}
              onClick={() => setModuloActivo(modulo.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isActive
                  ? `border-${modulo.color}-500 bg-${modulo.color}-50 dark:bg-${modulo.color}-900/20`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <IconComponent 
                  className={`w-8 h-8 mx-auto mb-2 ${
                    isActive ? `text-${modulo.color}-600` : 'text-gray-400'
                  }`} 
                />
                <h3 className={`font-medium text-sm ${
                  isActive ? `text-${modulo.color}-700 dark:text-${modulo.color}-300` : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {modulo.nombre}
                </h3>
                <p className={`text-xs mt-1 ${
                  isActive ? `text-${modulo.color}-600 dark:text-${modulo.color}-400` : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {modulo.descripcion}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenido del módulo activo */}
      <div className="mt-6">
        {renderModulo()}
      </div>
    </motion.div>
  );
};

export default PaginaIntegraciones;