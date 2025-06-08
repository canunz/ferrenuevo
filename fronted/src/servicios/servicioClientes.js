import api from './api';

export const servicioClientes = {
  // Obtener todos los clientes
  obtenerTodos: async (params = {}) => {
    const response = await api.get('/clientes', { params });
    return response.data;
  },

  // Obtener cliente por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
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
};
