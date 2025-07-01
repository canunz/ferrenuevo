import api from './api';

// Registrar ingreso de stock
export const registrarIngresoStock = (data) => api.post('/inventario/ingreso', data);

// Registrar ingreso de stock (versión de prueba sin autenticación)
export const registrarIngresoStockTest = (data) => api.post('/inventario/ingreso-test', data);

// Registrar egreso de stock
export const registrarEgresoStock = (data) => api.post('/inventario/egreso', data);

// Registrar ajuste de stock (opcional)
export const registrarAjusteStock = (data) => api.post('/inventario/ajuste', data);

// Obtener historial de movimientos de un producto
export const obtenerMovimientosProducto = (productoId) => api.get(`/inventario/movimientos/${productoId}`);

// Obtener TODOS los productos con inventario y ofertas
export const obtenerProductosCompletos = (filtros = {}) => {
  const params = new URLSearchParams();
  Object.keys(filtros).forEach(key => {
    if (filtros[key] !== undefined && filtros[key] !== null) {
      params.append(key, filtros[key]);
    }
  });
  
  return api.get(`/inventario/productos-completos${params.toString() ? `?${params.toString()}` : ''}`);
};

// Obtener estadísticas del inventario
export const obtenerEstadisticasInventario = () => api.get('/inventario/estadisticas');

// Obtener alertas de stock bajo
export const obtenerAlertasStock = () => api.get('/inventario/alertas');
