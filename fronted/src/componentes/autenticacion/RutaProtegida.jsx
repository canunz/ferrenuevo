import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Cargando from '../comun/Cargando';

const RutaProtegida = ({ children, rolesPermitidos = [] }) => {
  const { autenticado, cargando, usuario } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Cargando mensaje="Verificando autenticación..." />
      </div>
    );
  }

  if (!autenticado) {
    // Guardar la ubicación a la que el usuario intentaba acceder
    return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
  }

  // Verificar roles si se especificaron
  if (rolesPermitidos.length > 0 && usuario?.rol) {
    const tienePermiso = rolesPermitidos.includes(usuario.rol.toLowerCase());
    if (!tienePermiso) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tienes permisos para acceder a esta página.
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default RutaProtegida;