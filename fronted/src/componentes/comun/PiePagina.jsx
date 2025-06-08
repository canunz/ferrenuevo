// ==========================================
// ARCHIVO: frontend/src/componentes/comun/PiePagina.jsx
// ==========================================
import React from 'react';

const PiePagina = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 FERREMAS. Todos los derechos reservados.
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Versión 1.0.0 - Sistema de Gestión Comercial
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PiePagina;