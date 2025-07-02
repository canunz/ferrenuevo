import { apiRequest } from './api';

export const servicioPagos = {
  // Crear preferencia de pago
  crearPreferencia: async (items, comprador) => {
    try {
      const response = await apiRequest('/pagos/crear-preferencia', {
        method: 'POST',
        body: { items, comprador }
      });
      return response;
    } catch (error) {
      console.error('Error al crear preferencia de pago:', error);
      throw error;
    }
  },

  // Procesar pago exitoso
  procesarPagoExitoso: async (paymentId, preferenceId) => {
    try {
      const response = await apiRequest('/pagos/procesar-exitoso', {
        method: 'POST',
        body: { paymentId, preferenceId }
      });
      return response;
    } catch (error) {
      console.error('Error al procesar pago exitoso:', error);
      throw error;
    }
  },

  // Procesar pago fallido
  procesarPagoFallido: async (paymentId, preferenceId, error) => {
    try {
      const response = await apiRequest('/pagos/procesar-fallido', {
        method: 'POST',
        body: { paymentId, preferenceId, error }
      });
      return response;
    } catch (error) {
      console.error('Error al procesar pago fallido:', error);
      throw error;
    }
  },

  // Transbank - Crear transacción
  crearTransaccionTransbank: async (datosTransaccion) => {
    try {
      const response = await apiRequest('/transbank/crear', {
        method: 'POST',
        body: datosTransaccion
      });
      return response;
    } catch (error) {
      console.error('Error al crear transacción Transbank:', error);
      throw error;
    }
  },

  // Transbank - Confirmar transacción
  confirmarTransaccionTransbank: async (token) => {
    try {
      const response = await apiRequest('/transbank/confirmar', {
        method: 'POST',
        body: { token_ws: token }
      });
      return response;
    } catch (error) {
      console.error('Error al confirmar transacción Transbank:', error);
      throw error;
    }
  },

  // Transbank - Obtener estado de transacción
  obtenerEstadoTransaccion: async (token) => {
    try {
      const response = await apiRequest(`/transbank/estado/${token}`);
      return response;
    } catch (error) {
      console.error('Error al obtener estado de transacción:', error);
      throw error;
    }
  },

  // Transbank - Reembolsar transacción
  reembolsarTransaccion: async (token, monto) => {
    try {
      const response = await apiRequest('/transbank/reembolsar', {
        method: 'POST',
        body: { token, monto }
      });
      return response;
    } catch (error) {
      console.error('Error al reembolsar transacción:', error);
      throw error;
    }
  },

  // Listar pagos (con filtros)
  listar: async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    return await apiRequest(`/pagos${params ? `?${params}` : ''}`);
  },

  // Aprobar pago en efectivo
  aprobar: async (pagoId) => {
    return await apiRequest(`/pagos/${pagoId}/estado`, {
      method: 'PUT',
      body: { estado: 'aprobado' }
    });
  }
};
