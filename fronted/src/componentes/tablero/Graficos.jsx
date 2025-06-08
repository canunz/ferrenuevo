// ==========================================
// ARCHIVO: frontend/src/componentes/tablero/PaginaTablero.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import TarjetaEstadistica from './TarjetaEstadistica';
import Cargando from '../comun/Cargando';

const PaginaTablero = () => {
  const [estadisticas, setEstadisticas] = useState({
    ventasHoy: 0,
    pedidosPendientes: 0,
    clientesActivos: 0,
    productosStock: 0,
    ventasMes: 0,
    crecimientoVentas: 0
  });
  const [cargando, setCargando] = useState(true);
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [productosPopulares, setProductosPopulares] = useState([]);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    // Simular carga de datos del dashboard
    const cargarDatos = async () => {
      setCargando(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Datos simulados
      setEstadisticas({
        ventasHoy: 1250000,
        pedidosPendientes: 23,
        clientesActivos: 156,
        productosStock: 2847,
        ventasMes: 45600000,
        crecimientoVentas: 12.5
      });

      setVentasRecientes([
        { id: 1, cliente: 'Constructora ABC', monto: 890000, fecha: '2025-06-06 14:30' },
        { id: 2, cliente: 'Ferretería Los Pinos', monto: 456000, fecha: '2025-06-06 13:15' },
        { id: 3, cliente: 'Obras y Construcción', monto: 1200000, fecha: '2025-06-06 12:45' },
        { id: 4, cliente: 'Taller Metálico Sur', monto: 350000, fecha: '2025-06-06 11:20' },
        { id: 5, cliente: 'Empresa Reparaciones', monto: 780000, fecha: '2025-06-06 10:30' }
      ]);

      setProductosPopulares([
        { id: 1, nombre: 'Tornillos Autorroscantes 3/8"', ventas: 156, stock: 2500 },
        { id: 2, nombre: 'Cemento Portland 25kg', ventas: 89, stock: 45 },
        { id: 3, nombre: 'Tuberías PVC 110mm', ventas: 67, stock: 120 },
        { id: 4, nombre: 'Pintura Látex Blanca 1L', ventas: 54, stock: 200 },
        { id: 5, nombre: 'Cables Eléctricos 2.5mm', ventas: 43, stock: 150 }
      ]);

      setAlertas([
        { id: 1, tipo: 'warning', mensaje: 'Stock bajo: Cemento Portland (45 unidades)', prioridad: 'alta' },
        { id: 2, tipo: 'info', mensaje: 'Nuevo pedido de Constructora ABC pendiente de aprobación', prioridad: 'media' },
        { id: 3, tipo: 'success', mensaje: 'Meta de ventas mensual alcanzada (105%)', prioridad: 'baja' },
        { id: 4, tipo: 'warning', mensaje: 'Factura #1234 vence mañana', prioridad: 'alta' }
      ]);

      setCargando(false);
    };

    cargarDatos();
  }, []);

  const iconosAlertas = {
    warning: ExclamationTriangleIcon,
    info: TrendingUpIcon,
    success: CheckCircleIcon,
    error: TrendingDownIcon
  };

  const coloresAlertas = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  if (cargando) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Cargando tamaño="lg" mensaje="Cargando datos del tablero..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tablero Principal
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vista general del estado de tu negocio
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TarjetaEstadistica
          titulo="Ventas Hoy"
          valor={estadisticas.ventasHoy}
          formato="moneda"
          cambio={8.2}
          icono={CurrencyDollarIcon}
          color="green"
          descripcion="Ingresos del día actual"
        />
        
        <TarjetaEstadistica
          titulo="Pedidos Pendientes"
          valor={estadisticas.pedidosPendientes}
          formato="numero"
          cambio={-2.1}
          icono={ShoppingCartIcon}
          color="orange"
          descripcion="Requieren atención"
        />
        
        <TarjetaEstadistica
          titulo="Clientes Activos"
          valor={estadisticas.clientesActivos}
          formato="numero"
          cambio={5.4}
          icono={UsersIcon}
          color="blue"
          descripcion="Clientes con compras recientes"
        />
        
        <TarjetaEstadistica
          titulo="Productos en Stock"
          valor={estadisticas.productosStock}
          formato="numero"
          cambio={1.8}
          icono={CubeIcon}
          color="purple"
          descripcion="Total de productos disponibles"
        />
      </div>

      {/* Sección Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Recientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ventas Recientes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Últimas transacciones del día
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {ventasRecientes.map((venta, index) => (
                <motion.div
                  key={venta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {venta.cliente}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {venta.fecha}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(venta.monto)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm font-medium">
                Ver todas las ventas →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Productos Populares */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Productos Populares
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Más vendidos este mes
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {productosPopulares.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {producto.nombre}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {producto.ventas} vendidos
                      </span>
                      <span className={`text-xs ${
                        producto.stock < 100 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        Stock: {producto.stock}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(producto.ventas / 156) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm font-medium">
                Ver catálogo completo →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alertas y Notificaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alertas y Notificaciones
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Elementos que requieren tu atención
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {alertas.map((alerta, index) => {
              const IconoAlerta = iconosAlertas[alerta.tipo];
              
              return (
                <motion.div
                  key={alerta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-start space-x-3 p-3 border rounded-lg ${coloresAlertas[alerta.tipo]}`}
                >
                  <IconoAlerta className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {alerta.mensaje}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      alerta.prioridad === 'alta' 
                        ? 'bg-red-100 text-red-800' 
                        : alerta.prioridad === 'media'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      Prioridad {alerta.prioridad}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Resumen Financiero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Ventas del Mes
            </h3>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0,
              }).format(estadisticas.ventasMes)}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUpIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">
                +{estadisticas.crecimientoVentas}% vs mes anterior
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="w-10 h-10" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaginaTablero;