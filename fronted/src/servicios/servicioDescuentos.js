import api from './api';

export const servicioDescuentos = {
  obtenerTodos: () => api.get('/descuentos'),
  crear: (data) => api.post('/descuentos', data),
  actualizar: (id, data) => api.put(`/descuentos/${id}`, data),
  eliminar: (id) => api.delete(`/descuentos/${id}`),
  obtenerPorProducto: (producto_id) => api.get(`/descuentos/producto/${producto_id}`)
};
