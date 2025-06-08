// ==========================================
// ARCHIVO: frontend/src/componentes/comun/EncabezadoAdmin.jsx
// ==========================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexto/ContextoAuth';
import { useNotificacion } from '../../contexto/ContextoNotificacion';
import { useTema } from '../../contexto/ContextoTema';

const EncabezadoAdmin = () => {
  const { usuario, cerrarSesion } = useAuth();
  const { mostrarNotificacion } = useNotificacion();
  const { tema, alternarTema } = useTema();
  const navigate = useNavigate();
  
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);

  const handleCerrarSesion = () => {
    cerrarSesion();
    mostrarNotificacion('Sesión cerrada exitosamente', 'success');
    navigate('/');
  };

  const notificaciones = [
    { id: 1, tipo: 'warning', mensaje: 'Stock bajo en Cemento Portland', tiempo: '5 min' },
    { id: 2, tipo: 'info', mensaje: 'Nuevo pedido recibido #1250', tiempo: '10 min' },
    { id: 3, tipo: 'success', mensaje: 'Pago confirmado - Factura #789', tiempo: '15 min' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HomeIcon className="h-4 w-4" />
            <span>/</span>
            <span className="text-gray-900 font-medium">Panel de Control</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={alternarTema}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cambiar tema"
            >
              {tema === 'oscuro' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setNotificacionesAbiertas(!notificacionesAbiertas)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                {notificaciones.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificaciones.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificacionesAbiertas && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notificaciones.map((notif) => (
                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                          <p className="text-sm text-gray-800">{notif.mensaje}</p>
                          <p className="text-xs text-gray-500 mt-1">Hace {notif.tiempo}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {usuario?.nombre?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {usuario?.nombre || 'Administrador'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {usuario?.rol || 'Admin'} • Online
                  </p>
                </div>
              </button>

              <AnimatePresence>
                {menuUsuarioAbierto && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {usuario?.email || 'admin@ferremas.cl'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Sucursal: {usuario?.sucursal || 'Santiago Centro'}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/');
                          setMenuUsuarioAbierto(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <HomeIcon className="h-4 w-4 mr-3" />
                        Ver Tienda
                      </button>
                      
                      <button
                        onClick={() => setMenuUsuarioAbierto(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserIcon className="h-4 w-4 mr-3" />
                        Mi Perfil
                      </button>
                      
                      <button
                        onClick={() => setMenuUsuarioAbierto(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Cog6ToothIcon className="h-4 w-4 mr-3" />
                        Configuración
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleCerrarSesion}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EncabezadoAdmin;