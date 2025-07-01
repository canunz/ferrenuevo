// ==========================================
// ARCHIVO: frontend/src/paginas/PaginaTablero.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCartIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexto/ContextoAuth';
import { servicioDashboard } from '../servicios/servicioDashboard';
import { useSnackbar } from 'notistack';
import PanelCliente from '../componentes/tablero/PanelCliente';

const PaginaTablero = () => {
  const { usuario } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [fechaActual, setFechaActual] = useState(new Date());
  const [estadisticasPrincipales, setEstadisticasPrincipales] = useState([]);
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [productosPopulares, setProductosPopulares] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFechaActual(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [
          estadisticas,
          ventas,
          productos,
          alertasData
        ] = await Promise.all([
          servicioDashboard.obtenerEstadisticasPrincipales(),
          servicioDashboard.obtenerVentasRecientes(),
          servicioDashboard.obtenerProductosPopulares(),
          servicioDashboard.obtenerAlertas()
        ]);

        setEstadisticasPrincipales(estadisticas);
        setVentasRecientes(ventas);
        setProductosPopulares(productos);
        setAlertas(alertasData);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        enqueueSnackbar('Error al cargar los datos del dashboard', { variant: 'error' });
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [enqueueSnackbar]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const obtenerIconoTendencia = (tendencia) => {
    return tendencia === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const obtenerColorTendencia = (tendencia) => {
    return tendencia === 'up' ? 'text-green-600' : 'text-red-600';
  };

  if (usuario?.rol === 'cliente') {
    return <PanelCliente />;
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Dashboard */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
              <p className="text-gray-600">
                Bienvenido de vuelta, {usuario?.nombre || 'Administrador'} - {fechaActual.toLocaleDateString('es-CL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Sucursal</p>
                <p className="font-semibold text-gray-900">Santiago Centro</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Hora actual</p>
                <p className="font-semibold text-gray-900">
                  {fechaActual.toLocaleTimeString('es-CL')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.isArray(estadisticasPrincipales) && estadisticasPrincipales.length > 0 ? (
            estadisticasPrincipales.map((stat, index) => {
              const Icono = stat.icono;
              const IconoTendencia = obtenerIconoTendencia(stat.tendencia);
              
              return (
                <motion.div
                  key={stat.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.titulo}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.valor}
                      </p>
                      <div className="flex items-center mt-2">
                        <IconoTendencia className={`h-4 w-4 mr-1 ${obtenerColorTendencia(stat.tendencia)}`} />
                        <span className={`text-sm font-medium ${obtenerColorTendencia(stat.tendencia)}`}>
                          {stat.cambio}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">vs mes anterior</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                      <Icono className={`h-8 w-8 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">{stat.descripcion}</p>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-4 text-center text-gray-400 py-8">
              No hay estadísticas disponibles.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ventas Recientes */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Ventas Recientes</h3>
                  <BanknotesIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array.isArray(ventasRecientes) && ventasRecientes.length > 0 ? (
                    ventasRecientes.map((venta) => (
                      <div key={venta.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{venta.cliente}</p>
                          <p className="text-sm text-gray-600">
                            {venta.productos.join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatearPrecio(venta.total)}</p>
                          <p className="text-sm text-gray-500">{venta.hora}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">No hay ventas recientes.</div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver todas las ventas →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Productos Populares */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Productos Populares</h3>
                  <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Más vendidos este mes</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {Array.isArray(productosPopulares) && productosPopulares.length > 0 ? (
                    productosPopulares.map((producto, index) => (
                      <div key={producto.nombre}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {producto.nombre}
                          </h4>
                          <span className="text-sm text-blue-600 font-medium">
                            {producto.vendidos} vendidos
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">
                            Stock: {producto.stock}
                          </span>
                          <span className="text-xs text-gray-500">
                            {producto.progreso}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${producto.progreso}%` }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">No hay productos populares.</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alertas */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Alertas</h3>
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Array.isArray(alertas) && alertas.length > 0 ? (
                  alertas.map((alerta, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                      <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-900">{alerta.titulo}</p>
                        <p className="text-sm text-yellow-800">{alerta.descripcion}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">No hay alertas.</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Resumen de Operaciones Diarias */}
        {/* BLOQUE ELIMINADO: Inventario Crítico, Pedidos por Procesar y Metas del Mes */}

        {/* Accesos Rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Accesos Rápidos</h3>
              <p className="text-sm text-gray-600">Herramientas frecuentemente utilizadas</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-blue-800">Nuevo Producto</span>
                </button>
                
                <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                  <UsersIcon className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-green-800">Agregar Cliente</span>
                </button>
                
                <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group">
                  <BuildingStorefrontIcon className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-orange-800">Nuevo Proveedor</span>
                </button>
                
                <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                  <TruckIcon className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-purple-800">Generar Envío</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaginaTablero;