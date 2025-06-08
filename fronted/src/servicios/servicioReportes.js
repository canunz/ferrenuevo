import api from './api';

export const servicioReportes = {
  // Dashboard principal
  obtenerDashboard: async (periodo = 'mes') => {
    const response = await api.get('/reportes/dashboard', { params: { periodo } });
    return response.data;
  },

  // Gráfico de ventas
  obtenerVentasChart: async (periodo = 'mes') => {
    const response = await api.get('/reportes/ventas', { params: { periodo } });
    return response.data;
  },

  // Productos más populares
  obtenerProductosPopulares: async (limite = 10) => {
    const response = await api.get('/reportes/productos-populares', { params: { limite } });
    return response.data;
  },

  // Alertas de stock
  obtenerAlertasStock: async () => {
    const response = await api.get('/inventario/alertas/stock-bajo');
    return response.data;
  },

  // Reporte de ventas detallado
  obtenerReporteVentas: async (fechaInicio, fechaFin) => {
    const response = await api.get('/reportes/ventas', {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
    });
    return response.data;
  },

  // Reporte de inventario
  obtenerReporteInventario: async () => {
    const response = await api.get('/reportes/inventario');
    return response.data;
  },

  // Reporte financiero
  obtenerReporteFinanciero: async (mes, año) => {
    const response = await api.get('/reportes/financiero', {
      params: { mes, año }
    });
    return response.data;
  },
};
