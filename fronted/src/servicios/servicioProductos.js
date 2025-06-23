import { productosAPI } from './api';

export const servicioProductos = {
  // Obtener todos los productos
  obtenerTodos: async (params = {}) => {
    try {
      const response = await productosAPI.obtenerTodos(params);
      return response;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  // Obtener producto por ID
  obtenerPorId: async (id) => {
    try {
      const response = await productosAPI.obtenerPorId(id);
      return response;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  // Crear nuevo producto
  crear: async (data) => {
    try {
      const response = await productosAPI.crear(data);
      return response;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  // Actualizar producto
  actualizar: async (id, data) => {
    try {
      const response = await productosAPI.actualizar(id, data);
      return response;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  // Eliminar producto
  eliminar: async (id) => {
    try {
      const response = await productosAPI.eliminar(id);
      return response;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  // Buscar productos
  buscar: async (query, filtros = {}) => {
    try {
      // Usar el endpoint de búsqueda del backend
      const params = { q: query, ...filtros };
      const response = await productosAPI.obtenerTodos(params);
      return response;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },

  // Obtener categorías
  obtenerCategorias: async () => {
    try {
      const response = await productosAPI.obtenerCategorias();
      return response;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  // Obtener marcas
  obtenerMarcas: async () => {
    try {
      const response = await productosAPI.obtenerMarcas();
      return response;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  },
};
