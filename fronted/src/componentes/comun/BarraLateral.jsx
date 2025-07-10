// ==========================================
// ARCHIVO: frontend/src/componentes/comun/BarraLateral.jsx
// ==========================================
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon, 
  WrenchScrewdriverIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CreditCardIcon,
  TagIcon,
  Cog8ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexto/ContextoAuth';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const BarraLateral = () => {
  const { usuario, cerrarSesion } = useAuth();
  const { mostrarNotificacion } = useNotificacion();
  const location = useLocation();
  const navigate = useNavigate();
  const [colapsada, setColapsada] = useState(false);

  const handleCerrarSesion = () => {
    cerrarSesion();
    mostrarNotificacion('Sesión cerrada exitosamente', 'success');
    navigate('/');
  };

  // Navegación principal del panel administrativo
  const navegacionPrincipal = [
    {
      nombre: 'Panel de Control',
      href: '/tablero',
      icono: HomeIcon,
      descripcion: 'Dashboard general'
    },
    {
      nombre: 'Clientes',
      href: '/clientes',
      icono: UsersIcon,
      descripcion: 'Gestión de clientes'
    },
    {
      nombre: 'Productos',
      href: '/admin/productos',
      icono: WrenchScrewdriverIcon,
      descripcion: 'Catálogo de herramientas'
    },
    {
      nombre: 'Inventario',
      href: '/inventario',
      icono: ArchiveBoxIcon,
      descripcion: 'Control de stock'
    }
  ];

  // Navegación de ventas y operaciones
  const navegacionVentas = [
    {
      nombre: 'Pedidos',
      href: '/pedidos',
      icono: ClipboardDocumentListIcon,
      descripcion: 'Gestión de pedidos'
    },
    {
      nombre: 'Pagos',
      href: '/pagos',
      icono: CreditCardIcon,
      descripcion: 'Gestión de pagos'
    },
    {
      nombre: 'Descuentos',
      href: '/descuentos',
      icono: TagIcon,
      descripcion: 'Promociones y descuentos'
    }
  ];

  // Navegación de sistema
  const navegacionSistema = [
    {
      nombre: 'Integraciones',
      href: '/integraciones',
      icono: Cog8ToothIcon,
      descripcion: 'APIs y webhooks'
    }
  ];

  const esRutaActiva = (ruta) => {
    return location.pathname === ruta;
  };

  if (usuario?.rol === 'cliente') {
    return (
      <motion.div className={`bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl border-r border-blue-700 flex-shrink-0 transition-all duration-300 ${colapsada ? 'w-16' : 'w-72'}`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-blue-700">
            <div className="flex items-center justify-between">
              {!colapsada && (
                <div>
                  <h1 className="text-2xl font-bold text-white">FERREMAS</h1>
                  <p className="text-blue-200 text-sm">Panel Cliente</p>
                </div>
              )}
              <button
                onClick={() => setColapsada(!colapsada)}
                className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
              >
                <motion.div
                  animate={{ rotate: colapsada ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </motion.div>
              </button>
            </div>
          </div>
          {!colapsada && (
            <div className="p-4 border-b border-blue-700">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {usuario?.nombre?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {usuario?.nombre || 'Cliente'}
                  </p>
                  <p className="text-blue-200 text-xs truncate">
                    Cliente
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-6 space-y-8">
              <ul className="space-y-2">
                <li>
                  <Link to="/perfil" className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/perfil' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}>
                    <UsersIcon className="h-5 w-5 mr-3" /> Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link to="/compras" className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/compras' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}>
                    <ShoppingCartIcon className="h-5 w-5 mr-3" /> Mis Compras
                  </Link>
                </li>
                <li>
                  <button onClick={handleCerrarSesion} className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-red-200 hover:bg-blue-700 hover:text-white w-full">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" /> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl border-r border-blue-700 flex-shrink-0 transition-all duration-300 ${
        colapsada ? 'w-16' : 'w-72'
      }`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        {/* Header del panel */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center justify-between">
            {!colapsada && (
              <div>
                <h1 className="text-2xl font-bold text-white">FERREMAS</h1>
                <p className="text-blue-200 text-sm">Panel Administrativo</p>
              </div>
            )}
            <button
              onClick={() => setColapsada(!colapsada)}
              className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
            >
              <motion.div
                animate={{ rotate: colapsada ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Información del usuario */}
        {!colapsada && (
          <div className="p-4 border-b border-blue-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {usuario?.nombre?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {usuario?.nombre || 'Administrador'}
                </p>
                <p className="text-blue-200 text-xs truncate">
                  {usuario?.rol || 'Administrador'} • {usuario?.sucursal || 'Santiago Centro'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navegación principal */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6 space-y-8">
            {/* Sección Principal */}
            <div>
              {!colapsada && (
                <h3 className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
                  Principal
                </h3>
              )}
              <ul className="space-y-2">
                {navegacionPrincipal.map((item) => {
                  const Icono = item.icono;
                  const activo = esRutaActiva(item.href);
                  
                  return (
                    <li key={item.nombre}>
                      <Link
                        to={item.href}
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activo
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                        }`}
                      >
                        <Icono 
                          className={`flex-shrink-0 h-5 w-5 ${
                            activo ? 'text-white' : 'text-blue-300 group-hover:text-white'
                          }`}
                        />
                        {!colapsada && (
                          <div className="ml-3">
                            <span className="truncate">{item.nombre}</span>
                            <p className="text-xs text-blue-200 group-hover:text-blue-100 mt-0.5">
                              {item.descripcion}
                            </p>
                          </div>
                        )}
                        {activo && (
                          <motion.div
                            className="ml-auto h-2 w-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Sección Ventas */}
            <div>
              {!colapsada && (
                <h3 className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
                  Ventas y Operaciones
                </h3>
              )}
              <ul className="space-y-2">
                {navegacionVentas.map((item) => {
                  const Icono = item.icono;
                  const activo = esRutaActiva(item.href);
                  
                  return (
                    <li key={item.nombre}>
                      <Link
                        to={item.href}
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activo
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                        }`}
                      >
                        <Icono 
                          className={`flex-shrink-0 h-5 w-5 ${
                            activo ? 'text-white' : 'text-blue-300 group-hover:text-white'
                          }`}
                        />
                        {!colapsada && (
                          <div className="ml-3">
                            <span className="truncate">{item.nombre}</span>
                            <p className="text-xs text-blue-200 group-hover:text-blue-100 mt-0.5">
                              {item.descripcion}
                            </p>
                          </div>
                        )}
                        {activo && (
                          <motion.div
                            className="ml-auto h-2 w-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Sección Sistema */}
            <div>
              {!colapsada && (
                <h3 className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
                  Sistema
                </h3>
              )}
              <ul className="space-y-2">
                {navegacionSistema.map((item) => {
                  const Icono = item.icono;
                  const activo = esRutaActiva(item.href);
                  
                  return (
                    <li key={item.nombre}>
                      <Link
                        to={item.href}
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activo
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                        }`}
                      >
                        <Icono 
                          className={`flex-shrink-0 h-5 w-5 ${
                            activo ? 'text-white' : 'text-blue-300 group-hover:text-white'
                          }`}
                        />
                        {!colapsada && (
                          <div className="ml-3">
                            <span className="truncate">{item.nombre}</span>
                            <p className="text-xs text-blue-200 group-hover:text-blue-100 mt-0.5">
                              {item.descripcion}
                            </p>
                          </div>
                        )}
                        {activo && (
                          <motion.div
                            className="ml-auto h-2 w-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        {/* Alertas rápidas */}
        {!colapsada && (
          <div className="p-4 border-t border-blue-700">
            <div className="space-y-3">
              {/* Se eliminó la información rápida */}
            </div>
          </div>
        )}

        {/* Footer con acciones */}
        <div className="p-4 border-t border-blue-700">
          <div className="space-y-2">
            {/* Botón de volver a la tienda */}
            <Link
              to="/"
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-100 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <TruckIcon className="h-4 w-4 mr-2" />
              {!colapsada && 'Ver Tienda'}
            </Link>
            
            {/* Botón de cerrar sesión */}
            <button
              onClick={handleCerrarSesion}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-200 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
              {!colapsada && 'Cerrar Sesión'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BarraLateral;