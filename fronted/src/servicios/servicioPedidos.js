import api from './api';

export const servicioPedidos = {
  // Obtener todos los pedidos
  obtenerTodos: async (params = {}) => {
    const response = await api.get('/pedidos', { params });
    return response.data;
  },

  // Obtener pedido por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  // Crear nuevo pedido
  crear: async (data) => {
    const response = await api.post('/pedidos', data);
    return response.data;
  },

  // Actualizar estado del pedido
  actualizarEstado: async (id, estado) => {
    const response = await api.put(`/pedidos/${id}/estado`, { estado });
    return response.data;
  },

  // Obtener estados disponibles
  obtenerEstados: async () => {
    return [
      { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
      { value: 'aprobado', label: 'Aprobado', color: 'blue' },
      { value: 'preparando', label: 'Preparando', color: 'orange' },
      { value: 'listo', label: 'Listo', color: 'purple' },
      { value: 'enviado', label: 'Enviado', color: 'indigo' },
      { value: 'entregado', label: 'Entregado', color: 'green' },
      { value: 'cancelado', label: 'Cancelado', color: 'red' },
    ];
  },
};