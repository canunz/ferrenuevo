import api from './api';

export const servicioFacturas = {
  // Emitir una nueva factura
  emitirFactura: async (datos) => {
    try {
      const response = await api.post('/facturas/emitir', datos);
      return response.data;
    } catch (error) {
      console.error('Error al emitir factura:', error);
      throw error;
    }
  },

  // Obtener todas las facturas
  obtenerTodas: async (params = {}) => {
    try {
      const response = await api.get('/facturas', { params });
      // El backend devuelve { success, mensaje, data }
      // Necesitamos devolver la estructura completa para que el componente pueda acceder a data
      return response.data;
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      throw error;
    }
  },

  // Obtener factura por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/facturas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener factura:', error);
      throw error;
    }
  },

  // Actualizar estado de factura
  actualizarEstado: async (id, estado) => {
    try {
      const response = await api.put(`/facturas/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado de factura:', error);
      throw error;
    }
  },

  // Obtener estadísticas de facturas
  obtenerEstadisticas: async (params = {}) => {
    try {
      const response = await api.get('/facturas/estadisticas/general', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Obtener facturas por cliente
  obtenerPorCliente: async (clienteId) => {
    try {
      const response = await api.get('/facturas', { 
        params: { cliente_id: clienteId } 
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener facturas del cliente:', error);
      throw error;
    }
  },

  // Buscar facturas
  buscar: async (termino) => {
    try {
      const response = await api.get('/facturas', { 
        params: { q: termino } 
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar facturas:', error);
      throw error;
    }
  },

  // Exportar facturas
  exportar: async (filtros = {}) => {
    try {
      const response = await api.get('/facturas/exportar', { 
        params: filtros,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error al exportar facturas:', error);
      throw error;
    }
  },

  // Obtener estados disponibles
  obtenerEstados: () => {
    return [
      { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
      { value: 'pagada', label: 'Pagada', color: 'green' },
      { value: 'vencida', label: 'Vencida', color: 'red' },
      { value: 'cancelada', label: 'Cancelada', color: 'gray' }
    ];
  },

  // Formatear número de factura
  formatearNumero: (numero) => {
    return numero || 'N/A';
  },

  // Formatear fecha
  formatearFecha: (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CL');
  },

  // Formatear moneda
  formatearMoneda: (monto) => {
    if (!monto && monto !== 0) return 'N/A';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  }
};
