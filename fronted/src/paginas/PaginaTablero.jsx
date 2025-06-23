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
          {estadisticasPrincipales.map((stat, index) => {
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
          })}
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
                  {ventasRecientes.map((venta) => (
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
                  ))}
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
                  {productosPopulares.map((producto, index) => (
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
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alertas y Notificaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Alertas y Notificaciones</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {alertas.map((alerta, index) => {
                  const Icono = alerta.icono;
                  const colorClases = {
                    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                    success: 'bg-green-50 border-green-200 text-green-800',
                    info: 'bg-blue-50 border-blue-200 text-blue-800'
                  };
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center p-4 rounded-lg border ${colorClases[alerta.tipo]}`}
                    >
                      <Icono className="h-5 w-5 mr-3 flex-shrink-0" />
                      <p className="text-sm font-medium">{alerta.mensaje}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resumen de Operaciones Diarias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Inventario Crítico */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Inventario Crítico</h3>
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Cemento Portland</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">5 unidades</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-yellow-800">Brocas HSS Set</span>
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">8 unidades</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-orange-800">Cables 2.5mm</span>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">12 unidades</span>
                </div>
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver inventario completo →
              </button>
            </div>
          </div>

          {/* Pedidos por Procesar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Pedidos por Procesar</h3>
                <ClockIcon className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-blue-800">Pedido #1247</span>
                    <p className="text-xs text-blue-600">Constructora ABC</p>
                  </div>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Urgente</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-green-800">Pedido #1248</span>
                    <p className="text-xs text-green-600">Ferretería Sur</p>
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Normal</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-800">Pedido #1249</span>
                    <p className="text-xs text-gray-600">Cliente Particular</p>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">Programado</span>
                </div>
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                Gestionar pedidos →
              </button>
            </div>
          </div>

          {/* Metas del Mes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Metas del Mes</h3>
                <ChartBarIcon className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Meta de Ventas */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Ventas</span>
                    <span className="text-sm text-gray-600">$18.5M / $25M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">74% completado</span>
                </div>

                {/* Meta de Clientes */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Nuevos Clientes</span>
                    <span className="text-sm text-gray-600">42 / 60</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">70% completado</span>
                </div>

                {/* Meta de Productos */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Productos Vendidos</span>
                    <span className="text-sm text-gray-600">1,247 / 1,500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">83% completado</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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