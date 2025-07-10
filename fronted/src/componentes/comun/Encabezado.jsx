// ==========================================
// ARCHIVO: frontend/src/componentes/comun/Encabezado.jsx
// ==========================================
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  PhoneIcon,
  MapPinIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexto/ContextoAuth';
import { useCarrito } from '../../contexto/ContextoCarrito';
import { useTema } from '../../contexto/ContextoTema';
import { useNotificacion } from '../../contexto/ContextoNotificacion';
import CarritoLateral from './CarritoLateral';

const Encabezado = () => {
  const { usuario, cerrarSesion } = useAuth();
  const { obtenerCantidadTotal } = useCarrito();
  const { tema, alternarTema } = useTema();
  const { mostrarNotificacion } = useNotificacion();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Manejar la función obtenerCantidadTotal de forma segura
  let cantidadCarrito = 0;
  try {
    cantidadCarrito = obtenerCantidadTotal ? obtenerCantidadTotal() : 0;
  } catch (error) {
    console.error('Error al obtener cantidad del carrito:', error);
    cantidadCarrito = 0;
  }

  const handleCerrarSesion = () => {
    cerrarSesion();
    mostrarNotificacion('Sesión cerrada exitosamente', 'success');
    navigate('/');
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      console.log('Buscando:', busqueda);
      // Aquí iría la lógica de búsqueda real
    }
  };

  const esRutaAdmin = location.pathname.startsWith('/tablero') || 
                     location.pathname === '/clientes' ||
                     location.pathname === '/productos' ||
                     location.pathname === '/inventario' ||
                     location.pathname === '/pedidos' ||
                     location.pathname === '/facturas' ||
                     location.pathname === '/pagos' ||
                     location.pathname === '/descuentos' ||
                     location.pathname === '/integraciones' ||
                     location.pathname === '/proveedores' ||
                     location.pathname === '/reportes';

  // Si estamos en rutas administrativas, no mostrar el encabezado público
  if (esRutaAdmin) {
    return null;
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        {/* Barra superior con información de contacto */}
        <div className="bg-blue-900 text-white text-sm">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  <span>(56) 2 2XXX XXXX</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>Santiago, Chile</span>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <span>Lunes a Viernes 8:00 - 18:00 hrs</span>
                <span>|</span>
                <span>Sábados 9:00 - 14:00 hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra principal */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-red-600">
                FERREMAS
              </div>
              <div className="ml-2 text-xs text-gray-600 hidden md:block">
                Desde 1980
              </div>
            </Link>

            {/* Barra de búsqueda - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleBuscar} className="w-full">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar herramientas, materiales..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </form>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center space-x-4">
              {/* Botón de tema */}
              <button
                onClick={alternarTema}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {tema === 'oscuro' ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>

              {/* Carrito */}
              <button
                onClick={() => setCarritoAbierto(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cantidadCarrito > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                  >
                    {cantidadCarrito}
                  </motion.span>
                )}
              </button>

              {/* Usuario */}
              {usuario ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden md:block text-sm font-medium">
                      {usuario.nombre}
                    </span>
                  </button>

                  <AnimatePresence>
                    {menuUsuarioAbierto && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
                      >
                        <Link
                          to="/tablero"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuUsuarioAbierto(false)}
                        >
                          Panel de Control
                        </Link>
                        <Link
                          to="/perfil"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuUsuarioAbierto(false)}
                        >
                          Mi Perfil
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleCerrarSesion}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Cerrar Sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/iniciar-sesion"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registrarse"
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Menú móvil */}
              <button
                onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {menuMovilAbierto ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Barra de búsqueda móvil */}
          <div className="lg:hidden mt-4">
            <form onSubmit={handleBuscar}>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="hidden lg:flex items-center space-x-8 py-3">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
              >
                Inicio
              </Link>
              <div className="relative group">
                <Link
                  to="/herramientas"
                  className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/herramientas') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
                >
                  Herramientas
                </Link>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                  <Link to="/herramientas/manuales" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Herramientas Manuales</Link>
                  <Link to="/herramientas/electricas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Herramientas Eléctricas</Link>
                </div>
              </div>
              <div className="relative group">
                <Link
                  to="/construccion"
                  className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/construccion') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
                >
                  Construcción
                </Link>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                  <Link to="/construccion/materiales" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Materiales de Construcción</Link>
                  <Link to="/construccion/pinturas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pinturas y Barnices</Link>
                </div>
              </div>
              <Link
                to="/seguridad"
                className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/seguridad') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
              >
                Seguridad
              </Link>
              <Link
                to="/ofertas"
                className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/ofertas') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
              >
                Ofertas
              </Link>
              <Link
                to="/contacto"
                className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/contacto') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
              >
                Contacto
              </Link>
            </div>

            {/* Menú móvil expandible */}
            <AnimatePresence>
              {menuMovilAbierto && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden border-t border-gray-200"
                >
                  <div className="py-4 space-y-4">
                    <Link
                      to="/"
                      className="block text-sm font-medium text-gray-700"
                      onClick={() => setMenuMovilAbierto(false)}
                    >
                      Inicio
                    </Link>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Herramientas</p>
                      <div className="ml-4 space-y-2">
                        <a
                          href="#herramientas-manuales"
                          className="block text-sm text-gray-700"
                          onClick={() => setMenuMovilAbierto(false)}
                        >
                          Herramientas Manuales
                        </a>
                        <a
                          href="#herramientas-electricas"
                          className="block text-sm text-gray-700"
                          onClick={() => setMenuMovilAbierto(false)}
                        >
                          Herramientas Eléctricas
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Construcción</p>
                      <div className="ml-4 space-y-2">
                        <a
                          href="#materiales-construccion"
                          className="block text-sm text-gray-700"
                          onClick={() => setMenuMovilAbierto(false)}
                        >
                          Materiales de Construcción
                        </a>
                        <a
                          href="#pinturas"
                          className="block text-sm text-gray-700"
                          onClick={() => setMenuMovilAbierto(false)}
                        >
                          Pinturas y Barnices
                        </a>
                      </div>
                    </div>
                    <a
                      href="#seguridad"
                      className="block text-sm font-medium text-gray-700"
                      onClick={() => setMenuMovilAbierto(false)}
                    >
                      Seguridad
                    </a>
                    <a
                      href="#ofertas"
                      className="block text-sm font-medium text-red-600"
                      onClick={() => setMenuMovilAbierto(false)}
                    >
                      Ofertas
                    </a>
                    <a
                      href="#contacto"
                      className="block text-sm font-medium text-gray-700"
                      onClick={() => setMenuMovilAbierto(false)}
                    >
                      Contacto
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>

      {/* Componente del Carrito */}
      <CarritoLateral 
        abierto={carritoAbierto} 
        onCerrar={() => setCarritoAbierto(false)} 
      />
    </>
  );
};

export default Encabezado;