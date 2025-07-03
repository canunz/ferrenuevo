import api from './api';
import { obtenerClientesSinToken } from './api';

export const servicioClientes = {
  // Obtener todos los clientes
  obtenerTodos: async (params = {}) => {
    // Filtra los parámetros vacíos
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    );
    const response = await api.get('/clientes', { params: cleanParams });
    return response.data;
  },

  // Obtener cliente por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data.data;
  },

  // Crear nuevo cliente
  crear: async (data) => {
    const response = await api.post('/clientes', data);
    return response.data;
  },

  // Actualizar cliente
  actualizar: async (id, data) => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },

  // Eliminar cliente
  eliminar: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },

  // Buscar clientes
  buscar: async (query) => {
    const response = await api.get('/clientes/buscar', { params: { q: query } });
    return response.data;
  },

  // Obtener historial de pedidos del cliente
  obtenerHistorial: async (id) => {
    const response = await api.get(`/clientes/${id}/historial`);
    return response.data;
  },

  // Obtener dirección de envío de un cliente
  obtenerDireccionEnvio: async (id) => {
    const response = await api.get(`/clientes/${id}/direccion-envio`);
    return response.data.data;
  },

  // Actualizar o crear dirección de envío de un cliente
  actualizarDireccionEnvio: async (id, data) => {
    const response = await api.put(`/clientes/${id}/direccion-envio`, data);
    return response.data.data;
  },

  // Listar todos los clientes (para compatibilidad)
  listar: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  // Listar clientes sin token (para endpoints públicos)
  listarSinToken: async () => {
    return await obtenerClientesSinToken();
  }
};
