import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ContextoNotificacion = createContext();

export const useNotificacion = () => {
  const context = useContext(ContextoNotificacion);
  if (!context) {
    throw new Error('useNotificacion debe ser usado dentro de NotificacionProvider');
  }
  return context;
};

export const NotificacionProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  const mostrarNotificacion = (mensaje, tipo = 'info', duracion = 5000) => {
    const id = Date.now();
    const nuevaNotificacion = {
      id,
      mensaje,
      tipo,
      duracion
    };

    setNotificaciones(prev => [...prev, nuevaNotificacion]);

    // Auto remover después de la duración especificada
    setTimeout(() => {
      removerNotificacion(id);
    }, duracion);

    return id;
  };

  const removerNotificacion = (id) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
  };

  const iconos = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  };

  const colores = {
    success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
  };

  const valor = {
    mostrarNotificacion,
    removerNotificacion,
    exito: (mensaje, duracion) => mostrarNotificacion(mensaje, 'success', duracion),
    error: (mensaje, duracion) => mostrarNotificacion(mensaje, 'error', duracion),
    advertencia: (mensaje, duracion) => mostrarNotificacion(mensaje, 'warning', duracion),
    info: (mensaje, duracion) => mostrarNotificacion(mensaje, 'info', duracion)
  };

  return (
    <ContextoNotificacion.Provider value={valor}>
      {children}
      
      {/* Contenedor de Notificaciones */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notificaciones.map((notificacion) => {
            const Icono = iconos[notificacion.tipo];
            
            return (
              <motion.div
                key={notificacion.id}
                initial={{ opacity: 0, x: 300, scale: 0.3 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
                className={`max-w-sm w-full shadow-lg rounded-lg border p-4 ${colores[notificacion.tipo]}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icono className="w-5 h-5" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">
                      {notificacion.mensaje}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => removerNotificacion(notificacion.id)}
                      className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ContextoNotificacion.Provider>
  );
};