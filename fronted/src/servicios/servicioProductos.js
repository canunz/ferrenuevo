import api from './api';

export const servicioProductos = {
  // Obtener todos los productos
  obtenerTodos: async (params = {}) => {
    const response = await api.get('/productos', { params });
    return response.data;
  },

  // Obtener producto por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  // Crear nuevo producto
  crear: async (data) => {
    // Si data es FormData, no necesitamos configurar headers
    const config = data instanceof FormData ? {} : {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await api.post('/productos', data, config);
    return response.data;
  },

  // Actualizar producto
  actualizar: async (id, data) => {
    // Si data es FormData, no necesitamos configurar headers
    const config = data instanceof FormData ? {} : {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await api.put(`/productos/${id}`, data, config);
    return response.data;
  },

  // Eliminar producto
  eliminar: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },

  // Buscar productos
  buscar: async (query, filtros = {}) => {
    const params = { q: query, ...filtros };
    const response = await api.get('/productos/buscar', { params });
    return response.data;
  },

  // Obtener categorías
  obtenerCategorias: async () => {
    const response = await api.get('/productos/categorias');
    return response.data;
  },

  // Obtener marcas
  obtenerMarcas: async () => {
    const response = await api.get('/productos/marcas');
    return response.data;
  },
};
